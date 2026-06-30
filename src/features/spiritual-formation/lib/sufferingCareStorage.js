export const SUFFERING_CARE_STORAGE_KEYS = {
  crisisAssessments: 'sufferingCare.crisisAssessments',
  crisisEvents: 'sufferingCare.crisisEvents',
  safetyPlans: 'sufferingCare.safetyPlans',
  crisisFollowups: 'sufferingCare.crisisFollowups',
  sufferingSessions: 'sufferingCare.sufferingSessions',
  sufferingSummaries: 'sufferingCare.sufferingSummaries',
  healingJourneys: 'sufferingCare.healingJourneys',
  healingEntries: 'sufferingCare.healingEntries',
  forgivenessPlans: 'sufferingCare.forgivenessPlans',
  healingMilestones: 'sufferingCare.healingMilestones',
  careRelationships: 'sufferingCare.careRelationships',
  careCases: 'sufferingCare.careCases',
  careLogs: 'sufferingCare.careLogs',
  carePlans: 'sufferingCare.carePlans',
  careFollowups: 'sufferingCare.careFollowups',
  careSummaries: 'sufferingCare.careSummaries',
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
  return readList(key).filter((entry) => entry.userId === userId || entry.careReceiverUserId === userId || entry.careReceiverUserId === userId)
}

export const listCrisisAssessments = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.crisisAssessments, userId)
export const saveCrisisAssessment = (assessment) => upsert(SUFFERING_CARE_STORAGE_KEYS.crisisAssessments, assessment)

export const listCrisisEvents = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.crisisEvents, userId)
export const saveCrisisEvent = (event) => upsert(SUFFERING_CARE_STORAGE_KEYS.crisisEvents, event)

export const listSafetyPlans = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.safetyPlans, userId)
export const saveSafetyPlan = (plan) => upsert(SUFFERING_CARE_STORAGE_KEYS.safetyPlans, plan)

export const listCrisisFollowups = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.crisisFollowups, userId)
export const saveCrisisFollowup = (followup) => upsert(SUFFERING_CARE_STORAGE_KEYS.crisisFollowups, followup)

export const listSufferingSessions = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.sufferingSessions, userId)
export const saveSufferingSession = (session) => upsert(SUFFERING_CARE_STORAGE_KEYS.sufferingSessions, session)

export const listSufferingSummaries = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.sufferingSummaries, userId)
export const saveSufferingSummary = (summary) => upsert(SUFFERING_CARE_STORAGE_KEYS.sufferingSummaries, summary)

export const listHealingJourneys = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.healingJourneys, userId)
export const saveHealingJourney = (journey) => upsert(SUFFERING_CARE_STORAGE_KEYS.healingJourneys, journey)

export const listHealingEntries = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.healingEntries, userId)
export const saveHealingEntry = (entry) => upsert(SUFFERING_CARE_STORAGE_KEYS.healingEntries, entry)

export const listForgivenessPlans = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.forgivenessPlans, userId)
export const saveForgivenessPlan = (plan) => upsert(SUFFERING_CARE_STORAGE_KEYS.forgivenessPlans, plan)

export const listHealingMilestones = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.healingMilestones, userId)
export const saveHealingMilestone = (milestone) => upsert(SUFFERING_CARE_STORAGE_KEYS.healingMilestones, milestone)

export const listCareRelationships = (userId) => readList(SUFFERING_CARE_STORAGE_KEYS.careRelationships).filter((entry) => entry.careReceiverUserId === userId || entry.caregiverUserId === userId)
export const saveCareRelationship = (relationship) => upsert(SUFFERING_CARE_STORAGE_KEYS.careRelationships, relationship)

export const listCareCases = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.careCases, userId)
export const saveCareCase = (careCase) => upsert(SUFFERING_CARE_STORAGE_KEYS.careCases, careCase)

export const listCareLogs = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.careLogs, userId)
export const saveCareLog = (log) => upsert(SUFFERING_CARE_STORAGE_KEYS.careLogs, log)

export const listCarePlans = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.carePlans, userId)
export const saveCarePlan = (plan) => upsert(SUFFERING_CARE_STORAGE_KEYS.carePlans, plan)

export const listCareFollowups = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.careFollowups, userId)
export const saveCareFollowup = (followup) => upsert(SUFFERING_CARE_STORAGE_KEYS.careFollowups, followup)

export const listCareSummaries = (userId) => listForUser(SUFFERING_CARE_STORAGE_KEYS.careSummaries, userId)
export const saveCareSummary = (summary) => upsert(SUFFERING_CARE_STORAGE_KEYS.careSummaries, summary)

export function loadSufferingCareData(userId) {
  return {
    crisisAssessments: listCrisisAssessments(userId),
    crisisEvents: listCrisisEvents(userId),
    safetyPlans: listSafetyPlans(userId),
    crisisFollowups: listCrisisFollowups(userId),
    sufferingSessions: listSufferingSessions(userId),
    sufferingSummaries: listSufferingSummaries(userId),
    healingJourneys: listHealingJourneys(userId),
    healingEntries: listHealingEntries(userId),
    forgivenessPlans: listForgivenessPlans(userId),
    healingMilestones: listHealingMilestones(userId),
    careRelationships: listCareRelationships(userId),
    careCases: listCareCases(userId),
    careLogs: listCareLogs(userId),
    carePlans: listCarePlans(userId),
    careFollowups: listCareFollowups(userId),
    careSummaries: listCareSummaries(userId),
  }
}
