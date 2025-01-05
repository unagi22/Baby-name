import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: [
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-label",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-slot",
      "@radix-ui/react-icons",
      "@radix-ui/react-dialog",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-popover",
    ],
    esbuildOptions: {
      target: "es2020",
    },
  },
  build: {
    target: "es2020",
    outDir: "dist",
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          radix: [
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-label",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-slot",
            "@radix-ui/react-icons",
            "@radix-ui/react-dialog",
            "@radix-ui/react-hover-card",
            "@radix-ui/react-popover",
          ],
        },
      },
    },
  },
});
