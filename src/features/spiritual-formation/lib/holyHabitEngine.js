import { fastingPractices, holyHabitTemplates, restPractices, ruleDomains, ruleTemplates } from '../data/holyHabitSeed'
import { detectCrisisMarkers, todayKey, uid } from './scriptureFormationEngine'

const SAFETY_PATTERNS = [
  /eating disorder/i,
  /anorexia/i,
  /bulimia/i,
  /starve/i,
  /punish myself/i,
  /not deserve food/i,
  /lose weight/i,
  /pregnant/i,
  /diabetes/i,
  /medication.*food/i,
  /faint/i,
  /underweight/i,
  /coerced/i,
  /forced/i,
  /obsessive/i,
  /scrupulos/i,
  /厌食/,
  /暴食/,
  /催吐/,
  /不配吃/,
  /惩罚自己/,
  /减肥/,
  /怀孕/,
  /糖尿病/,
  /药.*食物/,
  /晕倒/,
  /强迫/,
]

const OVERLOAD_PATTERNS = [/burnout/i, /exhausted/i, /heavy rule/i, /failed every day/i, /obsessed with tracking/i, /效率偶像/, /精疲力尽/, /太重/, /一直失败/, /强迫记录/]

function nowIso() {
  return new Date().toISOString()
}

function daysFromNow(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return todayKey(date)
}

function includesAny(input, patterns) {
  return patterns.some((pattern) => pattern.test(String(input || '')))
}

function splitNeed(input = '') {
  return String(input || '').toLowerCase()
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)))
}

export function detectHolyHabitSafety(text = '') {
  const crisis = detectCrisisMarkers(text)
  if (crisis) return crisis
  if (includesAny(text, SAFETY_PATTERNS)) {
    return {
      route: 'crisis_care',
      recommendedNextSystem: 'crisis_care_system',
      message: 'This may involve medical risk, coercion, disordered eating, self-punishment, or obsessive spiritual tracking. Do not intensify the practice. Seek pastoral care, and medical or clinical support when health or safety is involved.',
    }
  }
  if (includesAny(text, OVERLOAD_PATTERNS)) {
    return {
      route: 'gentle_adjustment',
      recommendedNextSystem: 'pastoral_or_clinical_support_if_needed',
      message: 'This rule may be too heavy for the current season. Reduce the load, keep one small practice, and receive rest without shame.',
    }
  }
  return null
}

export function recommendRule(userId, contextText = '', seasonLabel = 'ordinary_time') {
  const input = splitNeed(`${contextText} ${seasonLabel}`)
  const templateId = /burnout|exhaust|rebuild|tired|疲惫|耗尽|重建/.test(input) ? 'burnout_recovery_rule'
    : /leader|leadership|pastor|manager|领导|牧者/.test(input) ? 'leadership_rule'
      : /suffer|grief|illness|pain|苦|病|哀伤/.test(input) ? 'suffering_season_rule'
        : /busy|work|career|startup|忙|工作/.test(input) ? 'busy_worker_rule'
          : /retreat|capacity|deep|深入|退修/.test(input) ? 'deep_formation_rule'
            : 'beginner_rule'
  const template = ruleTemplates.find((item) => item.id === templateId) || ruleTemplates[0]
  const safety = detectHolyHabitSafety(contextText)
  return {
    userId,
    seasonLabel,
    template,
    recommendedDomains: template.domainsConfig.map((config) => ruleDomains.find((domain) => domain.key === config.domainKey)).filter(Boolean),
    suggestedDurationDays: templateId === 'burnout_recovery_rule' || templateId === 'suffering_season_rule' ? 14 : 30,
    reviewDate: daysFromNow(templateId === 'deep_formation_rule' ? 45 : 30),
    warnings: [
      'A Rule of Life is a trellis for love, not a ladder for self-salvation.',
      ...(safety?.route === 'gentle_adjustment' ? [safety.message] : []),
    ],
  }
}

export function createRuleProfile(userId, data = {}) {
  const now = nowIso()
  return {
    id: uid('rule_profile'),
    userId,
    title: data.title || 'Gentle Rule of Life',
    description: data.description || 'A small rhythm for loving God and neighbor in this season.',
    seasonLabel: data.seasonLabel || 'ordinary_time',
    status: data.status || 'active',
    startDate: data.startDate || todayKey(),
    endDate: data.endDate || '',
    guidingScripture: data.guidingScripture || ['Matthew 11:28-30', 'John 15:5'],
    guidingValues: data.guidingValues || ['grace', 'love', 'faithfulness', 'rest'],
    formationFocuses: data.formationFocuses || ['communion with God', 'concrete love of neighbor'],
    sourceTemplateId: data.sourceTemplateId || null,
    createdAt: now,
    updatedAt: now,
  }
}

export function createRuleFromTemplate(userId, templateId = 'beginner_rule', data = {}) {
  const template = ruleTemplates.find((item) => item.id === templateId) || ruleTemplates[0]
  const profile = createRuleProfile(userId, {
    title: data.title || template.title,
    description: data.description || template.description,
    seasonLabel: data.seasonLabel || template.templateType,
    sourceTemplateId: template.id,
  })
  const commitments = template.domainsConfig.map((config) => createRuleCommitment(userId, profile, config.domainKey, config))
  return { profile, commitments, template, guidance: detectLegalismOrOverload(profile, commitments) }
}

export function createRuleCommitment(userId, profile, domainKey, data = {}) {
  const domain = ruleDomains.find((item) => item.key === domainKey) || ruleDomains[0]
  return {
    id: uid('rule_commitment'),
    userId,
    ruleProfileId: profile.id,
    domainKey: domain.key,
    domain,
    rhythm: data.rhythm || 'weekly',
    commitment: data.commitment || `Practice ${domain.displayName.toLowerCase()} in one small concrete way.`,
    minimum: data.minimum || 'Keep the smallest faithful version without shame.',
    status: data.status || 'active',
    graceNote: data.graceNote || 'This is a support for love, not a measurement of worth.',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
}

export function detectLegalismOrOverload(profile, commitments = []) {
  const active = commitments.filter((item) => item.status !== 'paused')
  const dailyCount = active.filter((item) => item.rhythm === 'daily' || /daily|every day/i.test(item.commitment)).length
  const season = splitNeed(profile?.seasonLabel || '')
  if (active.length > 8 || dailyCount > 4 || /burnout|suffering|rebuilding/.test(season)) {
    return {
      severity: active.length > 10 || dailyCount > 5 ? 'high' : 'medium',
      message: 'The rule may be too heavy. Reduce to prayer, Scripture, rest, and one act of love before adding more.',
      suggestedAdjustment: 'Keep one keystone daily practice and one weekly rest practice.',
    }
  }
  return {
    severity: 'low',
    message: 'The rule looks small enough to review without turning it into a scorecard.',
    suggestedAdjustment: 'Review in 2 to 4 weeks and simplify first if burden rises.',
  }
}

export function generateRuleReview(userId, profile, commitments = [], checkins = []) {
  const mine = checkins.filter((item) => item.userId === userId && (!profile || item.ruleProfileId === profile.id))
  const completed = mine.filter((item) => item.completed).length
  const burdenAvg = mine.length ? Math.round((mine.reduce((sum, item) => sum + Number(item.burdenScore || 0), 0) / mine.length) * 10) / 10 : null
  const overload = detectLegalismOrOverload(profile, commitments)
  return {
    id: uid('rule_review'),
    userId,
    ruleProfileId: profile?.id || null,
    reviewedAt: nowIso(),
    faithfulnessSummary: mine.length ? `${completed} of ${mine.length} checked practices were completed.` : 'No check-ins yet. Start with the smallest faithful practice.',
    burdenScoreAverage: burdenAvg,
    joyEvidence: mine.filter((item) => item.joyNoticed).map((item) => item.joyNoticed).slice(0, 4),
    adjustmentSuggestions: unique([overload.suggestedAdjustment, burdenAvg >= 7 ? 'Pause one demanding commitment this week.' : 'Keep practices concrete and small.']),
    graceReminder: 'God is not more loving when the chart looks better. Review is for wisdom, not condemnation.',
  }
}

export function recommendHabits(userId, formationNeed = '', context = '') {
  const input = splitNeed(`${formationNeed} ${context}`)
  const keys = /anger|conflict|harsh|怒|冲突/.test(input) ? ['conflict_pause', 'speech_restraint', 'evening_examen']
    : /anxiety|fear|焦虑|怕/.test(input) ? ['morning_prayer', 'psalm_prayer', 'gratitude_journal']
      : /lust|tempt|porn|情欲|试探/.test(input) ? ['temptation_escape_plan', 'scripture_memory_daily', 'technology_sabbath']
        : /money|envy|greed|spend|钱|嫉妒|消费/.test(input) ? ['generosity_practice', 'simplicity_audit', 'gratitude_journal']
          : /burnout|tired|rest|疲惫|安息/.test(input) ? ['weekly_sabbath', 'technology_sabbath', 'evening_examen']
            : /dry|cold|prayer|枯干|冷淡/.test(input) ? ['morning_prayer', 'lectio_divina_weekly', 'psalm_prayer']
              : ['morning_prayer', 'evening_examen', 'hidden_service']
  return keys.map((key) => holyHabitTemplates.find((habit) => habit.key === key)).filter(Boolean)
}

export function createHabitPlan(userId, habit, data = {}) {
  const template = typeof habit === 'string' ? holyHabitTemplates.find((item) => item.key === habit) : habit
  const selected = template || holyHabitTemplates[0]
  const now = nowIso()
  return {
    id: uid('habit_plan'),
    userId,
    habitTemplateKey: selected.key,
    title: data.title || selected.title,
    description: data.description || selected.description,
    cadence: data.cadence || (selected.key.includes('weekly') ? 'weekly' : 'daily'),
    preferredTime: data.preferredTime || 'morning',
    durationMinutes: Number(data.durationMinutes || 5),
    status: 'active',
    startDate: todayKey(),
    endDate: data.endDate || '',
    graceMinimum: data.graceMinimum || 'One honest sentence before God counts as returning.',
    streak: 0,
    createdAt: now,
    updatedAt: now,
  }
}

export function getTodayHabits(userId, plans = [], targetDate = new Date()) {
  const day = targetDate.getDay()
  return plans
    .filter((plan) => plan.userId === userId && plan.status === 'active')
    .filter((plan) => plan.cadence !== 'weekly' || day === 0 || day === 6)
    .map((plan) => ({ ...plan, dueDate: todayKey(targetDate) }))
}

export function checkinHabit(userId, plan, data = {}) {
  const safety = detectHolyHabitSafety(`${data.reflection || ''} ${data.notes || ''}`)
  if (safety?.route === 'crisis_care') return { checkin: null, guidance: safety, routed: true }
  const completed = data.completed !== false
  return {
    checkin: {
      id: uid('habit_checkin'),
      userId,
      habitPlanId: plan.id,
      habitTemplateKey: plan.habitTemplateKey,
      checkinDate: data.checkinDate || todayKey(),
      completed,
      missedReason: completed ? '' : data.missedReason || 'missed without shame',
      burdenScore: Number(data.burdenScore || 3),
      joyNoticed: data.joyNoticed || '',
      reflection: data.reflection || '',
      graceResponse: completed ? 'Give thanks and keep it small.' : 'Receive grace, simplify if needed, and return gently.',
      createdAt: nowIso(),
    },
    guidance: safety || { message: completed ? 'Habit check-in saved.' : 'Missed habits are invitations to adjustment, not shame.' },
    routed: false,
  }
}

export function updateHabitStreak(plan, checkins = []) {
  const mine = checkins.filter((item) => item.habitPlanId === plan.id).sort((a, b) => a.checkinDate.localeCompare(b.checkinDate))
  let streak = 0
  for (const item of mine) streak = item.completed ? streak + 1 : 0
  return { ...plan, streak, updatedAt: nowIso() }
}

export function generateHabitReview(userId, plan, checkins = []) {
  const mine = checkins.filter((item) => item.userId === userId && item.habitPlanId === plan.id)
  const completed = mine.filter((item) => item.completed).length
  const completionRate = mine.length ? Math.round((completed / mine.length) * 100) : 0
  return {
    id: uid('habit_review'),
    userId,
    habitPlanId: plan.id,
    completionRate,
    summary: mine.length ? `${plan.title}: ${completionRate}% completion across ${mine.length} check-in(s).` : `${plan.title}: begin with the grace minimum.`,
    adjustmentSuggestions: completionRate < 50 ? ['Reduce duration or cadence.', plan.graceMinimum] : ['Keep the habit small enough to remain prayerful.'],
    warning: mine.some((item) => item.burdenScore >= 8) ? 'Burden is high. Simplify or pause this plan.' : '',
    createdAt: nowIso(),
  }
}

export function createSabbathPlan(userId, data = {}) {
  return {
    id: uid('sabbath_plan'),
    userId,
    title: data.title || 'Weekly Sabbath and Rest Plan',
    weeklyDay: data.weeklyDay || 'Sunday',
    startTime: data.startTime || '09:00',
    endTime: data.endTime || '15:00',
    practices: data.practices || ['worship_preparation', 'slow_meal_gratitude', 'phone_free_morning'],
    boundaries: data.boundaries || ['No work email during the block.', 'Keep phone away from meals.'],
    status: 'active',
    theologyNote: 'Sabbath is received as trust and worship, not earned as a productivity technique.',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
}

export function createRestAudit(userId, data = {}) {
  return {
    id: uid('rest_audit'),
    userId,
    auditedAt: nowIso(),
    sleepHours: Number(data.sleepHours || 6),
    workPressure: Number(data.workPressure || 6),
    phoneCompulsion: Number(data.phoneCompulsion || 5),
    worshipDisrupted: Boolean(data.worshipDisrupted),
    restGuilt: Number(data.restGuilt || 5),
    blockers: data.blockers || [],
    notes: data.notes || '',
  }
}

export function analyzeRestBlockers(audit) {
  const blockers = []
  if (audit.sleepHours < 6.5) blockers.push('sleep_debt')
  if (audit.workPressure >= 7) blockers.push('productivity_idol')
  if (audit.phoneCompulsion >= 7) blockers.push('technology_compulsion')
  if (audit.restGuilt >= 7) blockers.push('rest_guilt')
  if (audit.worshipDisrupted) blockers.push('worship_disruption')
  const practiceKeys = blockers.includes('technology_compulsion') ? ['phone_free_morning', 'no_work_email_block', 'walk_without_podcast']
    : blockers.includes('sleep_debt') ? ['nap_or_sleep_recovery', 'worship_preparation', 'slow_meal_gratitude']
      : ['slow_meal_gratitude', 'delight_in_creation', 'psalm_23_rest_prayer']
  return {
    blockers,
    warning: blockers.length >= 3 ? 'Rest is under significant pressure. Reduce obligations and seek help if exhaustion is severe.' : 'Choose one concrete rest boundary this week.',
    recommendedPractices: practiceKeys.map((key) => restPractices.find((item) => item.key === key)).filter(Boolean),
  }
}

export function createSabbathSession(userId, plan, data = {}) {
  return {
    id: uid('sabbath_session'),
    userId,
    sabbathPlanId: plan?.id || null,
    sessionDate: data.sessionDate || todayKey(),
    practices: data.practices || plan?.practices || ['slow_meal_gratitude'],
    status: 'started',
    restBefore: Number(data.restBefore || 4),
    restAfter: null,
    gratitude: '',
    resistanceNoticed: '',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  }
}

export function completeSabbathSession(session, data = {}) {
  return {
    ...session,
    status: 'completed',
    restAfter: Number(data.restAfter || 7),
    gratitude: data.gratitude || 'Received rest as a gift.',
    resistanceNoticed: data.resistanceNoticed || '',
    updatedAt: nowIso(),
    completedAt: nowIso(),
  }
}

export function generateSabbathReview(userId, sessions = []) {
  const mine = sessions.filter((item) => item.userId === userId)
  const completed = mine.filter((item) => item.status === 'completed')
  return {
    id: uid('sabbath_review'),
    userId,
    completedSessions: completed.length,
    summary: completed.length ? `${completed.length} Sabbath/rest block(s) completed. Notice where trust increased.` : 'Begin with a one-hour rest block if a full Sabbath is too much.',
    recommendedAdjustment: completed.some((item) => Number(item.restAfter || 0) < Number(item.restBefore || 0)) ? 'Reduce planning. Choose less control and more receiving.' : 'Protect one boundary and one delight practice.',
    createdAt: nowIso(),
  }
}

export function createRestBoundaryRule(userId, data = {}) {
  return {
    id: uid('rest_boundary'),
    userId,
    title: data.title || 'Rest boundary',
    boundaryType: data.boundaryType || 'technology',
    ruleText: data.ruleText || 'No phone during the first 30 minutes after waking.',
    reason: data.reason || 'To protect attention for God, body, and neighbor.',
    status: 'active',
    createdAt: nowIso(),
  }
}

export function detectUnsafeFastingLanguage(text = '') {
  const safety = detectHolyHabitSafety(text)
  if (!safety) return null
  return safety.route === 'gentle_adjustment' ? null : safety
}

export function recommendFastingPractice(userId, formationNeed = '', healthContext = '') {
  const input = splitNeed(`${formationNeed} ${healthContext}`)
  const unsafe = detectUnsafeFastingLanguage(input)
  if (unsafe) {
    return {
      practice: fastingPractices.find((item) => item.key === 'digital_declutter'),
      guidance: unsafe,
      alternatives: fastingPractices.filter((item) => item.fastingType !== 'food').slice(0, 4),
    }
  }
  const key = /phone|screen|social|digital|tech|手机|社交/.test(input) ? 'social_media_24h_fast'
    : /money|spend|shopping|买|钱/.test(input) ? 'spending_fast_one_week'
      : /speech|complain|gossip|defend|说话|抱怨/.test(input) ? 'speech_fast_half_day'
        : /comfort|entertainment|numb|comfort|娱乐/.test(input) ? 'entertainment_fast'
          : /food|meal|禁食/.test(input) ? 'one_meal_food_fast'
            : 'digital_declutter'
  return {
    practice: fastingPractices.find((item) => item.key === key) || fastingPractices[0],
    guidance: { message: 'Choose fasting as desire training toward love, not self-punishment.' },
    alternatives: fastingPractices.filter((item) => item.fastingType !== 'food').slice(0, 4),
  }
}

export function validateFastingSafety(data = {}) {
  const practice = fastingPractices.find((item) => item.key === data.practiceKey)
  const unsafe = detectUnsafeFastingLanguage(`${data.healthContext || ''} ${data.motive || ''}`)
  if (unsafe) return { ok: false, guidance: unsafe, alternatives: fastingPractices.filter((item) => item.fastingType !== 'food') }
  if (practice?.fastingType === 'food' && !data.healthAcknowledgement) {
    return {
      ok: false,
      guidance: {
        route: 'health_acknowledgement_required',
        recommendedNextSystem: 'medical_or_pastoral_discernment',
        message: 'Food fasting requires health acknowledgement and must be avoided with medical risk, eating-disorder history, pregnancy, medication needs, coercion, or self-punishment motives. Choose a non-food fast if unsure.',
      },
      alternatives: fastingPractices.filter((item) => item.fastingType !== 'food'),
    }
  }
  return { ok: true, guidance: { message: 'Fasting plan passes basic safety checks. Keep it gentle and interrupt it if health risk appears.' }, alternatives: [] }
}

export function createFastingPlan(userId, practiceKey = 'digital_declutter', data = {}) {
  const practice = fastingPractices.find((item) => item.key === practiceKey) || fastingPractices[0]
  const safety = validateFastingSafety({ ...data, practiceKey: practice.key })
  if (!safety.ok) return { plan: null, guidance: safety.guidance, alternatives: safety.alternatives, blocked: true, routed: safety.guidance.route === 'crisis_care' }
  const now = nowIso()
  return {
    plan: {
      id: uid('fasting_plan'),
      userId,
      practiceKey: practice.key,
      practice,
      title: data.title || practice.title,
      formationPurpose: data.formationPurpose || practice.formationPurpose,
      startDate: data.startDate || todayKey(),
      endDate: data.endDate || daysFromNow(practice.fastingType === 'spending' ? 7 : 1),
      status: 'active',
      motive: data.motive || 'dependence, simplicity, and love',
      safetyAcknowledged: practice.fastingType !== 'food' || Boolean(data.healthAcknowledgement),
      healthCaution: practice.healthCaution || 'Stop if unsafe and seek wise care.',
      createdAt: now,
      updatedAt: now,
    },
    guidance: safety.guidance,
    alternatives: [],
    blocked: false,
    routed: false,
  }
}

export function createFastingCheckin(userId, plan, data = {}) {
  const unsafe = detectUnsafeFastingLanguage(`${data.notes || ''} ${data.bodySignals || ''}`)
  if (unsafe) return { checkin: null, guidance: unsafe, routed: true }
  return {
    checkin: {
      id: uid('fasting_checkin'),
      userId,
      fastingPlanId: plan.id,
      checkinDate: data.checkinDate || todayKey(),
      status: data.status || 'completed',
      desireNoticed: data.desireNoticed || '',
      prayerResponse: data.prayerResponse || '',
      generosityResponse: data.generosityResponse || '',
      bodySignals: data.bodySignals || '',
      notes: data.notes || '',
      createdAt: nowIso(),
    },
    guidance: { message: 'Fasting check-in saved. The fruit is love, freedom, and generosity, not severity.' },
    routed: false,
  }
}

export function generateFastingReview(userId, plan, checkins = []) {
  const mine = checkins.filter((item) => item.userId === userId && item.fastingPlanId === plan.id)
  return {
    id: uid('fasting_review'),
    userId,
    fastingPlanId: plan.id,
    summary: mine.length ? `${plan.title}: ${mine.length} check-in(s), with desire and generosity reflected.` : `${plan.title}: review after one check-in.`,
    freedomEvidence: mine.map((item) => item.desireNoticed).filter(Boolean).slice(0, 4),
    generosityEvidence: mine.map((item) => item.generosityResponse).filter(Boolean).slice(0, 4),
    adjustment: plan.practice?.fastingType === 'food' ? 'Do not extend food fasting without wise health discernment.' : 'Keep the fast connected to prayer and concrete love.',
    createdAt: nowIso(),
  }
}

export function createSimplicityAudit(userId, data = {}) {
  return {
    id: uid('simplicity_audit'),
    userId,
    auditedAt: nowIso(),
    clutterScore: Number(data.clutterScore || 5),
    spendingPressure: Number(data.spendingPressure || 5),
    comparisonPressure: Number(data.comparisonPressure || 5),
    digitalNoise: Number(data.digitalNoise || 5),
    generosityReadiness: Number(data.generosityReadiness || 5),
    notes: data.notes || '',
  }
}

export function analyzeSimplicityAudit(audit) {
  const issues = []
  if (audit.clutterScore >= 7) issues.push('possessions')
  if (audit.spendingPressure >= 7) issues.push('spending')
  if (audit.comparisonPressure >= 7) issues.push('comparison')
  if (audit.digitalNoise >= 7) issues.push('digital_noise')
  const first = issues[0] || 'gratitude'
  return {
    issues,
    recommendedAction: first === 'spending' ? 'Pause one non-essential purchase and redirect part of it toward generosity.'
      : first === 'digital_noise' ? 'Remove one feed or app that trains envy or restlessness.'
        : first === 'possessions' ? 'Give away or clear one small category of unused possessions.'
          : 'Name three gifts and choose one concrete act of generosity.',
  }
}

export function createSimplicityAction(userId, audit, data = {}) {
  const analysis = analyzeSimplicityAudit(audit)
  return {
    id: uid('simplicity_action'),
    userId,
    auditId: audit.id,
    title: data.title || 'Simplicity action',
    actionText: data.actionText || analysis.recommendedAction,
    generosityLink: data.generosityLink || 'Make room for love, attention, and generosity.',
    status: 'active',
    createdAt: nowIso(),
  }
}

export function buildHolyHabitDashboard(data = {}) {
  const userId = data.userId || 'local-user'
  const activeRule = (data.ruleProfiles || []).find((profile) => profile.userId === userId && profile.status === 'active') || null
  const commitments = (data.commitments || []).filter((item) => item.userId === userId && (!activeRule || item.ruleProfileId === activeRule.id))
  const todayHabits = getTodayHabits(userId, data.habitPlans || [])
  const habitCheckins = (data.habitCheckins || []).filter((item) => item.userId === userId)
  const today = todayKey()
  const todayCompleted = habitCheckins.filter((item) => item.checkinDate === today && item.completed).length
  const restAudit = (data.restAudits || []).filter((item) => item.userId === userId)[0]
  const restAnalysis = restAudit ? analyzeRestBlockers(restAudit) : null
  const activeFastingPlan = (data.fastingPlans || []).find((plan) => plan.userId === userId && plan.status === 'active') || null
  return {
    userId,
    activeRule,
    commitments,
    todayHabits,
    habitCompletionSummary: {
      totalPlans: (data.habitPlans || []).filter((item) => item.userId === userId && item.status === 'active').length,
      todayCompleted,
      totalCheckins: habitCheckins.length,
    },
    nextSabbath: (data.sabbathPlans || []).find((plan) => plan.userId === userId && plan.status === 'active') || null,
    activeFastingPlan,
    restWarning: restAnalysis?.warning || 'No rest audit yet. Consider a short audit if work, technology, or guilt is crowding out worship and rest.',
    recommendedAdjustment: activeRule ? detectLegalismOrOverload(activeRule, commitments).suggestedAdjustment : 'Create a beginner rule before adding many habits.',
  }
}

export function orchestrateHolyHabitIntent(userId, intentText = '', context = {}) {
  const safety = detectHolyHabitSafety(intentText)
  if (safety?.route === 'crisis_care') {
    return { route: 'crisis_care', nextEndpoint: 'crisis_care_system', message: safety.message }
  }
  const input = splitNeed(intentText)
  if (safety?.route === 'gentle_adjustment' || /burnout|rest|sabbath|tired|安息|疲惫/.test(input)) {
    return { route: 'sabbath_rest', nextEndpoint: '/api/rule-of-life/sabbath', message: safety?.message || 'Start with rest audit and one concrete Sabbath boundary.', recommendation: recommendSabbathPractices(context.restAudit) }
  }
  if (/fast|simplicity|declutter|spend|phone|禁食|简朴|手机|消费/.test(input)) {
    const recommendation = recommendFastingPractice(userId, intentText, context.healthContext || '')
    return { route: 'fasting_simplicity', nextEndpoint: '/api/rule-of-life/fasting', message: recommendation.guidance.message, recommendation }
  }
  if (/habit|daily|weekly|missed|习惯|每日|每周|失败/.test(input)) {
    return { route: 'holy_habit_planner', nextEndpoint: '/api/rule-of-life/habits', message: 'Plan one small habit with a grace minimum.', recommendations: recommendHabits(userId, intentText) }
  }
  return { route: 'rule_of_life_builder', nextEndpoint: '/api/rule-of-life/builder', message: 'Build a gentle Rule of Life and review it as a trellis for love.', recommendation: recommendRule(userId, intentText, context.seasonLabel) }
}

export function recommendSabbathPractices(audit) {
  if (!audit) return restPractices.slice(0, 3)
  return analyzeRestBlockers(audit).recommendedPractices
}
