// arc.js — 地点连线弧线化工具（全站共用）
// 两点间用二次贝塞尔弧线（航线风格）替代生硬直线；多站点路线逐段拼接。
// 坐标统一 GeoJSON 顺序 [lng, lat]。

/** 两点间弧线段：控制点取中点向行进方向左侧偏移（偏移量与距离成正比）。 */
export function curvedSegment(a, b, curvature = 0.18, steps = 28) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const mx = (a[0] + b[0]) / 2
  const my = (a[1] + b[1]) / 2
  const cx = mx - dy * curvature
  const cy = my + dx * curvature
  const out = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const u = 1 - t
    out.push([u * u * a[0] + 2 * u * t * cx + t * t * b[0], u * u * a[1] + 2 * u * t * cy + t * t * b[1]])
  }
  return out
}

/** 多站点路线 → 弧线路径（去掉相邻段重复衔接点）。无效/不足两点时原样返回。 */
export function curvedPath(coordinates, curvature = 0.18, steps = 28) {
  if (!Array.isArray(coordinates) || coordinates.length < 2) return coordinates || []
  const pts = coordinates.filter((c) => Array.isArray(c) && Number.isFinite(+c[0]) && Number.isFinite(+c[1]))
  if (pts.length < 2) return pts
  const out = []
  for (let i = 0; i < pts.length - 1; i++) {
    const seg = curvedSegment(pts[i], pts[i + 1], curvature, steps)
    out.push(...(out.length ? seg.slice(1) : seg))
  }
  return out
}
