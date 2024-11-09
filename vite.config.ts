import { lingui } from "@lingui/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": {}
  },
  plugins: [react({ babel: { plugins: ["macros"] } }), lingui()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
});
