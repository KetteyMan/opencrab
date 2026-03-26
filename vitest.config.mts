import path from "node:path";
import { defineConfig } from "vitest/config";

const testTimeoutMs = process.env.CI ? 90000 : 60000;

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
    testTimeout: testTimeoutMs,
    hookTimeout: testTimeoutMs,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
