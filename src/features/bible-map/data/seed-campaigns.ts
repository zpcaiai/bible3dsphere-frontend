import { lineString, featureCollection, feature, point } from '../lib/geojson'
import type { BibleCampaignDTO, GeoJsonPoint } from '../domain/types'

const gideonRoute = lineString([
  [35.33, 32.48], // 俄弗拉 Ophrah（基甸家乡，出发）
  [35.36, 32.55], // 哈律泉 Spring of Harod（三百人集结）
  [35.37, 32.62], // 摩利冈下米甸大营 Midian camp
  [35.55, 32.45], // 夜袭后米甸人溃逃方向
  [35.62, 32.4], // 退向约旦河 retreat to Jordan
])

const gideonPoints = featureCollection<GeoJsonPoint, { id: string; nameZh: string; kind: string }>([
  feature(point([35.36, 32.55]), { id: 'gideon-camp', nameZh: '基甸营（哈律泉）', kind: 'camp' }),
  feature(point([35.37, 32.62]), { id: 'midian-camp', nameZh: '米甸大营（摩利冈）', kind: 'enemy' }),
  feature(point([35.62, 32.4]), { id: 'retreat', nameZh: '米甸退兵点（约旦河）', kind: 'retreat' }),
])

// 约书亚征服迦南（中央—南方—北方战役主轴）
const joshuaRoute = lineString([
  [35.5, 31.86], // 吉甲 Gilgal（营地）
  [35.444, 31.872], // 耶利哥 Jericho
  [35.26, 31.93], // 艾城 Ai
  [35.18, 31.85], // 基遍 Gibeon
  [35.1, 31.88], // 伯和仑 Beth-horon
  [34.95, 31.6], // 玛基大 Makkedah（南方诸城）
  [35.568, 33.017], // 夏琐 Hazor（北方联军）
])
const joshuaPoints = featureCollection<GeoJsonPoint, { id: string; nameZh: string; kind: string }>([
  feature(point([35.5, 31.86]), { id: 'jos-base', nameZh: '吉甲营地', kind: 'camp' }),
  feature(point([35.444, 31.872]), { id: 'jos-jericho', nameZh: '耶利哥（城墙倒塌）', kind: 'enemy' }),
  feature(point([35.1, 31.88]), { id: 'jos-bethhoron', nameZh: '伯和仑（日头停留）', kind: 'enemy' }),
  feature(point([35.568, 33.017]), { id: 'jos-hazor', nameZh: '夏琐（北方联军覆灭）', kind: 'enemy' }),
])

// 大卫战歌利亚（以拉谷之役与追击）
const davidGoliathRoute = lineString([
  [34.96, 31.69], // 以拉谷 Valley of Elah（两军对峙）
  [34.93, 31.7], // 亚西加 Azekah
  [34.85, 31.78], // 以革伦 Ekron（非利士溃逃）
  [34.85, 31.61], // 迦特 Gath
])
const davidGoliathPoints = featureCollection<GeoJsonPoint, { id: string; nameZh: string; kind: string }>([
  feature(point([34.96, 31.69]), { id: 'dg-elah', nameZh: '以拉谷（击杀歌利亚）', kind: 'camp' }),
  feature(point([34.85, 31.78]), { id: 'dg-ekron', nameZh: '以革伦（追击）', kind: 'retreat' }),
  feature(point([34.85, 31.61]), { id: 'dg-gath', nameZh: '迦特（非利士败逃）', kind: 'enemy' }),
])

// 底波拉与巴拉大败西西拉
const deborahRoute = lineString([
  [35.39, 32.69], // 他泊山 Mount Tabor（集结一万人）
  [35.18, 32.6], // 基顺河 Kishon（战车陷泥决战）
  [35.1, 32.7], // 夏罗设 Harosheth（追击西西拉本营）
  [35.5, 33.05], // 撒拿音 Zaanaim（西西拉逃亡被雅亿所杀）
])
const deborahPoints = featureCollection<GeoJsonPoint, { id: string; nameZh: string; kind: string }>([
  feature(point([35.39, 32.69]), { id: 'db-tabor', nameZh: '他泊山（集结）', kind: 'camp' }),
  feature(point([35.18, 32.6]), { id: 'db-kishon', nameZh: '基顺河（战车陷泥）', kind: 'enemy' }),
  feature(point([35.5, 33.05]), { id: 'db-zaanaim', nameZh: '撒拿音帐篷（雅亿钉死西西拉）', kind: 'retreat' }),
])

// 亚伯拉罕夜袭救罗得
const abrahamRescueRoute = lineString([
  [35.099, 31.532], // 幔利/希伯仑 Mamre（318人出发）
  [35.65, 33.25], // 但 Dan（追上四王）
  [36.5, 33.7], // 何把 Hobah（追到大马士革左边）
  [35.23, 31.77], // 沙微谷/王谷 King's Valley（麦基洗德迎接）
])
const abrahamRescuePoints = featureCollection<GeoJsonPoint, { id: string; nameZh: string; kind: string }>([
  feature(point([35.65, 33.25]), { id: 'ab-dan', nameZh: '但（夜间分队袭击）', kind: 'enemy' }),
  feature(point([36.5, 33.7]), { id: 'ab-hobah', nameZh: '何把（追击尽头）', kind: 'retreat' }),
  feature(point([35.23, 31.77]), { id: 'ab-kings-valley', nameZh: '沙微谷（麦基洗德祝福）', kind: 'camp' }),
])

export const seedCampaigns: BibleCampaignDTO[] = [
  {
    id: 'gideon',
    name: 'Gideon 300 Warriors Night Attack',
    nameZh: '基甸三百勇士夜袭',
    commander: 'Gideon',
    commanderZh: '基甸',
    startYear: -1190,
    endYear: -1190,
    book: 'Judges',
    chapter: 7,
    routeGeojson: gideonRoute,
    pointsGeojson: gideonPoints,
    description:
      '神将以色列军减至三百人，夜间各执角与火把瓶子环绕米甸大营，吹角呐喊摔瓶，米甸全军惊乱自相击杀、向约旦河溃逃。彰显「得胜不在乎人多」。',
  },
  {
    id: 'joshua-conquest',
    name: 'Joshua Conquest of Canaan',
    nameZh: '约书亚征服迦南',
    commander: 'Joshua',
    commanderZh: '约书亚',
    startYear: -1406,
    endYear: -1400,
    book: 'Joshua',
    chapter: 6,
    routeGeojson: joshuaRoute,
    pointsGeojson: joshuaPoints,
    description:
      '以吉甲为大本营，先取耶利哥（城墙因绕城呼喊而倒塌）与艾城，再于伯和仑之役为基遍争战、日头停留，南征玛基大诸城，北上夏琐歼灭迦南联军，奠定支派分地的根基。',
  },
  {
    id: 'david-goliath',
    name: 'David and Goliath at the Valley of Elah',
    nameZh: '大卫战歌利亚（以拉谷）',
    commander: 'David',
    commanderZh: '大卫',
    startYear: -1020,
    endYear: -1020,
    book: '1 Samuel',
    chapter: 17,
    routeGeojson: davidGoliathRoute,
    pointsGeojson: davidGoliathPoints,
    description:
      '非利士人与以色列在以拉谷两山对峙，少年大卫奉耶和华的名以机弦甩石击倒巨人歌利亚，以色列人乘势追杀，非利士人一路败逃至以革伦与迦特城门。彰显「争战的胜败全在乎耶和华」。',
  },
  {
    id: 'deborah-barak',
    name: 'Deborah and Barak vs Sisera',
    nameZh: '底波拉与巴拉破西西拉',
    commander: 'Barak',
    commanderZh: '巴拉',
    startYear: -1200,
    endYear: -1200,
    book: 'Judges',
    chapter: 4,
    routeGeojson: deborahRoute,
    pointsGeojson: deborahPoints,
    description:
      '女先知底波拉激励巴拉，率西布伦与拿弗他利一万人下他泊山，耶和华使基顺河水暴涨、西西拉的铁车尽陷泥中溃败；西西拉徒步北逃，终在撒拿音帐篷被雅亿钉死，全地得享四十年安息。',
  },
  {
    id: 'abraham-rescue-lot',
    name: 'Abraham Rescues Lot',
    nameZh: '亚伯拉罕夜袭救罗得',
    commander: 'Abraham',
    commanderZh: '亚伯拉罕',
    startYear: -2085,
    endYear: -2085,
    book: 'Genesis',
    chapter: 14,
    routeGeojson: abrahamRescueRoute,
    pointsGeojson: abrahamRescuePoints,
    description:
      '基大老玛等四王掳走侄儿罗得，亚伯拉罕率三百一十八名家丁连夜追赶，从但分队夜袭直到大马士革北面的何把，夺回一切人口财物；归来时在沙微谷受至高神祭司麦基洗德祝福，并取十分之一献上。',
  },
]
