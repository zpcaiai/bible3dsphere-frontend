import { useState } from 'react'
import { sinPatterns } from '../data/sinPatterns'
import { generateTransformationPlan, getIntensityDescription } from '../lib/planGenerator'
import TransformationPlanCard from './TransformationPlanCard'

export default function TransformationPlanDashboard({ userId, plans, onSave, onUpdate }) {
  const [form, setForm] = useState({ duration: '7_days', intensity: 'normal', primarySinPattern: 'entertainment_escapism', secondarySinPattern: '', startDate: new Date().toISOString().slice(0, 10) })
  const intensity = getIntensityDescription(form.intensity)
  const active = plans.find((plan) => plan.status === 'active')
  function createPlan() {
    onSave(generateTransformationPlan({
      userId,
      duration: form.duration,
      intensity: form.intensity,
      primarySinPattern: form.primarySinPattern,
      secondarySinPattern: form.secondarySinPattern || undefined,
      startDate: form.startDate,
    }))
  }
  return (
    <section className="sf-section">
      <div className="sf-section-heading"><h2>Transformation Plan Dashboard</h2><p>Create a practical plan for awareness, mortification, and new obedience.</p></div>
      <div className="sf-create-plan">
        <label>Duration<select value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}><option value="7_days">7-day Awareness</option><option value="30_days">30-day Mortification</option><option value="90_days">90-day Character Formation</option><option value="1_year">1-year New Creation Map</option></select></label>
        <label>Intensity<select value={form.intensity} onChange={(e) => setForm({ ...form, intensity: e.target.value })}><option value="light">light</option><option value="normal">normal</option><option value="deep">deep</option><option value="battle">battle</option></select></label>
        <label>Primary pattern<select value={form.primarySinPattern} onChange={(e) => setForm({ ...form, primarySinPattern: e.target.value })}>{sinPatterns.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label>Secondary pattern<select value={form.secondarySinPattern} onChange={(e) => setForm({ ...form, secondarySinPattern: e.target.value })}><option value="">None</option>{sinPatterns.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <label>Start date<input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label>
      </div>
      <p className="sf-muted"><b>{intensity.title}</b> · {intensity.dailyMinutes}. {intensity.description}</p>
      <button className="sf-primary" type="button" onClick={createPlan}>Create Plan</button>
      {active ? <TransformationPlanCard plan={active} onUpdate={onUpdate} /> : <p className="sf-empty">No active plan yet. Create one above to begin a concrete rhythm.</p>}
      {plans.filter((plan) => plan.status !== 'active').length > 0 && (
        <div className="sf-plan-history">
          <h3>Other plans</h3>
          {plans.filter((plan) => plan.status !== 'active').map((plan) => <TransformationPlanCard key={plan.id} plan={plan} onUpdate={onUpdate} />)}
        </div>
      )}
    </section>
  )
}
