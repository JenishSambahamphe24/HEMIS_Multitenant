import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  base: "/",
  server: {
    host: true,
  },
  hmr: {
    overlay: true,
  },
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  optimizeDeps: {
    include: ["@mui/material", "@emotion/react", "@emotion/styled"],
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      "@config": new URL("./config.js", import.meta.url).pathname,
    },
  },
});