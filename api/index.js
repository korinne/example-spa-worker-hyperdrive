import { Hono } from "hono";
import { Client } from "@neondatabase/serverless";

const app = new Hono();

app.get("/api/data", async (c) => {
  const client = new Client(c.env.DATABASE_URL);
  try {
    await client.connect();
    const { rows } = await client.query("SELECT * FROM public.books");
    return c.json(rows);
  } catch (error) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return c.json({ error: "Database errors" }, 500);
  } finally {
    await client.end();
  }
});

app.all("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default {
  fetch: app.fetch,
};
