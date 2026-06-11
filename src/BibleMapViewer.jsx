// BibleMapViewer.jsx — 统一地图查看器：同一主题在「手绘讲解版(SVG)」与「真实地理版(Leaflet)」间切换。
// topic: { id, svgId?, leafletId? } —— 两者皆有时顶部显示视图切换；只有一种时直接渲染。
import { useState } from 'react'
import BibleMap from './BibleMap'
import BibleMapPage from './BibleMapPage'
import { BIBLE_MAPS as SVG_MAPS } from './data/bibleMapsData'
import { t } from './i18n/runtime'

const VIEW_PREF_KEY = 'biblemap-view-pref'

export default function BibleMapViewer({ topic, onBack }) {
  const hasArt = !!topic.svgId
  const hasGeo = !!topic.leafletId
  const viewPrefKey = `${VIEW_PREF_KEY}:${topic.id}`
  const [pref, setPref] = useState(() => {
    try { return sessionStorage.getItem(viewPrefKey) || topic.defaultView || 'art' } catch (e) { return topic.defaultView || 'art' }
  })
  // 视图回退：偏好的视图该主题没有时退到另一种
  const view = pref === 'geo' ? (hasGeo ? 'geo' : 'art') : (hasArt ? 'art' : 'geo')
  const switchView = (v) => {
    setPref(v)
    try { sessionStorage.setItem(viewPrefKey, v) } catch (e) { /* ignore */ }
  }
  const svgConfig = hasArt ? SVG_MAPS.find((m) => m.id === topic.svgId) : null
  const artLabel = topic.viewLabels?.art || '🎨 手绘讲解版'
  const geoLabel = topic.viewLabels?.geo || '🌍 真实地理版'

  return (
    <div className="biblemap-viewer">
      {hasArt && hasGeo && (
        <div className="biblemap-view-toggle" role="tablist">
          <button className={view === 'art' ? 'on' : ''} onClick={() => switchView('art')}>
            {t(artLabel)}
          </button>
          <button className={view === 'geo' ? 'on' : ''} onClick={() => switchView('geo')}>
            {t(geoLabel)}
          </button>
        </div>
      )}
      {view === 'art' && svgConfig ? (
        <BibleMap key={`art-${topic.id}`} config={svgConfig} onBack={onBack} />
      ) : (
        <BibleMapPage key={`geo-${topic.id}`} initialDatasetId={topic.leafletId} single onBack={onBack} />
      )}
    </div>
  )
}
