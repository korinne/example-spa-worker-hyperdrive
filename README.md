# React + Vite + Neon on Workers

This is a simple React SPA using the new `@cloudflare/vite-plugin` and Workers static assets. On the backend, this uses Hono to define API routes in a Worker, and the API calls out to a Neon postgres database. Smart Placement is enabled.

## Pre-reqs

- Sign up for [Neon](https://neon.tech) and create a new project with a postgres database.
- Input the SQL script (/init.sql) into SQL editor.
- Get connection string from Neon (you can find it in your project > press the "Connect" button).
- Add the connection string as a secret via Wrangler with `npx wrangler secret put ${DATABASE_URL}`

## Running Locally

1. `npm i`
2. `npm run dev`

## Deploying

1. `npm run deploy`

## Resources

- https://neon.tech/docs/guides/cloudflare-workers
- https://www.npmjs.com/package/@cloudflare/vite-plugin
- https://developers.cloudflare.com/workers/static-assets/
