// journeyRouting.js — 旅程站点 → 自然行进路线（共用 /api/route 步行路由代理）。
// 逐段（相邻两站）请求：陆段 foot-walking → foot-hiking → driving-car 依次回退，
// 全部失败再试 sea（后端无 Key 也能返回平滑航行弧线）；海图集（保罗等）sea 优先。
// 任何一段彻底失败时用二次贝塞尔弧线兜底——绝不退化为生硬直线。
// 整条请求容易因单段不可路由（跨海/超距）被 ORS 整体拒绝，所以必须逐段。
// 后端按段+profile 做了 DB 缓存，前端再加会话级内存缓存（含 in-flight 去重）。
import { API_BASE } from '../api'
import { curvedSegment } from './arc'
import { isValidCoord } from './routePlayback'

const _cache = new Map() // key -> Promise<coords|null>

async function fetchLeg(a, b, profile) {
  try {
    const r = await fetch(`${API_BASE}/route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, coordinates: [a, b] }),
    })
    if (!r.ok) return null
    const d = await r.json()
    if (!d?.ok || !Array.isArray(d.geometry) || d.geometry.length < 2) return null
    return d.geometry
      .map((p) => [Number(p[0]), Number(p[1])])
      .filter(isValidCoord)
  } catch {
    return null
  }
}

async function resolveLeg(a, b, sea) {
  const chain = sea
    ? ['sea', 'driving-car']
    : ['foot-walking', 'foot-hiking', 'driving-car', 'sea']
  for (const profile of chain) {
    const g = await fetchLeg(a, b, profile)
    if (g && g.length >= 2) return g
  }
  return curvedSegment(a, b) // 弧线兜底
}

/**
 * 解析整条旅程为自然路线。
 * @param {Array<[lng,lat]>} stationCoords 站点坐标（顺序即行程顺序）
 * @param {{sea?: boolean}} opts sea=true 时按航线优先（保罗宣教等海上行程）
 * @returns {Promise<Array<[lng,lat]>|null>} 拼接后的完整路线（失败返回 null）
 */
export function resolveJourneyRoute(stationCoords, { sea = false } = {}) {
  const pts = (stationCoords || []).filter(isValidCoord)
  if (pts.length < 2) return Promise.resolve(null)
  const key = (sea ? 's|' : 'l|') + pts.map((c) => `${c[0]},${c[1]}`).join(';')
  if (_cache.has(key)) return _cache.get(key)
  const promise = (async () => {
    const legs = await Promise.all(
      pts.slice(0, -1).map((a, i) => resolveLeg(a, pts[i + 1], sea)),
    )
    const out = []
    for (const seg of legs) {
      const add = out.length ? seg.slice(1) : seg // 去掉衔接处重复点
      for (const p of add) out.push(p)
    }
    return out.length >= 2 ? out : null
  })()
  _cache.set(key, promise)
  promise.then((r) => { if (!r) _cache.delete(key) }) // 失败不缓存，允许重试
  return promise
}
