import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [
    react(),
    cloudflare({
      configPath: "./wrangler.jsonc",
      auxiliaryWorkers: [
        { 
          configPath: "./test-worker/wrangler.jsonc"
        }
      ],
      persistState: false,
    }),
  ],
});
