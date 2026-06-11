import { describe, expect, it } from 'vitest'
import { curvedSegment, curvedPath } from '../map/arc'

describe('curvedSegment（两点间贝塞尔弧线）', () => {
  it('首尾点精确等于输入端点', () => {
    const seg = curvedSegment([35, 31], [39, 37])
    expect(seg[0]).toEqual([35, 31])
    expect(seg[seg.length - 1]).toEqual([39, 37])
  })

  it('默认 28 步输出 29 个点，步数可配', () => {
    expect(curvedSegment([0, 0], [1, 0]).length).toBe(29)
    expect(curvedSegment([0, 0], [1, 0], 0.18, 40).length).toBe(41)
  })

  it('中点偏离弦（确实是弧线而非直线）', () => {
    const seg = curvedSegment([0, 0], [10, 0], 0.18)
    const mid = seg[Math.floor(seg.length / 2)]
    // 弦在 y=0 上，弧线中点应明显偏离
    expect(Math.abs(mid[1])).toBeGreaterThan(0.5)
  })

  it('曲率为 0 时退化为直线', () => {
    const seg = curvedSegment([0, 0], [10, 0], 0)
    for (const [, y] of seg) expect(Math.abs(y)).toBeLessThan(1e-9)
  })

  it('所有点均为有限数', () => {
    const seg = curvedSegment([35.235, 31.778], [46.103, 30.963])
    expect(seg.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y))).toBe(true)
  })
})

describe('curvedPath（多站点弧线拼接）', () => {
  it('空数组 / 单点原样返回', () => {
    expect(curvedPath([])).toEqual([])
    expect(curvedPath([[35, 31]])).toEqual([[35, 31]])
    expect(curvedPath(null)).toEqual([])
  })

  it('全程首尾等于站点首尾，段衔接点不重复', () => {
    const stops = [[46.1, 30.96], [39.03, 36.87], [35.28, 32.21], [35.22, 31.93]]
    const path = curvedPath(stops)
    expect(path[0]).toEqual(stops[0])
    expect(path[path.length - 1]).toEqual(stops[3])
    // 3 段 × 29 点 − 2 个重复衔接点 = 85
    expect(path.length).toBe(85)
    // 无相邻重复点
    for (let i = 1; i < path.length; i++) {
      expect(path[i][0] !== path[i - 1][0] || path[i][1] !== path[i - 1][1]).toBe(true)
    }
  })

  it('每个站点都精确落在路径上', () => {
    const stops = [[0, 0], [5, 5], [10, 0]]
    const path = curvedPath(stops)
    for (const s of stops) {
      expect(path.some(([x, y]) => x === s[0] && y === s[1])).toBe(true)
    }
  })

  it('剔除含 NaN/无效的坐标后仍正确拼接', () => {
    const path = curvedPath([[35, 31], [NaN, 2], [36, 32], ['bad'], [37, 31]])
    expect(path[0]).toEqual([35, 31])
    expect(path[path.length - 1]).toEqual([37, 31])
    expect(path.every(([x, y]) => Number.isFinite(x) && Number.isFinite(y))).toBe(true)
  })

  it('有效点不足两个时返回有效点本身', () => {
    expect(curvedPath([[NaN, 1], [35, 31]])).toEqual([[35, 31]])
  })
})
