// expansionApi.js — 内容与神学扩充：自包含 API 助手（content-theology-expansion 批次）
// 刻意不修改既有 src/api.js；只读式引用 getToken。
import { getToken } from '../auth'
import { getRuntimeLang } from '../i18n/runtime'

const API_BASE = (import.meta.env.VITE_API_BASE?.trim()) || '/api'

function authHeaders(json) {
  const t = (typeof getToken === 'function') ? getToken() : null
  const h = {}
  if (json) h['Content-Type'] = 'application/json'
  if (t) h['Authorization'] = `Bearer ${t}`
  return h
}

export function hasToken() {
  try { return !!(typeof getToken === 'function' && getToken()) } catch { return false }
}

export async function getMeta(prefix) {
  const r = await fetch(`${API_BASE}/${prefix}/meta?lang=${getRuntimeLang()}`, { headers: authHeaders(false) })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.detail || '加载失败')
  return d
}

export async function runAction(prefix, path, body) {
  const r = await fetch(`${API_BASE}/${prefix}/${path}`, {
    method: 'POST', headers: authHeaders(true), body: JSON.stringify({ lang: getRuntimeLang(), ...(body || {}) }),
  })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.detail || '提交失败')
  return d
}

export async function getBooks(continent) {
  const q = continent ? `?continent=${encodeURIComponent(continent)}` : ''
  const r = await fetch(`${API_BASE}/resources/books${q}`, { headers: authHeaders(false) })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.detail || '加载失败')
  return d
}

export async function getHymns() {
  const r = await fetch(`${API_BASE}/resources/hymns`, { headers: authHeaders(false) })
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.detail || '加载失败')
  return d
}
