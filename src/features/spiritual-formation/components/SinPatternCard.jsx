import { useState } from 'react'

export default function SinPatternCard({ pattern, onSelect }) {
  const [open, setOpen] = useState(false)
  return (
    <article className="sf-card sf-pattern-card">
      <button className="sf-card-button" type="button" onClick={() => { setOpen(!open); onSelect?.(pattern.id) }}>
        <span>
          <strong>{pattern.name}</strong>
          <small>{pattern.description}</small>
        </span>
        <span className="sf-card-short">{pattern.shortName}</span>
      </button>
      <div className="sf-two-copy">
        <p><b>Core lie</b>{pattern.coreLie}</p>
        <p><b>Gospel truth</b>{pattern.gospelTruth}</p>
      </div>
      <div className="sf-chip-row">
        {pattern.targetHolySpiritFruits.map((fruit) => <span className="sf-chip" key={fruit}>{fruit.replace('_', ' ')}</span>)}
      </div>
      {open && (
        <div className="sf-detail-panel">
          <p>{pattern.biblicalDiagnosis}</p>
          <div className="sf-detail-grid">
            <Detail title="Symptoms" items={pattern.commonSymptoms} />
            <Detail title="Deep idols" items={pattern.deepIdols} />
            <Detail title="Put off" items={pattern.putOffActions} />
            <Detail title="Put on" items={pattern.putOnActions} />
          </div>
          <div className="sf-scripture-list">
            {pattern.scriptures.map((scripture) => <span key={scripture.reference}>{scripture.reference}</span>)}
          </div>
          <p className="sf-prayer">{pattern.repentancePrayer}</p>
        </div>
      )}
    </article>
  )
}

function Detail({ title, items }) {
  return (
    <div>
      <h4>{title}</h4>
      <ul>{items.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul>
    </div>
  )
}
