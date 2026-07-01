import { calculateFruitProgress } from '../lib/fruitProgressEngine'

const labelCopy = {
  newly_practiced: 'newly practiced',
  growing: 'growing',
  needs_attention: 'needs attention',
  ask_for_grace: 'ask for grace',
}

export default function FruitTree({ dailyExamens, thoughtEntries, graceRecoveryEntries }) {
  const progress = calculateFruitProgress({ dailyExamens, thoughtEntries, graceRecoveryEntries })
  const max = Math.max(1, ...progress.map((item) => item.count))
  return (
    <section className="sf-section">
      <div className="sf-section-heading"><h2>Holy Spirit Fruit Tree</h2><p>These are not achievements to boast in. Fruit is the Spirit's work, not a scorecard for proving yourself.</p></div>
      <div className="sf-fruit-grid">
        {progress.map((item) => (
          <article className="sf-card sf-fruit-card" key={item.fruit}>
            <div className="sf-fruit-title"><h3>{item.fruit.replaceAll('_', ' ')}</h3><span>{labelCopy[item.label] ?? item.label}</span></div>
            <div className="sf-progress"><i style={{ width: `${Math.max(8, (item.count / max) * 100)}%` }} /></div>
            <p>{item.encouragement}</p>
            {item.relatedObedienceActions.length > 0 && <ul>{item.relatedObedienceActions.map((action) => <li key={action}>{action}</li>)}</ul>}
          </article>
        ))}
      </div>
    </section>
  )
}
