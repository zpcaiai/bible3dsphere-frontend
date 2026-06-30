import { API_BASE } from '../../../api'
import { PLATFORM_INTEGRATION_STORAGE_KEYS as KEYS, savePlatformIntegrationEntry } from './platformIntegrationStorage'

const ROOT = '/formation-advanced'

function hasToken(token) {
  return Boolean(token)
}

async function requestJson(path, token, init = {}) {
  if (!hasToken(token)) return { ok: false, skipped: true }
  const response = await fetch(`${API_BASE}${ROOT}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  })
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null
  if (!response.ok) throw new Error(data?.detail || data?.error || 'Formation advanced API request failed')
  return data || { ok: true }
}

function post(path, token, body = {}) {
  return requestJson(path, token, { method: 'POST', body: JSON.stringify(body) })
}

function saveRemote(key, entry) {
  if (entry?.id) savePlatformIntegrationEntry(key, entry)
}

function userStamped(userId, entry) {
  return { userId, ...entry }
}

export const platformIntegrationApi = {
  createDoctrinePath: (token, body) => post('/bible-doctrine/paths', token, body),
  createApologeticsDialogue: (token, body) => post('/bible-doctrine/apologetics/dialogues', token, body),
  upsertAgentProfile: (token, body) => post('/formation-agent/profiles', token, body),
  createRecommendation: (token, body) => post('/formation-agent/recommendations', token, body),
  createTutorConversation: (token, body) => post('/formation-agent/conversations', token, body),
  createMetricSnapshot: (token, body) => post('/analytics/snapshots', token, body),
  createReport: (token, body) => post('/analytics/reports', token, body),
  createIntegrityAudit: (token, body) => post('/analytics/integrity-audits', token, body),
  createTenant: (token, body) => post('/productization/tenants', token, body),
  addTenantMember: (token, tenantId, body) => post(`/productization/tenants/${tenantId}/members`, token, body),
  createSubscription: (token, body) => post('/productization/subscriptions', token, body),
  createModerationCase: (token, body) => post('/productization/moderation-cases', token, body),
  createMasterRun: (token, body) => post('/master-build/runs', token, body),
  createAcceptanceCheck: (token, body) => post('/master-build/acceptance-checks', token, body),
}

export async function hydratePlatformIntegrationRemote(userId, token) {
  if (!hasToken(token)) return { ok: false, hydrated: 0, skipped: true }
  let hydrated = 0

  const [path, dialogues, profile, conversations, dashboard, reports, tenants, runs, matrix] = await Promise.all([
    requestJson('/bible-doctrine/paths/active', token).catch(() => null),
    requestJson('/bible-doctrine/apologetics/dialogues', token).catch(() => null),
    requestJson('/formation-agent/profile', token).catch(() => null),
    requestJson('/formation-agent/conversations', token).catch(() => null),
    requestJson('/analytics/dashboard', token).catch(() => null),
    requestJson('/analytics/reports', token).catch(() => null),
    requestJson('/productization/tenants', token).catch(() => null),
    requestJson('/master-build/runs', token).catch(() => null),
    requestJson('/master-build/acceptance-matrix', token).catch(() => null),
  ])

  if (path?.path) {
    saveRemote(KEYS.doctrinePaths, userStamped(userId, {
      id: path.path.id,
      topicKey: path.path.topic_key,
      traditionContext: path.path.tradition_context,
      durationDays: path.path.duration_days,
      goals: path.path.goals || [],
      lessons: path.path.lessons || [],
      status: 'active',
      createdAt: path.path.created_at,
    }))
    hydrated += 1
  }
  for (const dialogue of dialogues?.dialogues || []) {
    saveRemote(KEYS.apologeticsDialogues, userStamped(userId, {
      id: dialogue.id,
      topicKey: dialogue.topic_key,
      question: dialogue.question,
      response: dialogue.response,
      createdAt: dialogue.created_at,
    }))
    hydrated += 1
  }
  if (profile?.profile) {
    saveRemote(KEYS.spiritualProfiles, userStamped(userId, {
      id: `remote-profile-${userId}`,
      season: profile.profile.season,
      consentAiTutor: profile.profile.consent_ai_tutor,
      consentMentorSummary: profile.profile.consent_mentor_summary,
      formationFocuses: profile.profile.formation_focuses || [],
      boundaries: profile.profile.boundaries || [],
      updatedAt: profile.profile.updated_at,
    }))
    hydrated += 1
  }
  for (const conversation of conversations?.conversations || []) {
    saveRemote(KEYS.tutorConversations, userStamped(userId, {
      id: conversation.id,
      conversationType: conversation.conversation_type,
      message: conversation.user_message,
      assistantReply: conversation.assistant_reply,
      safety: conversation.safety || {},
      createdAt: conversation.created_at,
    }))
    hydrated += 1
  }
  for (const snapshot of dashboard?.dashboard?.snapshots || []) {
    saveRemote(KEYS.metricValues, userStamped(userId, {
      id: `remote-snapshot-${snapshot.created_at}`,
      periodKey: snapshot.period_key,
      values: snapshot.metrics || {},
      createdAt: snapshot.created_at,
    }))
    hydrated += 1
  }
  for (const report of reports?.reports || []) {
    saveRemote(KEYS.analyticsReports, userStamped(userId, {
      id: report.id,
      title: report.title,
      reportScope: report.report_scope,
      content: report.content || {},
      mentorSafe: report.mentor_safe,
      createdAt: report.created_at,
    }))
    hydrated += 1
  }
  for (const tenant of tenants?.tenants || []) {
    saveRemote(KEYS.organizations, userStamped(userId, {
      id: tenant.id,
      name: tenant.name,
      tenantType: tenant.tenant_type,
      status: tenant.status,
      myRole: tenant.my_role,
    }))
    hydrated += 1
  }
  for (const run of runs?.runs || []) {
    saveRemote(KEYS.globalSessions, userStamped(userId, {
      id: run.id,
      runType: run.run_type,
      status: run.status,
      evidence: run.evidence || {},
      createdAt: run.created_at,
    }))
    hydrated += 1
  }
  for (const check of matrix?.matrix || []) {
    saveRemote(KEYS.formationEvents, userStamped(userId, {
      id: `remote-acceptance-${check.batch}-${check.check_key}-${check.created_at}`,
      eventType: 'acceptance_check',
      eventCategory: 'master_build',
      batch: check.batch,
      checkKey: check.check_key,
      status: check.status,
      evidence: check.evidence || {},
      createdAt: check.created_at,
    }))
    hydrated += 1
  }

  return { ok: true, hydrated }
}
