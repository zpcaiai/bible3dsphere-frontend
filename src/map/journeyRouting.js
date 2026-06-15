// journeyRouting.js — 旅程站点 → 行进路线。
// 陆路：前端二次贝塞尔弧线（curvedPath）在前端生成，离线、即时、零网络。
// 海路（保罗等 sea 行程）：逐段经后端 /api/route（sea profile）解析真实航线，
//   任一段不可路由时回退为前端贝塞尔弧线兜底——绝不退化为生硬直线。
// 整条请求易因单段不可路由被 ORS 整体拒绝，故海路必须逐段；后端按段+profile
//   做了 DB 缓存，前端再加会话级内存缓存（含 in-flight 去重，失败不缓存）。
import { API_BASE } from '../api'
import { curvedPath, curvedSegment } from './arc'
import { isValidCoord } from './routePlayback'

const _cache = new Map() // key -> Promise<coords|null>（仅海路使用）

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

async function resolveSeaLeg(a, b) {
  for (const profile of ['sea', 'driving-car']) {
    const g = await fetchLeg(a, b, profile)
    if (g && g.length >= 2) return g
  }
  return curvedSegment(a, b) // 前端贝塞尔弧线兜底
}

/**
 * 解析整条旅程为行进路线。
 * @param {Array<[lng,lat]>} stationCoords 站点坐标（顺序即行程顺序）
 * @param {{sea?: boolean}} opts sea=true 走后端真实航线（保罗等）；否则前端贝塞尔弧线
 * @returns {Promise<Array<[lng,lat]>|null>} 拼接后的完整路线（不足两点返回 null）
 */
export function resolveJourneyRoute(stationCoords, { sea = false } = {}) {
  const pts = (stationCoords || []).filter(isValidCoord)
  if (pts.length < 2) return Promise.resolve(null)

  // 陆路：纯前端二次贝塞尔弧线，无后端请求
  if (!sea) {
    const coords = curvedPath(pts)
    return Promise.resolve(Array.isArray(coords) && coords.length >= 2 ? coords : null)
  }

  // 海路：逐段后端真实航线，弧线兜底
  const key = 's|' + pts.map((c) => `${c[0]},${c[1]}`).join(';')
  if (_cache.has(key)) return _cache.get(key)
  const promise = (async () => {
    const legs = await Promise.all(
      pts.slice(0, -1).map((a, i) => resolveSeaLeg(a, pts[i + 1])),
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
