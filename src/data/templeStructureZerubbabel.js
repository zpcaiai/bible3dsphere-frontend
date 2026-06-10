// templeStructureZerubbabel.js — 所罗巴伯第二圣殿精细结构（拉3–6；该1–2；亚4）
// 公元前516年归回余民所建：尺寸效法旧殿基（拉6:3记宽60肘高60肘），却朴素无华——
// 无约柜、无云彩荣光，老年人见根基立定便大声哭号（拉3:12）。
// 用于 Mapbox GL v3 / MapLibre GL v1 的 fill-extrusion（base/height 单位米）。
// 以圣殿山真实坐标为原点，殿门朝东；1肘≈0.45m；几何为教学示意复原。
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

// ── 布局沿用所罗门殿基（拉3:3「在原有的根基上」）：至圣所 x∈[-50,-30]，圣所 x∈[-30,10]，门朝东 ──
// 色调取灰白石与粗木，刻意少金——「这殿从前的荣耀，现在岂不是看如无有吗」（该2:3）
const STONE = '#c4bcab'
const WOOD = '#8a7050'
const features = []

// 院子台基（朴素，杂有焚毁残迹）
features.push(F('court', '#857a62', rectC(5, 0, 170, 100), 0, 0.8))
// 残垣（巴比伦焚毁的旧迹，围在院外，低矮焦黑）
features.push(F('ruins', '#4a4038', rectC(5, 46, 150, 3), 0, 3))
features.push(F('ruins', '#4a4038', rectC(-72, 0, 3, 80), 0, 2.5))
features.push(F('ruins', '#4a4038', rectC(80, 20, 3, 40), 0, 2))
// 殿墙（大石三层、新木一层，拉6:4）
features.push(F('walls', STONE, rectC(-51, 0, 2, 24), 0, 26))
features.push(F('walls', STONE, rectC(-20, 11, 64, 2), 0, 26))
features.push(F('walls', STONE, rectC(-20, -11, 64, 2), 0, 26, true))
features.push(F('walls', STONE, rectC(11, 8.5, 2, 7), 0, 26))
features.push(F('walls', STONE, rectC(11, -8.5, 2, 7), 0, 26))
features.push(F('walls', STONE, rectC(11, 0, 2, 10), 18, 26))
// 木梁层（「三层大石头、一层新木头」）
features.push(F('beams', WOOD, rectC(-20, 11, 64, 2.2), 12, 13.5))
features.push(F('beams', WOOD, rectC(-20, -11, 64, 2.2), 12, 13.5, true))
// 幔子（圣所↔至圣所）
features.push(F('veil', '#5a4a8a', rectC(-30, 0, 0.8, 20), 0, 26))
// 殿顶（可剖视揭开）
features.push(F('roof', '#6e5f4a', rectC(-20, 0, 68, 28), 26, 28, true))
// 门廊（朴素，无雅斤波阿斯铜柱——已被掳往巴比伦，王下25:13）
features.push(F('porch', STONE, rectC(15, 9, 8, 2), 0, 22))
features.push(F('porch', STONE, rectC(15, -9, 8, 2), 0, 22, true))
features.push(F('roof', '#6e5f4a', rectC(15, 0, 10, 24), 22, 24, true))
// 旁屋库房（尼13:4-9 多比雅曾占殿院屋子）
features.push(F('chambers', '#a89a82', rectC(-20, 14, 64, 4), 0, 12))
features.push(F('chambers', '#a89a82', rectC(-20, -14, 64, 4), 0, 12, true))
// 燔祭坛（归回后首先重建，未立殿基先筑坛，拉3:2-3）
features.push(F('altar', '#a8642a', rectC(45, 0, 16, 16), 0, 8))
features.push(F('altar', '#9a5a26', rectC(45, -10, 16, 4), 0, 5, true)) // 坡道
// 洗濯盆（无铜海——已被打碎运走，耶52:17）
features.push(F('laver', '#b87333', circleC(38, -20, 2.5, 12), 0, 3))

// ── 至圣所：空的——无约柜，唯有「基石」（传统：Even Shetiyah 奠基石）──
features.push(F('foundationstone', '#9a917e', rectC(-40, 0, 4, 3), 0, 1))
// ── 圣所内：金灯台×1、陈设饼桌×1、香坛（不复所罗门的十灯十桌）──
features.push(F('lampstand', '#f0d060', circleC(-18, -5, 0.6, 10), 0, 3))
features.push(F('table', '#c8a060', rectC(-18, 5, 2, 1.2), 0, 1.5))
features.push(F('incense', '#e8c050', rectC(-28, 0, 1, 1), 0, 2))

export const TEMPLE_GEOJSON_ZERUBBABEL = { type: 'FeatureCollection', features }

export const TEMPLE_PARTS_ZERUBBABEL = {
  court: { name: '殿院（朴素台基）', ref: '拉3:8-13', dims: '在旧殿原址清理重建', desc: '立根基时众人大声呼喊，老年人却大声哭号——见过旧殿荣耀的，看新殿如无有；哭号与欢呼之声分辨不出。' },
  ruins: { name: '焚毁残垣', ref: '王下25:8-10；尼1:3', dims: '巴比伦焚殿拆墙的旧迹', desc: '公元前586年尼布甲尼撒焚毁圣殿；七十年荒凉应验耶利米的预言（耶25:11；但9:2）。' },
  walls: { name: '殿墙（大石三层）', ref: '拉6:3-4', dims: '高60肘宽60肘（古列王降旨）；用大石头三层', desc: '波斯王古列降旨重建，经费出于王库——神使用外邦君王成就他的应许（赛44:28）。' },
  beams: { name: '新木头一层', ref: '拉6:4', dims: '三层大石头、一层新木头', desc: '古列旨意规定的建法；工程曾因仇敌搅扰停工十余年，靠哈该、撒迦利亚二先知激励复工（拉5:1-2）。' },
  veil: { name: '幔子', ref: '代下3:14（仿旧制）', dims: '分隔圣所与至圣所', desc: '至圣所仍以幔子隔开——但其内已空，无约柜、无荣光云彩，余民凭信心等候那将要来的。' },
  roof: { name: '殿顶', ref: '该1:4,8', dims: '上山取木料所盖', desc: '百姓先顾自己的天花板房屋，神藉哈该责备："这殿仍然荒凉，你们自己还住天花板的房屋吗？"点「剖视」可揭顶察看。' },
  porch: { name: '门廊（无铜柱）', ref: '王下25:13', dims: '朴素门廊；雅斤、波阿斯已被掳往巴比伦', desc: '所罗门殿的两根铜柱被巴比伦人打碎运走——殿门前空空，无声见证被掳的代价。' },
  chambers: { name: '旁屋库房', ref: '尼13:4-9', dims: '收藏器皿与奉献的屋子', desc: '尼希米时大祭司以利亚实曾让仇敌多比雅住进殿院屋子，尼希米将其家具抛出——圣地不容玷污。' },
  altar: { name: '燔祭坛（先于殿而立）', ref: '拉3:2-3', dims: '照神人摩西律法书上所写的，筑在原处', desc: '归回余民未立殿基、先筑祭坛——惧怕四围之民，却知道唯有献祭亲近神才有平安。' },
  laver: { name: '洗濯盆（无铜海）', ref: '耶52:17', dims: '简朴铜盆代替昔日铜海', desc: '所罗门的铜海与盆座被巴比伦人打碎、铜运往巴比伦；新殿器具从简。' },
  foundationstone: { name: '基石（空的至圣所）', ref: '该2:3；亚4:7-10', dims: '至圣所内无约柜，传统记唯余一块基石', desc: '约柜自被掳后失落。撒迦利亚却预言："他必搬出一块石头，安在殿顶上，人且大声欢呼说：愿恩惠恩惠归与这殿！"——谁藐视这日的事为小呢。' },
  lampstand: { name: '金灯台（一座）', ref: '亚4:2-6', dims: '不复所罗门十灯台之盛，唯一座', desc: '撒迦利亚见金灯台异象："不是倚靠势力，不是倚靠才能，乃是倚靠我的灵方能成事。"' },
  table: { name: '陈设饼桌（一张）', ref: '尼10:33', dims: '一张桌，常供陈设饼', desc: '归回者立约："每年献银一舍客勒三分之一，为陈设饼、常献的燔祭…"——清贫中持守敬拜。' },
  incense: { name: '金香坛', ref: '路1:9-11（此殿后期）', dims: '幔子前烧香之坛', desc: '数百年后，祭司撒迦利亚正是在这殿（经希律改建）的香坛旁遇见天使，得施洗约翰降生的预告。' },
}

export const TEMPLE_LABELS_ZERUBBABEL = [
  { id: 'foundationstone', name: '至圣所（空）', coord: pt(-40 * CU, 0) },
  { id: 'lampstand', name: '圣所', coord: pt(-14 * CU, 0) },
  { id: 'porch', name: '门廊', coord: pt(15 * CU, 0) },
  { id: 'altar', name: '燔祭坛', coord: pt(45 * CU, 0) },
  { id: 'laver', name: '洗濯盆', coord: pt(38 * CU, -20 * CU) },
  { id: 'ruins', name: '焚毁残垣', coord: pt(5 * CU, 46 * CU) },
]
TEMPLE_PARTS_ZERUBBABEL.mostholy = TEMPLE_PARTS_ZERUBBABEL.foundationstone
TEMPLE_PARTS_ZERUBBABEL.holy = { name: '圣所', ref: '该2:9', dims: '长40肘×宽20肘（仿旧制）', desc: '"这殿后来的荣耀必大过先前的荣耀"——五百年后，荣耀的主亲自走进这殿（玛3:1；路2:27）。' }

export const TEMPLE_CAMERA_ZERUBBABEL = { center: pt(-4, -3), zoom: 18.3, pitch: 65, bearing: 18 }
