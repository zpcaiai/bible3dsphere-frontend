import { useState } from 'react'
import { sinPatterns } from '../data/sinPatterns'
import { getPastoralSafetyMessage, GRACE_RECOVERY_STATEMENT } from '../lib/pastoralSafety'

function uid() {
  return `recovery_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export default function GraceRecoveryFlow({ userId, onSave }) {
  const [form, setForm] = useState({ whatHappened: '', sinPattern: '', confession: '', repairAction: '', boundaryAction: '', accountabilityAction: '', nextObedienceStep: '', recurringBondage: false, mentionsSevereDistress: false })
  const [saved, setSaved] = useState(false)
  const safety = getPastoralSafetyMessage({ recurringBondage: form.recurringBondage, mentionsSevereDistress: form.mentionsSevereDistress })
  function update(field, value) {
    setSaved(false)
    setForm((prev) => ({ ...prev, [field]: value }))
  }
  function save() {
    const now = new Date().toISOString()
    onSave({
      id: uid(),
      userId,
      date: now,
      sinPattern: form.sinPattern || undefined,
      whatHappened: form.whatHappened || 'I fell and need to return to Christ honestly.',
      confession: form.confession || 'Father, I confess my sin before You. I do not hide or excuse it.',
      receivedGraceStatement: GRACE_RECOVERY_STATEMENT,
      repairAction: form.repairAction,
      boundaryAction: form.boundaryAction,
      accountabilityAction: form.accountabilityAction,
      nextObedienceStep: form.nextObedienceStep || 'Return to one concrete act of obedience today.',
      createdAt: now,
    })
    setSaved(true)
  }
  return (
    <section className="sf-section sf-recovery">
      <div className="sf-section-heading"><h2>Grace Recovery</h2><p>Do not hide. Do not self-justify. Do not despair. Come to Christ honestly.</p></div>
      <div className="sf-form-grid">
        <label>What happened?<textarea value={form.whatHappened} onChange={(e) => update('whatHappened', e.target.value)} /></label>
        <label>Name the pattern if possible<select value={form.sinPattern} onChange={(e) => update('sinPattern', e.target.value)}><option value="">Not sure yet</option>{sinPatterns.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label>Confess honestly<textarea value={form.confession} onChange={(e) => update('confession', e.target.value)} /></label>
        <label>Repair if needed<textarea value={form.repairAction} onChange={(e) => update('repairAction', e.target.value)} /></label>
        <label>Strengthen boundary<textarea value={form.boundaryAction} onChange={(e) => update('boundaryAction', e.target.value)} /></label>
        <label>Re-enter obedience<textarea value={form.nextObedienceStep} onChange={(e) => update('nextObedienceStep', e.target.value)} /></label>
      </div>
      <label className="sf-check"><input type="checkbox" checked={form.recurringBondage} onChange={(e) => update('recurringBondage', e.target.checked)} /> This is recurring or destructive.</label>
      <label className="sf-check"><input type="checkbox" checked={form.mentionsSevereDistress} onChange={(e) => update('mentionsSevereDistress', e.target.checked)} /> I may need immediate real-world help.</label>
      {safety && <p className="sf-warning">{safety}</p>}
      <p className="sf-prayer">Father, I confess my sin before You. I do not hide or excuse it. Thank You that in Christ there is forgiveness and cleansing. Restore me, strengthen me, and lead me in new obedience. Amen.</p>
      <button className="sf-primary" type="button" onClick={save}>Save Recovery Entry</button>
      {saved && <p className="sf-success">{GRACE_RECOVERY_STATEMENT}</p>}
    </section>
  )
}
