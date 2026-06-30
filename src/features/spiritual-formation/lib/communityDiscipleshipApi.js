import { API_BASE } from '../../../api'
import { COMMUNITY_DISCIPLESHIP_STORAGE_KEYS as KEYS, saveCommunityEntry } from './communityDiscipleshipStorage'

function hasToken(token) {
  return Boolean(token)
}

async function requestJson(path, token, init = {}) {
  if (!hasToken(token)) return { ok: false, skipped: true }
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  })
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null
  if (!response.ok) throw new Error(data?.detail || data?.error || 'Community discipleship API request failed')
  return data || { ok: true }
}

function post(path, token, body = {}) {
  return requestJson(path, token, { method: 'POST', body: JSON.stringify(body) })
}

function patch(path, token, body = {}) {
  return requestJson(path, token, { method: 'PATCH', body: JSON.stringify(body) })
}

function saveRemote(key, entry) {
  if (entry?.id) saveCommunityEntry(key, entry)
}

function userStamped(userId, entry) {
  return { userId, ...entry }
}

export const communityDiscipleshipApi = {
  createAssessment: (token, body) => post('/discipleship/assessments', token, body),
  createPath: (token, body) => post('/discipleship/paths', token, body),
  completeStep: (token, stepId, status = 'completed') => patch(`/discipleship/steps/${stepId}`, token, { status }),
  createPathReview: (token, pathId) => post(`/discipleship/paths/${pathId}/review`, token),

  createGroup: (token, body) => post('/accountability-group/groups', token, body),
  createGoal: (token, groupId, body) => post(`/accountability-group/groups/${groupId}/goals`, token, body),
  createCheckin: (token, groupId, body) => post(`/accountability-group/groups/${groupId}/checkins`, token, body),
  createPrayer: (token, groupId, body) => post(`/accountability-group/groups/${groupId}/prayer-requests`, token, body),
  createGroupReview: (token, groupId) => post(`/accountability-group/groups/${groupId}/review`, token),

  createMentorRelationship: (token, body) => post('/mentor/relationships', token, body),
  createMentorSession: (token, relationshipId, body) => post(`/mentor/relationships/${relationshipId}/sessions`, token, body),
  createMentorObservation: (token, relationshipId, body) => post(`/mentor/relationships/${relationshipId}/observations`, token, body),
  createMentorPlan: (token, relationshipId, body) => post(`/mentor/relationships/${relationshipId}/action-plans`, token, body),
  createMentorReview: (token, relationshipId) => post(`/mentor/relationships/${relationshipId}/review`, token),

  createChurchProfile: (token, body) => post('/church-integration/profiles', token, body),
  createChurchConnection: (token, body) => post('/church-integration/connections', token, body),
  createChurchRhythm: (token, body) => post('/church-integration/rhythms', token, body),
  createChurchCheckin: (token, body) => post('/church-integration/checkins', token, body),
  createChurchReentryPlan: (token, body) => post('/church-integration/reentry-plans', token, body),
}

export async function hydrateCommunityDiscipleshipRemote(userId, token) {
  if (!hasToken(token)) return { ok: false, hydrated: 0, skipped: true }
  let hydrated = 0

  const activePath = await requestJson('/discipleship/paths/active', token).catch(() => null)
  if (activePath?.path) {
    saveRemote(KEYS.discipleshipPaths, userStamped(userId, {
      id: activePath.path.id,
      title: activePath.path.title || 'Discipleship pathway',
      currentStageKey: activePath.path.current_stage_key,
      targetStageKey: activePath.path.target_stage_key,
      durationDays: activePath.path.duration_days,
      status: 'active',
      createdAt: activePath.path.start_date,
    }))
    hydrated += 1
    for (const [index, step] of (activePath.path.steps || []).entries()) {
      saveRemote(KEYS.discipleshipSteps, userStamped(userId, {
        id: step.id,
        pathId: activePath.path.id,
        stepTitle: step.step_title,
        stepDescription: step.step_description,
        stepType: step.step_type,
        relatedModule: step.related_module,
        status: step.status,
        sortOrder: index,
      }))
      hydrated += 1
    }
  }

  const groups = await requestJson('/accountability-group/groups', token).catch(() => null)
  for (const group of groups?.groups || []) {
    saveRemote(KEYS.accountabilityGroups, userStamped(userId, {
      id: group.id,
      name: group.name,
      description: group.description,
      groupType: group.group_type,
      status: group.status,
      myRole: group.my_role,
    }))
    hydrated += 1
  }

  const relationships = await requestJson('/mentor/relationships', token).catch(() => null)
  for (const rel of relationships?.relationships || []) {
    saveRemote(KEYS.mentorRelationships, userStamped(userId, {
      id: rel.id,
      menteeUserId: userId,
      mentorUserId: rel.mentor_email,
      mentorEmail: rel.mentor_email,
      relationshipType: rel.relationship_type,
      permissionScope: rel.permission_scope,
      status: rel.status,
      createdAt: rel.created_at,
    }))
    hydrated += 1
  }

  const [connection, rhythms, profiles] = await Promise.all([
    requestJson('/church-integration/connections/current', token).catch(() => null),
    requestJson('/church-integration/rhythms', token).catch(() => null),
    requestJson('/church-integration/profiles', token).catch(() => null),
  ])
  if (connection?.connection) {
    saveRemote(KEYS.churchConnections, userStamped(userId, {
      id: connection.connection.id,
      churchProfileId: connection.connection.church_profile_id,
      connectionStatus: connection.connection.connection_status,
      baptismStatus: connection.connection.baptism_status,
      membershipStatus: connection.connection.membership_status,
      smallGroupStatus: connection.connection.small_group_status,
      pastoralContactStatus: connection.connection.pastoral_contact_status,
      notes: connection.connection.notes,
    }))
    hydrated += 1
  }
  for (const rhythm of rhythms?.rhythms || []) {
    saveRemote(KEYS.churchRhythms, userStamped(userId, {
      id: rhythm.id,
      rhythmType: rhythm.rhythm_type,
      title: rhythm.title,
      frequencyType: rhythm.frequency_type,
      status: rhythm.status,
    }))
    hydrated += 1
  }
  for (const profile of profiles?.profiles || []) {
    saveRemote(KEYS.churchProfiles, userStamped(userId, {
      id: profile.id,
      name: profile.name,
      description: profile.description,
      denomination: profile.denomination,
      locationText: profile.location_text,
    }))
    hydrated += 1
  }

  return { ok: true, hydrated }
}
