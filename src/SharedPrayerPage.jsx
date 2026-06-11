// SharedPrayerPage — 代祷分享公开页（/p/{token}），无需登录。
// 朋友打开链接即可看到这条代祷并「🙏 同心代祷」，底部引导进入属灵星球。
import { useEffect, useState } from 'react'
import { fetchSharedPrayer, amenSharedPrayer } from './api'
import { t } from './i18n/runtime'

const AMENED_KEY = 'shared-prayer-amened-v1'

function loadAmened() {
  try { return new Set(JSON.parse(localStorage.getItem(AMENED_KEY) || '[]')) } catch { return new Set() }
}

export default function SharedPrayerPage({ shareToken }) {
  const [prayer, setPrayer] = useState(null)
  const [err, setErr] = useState('')
  const [amened, setAmened] = useState(() => loadAmened().has(shareToken))

  useEffect(() => {
    fetchSharedPrayer(shareToken)
      .then(setPrayer)
      .catch((e) => setErr(String(e.message || e)))
  }, [shareToken])

  async function handleAmen() {
    if (amened) return
    setAmened(true)
    setPrayer((p) => p ? { ...p, amen_count: (p.amen_count || 0) + 1 } : p)
    try {
      const s = loadAmened(); s.add(shareToken)
      localStorage.setItem(AMENED_KEY, JSON.stringify([...s]))
    } catch { /* ignore */ }
    try { await amenSharedPrayer(shareToken) } catch { /* optimistic */ }
  }

  const card = {
    width: '100%', maxWidth: 480, borderRadius: 18, padding: '26px 24px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: '0 18px 48px rgba(0,0,0,0.45)', boxSizing: 'border-box',
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, overflowY: 'auto',
      background: 'radial-gradient(ellipse at 50% 0%, #16233b 0%, #0a1020 65%)',
      color: '#fff', fontFamily: 'inherit',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '46px 18px 40px', boxSizing: 'border-box',
    }}>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 18, letterSpacing: '0.08em' }}>
        🌍 {t("属灵星球 · 代祷邀请")}
      </div>

      {err && (
        <div style={{ ...card, textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.8 }}>
          {t("这条代祷不存在或已被删除。")}
        </div>
      )}
      {!prayer && !err && (
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, padding: '60px 0' }}>{t("加载中…")}</div>
      )}

      {prayer && (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #3a6df0, #8e54e9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700,
            }}>
              {(prayer.nickname || '?').slice(0, 1)}
            </div>
            <div>
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>{prayer.nickname}</div>
              <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                {(prayer.created_at || '').slice(0, 10)}
                {prayer.status === 'answered' && <span style={{ marginLeft: 8, color: '#ffd60a' }}>✨ {t("已蒙应允")}</span>}
              </div>
            </div>
          </div>

          <p style={{ margin: '0 0 18px', fontSize: 15.5, lineHeight: 1.9, color: 'rgba(255,255,255,0.92)', whiteSpace: 'pre-wrap' }}>
            {prayer.content}
          </p>

          <button
            onClick={handleAmen}
            disabled={amened}
            style={{
              width: '100%', padding: '13px 0', borderRadius: 12, border: 'none',
              background: amened ? 'rgba(232,163,61,0.25)' : 'linear-gradient(135deg, #e8a33d, #d97f1e)',
              color: amened ? '#ffd9a0' : '#241400', fontSize: 15, fontWeight: 700,
              cursor: amened ? 'default' : 'pointer', fontFamily: 'inherit',
            }}
          >
            🙏 {amened ? t("已与他同心代祷") : t("同心代祷")}
            {prayer.amen_count > 0 && (
              <span style={{ marginLeft: 8, fontWeight: 600, opacity: 0.8 }}>
                {prayer.amen_count}{t(" 人")}
              </span>
            )}
          </button>
        </div>
      )}

      <a
        href="/"
        style={{
          marginTop: 26, fontSize: 13.5, color: '#7dd3fc', textDecoration: 'none',
          border: '1px solid rgba(125,211,252,0.35)', borderRadius: 999, padding: '9px 22px',
          background: 'rgba(125,211,252,0.08)',
        }}
      >
        {t("✨ 进入属灵星球，写下你的代祷")}
      </a>
    </div>
  )
}
