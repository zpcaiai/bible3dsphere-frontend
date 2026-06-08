import { useState } from 'react'
import { submitCheckin } from './api'
import { t } from './i18n/runtime'

const MOOD_OPTIONS = [t("非常好"), t("比较好"), t("一般"), t("比较差"), t("很差")]
const SLEEP_OPTIONS = [t("充足"), t("尚可"), t("较少"), t("很少"), t("失眠")]
const ENERGY_OPTIONS = [t("充沛"), t("尚可"), t("疲惫"), t("很疲惫"), t("精疲力竭")]

const SCENARIO_DATA = [
  {
    category: t("家庭与亲密关系"),
    scenarios: [
      { label: t("婚姻：冲突处理与冷战沟通"), drivers: t("缺乏饶恕、控制欲、骄傲") },
      { label: t("婚姻：经济分歧与生活压力"), drivers: t("缺乏信任、安全感缺失") },
      { label: t("婚姻：性生活与亲密感障碍"), drivers: t("亲密关系断裂、自我中心") },
      { label: t("婚姻：配偶信仰冷淡或不合"), drivers: t("属灵领导力、忍耐耗尽") },
      { label: t("亲子：孩子叛逆与管教张力"), drivers: t("控制欲、代际隔阂") },
      { label: t("亲子：教育焦虑与学业压力"), drivers: t("成功主义、恐惧失败") },
      { label: t("原生家庭：父母冲突与代际观念"), drivers: t("边界感、传统压力") },
    ],
  },
  {
    category: t("职场见证与抉择"),
    scenarios: [
      { label: t("压力：加班剥削与生活界限"), drivers: t("身份认同障碍、讨好权威") },
      { label: t("关系：不公正待遇与同事竞争"), drivers: t("嫉妒、缺乏安全感") },
      { label: t("抉择：职业转型与跳槽考量"), drivers: t("贪婪 vs 呼召、财务恐惧") },
      { label: t("伦理：诚实经营 vs 业绩妥协"), drivers: t("虚假、利益诱惑") },
      { label: t("见证：信仰立场与公开身份"), drivers: t("害怕被排挤、自我保护") },
    ],
  },
  {
    category: t("人际关系与社交"),
    scenarios: [
      { label: t("社交：被忽视、排斥或误解"), drivers: t("孤独感、渴望认可") },
      { label: t("言语：诚实表达 vs 参与八卦"), drivers: t("随众心理、言语过失") },
      { label: t("群体：价值观冲突与界限"), drivers: t("社交压力、信仰妥协") },
      { label: t("归属：属灵群体缺失或孤独"), drivers: t("缺乏委身、生命干旱") },
    ],
  },
  {
    category: t("内在生命与情绪"),
    scenarios: [
      { label: t("焦虑：对未来的不确定性"), drivers: t("缺乏信心、试图掌控") },
      { label: t("愤怒：失控的情绪爆发"), drivers: t("权利受损、控制欲") },
      { label: t("抑郁：内疚自责与低谷期"), drivers: t("律法主义、不配感") },
      { label: t("疲惫：自我证明后的虚空"), drivers: t("偶像崇拜（成就）、透支") },
    ],
  },
  {
    category: t("信仰生活与操练"),
    scenarios: [
      { label: t("读经：枯燥乏味与流于形式"), drivers: t("灵性麻木、纪律缺失") },
      { label: t("祷告：感觉沉默或功利心态"), drivers: t("缺乏渴慕、自我中心") },
      { label: t("教会：服事张力与领袖失望"), drivers: t("苦毒、人际冲突") },
      { label: t("罪疚：重复性失败与羞耻感"), drivers: t("隐藏的罪、缺乏悔改能力") },
    ],
  },
  {
    category: t("社会文化与价值"),
    scenarios: [
      { label: t("媒体：手机成瘾与信息焦虑"), drivers: t("逃避现实、感官刺激") },
      { label: t("价值观：金钱观与消费主义"), drivers: t("贪婪、虚荣心") },
      { label: t("意义：成功观与呼召冲突"), drivers: t("迷茫、世界观扭曲") },
    ],
  },
]

const DRIVER_DATA = [
  {
    category: t("恐惧与不安全感"),
    icon: '🔴',
    tag: 'Fear',
    hint: t("\"如果不这样做，会不会出问题？\""),
    options: [t("害怕失去（机会 / 关系 / 资源）"), t("害怕失败 / 做错决定"), t("害怕被否定 / 被评价"), t("害怕冲突 / 不敢表达"), t("对未来不确定感焦虑")],
  },
  {
    category: t("欲望与结果导向"),
    icon: '🟠',
    tag: 'Desire',
    hint: t("\"现在就要 / 不能错过\""),
    options: [t("想快速得到结果"), t("想获得更多（钱 / 机会 / 认可）"), t("不想错过机会（FOMO）"), t("追求效率 / 最大收益"), t("追求即时满足")],
  },
  {
    category: t("自我与身份"),
    icon: '🟡',
    tag: 'Ego',
    hint: t("\"我不能输 / 我应该更好\""),
    options: [t("想证明自己是对的"), t("不愿认错 / 低头"), t("想赢 / 不想输"), t("维护面子 / 自尊"), t("与他人比较")],
  },
  {
    category: t("关系与讨好"),
    icon: '🟢',
    tag: 'People',
    hint: t("\"他们会怎么看我？\""),
    options: [t("想被喜欢 / 接纳"), t("害怕被拒绝 / 孤立"), t("不想让别人失望"), t("顺从他人期待"), t("过度顾及别人感受")],
  },
  {
    category: t("控制与确定性"),
    icon: '🔵',
    tag: 'Control',
    hint: t("\"我必须掌控局面\""),
    options: [t("想掌控结果"), t("想把一切计划好"), t("不愿意冒风险"), t("无法接受不确定"), t("想控制他人或局面")],
  },
  {
    category: t("逃避与舒适"),
    icon: '🟣',
    tag: 'Avoidance',
    hint: t("\"先不管了 / 太麻烦了\""),
    options: [t("不想面对问题"), t("拖延决定"), t("想选择轻松的路"), t("逃避冲突 / 责任"), t("用娱乐 / 分心来逃避")],
  },
  {
    category: t("习惯与惯性"),
    icon: '⚫',
    tag: 'Habit',
    hint: t("\"我也不知道为什么就这样了\""),
    options: [t("下意识反应"), t("一直都是这样做"), t("被情绪自动带走"), t("重复过去的模式")],
  },
  {
    category: t("理性与分析"),
    icon: '⚪',
    tag: 'Rational',
    hint: t("\"这样最合理\" ⚠️ 理性 ≠ 一定是最属灵"),
    options: [t("利弊分析后决策"), t("数据 / 事实导向"), t("长期收益优先"), t("风险评估后行动")],
  },
  {
    category: t("信心"),
    icon: '✝️',
    tag: 'Faith',
    hint: t("\"即使不确定，我仍然选择信靠\""),
    options: [t("相信神掌权"), t("不被环境左右"), t("愿意等待与忍耐"), t("放下结果焦虑")],
  },
  {
    category: t("爱与顺服"),
    icon: '❤️',
    tag: 'Love & Obedience',
    hint: t("\"这是否是出于爱？\""),
    options: [t("为他人益处着想"), t("选择饶恕"), t("愿意付代价"), t("按真理而不是情绪行动"), t("顺服内心的提醒")],
  },
  {
    category: t("喜乐与自由"),
    icon: '🌟',
    tag: 'Joy & Freedom',
    hint: t("\"即使结果不同，我仍然平安\""),
    options: [t("内心平安稳定"), t("不被结果捆绑"), t("不被他人评价控制"), t("自由做正确的事")],
  },
]

export default function CheckInPage({ user, emotionLabel, emotionQuery, token, onBack }) {
  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  })

  const [mood, setMood] = useState('')
  const [sleep, setSleep] = useState('')
  const [energy, setEnergy] = useState('')
  const [prayerRequest, setPrayerRequest] = useState('')
  const [gratitude, setGratitude] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedScenario, setSelectedScenario] = useState('')
  const [selectedDriverCat, setSelectedDriverCat] = useState('')
  const [selectedDriverOption, setSelectedDriverOption] = useState('')

  const currentCategoryData = SCENARIO_DATA.find(d => d.category === selectedCategory)
  const currentDrivers = currentCategoryData?.scenarios.find(s => s.label === selectedScenario)?.drivers || ''
  const currentDriverCatData = DRIVER_DATA.find(d => d.category === selectedDriverCat)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await submitCheckin({
        emotionLabel,
        emotionQuery,
        scenarioCategory: selectedCategory,
        scenarioDetail: selectedScenario,
        driverType: selectedDriverCat,
        driverOption: selectedDriverOption,
        mood,
        sleep,
        energy,
        prayerRequest,
        gratitude,
      }, token)
    } catch (err) {
      console.warn('[checkin] tag sync failed:', err)
    }
    setSubmitted(true)
  }

  return (
    <div className="checkin-page">
      <header className="checkin-header">
        <button className="checkin-back-btn" onClick={onBack} aria-label={t("返回")}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="checkin-header-center">
          <div className="checkin-greeting">
            {t("你好，")}{user?.nickname || t("弟兄姊妹")} 👋
          </div>
          <div className="checkin-date">{today}</div>
        </div>
        <div style={{ width: 32 }} />
      </header>

      {submitted ? (
        <div className="checkin-submitted">
          <div className="checkin-submitted-icon">🙏</div>
          <div className="checkin-submitted-title">{t("已提交打卡")}</div>
          <div className="checkin-submitted-sub">{t("愿神的平安与你同在")}</div>
          <button
            className="checkin-submit-btn"
            style={{ marginTop: 28 }}
            onClick={() => setSubmitted(false)}
          >
            {t("🔄 再次打卡")}
          </button>
        </div>
      ) : (
        <form className="checkin-form" onSubmit={handleSubmit}>

          {/* 只读：情绪球选中情绪 */}
          <section className="checkin-section glass">
            <div className="checkin-section-title">{t("🔮 当前情绪")}</div>
            <div className="checkin-readonly-row">
              <span className="checkin-readonly-label">{t("情绪标签")}</span>
              <span className="checkin-readonly-value">
                {emotionLabel || <span className="checkin-empty">{t("（未选择）")}</span>}
              </span>
            </div>
            <div className="checkin-readonly-row">
              <span className="checkin-readonly-label">{t("描述状态")}</span>
              <span className="checkin-readonly-value checkin-readonly-query">
                {emotionQuery?.trim() || <span className="checkin-empty">{t("（未填写）")}</span>}
              </span>
            </div>
          </section>

          {/* 场景分类 */}
          <section className="checkin-section glass">
            <div className="checkin-section-title">{t("📍 当前处境")}</div>
            <div className="checkin-select-group">
              <div className="checkin-select-wrap">
                <label className="checkin-select-label">{t("一级分类")}</label>
                <select
                  className="checkin-select"
                  value={selectedCategory}
                  onChange={e => { setSelectedCategory(e.target.value); setSelectedScenario('') }}
                >
                  <option value="">{t("请选择分类…")}</option>
                  {SCENARIO_DATA.map(d => (
                    <option key={d.category} value={d.category}>{d.category}</option>
                  ))}
                </select>
              </div>
              <div className="checkin-select-wrap">
                <label className="checkin-select-label">{t("具体场景")}</label>
                <select
                  className="checkin-select"
                  value={selectedScenario}
                  onChange={e => setSelectedScenario(e.target.value)}
                  disabled={!selectedCategory}
                >
                  <option value="">{selectedCategory ? t("请选择场景…") : t("请先选择分类")}</option>
                  {currentCategoryData?.scenarios.map(s => (
                    <option key={s.label} value={s.label}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {currentDrivers ? (
              <div className="checkin-drivers-row">
                <span className="checkin-drivers-label">{t("核心驱动")}</span>
                <span className="checkin-drivers-value">{currentDrivers}</span>
              </div>
            ) : null}
          </section>

          {/* 驱动机制 */}
          <section className="checkin-section glass">
            <div className="checkin-section-title">{t("⚙️ 行为驱动")}</div>
            <div className="checkin-select-group">
              <div className="checkin-select-wrap">
                <label className="checkin-select-label">{t("驱动类型")}</label>
                <select
                  className="checkin-select"
                  value={selectedDriverCat}
                  onChange={e => { setSelectedDriverCat(e.target.value); setSelectedDriverOption('') }}
                >
                  <option value="">{t("请选择驱动类型…")}</option>
                  {DRIVER_DATA.map(d => (
                    <option key={d.category} value={d.category}>
                      {d.icon} {d.category}（{d.tag}）
                    </option>
                  ))}
                </select>
              </div>
              <div className="checkin-select-wrap">
                <label className="checkin-select-label">{t("具体表现")}</label>
                <select
                  className="checkin-select"
                  value={selectedDriverOption}
                  onChange={e => setSelectedDriverOption(e.target.value)}
                  disabled={!selectedDriverCat}
                >
                  <option value="">{selectedDriverCat ? t("请选择具体表现…") : t("请先选择驱动类型")}</option>
                  {currentDriverCatData?.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
            {currentDriverCatData?.hint ? (
              <div className="checkin-driver-hint">
                <span className="checkin-driver-hint-icon">{currentDriverCatData.icon}</span>
                <span className="checkin-driver-hint-text">{currentDriverCatData.hint}</span>
              </div>
            ) : null}
          </section>

          {/* 今日心情 */}
          <section className="checkin-section glass">
            <div className="checkin-section-title">{t("😌 今日心情")}</div>
            <div className="checkin-chip-row">
              {MOOD_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`checkin-chip ${mood === opt ? 'active' : ''}`}
                  onClick={() => setMood(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          {/* 睡眠状况 */}
          <section className="checkin-section glass">
            <div className="checkin-section-title">{t("🌙 昨夜睡眠")}</div>
            <div className="checkin-chip-row">
              {SLEEP_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`checkin-chip ${sleep === opt ? 'active' : ''}`}
                  onClick={() => setSleep(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          {/* 精力状态 */}
          <section className="checkin-section glass">
            <div className="checkin-section-title">{t("⚡ 精力状态")}</div>
            <div className="checkin-chip-row">
              {ENERGY_OPTIONS.map(opt => (
                <button
                  key={opt}
                  type="button"
                  className={`checkin-chip ${energy === opt ? 'active' : ''}`}
                  onClick={() => setEnergy(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </section>

          {/* 代祷事项 */}
          <section className="checkin-section glass">
            <div className="checkin-section-title">{t("🙏 代祷事项")}</div>
            <textarea
              className="checkin-textarea"
              placeholder={t("今天有什么想交托给神的...")}
              value={prayerRequest}
              onChange={e => setPrayerRequest(e.target.value)}
              rows={3}
            />
          </section>

          {/* 今日感恩 */}
          <section className="checkin-section glass">
            <div className="checkin-section-title">{t("✨ 今日感恩")}</div>
            <textarea
              className="checkin-textarea"
              placeholder={t("今天感恩的一件事...")}
              value={gratitude}
              onChange={e => setGratitude(e.target.value)}
              rows={2}
            />
          </section>

          <button
            className="checkin-submit-btn"
            type="submit"
          >
            {t("✅ 提交打卡")}
          </button>
        </form>
      )}
    </div>
  )
}
