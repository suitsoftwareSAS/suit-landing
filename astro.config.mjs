// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

import react from "@astrojs/react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 4321,
  },

  build: {
    // Inline all CSS into <style> tags to eliminate render-blocking stylesheet requests
    inlineStylesheets: "always",
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ["784c-190-57-168-29.ngrok-free.app"],
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },

  integrations: [react()],
});
