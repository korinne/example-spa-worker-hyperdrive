# React + Vite + Neon + Hyperdrive on Workers

This is a simple React SPA using the new @cloudflare/vite-plugin and Workers static assets. On the backend, this uses Hono to define API routes in a Worker, and the API calls out to a Neon postgres database through Hyperdrive. Smart Placement is enabled.

## To Do

1. Fix book covers sizes
2. Remove download-covers script
3. Finish Readme
4. Change binding in wrangler.jsonc for hyperdrive to a place holder.

## Running Locally

To run locally, you can use the docker container defined in the docker compose.

1. `docker-compose up -d`
   - Creates container with postgres in it, and seed with the "init.sql" data.
2. `npm run dev`
3. If wanting to change the initial SQL script, tear down with `docker-compose down -v`.

## Testing

1. `docker-compose up -d`
2. Run the `docker-compose run --rmf
k6 run /scripts/test.js` to get the K6 values.

## Deploying

1. Run `npm i`
2. Sign up for [Neon](https://neon.tech) and create a postgres database.
3. Input the SQL script (/init.sql) into SQL editor.
4. Create a Hyperdrive connection by running `npx wrangler hyperdrive create <YOUR_CONFIG_NAME> --connection-string="<postgres://user:password@HOSTNAME_OR_IP_ADDRESS:PORT/database_name">`.
   - Be sure to put your connection string from neon instead of the example.
5. Bind your Worker to Hyperdrive by updating your `wrangler.jsonc` with the ID that Wrangler outputs in Step 4.
6. `npm run deploy`

## Resources

- https://neon.tech/docs/guides/cloudflare-workers
- https://www.npmjs.com/package/@cloudflare/vite-plugin
- https://developers.cloudflare.com/hyperdrive/get-started/
