// expansionI18n.js — 扩充模块中英词典（content-theology-expansion 批次）
// 用 runtime 导出的 setEnEntry 在加载时把英文预置进 en 词典（不触碰他们在改的 auto-en.js）。
// 于是全站 i18nT('中文') 在 EN 模式即刻命中这些英文；漏掉的仍由 auto-translate 后台机翻兜底。
import { setEnEntry } from '../i18n/runtime'

export const EN = {
  // 顶层 / chrome
  '内容与神学扩充': 'Content & Theology Expansion',
  '属灵星球 · 新增养料（自包含增量）': 'Spiritual Planet · new formation material',
  '扩充灵修 · 内容与神学扩充': 'Expansion · Content & Theology',
  '‹ 返回': '‹ Back',
  '开始': 'Begin',
  '生成中…': 'Generating…',
  '完整结果': 'Full result',
  '请先登录后再使用此功能（推荐书目/圣诗无需登录）。': 'Please sign in to use this feature (book/hymn lists need no sign-in).',
  '补足神学光谱空白的新养料：认识神、与基督联合、以神为乐、知足、情感真伪、基督的慈心、文化礼仪、情感健康，以及一份分大陆的推荐书目与圣诗。':
    'New material filling gaps in the theological spectrum: knowing God, union with Christ, delight in God, contentment, discerning affections, the heart of Christ, cultural liturgies, emotional health — plus recommended books and hymns by continent.',
  // 功能名 / feature names
  '哀歌 · 向神倾诉': 'Lament · pour out to God',
  '认识神': 'Knowing God',
  '与基督联合': 'Union with Christ',
  '以神为乐': 'Delight in God',
  '基督徒知足': 'Christian Contentment',
  '温柔谦卑': 'Gentle & Lowly',
  '文化礼仪→反礼仪': 'Cultural Liturgies → Counter-liturgy',
  '情感真伪辨': 'Discerning Affections',
  '情感健康属灵': 'Emotionally Healthy',
  '推荐书目 · 圣诗': 'Books & Hymns',
  // 功能副标题 / subs
  'Vroegop 四步哀歌': 'Vroegop · 4 movements of lament',
  '属性默想 · 巴刻/陶恕/里夫斯': 'Attribute meditation · Packer/Tozer/Reeves',
  '在基督里我是谁 · 身份': 'Who I am in Christ · identity',
  '基督徒享乐主义 · 派博': 'Christian Hedonism · Piper',
  '知足的秘诀 · 伯罗斯': 'The rare jewel · Burroughs',
  '基督的慈心 · Ortlund': 'The heart of Christ · Ortlund',
  '你的爱被习惯塑造 · J.K.A.Smith': 'Your loves are shaped by habits · J.K.A. Smith',
  '宗教情感 · 爱德华兹': 'Religious affections · Edwards',
  '情商与灵命 · Scazzero': 'EQ & spiritual life · Scazzero',
  '按大陆精选 · 可收藏': 'Curated by continent · bookmarkable',
  // 输入区 / inputs
  '把你的痛苦向神说出来，例如「我失去了亲人，觉得神很沉默，也不知道还要等多久」': 'Tell God your pain, e.g. "I lost a loved one; God feels silent, and I don’t know how long to wait."',
  '写下此刻困扰你的身份谎言，例如「我觉得自己一无是处」': 'Name the identity lie troubling you, e.g. "I feel utterly worthless."',
  '哪个操练/责任让你觉得像苦差？例如「读经像例行公事」': 'Which practice/duty feels like a chore? e.g. "Bible reading feels routine."',
  '你此刻的缺乏/不满是什么？例如「总觉得钱不够」': 'What are you lacking / discontent about? e.g. "It never feels like enough money."',
  '把你的羞愧或自责说出来，例如「我又搞砸了，觉得神很失望」': 'Voice your shame or self-blame, e.g. "I failed again; God must be disappointed."',
  '一个反复的日常习惯，例如「总忍不住刷手机比较」': 'A recurring daily habit, e.g. "I keep scrolling and comparing."',
  '说出此刻的需要/惧怕，或直接选一个神的属性默想：': 'Name your need/fear now, or pick an attribute of God to meditate on:',
  '例如「我好孤单，没人懂我」': 'e.g. "I feel so alone; no one understands me."',
  '诚实地为每一项打分（0 = 弱，1 = 强）。这不是评判，只帮助你看见成长的邀请。': 'Rate each honestly (0 = weak, 1 = strong). Not a verdict — just to see where you’re invited to grow.',
  // 资源区 / resources
  '推荐书目 · 圣诗（标题）': 'Books & Hymns',
  '按大陆精选（★ = 填补空白/极高契合）': 'Curated by continent (★ = fills a gap / top fit)',
  '公版': 'Public domain',
  '🎵 圣诗扩充': '🎵 Hymn additions',
  '认识神': 'Knowing God',
  '回到福音': 'Return to the Gospel',
  '心的争战': 'Battle of the Heart',
  '与神同行': 'Walk with God',
  '等候与受苦': 'Waiting & Suffering',
  '分辨与呼召': 'Discernment & Calling',
  '门徒与群体': 'Discipleship & Community',
  '华人本土灵修': 'Chinese Devotional Voices',
  // 补齐模块 / added modules
  '失序之爱 · 重排': 'Disordered Loves → Reorder',
  '爱的次序 · 奥古斯丁': 'The order of loves · Augustine',
  '列出你心里所爱/所看重的（每行一个，或用逗号分隔），例如：工作、家人、被认可、手机': 'List what you love/value (one per line or comma-separated), e.g. work, family, approval, phone',
  '诸灵分辨': 'Discernment of Spirits',
  '安慰/枯竭 · 依纳爵': 'Consolation/desolation · Ignatius',
  '描述你此刻的内在状态，例如「这几天读经祷告都很枯干，提不起劲」': 'Describe your inner state, e.g. "Prayer and reading feel dry and lifeless these days."',
  '心意更新': 'Renovation of the Heart',
  '全人塑造 VIM · 魏乐德': 'Whole-person formation, VIM · Willard',
  '华人本土灵修': 'Chinese Devotional Voices',
  '倪柝声/王明道/唐崇荣': 'Watchman Nee / Wang Mingdao / Stephen Tong',
  '说出你此刻的处境或需要，例如「我为信仰受了很多苦，快撑不住了」': 'Share your situation or need, e.g. "I have suffered much for my faith and can barely hold on."',
  // 结果字段标签 / result labels
  '小结': 'Summary', '回应': 'Response', '真理': 'Truth', '经文': 'Scripture', '操练': 'Practice',
  '祷告': 'Prayer', '默想': 'Meditation', '说明': 'Note', '确据': 'Assurance', '鼓励': 'Encouragement',
  '宽心的话': 'Reassurance', '邀请': 'Invitation', '成长邀请': 'Invitations to grow', '成长一步': 'A next step',
  '成长的一步': 'A next step', '它在训练你渴望': 'It trains you to want', '反礼仪': 'Counter-liturgy',
  '第一步': 'First step', '功课': 'Lesson', '锚点': 'Anchor', '错置的期待': 'Misplaced expectation',
  '为什么这是喜乐之路': 'Why this leads to joy', '为喜乐而争战': 'Fight for joy', '较扎根的': 'Well-rooted',
  '可求神加深': 'Ask God to deepen', '属性': 'Attribute', '谎言': 'The lie', '关键分辨': 'Key discernment',
  '根源': 'Root', '福音欠缺': 'Gospel deficit', '可加深的方向': 'Areas to deepen', '成长的邀请': 'Invitation to grow',
  '认识神 · 属性默想': 'Knowing God · attributes',
  '文化礼仪 → 反礼仪': 'Cultural Liturgies → Counter-liturgy',
  '四步哀歌': 'Four movements of lament', '可照着祷告': 'Pray it in your words', '完整祷文': 'Full prayer', '主题': 'Themes',
}

let _seeded = false
export function seedExpansionEn() {
  if (_seeded) return
  _seeded = true
  try { for (const zh in EN) setEnEntry(zh, EN[zh]) } catch { /* ignore */ }
}

// 立即预置（模块被 import 时执行）。
seedExpansionEn()
