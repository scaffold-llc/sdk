# @scaffold-llc/sdk

The TypeScript SDK for [Scaffold](https://scaffold.llc). Every command your assistant can run over MCP is a typed method here and an HTTP route, generated from one command list. No runtime dependencies; it needs Node 20 or later, or any runtime with `fetch`.

```bash
npm install @scaffold-llc/sdk
```

## Quickstart

About five minutes, from an empty folder to a task on your board and a new project with its first deploy live. Deploys need the Paid plan.

### 1. Create a token

In Scaffold, create a token with Write access under Settings, then Apps and tokens, and copy the workspace id beside it. The token is shown once, so save both to your environment now.

```bash
export SCAFFOLD_TOKEN=scf_live_...
export SCAFFOLD_WORKSPACE=wsp_...
```

### 2. Zip the app

A deploy runs a Node app with a `package.json` at the root of its zip, started by its `start` script or its `main` file, and goes live once it accepts connections on `PORT` within 30 seconds. In an empty folder, this makes one:

```bash
mkdir app
echo '{ "main": "server.js" }' > app/package.json
echo 'require("node:http").createServer((req, res) => res.end("Pinecrest")).listen(process.env.PORT);' > app/server.js
(cd app && zip -r ../pinecrest-web.zip .)
```

### 3. Write the script

In the same folder, run `npm install @scaffold-llc/sdk` and save this as `ship.mts`:

```ts
import { readFile } from "node:fs/promises";
import { setTimeout as sleep } from "node:timers/promises";
import { Scaffold } from "@scaffold-llc/sdk";

// Reads SCAFFOLD_TOKEN from the environment
const scaffold = new Scaffold();
const workspace_id = process.env.SCAFFOLD_WORKSPACE!;

// Plan: put the work on the board
const task = await scaffold.task.create({
  workspace_id,
  title: "Ship the booking page",
  status: "doing",
  labels: ["launch"],
});
console.log(`Task ${task.key} is on the board`);

// Project: create the project the work ships in
const project = await scaffold.project.create({
  workspace_id,
  name: "pinecrest-web",
});
console.log(`Project ${project.slug} is ready at ${project.hostname}`);

// Deploy: upload the app's code and deploy it
const archive = await readFile("pinecrest-web.zip");
await scaffold.source.upload({ project_id: project.id, archive });
const deploy = await scaffold.deploy.create({ project_id: project.id });

// Logs: print the build's steps until it is live or failed
let after: number | undefined;
for (;;) {
  const page = await scaffold.deploy.logs({ deploy_id: deploy.id, kind: "build", after });
  for (const line of page.lines) console.log(line.text);
  if (page.done) break;
  after = page.next;
  await sleep(1000);
}
const built = await scaffold.deploy.get({ deploy_id: deploy.id });
if (built.status !== "live") throw new Error(`Deploy ${built.id} failed: ${built.failure}`);
console.log(`Deploy ${built.id} is live at ${built.url}`);

// Hand off: move the task to review
await scaffold.task.move({ task_id: task.id, column: "review" });
console.log("The task is in review");
```

### 4. Run it

```bash
npx tsx ship.mts
```

You should see the task and the project, the build's steps, the deploy's address, and the task in review. In the console the project is live, the task is in review, and the activity rail shows each change as yours, with Undo.

A project's name must be new in its workspace, so change `pinecrest-web` before you run the file again.

## Usage

```ts
import { Scaffold, ScaffoldError } from "@scaffold-llc/sdk";

const scaffold = new Scaffold({
  token: process.env.SCAFFOLD_TOKEN, // the default
  baseUrl: "https://scaffold.llc", // the default
  timeout: 30_000, // milliseconds per request
  maxRetries: 2, // for 429 and 5xx answers, with backoff
  version: "2026-10-01", // the default, sent as Scaffold-Version
  appSecret: process.env.SCAFFOLD_AUTH_SECRET, // the default, for your app's server
});
```

- **Methods** are `scaffold.<resource>.<action>(input)`, named like the command: `scaffold.task.create()` is the `task_create` MCP action and `POST /v1/tasks`. Input is one object with the HTTP API's field names; path, query and body fields go where the route takes them.
- **Lists** like `scaffold.task.list()` answer one page of `data` with `has_more` and `next_cursor` when awaited. Loop with `for await` and the SDK fetches each next page as you reach it.
- **Errors** throw a `ScaffoldError` with the HTTP status, the error's `type`, `message`, `param`, `requestId` and `details`, and `retryAfter` in seconds when the answer asked for a wait.
- **Writes** take an idempotency key as a second argument, `{ idempotencyKey: "launch-2026-10-29" }`, so a retried write returns the first result instead of running twice. Without one the SDK sends its own, so its retries of a write never run it twice.
- **Your app's users** sign up, sign in and get auth emails through `scaffold.app_auth.sign_up()`, `sign_in()`, `email_send()`, `verify()` and `password_reset()` from your app's server. Pass the user's address as `{ clientIp }` so each user gets their own rate limits; it needs `appSecret`, which Scaffold sets in every server app as `SCAFFOLD_AUTH_SECRET`. Keep it on the server.
- **Types** for every schema in the API are exported by name, like `import type { Task, Run } from "@scaffold-llc/sdk"`.

The full guide is at [scaffold.llc/docs/sdk](https://scaffold.llc/docs/sdk), and every method is in the [command map](https://scaffold.llc/docs/commands).

## Contributing

This repository mirrors `sdk/` of Scaffold's platform repository, where the API is built. `src/generated` comes from the platform's OpenAPI document and command catalog by `npm run generate`, which only runs there, and its CI fails when the committed output is stale. So a change to the API reaches this SDK in the same merge request that makes it.

Issues and pull requests are welcome here for the runtime in `src/client.ts`, the tests and the docs; we apply accepted changes upstream, and the next mirror carries them back.

**Versions.** Every mirror that changes `src/` or `package.json` publishes a release from GitHub Actions, with npm provenance. The version is `major.minor` from `package.json` and the workflow's run number as the patch, so a spec change that only adds methods or fields needs no bump. A change that removes or renames a method or field, or narrows a type, bumps the minor in `package.json` while the SDK is 0.x, and the major from 1.0, in the same merge request. Leave the patch at 0.

```bash
npm ci
npm run typecheck
npm test
```

## License

MIT
