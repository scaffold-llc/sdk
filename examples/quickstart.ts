import { setTimeout as sleep } from "node:timers/promises";
import { Scaffold } from "@scaffold-llc/sdk";

// Reads SCAFFOLD_TOKEN from the environment
const scaffold = new Scaffold();
const workspace_id = process.env.SCAFFOLD_WORKSPACE;
if (!workspace_id) throw new Error("Set SCAFFOLD_WORKSPACE to your workspace id, from Settings, then Workspace");

// Plan: tasks live in a Tasks database, so make one and put the work on its board. Within
// 24 hours, the keys make a second run answer the same board and task instead of adding more.
const board = await scaffold.database.create(
  { workspace_id, name: "Tasks", template: "tasks" },
  { idempotencyKey: `quickstart-board-${workspace_id}` },
);
const task = await scaffold.task.create(
  { workspace_id, database_id: board.id, title: "Ship the booking page", status: "doing", labels: ["launch"] },
  { idempotencyKey: `quickstart-task-${workspace_id}` },
);
console.log(`Task ${task.key} is on the board`);

// Project: create the project the work ships in
const project = await scaffold.project.create({
  workspace_id,
  name: "pinecrest-web",
});
console.log(`Project ${project.slug} is ready at ${project.hostname}`);

// Deploy: upload the app folder's files and deploy them
await scaffold.source.upload({ project_id: project.id, dir: "app" });
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
