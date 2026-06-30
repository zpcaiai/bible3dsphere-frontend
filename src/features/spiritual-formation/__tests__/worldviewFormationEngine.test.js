import { describe, expect, it } from 'vitest'
import {
  buildWorldviewDashboard,
  createBeliefObservation,
  createGospelReframingSession,
  createIdolObservation,
  createDecisionSession,
  diagnoseBeliefs,
  detectIdols,
  generateDecisionSummary,
  generateFullReframing,
  oneShotDiscernment,
  orchestrateWorldviewIntent,
  recommendValueWeights,
  addDecisionOption,
} from '../lib/worldviewFormationEngine'

describe('Worldview Formation OS Expansion engine', () => {
  it('diagnoses possible performance identity belief and creates pattern', () => {
    const result = diagnoseBeliefs('u1', 'I feel anxious when I am not productive and I feel worthless when I fail at work.')
    const created = createBeliefObservation('u1', { situation: result.analysis.presentingIssue })

    expect(result.analysis.possibleBeliefs[0].distortionType).toBe('performance_identity')
    expect(result.analysis.gospelTruthNeeded[0]).toContain('Identity is received')
    expect(created.pattern.title).toContain('Work')
  })

  it('maps possible control idol and recommends surrender practice', () => {
    const result = detectIdols('u1', 'I get angry when plans change because I must control the outcome.')
    const created = createIdolObservation('u1', { triggeringEvent: 'plan changed', blockedDesire: 'control the outcome' })

    expect(result.analysis.possibleIdols[0].idolKey).toBe('control')
    expect(result.analysis.surrenderPractice.title).toContain('Control')
    expect(created.pattern.replacementWorshipPractices.length).toBeGreaterThan(0)
  })

  it('generates non-simplistic gospel reframing and allows grief lament', () => {
    const result = generateFullReframing('u1', 'I am grieving a loss and do not want a forced happy ending.')
    const session = createGospelReframingSession('u1', { originalSituation: 'I failed at work and feel worthless.' })

    expect(result.reframing.situationType).toBe('grief')
    expect(result.reframing.fall.diagnosis).toContain('lament')
    expect(session.session.status).toBe('completed')
    expect(session.actions.length).toBe(2)
  })

  it('runs decision discernment with anti-divination and high-stakes caution', () => {
    const result = oneShotDiscernment('u1', 'Should I accept this new job?', ['Accept', 'Stay', 'Delay'], { hasCounsel: false })
    const medical = oneShotDiscernment('u1', 'Should I choose this medical surgery?', [], {})

    expect(result.discernment.cautions.join(' ')).toContain('not a revelation')
    expect(result.discernment.optionScores.length).toBe(3)
    expect(medical.discernment.confidenceLevel).toBe('low')
    expect(medical.discernment.cautions.join(' ')).toContain('qualified professionals')
  })

  it('summarizes decision and builds dashboard/orchestrator routes', () => {
    const session = createDecisionSession('u1', { decisionTitle: 'Job decision', decisionQuestion: 'Should I take this job?' })
    const option = addDecisionOption('u1', session, { label: 'Accept the job' })
    const weights = recommendValueWeights('u1', session)
    const summary = generateDecisionSummary('u1', session, [option], [], weights, [])
    const belief = createBeliefObservation('u1', { situation: 'I feel worthless when not productive' })
    const idol = createIdolObservation('u1', { triggeringEvent: 'plan changed', blockedDesire: 'control' })
    const dashboard = buildWorldviewDashboard({
      userId: 'u1',
      beliefPatterns: [belief.pattern],
      idolPatterns: [idol.pattern],
      beliefObservations: [belief.observation],
      idolObservations: [idol.observation],
      gospelSessions: [],
      gospelActions: [],
      decisionSessions: [session],
    })

    expect(summary.waitOrActRecommendation).toBe('seek_counsel')
    expect(dashboard.today.activeBeliefPatterns).toHaveLength(1)
    expect(orchestrateWorldviewIntent('u1', 'What idol is operating here?').route).toBe('idol_mapping')
    expect(orchestrateWorldviewIntent('u1', "I need to know God's will for this job").route).toBe('decision_discernment')
    expect(orchestrateWorldviewIntent('u1', 'I am in danger from abuse').route).toBe('crisis_care')
  })
})
