// End-to-end check through a real browser: create (with a validation error first),
// edit, filter, delete. Needs the API on :8000 and the web app running.
// Run: BASE=http://localhost:3200 node tests/e2e.mjs
import { chromium } from "playwright";
import assert from "node:assert/strict";

const BASE = process.env.BASE ?? "http://localhost:3000";
const title = `E2E task ${Date.now()}`;
const browser = await chromium.launch();
const page = await browser.newPage();
page.on("dialog", (d) => d.accept()); // confirm() on delete
// Next 16 keeps pages you navigated away from mounted but hidden (React Activity),
// so every lookup is scoped to the page that is actually on screen.
const view = page.locator("main:visible");

try {
  // Create: an empty title is rejected by Laravel and shown next to the field.
  await page.goto(`${BASE}/tasks/new`);
  await view.getByRole("button", { name: "Create task" }).click();
  await view.getByText("The title field is required.").waitFor();
  console.log("ok  validation error shown from Laravel");

  await view.getByLabel("Title").fill(title);
  await view.getByLabel("Priority").selectOption("high");
  await view.getByRole("button", { name: "Create task" }).click();
  await page.waitForURL(`${BASE}/`);
  const row = view.locator("li", { hasText: title });
  await row.waitFor();
  assert.match(await row.innerText(), /high priority/);
  console.log("ok  created");

  // Edit: mark it done.
  await row.getByRole("link", { name: "Edit" }).click();
  await view.getByRole("heading", { name: "Edit task" }).waitFor();
  await view.getByLabel("Status").selectOption("done");
  await view.getByRole("button", { name: "Save changes" }).click();
  await page.waitForURL(`${BASE}/`);
  await view.locator("li", { hasText: title }).getByText("done", { exact: true }).waitFor();
  console.log("ok  updated");

  // Filter: shows under "done", not under "todo".
  await page.goto(`${BASE}/?status=todo`);
  await view.getByRole("heading", { name: "Tasks" }).waitFor();
  await page.waitForLoadState("networkidle");
  assert.equal(await view.locator("li", { hasText: title }).count(), 0);
  await page.goto(`${BASE}/?status=done`);
  await view.locator("li", { hasText: title }).waitFor();
  console.log("ok  filtered");

  // Delete.
  await view.locator("li", { hasText: title }).getByRole("button", { name: "Delete" }).click();
  await view.locator("li", { hasText: title }).waitFor({ state: "detached" });
  console.log("ok  deleted");
} finally {
  await browser.close();
}
