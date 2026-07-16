import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import linkedinDevPlugin from "./scripts/linkedin-dev-plugin.mjs";

export default defineConfig(({ command }) => ({
  // The LinkedIn dev bridge only runs in the dev server (Node). It is never
  // included in the production bundle, so no secrets are shipped to users.
  plugins: [react(), linkedinDevPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
}));
