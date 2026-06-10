// templeStructureHerod.js — 希律第二圣殿 同心院落精细结构（约2:20；可13:1-2；米示拿·中门篇）
// 用于 Mapbox GL v3 / MapLibre GL v1 的 fill-extrusion（base/height 单位米）。
// 以圣殿山真实坐标为原点；殿门朝东（面向橄榄山，符合历史方位）。x=东(+)/西(−)米，z=北(+)/南(−)米。
// 几何为教学示意复原，尺寸取传统记载/合理估算，非精确考古测绘。
import { TEMPLE_CENTER } from './jerusalemChronology'

const LAT0 = TEMPLE_CENTER[1]
const LNG0 = TEMPLE_CENTER[0]
const M_LAT = 1 / 111320
const M_LNG = 1 / (111320 * Math.cos((LAT0 * Math.PI) / 180))
const pt = (x, z) => [LNG0 + x * M_LNG, LAT0 + z * M_LAT]
function rect(cx, cz, w, d) {
  const hw = w / 2, hd = d / 2
  return [[pt(cx - hw, cz - hd), pt(cx + hw, cz - hd), pt(cx + hw, cz + hd), pt(cx - hw, cz + hd), pt(cx - hw, cz - hd)]]
}
function circle(cx, cz, r, n = 24) {
  const o = []
  for (let i = 0; i <= n; i++) { const a = (i / n) * 2 * Math.PI; o.push(pt(cx + r * Math.cos(a), cz + r * Math.sin(a))) }
  return [o]
}
function F(id, color, coords, base, height, cut) {
  return { type: 'Feature', properties: { id, color, base, height, cut: cut ? 1 : 0 }, geometry: { type: 'Polygon', coordinates: coords } }
}

const features = []

// ── 外邦人院（大平台铺面，最外层、最低）──
features.push(F('gentiles', '#8d7f63', rect(10, 0, 174, 144), 0, 0.6))

// ── 隔墙 Soreg（禁入界，约1.3m 低栏）──
features.push(F('soreg', '#b0a070', rect(8, 46, 150, 1.4), 0.6, 1.9))
features.push(F('soreg', '#b0a070', rect(8, -46, 150, 1.4), 0.6, 1.9, true))
features.push(F('soreg', '#b0a070', rect(-66, 0, 1.4, 92), 0.6, 1.9))
features.push(F('soreg', '#b0a070', rect(82, 0, 1.4, 92), 0.6, 1.9))

// ── 内院围墙（Chel 台地以上，约12m）──
const W = '#cfc5b0'
features.push(F('court', '#a99a78', rect(8, 0, 140, 80), 0, 1.2)) // 内院基台
features.push(F('court', W, rect(8, 40, 140, 2), 0, 12))
features.push(F('court', W, rect(8, -40, 140, 2), 0, 12, true))
features.push(F('court', W, rect(-62, 0, 2, 80), 0, 12))
features.push(F('court', W, rect(78, 0, 2, 80), 0, 12)) // 东外墙

// ── 妇女院（东侧，约60m见方）──
features.push(F('women', '#bdb086', rect(48, 0, 58, 58), 1.2, 4.6))
// 四角小院（拿细耳/木料/患漏/油院）
;[[70, 22], [26, 22], [70, -22], [26, -22]].forEach(([x, z], i) =>
  features.push(F('chambers', '#bfae90', rect(x, z, 12, 12), 1.2, 11, z < 0)))

// ── 尼迦挪门（铜门）+ 十五级半圆台阶 ──
features.push(F('nicanor', '#9a8b5a', rect(16.5, 0, 5, 20), 1.2, 4)) // 台阶坡
features.push(F('nicanor', '#b87333', rect(14, 8.5, 2, 4), 4, 17))
features.push(F('nicanor', '#b87333', rect(14, -8.5, 2, 4), 4, 17))
features.push(F('nicanor', '#a8632a', rect(14, 0, 2, 13), 13, 19)) // 门楣

// ── 以色列人院（窄条）+ 祭司院 ──
features.push(F('israel', '#cabf94', rect(9, 0, 6, 38), 4, 5))
features.push(F('priests', '#8d7f63', rect(-7, 0, 26, 44), 4, 5))

// 大祭坛（燔祭坛，约16m见方、分层）
features.push(F('altar', '#a8642a', rect(-2, 0, 16, 16), 4, 11))
features.push(F('altar', '#9a5a26', rect(-2, 0, 10, 10), 11, 13))
features.push(F('altar', '#9a5a26', rect(-2, -11, 16, 6), 4, 9, true)) // 南向坡道
// 铜盆/洗濯之处
features.push(F('laver', '#b87333', circle(9, 12, 3), 4, 7))

// ── 圣所建筑群（Naos）门朝东(+x)；至圣所在最西 ──
// 廊子 Ulam：百肘宽×百肘高的华丽金白façade（约50m）
features.push(F('porch', '#f0e6c8', rect(-23, 0, 6, 50), 4, 50))
features.push(F('porch', '#e8c050', rect(-20.2, 0, 1.2, 9), 4, 26)) // 金大门
// 圣所 Holy Place 墙（内空，便于剖视）
features.push(F('holy', '#e9e3d2', rect(-35, 10, 18, 2), 4, 45))
features.push(F('holy', '#e9e3d2', rect(-35, -10, 18, 2), 4, 45, true))
// 幔子（圣所↔至圣所）
features.push(F('veil', '#6c2233', rect(-44, 0, 0.9, 20), 4, 41))
// 至圣所 Devir（第二圣殿内为空，无约柜）
features.push(F('mostholy', '#d9c38a', rect(-50, 0, 11, 20), 4, 7))
features.push(F('holy', '#e9e3d2', rect(-56, 0, 2, 22), 4, 45)) // 西墙
features.push(F('holy', '#e9e3d2', rect(-50, 10, 12, 2), 4, 45))
features.push(F('holy', '#e9e3d2', rect(-50, -10, 12, 2), 4, 45, true))
// 殿顶（剖视可揭开）+ 防鸟金尖
features.push(F('roof', '#caa24a', rect(-41, 0, 34, 24), 45, 47, true))
for (let x = -55; x <= -27; x += 7) features.push(F('roof', '#e8c050', rect(x, 0, 1, 22), 47, 48.6, true))
// 三层旁屋（环绕圣所的库房）
features.push(F('chambers', '#bfae90', rect(-41, 13, 34, 4), 4, 22))
features.push(F('chambers', '#bfae90', rect(-41, -13, 34, 4), 4, 22, true))
features.push(F('chambers', '#bfae90', rect(-58.5, 0, 3, 30), 4, 22))

// ── 皇家柱廊 Royal Stoa（平台南缘的宏伟巴西利卡）──
features.push(F('stoa', '#cfc5b0', rect(8, -58, 152, 10), 0.6, 15)) // 廊顶大厅
for (let x = -64; x <= 80; x += 12) features.push(F('stoa', '#bfae90', circle(x, -54, 1.2, 12), 0.6, 12)) // 列柱

// ── 安东尼亚堡（西北角，罗马要塞示意）──
features.push(F('antonia', '#8a93a8', rect(-56, 40, 18, 18), 0.6, 20))

export const TEMPLE_GEOJSON_HEROD = { type: 'FeatureCollection', features }

export const TEMPLE_PARTS_HEROD = {
  gentiles: { name: '外邦人院', ref: '可11:15-17', dims: '圣殿山大平台最外、最低层，外邦人可入', desc: '希律大平台上最外的庭院，连外邦人也可进入。耶稣在此推倒兑换银钱之人的桌子："我的殿必称为万国祷告的殿"（可11:17）。' },
  soreg: { name: '隔墙 Soreg', ref: '弗2:14', dims: '约1.3m 高的石栏，刻有禁止外邦人越界的警告', desc: '分隔外邦人院与内院的栏界，外邦人越界者处死。基督"拆毁了中间隔断的墙"，使两下合而为一。' },
  court: { name: '内院围墙 / Chel 台地', ref: '结42:20', dims: '内院抬高于外院，环以高墙', desc: '分别圣俗的围墙与台地；唯洁净的以色列人方可登阶而入。' },
  women: { name: '妇女院', ref: '路21:1-4', dims: '约60m见方，四角设小院，置十三个奉献银库', desc: '内院最东的大院，男女皆可至此。耶稣在此看见寡妇投两个小钱入银库。' },
  chambers: { name: '院角库房 / 旁屋', ref: '王上6:5-8', dims: '拿细耳院、木料院、患漏院、油院 / 环殿三层库房', desc: '妇女院四角及圣所周围的库房，收藏圣物、器皿与奉献。' },
  nicanor: { name: '尼迦挪门（铜门）', ref: '徒3:2', dims: '精铜大门，前接十五级半圆台阶（利未人在此唱十五首上行之诗）', desc: '由妇女院上达以色列人院的华美大门；"美门"或即在此一带，彼得约翰在此医好瘸腿的。' },
  israel: { name: '以色列人院', ref: '代下4:9', dims: '祭司院东侧的窄长条院', desc: '以色列男丁观看献祭、敬拜之处，紧邻祭司供职的内院。' },
  priests: { name: '祭司院', ref: '代下4:9', dims: '环绕圣所与祭坛的内院', desc: '唯祭司可入，献祭、洗濯、供职之处。' },
  altar: { name: '燔祭坛（大祭坛）', ref: '出27:1-8；结43', dims: '约16m见方、分层、南有坡道（不可用台阶上坛）', desc: '献燔祭赎罪之坛——进殿事奉先经祭坛：没有流血，罪就不得赦免（来9:22）。' },
  laver: { name: '铜盆（洗濯之处）', ref: '出30:18-21', dims: '祭司供职前在此洗手洗脚', desc: '预表洁净；事奉圣洁的神，必先洁净自己。' },
  porch: { name: '廊子（Ulam · 金白façade）', ref: '约2:20', dims: '约百肘宽×百肘高（约50m），覆金，朝东', desc: '希律圣所华丽的金白正面，晨光照之夺目。门徒惊叹殿石殿宇何等宏伟，主却预言"将来没有一块石头留在石头上"（可13:1-2）。' },
  holy: { name: '圣所（Hekhal）', ref: '来9:2', dims: '内置金灯台、金香坛、陈设饼桌', desc: '祭司每日供职：点灯、烧香、摆饼。撒迦利亚在此烧香时遇见天使（路1:9-11）。' },
  veil: { name: '幔子', ref: '太27:51；来10:19-20', dims: '蓝紫朱红与细麻所织，绣基路伯', desc: '分隔圣所与至圣所。主断气时殿幔从上到下裂为两半——又新又活的路已开，信徒可坦然进入至圣所。' },
  mostholy: { name: '至圣所（Devir）', ref: '来9:7；利16', dims: '约20肘见方的内殿，第二圣殿内为空（约柜已失）', desc: '神荣耀同在之所，唯大祭司每年赎罪日带血进入一次。第二圣殿的至圣所空无约柜，唯存一块"基石"。' },
  roof: { name: '殿顶 · 防鸟金尖', ref: '可13:2', dims: '香柏木顶覆金，上立尖刺防鸟停落', desc: '点「剖视」可揭开殿顶，察看圣所、幔子与至圣所内部。主后70年全殿被罗马焚毁。' },
  stoa: { name: '皇家柱廊（Royal Stoa）', ref: '约10:23', dims: '平台南缘的巴西利卡式廊厅，162根石柱四列', desc: '希律所建的宏伟柱廊，集市与议事之处；传统认为耶稣在所罗门廊下行走、教训人即此圣殿廊柱一带。' },
  antonia: { name: '安东尼亚堡', ref: '徒21:34-40', dims: '圣殿山西北角的罗马要塞，四角设塔', desc: '罗马驻军监控圣殿之处；保罗在此台阶上向众人申辩。传统亦以此为彼拉多审问耶稣的衙门。' },
}

export const TEMPLE_LABELS_HEROD = [
  { id: 'mostholy', name: '至圣所', coord: pt(-50, 0) },
  { id: 'holy', name: '圣所', coord: pt(-35, 0) },
  { id: 'porch', name: '廊子', coord: pt(-23, 0) },
  { id: 'altar', name: '大祭坛', coord: pt(-2, 0) },
  { id: 'priests', name: '祭司院', coord: pt(-7, 16) },
  { id: 'israel', name: '以色列人院', coord: pt(9, -16) },
  { id: 'nicanor', name: '尼迦挪门', coord: pt(15, 0) },
  { id: 'women', name: '妇女院', coord: pt(48, 0) },
  { id: 'soreg', name: '隔墙 Soreg', coord: pt(82, 24) },
  { id: 'stoa', name: '皇家柱廊', coord: pt(8, -58) },
  { id: 'antonia', name: '安东尼亚堡', coord: pt(-56, 40) },
  { id: 'gentiles', name: '外邦人院', coord: pt(70, 30) },
]

export const TEMPLE_CAMERA_HEROD = { center: pt(-2, -6), zoom: 17.5, pitch: 64, bearing: 18 }
