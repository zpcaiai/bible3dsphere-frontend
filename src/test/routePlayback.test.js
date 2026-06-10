import { describe, expect, it } from 'vitest'
import { normalizeRoute, routeSliceToStation, stationRouteIndices } from '../map/routePlayback'

describe('route playback helpers', () => {
  it('maps stations monotonically onto a dense route with uneven point density', () => {
    const stations = [[0, 0], [10, 0], [20, 0]]
    const route = [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
      [10, 0],
      [20, 0],
    ]

    expect(stationRouteIndices(stations, route)).toEqual([0, 6, 7])
  })

  it('cuts progress from the rendered route instead of rebuilding a separate arc', () => {
    const stations = [[0, 0], [10, 0], [20, 0]]
    const route = [[0, 0], [5, 1], [10, 0], [15, -1], [20, 0]]

    expect(routeSliceToStation(stations, route, 1)).toEqual([[0, 0], [5, 1], [10, 0]])
    expect(routeSliceToStation(stations, route, 2)).toEqual(route)
  })

  it('falls back to a generated route when no variant route is available', () => {
    const stations = [[0, 0], [1, 1]]
    const route = normalizeRoute(stations, null)

    expect(route.length).toBeGreaterThan(2)
    expect(route[0]).toEqual([0, 0])
    expect(route[route.length - 1]).toEqual([1, 1])
  })
})
