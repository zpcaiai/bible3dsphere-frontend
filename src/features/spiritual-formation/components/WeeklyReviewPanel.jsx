import { generateWeeklyReview } from '../lib/weeklyReviewEngine'
import { sinPatternMap } from '../data/sinPatterns'

function startOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  return d.toISOString().slice(0, 10)
}

function endOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() + (6 - day))
  return d.toISOString().slice(0, 10)
}

export default function WeeklyReviewPanel({ userId, weekStartDate = startOfWeek(), weekEndDate = endOfWeek(), dailyExamens = [], thoughtEntries = [], graceRecoveryEntries = [] }) {
  const review = generateWeeklyReview({ userId, weekStartDate, weekEndDate, dailyExamens, thoughtEntries, graceRecoveryEntries })
  return (
    <section className="sf-section">
      <div className="sf-section-heading"><h2>Weekly Spiritual Review</h2><p>{weekStartDate} to {weekEndDate}</p></div>
      <p className="sf-success">This review is not an identity verdict. It is a gentle mirror for returning to Christ and taking one faithful next step.</p>
      <div className="sf-review-grid">
        <ReviewList title="This week's main patterns" items={review.mostFrequentSinPatterns.map((item) => `${sinPatternMap[item.sinPatternId].name} · ${item.count}`)} />
        <ReviewList title="Common triggers" items={review.topTriggers.map((item) => `${item.trigger.replaceAll('_', ' ')} · ${item.count}`)} />
        <ReviewList title="Recurring lies" items={review.recurringCoreLies} />
        <ReviewList title="Fruits practiced" items={review.fruitsPracticed.map((item) => `${item.fruit.replace('_', ' ')} · ${item.count}`)} />
        <ReviewList title="Obedience actions" items={review.obedienceActionsCompleted} />
        <ReviewList title="Suggested next practices" items={review.recommendedNextPractices.map((practice) => practice.name)} />
      </div>
      <p className="sf-success">{review.pastoralEncouragement}</p>
    </section>
  )
}

function ReviewList({ title, items }) {
  return (
    <article className="sf-card">
      <h3>{title}</h3>
      {items.length ? <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p className="sf-empty">No entries yet.</p>}
    </article>
  )
}
