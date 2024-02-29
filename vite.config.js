import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    proxy: {
      '/api2': {
        target: 'http://localhost:8082/',
        changeOrigin: true,
        rewrite: (path ) => path.replace(/^\/api2/, ''),
      },
      '/api': {
        target: 'http://localhost:8079/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },

    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // server: {
  //   open: true,//启动项目自动弹出浏览器
  //   // port: '5173',
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8079/',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, '') // 不可以省略rewrite
  //     }
  //   }
  // }
})
