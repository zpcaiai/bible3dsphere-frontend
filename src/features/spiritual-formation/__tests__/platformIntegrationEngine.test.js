import { describe, expect, it } from 'vitest'
import {
  aggregateFormationMetrics,
  buildMasterRoadmap,
  buildProductizationDashboard,
  checkConsentPermission,
  createAnalyticsReport,
  createApologeticsDialogue,
  createDeploymentHealthCheck,
  createDoctrineLearningPath,
  createGlobalFormationSession,
  createGraceEvidence,
  createModerationCase,
  createOrganization,
  createSpiritualProfile,
  createTutorConversation,
  findBibleRelationshipPath,
  generateDailyFormationPlan,
  generateWeeklyFormationReview,
  getBibleCharacterProfile,
  registerAllModules,
  registerAllSkills,
  routeFormationIntent,
  routeSafetyFirst,
  searchBibleCharacters,
} from '../lib/platformIntegrationEngine'
import { bibleCharacters, skillRegistry } from '../data/platformIntegrationSeed'

describe('Platform integration engine for Batches 9-13', () => {
  it('supports Bible graph, doctrine path, and apologetics dialogue', () => {
    const results = searchBibleCharacters('David')
    const profile = getBibleCharacterProfile('David')
    const path = findBibleRelationshipPath('David', 'Jesus')
    const doctrinePath = createDoctrineLearningPath('u1', 'christology')
    const dialogue = createApologeticsDialogue('u1', 'problem_of_evil', 'How should we speak about suffering?')

    expect(bibleCharacters.length).toBeGreaterThanOrEqual(120)
    expect(results[0].displayName).toBe('David')
    expect(profile.formationInsights[0].linkedModules).toContain('virtue_vice')
    expect(path.path.some((step) => step.to === 'Jesus')).toBe(true)
    expect(doctrinePath.lessons.length).toBeGreaterThan(0)
    expect(dialogue.cautions.join(' ')).toContain('coerce')
  })

  it('routes AI tutor intents and creates gentle plans/reviews', () => {
    const route = routeFormationIntent('u1', 'I need prayer help')
    const crisis = routeFormationIntent('u1', 'I will kill myself now')
    const profile = createSpiritualProfile('u1')
    const plan = generateDailyFormationPlan('u1', {}, 'I am burned out')
    const review = generateWeeklyFormationReview('u1')
    const conversation = createTutorConversation('u1', 'Help me with Bible doctrine')

    expect(route.module).toBe('prayer_communion')
    expect(crisis.blockedNormalFormation).toBe(true)
    expect(profile.consentSettings.aiTutor).toBe(true)
    expect(plan.practices).toHaveLength(1)
    expect(review.summary).toContain('without spiritual ranking')
    expect(conversation.route.module).toBe('bible_doctrine')
  })

  it('aggregates analytics, reports, and audits without ranking language', () => {
    const aggregated = aggregateFormationMetrics('u1', { active_overload_signal_count: 1 })
    const grace = createGraceEvidence('u1')
    const report = createAnalyticsReport('u1', aggregated.values, [grace], aggregated.overloadSignals)

    expect(aggregated.values.length).toBeGreaterThan(5)
    expect(aggregated.overloadSignals[0].recommendedResponse).toContain('Simplify')
    expect(report.summary).toContain('not a holiness score')
    expect(report.mentorSafeSummary).toContain('Redacted')
  })

  it('creates productization artifacts with crisis-safe billing guardrails', () => {
    const org = createOrganization('u1')
    const moderation = createModerationCase('u1', org)
    const health = createDeploymentHealthCheck('u1')
    const dashboard = buildProductizationDashboard({ organizations: [org], moderationCases: [moderation], deploymentHealthChecks: [health] }, 'u1')

    expect(org.status).toBe('active')
    expect(moderation.auditRequired).toBe(true)
    expect(health.checks.some((check) => check.key === 'crisis_availability')).toBe(true)
    expect(dashboard.guardrails.join(' ')).toContain('Billing never blocks crisis')
  })

  it('registers full master build modules, skills, safety, consent, and roadmap', () => {
    const modules = registerAllModules()
    const skills = registerAllSkills()
    const session = createGlobalFormationSession('u1', { userIntent: 'Integrate safely' })
    const unsafeRoute = routeSafetyFirst('u1', 'I will hurt myself', 'master_build')
    const permission = checkConsentPermission({ consent: true, permission: true, sensitivityLevel: 'care_sensitive' })
    const roadmap = buildMasterRoadmap()

    expect(modules).toHaveLength(13)
    expect(skills).toHaveLength(52)
    expect(skillRegistry).toHaveLength(52)
    expect(session.status).toBe('started')
    expect(unsafeRoute.blockedNormalFormation).toBe(true)
    expect(permission.redactionRequired).toBe(true)
    expect(roadmap.acceptanceMatrix).toHaveLength(13)
  })
})
