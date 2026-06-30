import { detectCrisisMarkers, todayKey, uid } from './scriptureFormationEngine'
import { fruitDimensions, temptationTypes, vices, virtuePractices, virtues } from '../data/virtueViceSeed'

const SHAME_PATTERNS = [/i am my sin/i, /worthless/i, /never change/i, /punish myself/i, /无法改变/, /我就是.*罪/, /惩罚自己/, /没救/]

export function detectFormationSafety(text = '') {
  const crisis = detectCrisisMarkers(text)
  if (crisis) return crisis
  if (SHAME_PATTERNS.some((pattern) => pattern.test(String(text || '')))) {
    return {
      route: 'pastoral_care',
      recommendedNextSystem: 'pastoral_or_clinical_support',
      message: 'This sounds like a shame spiral or scrupulosity risk. Reduce self-monitoring intensity and seek gentle pastoral care; clinical support may also help if anxiety is intense.',
    }
  }
  return null
}

export function recommendVirtues(contextText = '', desiredGrowth = '') {
  const input = `${contextText} ${desiredGrowth}`.toLowerCase()
  const keys = /anger|conflict|harsh|怒|冲突/.test(input) ? ['patience', 'gentleness', 'humility', 'self_control']
    : /anxiety|fear|怕|焦虑/.test(input) ? ['faith', 'hope', 'courage']
      : /pride|leadership|approval|骄傲|领导/.test(input) ? ['humility', 'wisdom', 'love']
        : /money|possessions|scarcity|钱|财/.test(input) ? ['generosity', 'gratitude', 'self_control']
          : /lust|purity|sexual|情欲/.test(input) ? ['purity', 'self_control', 'love', 'wisdom']
            : /lazy|avoid|sloth|懒|逃避/.test(input) ? ['perseverance', 'courage', 'faith']
              : /speech|words|说话| harsh/.test(input) ? ['gentleness', 'truthfulness', 'love']
                : /despair|suffer|绝望|苦/.test(input) ? ['hope', 'perseverance', 'faith']
                  : /cold|mercy|冷漠/.test(input) ? ['love', 'mercy', 'gratitude']
                    : ['wisdom', 'faith', 'love']
  return keys.map((key) => virtues.find((virtue) => virtue.key === key)).filter(Boolean)
}

export function createVirtueFocus(userId, virtueKey, data = {}) {
  const virtue = virtues.find((item) => item.key === virtueKey) || virtues[0]
  const now = new Date().toISOString()
  return {
    id: uid('virtue_focus'),
    userId,
    virtueId: virtue.id,
    virtueKey: virtue.key,
    virtue,
    focusReason: data.focusReason || `Cultivate ${virtue.displayName} in ordinary obedience.`,
    startDate: todayKey(),
    endDate: data.endDate || '',
    status: 'active',
    targetContexts: data.targetContexts || [],
    baselineSelfScore: Number(data.baselineSelfScore || 5),
    currentSelfScore: Number(data.currentSelfScore || data.baselineSelfScore || 5),
    mentorFeedbackScore: null,
    createdAt: now,
    updatedAt: now,
  }
}

export function suggestVirtuePractices(focus) {
  return virtuePractices.filter((practice) => practice.virtueKey === focus.virtueKey).slice(0, 5)
}

export function logVirtuePractice(userId, focus, practice, data = {}) {
  const safety = detectFormationSafety(`${data.userReflection || ''} ${data.graceNoticed || ''}`)
  if (safety) return { log: null, guidance: safety, routed: true }
  return {
    log: {
      id: uid('virtue_log'),
      userId,
      virtueFocusId: focus.id,
      virtuePracticeId: practice?.id || null,
      practicedAt: new Date().toISOString(),
      contextLabel: data.contextLabel || 'ordinary life',
      completed: true,
      userReflection: data.userReflection || '',
      difficultyScore: Number(data.difficultyScore || 5),
      graceNoticed: data.graceNoticed || '',
      nextStep: data.nextStep || 'Repeat one small practice tomorrow.',
      createdAt: new Date().toISOString(),
    },
    guidance: { message: 'Practice logged. Grace-driven effort is not a scorecard.' },
    routed: false,
  }
}

export function generateVirtueReflection(userId, focus, logs = []) {
  const mine = logs.filter((log) => log.userId === userId && log.virtueFocusId === focus.id)
  return {
    id: uid('virtue_reflection'),
    userId,
    virtueFocusId: focus.id,
    reflectionPeriodStart: focus.startDate,
    reflectionPeriodEnd: todayKey(),
    growthEvidence: mine.filter((log) => log.graceNoticed).map((log) => log.graceNoticed).slice(0, 4),
    struggleEvidence: mine.filter((log) => log.difficultyScore >= 7).map((log) => log.contextLabel).slice(0, 4),
    suggestedAdjustments: mine.length > 7 ? ['Reduce logging frequency if self-monitoring feels heavy.'] : ['Keep one practice small and repeatable.'],
    summary: mine.length ? `${focus.virtue.displayName} has ${mine.length} practice log(s). Look for concrete grace, not perfection.` : `Begin with one small ${focus.virtue.displayName.toLowerCase()} practice.`,
    createdAt: new Date().toISOString(),
  }
}

export function detectVices(text = '', context = {}) {
  const safety = detectFormationSafety(text)
  if (safety) return { analysis: null, guidance: safety, routed: true }
  const input = `${text} ${JSON.stringify(context)}`.toLowerCase()
  const possible = vices.map((vice) => {
    const haystack = [vice.key, vice.displayName, ...(vice.commonExpressions || []), ...(vice.underlyingDesires || [])].join(' ').toLowerCase()
    let score = 0
    if (new RegExp(vice.key.replace('_', ' '), 'i').test(input)) score += 0.4
    if (vice.key === 'anger' && /anger|angry|harsh|reply|resent|怒|骂/.test(input)) score += 0.72
    if (vice.key === 'pride' && /pride|superior|credit|recognition|自高|面子/.test(input)) score += 0.68
    if (vice.key === 'control' && /control|must|manage|掌控/.test(input)) score += 0.68
    if (vice.key === 'lust' && /lust|porn|sexual|情欲/.test(input)) score += 0.7
    if (vice.key === 'sloth' && /avoid|lazy|procrastinat|逃避|拖延/.test(input)) score += 0.65
    if (haystack.split(/\s+/).some((word) => word.length > 4 && input.includes(word))) score += 0.2
    return { vice, confidence: Math.min(0.95, score) }
  }).filter((item) => item.confidence >= 0.35).sort((a, b) => b.confidence - a.confidence).slice(0, 3)
  const fallback = possible.length ? possible : [{ vice: vices.find((vice) => vice.key === 'other'), confidence: 0.35 }]
  return {
    analysis: {
      surfaceBehavior: summarizeSurfaceBehavior(text),
      possibleVices: fallback.map(({ vice, confidence }) => ({ viceKey: vice.key, confidence, evidence: vice.commonExpressions.slice(0, 3) })),
      underlyingDesires: Array.from(new Set(fallback.flatMap(({ vice }) => vice.underlyingDesires))).slice(0, 4),
      possibleFalseBeliefs: Array.from(new Set(fallback.flatMap(({ vice }) => vice.falseBeliefs))).slice(0, 4),
      oppositeVirtues: Array.from(new Set(fallback.flatMap(({ vice }) => vice.oppositeVirtues))).slice(0, 4),
      suggestedNextStep: 'Before the next response, pause, pray, and choose one concrete opposite virtue.',
      toneWarning: 'Do not treat this as identity. This is a possible pattern to bring into grace.',
    },
    guidance: { message: 'Possible pattern detected. Confirm, edit, or reject the suggestion.' },
    routed: false,
  }
}

export function createViceObservation(userId, data = {}) {
  const result = detectVices(data.behavior || data.situationSummary || '', data)
  if (result.routed) return { observation: null, pattern: null, guidance: result.guidance, routed: true }
  const now = new Date().toISOString()
  const observation = {
    id: uid('vice_observation'),
    userId,
    observedAt: now,
    sourceType: data.sourceType || 'manual',
    sourceId: data.sourceId || null,
    contextLabel: data.contextLabel || 'ordinary life',
    situationSummary: data.situationSummary || '',
    emotionBefore: data.emotionBefore || [],
    behavior: data.behavior || '',
    consequence: data.consequence || '',
    userNamedVices: data.userNamedVices || [],
    aiSuggestedVices: result.analysis.possibleVices.map((item) => item.viceKey),
    confidenceScore: result.analysis.possibleVices[0]?.confidence || 0.35,
    riskFlags: [],
    createdAt: now,
  }
  const vice = vices.find((item) => item.key === observation.aiSuggestedVices[0]) || vices.at(-1)
  return { observation, pattern: createVicePattern(userId, vice, observation), guidance: result.guidance, routed: false }
}

export function createVicePattern(userId, vice, observation) {
  const now = new Date().toISOString()
  return {
    id: uid('vice_pattern'),
    userId,
    viceId: vice.id,
    viceKey: vice.key,
    vice,
    title: `Possible ${vice.displayName} pattern`,
    description: `${vice.displayName} may be appearing in ${observation.contextLabel}.`,
    recurringContexts: [observation.contextLabel].filter(Boolean),
    recurringEmotions: observation.emotionBefore || [],
    recurringDesires: vice.underlyingDesires,
    falseBeliefs: vice.falseBeliefs,
    oppositeVirtues: vice.oppositeVirtues,
    severityLevel: observation.confidenceScore > 0.75 ? 'moderate' : 'low',
    status: 'watching',
    firstObservedAt: observation.observedAt,
    lastObservedAt: observation.observedAt,
    observationCount: 1,
    pastoralCareRecommended: false,
    createdAt: now,
    updatedAt: now,
  }
}

export function realTimeResistance(userId, text = '', context = {}) {
  const safety = detectFormationSafety(text)
  if (safety) return { response: safety, routed: true }
  const input = `${text} ${JSON.stringify(context)}`.toLowerCase()
  const type = temptationTypes.find((item) => input.includes(item.key) || item.commonTriggers.some((trigger) => input.includes(trigger))) || temptationTypes.find((item) => item.key === 'other')
  return {
    response: {
      message: 'This is a temptation moment, not your identity. Choose the next faithful step.',
      temptationType: type,
      firstStep: 'Stop and move your body away from the trigger.',
      escapeActions: type.escapePrinciples,
      replacementActions: type.replacementActions,
      scriptureAnchor: type.scriptureReferences[0],
      accountabilitySuggestion: Number(context.intensity || 0) >= 7 ? 'Message a trusted mature believer if intensity remains above 7/10.' : 'If intensity rises, ask for prayer early.',
      nextEndpoint: '/api/formation/temptation/checkins',
    },
    routed: false,
  }
}

export function createTemptationPlan(userId, typeKey = 'other', data = {}) {
  const type = temptationTypes.find((item) => item.key === typeKey) || temptationTypes.at(-1)
  const now = new Date().toISOString()
  return {
    id: uid('temptation_plan'),
    userId,
    title: data.title || `${type.displayName} resistance plan`,
    temptationTypeId: type.id,
    temptationTypeKey: type.key,
    temptationType: type,
    relatedVicePatternId: data.relatedVicePatternId || null,
    status: 'active',
    vulnerableContexts: data.vulnerableContexts || type.commonTriggers,
    earlyWarningSigns: data.earlyWarningSigns || ['isolation', 'fatigue', 'rationalizing'],
    escapeActions: data.escapeActions || type.escapePrinciples,
    replacementActions: data.replacementActions || type.replacementActions,
    scriptureAnchors: data.scriptureAnchors || type.scriptureReferences,
    accountabilityContacts: data.accountabilityContacts || [],
    emergencyEscalation: { route: 'crisis_care_system if danger appears' },
    createdAt: now,
    updatedAt: now,
  }
}

export function createTemptationCheckin(userId, plan, data = {}) {
  const result = realTimeResistance(userId, data.triggerText || '', { intensity: data.temptationIntensityBefore })
  if (result.routed) return { checkin: null, guidance: result.response, routed: true }
  return {
    checkin: {
      id: uid('temptation_checkin'),
      userId,
      planId: plan?.id || null,
      checkedInAt: new Date().toISOString(),
      contextLabel: data.contextLabel || 'ordinary life',
      temptationIntensityBefore: Number(data.temptationIntensityBefore || 5),
      temptationIntensityAfter: Number(data.temptationIntensityAfter || 3),
      triggerText: data.triggerText || '',
      chosenEscapeAction: data.chosenEscapeAction || result.response.escapeActions[0],
      chosenReplacementAction: data.chosenReplacementAction || result.response.replacementActions[0],
      outcome: data.outcome || 'resisted',
      notes: data.notes || '',
      followupNeeded: Boolean(data.followupNeeded),
      riskFlags: [],
      createdAt: new Date().toISOString(),
    },
    guidance: result.response,
    routed: false,
  }
}

export function reviewTemptationFailure(userId, checkin, data = {}) {
  return {
    id: uid('failure_review'),
    userId,
    checkinId: checkin.id,
    reviewedAt: new Date().toISOString(),
    whatHappened: data.whatHappened || checkin.notes || '',
    triggerChain: data.triggerChain || [checkin.contextLabel, checkin.triggerText].filter(Boolean),
    shameLevel: Number(data.shameLevel || 5),
    confessionSessionId: null,
    repairNeeded: Boolean(data.repairNeeded),
    nextPlanAdjustment: data.nextPlanAdjustment || 'Return gently through confession if needed; adjust one trigger before next time.',
    route: 'confession_repentance',
    createdAt: new Date().toISOString(),
  }
}

export function createFruitAssessment(userId, data = {}) {
  const safety = detectFormationSafety(data.notes || '')
  if (safety) return { assessment: null, guidance: safety, routed: true }
  const now = new Date().toISOString()
  const scores = fruitDimensions.map((dimension) => ({
    id: uid(`fruit_score_${dimension.key}`),
    fruitDimensionId: dimension.id,
    fruitKey: dimension.key,
    dimension,
    score: Number(data.scores?.[dimension.key] ?? 5),
    evidenceText: data.evidence?.[dimension.key] || '',
    growthExample: data.growth?.[dimension.key] || '',
    struggleExample: data.struggle?.[dimension.key] || '',
    createdAt: now,
  }))
  return {
    assessment: {
      id: uid('fruit_assessment'),
      userId,
      assessmentDate: todayKey(),
      assessmentType: data.assessmentType || 'self',
      periodStart: data.periodStart || '',
      periodEnd: data.periodEnd || '',
      contextLabel: data.contextLabel || 'overall',
      notes: data.notes || '',
      scores,
      createdAt: now,
      updatedAt: now,
    },
    guidance: { message: 'Assessment saved as a humble journal indicator, not a spiritual rank.' },
    routed: false,
  }
}

export function calculateFruitTrends(userId, assessments = []) {
  const mine = assessments.filter((assessment) => assessment.userId === userId)
  return fruitDimensions.map((dimension) => {
    const rows = mine.flatMap((assessment) => assessment.scores.filter((score) => score.fruitKey === dimension.key).map((score) => ({ ...score, date: assessment.assessmentDate, contextLabel: assessment.contextLabel })))
    const latest = rows.at(0)
    const previous = rows.at(1)
    const average = rows.length ? rows.reduce((sum, row) => sum + row.score, 0) / rows.length : 0
    return {
      fruitKey: dimension.key,
      displayName: dimension.displayName,
      latestScore: latest?.score || null,
      previousScore: previous?.score || null,
      delta: latest && previous ? latest.score - previous.score : 0,
      averageScore: Math.round(average * 10) / 10,
      evidenceCount: rows.filter((row) => row.evidenceText).length,
      notableContexts: Array.from(new Set(rows.map((row) => row.contextLabel).filter(Boolean))).slice(0, 3),
      suggestedPractice: `Cultivate ${dimension.relatedVirtues[0]} with one small practice this week.`,
    }
  })
}

export function generateFruitInsight(userId, assessments = []) {
  const trends = calculateFruitTrends(userId, assessments)
  const scored = trends.filter((trend) => trend.latestScore != null).sort((a, b) => (a.latestScore || 0) - (b.latestScore || 0))
  const weakest = scored[0]
  const strongest = scored.at(-1)
  return {
    id: uid('fruit_insight'),
    userId,
    insightPeriodStart: '',
    insightPeriodEnd: todayKey(),
    strongestDimensions: strongest ? [strongest.fruitKey] : [],
    weakestDimensions: weakest ? [weakest.fruitKey] : [],
    growthTrends: trends,
    relatedVirtuesToCultivate: weakest ? fruitDimensions.find((dimension) => dimension.key === weakest.fruitKey)?.relatedVirtues || [] : [],
    relatedVicesToWatch: weakest ? fruitDimensions.find((dimension) => dimension.key === weakest.fruitKey)?.opposingVices || [] : [],
    summary: weakest ? `${weakest.displayName} may need attention in ${weakest.notableContexts[0] || 'ordinary life'} contexts.` : 'Complete an assessment to see humble formation indicators.',
    recommendedPractices: weakest ? [weakest.suggestedPractice] : ['Begin with one fruit assessment.'],
    createdAt: new Date().toISOString(),
  }
}

export function createFruitFeedbackRequest(userId, data = {}) {
  return {
    id: uid('fruit_feedback'),
    userId,
    recipientLabel: data.recipientLabel || 'mentor',
    recipientType: data.recipientType || 'mentor',
    requestedDimensions: data.requestedDimensions || ['love', 'patience', 'self_control'],
    requestMessage: data.requestMessage || 'Would you be willing to share one encouragement and one growth area you notice in me?',
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function buildVirtueViceDashboard({ userId, focuses = [], patterns = [], temptationPlans = [], temptationCheckins = [], fruitAssessments = [], virtueLogs = [], observations = [] }) {
  const activeFocuses = focuses.filter((focus) => focus.userId === userId && focus.status === 'active')
  const activePatterns = patterns.filter((pattern) => pattern.userId === userId && ['active', 'watching'].includes(pattern.status))
  const activePlans = temptationPlans.filter((plan) => plan.userId === userId && plan.status === 'active')
  const fruitDue = !fruitAssessments.some((assessment) => assessment.userId === userId && assessment.assessmentDate === todayKey())
  const recommendedPractice = activeFocuses[0] ? suggestVirtuePractices(activeFocuses[0])[0] : virtuePractices[0]
  return {
    today: {
      activeVirtueFocuses: activeFocuses,
      activeVicePatterns: activePatterns,
      activeTemptationPlans: activePlans,
      fruitAssessmentDue: fruitDue,
      recommendedPractice,
      urgentFlags: activePatterns.filter((pattern) => pattern.severityLevel === 'severe'),
    },
    weeklySummary: {
      virtuePracticesLogged: virtueLogs.filter((log) => log.userId === userId).length,
      viceObservationsLogged: observations.filter((observation) => observation.userId === userId).length,
      temptationCheckins: temptationCheckins.filter((checkin) => checkin.userId === userId).length,
      resistanceSuccessCount: temptationCheckins.filter((checkin) => checkin.userId === userId && ['resisted', 'escaped', 'delayed'].includes(checkin.outcome)).length,
      fruitAssessmentsCompleted: fruitAssessments.filter((assessment) => assessment.userId === userId).length,
    },
    formationInsights: activePatterns.slice(0, 3).map((pattern) => ({
      type: 'pattern',
      summary: `${pattern.vice.displayName} appears most often around ${pattern.recurringContexts[0] || 'ordinary life'}.`,
      recommendedNextAction: `Practice ${pattern.oppositeVirtues[0] || 'wisdom'} before the next response.`,
    })),
  }
}

export function orchestrateVirtueViceIntent(userId, intentText = '', context = {}) {
  const safety = detectFormationSafety(intentText)
  if (safety) return { route: 'crisis_care', recommendedAction: safety, message: safety.message, nextEndpoint: 'crisis_care_system' }
  const input = intentText.toLowerCase()
  if (/confess|repent|failed again|认罪|悔改|又失败/.test(input)) return { route: 'confession', recommendedAction: {}, message: 'Route gently to Confession & Repentance without condemnation.', nextEndpoint: 'scripture_formation_confession' }
  if (/pray|prayer|祷告/.test(input)) return { route: 'prayer', recommendedAction: {}, message: 'Route to Prayer & Communion OS.', nextEndpoint: 'prayer_communion' }
  if (/tempt|right now|urge|试探|冲动/.test(input)) return { route: 'temptation', recommendedAction: realTimeResistance(userId, intentText, context).response, message: 'Use real-time temptation resistance.', nextEndpoint: '/api/formation/temptation/resist' }
  if (/fruit|growth|track|果子|成长/.test(input)) return { route: 'fruit', recommendedAction: fruitDimensions, message: 'Complete a humble Fruit of the Spirit assessment.', nextEndpoint: '/api/formation/fruit/assessments' }
  if (/keep|again|angry|pattern|why|总是|一直|模式|生气/.test(input)) return { route: 'vice', recommendedAction: detectVices(intentText, context).analysis, message: 'Analyze possible vice pattern with user confirmation.', nextEndpoint: '/api/formation/vices/detect' }
  return { route: 'virtue', recommendedAction: recommendVirtues(intentText, context.desiredGrowth || '')[0], message: 'Create a grace-driven virtue focus.', nextEndpoint: '/api/formation/virtues/focuses' }
}

function summarizeSurfaceBehavior(text = '') {
  const trimmed = String(text || '').trim()
  return trimmed.length > 140 ? `${trimmed.slice(0, 137)}...` : trimmed || 'A situation needs discernment.'
}
