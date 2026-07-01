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

// 稳健解析响应：区分「HTTP 错误」「非 JSON（HTML/空）」「正常 JSON」，
// 避免把后端 404/休眠返回的 HTML 静默吞成 {} 导致「提交后什么都不显示」。
async function readJson(r, failMsg) {
  const raw = await r.text().catch(() => '')
  let d = null
  try { d = raw ? JSON.parse(raw) : null } catch { d = null }
  if (!r.ok) {
    if (r.status === 401) throw new Error('请先登录后再使用此功能。')
    const detail = (d && (d.detail || d.message)) || ''
    throw new Error(detail ? `${failMsg}：${detail}` : `${failMsg}（HTTP ${r.status}）`)
  }
  if (d == null || typeof d !== 'object') {
    // 收到了 HTML / 空响应：后端该路由未部署、服务未启动，或被前端兜底页拦截
    throw new Error('后端接口暂不可用：该功能的服务端可能尚未部署或未启动（返回了非 JSON）。请确认后端已部署并唤醒后重试。')
  }
  return d
}

export async function getMeta(prefix) {
  const r = await fetch(`${API_BASE}/${prefix}/meta?lang=${getRuntimeLang()}`, { headers: authHeaders(false) })
  return readJson(r, '加载失败')
}

export async function runAction(prefix, path, body) {
  const r = await fetch(`${API_BASE}/${prefix}/${path}`, {
    method: 'POST', headers: authHeaders(true), body: JSON.stringify({ lang: getRuntimeLang(), ...(body || {}) }),
  })
  return readJson(r, '提交失败')
}

export async function getBooks(continent) {
  const q = continent ? `?continent=${encodeURIComponent(continent)}` : ''
  const r = await fetch(`${API_BASE}/resources/books${q}`, { headers: authHeaders(false) })
  return readJson(r, '加载失败')
}

export async function getHymns() {
  const r = await fetch(`${API_BASE}/resources/hymns`, { headers: authHeaders(false) })
  return readJson(r, '加载失败')
}
