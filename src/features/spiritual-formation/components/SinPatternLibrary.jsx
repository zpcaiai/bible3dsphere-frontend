import { sinPatterns } from '../data/sinPatterns'
import { T } from '../lib/localize'
import SinPatternCard from './SinPatternCard'

export default function SinPatternLibrary() {
  return (
    <section className="sf-section">
      <div className="sf-section-heading">
        <h2>{T('罪的模式资料库', 'Sin Pattern Library')}</h2>
        <p>{T('可在神面前省察的可能模式，而非对内心的最终断定。', 'Possible patterns to examine before God, not a final diagnosis of the heart.')}</p>
      </div>
      <div className="sf-pattern-grid">
        {sinPatterns.map((pattern) => <SinPatternCard key={pattern.id} pattern={pattern} />)}
      </div>
    </section>
  )
}
