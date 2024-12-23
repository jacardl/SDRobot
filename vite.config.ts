import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    VueI18nPlugin({
      include: fileURLToPath(new URL('./src/locales/**', import.meta.url))
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: '0.0.0.0',
    port: 4174,
    fs: {
      strict: false
    },
    hmr: {
      //host: 'www.sdrobot.top',
      //protocol: 'wss',
      //clientPort: 443
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 4174
  },
  build: {
    rollupOptions: {
      external: ['googleapis'],
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
          if (id.includes('/src/views/')) {
            return 'views'
          }
        },
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]'
          let extType = assetInfo.name.split('.').at(1) || 'asset';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img'
          }
          return `assets/${extType}/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    assetsDir: 'assets',
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    sourcemap: false,
    assetsInlineLimit: 4096,
    manifest: true
  },
  define: {
    __VUE_OPTIONS_API__: false,
    'process.env': {
      VITE_APP_URL: process.env.VITE_APP_URL
    }
  },
  base: '/',
  publicDir: 'public',
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif']
})