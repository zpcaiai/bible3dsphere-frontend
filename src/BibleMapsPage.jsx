// BibleMapsPage.jsx — 统一圣经地图中心（首页与宣教tab共用入口）
// 每个主题一张卡片，去重合并：双视图主题打开后可在「手绘讲解版(SVG)/真实地理版(Leaflet)」间切换。
// 特别篇：圣经地图集（MapLibre 时间轴）+ 耶路撒冷 3D 沙盘。
import { Suspense, useState } from 'react'
import lazyWithRetry from './lazyWithRetry'
import BackButton from './BackButton'
import BibleMapViewer from './BibleMapViewer'
import { BIBLE_MAPS_BY_ID } from './data/bibleMapsData'
import { t } from './i18n/runtime'
import { AutoText } from './autoTranslate.jsx'

const JerusalemSandbox = lazyWithRetry(() => import('./JerusalemSandbox'))

// 统一主题注册表：svgId = 手绘讲解版（bibleMapsData），leafletId = 真实地理行程版（bibleGeoSource）
// meta 仅 leaflet-only 主题需要（SVG 主题的标题/副标题/年代取自 config）
const TOPICS = [
  // 族长与出埃及
  { id: 'abraham', icon: '🐫', svgId: 'abraham', leafletId: 'abraham' },
  { id: 'exodus', icon: '🔥', svgId: 'exodus', leafletId: 'exodus' },
  { id: 'joshua', icon: '⚔️', svgId: 'joshua', leafletId: 'joshua' },
  // 王国时代
  { id: 'tribes', icon: '🧩', svgId: 'tribes', leafletId: 'territories' },
  {
    id: 'david',
    icon: '👑',
    svgId: 'david',
    leafletId: 'david',
    defaultView: 'geo',
    viewLabels: { art: '👑 王国地图', geo: '🧭 大卫生平轨迹' },
  },
  {
    id: 'solomon',
    icon: '🏛',
    svgId: 'solomon',
    leafletId: 'solomon',
    defaultView: 'geo',
    viewLabels: { art: '👑 王国地图', geo: '🧭 所罗门生平轨迹' },
  },
  { id: 'divided', icon: '⚖️', svgId: 'divided', leafletId: 'kings' },
  // 救主与新约
  { id: 'jesus', icon: '✝️', svgId: 'jesus', leafletId: 'jesus' },
  { id: 'passion-week', icon: '🌿', leafletId: 'passion-week',
    meta: { title: '受难周', subtitle: '耶稣在耶路撒冷最后一周的步行轨迹', era: '公元 30/33 年' } },
  { id: 'paul', icon: '⛵', svgId: 'paul', leafletId: 'paul' },
  { id: 'seven-churches', icon: '🕯', svgId: 'seven-churches', leafletId: 'seven-churches' },
  // 全景总览
  { id: 'timeline', icon: '🌍', svgId: 'timeline' },
  { id: 'characters', icon: '👤', svgId: 'characters' },
  { id: 'jerusalem-history', icon: '🏙️', leafletId: 'jerusalem',
    meta: { title: '耶路撒冷演变', subtitle: '从耶布斯到新约时代 · 圣城的历史断面', era: '约前 2000 – 公元 70' } },
]
const TOPICS_BY_ID = Object.fromEntries(TOPICS.map((tp) => [tp.id, tp]))

const SECTIONS = [
  { label: '族长与出埃及 · 创世记—约书亚记', ids: ['abraham', 'exodus', 'joshua'] },
  { label: '王国时代 · 撒母耳记—列王纪', ids: ['tribes', 'david', 'solomon', 'divided'] },
  { label: '救主与新约 · 福音书—启示录', ids: ['jesus', 'passion-week', 'paul', 'seven-churches'] },
  { label: '全景总览 · 时间轴与人物', ids: ['timeline', 'characters', 'jerusalem-history'] },
]

// 深链 id（含旧版 mapId 与 Leaflet dataset id）→ 主题
function resolveTopic(v) {
  if (!v) return null
  return (
    TOPICS_BY_ID[v] ||
    TOPICS.find((tp) => tp.svgId === v || tp.leafletId === v) ||
    null
  )
}

function topicMeta(tp) {
  const cfg = tp.svgId ? BIBLE_MAPS_BY_ID[tp.svgId] : null
  return {
    title: cfg?.title || tp.meta?.title || tp.id,
    subtitle: cfg?.subtitle || tp.meta?.subtitle || '',
    era: cfg?.era || tp.meta?.era || '',
    badge: cfg?.badge || '',
    dual: !!(tp.svgId && tp.leafletId),
  }
}

export default function BibleMapsPage({ onBack, embedded, onOpenAtlas }) {
  // 深链：经文搜索/读经页「相关地图」入口写 sessionStorage，进来直接打开对应地图
  const [activeId, setActiveId] = useState(() => {
    try {
      const v = sessionStorage.getItem('biblemaps-open')
      if (v) { sessionStorage.removeItem('biblemaps-open'); return v }
    } catch (e) { /* ignore */ }
    return null
  })

  if (activeId === 'jerusalem') {
    return (
      <Suspense fallback={<div className="jeru-loading" style={{ padding: 40 }}>{t("🌍 加载三维沙盘…")}</div>}>
        <JerusalemSandbox onBack={() => setActiveId(null)} />
      </Suspense>
    )
  }
  const activeTopic = resolveTopic(activeId)
  if (activeTopic) {
    return <BibleMapViewer key={activeTopic.id} topic={activeTopic} onBack={() => setActiveId(null)} />
  }

  const card = (tp) => {
    const m = topicMeta(tp)
    return (
      <button key={tp.id} className="biblemap-card" onClick={() => setActiveId(tp.id)}>
        <div className="biblemap-card-icon">{tp.icon || '🗺'}</div>
        <div className="biblemap-card-body">
          <div className="biblemap-card-title">
            <AutoText>{m.title}</AutoText>
            {m.badge && <span className="badge">{m.badge}</span>}
            {m.dual && <span className="biblemap-card-badge-dual">{t("双视图")}</span>}
          </div>
          {m.subtitle && <div className="biblemap-card-sub"><AutoText>{m.subtitle}</AutoText></div>}
          {m.era && <div className="biblemap-card-era"><AutoText>{m.era}</AutoText></div>}
        </div>
        <span className="biblemap-card-arrow">›</span>
      </button>
    )
  }

  return (
    <div className={`biblemap-hub ${embedded ? 'embedded' : ''}`}>
      {!embedded && (
        <div className="biblemap-head">
          <BackButton onClick={onBack} />
          <div className="biblemap-title">
            <h2>{t("🗺 圣经地图")}</h2>
            <p>{t("从亚伯拉罕到启示录 · 点击地标看经文，播放路线动画，拖动时间轴看历史展开")}</p>
          </div>
        </div>
      )}

      {/* 特别篇：时间轴地图集 + 耶路撒冷数字孪生沙盘 */}
      <section className="biblemap-stage-group">
        <h3 className="biblemap-stage-label">{t("特别篇 · 时间轴地图集与 3D 沙盘")}</h3>
        {onOpenAtlas && (
          <button className="biblemap-card jeru-feature" style={{ marginBottom: 10 }} onClick={onOpenAtlas}>
            <div className="biblemap-card-icon">🌍</div>
            <div className="biblemap-card-body">
              <div className="biblemap-card-title">{t("圣经地图集")}<span className="badge">★★★★★★</span></div>
              <div className="biblemap-card-sub">{t("时间轴地图集：人物轨迹 / 支派分布 / 王国疆域（大卫·所罗门）/ 预言应验 / 战役图层")}</div>
            </div>
            <span className="biblemap-card-arrow">›</span>
          </button>
        )}
        <button className="biblemap-card jeru-feature" onClick={() => setActiveId('jerusalem')}>
          <div className="biblemap-card-icon">🏛</div>
          <div className="biblemap-card-body">
            <div className="biblemap-card-title">{t("耶路撒冷圣城变迁与圣殿结构")}<span className="badge">★★★★★★</span></div>
            <div className="biblemap-card-sub">{t("固定视角圣殿山，拖时间轴看大卫城→所罗门→希西家→尼希米→希律→现代的\"平地起高楼\"；受难周 FPV 步行轨迹；🏛 圣殿3D精细结构(可剖视/逐部件经文)")}</div>
            <div className="biblemap-card-era">{t("Mapbox GL v3 / MapLibre v1 · 3D WebGL · 需联网")}</div>
          </div>
          <span className="biblemap-card-arrow">›</span>
        </button>
      </section>

      {SECTIONS.map((sec) => (
        <section key={sec.label} className="biblemap-stage-group">
          <h3 className="biblemap-stage-label"><AutoText>{sec.label}</AutoText></h3>
          <div className="biblemap-card-grid">
            {sec.ids.map((id) => {
              const tp = TOPICS_BY_ID[id]
              return tp ? card(tp) : null
            })}
          </div>
        </section>
      ))}
      <p className="biblemap-foot">
        {t("共")} {TOPICS.length} {t("个主题 + 地图集 + 3D 沙盘 · 「双视图」主题可在手绘讲解版与真实地理版间切换 · SVG 手绘版离线可用 · 年代采用传统圣经年代学，仅供主日学／查经教学示意")}
      </p>
    </div>
  )
}
