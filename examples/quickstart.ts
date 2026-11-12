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
