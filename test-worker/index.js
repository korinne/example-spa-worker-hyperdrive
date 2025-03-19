import { Hono } from "hono";

const app = new Hono();

app.get("/", (ctx) => {
  return ctx.text("Hello World!");
});

app.get("/test", (ctx) => {
  return ctx.json({
    message: "This response is from test-worker",
    timestamp: new Date().toISOString()
  });
});

// Export both a fetch handler and a WorkerEntrypoint
export default {
  fetch: app.fetch,
};

// This class implements the WorkerEntrypoint interface
export class TestWorker {
  constructor(env, ctx) {
    this.env = env;
    this.ctx = ctx;
    this.app = app;
  }

  fetch(request) {
    return this.app.fetch(request, this.env, this.ctx);
  }
}
