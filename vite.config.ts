import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "@layerhub-pro/react": path.resolve(__dirname, "src/layerhub"),
      "@layerhub-pro/types": path.resolve(__dirname, "src/layerhub/types"),
      "@layerhub-pro/core": path.resolve(__dirname, "src/layerhub/core"),
      "@layerhub-pro/objects": path.resolve(__dirname, "src/layerhub/objects"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://api.layerhub.pro",
        changeOrigin: true,
        secure: false,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
