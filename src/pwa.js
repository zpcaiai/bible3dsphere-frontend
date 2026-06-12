let deferredPrompt = null

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    return
  }

  if (import.meta.env.DEV) {
    window.addEventListener('load', async () => {
      try {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map((reg) => reg.unregister()))
        if ('caches' in window) {
          const keys = await caches.keys()
          await Promise.all(keys.filter((key) => key !== 'offline-pack-v1').map((key) => caches.delete(key)))
        }
      } catch {
        // Development cleanup should never block app rendering.
      }
    })
    return
  }

  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      // 检测到新版 SW 时刷新页面（使用 sessionStorage 避免重复刷新）
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing
        if (newSW) {
          newSW.addEventListener('statechange', () => {
            if (newSW.state === 'activated' && navigator.serviceWorker.controller) {
              // 检查是否已经刷新过，避免无限循环
              const hasReloaded = sessionStorage.getItem('sw-reloaded')
              if (!hasReloaded) {
                sessionStorage.setItem('sw-reloaded', 'true')
                console.log('[SW] New version activated, reloading...')
                window.location.reload()
              } else {
                console.log('[SW] Already reloaded this session, skip.')
              }
            }
          })
        }
      })
    } catch (error) {
      console.error('Service worker registration failed:', error)
    }
  })
}

export function subscribeToInstallPrompt(callback) {
  function handleBeforeInstallPrompt(event) {
    event.preventDefault()
    deferredPrompt = event
    callback(true)
  }

  function handleAppInstalled() {
    deferredPrompt = null
    callback(false)
  }

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)

  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.removeEventListener('appinstalled', handleAppInstalled)
  }
}

export async function promptInstall() {
  if (!deferredPrompt) {
    return false
  }

  deferredPrompt.prompt()
  const choice = await deferredPrompt.userChoice
  deferredPrompt = null
  return choice?.outcome === 'accepted'
}

export function isIosInstallable() {
  if (typeof window === 'undefined') {
    return false
  }

  const userAgent = window.navigator.userAgent || ''
  const isIos = /iphone|ipad|ipod/i.test(userAgent)
  const isStandalone = window.navigator.standalone === true
  return isIos && !isStandalone
}
