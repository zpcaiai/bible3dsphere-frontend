import { useState } from 'react'
import { T, fruitName, localizePattern, referenceName } from '../lib/localize'

export default function SinPatternCard({ pattern: rawPattern, onSelect }) {
  const [open, setOpen] = useState(false)
  const pattern = localizePattern(rawPattern)
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
        <p><b>{T('核心谎言', 'Core lie')}</b>{pattern.coreLie}</p>
        <p><b>{T('福音真理', 'Gospel truth')}</b>{pattern.gospelTruth}</p>
      </div>
      <div className="sf-chip-row">
        {pattern.targetHolySpiritFruits.map((fruit) => <span className="sf-chip" key={fruit}>{fruitName(fruit)}</span>)}
      </div>
      {open && (
        <div className="sf-detail-panel">
          <p>{pattern.biblicalDiagnosis}</p>
          <div className="sf-detail-grid">
            <Detail title={T('症状', 'Symptoms')} items={pattern.commonSymptoms} />
            <Detail title={T('深层偶像', 'Deep idols')} items={pattern.deepIdols} />
            <Detail title={T('脱去', 'Put off')} items={pattern.putOffActions} />
            <Detail title={T('穿上', 'Put on')} items={pattern.putOnActions} />
          </div>
          <div className="sf-scripture-list">
            {pattern.scriptures.map((scripture) => <span key={scripture.reference}>{referenceName(scripture.reference)}</span>)}
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
