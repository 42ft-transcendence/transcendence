import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: "@src", replacement: resolve(__dirname, "src") },
      { find: "@api", replacement: resolve(__dirname, "src/api") },
      { find: "@assets", replacement: resolve(__dirname, "src/assets") },
      { find: "@components", replacement: resolve(__dirname, "src/component") },
      { find: "@hooks", replacement: resolve(__dirname, "src/hooks") },
      { find: "@mocks", replacement: resolve(__dirname, "src/mocks") },
      { find: "@pages", replacement: resolve(__dirname, "src/pages") },
      { find: "@router", replacement: resolve(__dirname, "src/router") },
      { find: "@recoil", replacement: resolve(__dirname, "src/recoil") },
      { find: "@type", replacement: resolve(__dirname, "src/types") },
      { find: "@utils", replacement: resolve(__dirname, "src/utils") },
    ],
  },
});
