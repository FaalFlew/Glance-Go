import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/components": resolve(__dirname, "src/components"),
      "@/composables": resolve(__dirname, "src/composables"),
      "@/services": resolve(__dirname, "src/services"),
      "@/utils": resolve(__dirname, "src/utils"),
      "@/constants": resolve(__dirname, "src/constants"),
      "@/types": resolve(__dirname, "src/types"),
    },
  },
});
