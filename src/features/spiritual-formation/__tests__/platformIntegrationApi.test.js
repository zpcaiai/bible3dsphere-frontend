import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { hydratePlatformIntegrationRemote, platformIntegrationApi } from '../lib/platformIntegrationApi'
import { PLATFORM_INTEGRATION_STORAGE_KEYS as KEYS } from '../lib/platformIntegrationStorage'

describe('platformIntegrationApi', () => {
  beforeEach(() => {
    window.localStorage.clear()
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('posts B9-B13 payloads under formation-advanced with bearer auth', async () => {
    fetch.mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, run_id: 'r1' }), { headers: { 'Content-Type': 'application/json' } }))
    const result = await platformIntegrationApi.createMasterRun('token-1', { run_type: 'full_stack_validation' })

    expect(result.run_id).toBe('r1')
    expect(fetch).toHaveBeenCalledWith('/api/formation-advanced/master-build/runs', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({ Authorization: 'Bearer token-1' }),
    }))
  })

  it('hydrates formation-advanced backend rows into local platform caches', async () => {
    fetch
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, path: { id: 'dp1', topic_key: 'christology', duration_days: 30, goals: [], lessons: [], created_at: '2026-06-30T00:00:00Z' } }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, dialogues: [] }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, profile: null }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, conversations: [] }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, dashboard: { snapshots: [] } }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, reports: [] }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, tenants: [{ id: 't1', name: 'Church', tenant_type: 'church', status: 'active', my_role: 'owner' }] }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, runs: [] }), { headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true, matrix: [] }), { headers: { 'Content-Type': 'application/json' } }))

    const result = await hydratePlatformIntegrationRemote('u1', 'token-1')

    expect(result.hydrated).toBe(2)
    expect(JSON.parse(localStorage.getItem(KEYS.doctrinePaths))[0].id).toBe('dp1')
    expect(JSON.parse(localStorage.getItem(KEYS.organizations))[0].id).toBe('t1')
  })
})
