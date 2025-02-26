# React + Vite + Neon + Hyperdrive

## To Do

1. Fix issues with hyperdrive, and switch to "hyperdrive-index.js" in wrangler.jsonc
2. Fix book covers sizes
3. Remove download-covers script and SQL script
4. Write readme
5. Enable smart placment

## To Run Locally

1. Create postgres database and input data using the "sql-script".
2. Add `.dev.vars` file and put in `DATABASE_URL=${connection-string}`
3. Turn off "Warp" or VPN.
4. `npm run dev`

## Deployment Steps

1. Add secret via `npx wrangler secret put DATABASE_URL`
   - Then enter connection string value
2. `npm run deploy`

## Resources

- https://neon.tech/docs/guides/cloudflare-workers
- https://www.npmjs.com/package/@cloudflare/vite-plugin
- https://developers.cloudflare.com/hyperdrive/get-started/
