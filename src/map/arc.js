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

/** Catmull-Rom 平滑曲线：严格穿过每个站点，整体自然圆滑（旷野迁徙风格）。
 *  与 curvedPath（航线弧）不同：站点密集且行进方向多变时（如出埃及 40 站）更贴近真实步行轨迹。 */
export function catmullRomPath(coordinates, steps = 10) {
  const pts = (coordinates || []).filter((c) => Array.isArray(c) && Number.isFinite(+c[0]) && Number.isFinite(+c[1]))
  if (pts.length < 3) return curvedPath(pts)
  const out = [pts[0]]
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || pts[i + 1]
    for (let j = 1; j <= steps; j++) {
      const t = j / steps, t2 = t * t, t3 = t2 * t
      out.push([
        0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3),
        0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3),
      ])
    }
  }
  return out
}
