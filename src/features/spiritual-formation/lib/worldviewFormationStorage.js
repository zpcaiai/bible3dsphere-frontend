export const WORLDVIEW_FORMATION_STORAGE_KEYS = {
  beliefSessions: 'worldviewFormation.beliefSessions',
  beliefObservations: 'worldviewFormation.beliefObservations',
  beliefPatterns: 'worldviewFormation.beliefPatterns',
  beliefReviews: 'worldviewFormation.beliefReviews',
  idolObservations: 'worldviewFormation.idolObservations',
  idolPatterns: 'worldviewFormation.idolPatterns',
  idolReviews: 'worldviewFormation.idolReviews',
  gospelSessions: 'worldviewFormation.gospelSessions',
  gospelActions: 'worldviewFormation.gospelActions',
  decisionSessions: 'worldviewFormation.decisionSessions',
  decisionOptions: 'worldviewFormation.decisionOptions',
  motiveChecks: 'worldviewFormation.motiveChecks',
  valueWeights: 'worldviewFormation.valueWeights',
  counselInputs: 'worldviewFormation.counselInputs',
  decisionSummaries: 'worldviewFormation.decisionSummaries',
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

export const listBeliefSessions = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.beliefSessions, userId)
export const saveBeliefSession = (session) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.beliefSessions, session)

export const listBeliefObservations = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.beliefObservations, userId)
export const saveBeliefObservation = (observation) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.beliefObservations, observation)

export const listBeliefPatterns = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.beliefPatterns, userId)
export const saveBeliefPattern = (pattern) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.beliefPatterns, pattern)

export const listBeliefReviews = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.beliefReviews, userId)
export const saveBeliefReview = (review) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.beliefReviews, review)

export const listIdolObservations = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.idolObservations, userId)
export const saveIdolObservation = (observation) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.idolObservations, observation)

export const listIdolPatterns = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.idolPatterns, userId)
export const saveIdolPattern = (pattern) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.idolPatterns, pattern)

export const listIdolReviews = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.idolReviews, userId)
export const saveIdolReview = (review) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.idolReviews, review)

export const listGospelSessions = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.gospelSessions, userId)
export const saveGospelSession = (session) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.gospelSessions, session)

export const listGospelActions = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.gospelActions, userId)
export const saveGospelAction = (action) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.gospelActions, action)

export const listDecisionSessions = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.decisionSessions, userId)
export const saveDecisionSession = (session) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.decisionSessions, session)

export const listDecisionOptions = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.decisionOptions, userId)
export const saveDecisionOption = (option) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.decisionOptions, option)

export const listMotiveChecks = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.motiveChecks, userId)
export const saveMotiveCheck = (check) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.motiveChecks, check)

export const listValueWeights = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.valueWeights, userId)
export const saveValueWeight = (weight) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.valueWeights, weight)

export const listCounselInputs = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.counselInputs, userId)
export const saveCounselInput = (input) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.counselInputs, input)

export const listDecisionSummaries = (userId) => listForUser(WORLDVIEW_FORMATION_STORAGE_KEYS.decisionSummaries, userId)
export const saveDecisionSummary = (summary) => upsert(WORLDVIEW_FORMATION_STORAGE_KEYS.decisionSummaries, summary)

export function loadWorldviewFormationData(userId) {
  return {
    beliefSessions: listBeliefSessions(userId),
    beliefObservations: listBeliefObservations(userId),
    beliefPatterns: listBeliefPatterns(userId),
    beliefReviews: listBeliefReviews(userId),
    idolObservations: listIdolObservations(userId),
    idolPatterns: listIdolPatterns(userId),
    idolReviews: listIdolReviews(userId),
    gospelSessions: listGospelSessions(userId),
    gospelActions: listGospelActions(userId),
    decisionSessions: listDecisionSessions(userId),
    decisionOptions: listDecisionOptions(userId),
    motiveChecks: listMotiveChecks(userId),
    valueWeights: listValueWeights(userId),
    counselInputs: listCounselInputs(userId),
    decisionSummaries: listDecisionSummaries(userId),
  }
}
