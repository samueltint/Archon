import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: "https://www.owlbear.rodeo",
    },
  },
    build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "statblocks": resolve(__dirname, "statblocks.html"),
      },
    },
  },

});
