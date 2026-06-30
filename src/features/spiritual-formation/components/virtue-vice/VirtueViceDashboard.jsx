import { useMemo, useState } from 'react'
import { fruitDimensions, temptationTypes, vices, virtues } from '../../data/virtueViceSeed'
import {
  buildVirtueViceDashboard,
  calculateFruitTrends,
  createFruitAssessment,
  createFruitFeedbackRequest,
  createTemptationCheckin,
  createTemptationPlan,
  createViceObservation,
  createVirtueFocus,
  detectVices,
  generateFruitInsight,
  generateVirtueReflection,
  logVirtuePractice,
  orchestrateVirtueViceIntent,
  realTimeResistance,
  recommendVirtues,
  reviewTemptationFailure,
  suggestVirtuePractices,
} from '../../lib/virtueViceEngine'
import {
  loadVirtueViceData,
  saveFailureReview,
  saveFruitAssessment,
  saveFruitFeedbackRequest,
  saveTemptationCheckin,
  saveTemptationPlan,
  saveViceObservation,
  saveVicePattern,
  saveVirtueFocus,
  saveVirtueLog,
} from '../../lib/virtueViceStorage'
import { MODULE_DISCLAIMER } from '../../lib/pastoralSafety'

function MiniTabs({ active, onChange }) {
  const tabs = [
    ['dashboard', 'Dashboard'],
    ['virtues', 'Virtues'],
    ['vices', 'Vices'],
    ['temptation', 'Temptation'],
    ['fruit', 'Fruit'],
  ]
  return <nav className="sf-tabs" aria-label="Virtue Vice sections">{tabs.map(([id, label]) => <button key={id} className={active === id ? 'active' : ''} type="button" onClick={() => onChange(id)}>{label}</button>)}</nav>
}

function SummaryCard({ title, items }) {
  return (
    <article className="sf-card sf-summary-card">
      <h3>{title}</h3>
      <dl>{items.filter((item) => item.value !== undefined && item.value !== null && item.value !== '').map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{Array.isArray(item.value) ? item.value.join(', ') : item.value}</dd></div>)}</dl>
    </article>
  )
}

export function VirtueDashboard({ userId, focuses, logs, onSaveFocus, onSaveLog }) {
  const [contextText, setContextText] = useState('I keep reacting with anger in family conflict')
  const [selectedVirtue, setSelectedVirtue] = useState('patience')
  const [activeFocus, setActiveFocus] = useState(focuses.find((focus) => focus.status === 'active') || null)
  const [selectedPracticeId, setSelectedPracticeId] = useState('')
  const [reflection, setReflection] = useState('')
  const [notice, setNotice] = useState('')
  const recommendations = recommendVirtues(contextText)
  const practices = activeFocus ? suggestVirtuePractices(activeFocus) : []

  function createFocus() {
    const focus = createVirtueFocus(userId, selectedVirtue, { focusReason: contextText, baselineSelfScore: 5 })
    onSaveFocus(focus)
    setActiveFocus(focus)
    setSelectedPracticeId('')
    setNotice('Virtue focus created.')
  }

  function logPractice() {
    const practice = practices.find((item) => item.id === selectedPracticeId) || practices[0]
    const result = logVirtuePractice(userId, activeFocus, practice, {
      userReflection: reflection,
      graceNoticed: 'I noticed one small grace to practice.',
      nextStep: 'Repeat this practice tomorrow.',
    })
    if (result.routed) {
      setNotice(result.guidance.message)
      return
    }
    onSaveLog(result.log)
    setReflection('')
    setNotice(result.guidance.message)
  }

  const virtueReflection = activeFocus ? generateVirtueReflection(userId, activeFocus, logs) : null
  return (
    <section className="sf-section">
      <div className="sf-section-heading"><h2>Virtue Formation / 德性塑造</h2><p>Grace-driven focus, practices, logs, and reflection.</p></div>
      <div className="sf-home-grid">
        <article className="sf-card sf-flow-card">
          <h3>Recommend Virtues</h3>
          <label>Context<textarea value={contextText} onChange={(event) => setContextText(event.target.value)} /></label>
          <div className="sf-chip-row">{recommendations.map((virtue) => <button key={virtue.key} className={`sf-chip-btn ${selectedVirtue === virtue.key ? 'active' : ''}`} type="button" onClick={() => setSelectedVirtue(virtue.key)}>{virtue.displayName}</button>)}</div>
          <button className="sf-primary" type="button" onClick={createFocus}>Create Virtue Focus</button>
        </article>
        <article className="sf-card sf-flow-card">
          <h3>Active Focus</h3>
          {activeFocus ? (
            <>
              <p><b>{activeFocus.virtue.displayName}</b></p>
              <p>{activeFocus.focusReason}</p>
              <label>Practice<select value={selectedPracticeId} onChange={(event) => setSelectedPracticeId(event.target.value)}><option value="">Choose practice</option>{practices.map((practice) => <option key={practice.id} value={practice.id}>{practice.title}</option>)}</select></label>
              {practices[0] && <VirtuePracticeCard practice={practices.find((item) => item.id === selectedPracticeId) || practices[0]} />}
              <label>Reflection<textarea value={reflection} onChange={(event) => setReflection(event.target.value)} /></label>
              <button className="sf-primary" type="button" onClick={logPractice}>Log Practice</button>
            </>
          ) : <p className="sf-empty">Create a virtue focus to begin.</p>}
        </article>
      </div>
      {virtueReflection && <SummaryCard title="Virtue Reflection" items={[{ label: 'Summary', value: virtueReflection.summary }, { label: 'Growth evidence', value: virtueReflection.growthEvidence }, { label: 'Adjustments', value: virtueReflection.suggestedAdjustments }]} />}
      {notice && <p className={notice.includes('shame') ? 'sf-warning' : 'sf-success'}>{notice}</p>}
    </section>
  )
}

function VirtuePracticeCard({ practice }) {
  return <article className="sf-prayer"><b>{practice.title}</b><p>{practice.instructions}</p><span>{practice.practiceType} · {practice.durationMinutes || 5} min</span></article>
}

export function VicePatternAnalyzer({ userId, observations, patterns, onSaveObservation, onSavePattern }) {
  const [text, setText] = useState('I replied harshly because I needed to control the conversation')
  const [analysis, setAnalysis] = useState(null)
  const [notice, setNotice] = useState('')

  function analyze() {
    const result = detectVices(text, { source: 'manual' })
    if (result.routed) {
      setNotice(result.guidance.message)
      return
    }
    setAnalysis(result.analysis)
    setNotice(result.guidance.message)
  }

  function save() {
    const result = createViceObservation(userId, { situationSummary: text, behavior: text, contextLabel: 'manual', emotionBefore: ['pressure'] })
    if (result.routed) {
      setNotice(result.guidance.message)
      return
    }
    onSaveObservation(result.observation)
    onSavePattern(result.pattern)
    setAnalysis(detectVices(text).analysis)
    setNotice('Observation saved. This is a possible pattern, not your identity.')
  }

  return (
    <section className="sf-section">
      <div className="sf-section-heading"><h2>Vice Pattern Detection / 罪性模式识别</h2><p>Notice possible recurring patterns without shame or identity labels.</p></div>
      <article className="sf-card sf-flow-card">
        <label>Situation<textarea value={text} onChange={(event) => setText(event.target.value)} /></label>
        <button className="sf-primary" type="button" onClick={analyze}>Analyze Pattern</button>
        {analysis && (
          <div className="sf-success">
            <b>{analysis.toneWarning}</b>
            <p>{analysis.surfaceBehavior}</p>
            <p>Possible vices: {analysis.possibleVices.map((item) => `${item.viceKey} (${Math.round(item.confidence * 100)}%)`).join(', ')}</p>
            <p>Opposite virtues: {analysis.oppositeVirtues.join(', ')}</p>
            <p>{analysis.suggestedNextStep}</p>
            <button type="button" onClick={save}>Confirm and Save Observation</button>
          </div>
        )}
      </article>
      <div className="sf-home-grid">
        <SummaryCard title="Watch Patterns" items={[{ label: 'Patterns', value: patterns.map((pattern) => pattern.title) }, { label: 'Observations', value: String(observations.length) }]} />
        <article className="sf-card"><h3>Seed Vices</h3><div className="sf-chip-row">{vices.map((vice) => <span className="sf-chip" key={vice.key}>{vice.displayName}</span>)}</div></article>
      </div>
      {notice && <p className={notice.includes('shame') || notice.includes('crisis') ? 'sf-warning' : 'sf-success'}>{notice}</p>}
    </section>
  )
}

export function TemptationResistancePlan({ userId, plans, checkins, onSavePlan, onSaveCheckin, onSaveFailureReview }) {
  const [typeKey, setTypeKey] = useState('anger')
  const [text, setText] = useState('I am tempted right now to answer in anger')
  const [intensity, setIntensity] = useState(6)
  const [response, setResponse] = useState(null)
  const [activePlan, setActivePlan] = useState(plans.find((plan) => plan.status === 'active') || null)
  const [notice, setNotice] = useState('')

  function createPlan() {
    const plan = createTemptationPlan(userId, typeKey)
    onSavePlan(plan)
    setActivePlan(plan)
    setNotice('Temptation plan created.')
  }

  function resist() {
    const result = realTimeResistance(userId, text, { intensity })
    if (result.routed) {
      setNotice(result.response.message)
      return
    }
    setResponse(result.response)
  }

  function logOutcome(outcome = 'resisted') {
    const plan = activePlan || createTemptationPlan(userId, typeKey)
    if (!activePlan) onSavePlan(plan)
    const result = createTemptationCheckin(userId, plan, { triggerText: text, temptationIntensityBefore: intensity, outcome })
    if (result.routed) {
      setNotice(result.guidance.message)
      return
    }
    onSaveCheckin(result.checkin)
    if (outcome === 'failed') {
      const review = reviewTemptationFailure(userId, result.checkin, { whatHappened: text, shameLevel: 5 })
      onSaveFailureReview(review)
      setNotice('Failure review created. Route gently to confession and adjust one trigger.')
    } else {
      setNotice('Temptation check-in saved.')
    }
  }

  return (
    <section className="sf-section">
      <div className="sf-section-heading"><h2>Temptation Resistance / 试探抵抗</h2><p>Temptation is not identity. Choose escape, replacement, and support early.</p></div>
      <div className="sf-home-grid">
        <article className="sf-card sf-flow-card">
          <h3>Create Plan</h3>
          <label>Type<select value={typeKey} onChange={(event) => setTypeKey(event.target.value)}>{temptationTypes.map((type) => <option key={type.key} value={type.key}>{type.displayName}</option>)}</select></label>
          <button className="sf-primary" type="button" onClick={createPlan}>Create Temptation Plan</button>
          {activePlan && <SummaryCard title={activePlan.title} items={[{ label: 'Warning signs', value: activePlan.earlyWarningSigns }, { label: 'Escape', value: activePlan.escapeActions }, { label: 'Replacement', value: activePlan.replacementActions }]} />}
        </article>
        <article className="sf-card sf-flow-card">
          <h3>Real-time resistance</h3>
          <label>Temptation moment<textarea value={text} onChange={(event) => setText(event.target.value)} /></label>
          <label>Intensity: {intensity}<input type="range" min="0" max="10" value={intensity} onChange={(event) => setIntensity(Number(event.target.value))} /></label>
          <button className="sf-primary" type="button" onClick={resist}>Get Resistance Guidance</button>
          {response && <div className="sf-success"><b>{response.message}</b><p>{response.firstStep}</p><p>Escape: {response.escapeActions.join(', ')}</p><p>Replacement: {response.replacementActions.join(', ')}</p><p>{response.accountabilitySuggestion}</p></div>}
          <div className="sf-plan-actions"><button type="button" onClick={() => logOutcome('resisted')}>Log Resisted</button><button type="button" onClick={() => logOutcome('failed')}>Log Failure Review</button></div>
        </article>
      </div>
      <SummaryCard title="Temptation Summary" items={[{ label: 'Plans', value: String(plans.length) }, { label: 'Check-ins', value: String(checkins.length) }]} />
      {notice && <p className={notice.includes('Failure') || notice.includes('crisis') ? 'sf-warning' : 'sf-success'}>{notice}</p>}
    </section>
  )
}

export function FruitOfSpiritTracker({ userId, assessments, feedbackRequests, onSaveAssessment, onSaveFeedback }) {
  const [scores, setScores] = useState(() => Object.fromEntries(fruitDimensions.map((dimension) => [dimension.key, 5])))
  const [evidence, setEvidence] = useState('')
  const [notice, setNotice] = useState('')
  const trends = calculateFruitTrends(userId, assessments)
  const insight = generateFruitInsight(userId, assessments)

  function saveAssessment() {
    const result = createFruitAssessment(userId, {
      scores,
      evidence: Object.fromEntries(fruitDimensions.map((dimension) => [dimension.key, evidence])),
      contextLabel: 'overall',
      notes: 'Weekly self-reflection indicator.',
    })
    if (result.routed) {
      setNotice(result.guidance.message)
      return
    }
    onSaveAssessment(result.assessment)
    setNotice(result.guidance.message)
  }

  function draftFeedback() {
    const request = createFruitFeedbackRequest(userId, { recipientLabel: 'mentor', requestedDimensions: ['love', 'patience', 'self_control'] })
    onSaveFeedback(request)
    setNotice('Feedback request drafted.')
  }

  return (
    <section className="sf-section">
      <div className="sf-section-heading"><h2>Fruit of the Spirit Tracker / 圣灵果子追踪</h2><p>Humble long-term indicators, not spiritual ranking.</p></div>
      <article className="sf-card sf-flow-card">
        <h3>Self Assessment</h3>
        <div className="sf-home-grid">{fruitDimensions.map((dimension) => <label key={dimension.key}>{dimension.displayName}: {scores[dimension.key]}<input type="range" min="1" max="10" value={scores[dimension.key]} onChange={(event) => setScores({ ...scores, [dimension.key]: Number(event.target.value) })} /></label>)}</div>
        <label>Evidence<textarea value={evidence} onChange={(event) => setEvidence(event.target.value)} placeholder="Where did fruit appear or feel resisted?" /></label>
        <button className="sf-primary" type="button" onClick={saveAssessment}>Save Fruit Assessment</button>
      </article>
      <div className="sf-home-grid">
        <SummaryCard title="Fruit Growth Insight" items={[{ label: 'Summary', value: insight.summary }, { label: 'Virtues to cultivate', value: insight.relatedVirtuesToCultivate }, { label: 'Vices to watch', value: insight.relatedVicesToWatch }, { label: 'Practices', value: insight.recommendedPractices }]} />
        <article className="sf-card"><h3>Fruit Trends</h3>{trends.map((trend) => <div className="sf-insight-row" key={trend.fruitKey}><b>{trend.displayName}</b><p>Latest {trend.latestScore || '—'} · avg {trend.averageScore || '—'} · delta {trend.delta}</p><span>{trend.suggestedPractice}</span></div>)}</article>
        <article className="sf-card sf-flow-card"><h3>Feedback Request</h3><p>Ask a trusted believer for one encouragement and one growth area.</p><button type="button" onClick={draftFeedback}>Draft Feedback Request</button><p className="sf-muted">{feedbackRequests.length} draft(s)</p></article>
      </div>
      {notice && <p className={notice.includes('shame') ? 'sf-warning' : 'sf-success'}>{notice}</p>}
    </section>
  )
}

export default function VirtueViceDashboard({ userId }) {
  const [tab, setTab] = useState('dashboard')
  const [refreshKey, setRefreshKey] = useState(0)
  const [intentText, setIntentText] = useState('I keep losing patience with my family')
  const [route, setRoute] = useState(null)
  const data = useMemo(() => loadVirtueViceData(userId), [userId, refreshKey])
  const dashboard = useMemo(() => buildVirtueViceDashboard({ userId, ...data }), [userId, data])

  function refresh() {
    setRefreshKey((value) => value + 1)
  }

  function saveAndRefresh(fn, value) {
    fn(value)
    refresh()
  }

  return (
    <section className="sf-section virtue-vice">
      <div className="sf-section-heading"><h2>Virtue & Vice Formation OS / 德性与罪性塑造系统</h2><p>{MODULE_DISCLAIMER}</p></div>
      <MiniTabs active={tab} onChange={setTab} />
      {tab === 'dashboard' && (
        <>
          <div className="sf-home-grid">
            <article className="sf-card"><h3>Active Virtue Focus</h3><p>{dashboard.today.activeVirtueFocuses[0]?.virtue.displayName || 'No active focus'}</p><button type="button" onClick={() => setTab('virtues')}>Open Virtues</button></article>
            <article className="sf-card"><h3>Watch Patterns</h3><p>{dashboard.today.activeVicePatterns.length} pattern(s)</p><button type="button" onClick={() => setTab('vices')}>Analyze Pattern</button></article>
            <article className="sf-card"><h3>Temptation Plans</h3><p>{dashboard.today.activeTemptationPlans.length} active plan(s)</p><button type="button" onClick={() => setTab('temptation')}>Open Resistance</button></article>
            <article className="sf-card"><h3>Fruit Snapshot</h3><p>{dashboard.today.fruitAssessmentDue ? 'Assessment due' : 'Assessment complete today'}</p><button type="button" onClick={() => setTab('fruit')}>Open Fruit Tracker</button></article>
          </div>
          <article className="sf-card sf-flow-card">
            <h3>Virtue/Vice Orchestrator</h3>
            <label>Intent<textarea value={intentText} onChange={(event) => setIntentText(event.target.value)} /></label>
            <button type="button" onClick={() => setRoute(orchestrateVirtueViceIntent(userId, intentText, { emotion: 'anger', lifeContext: 'family' }))}>Route Intent</button>
            {route && <p className={route.route === 'crisis_care' ? 'sf-warning' : 'sf-success'}>{route.route}: {route.message}</p>}
          </article>
          <SummaryCard title="Weekly Formation Review" items={[{ label: 'Virtue logs', value: String(dashboard.weeklySummary.virtuePracticesLogged) }, { label: 'Vice observations', value: String(dashboard.weeklySummary.viceObservationsLogged) }, { label: 'Temptation check-ins', value: String(dashboard.weeklySummary.temptationCheckins) }, { label: 'Resistance success', value: String(dashboard.weeklySummary.resistanceSuccessCount) }, { label: 'Fruit assessments', value: String(dashboard.weeklySummary.fruitAssessmentsCompleted) }]} />
          <article className="sf-card"><h3>Today’s Practice</h3><p>{dashboard.today.recommendedPractice.title}</p><p>{dashboard.today.recommendedPractice.instructions}</p></article>
        </>
      )}
      {tab === 'virtues' && <VirtueDashboard userId={userId} focuses={data.focuses} logs={data.virtueLogs} onSaveFocus={(focus) => saveAndRefresh(saveVirtueFocus, focus)} onSaveLog={(log) => saveAndRefresh(saveVirtueLog, log)} />}
      {tab === 'vices' && <VicePatternAnalyzer userId={userId} observations={data.observations} patterns={data.patterns} onSaveObservation={(observation) => saveAndRefresh(saveViceObservation, observation)} onSavePattern={(pattern) => saveAndRefresh(saveVicePattern, pattern)} />}
      {tab === 'temptation' && <TemptationResistancePlan userId={userId} plans={data.temptationPlans} checkins={data.temptationCheckins} onSavePlan={(plan) => saveAndRefresh(saveTemptationPlan, plan)} onSaveCheckin={(checkin) => saveAndRefresh(saveTemptationCheckin, checkin)} onSaveFailureReview={(review) => saveAndRefresh(saveFailureReview, review)} />}
      {tab === 'fruit' && <FruitOfSpiritTracker userId={userId} assessments={data.fruitAssessments} feedbackRequests={data.feedbackRequests} onSaveAssessment={(assessment) => saveAndRefresh(saveFruitAssessment, assessment)} onSaveFeedback={(request) => saveAndRefresh(saveFruitFeedbackRequest, request)} />}
      <article className="sf-card"><h3>Seed Formation Library</h3><div className="sf-chip-row">{virtues.map((virtue) => <span className="sf-chip" key={virtue.key}>{virtue.displayName}</span>)}</div><div className="sf-chip-row">{fruitDimensions.map((fruit) => <span className="sf-chip" key={fruit.key}>{fruit.displayName}</span>)}</div></article>
    </section>
  )
}
