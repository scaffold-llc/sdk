// Writes src/generated from the platform repository's OpenAPI document and docs catalog, so it
// runs there, not in the public mirror: `npm run generate` in sdk/. CI fails when its output
// differs from what is committed.
import { readFileSync, writeFileSync } from "node:fs";
import openapiTS, { astToString } from "openapi-typescript";
import { foldDocs } from "../../web/scripts/fold-api-docs.mjs";

const platform = new URL("../../", import.meta.url);
const generated = new URL("../src/generated/", import.meta.url);
const read = (path) => JSON.parse(readFileSync(new URL(path, platform), "utf8"));
const spec = read("crates/server/openapi.json");
const catalog = read("web/src/site/docs/catalog.json");
const HEADER = "// Generated from crates/server/openapi.json and web/src/site/docs/catalog.json by npm run generate. Do not edit.\n";
// The names src/index.ts exports itself, which no API type may take.
const RUNTIME_NAMES = new Set(["Scaffold", "ScaffoldError", "ScaffoldOptions", "List", "WriteOptions", "AppServerOptions", "ErrorCode", "API_VERSION"]);
// The header an app user route takes when the app's own server may call it for its users.
const CLIENT_IP = "Scaffold-Client-Ip";

const write = (name, text) => writeFileSync(new URL(name, generated), foldDocs(HEADER + text));
const schemaAt = (ref) => spec.components.schemas[ref.split("/").pop()];

/** Whether a body must be sent: it has required fields, or a shape this can't see through. */
function needsBody(schema) {
  if (schema.$ref) return needsBody(schemaAt(schema.$ref));
  if (schema.anyOf || schema.oneOf) return true;
  if (schema.allOf) return schema.allOf.some(needsBody);
  return (schema.required ?? []).length > 0;
}

const operations = new Map();
for (const [path, item] of Object.entries(spec.paths)) {
  for (const [method, operation] of Object.entries(item)) {
    if (operation.operationId) operations.set(operation.operationId, { method: method.toUpperCase(), path, operation });
  }
}

/** One public command as a method: its route, input and answer types, and its doc line. */
function method(command) {
  const found = operations.get(command.name);
  if (!found) throw new Error(`${command.name} has no operation in openapi.json`);
  const { method, path, operation } = found;
  if (method !== command.method || path !== command.path) throw new Error(`${command.name} is ${command.method} ${command.path} in the catalog but ${method} ${path} in openapi.json`);
  const [, resource, action] = command.sdk.match(/^scaffold\.(\w+)\.(\w+)$/) ?? [];
  if (!resource) throw new Error(`${command.name} has the SDK name ${command.sdk}, not scaffold.<resource>.<action>`);

  const op = `operations["${command.name}"]`;
  const parameters = operation.parameters ?? [];
  const query = parameters.filter((parameter) => parameter.in === "query");
  const body = operation.requestBody;
  // A zip body is the one input field the path doesn't name, sent as raw bytes.
  const zip = body?.content["application/zip"] ? (command.fields ?? []).filter((field) => !parameters.some((parameter) => parameter.name === field.name)).map((field) => field.name) : undefined;
  if (zip && zip.length !== 1) throw new Error(`${command.name} takes a zip body but has ${zip.length} fields outside its path`);
  if (body && !zip && !body.content["application/json"]) throw new Error(`${command.name} takes a body that is neither JSON nor a zip`);
  if ((method === "GET" || method === "DELETE") && body) throw new Error(`${command.name} is a ${method} with a body`);
  if ((method === "POST" || method === "PATCH") && query.length) throw new Error(`${command.name} is a ${method} with query parameters`);

  const parts = [];
  if (parameters.some((parameter) => parameter.in === "path")) parts.push(`${op}["parameters"]["path"]`);
  if (query.length) parts.push(`NonNullable<${op}["parameters"]["query"]>`);
  if (zip) parts.push(`{ ${zip[0]}: Blob | ArrayBuffer | Uint8Array }`);
  else if (body) parts.push(`NonNullable<${op}["requestBody"]>["content"]["application/json"]`);
  const required = parameters.some((parameter) => parameter.in === "path" || parameter.required) || Boolean(body?.required && (zip || needsBody(body.content["application/json"].schema)));
  const input = parts.length ? parts.join(" & ") : "Record<string, never>";

  const [status, answered] = Object.entries(operation.responses).find(([code]) => code.startsWith("2")) ?? [];
  const json = answered?.content?.["application/json"]?.schema;
  // An unbuilt command documents no success, since it always answers 501.
  const answer = !answered ? "never" : !json ? "Blob" : `${op}["responses"][${status}]["content"]["application/json"]`;
  // Reads paged by `starting_after` and `limit` answer a page of `data` with its `next_cursor`.
  const fieldNames = (command.fields ?? []).map((field) => field.name);
  const list = Boolean(json) && command.read && fieldNames.includes("starting_after") && fieldNames.includes("limit");
  const idempotent = parameters.some((parameter) => parameter.in === "header" && parameter.name === "Idempotency-Key");
  const appServer = parameters.some((parameter) => parameter.in === "header" && parameter.name === CLIENT_IP);

  const unbuilt = command.implemented ? "" : " Not built yet, so it answers 501 `not_implemented`.";
  const doc = `${command.description}${unbuilt} \`${method} ${path}\``;
  if (doc.includes("*/")) throw new Error(`${command.name}'s description would end its doc comment`);
  const args = [`input${required ? "" : "?"}: ${input}`, ...(idempotent ? ["options?: WriteOptions"] : appServer ? ["options?: AppServerOptions"] : [])].join(", ");
  return {
    resource,
    action,
    route: `{ method: "${method}", path: "${path}"${list ? ", list: true" : ""}${zip ? `, zip: "${zip[0]}"` : ""}${idempotent ? ", idempotent: true" : ""}${appServer ? ", appServer: true" : ""} }`,
    signature: `    /** ${doc} */\n    ${action}(${args}): ${list ? `List<${answer}, ${answer}["data"][number]>` : `Promise<${answer}>`};`,
  };
}

/** Whether the app's own server calls `command` for its users: an app user route that takes their address and no user's token. */
function forAppServers(command) {
  if (command.audience !== "app_user") return false;
  const { operation } = operations.get(command.name) ?? {};
  const takesAddress = (operation?.parameters ?? []).some((parameter) => parameter.in === "header" && parameter.name === CLIENT_IP);
  return takesAddress && !(operation.security ?? []).some((scheme) => "appUserAuth" in scheme);
}

const resources = new Map();
for (const command of catalog.commands.filter((command) => command.audience === "everyone" || forAppServers(command))) {
  const built = method(command);
  if (!resources.has(built.resource)) resources.set(built.resource, []);
  resources.get(built.resource).push(built);
}

const codes = [...new Set(catalog.errors.map((error) => error.type))];
write(
  "methods.ts",
  `import type { AppServerOptions, List, Route, WriteOptions } from "../client.js";
import type { operations } from "./openapi.js";

/** Every \`code\` a failed call can answer with. */
export type ErrorCode = ${codes.map((code) => JSON.stringify(code)).join(" | ")};

/** Each public command's route, by resource and action. */
export const COMMANDS = {
${[...resources].map(([resource, methods]) => `  ${resource}: {\n${methods.map((built) => `    ${built.action}: ${built.route},`).join("\n")}\n  },`).join("\n")}
} as const satisfies Record<string, Record<string, Route>>;

/** The client's methods: \`scaffold.<resource>.<action>()\` for each public command. */
export interface Methods {
${[...resources].map(([resource, methods]) => `  ${resource}: {\n${methods.map((built) => built.signature).join("\n")}\n  };`).join("\n")}
}
`,
);

const names = Object.keys(spec.components.schemas);
const taken = names.filter((name) => RUNTIME_NAMES.has(name) || !/^[A-Za-z_]\w*$/.test(name));
if (taken.length) throw new Error(`openapi.json schemas ${taken.join(", ")} can't be exported under their own names`);
write("types.ts", `import type { components } from "./openapi.js";\n\n${names.map((name) => `export type ${name} = components["schemas"]["${name}"];`).join("\n")}\n`);

// A field with a default may be left out of an input, which the generator otherwise requires.
write("openapi.ts", astToString(await openapiTS(spec, { defaultNonNullable: false })));
