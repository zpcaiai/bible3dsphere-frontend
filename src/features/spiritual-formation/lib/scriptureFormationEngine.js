import { gospelAssuranceTexts, memoryVerses, scripturePassages } from '../data/scriptureFormationSeed'

const CRISIS_PATTERNS = [
  /kill myself/i,
  /suicide/i,
  /self[- ]?harm/i,
  /hurt myself/i,
  /end my life/i,
  /abuse/i,
  /violence/i,
  /unsafe/i,
  /emergency/i,
  /despair/i,
  /panic/i,
  /家暴/,
  /自杀/,
  /轻生/,
  /伤害自己/,
  /绝望/,
  /虐待/,
  /暴力/,
]

const OBSESSIVE_GUILT_PATTERNS = [/again and again/i, /never forgiven/i, /obsessive/i, /反复认罪/, /无法被赦免/, /一直内疚/]

export const LECTIO_STAGES = ['read', 'meditate', 'pray', 'contemplate', 'obey']
export const EXAMEN_STAGES = ['gratitude', 'review', 'consolation', 'desolation', 'repentance', 'grace', 'intention', 'prayer']
export const CONFESSION_STAGES = ['name', 'confess', 'discern', 'receive_grace', 'turn', 'repair', 'walk']

export function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

export function todayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function detectCrisisMarkers(text = '') {
  const input = String(text || '')
  const isCrisis = CRISIS_PATTERNS.some((pattern) => pattern.test(input))
  const obsessiveGuilt = OBSESSIVE_GUILT_PATTERNS.some((pattern) => pattern.test(input))
  if (!isCrisis && !obsessiveGuilt) return null
  return {
    route: isCrisis ? 'crisis_care' : 'pastoral_care',
    recommendedNextSystem: isCrisis ? 'crisis_care_system' : 'pastoral_or_clinical_support',
    message: isCrisis
      ? 'This looks important and possibly urgent. Please seek immediate real-world support now if there is danger, self-harm, abuse, or violence. Contact local emergency services and a trusted person, pastor, counselor, or medical professional.'
      : 'This may be becoming an obsessive guilt loop. Pause repetitive confession and seek gentle pastoral care; clinical support may also help if anxiety is intense.',
  }
}

export function getDailyPassage(userId = 'local-user', date = new Date()) {
  const seed = `${userId}:${todayKey(date)}`
  const hash = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return scripturePassages[hash % scripturePassages.length]
}

export function createLectioSession(userId, passage = getDailyPassage(userId)) {
  const now = new Date().toISOString()
  return {
    id: uid('lectio'),
    userId,
    passageId: passage.id,
    passage,
    sessionDate: todayKey(),
    stage: 'read',
    readNotes: '',
    keyWords: [],
    meditationNotes: '',
    prayerText: '',
    contemplationNotes: '',
    obedienceAction: '',
    resistanceDetected: [],
    graceReceived: '',
    completionScore: 0,
    events: [],
    createdAt: now,
    updatedAt: now,
  }
}

export function guidanceForLectioStage(stage, session, userInput = '') {
  const safety = detectCrisisMarkers(userInput)
  if (safety) return safety
  const reference = session?.passage?.reference || 'this passage'
  const map = {
    read: {
      title: 'Read slowly',
      prompt: `Read ${reference} without rushing. What word, phrase, or image stands out?`,
      aiResponse: 'Stay with one phrase before explaining it. Let the passage speak first.',
    },
    meditate: {
      title: 'Meditate',
      prompt: 'How does this passage touch desire, fear, sin, hope, calling, or trust?',
      aiResponse: 'Name one movement of the heart. Where is Christ inviting you toward truth?',
    },
    pray: {
      title: 'Pray',
      prompt: 'Turn the meditation into a short prayer.',
      aiResponse: 'Lord, form this word in me. Show me what to receive, confess, and obey today. Amen.',
    },
    contemplate: {
      title: 'Contemplate',
      prompt: 'Pause in stillness before God. What grace do you need to receive without striving?',
      aiResponse: 'Be quiet for a moment. You are not earning grace; you are receiving it in Christ.',
    },
    obey: {
      title: 'Live / Obey',
      prompt: 'Choose one concrete, small obedience action for the next 24 hours.',
      aiResponse: suggestObedienceAction(session),
    },
  }
  return map[stage] || map.read
}

export function submitLectioStage(session, stage, userInput) {
  const safety = detectCrisisMarkers(userInput)
  if (safety) return { session, guidance: safety, routed: true }
  const updated = { ...session, updatedAt: new Date().toISOString() }
  if (stage === 'read') {
    updated.readNotes = userInput
    updated.keyWords = extractKeywords(userInput).slice(0, 5)
  }
  if (stage === 'meditate') updated.meditationNotes = userInput
  if (stage === 'pray') updated.prayerText = userInput
  if (stage === 'contemplate') {
    updated.contemplationNotes = userInput
    updated.graceReceived = userInput
  }
  if (stage === 'obey') updated.obedienceAction = userInput
  updated.events = [
    ...(session.events || []),
    { id: uid('lectio_event'), stage, userInput, aiResponse: guidanceForLectioStage(stage, session, userInput).aiResponse || '', createdAt: new Date().toISOString() },
  ]
  const currentIndex = LECTIO_STAGES.indexOf(stage)
  updated.stage = currentIndex >= LECTIO_STAGES.length - 1 ? 'completed' : LECTIO_STAGES[currentIndex + 1]
  updated.completionScore = Math.round((updated.events.length / LECTIO_STAGES.length) * 100)
  return { session: updated, guidance: guidanceForLectioStage(updated.stage, updated), routed: false }
}

export function completeLectioSession(session) {
  return {
    ...session,
    stage: 'completed',
    completionScore: 100,
    updatedAt: new Date().toISOString(),
    formationInsight: buildLectioInsight(session),
  }
}

export function suggestObedienceAction(session) {
  const tags = session?.passage?.formationTags || []
  if (tags.includes('trust') || tags.includes('peace')) return 'Name one anxious concern, pray it honestly, and take one faithful next step without rehearsing the fear.'
  if (tags.includes('repentance')) return 'Confess one specific sin without excuse, receive mercy in Christ, and make one repair if it is wise and safe.'
  if (tags.includes('obedience')) return 'Choose one instruction from the passage and practice it once today in a concrete situation.'
  return 'Practice one small act of love, prayer, or restraint within the next 24 hours.'
}

export function buildLectioInsight(session) {
  const words = (session.keyWords || []).join(', ') || 'the passage'
  return `The meditation centered on ${words}. The next faithful step is: ${session.obedienceAction || suggestObedienceAction(session)}`
}

export function createMemoryItem(userId, verse) {
  const now = new Date().toISOString()
  return {
    id: uid('memory_item'),
    userId,
    verseId: verse.id,
    verse,
    status: 'learning',
    currentIntervalDays: 1,
    easeFactor: 2.5,
    reviewCount: 0,
    successCount: 0,
    failureCount: 0,
    lastReviewedAt: null,
    nextReviewAt: now,
    attempts: [],
    createdAt: now,
    updatedAt: now,
  }
}

export function normalizeTokens(text = '') {
  return String(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2)
}

export function scoreRecall(originalText, recallText) {
  const original = Array.from(new Set(normalizeTokens(originalText)))
  const recalled = new Set(normalizeTokens(recallText))
  if (!original.length) return { accuracyScore: 0, missingKeywords: [], extraWords: [] }
  const matched = original.filter((token) => recalled.has(token))
  const missingKeywords = original.filter((token) => !recalled.has(token)).slice(0, 8)
  const extraWords = Array.from(recalled).filter((token) => !original.includes(token)).slice(0, 8)
  return {
    accuracyScore: Math.round((matched.length / original.length) * 100) / 100,
    missingKeywords,
    extraWords,
  }
}

export function reviewMemoryItem(item, recallText, selfRating, applicationNote = '') {
  const result = scoreRecall(item.verse.verseText, recallText)
  const ratingMultiplier = { forgot: 1, hard: 1.2, good: 2, easy: 3 }[selfRating] || 1
  const current = Number(item.currentIntervalDays || 1)
  const nextInterval = selfRating === 'forgot' ? 1 : Math.min(90, Math.max(1, Math.round(current * ratingMultiplier)))
  const now = new Date()
  const nextReview = new Date(now)
  nextReview.setDate(nextReview.getDate() + nextInterval)
  const success = result.accuracyScore >= 0.65 && selfRating !== 'forgot'
  const attempt = {
    id: uid('memory_attempt'),
    userMemoryItemId: item.id,
    userId: item.userId,
    recallText,
    selfRating,
    applicationNote,
    accuracyScore: result.accuracyScore,
    missingKeywords: result.missingKeywords,
    extraWords: result.extraWords,
    aiFeedback: buildMemoryFeedback(result, selfRating),
    createdAt: now.toISOString(),
  }
  return {
    ...item,
    status: success && item.successCount >= 4 ? 'mastered' : 'reviewing',
    currentIntervalDays: nextInterval,
    reviewCount: item.reviewCount + 1,
    successCount: item.successCount + (success ? 1 : 0),
    failureCount: item.failureCount + (success ? 0 : 1),
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextReview.toISOString(),
    attempts: [attempt, ...(item.attempts || [])],
    updatedAt: now.toISOString(),
  }
}

export function buildMemoryFeedback(result, selfRating) {
  const pct = Math.round(result.accuracyScore * 100)
  const missing = result.missingKeywords.length ? ` Review these key words: ${result.missingKeywords.join(', ')}.` : ' The main words are present.'
  const tone = selfRating === 'forgot' ? 'Forgetting is part of learning; return gently and review again tomorrow.' : 'Good work. Keep connecting memory with obedience.'
  return `${tone} Accuracy: ${pct}%.${missing} Where can this verse shape one action today?`
}

export function recommendedMemoryVerses(focus = '') {
  if (!focus) return memoryVerses.slice(0, 6)
  const needle = String(focus).toLowerCase()
  return memoryVerses.filter((verse) => JSON.stringify(verse).toLowerCase().includes(needle)).slice(0, 6)
}

export function dueMemoryItems(items = [], date = new Date()) {
  const now = date.getTime()
  return items.filter((item) => !item.nextReviewAt || new Date(item.nextReviewAt).getTime() <= now)
}

export function createExamenSession(userId) {
  const now = new Date().toISOString()
  return {
    id: uid('examen'),
    userId,
    sessionDate: todayKey(),
    stage: 'gratitude',
    moodBefore: '',
    moodAfter: '',
    gratitudeItems: [],
    review: '',
    consolationMoments: [],
    desolationMoments: [],
    sinPatternsNoticed: [],
    graceMomentsNoticed: [],
    relationshipsToRepair: [],
    tomorrowIntention: '',
    prayerText: '',
    riskFlags: [],
    completedAt: null,
    insights: [],
    createdAt: now,
    updatedAt: now,
  }
}

export function examenPrompt(stage) {
  const prompts = {
    gratitude: 'What are 1-3 gifts from God you noticed today?',
    review: 'Walk through your day with God. What moments stand out?',
    consolation: 'Where did you sense faith, hope, love, peace, courage, or obedience?',
    desolation: 'Where did you notice fear, anger, envy, lust, pride, despair, numbness, or avoidance?',
    repentance: 'Is there anything you need to confess, repair, or surrender?',
    grace: 'What truth of the gospel do you need to receive tonight?',
    intention: 'What is one small intention for tomorrow?',
    prayer: 'Turn your examen into a short prayer.',
  }
  return prompts[stage] || prompts.gratitude
}

export function submitExamenStage(session, stage, value) {
  const safety = detectCrisisMarkers(value)
  if (safety) return { session, guidance: safety, routed: true }
  const updated = { ...session, updatedAt: new Date().toISOString() }
  const list = splitLines(value)
  if (stage === 'gratitude') updated.gratitudeItems = list
  if (stage === 'review') updated.review = value
  if (stage === 'consolation') updated.consolationMoments = list
  if (stage === 'desolation') updated.desolationMoments = list
  if (stage === 'repentance') {
    updated.sinPatternsNoticed = list
    updated.relationshipsToRepair = list.filter((item) => /repair|apolog|forgive|和好|道歉/i.test(item))
  }
  if (stage === 'grace') updated.graceMomentsNoticed = list
  if (stage === 'intention') updated.tomorrowIntention = value
  if (stage === 'prayer') updated.prayerText = value
  const index = EXAMEN_STAGES.indexOf(stage)
  updated.stage = index >= EXAMEN_STAGES.length - 1 ? 'completed' : EXAMEN_STAGES[index + 1]
  return { session: updated, guidance: { prompt: examenPrompt(updated.stage), title: updated.stage }, routed: false }
}

export function completeExamenSession(session) {
  const completed = {
    ...session,
    stage: 'completed',
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return { ...completed, insights: generateExamenInsights(completed) }
}

export function generateExamenInsights(session) {
  const insights = []
  if (session.desolationMoments?.length) {
    insights.push({
      type: 'emotion',
      title: 'A desolation pattern needs gentle attention',
      description: `You noticed ${session.desolationMoments[0]}. Keep the next response small, truthful, and embodied.`,
      recommendedNextAction: session.tomorrowIntention || 'Choose one small intention for tomorrow.',
    })
  }
  if (session.gratitudeItems?.length) {
    insights.push({
      type: 'gratitude',
      title: 'Gratitude is a formation anchor',
      description: `Today's gratitude began with: ${session.gratitudeItems[0]}. Return to this gift in prayer.`,
      recommendedNextAction: 'Name this gift again before sleep.',
    })
  }
  if (session.relationshipsToRepair?.length) {
    insights.push({
      type: 'relationship',
      title: 'Repair may be needed',
      description: 'One relationship may need wise repair. Keep safety, humility, and timing in view.',
      recommendedNextAction: session.relationshipsToRepair[0],
    })
  }
  return insights
}

export function createConfessionSession(userId, triggerContext = '') {
  const now = new Date().toISOString()
  return {
    id: uid('confession'),
    userId,
    sessionDate: todayKey(),
    stage: 'name',
    triggerContext,
    sinCategory: '',
    confessionText: '',
    affectedPeople: [],
    rootDesires: [],
    falseBeliefs: [],
    gospelTruthReceived: '',
    repairAction: '',
    repentanceAction: '',
    accountabilityNeeded: false,
    pastoralCareRecommended: false,
    riskFlags: [],
    actions: [],
    completedAt: null,
    createdAt: now,
    updatedAt: now,
  }
}

export function classifySinCategory(text = '') {
  const input = text.toLowerCase()
  const tests = [
    ['anger', /anger|rage|harsh|irritat|angry|怒/],
    ['lust', /lust|porn|sexual|欲/],
    ['envy', /envy|jealous|compare|嫉妒|比较/],
    ['pride', /pride|superior|approval|骄傲/],
    ['fear', /fear|anxious|control|怕|焦虑/],
    ['deceit', /lie|hide|dishonest|骗|隐瞒/],
    ['bitterness', /bitter|resent|forgive|苦毒|饶恕/],
    ['sloth', /lazy|avoid|procrastinat|懒|拖延/],
    ['greed', /greed|money|consume|贪/],
    ['unbelief', /unbelief|doubt|trust|不信/],
  ]
  return tests.find(([, pattern]) => pattern.test(input))?.[0] || 'other'
}

export function confessionPrompt(stage) {
  const prompts = {
    name: 'Name the issue truthfully, without minimizing or exaggerating.',
    confess: 'Say what happened before God with honesty, not self-hatred.',
    discern: 'What root desire, false belief, idol, or fear was underneath?',
    receive_grace: 'Receive gospel assurance. Forgiveness is not earned by your repair action.',
    turn: 'Choose one concrete repentance action.',
    repair: 'If someone was harmed, what wise and safe repair might be needed?',
    walk: 'Choose follow-up support, accountability, or a simple next step.',
  }
  return prompts[stage] || prompts.name
}

export function submitConfessionStage(session, stage, value, options = {}) {
  const safety = detectCrisisMarkers(value)
  if (safety) return { session: { ...session, pastoralCareRecommended: true }, guidance: safety, routed: true }
  const updated = { ...session, updatedAt: new Date().toISOString() }
  if (stage === 'name') {
    updated.triggerContext = value
    updated.sinCategory = classifySinCategory(value)
  }
  if (stage === 'confess') updated.confessionText = value
  if (stage === 'discern') {
    updated.rootDesires = extractRootDesires(value)
    updated.falseBeliefs = extractFalseBeliefs(value)
  }
  if (stage === 'receive_grace') updated.gospelTruthReceived = value || generateGospelAssurance(updated).text
  if (stage === 'turn') updated.repentanceAction = value
  if (stage === 'repair') {
    updated.repairAction = value
    updated.affectedPeople = value ? splitLines(value) : []
  }
  if (stage === 'walk') updated.accountabilityNeeded = Boolean(options.accountabilityNeeded)
  const index = CONFESSION_STAGES.indexOf(stage)
  updated.stage = index >= CONFESSION_STAGES.length - 1 ? 'completed' : CONFESSION_STAGES[index + 1]
  return { session: updated, guidance: { prompt: confessionPrompt(updated.stage), title: updated.stage }, routed: false }
}

export function completeConfessionSession(session) {
  const assurance = session.gospelTruthReceived || generateGospelAssurance(session).text
  const action = {
    id: uid('repentance_action'),
    userId: session.userId,
    confessionSessionId: session.id,
    actionType: session.accountabilityNeeded ? 'accountability' : 'habit_replacement',
    description: session.repentanceAction || 'Practice one concrete act of repentance today.',
    dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'planned',
    completionNotes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  return {
    ...session,
    gospelTruthReceived: assurance,
    actions: [action, ...(session.actions || [])],
    completedAt: new Date().toISOString(),
    stage: 'completed',
    updatedAt: new Date().toISOString(),
  }
}

export function generateGospelAssurance(session) {
  return gospelAssuranceTexts.find((item) => item.suitableForCategories.includes(session.sinCategory)) || gospelAssuranceTexts[1]
}

export function updateRepentanceAction(action, patch) {
  return { ...action, ...patch, updatedAt: new Date().toISOString() }
}

export function buildDashboard({ userId, lectioSessions = [], memoryItems = [], examenSessions = [], confessionSessions = [] }) {
  const today = todayKey()
  const lectio = lectioSessions.find((entry) => entry.userId === userId && entry.sessionDate === today)
  const examen = examenSessions.find((entry) => entry.userId === userId && entry.sessionDate === today)
  const confessionActions = confessionSessions.flatMap((session) => session.actions || [])
  return {
    today: {
      dailyPassage: getDailyPassage(userId),
      lectioStatus: !lectio ? 'not_started' : lectio.stage === 'completed' ? 'completed' : 'in_progress',
      memoryDueCount: dueMemoryItems(memoryItems.filter((item) => item.userId === userId)).length,
      examenStatus: examen?.stage === 'completed' ? 'completed' : 'not_started',
      repentanceActionsDue: confessionActions.filter((action) => action.status === 'planned'),
    },
    weeklySummary: {
      lectioCompletedCount: lectioSessions.filter((entry) => entry.userId === userId && entry.stage === 'completed').length,
      memoryReviewsCount: memoryItems.filter((item) => item.userId === userId).reduce((sum, item) => sum + (item.reviewCount || 0), 0),
      examenCompletedCount: examenSessions.filter((entry) => entry.userId === userId && entry.stage === 'completed').length,
      repentanceActionsCompletedCount: confessionActions.filter((action) => action.status === 'completed').length,
    },
    formationInsights: [
      ...(lectio?.formationInsight ? [lectio.formationInsight] : []),
      ...(examen?.insights || []).map((insight) => insight.description),
    ].slice(0, 4),
  }
}

function extractKeywords(text = '') {
  const stop = new Set(['this', 'that', 'with', 'from', 'have', 'what', 'when', 'where', 'and', 'the', 'you', 'for', 'are', 'was', 'were'])
  return normalizeTokens(text).filter((token) => !stop.has(token))
}

function splitLines(value = '') {
  return String(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function extractRootDesires(text = '') {
  const input = text.toLowerCase()
  const desires = []
  if (/control|safe|secure|掌控|安全/.test(input)) desires.push('control or security')
  if (/approval|seen|praise|认可|被看见/.test(input)) desires.push('approval or significance')
  if (/comfort|escape|relief|舒服|逃避/.test(input)) desires.push('comfort or escape')
  if (/power|win|right|赢|证明/.test(input)) desires.push('power or being right')
  return desires.length ? desires : ['a good desire that needs to be reordered under Christ']
}

function extractFalseBeliefs(text = '') {
  const input = text.toLowerCase()
  const beliefs = []
  if (/unless|must|have to|必须|否则/.test(input)) beliefs.push('I must secure this myself or I will not be okay.')
  if (/never|always|没人|总是/.test(input)) beliefs.push('This moment defines the whole story.')
  if (/worth|value|价值/.test(input)) beliefs.push('My worth depends on this outcome.')
  return beliefs.length ? beliefs : ['I acted as if something other than Christ had final authority.']
}
