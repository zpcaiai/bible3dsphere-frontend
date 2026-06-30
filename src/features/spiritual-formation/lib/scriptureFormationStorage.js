export const SCRIPTURE_FORMATION_STORAGE_KEYS = {
  lectioSessions: 'scriptureFormation.lectioSessions',
  memoryItems: 'scriptureFormation.memoryItems',
  examenSessions: 'scriptureFormation.examenSessions',
  confessionSessions: 'scriptureFormation.confessionSessions',
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

export function saveLectioSession(session) {
  upsert(SCRIPTURE_FORMATION_STORAGE_KEYS.lectioSessions, session)
}

export function listLectioSessions(userId) {
  return readList(SCRIPTURE_FORMATION_STORAGE_KEYS.lectioSessions)
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
}

export function saveMemoryItem(item) {
  upsert(SCRIPTURE_FORMATION_STORAGE_KEYS.memoryItems, item)
}

export function listMemoryItems(userId) {
  return readList(SCRIPTURE_FORMATION_STORAGE_KEYS.memoryItems)
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => String(a.nextReviewAt || '').localeCompare(String(b.nextReviewAt || '')))
}

export function saveExamenSession(session) {
  upsert(SCRIPTURE_FORMATION_STORAGE_KEYS.examenSessions, session)
}

export function listExamenSessions(userId) {
  return readList(SCRIPTURE_FORMATION_STORAGE_KEYS.examenSessions)
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
}

export function saveConfessionSession(session) {
  upsert(SCRIPTURE_FORMATION_STORAGE_KEYS.confessionSessions, session)
}

export function listConfessionSessions(userId) {
  return readList(SCRIPTURE_FORMATION_STORAGE_KEYS.confessionSessions)
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
}

export function loadScriptureFormationData(userId) {
  return {
    lectioSessions: listLectioSessions(userId),
    memoryItems: listMemoryItems(userId),
    examenSessions: listExamenSessions(userId),
    confessionSessions: listConfessionSessions(userId),
  }
}
