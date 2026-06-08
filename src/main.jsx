import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { registerServiceWorker } from './pwa'
import './styles.css'

registerServiceWorker()

// 部署后旧 index 引用的旧 chunk 已被新构建替换 → 动态 import 404/MIME 错误。
// Vite 会派发 vite:preloadError，捕获后整页刷新拿新版本，避免点页签白屏。
window.addEventListener('vite:preloadError', (e) => {
  e.preventDefault()
  window.location.reload()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
