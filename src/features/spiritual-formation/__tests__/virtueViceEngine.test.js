import { describe, expect, it } from 'vitest'
import {
  buildVirtueViceDashboard,
  createFruitAssessment,
  createTemptationCheckin,
  createTemptationPlan,
  createViceObservation,
  createVirtueFocus,
  detectVices,
  generateFruitInsight,
  logVirtuePractice,
  orchestrateVirtueViceIntent,
  realTimeResistance,
  recommendVirtues,
  suggestVirtuePractices,
} from '../lib/virtueViceEngine'

describe('Virtue & Vice Formation OS engine', () => {
  it('recommends virtues from anger and logs a practice', () => {
    const virtue = recommendVirtues('I reacted in anger during family conflict')[0]
    const focus = createVirtueFocus('u1', virtue.key)
    const practice = suggestVirtuePractices(focus)[0]
    const result = logVirtuePractice('u1', focus, practice, { userReflection: 'I paused before replying.', graceNoticed: 'A small restraint.' })

    expect(virtue.key).toBe('patience')
    expect(practice.title).toContain('Patience')
    expect(result.log.completed).toBe(true)
  })

  it('detects possible vice patterns without identity labels', () => {
    const result = detectVices('I replied harshly because I needed to control the conversation')

    expect(result.analysis.possibleVices.map((item) => item.viceKey)).toContain('anger')
    expect(result.analysis.toneWarning).toContain('not treat this as identity')
  })

  it('creates observation and pattern', () => {
    const result = createViceObservation('u1', { behavior: 'I was angry and controlling', contextLabel: 'work' })

    expect(result.observation.aiSuggestedVices.length).toBeGreaterThan(0)
    expect(result.pattern.observationCount).toBe(1)
  })

  it('returns real-time temptation resistance guidance', () => {
    const plan = createTemptationPlan('u1', 'anger')
    const guidance = realTimeResistance('u1', 'I am tempted right now to answer in anger', { intensity: 8 }).response
    const checkin = createTemptationCheckin('u1', plan, { triggerText: 'angry reply', temptationIntensityBefore: 8 }).checkin

    expect(guidance.escapeActions.length).toBeGreaterThan(0)
    expect(guidance.accountabilitySuggestion).toContain('trusted mature believer')
    expect(checkin.outcome).toBe('resisted')
  })

  it('creates fruit assessment and insight', () => {
    const assessment = createFruitAssessment('u1', { scores: { patience: 3, love: 7 }, evidence: { patience: 'family conflict was hard' } }).assessment
    const insight = generateFruitInsight('u1', [assessment])

    expect(assessment.scores).toHaveLength(9)
    expect(insight.summary).toContain('may need attention')
  })

  it('routes intent and crisis safely', () => {
    expect(orchestrateVirtueViceIntent('u1', 'I keep getting angry', {}).route).toBe('vice')
    expect(orchestrateVirtueViceIntent('u1', 'I am being tempted right now', {}).route).toBe('temptation')
    expect(orchestrateVirtueViceIntent('u1', 'I might hurt myself tonight', {}).route).toBe('crisis_care')
  })

  it('builds dashboard summary', () => {
    const focus = createVirtueFocus('u1', 'humility')
    const plan = createTemptationPlan('u1', 'control')
    const dashboard = buildVirtueViceDashboard({ userId: 'u1', focuses: [focus], temptationPlans: [plan], patterns: [], temptationCheckins: [], fruitAssessments: [], virtueLogs: [], observations: [] })

    expect(dashboard.today.activeVirtueFocuses).toHaveLength(1)
    expect(dashboard.today.activeTemptationPlans).toHaveLength(1)
    expect(dashboard.today.fruitAssessmentDue).toBe(true)
  })
})
