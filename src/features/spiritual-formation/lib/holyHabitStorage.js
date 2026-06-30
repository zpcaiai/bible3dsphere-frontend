export const HOLY_HABIT_STORAGE_KEYS = {
  ruleProfiles: 'holyHabit.ruleProfiles',
  commitments: 'holyHabit.ruleCommitments',
  ruleCheckins: 'holyHabit.ruleCheckins',
  ruleReviews: 'holyHabit.ruleReviews',
  habitPlans: 'holyHabit.habitPlans',
  habitCheckins: 'holyHabit.habitCheckins',
  habitReviews: 'holyHabit.habitReviews',
  sabbathPlans: 'holyHabit.sabbathPlans',
  sabbathSessions: 'holyHabit.sabbathSessions',
  restAudits: 'holyHabit.restAudits',
  sabbathReviews: 'holyHabit.sabbathReviews',
  boundaryRules: 'holyHabit.boundaryRules',
  fastingPlans: 'holyHabit.fastingPlans',
  fastingCheckins: 'holyHabit.fastingCheckins',
  fastingReviews: 'holyHabit.fastingReviews',
  simplicityAudits: 'holyHabit.simplicityAudits',
  simplicityActions: 'holyHabit.simplicityActions',
}

function hasStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readList(key) {
  if (!hasStorage()) return []
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeList(key, items) {
  if (!hasStorage()) return
  window.localStorage.setItem(key, JSON.stringify(items))
}

function upsert(key, entry) {
  const items = readList(key)
  const next = items.some((item) => item.id === entry.id)
    ? items.map((item) => item.id === entry.id ? entry : item)
    : [entry, ...items]
  writeList(key, next)
}

function listForUser(key, userId) {
  return readList(key).filter((entry) => entry.userId === userId)
}

export const listRuleProfiles = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.ruleProfiles, userId)
export const saveRuleProfile = (profile) => upsert(HOLY_HABIT_STORAGE_KEYS.ruleProfiles, profile)

export const listRuleCommitments = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.commitments, userId)
export const saveRuleCommitment = (commitment) => upsert(HOLY_HABIT_STORAGE_KEYS.commitments, commitment)

export const listRuleCheckins = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.ruleCheckins, userId)
export const saveRuleCheckin = (checkin) => upsert(HOLY_HABIT_STORAGE_KEYS.ruleCheckins, checkin)

export const listRuleReviews = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.ruleReviews, userId)
export const saveRuleReview = (review) => upsert(HOLY_HABIT_STORAGE_KEYS.ruleReviews, review)

export const listHabitPlans = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.habitPlans, userId)
export const saveHabitPlan = (plan) => upsert(HOLY_HABIT_STORAGE_KEYS.habitPlans, plan)

export const listHabitCheckins = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.habitCheckins, userId)
export const saveHabitCheckin = (checkin) => upsert(HOLY_HABIT_STORAGE_KEYS.habitCheckins, checkin)

export const listHabitReviews = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.habitReviews, userId)
export const saveHabitReview = (review) => upsert(HOLY_HABIT_STORAGE_KEYS.habitReviews, review)

export const listSabbathPlans = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.sabbathPlans, userId)
export const saveSabbathPlan = (plan) => upsert(HOLY_HABIT_STORAGE_KEYS.sabbathPlans, plan)

export const listSabbathSessions = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.sabbathSessions, userId)
export const saveSabbathSession = (session) => upsert(HOLY_HABIT_STORAGE_KEYS.sabbathSessions, session)

export const listRestAudits = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.restAudits, userId)
export const saveRestAudit = (audit) => upsert(HOLY_HABIT_STORAGE_KEYS.restAudits, audit)

export const listSabbathReviews = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.sabbathReviews, userId)
export const saveSabbathReview = (review) => upsert(HOLY_HABIT_STORAGE_KEYS.sabbathReviews, review)

export const listBoundaryRules = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.boundaryRules, userId)
export const saveBoundaryRule = (rule) => upsert(HOLY_HABIT_STORAGE_KEYS.boundaryRules, rule)

export const listFastingPlans = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.fastingPlans, userId)
export const saveFastingPlan = (plan) => upsert(HOLY_HABIT_STORAGE_KEYS.fastingPlans, plan)

export const listFastingCheckins = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.fastingCheckins, userId)
export const saveFastingCheckin = (checkin) => upsert(HOLY_HABIT_STORAGE_KEYS.fastingCheckins, checkin)

export const listFastingReviews = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.fastingReviews, userId)
export const saveFastingReview = (review) => upsert(HOLY_HABIT_STORAGE_KEYS.fastingReviews, review)

export const listSimplicityAudits = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.simplicityAudits, userId)
export const saveSimplicityAudit = (audit) => upsert(HOLY_HABIT_STORAGE_KEYS.simplicityAudits, audit)

export const listSimplicityActions = (userId) => listForUser(HOLY_HABIT_STORAGE_KEYS.simplicityActions, userId)
export const saveSimplicityAction = (action) => upsert(HOLY_HABIT_STORAGE_KEYS.simplicityActions, action)

export function loadHolyHabitData(userId) {
  return {
    ruleProfiles: listRuleProfiles(userId),
    commitments: listRuleCommitments(userId),
    ruleCheckins: listRuleCheckins(userId),
    ruleReviews: listRuleReviews(userId),
    habitPlans: listHabitPlans(userId),
    habitCheckins: listHabitCheckins(userId),
    habitReviews: listHabitReviews(userId),
    sabbathPlans: listSabbathPlans(userId),
    sabbathSessions: listSabbathSessions(userId),
    restAudits: listRestAudits(userId),
    sabbathReviews: listSabbathReviews(userId),
    boundaryRules: listBoundaryRules(userId),
    fastingPlans: listFastingPlans(userId),
    fastingCheckins: listFastingCheckins(userId),
    fastingReviews: listFastingReviews(userId),
    simplicityAudits: listSimplicityAudits(userId),
    simplicityActions: listSimplicityActions(userId),
  }
}
