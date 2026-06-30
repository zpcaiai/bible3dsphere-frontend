export const PRAYER_COMMUNION_STORAGE_KEYS = {
  rules: 'prayerCommunion.rules',
  prayerSessions: 'prayerCommunion.prayerSessions',
  intercessionTargets: 'prayerCommunion.intercessionTargets',
  prayerRequests: 'prayerCommunion.prayerRequests',
  intercessionSessions: 'prayerCommunion.intercessionSessions',
  psalmSessions: 'prayerCommunion.psalmSessions',
  presenceCheckins: 'prayerCommunion.presenceCheckins',
  presenceRules: 'prayerCommunion.presenceRules',
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

export const listPrayerRules = (userId) => listForUser(PRAYER_COMMUNION_STORAGE_KEYS.rules, userId)
export const savePrayerRule = (rule) => upsert(PRAYER_COMMUNION_STORAGE_KEYS.rules, rule)

export const listPrayerSessions = (userId) => listForUser(PRAYER_COMMUNION_STORAGE_KEYS.prayerSessions, userId)
export const savePrayerSession = (session) => upsert(PRAYER_COMMUNION_STORAGE_KEYS.prayerSessions, session)

export const listIntercessionTargets = (userId) => listForUser(PRAYER_COMMUNION_STORAGE_KEYS.intercessionTargets, userId)
export const saveIntercessionTarget = (target) => upsert(PRAYER_COMMUNION_STORAGE_KEYS.intercessionTargets, target)

export const listPrayerRequests = (userId) => listForUser(PRAYER_COMMUNION_STORAGE_KEYS.prayerRequests, userId)
export const savePrayerRequest = (request) => upsert(PRAYER_COMMUNION_STORAGE_KEYS.prayerRequests, request)

export const listIntercessionSessions = (userId) => listForUser(PRAYER_COMMUNION_STORAGE_KEYS.intercessionSessions, userId)
export const saveIntercessionSession = (session) => upsert(PRAYER_COMMUNION_STORAGE_KEYS.intercessionSessions, session)

export const listPsalmSessions = (userId) => listForUser(PRAYER_COMMUNION_STORAGE_KEYS.psalmSessions, userId)
export const savePsalmSession = (session) => upsert(PRAYER_COMMUNION_STORAGE_KEYS.psalmSessions, session)

export const listPresenceCheckins = (userId) => listForUser(PRAYER_COMMUNION_STORAGE_KEYS.presenceCheckins, userId)
export const savePresenceCheckin = (checkin) => upsert(PRAYER_COMMUNION_STORAGE_KEYS.presenceCheckins, checkin)

export const listPresenceRules = (userId) => listForUser(PRAYER_COMMUNION_STORAGE_KEYS.presenceRules, userId)
export const savePresenceRule = (rule) => upsert(PRAYER_COMMUNION_STORAGE_KEYS.presenceRules, rule)

export function loadPrayerCommunionData(userId) {
  return {
    rules: listPrayerRules(userId),
    prayerSessions: listPrayerSessions(userId),
    intercessionTargets: listIntercessionTargets(userId),
    prayerRequests: listPrayerRequests(userId),
    intercessionSessions: listIntercessionSessions(userId),
    psalmSessions: listPsalmSessions(userId),
    presenceCheckins: listPresenceCheckins(userId),
    presenceRules: listPresenceRules(userId),
  }
}
