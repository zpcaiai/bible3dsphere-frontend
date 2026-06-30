import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { communityDiscipleshipApi, hydrateCommunityDiscipleshipRemote } from '../lib/communityDiscipleshipApi'
import { COMMUNITY_DISCIPLESHIP_STORAGE_KEYS as KEYS } from '../lib/communityDiscipleshipStorage'

describe('communityDiscipleshipApi', () => {
  beforeEach(() => {
    window.localStorage.clear()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('posts B7 discipleship payloads with bearer auth', async () => {
    fetch.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, path_id: 'p1' }), { headers: { 'Content-Type': 'application/json' } }))
    const result = await communityDiscipleshipApi.createPath('token-1', { current_stage_key: 'rooted_disciple' })

    expect(result.path_id).toBe('p1')
    expect(fetch).toHaveBeenCalledWith('/api/discipleship/paths', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Authorization: 'Bearer token-1' }),
    }))
  })

  it('hydrates active B7 backend rows into local caches', async () => {
    fetch
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, path: { id: 'p1', title: 'Path', current_stage_key: 'rooted_disciple', target_stage_key: 'practicing_disciple', duration_days: 90, start_date: '2026-06-30', steps: [{ id: 's1', step_title: 'Pray', step_type: 'prayer', related_module: 'prayer', status: 'active' }] } }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, groups: [] }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, relationships: [] }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, connection: null }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, rhythms: [] }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, profiles: [] }), { headers: { 'Content-Type': 'application/json' } }))

    const result = await hydrateCommunityDiscipleshipRemote('u1', 'token-1')

    expect(result.hydrated).toBe(2)
    expect(JSON.parse(localStorage.getItem(KEYS.discipleshipPaths))[0].id).toBe('p1')
    expect(JSON.parse(localStorage.getItem(KEYS.discipleshipSteps))[0].id).toBe('s1')
  })
})
