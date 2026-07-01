import { churchSeasons } from '../data/sacramentCalendarSeed'

const byKey = Object.fromEntries(churchSeasons.map((item) => [item.key, item]))
const dayMs = 24 * 60 * 60 * 1000

function easterDate(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

function addDays(date, days) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function getCurrentChurchSeason(date = new Date()) {
  const d = startOfDay(date)
  const y = d.getFullYear()
  const easter = easterDate(y)
  const ashWednesday = addDays(easter, -46)
  const palmSunday = addDays(easter, -7)
  const pentecost = addDays(easter, 49)
  const christmas = new Date(y, 11, 25)
  const epiphany = new Date(y, 0, 6)
  const adventStart = (() => {
    const christmasDay = new Date(y, 11, 25)
    const day = christmasDay.getDay()
    return addDays(christmasDay, -(day + 22))
  })()
  if (d >= adventStart && d < christmas) return byKey.advent
  if (d >= christmas || d < epiphany) return byKey.christmas
  if (d >= palmSunday && d < easter) return byKey.holy_week
  if (d >= ashWednesday && d < palmSunday) return byKey.lent
  if (d >= easter && d < pentecost) return byKey.easter
  if (Math.abs(d - pentecost) < dayMs) return byKey.pentecost
  if (d >= epiphany && d < ashWednesday) return byKey.epiphany
  return byKey.ordinary_time
}

export function buildSeasonCard(date = new Date()) {
  const season = getCurrentChurchSeason(date)
  return {
    ...season,
    date: startOfDay(date).toISOString().slice(0, 10),
  }
}

export function getTraditionNote(topic = 'sacraments') {
  if (/baptism|communion|sacrament|洗礼|圣餐/.test(topic)) {
    return '不同传统在细节上有差异；这里聚焦共同核心，并鼓励在本地教会牧者带领下实践。'
  }
  return '这里先呈现大公核心，并尊重不同传统在实践细节上的差异。'
}

export function buildCommunionReflection(input = {}) {
  return {
    title: '圣餐前省察',
    grace: '我是否在基督里领受恩典，而不是把圣餐当成奖赏？',
    unity: '我是否看见自己与基督身体相连？',
    reconciliation: '是否有需要主动和好的关系，或需要智慧界限的关系？',
    pastoralSupport: input.heavyGuilt ? '若有沉重罪疚或反复内疚，请找牧者或成熟信徒同行。' : '带着感恩、悔改和信靠来领受。',
    traditionNote: getTraditionNote('communion'),
  }
}

export function buildBaptismIdentityReflection(input = {}) {
  return {
    title: '洗礼身份回顾',
    truths: ['我属于基督。', '我属于祂的身体。', '我已经从旧人进入新生命。'],
    todayQuestion: input.question || '今天如何活出受洗身份？',
    traditionNote: getTraditionNote('baptism'),
  }
}

export function buildLordDayPreparation(date = new Date(), context = {}) {
  const season = buildSeasonCard(date)
  return {
    title: '主日预备',
    season: season.displayNameZh,
    gospelTheme: season.gospelTheme,
    steps: [
      '预备身体：尽量安排睡眠与时间。',
      '预备心：带着悔改、信靠与感恩。',
      '预备关系：若合宜，主动寻求和好或祝福。',
      context.withFamily ? '与家人或小组读一处经文。' : '为本地教会、讲道者和肢体祷告。',
    ],
  }
}

export { churchSeasons }
