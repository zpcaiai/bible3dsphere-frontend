import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './i18n/LanguageContext'
import { registerServiceWorker } from './pwa'
import './styles.css'

registerServiceWorker()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)

// === EXPANSION PACK launcher (content-theology-expansion) — additive, idempotent, self-mounting ===
import('./expansion/ExpansionLauncher.jsx').then((m) => m && m.mountExpansionLauncher && m.mountExpansionLauncher()).catch(() => {})
