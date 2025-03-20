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
    console.error("Database error:", error);
    return c.json({ error: error.message || "Database errors" }, 500);
  } finally {
    try {
      await client.end();
    } catch (e) {
      console.error("Error closing connection:", e);
    }
  }
});

app.all("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default {
  fetch: app.fetch,
};
