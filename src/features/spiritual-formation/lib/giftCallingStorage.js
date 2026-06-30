export const GIFT_CALLING_STORAGE_KEYS = {
  giftAssessments: 'giftCalling.giftAssessments',
  giftScores: 'giftCalling.giftScores',
  giftProfiles: 'giftCalling.giftProfiles',
  giftFeedbackEntries: 'giftCalling.giftFeedbackEntries',
  callingSessions: 'giftCalling.callingSessions',
  callingInputs: 'giftCalling.callingInputs',
  callingPatterns: 'giftCalling.callingPatterns',
  callingExperiments: 'giftCalling.callingExperiments',
  callingExperimentReviews: 'giftCalling.callingExperimentReviews',
  ministryOpportunities: 'giftCalling.ministryOpportunities',
  capacityProfiles: 'giftCalling.capacityProfiles',
  ministryMatches: 'giftCalling.ministryMatches',
  serviceTrials: 'giftCalling.serviceTrials',
  serviceReviews: 'giftCalling.serviceReviews',
  missionProfiles: 'giftCalling.missionProfiles',
  missionCommitments: 'giftCalling.missionCommitments',
  missionProjects: 'giftCalling.missionProjects',
  missionProjectLogs: 'giftCalling.missionProjectLogs',
  missionLifeReviews: 'giftCalling.missionLifeReviews',
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
  return readList(key).filter((entry) => entry.userId === userId || entry.createdByUserId === userId || entry.giverUserId === userId)
}

export const saveGiftCallingEntry = (key, entry) => upsert(key, entry)

export function loadGiftCallingData(userId) {
  return {
    giftAssessments: listForUser(GIFT_CALLING_STORAGE_KEYS.giftAssessments, userId),
    giftScores: readList(GIFT_CALLING_STORAGE_KEYS.giftScores),
    giftProfiles: listForUser(GIFT_CALLING_STORAGE_KEYS.giftProfiles, userId),
    giftFeedbackEntries: listForUser(GIFT_CALLING_STORAGE_KEYS.giftFeedbackEntries, userId),
    callingSessions: listForUser(GIFT_CALLING_STORAGE_KEYS.callingSessions, userId),
    callingInputs: listForUser(GIFT_CALLING_STORAGE_KEYS.callingInputs, userId),
    callingPatterns: listForUser(GIFT_CALLING_STORAGE_KEYS.callingPatterns, userId),
    callingExperiments: listForUser(GIFT_CALLING_STORAGE_KEYS.callingExperiments, userId),
    callingExperimentReviews: listForUser(GIFT_CALLING_STORAGE_KEYS.callingExperimentReviews, userId),
    ministryOpportunities: listForUser(GIFT_CALLING_STORAGE_KEYS.ministryOpportunities, userId),
    capacityProfiles: listForUser(GIFT_CALLING_STORAGE_KEYS.capacityProfiles, userId),
    ministryMatches: listForUser(GIFT_CALLING_STORAGE_KEYS.ministryMatches, userId),
    serviceTrials: listForUser(GIFT_CALLING_STORAGE_KEYS.serviceTrials, userId),
    serviceReviews: listForUser(GIFT_CALLING_STORAGE_KEYS.serviceReviews, userId),
    missionProfiles: listForUser(GIFT_CALLING_STORAGE_KEYS.missionProfiles, userId),
    missionCommitments: listForUser(GIFT_CALLING_STORAGE_KEYS.missionCommitments, userId),
    missionProjects: listForUser(GIFT_CALLING_STORAGE_KEYS.missionProjects, userId),
    missionProjectLogs: listForUser(GIFT_CALLING_STORAGE_KEYS.missionProjectLogs, userId),
    missionLifeReviews: listForUser(GIFT_CALLING_STORAGE_KEYS.missionLifeReviews, userId),
  }
}
