/** SabbathRestPage — 安息日与休息操练 (B4)。入口：今日心镜。 */
import { useState } from 'react'
import BackButton from './BackButton'
import { formationApi } from './api'
import { getToken } from './auth'

const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 14, marginBottom: 12 }
const btn = { cursor: 'pointer', borderRadius: 10, padding: '10px 14px', border: 'none', color: '#fff', fontWeight: 700, background: 'linear-gradient(135deg, rgba(52,199,89,0.85), rgba(125,211,252,0.6))' }
const FIELDS = [
  ['sleep_quality_score', '睡眠质量（高=好）'], ['physical_fatigue_score', '身体疲惫'],
  ['emotional_fatigue_score', '情绪耗竭'], ['spiritual_dryness_score', '灵性枯干'],
  ['work_pressure_score', '工作压力'], ['technology_overload_score', '信息过载'], ['relational_depletion_score', '关系消耗'],
]

export default function SabbathRestPage({ user, onBack }) {
  const [scores, setScores] = useState(Object.fromEntries(FIELDS.map(([k]) => [k, 5])))
  const [analysis, setAnalysis] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    const t = getToken(); setBusy(true); setError('')
    try { const r = await formationApi.sabbathAudit(scores, t); setAnalysis(r.analysis) } catch (e) { setError(e.message) } finally { setBusy(false) }
  }

  const wrap = { maxWidth: 640, margin: '0 auto', padding: 16, color: '#fff' }
  return (
    <div style={wrap}>
      <BackButton onClick={onBack} />
      <h2 style={{ fontSize: 20, fontWeight: 800, margin: '8px 0 4px' }}>🌙 安息与休息</h2>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>抵抗效率偶像 · 重新安放敬拜、信靠与身体</div>
      {error && <div style={{ ...card, color: '#ffb4b4' }}>{error}</div>}

      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>休息审计（0–10）</div>
        {FIELDS.map(([k, label]) => (
          <div key={k} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span>{label}</span><span style={{ color: '#8be9c0' }}>{scores[k]}</span></div>
            <input type="range" min="0" max="10" value={scores[k]} onChange={e => setScores({ ...scores, [k]: Number(e.target.value) })} style={{ width: '100%' }} />
          </div>
        ))}
        <button style={btn} disabled={busy} onClick={submit}>{busy ? '…' : '生成休息建议'}</button>
      </div>

      {analysis && (
        <div style={card}>
          {analysis.burnout_risk && <div style={{ color: '#f5c451', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>⚠ 像是 burnout 边缘：先减总负荷。</div>}
          {analysis.blockers && analysis.blockers.length > 0 && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>阻碍：{analysis.blockers.join('、')}</div>}
          {analysis.idols && analysis.idols.length > 0 && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>可能的偶像：{analysis.idols.join('、')}</div>}
          {(analysis.recommendations || []).map((r, k) => <div key={k} style={{ fontSize: 13, marginBottom: 5 }}>· {r}</div>)}
        </div>
      )}
    </div>
  )
}
