import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    host: "127.0.0.1",
    port: 5173,
    open: true,
  },

  preview: {
    host: "127.0.0.1",
    port: 4173,
  },

  build: {
    target: "es2022",
    sourcemap: false,
    outDir: "dist",
    emptyOutDir: true,

    // MapLibre on its own is ~1,050 kB minified and can't be split
    // further (it loads only with the explorer); app chunks stay far
    // below this, so growth there still warns.
    chunkSizeWarningLimit: 1100,

    rollupOptions: {
      output: {
        // MapLibre rarely changes; keeping it in its own chunk lets
        // browsers cache it across app releases.
        manualChunks: {
          maplibre: ["maplibre-gl"],
        },
      },
    },
  },
});