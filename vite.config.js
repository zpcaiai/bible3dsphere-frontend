import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// 构建时产出 /precache-manifest.json（全部 hashed 产物路径），
// sw.js 安装阶段读取并预缓存——二次访问全静态秒开，也根治旧 chunk 404。
function precacheManifestPlugin() {
  return {
    name: 'precache-manifest',
    apply: 'build',
    generateBundle(_, bundle) {
      const files = Object.keys(bundle)
        .filter((f) => /\.(js|css|woff2?)$/.test(f))
        .map((f) => '/' + f)
      this.emitFile({
        type: 'asset',
        fileName: 'precache-manifest.json',
        source: JSON.stringify({ version: Date.now(), files }),
      })
    },
  }
}

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [react(), precacheManifestPlugin()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'pdf': ['jspdf', 'html2canvas'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/wdbible': {
        target: 'https://wd.bible',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/wdbible/, ''),
      },
    },
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/wdbible': {
        target: 'https://wd.bible',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/wdbible/, ''),
      },
    },
  },
})
