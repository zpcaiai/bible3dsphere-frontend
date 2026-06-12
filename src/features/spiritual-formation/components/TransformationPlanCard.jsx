import { sinPatternMap } from '../data/sinPatterns'

export default function TransformationPlanCard({ plan, onUpdate }) {
  const completed = plan.completedPracticeIds || []
  function togglePractice(id) {
    const next = completed.includes(id) ? completed.filter((item) => item !== id) : [...completed, id]
    onUpdate?.({ ...plan, completedPracticeIds: next, updatedAt: new Date().toISOString() })
  }
  return (
    <article className="sf-card sf-plan-card">
      <div className="sf-card-head">
        <div>
          <h3>{plan.title}</h3>
          <p>{sinPatternMap[plan.primarySinPattern].name} · {plan.duration.replaceAll('_', ' ')} · {plan.intensity}</p>
        </div>
        <span className={`sf-status ${plan.status}`}>{plan.status}</span>
      </div>
      <p>{plan.progressSummary}</p>
      <div className="sf-chip-row">{plan.targetFruits.map((fruit) => <span className="sf-chip" key={fruit}>{fruit.replace('_', ' ')}</span>)}</div>
      <div className="sf-practice-columns">
        <div>
          <h4>Daily practices</h4>
          {plan.dailyPractices.map((practice) => (
            <label className="sf-practice-check" key={practice.id}>
              <input type="checkbox" checked={completed.includes(practice.id)} onChange={() => togglePractice(practice.id)} />
              <span>{practice.name}<small>{practice.estimatedMinutes} min</small></span>
            </label>
          ))}
        </div>
        <div>
          <h4>Weekly review questions</h4>
          <ul>{plan.reviewQuestions.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
      <div className="sf-plan-actions">
        <button type="button" onClick={() => onUpdate?.({ ...plan, status: 'paused', updatedAt: new Date().toISOString() })}>Pause</button>
        <button type="button" onClick={() => onUpdate?.({ ...plan, status: 'completed', updatedAt: new Date().toISOString() })}>Complete</button>
      </div>
    </article>
  )
}
