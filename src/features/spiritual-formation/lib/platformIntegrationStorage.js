export const PLATFORM_INTEGRATION_STORAGE_KEYS = {
  doctrinePaths: 'platformIntegration.doctrinePaths',
  apologeticsDialogues: 'platformIntegration.apologeticsDialogues',
  spiritualProfiles: 'platformIntegration.spiritualProfiles',
  memoryItems: 'platformIntegration.memoryItems',
  dailyPlans: 'platformIntegration.dailyPlans',
  weeklyReviews: 'platformIntegration.weeklyReviews',
  tutorConversations: 'platformIntegration.tutorConversations',
  metricValues: 'platformIntegration.metricValues',
  graceEvidence: 'platformIntegration.graceEvidence',
  overloadSignals: 'platformIntegration.overloadSignals',
  analyticsReports: 'platformIntegration.analyticsReports',
  integrityAudits: 'platformIntegration.integrityAudits',
  organizations: 'platformIntegration.organizations',
  organizationMembers: 'platformIntegration.organizationMembers',
  moderationCases: 'platformIntegration.moderationCases',
  subscriptions: 'platformIntegration.subscriptions',
  deploymentHealthChecks: 'platformIntegration.deploymentHealthChecks',
  globalSessions: 'platformIntegration.globalSessions',
  formationEvents: 'platformIntegration.formationEvents',
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
  return readList(key).filter((entry) => entry.userId === userId || entry.ownerUserId === userId || entry.createdByUserId === userId || entry.invitedByUserId === userId)
}

export const savePlatformIntegrationEntry = (key, entry) => upsert(key, entry)

export function loadPlatformIntegrationData(userId) {
  return Object.fromEntries(Object.entries(PLATFORM_INTEGRATION_STORAGE_KEYS).map(([name, key]) => [name, listForUser(key, userId)]))
}
