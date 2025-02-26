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

app.all("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default {
  fetch: app.fetch,
};
