// templeStructureTabernacle.js — 会幕精细结构（出25–27、30、36–40）
// 用于 Mapbox GL v3 / MapLibre GL v1 的 fill-extrusion（base/height 单位米）。
// 历史上会幕在旷野/示罗/基遍迁移，此处置于圣殿山坐标便于与各圣殿对照；门朝东。
// 1肘≈0.45m，按经文尺寸比例；几何为教学示意复原。
import { TEMPLE_CENTER } from './jerusalemChronology'

const CU = 0.45
const LAT0 = TEMPLE_CENTER[1]
const LNG0 = TEMPLE_CENTER[0]
const M_LAT = 1 / 111320
const M_LNG = 1 / (111320 * Math.cos((LAT0 * Math.PI) / 180))
const pt = (x, z) => [LNG0 + x * M_LNG, LAT0 + z * M_LAT]
function rectC(cx, cz, w, d) {
  const x = cx * CU, z = cz * CU, hw = (w * CU) / 2, hd = (d * CU) / 2
  return [[pt(x - hw, z - hd), pt(x + hw, z - hd), pt(x + hw, z + hd), pt(x - hw, z + hd), pt(x - hw, z - hd)]]
}
function circleC(cx, cz, r, n = 14) {
  const x = cx * CU, z = cz * CU, rm = r * CU
  const ring = []
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * 2 * Math.PI
    ring.push(pt(x + rm * Math.cos(a), z + rm * Math.sin(a)))
  }
  return [ring]
}
const H = (c) => c * CU
function F(id, color, coords, baseC, heightC, cut) {
  return {
    type: 'Feature',
    properties: { id, color, base: H(baseC), height: H(heightC), cut: cut ? 1 : 0 },
    geometry: { type: 'Polygon', coordinates: coords },
  }
}

// ── 布局（单位肘）：外院 100×50（出27:18），帐幕 30×10×10 在西半，门皆朝东(+x) ──
// 至圣所 x∈[-35,-25]，圣所 x∈[-25,-5]；幔子 x=-25，门帘 x=-5；铜祭坛 x≈15，洗濯盆 x≈3；院门 x=50
const features = []

// 外院地面（旷野沙地）
features.push(F('courtfloor', '#9a8a68', rectC(0, 0, 100, 50), 0, 0.2))
// 院子帷子（细麻帷子，高5肘，出27:9-15）
const LINEN = '#e9e4d4'
features.push(F('hangings', LINEN, rectC(0, 25, 100, 0.6), 0, 5))
features.push(F('hangings', LINEN, rectC(0, -25, 100, 0.6), 0, 5, true)) // 南面（剖视隐藏）
features.push(F('hangings', LINEN, rectC(-50, 0, 0.6, 50), 0, 5))
features.push(F('hangings', LINEN, rectC(50, 17.5, 0.6, 15), 0, 5))
features.push(F('hangings', LINEN, rectC(50, -17.5, 0.6, 15), 0, 5))
// 院门帘（宽20肘，蓝紫朱红细麻绣花，出27:16）
features.push(F('gate', '#7a5a9a', rectC(50, 0, 0.8, 20), 0, 5))
// 院柱（铜座银钩，出27:10-17，每5肘一根示意）
for (let x = -50; x <= 50; x += 10) {
  features.push(F('pillars', '#b87333', circleC(x, 25, 0.5, 8), 0, 5.5))
  features.push(F('pillars', '#b87333', circleC(x, -25, 0.5, 8), 0, 5.5, true))
}
for (let z = -15; z <= 15; z += 10) {
  features.push(F('pillars', '#b87333', circleC(-50, z, 0.5, 8), 0, 5.5))
  features.push(F('pillars', '#b87333', circleC(50, z, 0.5, 8), 0, 5.5))
}

// 铜祭坛（燔祭坛 5×5×3肘，皂荚木包铜，出27:1-8）
features.push(F('altar', '#a8642a', rectC(15, 0, 5, 5), 0, 3))
features.push(F('altar', '#8a4f20', rectC(15, 0, 6, 6), 1.4, 1.7)) // 网/围腰
// 洗濯盆（铜镜所铸，出30:17-21；38:8）
features.push(F('laver', '#8a5a2a', circleC(3, 0, 1.6, 12), 0, 0.8))
features.push(F('laver', '#b87333', circleC(3, 0, 1.2, 12), 0.8, 2.5))

// ── 帐幕本体（竖板：皂荚木包金，高10肘，出26:15-30）──
const GOLD = '#d9b84a'
features.push(F('boards', GOLD, rectC(-20, 5, 30, 0.8), 0, 10))
features.push(F('boards', GOLD, rectC(-20, -5, 30, 0.8), 0, 10, true)) // 南板（剖视隐藏）
features.push(F('boards', GOLD, rectC(-35, 0, 0.8, 10.8), 0, 10))      // 西板
// 幔子（圣所↔至圣所，四根包金柱上，出26:31-33）
features.push(F('veil', '#5a4a8a', rectC(-25, 0, 0.5, 9.5), 0, 10))
// 门帘（帐幕门口，五根柱上，出26:36-37）
features.push(F('screen', '#8a5a7a', rectC(-5, 0, 0.5, 10), 0, 10))
// 罩棚四层顶（绣基路伯幔子/山羊毛/染红公羊皮/海狗皮，出26:1-14；剖视可揭开）
features.push(F('covering', '#6e5a44', rectC(-20, 0, 32, 13), 10, 11, true))

// ── 至圣所内：约柜 + 施恩座基路伯（出25:10-22）──
features.push(F('ark', '#e8c050', rectC(-30, 0, 2.5, 1.5), 0, 1.5))
features.push(F('cherubim', '#d8b040', rectC(-30.6, 0, 0.9, 0.9), 1.5, 3.2))
features.push(F('cherubim', '#d8b040', rectC(-29.4, 0, 0.9, 0.9), 1.5, 3.2))

// ── 圣所内：金灯台(南)、陈设饼桌(北)、金香坛(幔子前)（出25–26:35；30:1-10）──
features.push(F('lampstand', '#f0d060', circleC(-15, -3, 0.6, 10), 0, 3))
features.push(F('table', '#c8a060', rectC(-15, 3, 2, 1), 0, 1.5))
features.push(F('incense', '#e8c050', rectC(-23, 0, 1, 1), 0, 2))

export const TEMPLE_GEOJSON_TABERNACLE = { type: 'FeatureCollection', features }

export const TEMPLE_PARTS_TABERNACLE = {
  courtfloor: { name: '外院', ref: '出27:9-18', dims: '长100肘×宽50肘(约45×22.5米)', desc: '会幕的院子，凡以色列人可入院献祭。神的居所在营中央，十二支派四面安营环绕（民2）。' },
  hangings: { name: '院子帷子', ref: '出27:9-15', dims: '细麻帷子高5肘，铜座银钩银杆', desc: '洁白细麻围出分别为圣的领域——白色预表义；进神的院唯有一门。' },
  gate: { name: '院门帘', ref: '出27:16', dims: '宽20肘，蓝紫朱红色线与捻的细麻绣花', desc: '全院唯一的入口，朝东。耶稣说"我就是门，凡从我进来的必然得救"（约10:9）。' },
  pillars: { name: '院柱（铜座银钩）', ref: '出27:10-17', dims: '南北各20根、东西各10根，共60根', desc: '帷子挂在带银钩银杆的铜座柱上；铜表审判，银表赎价。' },
  altar: { name: '铜祭坛（燔祭坛）', ref: '出27:1-8', dims: '5肘见方、高3肘，皂荚木包铜，四角有角', desc: '入门第一件器具——不经祭坛无法亲近神；坛上的火常常烧着不可熄灭（利6:13）。' },
  laver: { name: '洗濯盆', ref: '出30:17-21；38:8', dims: '铜制，以会幕门前事奉妇女的铜镜所铸', desc: '祭司进圣所前必洗手洗脚，免得死亡——得救后仍需天天洁净（约13:10）。' },
  boards: { name: '竖板（帐幕墙）', ref: '出26:15-30', dims: '皂荚木包金，每块长10肘宽1.5肘，各有两榫入银座', desc: '48块竖板立在银座上以闩相连——圣徒如活石被建造成灵宫（彼前2:5）。' },
  covering: { name: '四层罩棚', ref: '出26:1-14', dims: '绣基路伯细麻幔子/山羊毛/染红公羊皮/海狗皮', desc: '外观朴素（海狗皮），内里荣美（绣基路伯）——他无佳形美容，里面却满有恩典真理。点「剖视」揭开罩棚察看内部。' },
  veil: { name: '幔子', ref: '出26:31-33', dims: '蓝紫朱红细麻织成、绣基路伯，挂于四根包金柱', desc: '隔开圣所与至圣所，唯大祭司年一次带血进入（利16）。幔子预表主的身体（来10:20）。' },
  screen: { name: '门帘（帐幕门口）', ref: '出26:36-37', dims: '蓝紫朱红细麻绣花，挂于五根包金柱', desc: '由外院进入圣所的门——亲近神步步皆有门，步步皆是基督。' },
  ark: { name: '约柜', ref: '出25:10-22', dims: '长2.5肘×宽1.5肘×高1.5肘，皂荚木内外包精金', desc: '至圣所唯一的家具，内有法版（后加吗哪金罐与亚伦发芽的杖，来9:4）；柜上施恩座为神与人相会之处。' },
  cherubim: { name: '施恩座基路伯', ref: '出25:18-22', dims: '精金锤出，二基路伯高张翅膀遮掩施恩座', desc: '"我要在那里与你相会，从施恩座上二基路伯中间，和你说话"（出25:22）。' },
  lampstand: { name: '金灯台', ref: '出25:31-40', dims: '一他连得精金锤出，一干六枝杏花杯', desc: '圣所唯一光源，灯常点着——预表那真光基督，亦表教会金灯台（启1:20）。置于南侧。' },
  table: { name: '陈设饼桌', ref: '出25:23-30', dims: '长2肘×宽1肘×高1.5肘，皂荚木包金', desc: '常摆十二个陈设饼在耶和华面前——十二支派蒙记念；主说"我就是生命的粮"。置于北侧。' },
  incense: { name: '金香坛', ref: '出30:1-10', dims: '1肘见方、高2肘，皂荚木包金', desc: '立于幔子前，亚伦早晚烧香——圣徒的祈祷如香在神面前（诗141:2；启8:3-4）。' },
}

export const TEMPLE_LABELS_TABERNACLE = [
  { id: 'mostholy', name: '至圣所', coord: pt(-30 * CU, 0) },
  { id: 'holy', name: '圣所', coord: pt(-15 * CU, 0) },
  { id: 'screen', name: '门帘', coord: pt(-5 * CU, 0) },
  { id: 'laver', name: '洗濯盆', coord: pt(3 * CU, 5 * CU) },
  { id: 'altar', name: '铜祭坛', coord: pt(15 * CU, 0) },
  { id: 'gate', name: '院门', coord: pt(50 * CU, 0) },
  { id: 'courtfloor', name: '外院', coord: pt(32 * CU, 15 * CU) },
]
TEMPLE_PARTS_TABERNACLE.mostholy = { name: '至圣所', ref: '出26:33-34；利16', dims: '10肘见方的金色内间', desc: '安放约柜之处，神荣耀同在的居所；云彩遮盖会幕，耶和华的荣光充满帐幕（出40:34）。' }
TEMPLE_PARTS_TABERNACLE.holy = { name: '圣所', ref: '出26:33；来9:2', dims: '长20肘×宽10肘', desc: '祭司每日供职：点灯、烧香、更换陈设饼。灯台、饼桌、香坛各预表基督的丰富。' }

export const TEMPLE_CAMERA_TABERNACLE = { center: pt(2, -2), zoom: 18.6, pitch: 64, bearing: 18 }
