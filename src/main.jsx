import React from 'react'
import ReactDOM from 'react-dom/client'
import AppErrorBoundary from './AppErrorBoundary'
import { LanguageProvider } from './i18n/LanguageContext'
import { getRuntimeLang } from './i18n/runtime'
import { mergeAutoEn } from './i18n/translations'
import './autoTranslate.jsx' // 注册 EN 缺词实时翻译 + 注水缓存（须在页面模块前）
import { registerServiceWorker } from './pwa'
import './styles.css'

registerServiceWorker()

// 部署后旧 index 引用的旧 chunk 已被新构建替换 → 动态 import 404/MIME 错误。
// Vite 会派发 vite:preloadError：先清掉 SW 缓存的旧 index/旧资源再刷新，
// 否则可能刷回同一份过期 HTML 造成「偶尔页面残缺」死循环（EN 切换整页刷新时最易触发）。
window.addEventListener('vite:preloadError', (e) => {
  e.preventDefault()
  const KEY = 'preload-error-reload'
  let reloaded = false
  try { reloaded = sessionStorage.getItem(KEY) === '1'; sessionStorage.setItem(KEY, '1') } catch { /* ignore */ }
  const go = () => window.location.reload()
  if (reloaded) { go(); return } // 第二次仍失败：直接刷新，避免清缓存代码自身出错卡死
  Promise.resolve()
    .then(async () => {
      if ('caches' in window) {
        const keys = await caches.keys()
        await Promise.all(keys.filter((k) => k !== 'offline-pack-v1').map((k) => caches.delete(k)))
      }
    })
    .catch(() => {})
    .finally(go)
})
// 成功完成一次加载后清除标记
window.addEventListener('load', () => { try { sessionStorage.removeItem('preload-error-reload') } catch { /* ignore */ } })

// 异步引导：EN 模式先加载 auto-en 词典（≈220KB 仅 EN 用户付费），
// 再动态加载 App——使 App 及其依赖里的「模块级 t() 常量」在词典就绪后求值。
// 中文用户两者都跳过词典，首包直降 200KB+。
;(async () => {
  try {
    if (getRuntimeLang() === 'en') {
      const m = await import('./i18n/auto-en.js')
      mergeAutoEn(m.default)
    }
  } catch { /* 词典加载失败 → EN 显示中文兜底 + 实时机翻，不阻塞 */ }
  const { default: App } = await import('./App')
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <LanguageProvider>
        <AppErrorBoundary>
          <App />
        </AppErrorBoundary>
      </LanguageProvider>
    </React.StrictMode>,
  )
})()
