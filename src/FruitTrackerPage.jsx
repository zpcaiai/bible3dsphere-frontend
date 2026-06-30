import { t as i18nT } from './i18n/runtime'
/** FruitTrackerPage — 圣灵果子追踪 (B3)。入口：今日心镜。 */
import { useEffect, useState } from 'react'
import BackButton from './BackButton'
import { formationApi } from './api'
import { getToken } from './auth'

const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 14, marginBottom: 12 }
const btn = { cursor: 'pointer', borderRadius: 10, padding: '10px 14px', border: 'none', color: '#fff', fontWeight: 700, background: 'linear-gradient(135deg, rgba(52,199,89,0.85), rgba(125,211,252,0.6))' }

export default function FruitTrackerPage({ user, onBack }) {
  const [dims, setDims] = useState([])
  const [scores, setScores] = useState({})
  const [insights, setInsights] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const t = getToken(); if (!t) return
    formationApi.fruitDimensions(t).then(r => {
      setDims(r.dimensions || [])
      const init = {}; (r.dimensions || []).forEach(d => { init[d.dimension_key] = 5 }); setScores(init)
    }).catch(e => setError(e.message))
  }, [])

  async function submit() {
    const t = getToken(); setBusy(true); setError('')
    try {
      await formationApi.submitFruit({ scores: dims.map(d => ({ dimension_key: d.dimension_key, score: scores[d.dimension_key] || 5 })) }, t)
      const r = await formationApi.fruitInsights(t); setInsights(r.insights || [])
    } catch (e) { setError(e.message) } finally { setBusy(false) }
  }

  const wrap = { maxWidth: 640, margin: '0 auto', padding: 16, color: '#fff' }
  return (
    <div style={wrap}>
      <BackButton onClick={onBack} />
      <h2 style={{ fontSize: 20, fontWeight: 800, margin: '8px 0 4px' }}>{i18nT('🍇 圣灵果子追踪')}</h2>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>{i18nT('这是反思镜子，不是属灵成绩，也不与人比较（加 5:22-23）')}</div>
      {error && <div style={{ ...card, color: '#ffb4b4' }}>{error}</div>}

      <div style={card}>
        {dims.map(d => (
          <div key={d.dimension_key} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span>{d.display_name}</span><span style={{ color: '#8be9c0' }}>{scores[d.dimension_key]}</span>
            </div>
            <input type="range" min="1" max="10" value={scores[d.dimension_key] || 5}
              onChange={e => setScores({ ...scores, [d.dimension_key]: Number(e.target.value) })} style={{ width: '100%' }} />
          </div>
        ))}
        <button style={btn} disabled={busy || !dims.length} onClick={submit}>{busy ? '…' : '提交自评'}</button>
      </div>

      {insights && (
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{i18nT('温柔的观察')}</div>
          {insights.map((i, k) => <div key={k} style={{ fontSize: 13, color: 'rgba(255,255,255,0.78)', marginBottom: 6 }}>· {i}</div>)}
        </div>
      )}
    </div>
  )
}
