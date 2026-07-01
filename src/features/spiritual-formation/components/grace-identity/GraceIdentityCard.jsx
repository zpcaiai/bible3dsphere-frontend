import { useMemo, useState } from 'react'
import { buildGraceIdentityResponse } from '../../lib/unionWithChristEngine'
import { formationExtApi } from '../../../../api'
import '../../app/spiritual-formation.css'

export default function GraceIdentityCard({ inputText = '', compact = false, response = null, token }) {
  const [draft, setDraft] = useState(inputText)
  const [logged, setLogged] = useState(false)
  const data = useMemo(() => response || buildGraceIdentityResponse(draft || inputText || '我必须表现好才被爱'), [draft, inputText, response])
  function logGrace() {
    if (!token) return
    formationExtApi.graceLog({ input_text: draft || inputText || '', scenario: data.key || '', response: { falseIdentity: data.falseIdentity, inChristTruth: data.inChristTruth, nextStep: data.nextStep }, route: data.route }, token).then(() => setLogged(true)).catch(() => {})
  }

  if (data.route !== 'grace_identity') {
    return (
      <article className="sf-card">
        <h3>需要温柔的真人陪伴</h3>
        <p>{data.pastoral?.message || '请优先联系可信的人、牧者、辅导者或当地紧急资源。'}</p>
      </article>
    )
  }

  return (
    <article className={`sf-card ${compact ? 'sf-grace-card compact' : 'sf-grace-card'}`}>
      <h3>在基督里，你的身份先于表现</h3>
      {!compact && (
        <label>
          此刻压在你身上的身份句子
          <textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="例如：我又失败了，所以神不会接纳我。" />
        </label>
      )}
      <div className="sf-home-grid">
        <div>
          <h4>可能背负的句子</h4>
          <p>{data.falseIdentity}</p>
        </div>
        <div>
          <h4>福音中的真实身份</h4>
          <p>{data.inChristTruth}</p>
        </div>
      </div>
      <p className="sf-prayer">{data.assurance}</p>
      <div className="sf-chip-row">{data.scriptureRefs.map((ref) => <span className="sf-chip" key={ref}>{ref}</span>)}</div>
      <p><b>小顺服：</b>{data.nextStep}</p>
      <p className="sf-muted">{data.prayer}</p>
      {token && (logged ? <p className="sf-success">已记录到你的恩典记录。</p> : <button className="sf-primary" type="button" onClick={logGrace}>保存到我的恩典记录</button>)}
    </article>
  )
}
