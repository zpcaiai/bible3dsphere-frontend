import { beliefDomains, decisionValueKeys, gospelFrameTemplates, idolCategories, idolSurrenderPractices } from '../data/worldviewFormationSeed'
import { detectCrisisMarkers, todayKey, uid } from './scriptureFormationEngine'

const TRAUMA_SAFETY_PATTERNS = [/abuse/i, /spiritual abuse/i, /coerc/i, /forced (to|into|by|sex|stay|relationship|labor|decision)/i, /unsafe/i, /threat/i, /violence/i, /emergency/i, /trauma/i, /家暴/, /属灵操控/, /强迫/, /危险/, /暴力/, /创伤/]
const HIGH_STAKES_PATTERNS = [/legal/i, /lawsuit/i, /immigration/i, /medical/i, /diagnosis/i, /surgery/i, /financial advisor/i, /debt crisis/i, /bankruptcy/i, /custody/i, /法律/, /移民/, /医疗/, /手术/, /破产/, /监护权/]

function nowIso() {
  return new Date().toISOString()
}

function inputOf(...parts) {
  return parts.filter(Boolean).join(' ').toLowerCase()
}

function anyPattern(text, patterns) {
  return patterns.some((pattern) => pattern.test(String(text || '')))
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)))
}

function findDomain(key) {
  return beliefDomains.find((domain) => domain.key === key) || beliefDomains[0]
}

function findIdol(key) {
  return idolCategories.find((idol) => idol.key === key) || idolCategories.find((idol) => idol.key === 'other')
}

export function detectWorldviewSafety(text = '', context = {}) {
  const crisis = detectCrisisMarkers(text)
  if (crisis) return crisis
  if (anyPattern(text, TRAUMA_SAFETY_PATTERNS)) {
    return {
      route: 'crisis_care',
      recommendedNextSystem: 'crisis_care_system',
      message: 'Safety, abuse, coercion, violence, trauma, or spiritual abuse may be involved. Do not reduce this to a belief or idol problem. Seek immediate safety, trusted human support, pastoral care, and qualified professional help when needed.',
    }
  }
  const combined = inputOf(text, JSON.stringify(context))
  if (anyPattern(combined, HIGH_STAKES_PATTERNS)) {
    return {
      route: 'qualified_counsel',
      recommendedNextSystem: 'professional_and_pastoral_counsel',
      message: 'This appears high-stakes. This tool can support wisdom questions, but it cannot provide authoritative legal, medical, financial, immigration, or safety-critical advice. Consult qualified counsel.',
    }
  }
  return null
}

export function listBeliefDomains() {
  return beliefDomains
}

export function createBeliefDiagnosticSession(userId, data = {}) {
  const safety = detectWorldviewSafety(`${data.triggerContext || ''} ${data.presentingIssue || ''}`)
  return {
    id: uid('belief_session'),
    userId,
    sessionDate: todayKey(),
    triggerContext: data.triggerContext || '',
    presentingIssue: data.presentingIssue || '',
    selectedDomains: data.selectedDomains || [],
    emotionalState: data.emotionalState || [],
    status: safety?.route === 'crisis_care' ? 'routed_to_crisis' : 'started',
    riskFlags: safety ? [safety.route] : [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    completedAt: null,
  }
}

function beliefHeuristic(text = '') {
  const input = inputOf(text)
  if (/worth|productive|output|performance|fail|success|enough|成就|失败|价值|产出/.test(input)) {
    return {
      domainKey: /work|productive|output|工作|产出/.test(input) ? 'work' : 'success',
      belief: 'My worth depends on measurable output or successful performance.',
      distortionType: 'performance_identity',
      desires: ['recognition', 'security', 'control'],
      fruit: ['overwork', 'restlessness', 'irritability'],
      truth: 'Identity is received in Christ, not achieved through output.',
      confidence: 0.78,
    }
  }
  if (/money|scarcity|not enough|rent|safe|财|钱|安全感|不够/.test(input)) {
    return {
      domainKey: 'money',
      belief: 'I cannot be safe unless I have enough resources under my control.',
      distortionType: 'scarcity',
      desires: ['security', 'control'],
      fruit: ['anxiety', 'hoarding', 'comparison'],
      truth: 'The Father provides and calls money into stewardship, generosity, and wisdom.',
      confidence: 0.74,
    }
  }
  if (/reject|approval|like me|disappoint|认可|喜欢|拒绝|失望/.test(input)) {
    return {
      domainKey: 'relationships',
      belief: 'If people disapprove of me, I lose my identity or safety.',
      distortionType: 'people_approval',
      desires: ['belonging', 'approval'],
      fruit: ['image management', 'avoidance', 'resentment'],
      truth: 'In Christ, beloved identity frees truthful love without image management.',
      confidence: 0.72,
    }
  }
  if (/suffer|grief|pain|abandoned|punishment|苦|痛|惩罚|离弃/.test(input)) {
    return {
      domainKey: 'suffering',
      belief: 'Suffering may mean God has abandoned or condemned me.',
      distortionType: 'abandonment',
      desires: ['comfort', 'meaning'],
      fruit: ['despair', 'withdrawal'],
      truth: 'Suffering may be lamented honestly; Christ is near to the brokenhearted and does not abandon His people.',
      confidence: 0.68,
    }
  }
  if (/future|uncertain|plan|what if|未来|不确定|计划/.test(input)) {
    return {
      domainKey: 'future',
      belief: 'The future is only safe if I can remove uncertainty.',
      distortionType: 'control',
      desires: ['control', 'certainty'],
      fruit: ['rumination', 'restlessness'],
      truth: 'The future belongs to God; wisdom gathers facts while faith refuses panic.',
      confidence: 0.7,
    }
  }
  return {
    domainKey: 'self',
    belief: 'I may be interpreting this situation through fear, shame, or self-protection.',
    distortionType: 'fear_based',
    desires: ['safety', 'love', 'meaning'],
    fruit: ['avoidance', 'anxiety'],
    truth: 'Bring the interpretation into the light of Scripture, prayer, and wise counsel.',
    confidence: 0.48,
  }
}

export function diagnoseBeliefs(userId, text = '', context = {}) {
  const safety = detectWorldviewSafety(text, context)
  if (safety?.route === 'crisis_care') return { analysis: null, guidance: safety, routed: true }
  const found = beliefHeuristic(text)
  const domain = findDomain(found.domainKey)
  return {
    analysis: {
      presentingIssue: text,
      surfaceEmotions: detectEmotions(text),
      possibleInterpretations: [
        found.distortionType === 'performance_identity' ? 'Rest or failure may feel unsafe because output is carrying identity weight.' : 'The situation may be interpreted through fear, shame, scarcity, or control.',
        'This is a possible belief pattern, not a final label.',
      ],
      possibleBeliefs: [{
        domain: domain.key,
        belief: found.belief,
        distortionType: found.distortionType,
        confidence: found.confidence,
        evidence: extractEvidence(text, found.distortionType),
      }],
      possibleDesires: found.desires,
      possibleBehavioralFruit: found.fruit,
      gospelTruthNeeded: [found.truth],
      recommendedNextStep: { module: 'gospel_reframing', action: 'Reframe this situation through creation, fall, redemption, and restoration.' },
      cautions: [
        'Use possible-belief language and let the user confirm, reject, or edit.',
        ...(safety?.route === 'qualified_counsel' ? [safety.message] : []),
      ],
    },
    guidance: safety || { message: 'Possible underlying belief detected. Confirm, edit, or reject before treating it as a pattern.' },
    routed: false,
  }
}

function detectEmotions(text = '') {
  const input = inputOf(text)
  return unique([
    /anx|worr|焦虑|担心/.test(input) && 'anxiety',
    /shame|worthless|羞耻|没价值/.test(input) && 'shame',
    /anger|angry|mad|怒|生气/.test(input) && 'anger',
    /grief|sad|loss|哀伤|难过/.test(input) && 'grief',
    /fear|afraid|怕|恐惧/.test(input) && 'fear',
  ]).filter(Boolean)
}

function extractEvidence(text, type) {
  if (type === 'performance_identity') return ['anxiety around failure or output', 'worth tied to performance']
  if (type === 'scarcity') return ['safety tied to resources', 'fear of not having enough']
  if (type === 'people_approval') return ['approval pressure', 'fear of rejection']
  return [String(text || '').slice(0, 80)].filter(Boolean)
}

export function createBeliefObservation(userId, data = {}) {
  const result = diagnoseBeliefs(userId, data.situation || data.interpretation || data.statedBelief || '', data)
  if (result.routed) return { observation: null, pattern: null, guidance: result.guidance, routed: true }
  const belief = result.analysis.possibleBeliefs[0]
  const domain = findDomain(data.domainKey || belief.domain)
  const observation = {
    id: uid('belief_observation'),
    userId,
    sessionId: data.sessionId || null,
    domainId: domain.id,
    domainKey: domain.key,
    sourceType: data.sourceType || 'manual',
    sourceId: data.sourceId || null,
    situation: data.situation || result.analysis.presentingIssue,
    emotion: data.emotion || result.analysis.surfaceEmotions,
    interpretation: data.interpretation || result.analysis.possibleInterpretations[0],
    statedBelief: data.statedBelief || '',
    inferredBelief: data.inferredBelief || belief.belief,
    beliefDistortionType: data.beliefDistortionType || belief.distortionType,
    confidenceScore: belief.confidence,
    userConfirmed: Boolean(data.userConfirmed),
    createdAt: nowIso(),
  }
  return { observation, pattern: matchOrCreateBeliefPattern(userId, observation), guidance: result.guidance, routed: false }
}

export function confirmBeliefObservation(observation, correctedBelief = '') {
  return {
    ...observation,
    inferredBelief: correctedBelief || observation.inferredBelief,
    userConfirmed: true,
  }
}

export function matchOrCreateBeliefPattern(userId, observation, existing = []) {
  const found = existing.find((pattern) => pattern.userId === userId && pattern.domainKey === observation.domainKey && pattern.distortionType === observation.beliefDistortionType)
  if (found) {
    return {
      ...found,
      recurringBeliefs: unique([...(found.recurringBeliefs || []), observation.inferredBelief]).slice(0, 6),
      recurringEmotions: unique([...(found.recurringEmotions || []), ...(observation.emotion || [])]).slice(0, 6),
      recurringContexts: unique([...(found.recurringContexts || []), observation.situation]).slice(0, 6),
      observationCount: (found.observationCount || 0) + 1,
      lastObservedAt: observation.createdAt,
      updatedAt: nowIso(),
    }
  }
  const domain = findDomain(observation.domainKey)
  return {
    id: uid('belief_pattern'),
    userId,
    domainId: domain.id,
    domainKey: domain.key,
    distortionType: observation.beliefDistortionType,
    title: `Possible ${domain.displayName} belief pattern`,
    description: observation.inferredBelief,
    recurringBeliefs: [observation.inferredBelief],
    recurringEmotions: observation.emotion || [],
    recurringContexts: [observation.situation].filter(Boolean),
    behavioralFruit: beliefHeuristic(observation.situation).fruit,
    relatedIdols: inferIdolKeys(observation.situation),
    gospelTruthNeeded: [beliefHeuristic(observation.situation).truth],
    severityLevel: observation.confidenceScore >= 0.75 ? 'moderate' : 'low',
    status: 'active',
    observationCount: 1,
    firstObservedAt: observation.createdAt,
    lastObservedAt: observation.createdAt,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
}

export function generateBeliefPatternReview(userId, pattern, observations = []) {
  const mine = observations.filter((item) => item.userId === userId && item.domainKey === pattern.domainKey)
  return {
    id: uid('belief_review'),
    userId,
    patternId: pattern.id,
    reviewPeriodStart: mine.at(-1)?.createdAt?.slice(0, 10) || todayKey(),
    reviewPeriodEnd: todayKey(),
    evidence: mine.map((item) => item.situation).slice(0, 4),
    shiftsNoticed: [],
    stubbornAreas: pattern.recurringBeliefs || [],
    suggestedReframing: pattern.gospelTruthNeeded || [],
    recommendedPractices: suggestBeliefPractices(pattern),
    summary: `${pattern.title}: ${mine.length || pattern.observationCount || 1} observation(s). Move from diagnosis to gospel reframing and one embodied practice.`,
    createdAt: nowIso(),
  }
}

export function suggestBeliefPractices(pattern) {
  if (pattern.domainKey === 'work' || pattern.distortionType === 'performance_identity') return ['Gospel reframing for work', 'Sabbath rest boundary', 'Identity-in-Christ meditation']
  if (pattern.domainKey === 'money' || pattern.distortionType === 'scarcity') return ['Gratitude budget review', 'Generosity practice', 'Matthew 6 meditation']
  return ['Gospel reframing', 'Psalm prayer', 'Wise counsel conversation']
}

export function listIdolCategories() {
  return idolCategories
}

function inferIdolKeys(text = '') {
  const input = inputOf(text)
  return unique([
    /control|plan|certain|outcome|掌控|确定/.test(input) && 'control',
    /safe|security|risk|安全/.test(input) && 'safety',
    /approval|like|recognition|认可|喜欢/.test(input) && 'approval',
    /comfort|easy|numb|舒服|逃避/.test(input) && 'comfort',
    /success|achieve|fail|成就|成功|失败/.test(input) && 'success',
    /money|spend|scarcity|钱|消费/.test(input) && 'money',
    /phone|screen|social|technology|手机|社交/.test(input) && 'technology',
    /productive|output|busy|效率|产出/.test(input) && 'productivity',
    /body|weight|appearance|身材|体重/.test(input) && 'body_image',
  ]).filter(Boolean)
}

export function detectIdols(userId, text = '', context = {}) {
  const safety = detectWorldviewSafety(text, context)
  if (safety?.route === 'crisis_care') return { analysis: null, guidance: safety, routed: true }
  const keys = inferIdolKeys(text)
  const selectedKeys = keys.length ? keys : /want|desire|need|must|想要|必须/.test(inputOf(text)) ? ['other'] : []
  if (!selectedKeys.length) {
    return {
      analysis: {
        surfaceIssue: text,
        possibleIdols: [],
        normalDesireNotice: 'No clear idol signal. This may be an ordinary good desire; do not overlabel it.',
        gospelCounterTruth: 'Good desires become disordered when they become ultimate, controlling, identity-giving, or obedience-blocking.',
      },
      guidance: safety || { message: 'No strong idol signal detected.' },
      routed: false,
    }
  }
  const possibleIdols = selectedKeys.slice(0, 3).map((key) => {
    const idol = findIdol(key)
    return {
      idolKey: idol.key,
      confidence: key === 'other' ? 0.42 : 0.76,
      evidence: idol.commonFruits.slice(0, 2),
      possiblePromise: idol.commonPromises[0],
      possibleFear: idol.commonFears[0],
    }
  })
  const primary = findIdol(possibleIdols[0].idolKey)
  return {
    analysis: {
      surfaceIssue: text,
      possibleIdols,
      relatedBeliefs: [`${primary.displayName} may be functioning as a source of identity, safety, comfort, or control.`],
      relatedVices: primary.relatedVices,
      gospelCounterTruth: primary.gospelCounterTruths[0],
      surrenderPractice: recommendSurrenderPractices(primary.key)[0],
      cautions: [
        'Use possible idol language and let the user confirm or reject.',
        'Do not weaponize idol language against victims of abuse or people in danger.',
      ],
    },
    guidance: safety || { message: 'Possible idol pattern detected without shame. Confirm, edit, or reject.' },
    routed: false,
  }
}

export function createIdolObservation(userId, data = {}) {
  const result = detectIdols(userId, `${data.triggeringEvent || ''} ${data.blockedDesire || ''} ${data.fearIfLost || ''}`, data)
  if (result.routed) return { observation: null, pattern: null, guidance: result.guidance, routed: true }
  const primary = result.analysis.possibleIdols[0]
  const observation = {
    id: uid('idol_observation'),
    userId,
    sessionId: data.sessionId || null,
    sourceType: data.sourceType || 'manual',
    sourceId: data.sourceId || null,
    contextLabel: data.contextLabel || 'ordinary life',
    triggeringEvent: data.triggeringEvent || result.analysis.surfaceIssue,
    blockedDesire: data.blockedDesire || '',
    fearIfLost: data.fearIfLost || primary?.possibleFear || '',
    angerOrAnxietySignal: data.angerOrAnxietySignal || '',
    sacrificePattern: data.sacrificePattern || '',
    possibleIdolCategories: result.analysis.possibleIdols.map((item) => item.idolKey),
    confidenceScore: primary?.confidence || 0.35,
    userConfirmed: Boolean(data.userConfirmed),
    createdAt: nowIso(),
  }
  return { observation, pattern: matchOrCreateIdolPattern(userId, observation), guidance: result.guidance, routed: false }
}

export function confirmIdolObservation(observation, correctedCategories = []) {
  return {
    ...observation,
    possibleIdolCategories: correctedCategories.length ? correctedCategories : observation.possibleIdolCategories,
    userConfirmed: true,
  }
}

export function matchOrCreateIdolPattern(userId, observation, existing = []) {
  const key = observation.possibleIdolCategories[0] || 'other'
  const found = existing.find((pattern) => pattern.userId === userId && pattern.idolKey === key)
  if (found) {
    return {
      ...found,
      recurringTriggers: unique([...(found.recurringTriggers || []), observation.triggeringEvent]).slice(0, 6),
      recurringFears: unique([...(found.recurringFears || []), observation.fearIfLost]).slice(0, 6),
      observationCount: (found.observationCount || 0) + 1,
      lastObservedAt: observation.createdAt,
      updatedAt: nowIso(),
    }
  }
  const idol = findIdol(key)
  return {
    id: uid('idol_pattern'),
    userId,
    idolCategoryId: idol.id,
    idolKey: idol.key,
    title: `Possible ${idol.displayName} idol pattern`,
    description: idol.description,
    recurringTriggers: [observation.triggeringEvent].filter(Boolean),
    recurringFears: [observation.fearIfLost].filter(Boolean),
    recurringPromises: idol.commonPromises,
    recurringSacrifices: [observation.sacrificePattern].filter(Boolean),
    relatedBeliefPatterns: [],
    relatedVicePatterns: idol.relatedVices,
    replacementWorshipPractices: recommendSurrenderPractices(idol.key).map((practice) => practice.title),
    severityLevel: observation.confidenceScore >= 0.75 ? 'moderate' : 'low',
    status: 'active',
    observationCount: 1,
    firstObservedAt: observation.createdAt,
    lastObservedAt: observation.createdAt,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
}

export function recommendSurrenderPractices(idolKey) {
  return idolSurrenderPractices.filter((practice) => practice.idolKey === idolKey).slice(0, 4)
}

export function generateIdolPatternReview(userId, pattern, observations = []) {
  const mine = observations.filter((item) => item.userId === userId && item.possibleIdolCategories?.includes(pattern.idolKey))
  return {
    id: uid('idol_review'),
    userId,
    idolPatternId: pattern.id,
    reviewPeriodStart: mine.at(-1)?.createdAt?.slice(0, 10) || todayKey(),
    reviewPeriodEnd: todayKey(),
    evidenceOfSurrender: [],
    evidenceOfReactivation: mine.map((item) => item.triggeringEvent).slice(0, 4),
    replacementWorshipGrowth: pattern.replacementWorshipPractices,
    recommendedNextSteps: recommendSurrenderPractices(pattern.idolKey).map((practice) => practice.instructions).slice(0, 2),
    summary: `${pattern.title}: choose one surrender practice without shame or self-attack.`,
    createdAt: nowIso(),
  }
}

export function detectSituationType(text = '') {
  const input = inputOf(text)
  if (/grief|loss|died|death|哀伤|去世/.test(input)) return 'grief'
  if (/shame|worthless|羞耻|没价值/.test(input)) return 'shame'
  if (/fail|mistake|失败|错误/.test(input)) return 'failure'
  if (/work|job|productive|工作|职业/.test(input)) return 'work'
  if (/money|rent|debt|钱|债/.test(input)) return 'money'
  if (/conflict|argument|冲突|争吵/.test(input)) return 'conflict'
  if (/injustice|unfair|冤屈|不公/.test(input)) return 'injustice'
  if (/dry|prayer|God feels|枯干|祷告/.test(input)) return 'spiritual_dryness'
  if (/tempt|lust|试探|情欲/.test(input)) return 'temptation'
  if (/technology|phone|screen|手机/.test(input)) return 'technology'
  if (/anx|worry|焦虑|担心/.test(input)) return 'anxiety'
  return 'custom'
}

export function generateFullReframing(userId, situation = '', context = {}) {
  const safety = detectWorldviewSafety(situation, context)
  if (safety?.route === 'crisis_care') return { reframing: null, guidance: safety, routed: true }
  const situationType = detectSituationType(situation)
  const belief = beliefHeuristic(`${situation} ${context.originalInterpretation || ''}`)
  const lament = ['suffering', 'grief', 'injustice'].includes(situationType)
  const nextAction = situationType === 'grief' ? 'Practice lament and ask a trusted person to sit with you without forcing resolution.'
    : situationType === 'conflict' ? 'Choose one truthful, gentle repair step if it is wise and safe.'
      : situationType === 'work' || situationType === 'failure' ? 'Repair what is needed, learn one lesson, and stop using failure as identity.'
        : 'Choose one small act of faithfulness, prayer, counsel, or rest.'
  return {
    reframing: {
      id: uid('gospel_reframe'),
      userId,
      situation,
      situationType,
      originalInterpretation: context.originalInterpretation || belief.belief,
      creation: {
        truth: 'Creation names what was originally good: vocation, body, relationship, desire, justice, beauty, or wise stewardship.',
        question: 'What good desire, calling, gift, or created order is present here?',
      },
      fall: {
        truth: 'The fall distorts good things through sin, fear, shame, idolatry, suffering, injustice, and death.',
        diagnosis: lament ? 'This situation may need lament before analysis. Do not force quick positivity.' : `A possible distortion is ${belief.distortionType}.`,
      },
      redemption: {
        truth: belief.truth,
        invitation: 'Receive what Christ has done before choosing the next action.',
      },
      restoration: {
        truth: 'New creation hope allows truthful action without denial.',
        nextAction,
      },
      reframedBelief: situationType === 'grief'
        ? 'This grief is real and may remain unresolved for now, but it can be brought honestly before Christ.'
        : `${belief.belief.replace(/^My worth depends on/, 'My worth does not depend on')}`,
      responseActions: suggestResponseActions(situationType, nextAction),
      cautions: [
        'This is not a private revelation or certainty about hidden providence.',
        ...(safety?.route === 'qualified_counsel' ? [safety.message] : []),
      ],
      completedAt: nowIso(),
    },
    guidance: safety || { message: 'Gospel reframing generated without forcing a happy ending.' },
    routed: false,
  }
}

function suggestResponseActions(situationType, nextAction) {
  const actionType = situationType === 'grief' || situationType === 'suffering' || situationType === 'injustice' ? 'lament'
    : situationType === 'conflict' ? 'repair'
      : situationType === 'money' ? 'counsel'
        : 'obedience'
  return [
    { id: uid('gospel_action'), actionType: 'prayer', description: 'Pray one honest sentence before God and receive grace before action.', status: 'planned' },
    { id: uid('gospel_action'), actionType, description: nextAction, status: 'planned' },
  ]
}

export function createGospelReframingSession(userId, data = {}) {
  const result = generateFullReframing(userId, data.originalSituation || data.situation || '', data)
  if (result.routed) return { session: null, actions: [], guidance: result.guidance, routed: true }
  const now = nowIso()
  const session = {
    id: uid('gospel_session'),
    userId,
    sessionDate: todayKey(),
    situationType: result.reframing.situationType,
    originalSituation: result.reframing.situation,
    originalInterpretation: result.reframing.originalInterpretation,
    emotionalStateBefore: data.emotionalStateBefore || detectEmotions(result.reframing.situation),
    emotionalStateAfter: [],
    selectedTemplateId: gospelFrameTemplates.find((template) => template.situationType === result.reframing.situationType)?.id || null,
    status: 'completed',
    entries: ['creation', 'fall', 'redemption', 'restoration'].map((stage) => ({
      id: uid('gospel_entry'),
      frameStage: stage,
      userInput: '',
      aiGuidance: result.reframing[stage].truth,
      keyTruths: [result.reframing[stage].truth],
      scriptureRefs: ['Romans 8:1', 'Revelation 21:5'],
      createdAt: now,
    })),
    reframedBelief: result.reframing.reframedBelief,
    riskFlags: result.guidance.route === 'qualified_counsel' ? ['qualified_counsel'] : [],
    createdAt: now,
    updatedAt: now,
    completedAt: now,
  }
  const actions = result.reframing.responseActions.map((action) => ({ ...action, userId, sessionId: session.id, createdAt: now, updatedAt: now }))
  return { session, actions, reframing: result.reframing, guidance: result.guidance, routed: false }
}

export function createDecisionSession(userId, data = {}) {
  const safety = detectWorldviewSafety(`${data.decisionTitle || ''} ${data.decisionQuestion || ''}`, data)
  return {
    id: uid('decision_session'),
    userId,
    sessionDate: todayKey(),
    decisionTitle: data.decisionTitle || 'Decision discernment',
    decisionType: data.decisionType || detectDecisionType(data.decisionQuestion || data.decisionTitle || ''),
    decisionQuestion: data.decisionQuestion || '',
    status: safety?.route === 'crisis_care' ? 'routed_to_crisis' : 'started',
    urgencyLevel: data.urgencyLevel || 'normal',
    deadline: data.deadline || '',
    riskFlags: safety ? [safety.route] : [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    completedAt: null,
  }
}

function detectDecisionType(text = '') {
  const input = inputOf(text)
  if (/job|role|career|work|工作|职业/.test(input)) return 'job'
  if (/money|buy|debt|投资|钱/.test(input)) return 'money'
  if (/health|medical|doctor|医疗|健康/.test(input)) return 'health'
  if (/move|relocat|搬家|迁移/.test(input)) return 'relocation'
  if (/relationship|marry|dating|关系|婚/.test(input)) return 'relationship'
  if (/church|ministry|教会|事工/.test(input)) return 'ministry'
  return 'custom'
}

export function addDecisionOption(userId, session, data = {}) {
  return {
    id: uid('decision_option'),
    userId,
    sessionId: session.id,
    label: data.label || 'Option',
    description: data.description || '',
    perceivedPros: data.perceivedPros || [],
    perceivedCons: data.perceivedCons || [],
    constraints: data.constraints || [],
    risks: data.risks || [],
    possibleFruit: data.possibleFruit || [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
}

export function runMotiveCheck(userId, session, contextText = '') {
  const idolResult = detectIdols(userId, `${session.decisionQuestion} ${contextText}`)
  return {
    id: uid('motive_check'),
    userId,
    sessionId: session.id,
    dominantDesires: ['faithfulness', 'wisdom', 'fruitfulness'],
    dominantFears: detectEmotions(contextText).includes('fear') ? ['fear of loss or failure'] : ['fear of missing a wiser path'],
    possibleIdols: idolResult.analysis?.possibleIdols?.map((item) => item.idolKey) || [],
    possibleVirtues: ['wisdom', 'courage', 'patience'],
    possibleVices: idolResult.analysis?.relatedVices || [],
    loveOfGodNeighborScore: 7,
    egoOrImagePressureScore: /image|approval|impress|认可|面子/.test(inputOf(contextText)) ? 7 : 3,
    fearPressureScore: /fear|afraid|anx|怕|焦虑/.test(inputOf(contextText)) ? 7 : 4,
    wisdomNotes: 'Motives are mixed and should be examined without condemnation.',
    createdAt: nowIso(),
  }
}

export function recommendValueWeights(userId, session) {
  const high = session.decisionType === 'health' ? ['faithfulness', 'wisdom', 'health', 'family_health']
    : session.decisionType === 'money' ? ['faithfulness', 'wisdom', 'financial_responsibility', 'integrity']
      : session.decisionType === 'job' ? ['faithfulness', 'wisdom', 'family_health', 'mission_alignment', 'rest']
        : ['faithfulness', 'love', 'wisdom', 'integrity', 'long_term_fruit']
  return decisionValueKeys.map((value) => ({
    id: uid('decision_value'),
    userId,
    sessionId: session.id,
    valueKey: value.key,
    displayName: value.displayName,
    weight: high.includes(value.key) ? 9 : value.defaultWeight,
    notes: '',
    createdAt: nowIso(),
  })).slice(0, 8)
}

export function scoreDecisionOptions(userId, session, options = [], valueWeights = []) {
  const values = valueWeights.length ? valueWeights : recommendValueWeights(userId, session)
  const denominator = values.reduce((sum, value) => sum + Number(value.weight || 0), 0) || 1
  return options.map((option, index) => {
    const score = values.reduce((sum, value) => {
      const base = /wait|delay|gather|counsel/i.test(option.label) ? 7 : 5 + ((index + value.valueKey.length) % 4)
      return sum + Number(value.weight || 0) * Math.min(10, base)
    }, 0) / denominator
    return {
      optionId: option.id,
      label: option.label,
      score: Math.round(score * 10) / 10,
      evidence: 'Score is a discernment aid, not a final answer.',
    }
  }).sort((a, b) => b.score - a.score)
}

export function addCounselInput(userId, session, data = {}) {
  return {
    id: uid('decision_counsel'),
    userId,
    sessionId: session.id,
    counselSourceType: data.counselSourceType || 'mentor',
    counselSourceLabel: data.counselSourceLabel || '',
    summary: data.summary || 'Seek wise counsel before deciding.',
    agreementLevel: data.agreementLevel || 'unknown',
    createdAt: nowIso(),
  }
}

export function oneShotDiscernment(userId, decisionText = '', options = [], context = {}) {
  const safety = detectWorldviewSafety(decisionText, context)
  if (safety?.route === 'crisis_care') return { discernment: null, guidance: safety, routed: true }
  const session = createDecisionSession(userId, { decisionTitle: decisionText.slice(0, 80), decisionQuestion: decisionText, urgencyLevel: context.urgencyLevel })
  const clarifiedOptions = options.length ? options : ['Move forward', 'Wait and gather facts', 'Seek counsel before deciding']
  const optionRows = clarifiedOptions.map((label) => addDecisionOption(userId, session, { label }))
  const motiveCheck = runMotiveCheck(userId, session, decisionText)
  const valuePriorities = recommendValueWeights(userId, session).slice(0, 5)
  const scores = scoreDecisionOptions(userId, session, optionRows, valuePriorities)
  const highStakes = safety?.route === 'qualified_counsel' || detectHighStakesDecision(session)
  return {
    discernment: {
      session,
      decisionQuestion: decisionText,
      clarifiedOptions,
      factsNeeded: highStakes ? ['Qualified professional input', 'Actual risks and obligations', 'Impact on family, church, health, and finances'] : ['Concrete costs and timing', 'Impact on relationships and worship', 'Risks of each option'],
      motiveCheck: {
        possibleGoodDesires: motiveCheck.dominantDesires,
        possibleFears: motiveCheck.dominantFears,
        possibleIdols: motiveCheck.possibleIdols,
        virtuesNeeded: motiveCheck.possibleVirtues,
      },
      valuePriorities: valuePriorities.map((value) => value.displayName),
      optionScores: scores,
      wisdomQuestions: [
        'Will this help you love God and neighbor more faithfully?',
        'What will this decision require you to neglect?',
        'Who should speak into this decision?',
      ],
      recommendedPath: 'Do not decide only from excitement or fear. Gather missing facts, seek counsel, and compare options by weighted values.',
      nextSteps: ['Write the top values and weight them.', 'Ask one mature believer and one relevant professional contact for counsel.', 'Pray for freedom from fear and image pressure.'],
      cautions: unique([
        'This is not a revelation of God hidden will.',
        'Do not treat scores as divine certainty.',
        highStakes && 'For legal, financial, medical, immigration, or safety-critical details, consult qualified professionals.',
        safety?.message,
      ]),
      confidenceLevel: highStakes || !context.hasCounsel ? 'low' : 'moderate',
      waitOrActRecommendation: highStakes ? 'seek_counsel' : 'gather_facts',
    },
    guidance: safety || { message: 'Decision discernment generated with anti-divination guardrails.' },
    routed: false,
  }
}

export function detectHighStakesDecision(session) {
  return ['health', 'money'].includes(session.decisionType) || anyPattern(`${session.decisionTitle} ${session.decisionQuestion}`, HIGH_STAKES_PATTERNS)
}

export function generateDecisionSummary(userId, session, options = [], motiveChecks = [], valueWeights = [], counselInputs = []) {
  const scores = scoreDecisionOptions(userId, session, options, valueWeights)
  const highStakes = detectHighStakesDecision(session)
  return {
    id: uid('decision_summary'),
    userId,
    sessionId: session.id,
    summary: `${session.decisionTitle}: ${options.length} option(s), ${counselInputs.length} counsel input(s), motives reviewed.`,
    recommendedPath: scores[0] ? `Based on provided values, ${scores[0].label} appears worth further consideration, not as divine certainty.` : 'Gather options and counsel before deciding.',
    confidenceLevel: highStakes || !counselInputs.length ? 'low' : 'moderate',
    unresolvedQuestions: highStakes ? ['Qualified counsel needed'] : ['What facts are still missing?'],
    nextSteps: highStakes ? ['Seek qualified professional counsel.', 'Pray and review after facts are clearer.'] : ['Gather facts.', 'Seek counsel.', 'Pray and wait if pressure remains high.'],
    waitOrActRecommendation: highStakes || !counselInputs.length ? 'seek_counsel' : 'gather_facts',
    cautions: unique(['Never claim God wants you to choose a specific option from this tool.', highStakes && 'Professional counsel is required for high-stakes details.']),
    createdAt: nowIso(),
  }
}

export function buildWorldviewDashboard(data = {}) {
  const userId = data.userId || 'local-user'
  const beliefPatterns = (data.beliefPatterns || []).filter((item) => item.userId === userId && item.status !== 'archived')
  const idolPatterns = (data.idolPatterns || []).filter((item) => item.userId === userId && item.status !== 'archived')
  const reframingSessions = (data.gospelSessions || []).filter((item) => item.userId === userId)
  const decisionSessions = (data.decisionSessions || []).filter((item) => item.userId === userId && !['decided', 'archived'].includes(item.status))
  const responseActions = (data.gospelActions || []).filter((item) => item.userId === userId)
  return {
    today: {
      activeBeliefPatterns: beliefPatterns,
      activeIdolPatterns: idolPatterns,
      openReframingSessions: reframingSessions.filter((item) => item.status !== 'completed'),
      openDecisionSessions: decisionSessions,
      recommendedWorldviewPractice: beliefPatterns[0] ? { type: 'gospel_reframing', title: 'Reframe the most recurring belief pattern.' } : { type: 'belief_diagnostic', title: 'Diagnose one recurring anxiety or interpretation.' },
      urgentFlags: [...beliefPatterns, ...idolPatterns, ...decisionSessions].flatMap((item) => item.riskFlags || []),
    },
    weeklySummary: {
      beliefObservationsCreated: (data.beliefObservations || []).filter((item) => item.userId === userId).length,
      idolObservationsCreated: (data.idolObservations || []).filter((item) => item.userId === userId).length,
      reframingSessionsCompleted: reframingSessions.filter((item) => item.status === 'completed').length,
      decisionSessionsUpdated: decisionSessions.length,
      responseActionsCompleted: responseActions.filter((item) => item.status === 'completed').length,
    },
    formationInsights: [
      beliefPatterns[0] && { type: 'belief_pattern', summary: `${beliefPatterns[0].title} appears in ${beliefPatterns[0].recurringContexts?.[0] || 'ordinary life'}.`, recommendedNextAction: 'Complete gospel reframing and one embodied practice.' },
      idolPatterns[0] && { type: 'idol_pattern', summary: `${idolPatterns[0].title} may reactivate under pressure.`, recommendedNextAction: 'Choose one surrender practice without shame.' },
    ].filter(Boolean),
  }
}

export function orchestrateWorldviewIntent(userId, intentText = '', context = {}) {
  const safety = detectWorldviewSafety(intentText, context)
  if (safety?.route === 'crisis_care') return { route: 'crisis_care', nextEndpoint: 'crisis_care_system', message: safety.message }
  const input = inputOf(intentText)
  if (/confess|repent|sin|认罪|悔改/.test(input)) return { route: 'confession', nextEndpoint: '/api/scripture-formation/confession', message: 'Route to confession and repentance with gospel assurance.' }
  if (/pray|psalm|presence|祷告|诗篇/.test(input)) return { route: 'prayer', nextEndpoint: '/api/prayer/dashboard', message: 'Route to prayer and communion.' }
  if (/virtue|vice|tempt|德性|罪性|试探/.test(input)) return { route: 'virtue_vice', nextEndpoint: '/api/formation/virtue-vice/dashboard', message: 'Route to virtue, vice, or temptation formation.' }
  if (/habit|sabbath|fast|rule|安息|习惯|禁食|规则/.test(input)) return { route: 'holy_habit', nextEndpoint: '/api/rule-of-life/dashboard', message: 'Route to Rule of Life and Holy Habit Engine.' }
  if (/decision|choose|should i|god'?s will|job|take this|decide|决定|选择|神.*旨意/.test(input)) {
    return { route: 'decision_discernment', nextEndpoint: '/api/worldview/discernment/discern', message: 'Practice wisdom, not divination. This cannot reveal God hidden will.', recommendedAction: oneShotDiscernment(userId, intentText, [], context).discernment }
  }
  if (/gospel|reframe|see this|creation|fall|redemption|restoration|福音|重构/.test(input)) {
    return { route: 'gospel_reframing', nextEndpoint: '/api/worldview/reframing/reframe', message: 'Reframe through creation, fall, redemption, and restoration.', recommendedAction: generateFullReframing(userId, intentText, context).reframing }
  }
  if (/idol|must have|afraid to lose|angry when|偶像|失去|掌控/.test(input)) {
    return { route: 'idol_mapping', nextEndpoint: '/api/worldview/idols/detect', message: 'Map possible idols without shame.', recommendedAction: detectIdols(userId, intentText, context).analysis }
  }
  return { route: 'belief_diagnostic', nextEndpoint: '/api/worldview/beliefs/diagnose', message: 'Diagnose possible underlying beliefs and let the user confirm or edit.', recommendedAction: diagnoseBeliefs(userId, intentText, context).analysis }
}
