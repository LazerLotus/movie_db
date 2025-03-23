import react from "@vitejs/plugin-react";
import { defineConfig, ViteUserConfig } from "vitest/config";

export default defineConfig({
  plugins: [react() as ViteUserConfig["plugins"]],
  test: {
    environment: "happy-dom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      reporter: ["text", "json", "html"],
    },
  },
});
