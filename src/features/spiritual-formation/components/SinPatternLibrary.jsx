import { sinPatterns } from '../data/sinPatterns'
import SinPatternCard from './SinPatternCard'

export default function SinPatternLibrary() {
  return (
    <section className="sf-section">
      <div className="sf-section-heading">
        <h2>Sin Pattern Library</h2>
        <p>Possible patterns to examine before God, not a final diagnosis of the heart.</p>
      </div>
      <div className="sf-pattern-grid">
        {sinPatterns.map((pattern) => <SinPatternCard key={pattern.id} pattern={pattern} />)}
      </div>
    </section>
  )
}
