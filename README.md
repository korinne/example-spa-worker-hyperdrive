# React + Vite + Neon + Hyperdrive on Workers

This is a simple React SPA using the new @cloudflare/vite-plugin and Workers static assets. On the backend, this uses Hono to define API routes in a Worker, and the API calls out to a Neon postgres database through Hyperdrive. Smart Placement is enabled.

## To Do

1. Fix book covers sizes
2. Remove download-covers script
3. Finish Readme

## Getting started

1. Run `npm i`
2. Sign up for [Neon](https://neon.tech) and create a postgres database.
3. Input the SQL script (/sql-script.sql) into SQL editor.
4. Create a Hyperdrive connection by running `npx wrangler hyperdrive create <YOUR_CONFIG_NAME> --connection-string="postgres://user:password@HOSTNAME_OR_IP_ADDRESS:PORT/database_name"`
5. Bind your Worker to Hyperdrive by updating your `wrangler.jsonc` with the ID that Wrangler outputs in Step 3.
6. `npm run deploy`

## Resources

- https://neon.tech/docs/guides/cloudflare-workers
- https://www.npmjs.com/package/@cloudflare/vite-plugin
- https://developers.cloudflare.com/hyperdrive/get-started/
