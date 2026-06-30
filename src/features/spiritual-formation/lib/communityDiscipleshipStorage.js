export const COMMUNITY_DISCIPLESHIP_STORAGE_KEYS = {
  assessments: 'communityDiscipleship.assessments',
  discipleshipPaths: 'communityDiscipleship.paths',
  discipleshipSteps: 'communityDiscipleship.steps',
  discipleshipReviews: 'communityDiscipleship.reviews',
  accountabilityGroups: 'communityDiscipleship.groups',
  accountabilityMembers: 'communityDiscipleship.members',
  accountabilityGoals: 'communityDiscipleship.goals',
  accountabilityCheckins: 'communityDiscipleship.checkins',
  accountabilityResponses: 'communityDiscipleship.responses',
  groupPrayerRequests: 'communityDiscipleship.prayerRequests',
  groupReviews: 'communityDiscipleship.groupReviews',
  mentorRelationships: 'communityDiscipleship.mentorRelationships',
  mentorSessions: 'communityDiscipleship.mentorSessions',
  mentorObservations: 'communityDiscipleship.mentorObservations',
  mentorActionPlans: 'communityDiscipleship.mentorActionPlans',
  mentorReviews: 'communityDiscipleship.mentorReviews',
  churchProfiles: 'communityDiscipleship.churchProfiles',
  churchConnections: 'communityDiscipleship.churchConnections',
  churchRhythms: 'communityDiscipleship.churchRhythms',
  churchCheckins: 'communityDiscipleship.churchCheckins',
  ministryOpportunities: 'communityDiscipleship.ministryOpportunities',
  ministryMatches: 'communityDiscipleship.ministryMatches',
  churchReentryPlans: 'communityDiscipleship.churchReentryPlans',
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
  return readList(key).filter((entry) => entry.userId === userId || entry.createdByUserId === userId || entry.menteeUserId === userId || entry.mentorUserId === userId || entry.responderUserId === userId || entry.generatedByUserId === userId)
}

export const saveCommunityEntry = (key, entry) => upsert(key, entry)

export function loadCommunityDiscipleshipData(userId) {
  return {
    assessments: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.assessments, userId),
    discipleshipPaths: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.discipleshipPaths, userId),
    discipleshipSteps: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.discipleshipSteps, userId),
    discipleshipReviews: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.discipleshipReviews, userId),
    accountabilityGroups: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.accountabilityGroups, userId),
    accountabilityMembers: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.accountabilityMembers, userId),
    accountabilityGoals: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.accountabilityGoals, userId),
    accountabilityCheckins: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.accountabilityCheckins, userId),
    accountabilityResponses: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.accountabilityResponses, userId),
    groupPrayerRequests: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.groupPrayerRequests, userId),
    groupReviews: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.groupReviews, userId),
    mentorRelationships: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.mentorRelationships, userId),
    mentorSessions: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.mentorSessions, userId),
    mentorObservations: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.mentorObservations, userId),
    mentorActionPlans: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.mentorActionPlans, userId),
    mentorReviews: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.mentorReviews, userId),
    churchProfiles: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.churchProfiles, userId),
    churchConnections: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.churchConnections, userId),
    churchRhythms: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.churchRhythms, userId),
    churchCheckins: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.churchCheckins, userId),
    ministryOpportunities: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.ministryOpportunities, userId),
    ministryMatches: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.ministryMatches, userId),
    churchReentryPlans: listForUser(COMMUNITY_DISCIPLESHIP_STORAGE_KEYS.churchReentryPlans, userId),
  }
}
