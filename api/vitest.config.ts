/// <reference types="vitest" />

import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    root: path.resolve(__dirname),
    clearMocks: true,
    environment: "node",
    benchmark: {
      include: ["**/*.spec.ts"],
    },
    include: ["**/*.spec.ts"],
    exclude: [
      "node_modules",
      "dist",
      "**/.{idea,git,cache,output,temp}/**",
      "tests",
    ],
    alias: {
      "@services": "./src/services",
      "@core": "./src/core",
      "@modules": "./src/modules",
      "@config": "./config",
    },
    setupFiles: "./setupTests.ts",
  },
});
