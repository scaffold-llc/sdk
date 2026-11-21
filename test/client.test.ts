import { existsSync, readFileSync } from "node:fs";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { createServer, type IncomingHttpHeaders, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { Scaffold, ScaffoldError } from "../src/index.js";

interface Sent {
  method: string;
  url: URL;
  headers: Headers;
  body: unknown;
}

let sent: Sent[];
let answers: Response[];

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", ...headers } });
const failed = (status: number, type: string, headers: Record<string, string> = {}, param?: string) =>
  json({ error: { type, message: `${type} happened`, param, request_id: "err_01jbz6f7h9k1m3n5q7s9t1v3w5", doc: "https://scaffold.llc/docs/errors#types" } }, status, headers);

beforeEach(() => {
  sent = [];
  answers = [];
  vi.stubGlobal("fetch", async (url: URL, init: RequestInit) => {
    sent.push({ method: init.method!, url: new URL(url), headers: new Headers(init.headers), body: typeof init.body === "string" ? JSON.parse(init.body) : init.body });
    return answers.shift() ?? json({});
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("calling a command", () => {
  test("sends a write's input as its JSON body and answers its JSON", async () => {
    answers.push(json({ id: "tsk_1", key: "LAR-212" }));
    const task = await new Scaffold({ token: "scf_live_a" }).task.create({ workspace_id: "wsp_1", title: "Ship it", labels: ["launch"] });
    expect(task).toEqual({ id: "tsk_1", key: "LAR-212" });
    expect(sent[0]).toMatchObject({ method: "POST", body: { workspace_id: "wsp_1", title: "Ship it", labels: ["launch"] } });
    expect(sent[0]!.url.href).toBe("https://scaffold.llc/v1/tasks");
    expect(sent[0]!.headers.get("Content-Type")).toBe("application/json");
  });

  test("puts path fields in the path and the rest in the body", async () => {
    await new Scaffold({ token: "scf_live_a" }).task.move({ task_id: "tsk_1", column: "review" });
    expect(sent[0]!.method).toBe("POST");
    expect(sent[0]!.url.pathname).toBe("/v1/tasks/tsk_1/move");
    expect(sent[0]!.body).toEqual({ column: "review" });
  });

  test("puts an upload's zip as the raw body, not base64 in JSON", async () => {
    const zip = new Uint8Array([0x50, 0x4b, 0x05, 0x06]);
    answers.push(json({ sha256: "ab12", size_bytes: 4 }));
    const upload = await new Scaffold({ token: "scf_live_a" }).source.upload({ project_id: "prj_1", archive: zip });
    expect(upload).toMatchObject({ sha256: "ab12" });
    expect(sent[0]!.method).toBe("PUT");
    expect(sent[0]!.url.pathname).toBe("/v1/projects/prj_1/sources");
    expect(sent[0]!.headers.get("Content-Type")).toBe("application/zip");
    expect(sent[0]!.body).toBe(zip);
  });

  test("uploads a folder's text files by path, leaving out node_modules and dot folders", async () => {
    const dir = await mkdtemp(join(tmpdir(), "scaffold-sdk-"));
    try {
      const files = { "package.json": '{ "main": "server.js" }', "server.js": "listen()", "src/routes/home.js": "export default 1;", ".env.example": "PORT=", "node_modules/a/index.js": "a", ".git/HEAD": "ref", "src/.cache/x.js": "x" };
      for (const [path, text] of Object.entries(files)) {
        await mkdir(dirname(join(dir, path)), { recursive: true });
        await writeFile(join(dir, path), text);
      }
      answers.push(json({ sha256: "ab12" }));
      await new Scaffold({ token: "scf_live_a" }).source.upload({ project_id: "prj_1", dir }, { idempotencyKey: "upload-1" });
      expect(sent).toHaveLength(1);
      expect(`${sent[0]!.method} ${sent[0]!.url.pathname}`).toBe("POST /v1/projects/prj_1/sources/files");
      expect(sent[0]!.headers.get("Idempotency-Key")).toBe("upload-1");
      expect(sent[0]!.body).toEqual({ files: { "package.json": '{ "main": "server.js" }', "server.js": "listen()", "src/routes/home.js": "export default 1;", ".env.example": "PORT=" } });
    } finally {
      await rm(dir, { recursive: true });
    }
  });

  test("refuses a folder holding a file that is not text, naming it, before sending anything", async () => {
    const dir = await mkdtemp(join(tmpdir(), "scaffold-sdk-"));
    try {
      await mkdir(join(dir, "public"));
      await writeFile(join(dir, "index.html"), "<h1>Pinecrest</h1>");
      await writeFile(join(dir, "public", "logo.png"), new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0xff]));
      await expect(new Scaffold({ token: "scf_live_a" }).source.upload({ project_id: "prj_1", dir })).rejects.toThrow(/public\/logo\.png.*archive/);
      expect(sent).toEqual([]);
    } finally {
      await rm(dir, { recursive: true });
    }
  });

  test("sends each file's text exactly, a leading byte order mark and a root file named __proto__ included", async () => {
    const dir = await mkdtemp(join(tmpdir(), "scaffold-sdk-"));
    try {
      await writeFile(join(dir, "index.html"), "﻿<h1>Café</h1>");
      await writeFile(join(dir, "__proto__"), "kept");
      await new Scaffold({ token: "scf_live_a" }).source.upload({ project_id: "prj_1", dir });
      const files = (sent[0]!.body as { files: Record<string, string> }).files;
      expect(Object.keys(files).sort()).toEqual(["__proto__", "index.html"]);
      expect(files["index.html"]).toBe("﻿<h1>Café</h1>");
    } finally {
      await rm(dir, { recursive: true });
    }
  });

  test("leaves out a linked node_modules and refuses a linked file by name, before sending anything", async () => {
    const dir = await mkdtemp(join(tmpdir(), "scaffold-sdk-"));
    const outside = await mkdtemp(join(tmpdir(), "scaffold-sdk-outside-"));
    try {
      await writeFile(join(dir, "index.html"), "<h1>Pinecrest</h1>");
      await writeFile(join(outside, "secret.txt"), "not for the app");
      await symlink(outside, join(dir, "node_modules"), "junction");
      await new Scaffold({ token: "scf_live_a" }).source.upload({ project_id: "prj_1", dir });
      expect(sent[0]!.body).toEqual({ files: { "index.html": "<h1>Pinecrest</h1>" } });

      sent = [];
      await symlink(join(outside, "secret.txt"), join(dir, "secret.txt"), "file");
      await expect(new Scaffold({ token: "scf_live_a" }).source.upload({ project_id: "prj_1", dir })).rejects.toThrow(/secret\.txt is a link/);
      expect(sent).toEqual([]);
    } finally {
      await rm(dir, { recursive: true });
      await rm(outside, { recursive: true });
    }
  });

  test("refuses a folder whose files as JSON are over one request's limit, before sending anything", async () => {
    const dir = await mkdtemp(join(tmpdir(), "scaffold-sdk-"));
    try {
      // 12 MB of a control character, written as six characters each in JSON: about 72 MB.
      await writeFile(join(dir, "data.txt"), new Uint8Array(12 * 1024 * 1024).fill(1));
      await expect(new Scaffold({ token: "scf_live_a" }).source.upload({ project_id: "prj_1", dir })).rejects.toThrow(/67 MB as JSON.*archive/);
      expect(sent).toEqual([]);
    } finally {
      await rm(dir, { recursive: true });
    }
  });

  test("sends a read's input as its query and a delete's path field in its path", async () => {
    const scaffold = new Scaffold({ token: "scf_live_a", baseUrl: "http://localhost:8080/" });
    await scaffold.project.list({ workspace_id: "wsp_1" });
    await scaffold.token.revoke({ token_id: "tok_1" });
    expect(sent.map(({ method, url }) => `${method} ${url.href}`)).toEqual(["GET http://localhost:8080/v1/projects?workspace_id=wsp_1", "DELETE http://localhost:8080/v1/tokens/tok_1"]);
    expect(sent.map(({ body }) => body)).toEqual([undefined, undefined]);
  });

  test("sends the token as a bearer token, from SCAFFOLD_TOKEN when left out", async () => {
    vi.stubEnv("SCAFFOLD_TOKEN", "scf_live_env");
    await new Scaffold({ token: "scf_live_given" }).account.get();
    await new Scaffold().account.get();
    expect(sent.map(({ headers }) => headers.get("Authorization"))).toEqual(["Bearer scf_live_given", "Bearer scf_live_env"]);
  });

  test("pins the SDK's API version unless given another", async () => {
    await new Scaffold({ token: "scf_live_a" }).account.get();
    await new Scaffold({ token: "scf_live_a", version: "2026-09-01" }).account.get();
    expect(sent.map(({ headers }) => headers.get("Scaffold-Version"))).toEqual(["2026-10-01", "2026-09-01"]);
  });

  test("sends a write's idempotency key, or one of its own, and none with a read", async () => {
    const scaffold = new Scaffold({ token: "scf_live_a" });
    await scaffold.task.create({ workspace_id: "wsp_1", title: "Ship it" }, { idempotencyKey: "launch-2026-10-29" });
    await scaffold.task.create({ workspace_id: "wsp_1", title: "Ship it" });
    await scaffold.task.create({ workspace_id: "wsp_1", title: "Ship it" });
    await scaffold.account.get();
    const [given, own, another, read] = sent.map(({ headers }) => headers.get("Idempotency-Key"));
    expect(given).toBe("launch-2026-10-29");
    expect(own).toMatch(/^[0-9a-f-]{36}$/);
    expect(another).not.toBe(own);
    expect(read).toBeNull();
  });
});

describe("signing an app's users in from its server", () => {
  test("sends the app secret, from SCAFFOLD_AUTH_SECRET when left out, and the user's address instead of the token", async () => {
    vi.stubEnv("SCAFFOLD_AUTH_SECRET", "sas_env");
    await new Scaffold({ token: "scf_live_a", appSecret: "sas_given" }).app_auth.sign_in({ project_id: "prj_1", email: "grace@example.com", password: "a long passphrase" }, { clientIp: "203.0.113.7" });
    await new Scaffold({ token: "scf_live_a" }).app_auth.email_send({ project_id: "prj_1", email: "grace@example.com", purpose: "magic_link" });
    const headers = (name: string) => sent.map((call) => call.headers.get(name));
    expect(sent.map(({ method, url }) => `${method} ${url.pathname}`)).toEqual(["POST /v1/projects/prj_1/auth/sign-in", "POST /v1/projects/prj_1/auth/email"]);
    expect(headers("Scaffold-App-Secret")).toEqual(["sas_given", "sas_env"]);
    expect(headers("Scaffold-Client-Ip")).toEqual(["203.0.113.7", null]);
    expect(headers("Authorization")).toEqual([null, null]);
  });

  test("refuses a user's address without the secret, before sending anything", async () => {
    const scaffold = new Scaffold({ token: "scf_live_a" });
    await expect(scaffold.app_auth.sign_up({ project_id: "prj_1", email: "grace@example.com", password: "a long passphrase" }, { clientIp: "203.0.113.7" })).rejects.toThrow(TypeError);
    expect(sent).toEqual([]);
  });
});

describe("where secrets go", () => {
  const listen = async (server: Server) => {
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    return `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  };

  test("a redirect to another origin never receives the app secret or the token", async () => {
    vi.unstubAllGlobals();
    const received: IncomingHttpHeaders[] = [];
    const other = createServer((request, response) => {
      received.push(request.headers);
      response.end("{}");
    });
    const otherUrl = await listen(other);
    const redirecting = createServer((request, response) => {
      response.writeHead(307, { Location: `${otherUrl}${request.url}` });
      response.end();
    });
    const baseUrl = await listen(redirecting);
    try {
      const scaffold = new Scaffold({ token: "scf_live_a", appSecret: "sas_given", baseUrl, maxRetries: 0 });
      await expect(scaffold.app_auth.sign_in({ project_id: "prj_1", email: "grace@example.com", password: "a long passphrase" })).rejects.toMatchObject({ status: 307, type: "unexpected_response" });
      await expect(scaffold.account.get()).rejects.toMatchObject({ status: 307 });
      expect(received).toEqual([]);
    } finally {
      redirecting.close();
      other.close();
    }
  });

  test("a base URL other than https is refused, except on this machine", () => {
    for (const baseUrl of ["http://scaffold.llc", "ftp://scaffold.llc", "file:///tmp", "not a url"]) {
      expect(() => new Scaffold({ token: "scf_live_a", baseUrl })).toThrow(TypeError);
    }
    for (const baseUrl of ["https://scaffold.llc", "http://localhost:8080", "http://127.0.0.1:8080/", "http://[::1]:8080"]) {
      expect(() => new Scaffold({ token: "scf_live_a", baseUrl })).not.toThrow();
    }
  });

  test("a path field of . or .. is refused before anything is sent, so it cannot change the route", async () => {
    const scaffold = new Scaffold({ token: "scf_live_a" });
    for (const value of [".", ".."]) {
      await expect(scaffold.workspace.member_remove({ workspace_id: "wsp_1", person_id: value })).rejects.toThrow(TypeError);
    }
    expect(sent).toEqual([]);
    await scaffold.workspace.member_remove({ workspace_id: "wsp_1", person_id: "..x" });
    expect(sent[0]!.url.pathname).toBe("/v1/workspaces/wsp_1/members/..x");
  });
});

describe("errors", () => {
  test("a failed call throws a ScaffoldError with the HTTP error's type", async () => {
    answers.push(failed(402, "credits_exhausted"));
    const error = await new Scaffold({ token: "scf_live_a" }).run.create({ workspace_id: "wsp_1", agent: "planner", prompt: "Plan next week" }).catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ScaffoldError);
    expect(error).toMatchObject({ status: 402, type: "credits_exhausted", message: "credits_exhausted happened", requestId: "err_01jbz6f7h9k1m3n5q7s9t1v3w5", doc: "https://scaffold.llc/docs/errors#types" });
  });

  test("a 401 to a call sent with no token says how to give one", async () => {
    vi.stubEnv("SCAFFOLD_TOKEN", undefined);
    answers.push(failed(401, "unauthorized"), failed(401, "unauthorized"));
    await expect(new Scaffold().task.list({ workspace_id: "ws_1" })).rejects.toMatchObject({ status: 401, type: "unauthorized", message: expect.stringContaining("SCAFFOLD_TOKEN") });
    await expect(new Scaffold({ token: "scf_live_revoked" }).task.list({ workspace_id: "ws_1" })).rejects.toMatchObject({ message: "unauthorized happened" });
  });

  test("a lost connection throws a network ScaffoldError, after maxRetries for a read and at once for a write a retry could run twice", async () => {
    vi.stubGlobal("fetch", async (url: URL, init: RequestInit) => {
      sent.push({ method: init.method!, url: new URL(url), headers: new Headers(init.headers), body: init.body });
      throw new TypeError("fetch failed", { cause: new Error("connect ECONNREFUSED 127.0.0.1:443") });
    });
    const scaffold = new Scaffold({ token: "scf_live_a", maxRetries: 1 });
    const error = await scaffold.account.get().catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ScaffoldError);
    expect(error).toMatchObject({ status: 0, type: "network", message: expect.stringContaining("ECONNREFUSED") });
    expect(sent).toHaveLength(2);

    sent = [];
    await expect(scaffold.env.set({ project_id: "prj_1", name: "A", value: "b" })).rejects.toMatchObject({ type: "network" });
    expect(sent).toHaveLength(1);
  });

  test("no answer within timeout throws a timeout ScaffoldError", async () => {
    vi.stubGlobal("fetch", (_url: URL, init: RequestInit) => new Promise((_resolve, reject) => init.signal!.addEventListener("abort", () => reject(init.signal!.reason))));
    const error = await new Scaffold({ token: "scf_live_a", timeout: 10, maxRetries: 0 }).account.get().catch((caught: unknown) => caught);
    expect(error).toBeInstanceOf(ScaffoldError);
    expect(error).toMatchObject({ status: 0, type: "timeout", message: expect.stringContaining("10 ms") });
  });

  test("a validation failure names the field at fault", async () => {
    answers.push(failed(422, "validation_failed", {}, "title"));
    await expect(new Scaffold({ token: "scf_live_a" }).task.create({ workspace_id: "wsp_1", title: "" })).rejects.toMatchObject({ type: "validation_failed", param: "title" });
  });

  test("an answer that isn't Scaffold's error body throws unexpected_response", async () => {
    answers.push(new Response("<html>Bad gateway</html>", { status: 502 }));
    await expect(new Scaffold({ token: "scf_live_a", maxRetries: 0 }).account.get()).rejects.toMatchObject({ status: 502, type: "unexpected_response" });
  });

  test("rate limits and unavailable answers are retried after Retry-After, up to maxRetries", async () => {
    answers.push(failed(429, "rate_limited", { "Retry-After": "0" }), failed(503, "unavailable", { "Retry-After": "0" }), json({ id: "acc_1" }));
    await expect(new Scaffold({ token: "scf_live_a" }).account.get()).resolves.toEqual({ id: "acc_1" });
    expect(sent).toHaveLength(3);

    answers = [failed(429, "rate_limited", { "Retry-After": "0" })];
    await expect(new Scaffold({ token: "scf_live_a", maxRetries: 0 }).account.get()).rejects.toMatchObject({ type: "rate_limited", retryAfter: 0 });
  });

  test("a 500 is retried for a read and for a write under its key, which the retry sends again", async () => {
    answers.push(failed(500, "internal", { "Retry-After": "0" }), json({ id: "acc_1" }));
    await expect(new Scaffold({ token: "scf_live_a" }).account.get()).resolves.toEqual({ id: "acc_1" });
    answers.push(failed(500, "internal", { "Retry-After": "0" }), json({ id: "tsk_1" }));
    await new Scaffold({ token: "scf_live_a" }).task.create({ workspace_id: "wsp_1", title: "Ship it" });
    const [, , first, retry] = sent.map(({ headers }) => headers.get("Idempotency-Key"));
    expect(sent).toHaveLength(4);
    expect(retry).toBe(first);
  });

  test("a retried write sends the same body under the same key, so the server replays it rather than refusing a reused key", async () => {
    answers.push(failed(502, "internal", { "Retry-After": "0" }), failed(500, "internal", { "Retry-After": "0" }), json({ id: "msg_1" }));
    const input = { project_id: "prj_1", to: "grace@example.com", subject: "Booked", body: "See you Friday." };
    await new Scaffold({ token: "scf_live_a" }).email.send(input, { idempotencyKey: "order-7" });
    expect(sent).toHaveLength(3);
    for (const retry of sent) {
      expect(retry.headers.get("Idempotency-Key")).toBe("order-7");
      expect(retry.body).toEqual({ to: "grace@example.com", subject: "Booked", body: "See you Friday." });
    }
  });

  test("a 500 is not retried for a write a retry could run twice", async () => {
    answers.push(failed(500, "internal", { "Retry-After": "0" }));
    await expect(new Scaffold({ token: "scf_live_a" }).env.set({ project_id: "prj_1", name: "A", value: "b" })).rejects.toMatchObject({ type: "internal" });
    expect(sent).toHaveLength(1);
    expect(sent[0]!.headers.get("Idempotency-Key")).toBeNull();
  });

  test("a 501 is not retried, as a provider that is not set up stays so", async () => {
    answers.push(failed(501, "not_configured", { "Retry-After": "0" }));
    await expect(new Scaffold({ token: "scf_live_a" }).account.get()).rejects.toMatchObject({ status: 501, type: "not_configured" });
    expect(sent).toHaveLength(1);
  });

  test("other failures are not retried", async () => {
    answers.push(failed(409, "stale_version"));
    await expect(new Scaffold({ token: "scf_live_a" }).account.get()).rejects.toMatchObject({ type: "stale_version" });
    expect(sent).toHaveLength(1);
  });
});

describe("lists", () => {
  test("awaiting a list answers one page", async () => {
    answers.push(json({ data: [{ id: "tsk_1" }], has_more: true, next_cursor: "tsk_1" }));
    const page = await new Scaffold({ token: "scf_live_a" }).task.list({ workspace_id: "wsp_1", limit: 1 });
    expect(page).toEqual({ data: [{ id: "tsk_1" }], has_more: true, next_cursor: "tsk_1" });
    expect(sent).toHaveLength(1);
  });

  test("for await walks every page by its next cursor", async () => {
    answers.push(json({ data: [{ id: "tsk_1" }, { id: "tsk_2" }], has_more: true, next_cursor: "tsk_2" }), json({ data: [{ id: "tsk_3" }], has_more: false, next_cursor: null }));
    const seen: string[] = [];
    for await (const task of new Scaffold({ token: "scf_live_a" }).task.list({ workspace_id: "wsp_1", status: "doing" })) seen.push(task.id);
    expect(seen).toEqual(["tsk_1", "tsk_2", "tsk_3"]);
    expect(sent.map(({ url }) => url.search)).toEqual(["?workspace_id=wsp_1&status=doing", "?workspace_id=wsp_1&status=doing&starting_after=tsk_2"]);
  });

  test("a list sent as a POST pages through its body", async () => {
    answers.push(json({ data: [{ id: "rec_1" }], has_more: true, next_cursor: "rec_1" }), json({ data: [{ id: "rec_2" }], has_more: false, next_cursor: null }));
    const seen: string[] = [];
    for await (const record of new Scaffold({ token: "scf_live_a" }).record.query({ database_id: "dbs_1" })) seen.push(record.id);
    expect(seen).toEqual(["rec_1", "rec_2"]);
    expect(sent.map(({ method, url, body }) => [method, url.pathname, body])).toEqual([
      ["POST", "/v1/databases/dbs_1/query", {}],
      ["POST", "/v1/databases/dbs_1/query", { starting_after: "rec_1" }],
    ]);
  });
});

// The docs catalog lives in the platform repository, so the public mirror skips this.
const catalogPath = new URL("../../web/src/site/docs/catalog.json", import.meta.url);
interface CatalogCommand {
  name: string;
  audience: string;
  method: string;
  path: string;
  sdk: string;
}

test.skipIf(!existsSync(catalogPath))("every public command is a method that calls its route", async () => {
  const { commands } = JSON.parse(readFileSync(catalogPath, "utf8")) as { commands: CatalogCommand[] };
  const scaffold = new Scaffold({ token: "scf_live_a" }) as unknown as Record<string, Record<string, (input: Record<string, string>) => PromiseLike<unknown>>>;
  const published = commands.filter((command) => command.audience === "everyone");
  expect(published.length).toBeGreaterThan(100);
  for (const command of published) {
    const [, resource, action] = command.sdk.split(".");
    const input = Object.fromEntries([...command.path.matchAll(/\{(\w+)\}/g)].map(([, name]) => [name!, `${name}_1`]));
    sent = [];
    await scaffold[resource!]![action!]!(input);
    expect(`${sent[0]!.method} ${sent[0]!.url.pathname}`, command.sdk).toBe(`${command.method} ${command.path.replace(/\{(\w+)\}/g, "$1_1")}`);
  }
});

test("the README's quickstart is the example that typechecks", () => {
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  expect(readme).toContain(readFileSync(new URL("../examples/quickstart.ts", import.meta.url), "utf8"));
});
