import { detectCrisisMarkers, todayKey, uid } from './scriptureFormationEngine'
import { intercessionCategories, prayerTemplates, presencePractices, psalmProfiles } from '../data/prayerCommunionSeed'

const SENSITIVE_PATTERNS = [/diagnos/i, /affair/i, /abuse/i, /addict/i, /medical/i, /lawsuit/i, /private/i, /隐私/, /诊断/, /成瘾/, /婚外/, /医疗/, /法律/]

export function createDefaultPrayerRule(userId) {
  const now = new Date().toISOString()
  return {
    id: uid('prayer_rule'),
    userId,
    title: 'Beginner Rule of Prayer',
    description: 'A small daily rhythm for communion with God, not performance.',
    ruleType: 'daily',
    active: true,
    startDate: todayKey(),
    endDate: null,
    slots: [
      createPrayerRuleSlot(userId, 'morning', 'Morning Prayer', 5, 'morning-surrender', 1),
      createPrayerRuleSlot(userId, 'midday', 'Midday Presence Reset', 2, 'midday-presence', 2),
      createPrayerRuleSlot(userId, 'evening', 'Evening Gratitude and Rest', 7, 'evening-gratitude', 3),
    ],
    createdAt: now,
    updatedAt: now,
  }
}

export function createPrayerRuleSlot(userId, slotKey, displayName, durationMinutes = 5, templateId = 'morning-surrender', sortOrder = 0) {
  const now = new Date().toISOString()
  return {
    id: uid('prayer_slot'),
    userId,
    prayerRuleId: '',
    slotKey,
    displayName,
    targetTime: slotKey === 'morning' ? '07:00' : slotKey === 'midday' ? '12:00' : slotKey === 'evening' ? '21:00' : '',
    durationMinutes,
    prayerTemplateId: templateId,
    enabled: true,
    sortOrder,
    createdAt: now,
    updatedAt: now,
  }
}

export function normalizePrayerRule(rule) {
  return { ...rule, slots: (rule.slots || []).map((slot) => ({ ...slot, prayerRuleId: rule.id })) }
}

export function getTodayPrayerPlan(userId, rules = [], sessions = []) {
  const activeRule = normalizePrayerRule(rules.find((rule) => rule.userId === userId && rule.active) || createDefaultPrayerRule(userId))
  const today = todayKey()
  const todaySessions = sessions.filter((session) => session.userId === userId && session.sessionDate === today)
  const slots = activeRule.slots.filter((slot) => slot.enabled).sort((a, b) => a.sortOrder - b.sortOrder).map((slot) => ({
    ...slot,
    template: prayerTemplates.find((template) => template.id === slot.prayerTemplateId) || prayerTemplates[0],
    session: todaySessions.find((session) => session.prayerRuleSlotId === slot.id) || null,
  }))
  return { activeRule, slots, completedCount: slots.filter((slot) => slot.session?.status === 'completed').length }
}

export function startPrayerSession(userId, rule, slot) {
  const now = new Date().toISOString()
  return {
    id: uid('prayer_session'),
    userId,
    prayerRuleId: rule?.id || null,
    prayerRuleSlotId: slot?.id || null,
    sessionDate: todayKey(),
    startedAt: now,
    completedAt: null,
    durationMinutes: slot?.durationMinutes || null,
    prayerText: '',
    gratitudeItems: [],
    confessionItems: [],
    petitions: [],
    sensedObstacles: [],
    graceReceived: '',
    obediencePrompt: '',
    status: 'started',
    summary: '',
    createdAt: now,
    updatedAt: now,
  }
}

export function completePrayerSession(session, data = {}) {
  const safety = detectCrisisMarkers([data.prayerText, data.petitions, data.confessionItems].flat().join(' '))
  if (safety) return { session, guidance: safety, routed: true }
  const now = new Date().toISOString()
  const completed = {
    ...session,
    ...data,
    status: 'completed',
    completedAt: now,
    updatedAt: now,
    summary: buildPrayerSessionSummary(data),
    encouragement: 'Small faithfulness matters. Prayer is communion with God, not a scorecard.',
    nextAction: data.obediencePrompt || 'Keep the next prayer step small and realistic.',
  }
  return { session: completed, guidance: { message: completed.encouragement, nextAction: completed.nextAction }, routed: false }
}

export function buildPrayerSessionSummary(data = {}) {
  const gratitude = data.gratitudeItems?.[0] ? `gratitude for ${data.gratitudeItems[0]}` : 'honest prayer'
  const petition = data.petitions?.[0] ? `petition about ${data.petitions[0]}` : 'dependence on God'
  return `This session held ${gratitude} and ${petition}.`
}

export function generateRuleReview(userId, rule, sessions = []) {
  const related = sessions.filter((session) => session.userId === userId && session.prayerRuleId === rule.id)
  const completed = related.filter((session) => session.status === 'completed').length
  const skipped = related.filter((session) => session.status === 'skipped').length
  const totalSlots = Math.max(1, (rule.slots || []).length * 7)
  const consistencyScore = Math.round((completed / totalSlots) * 100) / 100
  return {
    id: uid('prayer_review'),
    userId,
    prayerRuleId: rule.id,
    completedSessionsCount: completed,
    skippedSessionsCount: skipped,
    consistencyScore,
    lifeGivingSlots: related.filter((session) => session.graceReceived).map((session) => session.prayerRuleSlotId).slice(0, 3),
    difficultSlots: consistencyScore < 0.35 ? ['Reduce the rule before adding more.'] : [],
    adjustmentSuggestions: suggestRuleAdjustments(consistencyScore),
    userReflection: '',
    createdAt: new Date().toISOString(),
  }
}

export function suggestRuleAdjustments(consistencyScore) {
  if (consistencyScore < 0.35) return ['Reduce to one daily slot for a week.', 'Keep sessions under five minutes.', 'Treat missed prayer as an invitation to return, not a failure label.']
  if (consistencyScore > 0.75) return ['Keep the rhythm stable before adding more.', 'Add intercession once or twice weekly if it remains life-giving.']
  return ['Keep the current rhythm and review again next week.']
}

export function createIntercessionTarget(userId, data) {
  const now = new Date().toISOString()
  return {
    id: uid('intercession_target'),
    userId,
    targetType: data.targetType || 'person',
    displayName: data.displayName || 'Prayer target',
    relationship: data.relationship || '',
    privacyLevel: data.privacyLevel || 'private',
    notes: data.notes || '',
    active: true,
    createdAt: now,
    updatedAt: now,
  }
}

export function detectPrivacyRisk(text = '') {
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(String(text || '')))
    ? 'This request may contain sensitive details about another person. Keep it private or anonymize it before sharing.'
    : ''
}

export function createPrayerRequest(userId, data) {
  const safety = detectCrisisMarkers(`${data.title || ''} ${data.description || ''}`)
  if (safety) return { request: null, guidance: safety, routed: true }
  const now = new Date()
  const next = new Date(now)
  next.setDate(next.getDate() + (data.urgency === 'urgent' ? 0 : data.urgency === 'high' ? 1 : 3))
  const request = {
    id: uid('prayer_request'),
    userId,
    targetId: data.targetId || null,
    title: data.title || 'Prayer request',
    description: data.description || '',
    category: intercessionCategories.includes(data.category) ? data.category : 'other',
    urgency: data.urgency || 'normal',
    privacyLevel: data.privacyLevel || 'private',
    status: 'active',
    answeredSummary: '',
    answeredAt: null,
    nextPrayAt: next.toISOString(),
    recurrenceRule: data.recurrenceRule || '',
    privacyWarning: detectPrivacyRisk(`${data.title || ''} ${data.description || ''}`),
    updates: [],
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }
  return { request, guidance: generateIntercessionPrompt(request), routed: false }
}

export function getTodayIntercessionPlan(userId, requests = [], now = new Date()) {
  const active = requests.filter((request) => request.userId === userId && request.status === 'active')
  return active
    .sort((a, b) => priorityForRequest(b, now) - priorityForRequest(a, now))
    .slice(0, 5)
}

function priorityForRequest(request, now) {
  const due = !request.nextPrayAt || new Date(request.nextPrayAt).getTime() <= now.getTime()
  const urgency = { urgent: 80, high: 50, normal: 20, low: 5 }[request.urgency] || 20
  const category = ['suffering', 'healing', 'protection'].includes(request.category) ? 20 : 0
  return urgency + (due ? 30 : 0) + category
}

export function generateIntercessionPrompt(request) {
  return {
    requestId: request.id,
    prayerDirection: `Pray for ${request.category || 'mercy'}, wisdom, endurance, and the comfort of Christ.`,
    samplePrayer: `Father, please bring mercy and wise help for ${request.title}. Keep me loving, discreet, and faithful in prayer.`,
    possibleLovingAction: 'Is there a small encouragement or practical help that would be loving and safe?',
  }
}

export function startIntercessionSession(userId, requests = [], mode = 'daily_list') {
  const now = new Date().toISOString()
  return {
    id: uid('intercession_session'),
    userId,
    sessionDate: todayKey(),
    startedAt: now,
    completedAt: null,
    durationMinutes: null,
    sessionMode: mode,
    notes: '',
    items: requests.map((request) => ({
      id: uid('intercession_item'),
      prayerRequestId: request.id,
      request,
      prayed: false,
      prayerText: '',
      burdenLevelBefore: null,
      burdenLevelAfter: null,
      followUpNeeded: false,
      followUpNote: '',
      createdAt: now,
      updatedAt: now,
    })),
    createdAt: now,
    updatedAt: now,
  }
}

export function markIntercessionItemPrayed(session, itemId, data = {}) {
  const safety = detectCrisisMarkers(data.prayerText || '')
  if (safety) return { session, guidance: safety, routed: true }
  const updated = {
    ...session,
    items: (session.items || []).map((item) => item.id === itemId ? { ...item, ...data, prayed: true, updatedAt: new Date().toISOString() } : item),
    updatedAt: new Date().toISOString(),
  }
  return { session: updated, guidance: { message: 'Marked prayed. Pray with love, privacy, and perseverance.' }, routed: false }
}

export function completeIntercessionSession(session) {
  return { ...session, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
}

export function markPrayerRequestAnswered(request, answeredSummary) {
  const now = new Date().toISOString()
  return {
    ...request,
    status: 'answered',
    answeredSummary: answeredSummary || 'Answered prayer recorded.',
    answeredAt: now,
    updates: [{ id: uid('request_update'), updateType: 'answered', updateText: answeredSummary || 'Answered prayer recorded.', createdAt: now }, ...(request.updates || [])],
    updatedAt: now,
  }
}

export function recommendPsalm(emotionalState = '', formationNeed = '') {
  const input = `${emotionalState} ${formationNeed}`.toLowerCase()
  const map = [
    [/anxiety|fear|焦虑|害怕/, [23, 27, 46, 121]],
    [/guilt|confess|sin|罪|内疚/, [32, 51, 130]],
    [/grief|lament|sad|sorrow|哀|悲/, [13, 42, 88]],
    [/praise|gratitude|thanks|赞美|感恩/, [8, 100, 103, 145]],
    [/anger|injustice|envy|不公|愤怒|嫉妒/, [10, 37, 73]],
    [/wisdom|formation|decision|智慧|塑造/, [1, 19, 119]],
    [/journey|travel|pilgrim|路程|旅/, [121, 122, 126]],
  ]
  const numbers = map.find(([pattern]) => pattern.test(input))?.[1] || [23, 46, 103]
  return numbers.map((number) => psalmProfiles.find((psalm) => psalm.psalmNumber === number)).filter(Boolean)
}

export function getPsalmMovementsForMode(mode = 'guided') {
  const movementMap = {
    lament: ['address_god', 'honest_complaint', 'ask_help', 'remember_truth', 'confess_trust', 'rest'],
    praise: ['address_god', 'remember_truth', 'praise', 'thanksgiving', 'vow_obedience', 'rest'],
    confession: ['address_god', 'honest_confession', 'ask_mercy', 'receive_grace', 'vow_obedience', 'rest'],
    trust: ['address_god', 'name_fear', 'remember_truth', 'confess_trust', 'ask_help', 'rest'],
    guided: ['address_god', 'honest_complaint', 'remember_truth', 'ask_help', 'confess_trust', 'rest'],
    free_prayer: ['address_god', 'free_prayer', 'rest'],
  }
  return movementMap[mode] || movementMap.guided
}

export function startPsalmPrayerSession(userId, psalmNumber = 23, mode = 'guided', emotionalStateBefore = []) {
  const now = new Date().toISOString()
  const profile = psalmProfiles.find((psalm) => psalm.psalmNumber === Number(psalmNumber)) || psalmProfiles.find((psalm) => psalm.psalmNumber === 23)
  return {
    id: uid('psalm_session'),
    userId,
    psalmNumber: profile.psalmNumber,
    profile,
    sessionDate: todayKey(),
    selectedMode: mode,
    emotionalStateBefore,
    emotionalStateAfter: [],
    keyVerse: '',
    honestPrayerText: '',
    reorientedPrayerText: '',
    obedienceOrRestStep: '',
    movements: getPsalmMovementsForMode(mode).map((movementKey, index) => ({ id: uid('psalm_movement'), movementKey, userInput: '', aiGuidance: guidanceForPsalmMovement(mode, movementKey), sortOrder: index })),
    activeMovementIndex: 0,
    completedAt: null,
    riskFlags: [],
    createdAt: now,
    updatedAt: now,
  }
}

export function guidanceForPsalmMovement(mode, movementKey) {
  if (mode === 'lament' && movementKey === 'rest') return 'You do not need to force a happy ending. Rest with God honestly.'
  if (movementKey === 'honest_complaint') return 'Tell God the truth without polishing it or collapsing into despair.'
  if (movementKey === 'remember_truth') return 'Name one truth about God from the Psalm, even if your feelings are still unsettled.'
  if (movementKey === 'vow_obedience') return 'Choose one concrete obedience or rest step. Keep it small.'
  if (movementKey === 'rest') return 'Stop striving. Let the prayer end in trust or honest waiting.'
  return 'Pray this movement in one or two honest sentences.'
}

export function submitPsalmMovement(session, movementKey, userInput) {
  const safety = detectCrisisMarkers(userInput)
  if (safety) return { session, guidance: safety, routed: true }
  const activeIndex = session.movements.findIndex((movement) => movement.movementKey === movementKey)
  const nextMovements = session.movements.map((movement) => movement.movementKey === movementKey ? { ...movement, userInput, aiGuidance: guidanceForPsalmMovement(session.selectedMode, movementKey) } : movement)
  const nextIndex = Math.min(nextMovements.length, activeIndex + 1)
  const updated = { ...session, movements: nextMovements, activeMovementIndex: nextIndex, updatedAt: new Date().toISOString() }
  if (/complaint|confession|fear|free_prayer/.test(movementKey)) updated.honestPrayerText = userInput
  if (/trust|truth|praise|grace/.test(movementKey)) updated.reorientedPrayerText = userInput
  if (/vow|rest/.test(movementKey)) updated.obedienceOrRestStep = userInput
  return { session: updated, guidance: { message: guidanceForPsalmMovement(session.selectedMode, nextMovements[nextIndex]?.movementKey || 'rest') }, routed: false }
}

export function completePsalmPrayerSession(session) {
  return {
    ...session,
    completedAt: new Date().toISOString(),
    activeMovementIndex: session.movements.length,
    summary: summarizePsalmPrayer(session),
    updatedAt: new Date().toISOString(),
  }
}

export function summarizePsalmPrayer(session) {
  const mode = session.selectedMode === 'lament' ? 'honest lament without forced positivity' : `${session.selectedMode} prayer`
  return `Psalm ${session.psalmNumber} shaped this as ${mode}. Next step: ${session.obedienceOrRestStep || 'rest with God honestly.'}`
}

export function recommendPresencePractice(contextLabel = '', emotionalState = '') {
  const input = `${contextLabel} ${emotionalState}`.toLowerCase()
  const key = /anxiety|fear|焦虑/.test(input) ? 'one_minute_breath_prayer'
    : /anger|conflict|冲突|怒/.test(input) ? 'conflict_pause'
      : /fatigue|tired|累/.test(input) ? 'fatigue_rest_prayer'
        : /temptation|试探/.test(input) ? 'temptation_pause'
          : /coding|work|工作|代码/.test(input) ? 'work_offering'
            : /commute|通勤/.test(input) ? 'commute_intercession'
              : /bored|numb|麻木/.test(input) ? 'gratitude_pause'
                : 'one_minute_breath_prayer'
  return presencePractices.find((practice) => practice.key === key) || presencePractices[0]
}

export function createPresenceCheckin(userId, data = {}) {
  const safety = detectCrisisMarkers(`${data.shortPrayer || ''} ${data.distractionNoted || ''}`)
  if (safety) return { checkin: null, guidance: safety, routed: true }
  const practice = data.practice || recommendPresencePractice(data.contextLabel, data.emotionalState)
  const now = new Date().toISOString()
  return {
    checkin: {
      id: uid('presence_checkin'),
      userId,
      practiceId: practice.id,
      practice,
      checkinTime: now,
      contextLabel: data.contextLabel || 'work',
      awarenessBefore: Number(data.awarenessBefore ?? 4),
      awarenessAfter: null,
      emotionalState: data.emotionalState ? [data.emotionalState] : [],
      shortPrayer: data.shortPrayer || '',
      distractionNoted: data.distractionNoted || '',
      returnAction: data.returnAction || '',
      completed: false,
      createdAt: now,
    },
    guidance: { message: practice.description },
    routed: false,
  }
}

export function completePresenceCheckin(checkin, data = {}) {
  const safety = detectCrisisMarkers(`${data.shortPrayer || ''} ${data.returnAction || ''}`)
  if (safety) return { checkin, guidance: safety, routed: true }
  return {
    checkin: {
      ...checkin,
      ...data,
      awarenessAfter: Number(data.awarenessAfter ?? checkin.awarenessBefore),
      completed: true,
    },
    guidance: { message: 'Presence awareness is a subjective formation indicator, not proof of God\'s nearness. Return gently and keep the practice small.' },
    routed: false,
  }
}

export function createPresenceRule(userId, data = {}) {
  const now = new Date().toISOString()
  return {
    id: uid('presence_rule'),
    userId,
    title: data.title || 'Daily presence pauses',
    active: true,
    triggerType: data.triggerType || 'context_based',
    triggerConfig: data.triggerConfig || { contexts: ['work', 'commute'] },
    practiceId: data.practiceId || presencePractices[0].id,
    createdAt: now,
    updatedAt: now,
  }
}

export function generatePresenceReflection(userId, checkins = []) {
  const mine = checkins.filter((checkin) => checkin.userId === userId && checkin.completed)
  const contexts = countBy(mine.map((checkin) => checkin.contextLabel).filter(Boolean))
  const distractions = countBy(mine.map((checkin) => checkin.distractionNoted).filter(Boolean))
  return {
    id: uid('presence_reflection'),
    userId,
    reflectionDate: todayKey(),
    totalCheckins: mine.length,
    mostCommonContexts: contexts.slice(0, 3),
    mostHelpfulPractices: countBy(mine.map((checkin) => checkin.practice?.title || checkin.practiceId)).slice(0, 3),
    recurringDistractions: distractions.slice(0, 3),
    summary: mine.length ? `You returned to awareness ${mine.length} time(s). Keep the next practice brief and concrete.` : 'No completed presence check-ins yet.',
    nextAdjustment: mine.length > 8 ? 'Reduce check-ins to avoid turning awareness into anxiety.' : 'Try one short pause in a real context today.',
    createdAt: new Date().toISOString(),
  }
}

export function detectOverburdeningRule(rules = []) {
  return rules.filter((rule) => rule.active).length > 4 ? 'This may be too many presence rules. Reduce the number before adding more.' : ''
}

export function buildPrayerDashboard({ userId, rules = [], prayerSessions = [], prayerRequests = [], psalmSessions = [], presenceCheckins = [] }) {
  const todayPlan = getTodayPrayerPlan(userId, rules, prayerSessions)
  const intercessionDue = getTodayIntercessionPlan(userId, prayerRequests)
  const recommendedPsalm = recommendPsalm('anxiety', 'trust')[0]
  return {
    today: {
      activePrayerRule: todayPlan.activeRule,
      prayerSlots: todayPlan.slots,
      completedPrayerSessions: todayPlan.completedCount,
      intercessionDueCount: intercessionDue.length,
      recommendedPsalm,
      presenceRecommendation: recommendPresencePractice('work', 'anxiety'),
      urgentFlags: prayerRequests.filter((request) => request.userId === userId && request.urgency === 'urgent' && request.status === 'active'),
    },
    weeklySummary: {
      prayerSessionsCompleted: prayerSessions.filter((session) => session.userId === userId && session.status === 'completed').length,
      intercessionItemsPrayed: prayerRequests.filter((request) => request.userId === userId && request.lastPrayedAt).length,
      answeredPrayersCount: prayerRequests.filter((request) => request.userId === userId && request.status === 'answered').length,
      psalmPrayerSessions: psalmSessions.filter((session) => session.userId === userId && session.completedAt).length,
      presenceCheckins: presenceCheckins.filter((checkin) => checkin.userId === userId && checkin.completed).length,
    },
    formationInsights: [
      todayPlan.completedCount ? 'Today already includes completed prayer sessions.' : 'Begin with one short prayer slot.',
      intercessionDue.length ? `${intercessionDue.length} intercession request(s) are due.` : 'No intercession requests are due right now.',
    ],
  }
}

export function orchestratePrayerIntent(userId, intentText = '', context = {}) {
  const safety = detectCrisisMarkers(intentText)
  if (safety) return { route: 'crisis_care', recommendedAction: safety, message: safety.message, nextEndpoint: 'crisis_care_system' }
  const input = intentText.toLowerCase()
  if (/confess|repent|认罪|悔改/.test(input)) return { route: 'confession', recommendedAction: {}, message: 'This belongs in the Confession & Repentance flow from Batch 1.', nextEndpoint: 'scripture_formation_confession' }
  if (/friend|someone|pray for|intercede|代祷|为.*祷告/.test(input)) return { route: 'intercession', recommendedAction: {}, message: 'Create or open an intercession request.', nextEndpoint: '/api/prayer/intercession/today' }
  if (/psalm|lament|praise|诗篇|哀歌|赞美/.test(input)) return { route: 'psalm_prayer', recommendedAction: recommendPsalm(context.emotion || intentText, context.formationNeed || '')[0], message: 'Pray through a Psalm with guided movements.', nextEndpoint: '/api/prayer/psalms/recommend' }
  if (/anxious|work|presence|pause|焦虑|工作|同在|暂停/.test(input)) return { route: 'presence', recommendedAction: recommendPresencePractice(context.lifeContext || 'work', context.emotion || 'anxiety'), message: 'Start one short practicing-presence check-in.', nextEndpoint: '/api/prayer/presence/recommend' }
  return { route: 'prayer_rule', recommendedAction: createDefaultPrayerRule(userId), message: 'Start with a small daily rhythm of prayer.', nextEndpoint: '/api/prayer/today' }
}

function countBy(values) {
  const counts = values.reduce((acc, value) => ({ ...acc, [value]: (acc[value] || 0) + 1 }), {})
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([value, count]) => ({ value, count }))
}
