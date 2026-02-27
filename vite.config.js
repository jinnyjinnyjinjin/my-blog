import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { BLOG_TITLE } from './src/config.js'

// Change 'my-blog' to your GitHub repository name
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'html-blog-title',
      transformIndexHtml(html) {
        return html.replace(/<title>.*<\/title>/, `<title>${BLOG_TITLE}</title>`)
      }
    }
  ],
  base: process.env.NODE_ENV === 'production' ? '/my-blog/' : '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-highlight': ['highlight.js'],
          'vendor-marked': ['marked', 'marked-highlight'],
        },
      },
    },
  },
})
