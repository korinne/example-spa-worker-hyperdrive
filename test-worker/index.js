import { Hono } from "hono";
import { WorkerEntrypoint } from "cloudflare:workers";

const app = new Hono();

app.get("/", (ctx) => {
  return ctx.text("Hello World!");
});

app.get("/test", (ctx) => {
  return ctx.json("testing");
});

export default {
  fetch: app.fetch,
};
