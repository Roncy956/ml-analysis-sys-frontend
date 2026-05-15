import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    vueDevTools(),
  ],
  assetsInclude: ['**/*.svg'], // 识别SVG文件
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5173, // 可选：指定开发服务器端口
    open: false, // 自动打开浏览器
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 后端服务地址，请根据实际情况修改
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 可选：如果后端不需要 /api 前缀
      },
    },
  },
})
