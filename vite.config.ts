import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~bootstrap": path.resolve(__dirname, "node_modules/bootstrap"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    coverage: {
      provider: "istanbul",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./tests/coverage",
    },
    setupFiles: ["./tests/setup.ts"],
    resolve: {
      alias: {
        "@/stores/notifications": path.resolve(
          __dirname,
          "./src/stores/notifications.ts"
        ),
      },
    },
  },
  define: {
    LOGGER: JSON.stringify(process.env.NODE_ENV !== "production"),
  },
});
