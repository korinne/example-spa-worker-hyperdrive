import { Hono } from "hono";
import postgres from "postgres";

const app = new Hono();

app.get("/api/data", async (c) => {
  const sql = postgres(c.env.HYPERDRIVE.connectionString, {
    max: 5,
    fetch_types: false,
  });

  try {
    const results = await sql`SELECT * FROM public.books`;
    c.executionCtx.waitUntil(sql.end());

    return Response.json(results);
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: e instanceof Error ? e.message : e },
      { status: 500 }
    );
  }
});

// Forward all /test* routes to the test-worker
app.all("/test*", async (c) => {
  // Forward the original request, preserving method, headers, and body
  const url = new URL(c.req.url);
  const testWorkerUrl = `https://testing-worker${url.pathname}${url.search}`;

  const request = new Request(testWorkerUrl, {
    method: c.req.method,
    headers: c.req.headers,
    body:
      c.req.method !== "GET" && c.req.method !== "HEAD"
        ? await c.req.arrayBuffer()
        : undefined,
    redirect: "follow",
  });

  return c.env.TEST_WORKER.fetch(request);
});

app.all("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default {
  fetch: app.fetch,
};
