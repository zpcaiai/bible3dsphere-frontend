import { describe, expect, it } from 'vitest'
import {
  addCareLog,
  addHealingEntry,
  buildSufferingCareDashboard,
  createCareCase,
  createCareFollowup,
  createCarePlan,
  createCareRelationshipRequest,
  createForgivenessBoundaryPlan,
  createHealingJourney,
  createSafetyPlan,
  createSufferingSession,
  generateRoleAwareSummary,
  grantConsent,
  orchestrateSufferingCareIntent,
  reflectOnSuffering,
  recommendEscalation,
  triageText,
} from '../lib/sufferingCareEngine'

describe('Suffering, Crisis & Healing Formation OS engine', () => {
  it('reflects on grief without cheap positivity', () => {
    const result = reflectOnSuffering('u1', 'I am grieving a real loss and do not want forced positivity.')
    const session = createSufferingSession('u1', { situationText: 'I am grieving a death.', painLevel: 8 })

    expect(result.reflection.category).toBe('grief')
    expect(result.reflection.lamentPermission).toContain('honestly')
    expect(result.reflection.falseExplanationsToReject.join(' ')).toContain('pretend')
    expect(session.summary.pastoralCareRecommended).toBe(true)
  })

  it('triages imminent crisis and creates safety plan', () => {
    const triage = triageText('u1', 'I have pills ready and will kill myself now.')
    const plan = createSafetyPlan('u1', { crisisEventId: triage.event.id })

    expect(triage.assessment.riskLevel).toBe('imminent')
    expect(triage.response.blockNormalFormation).toBe(true)
    expect(triage.response.immediateSteps[0]).toContain('emergency services')
    expect(plan.meansSafetySteps[0]).toContain('means of harm')
  })

  it('creates healing journey, entry, and unsafe forgiveness boundary warning', () => {
    const created = createHealingJourney('u1', { description: 'I need healing from grief and relational pain.' })
    const entry = addHealingEntry('u1', created.journey, { userReflection: 'I named one grief gently.' })
    const boundary = createForgivenessBoundaryPlan('u1', created.journey, { harmSummary: 'There was abuse and unsafe contact pressure.', contactContext: 'unsafe' })

    expect(created.journey.status).toBe('active')
    expect(entry.entry.truthNamed).toContain('without shame')
    expect(boundary.plan.reconciliationStatus).toBe('unsafe')
    expect(boundary.plan.unsafeContactWarning).toBe(true)
  })

  it('handles pastoral care consent, case, plan, follow-up, and redacted summary', () => {
    const relationship = grantConsent(createCareRelationshipRequest('u1', 'mentor1', 'mentor', 'crisis_flags_only'))
    const careCase = createCareCase('u1', { title: 'Crisis follow-up', summary: 'abuse concern and severe despair', primaryCaregiverUserId: 'mentor1' })
    const log = addCareLog('mentor1', careCase, { summary: 'Checked safety and prayed.', visibleToReceiver: false })
    const plan = createCarePlan('mentor1', careCase, {})
    const followup = createCareFollowup('mentor1', careCase, {})
    const summary = generateRoleAwareSummary('mentor1', careCase, 'mentor_view', relationship.permissionScope)

    expect(relationship.status).toBe('active')
    expect(careCase.severity).toBe('high')
    expect(log.privateCaregiverNote).toBe('')
    expect(plan.professionalSupport.length).toBeGreaterThan(0)
    expect(followup.followupType).toBe('safety_check')
    expect(summary.summary).toContain('Risk level')
    expect(recommendEscalation(careCase)).toContain('Professional support')
  })

  it('builds dashboard and routes orchestrator intents safely', () => {
    const healing = createHealingJourney('u1', { description: 'grief support' }).journey
    const careCase = createCareCase('u1', { title: 'Grief support', summary: 'grief support' })
    const dashboard = buildSufferingCareDashboard({
      userId: 'u1',
      healingJourneys: [healing],
      careCases: [careCase],
      sufferingSessions: [],
      safetyPlans: [],
      careFollowups: [],
      healingEntries: [],
      careLogs: [],
    })

    expect(dashboard.today.activeHealingJourneys).toHaveLength(1)
    expect(orchestrateSufferingCareIntent('u1', 'I want to hurt myself tonight').route).toBe('crisis_triage')
    expect(orchestrateSufferingCareIntent('u1', 'I need to forgive someone but contact is unsafe').route).toBe('healing_journey')
    expect(orchestrateSufferingCareIntent('u1', 'My small group leader should follow up').route).toBe('pastoral_care')
  })
})
