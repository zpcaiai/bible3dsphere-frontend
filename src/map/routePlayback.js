// routePlayback.js — pure helpers for BibleMapPage route playback.
// Keeps station progress aligned to the rendered route, even when the route is
// a dense road/sea polyline instead of one point per station.
import { curvedPath } from './arc'

export function isValidCoord(c) {
  return Array.isArray(c) && c.length >= 2 && Number.isFinite(+c[0]) && Number.isFinite(+c[1])
}

function sameCoord(a, b, eps = 1e-7) {
  return isValidCoord(a) && isValidCoord(b) && Math.abs(a[0] - b[0]) <= eps && Math.abs(a[1] - b[1]) <= eps
}

function dist2(a, b) {
  const dx = +a[0] - +b[0]
  const dy = +a[1] - +b[1]
  return dx * dx + dy * dy
}

export function normalizeRoute(stationCoords, routeCoords) {
  const stations = (stationCoords || []).filter(isValidCoord)
  const rawRoute = (routeCoords || []).filter(isValidCoord)
  const route = rawRoute.length >= 2 ? rawRoute.slice() : curvedPath(stations)
  if (!route.length) return []
  if (stations[0] && !sameCoord(route[0], stations[0])) route.unshift(stations[0])
  const lastStation = stations[stations.length - 1]
  if (lastStation && !sameCoord(route[route.length - 1], lastStation)) route.push(lastStation)
  return route
}

export function stationRouteIndices(stationCoords, routeCoords) {
  const stations = (stationCoords || []).filter(isValidCoord)
  const route = normalizeRoute(stations, routeCoords)
  if (!stations.length || !route.length) return []
  const indices = []
  let start = 0
  for (const station of stations) {
    let best = start
    let bestD = Number.POSITIVE_INFINITY
    for (let i = start; i < route.length; i++) {
      const d = dist2(station, route[i])
      if (d < bestD) {
        best = i
        bestD = d
      }
    }
    indices.push(best)
    start = best
  }
  return indices
}

export function routeSliceToStation(stationCoords, routeCoords, stationIndex) {
  const stations = (stationCoords || []).filter(isValidCoord)
  const route = normalizeRoute(stations, routeCoords)
  if (stationIndex <= 0 || route.length < 2) return []
  const indices = stationRouteIndices(stations, route)
  const end = Math.max(1, indices[Math.min(stationIndex, indices.length - 1)] ?? 0)
  return route.slice(0, end + 1)
}
