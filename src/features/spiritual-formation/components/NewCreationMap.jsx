import { sinPatternMap } from '../data/sinPatterns'
import { calculateFruitProgress } from '../lib/fruitProgressEngine'

function afterDays(days) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

function countPatterns(entries) {
  const counts = new Map()
  entries.forEach((entry) => (entry.detectedSinPatterns || []).forEach((id) => counts.set(id, (counts.get(id) || 0) + 1)))
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3)
}

export default function NewCreationMap({ dailyExamens, thoughtEntries, graceRecoveryEntries }) {
  const windows = [
    ['Last 7 days', 7],
    ['Last 30 days', 30],
    ['Last 90 days', 90],
    ['Year view', 365],
  ]
  return (
    <section className="sf-section">
      <div className="sf-section-heading"><h2>New Creation Progress Map</h2><p>This map is not a record of your worth. Your worth is in Christ. This is a tool for seeing where God may be inviting further transformation.</p></div>
      <div className="sf-map-grid">
        {windows.map(([label, days]) => {
          const since = afterDays(days)
          const daily = dailyExamens.filter((entry) => entry.date.slice(0, 10) >= since)
          const fruits = calculateFruitProgress({ dailyExamens: daily, thoughtEntries, graceRecoveryEntries }).filter((item) => item.count > 0).slice(0, 3)
          const patterns = countPatterns(daily)
          return (
            <article className="sf-card" key={label}>
              <h3>{label}</h3>
              <p className="sf-muted">{daily.length} daily scans · {graceRecoveryEntries.filter((entry) => entry.date.slice(0, 10) >= since).length} recovery entries</p>
              <h4>Old patterns brought into light</h4>
              {patterns.length ? <ul>{patterns.map(([id, count]) => <li key={id}>{sinPatternMap[id].name} · {count}</li>)}</ul> : <p className="sf-empty">No entries yet.</p>}
              <h4>Most practiced fruits</h4>
              {fruits.length ? <div className="sf-chip-row">{fruits.map((fruit) => <span className="sf-chip" key={fruit.fruit}>{fruit.fruit.replace('_', ' ')}</span>)}</div> : <p className="sf-empty">Begin with one daily scan.</p>}
            </article>
          )
        })}
      </div>
    </section>
  )
}
