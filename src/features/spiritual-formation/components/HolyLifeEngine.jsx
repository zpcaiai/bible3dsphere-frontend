import { useMemo, useState } from 'react'
import { holyLifePipeline, holyLifeSkills, holyLifeSkillsById } from '../data/holyLifeSkills'

const DEFAULT_SCORE = 50
const TIME_LABELS = {
  morning: '早晨',
  day: '日间',
  decision: '决定',
  evening: '晚上',
}

function todayKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function uid(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

function createEntry(skillId) {
  return {
    skillId,
    score: DEFAULT_SCORE,
    reflection: '',
    completed: false,
    updatedAt: new Date().toISOString(),
  }
}

function createDayLog(userId, date = todayKey()) {
  const now = new Date().toISOString()
  return {
    id: `holy_life_${userId}_${date}`,
    userId,
    date,
    intention: '',
    entries: holyLifeSkills.map((skill) => createEntry(skill.id)),
    presenceLogs: [],
    dailyReport: '',
    tomorrowFormation: '',
    createdAt: now,
    updatedAt: now,
  }
}

function clampScore(value) {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return DEFAULT_SCORE
  return Math.max(0, Math.min(100, parsed))
}

function averageScore(entries) {
  if (!entries.length) return 0
  return Math.round(entries.reduce((sum, entry) => sum + clampScore(entry.score), 0) / entries.length)
}

function summarizeDay(log) {
  const done = log.entries.filter((entry) => entry.completed).length
  const avg = averageScore(log.entries)
  const lowest = [...log.entries].sort((a, b) => a.score - b.score)[0]
  const highest = [...log.entries].sort((a, b) => b.score - a.score)[0]
  const weakest = lowest ? holyLifeSkillsById[lowest.skillId]?.shortTitle : '未记录'
  const strongest = highest ? holyLifeSkillsById[highest.skillId]?.shortTitle : '未记录'
  return {
    done,
    avg,
    strongest,
    weakest,
    completion: Math.round((done / holyLifeSkills.length) * 100),
  }
}

function buildReport(log) {
  const summary = summarizeDay(log)
  const completed = log.entries
    .filter((entry) => entry.completed)
    .map((entry) => holyLifeSkillsById[entry.skillId]?.shortTitle)
    .filter(Boolean)
    .join('、') || '尚未完成具体操练'
  return `今日圣洁生活报告：完成 ${summary.done}/${holyLifeSkills.length} 项，平均分 ${summary.avg}。较强处：${summary.strongest}。需要留意：${summary.weakest}。已操练：${completed}。`
}

function buildTomorrowFormation(log) {
  const weakest = [...log.entries].sort((a, b) => a.score - b.score)[0]
  const skill = weakest ? holyLifeSkillsById[weakest.skillId] : holyLifeSkills[0]
  return `明天优先操练「${skill.shortTitle}」：${skill.practice}`
}

function ensureEntries(log) {
  const existing = new Map((log.entries || []).map((entry) => [entry.skillId, entry]))
  return {
    ...log,
    entries: holyLifeSkills.map((skill) => existing.get(skill.id) || createEntry(skill.id)),
    presenceLogs: Array.isArray(log.presenceLogs) ? log.presenceLogs : [],
    intention: log.intention || '',
    dailyReport: log.dailyReport || '',
    tomorrowFormation: log.tomorrowFormation || '',
  }
}

export default function HolyLifeEngine({ userId, initialTodayLog, history = [], onSave }) {
  const [log, setLog] = useState(() => ensureEntries(initialTodayLog || createDayLog(userId)))
  const [activeTime, setActiveTime] = useState('morning')
  const [saved, setSaved] = useState(false)
  const [presenceDraft, setPresenceDraft] = useState('')
  const summary = useMemo(() => summarizeDay(log), [log])
  const recent = useMemo(() => history.filter((item) => item.id !== log.id).slice(0, 14), [history, log.id])
  const visibleSkills = holyLifeSkills.filter((skill) => activeTime === 'all' || skill.time === activeTime)

  function updateLog(updater) {
    setSaved(false)
    setLog((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      return { ...next, updatedAt: new Date().toISOString() }
    })
  }

  function updateEntry(skillId, patch) {
    updateLog((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) => entry.skillId === skillId ? { ...entry, ...patch, updatedAt: new Date().toISOString() } : entry),
    }))
  }

  function applySuggestion(skillId, text) {
    const entry = log.entries.find((item) => item.skillId === skillId)
    const next = entry?.reflection ? `${entry.reflection}；${text}` : text
    updateEntry(skillId, { reflection: next })
  }

  function addPresencePause() {
    const reflection = presenceDraft.trim() || '暂停 30 秒：Observe / Repent / Return'
    updateLog((prev) => ({
      ...prev,
      presenceLogs: [{ id: uid('presence'), createdAt: new Date().toISOString(), reflection }, ...prev.presenceLogs].slice(0, 12),
    }))
    setPresenceDraft('')
    const presence = log.entries.find((entry) => entry.skillId === 'presence_of_god')
    if (presence && !presence.completed) updateEntry('presence_of_god', { completed: true, score: Math.max(presence.score, 70), reflection })
  }

  function save() {
    const next = {
      ...log,
      dailyReport: log.dailyReport || buildReport(log),
      tomorrowFormation: log.tomorrowFormation || buildTomorrowFormation(log),
      updatedAt: new Date().toISOString(),
    }
    setLog(next)
    onSave(next)
    setSaved(true)
  }

  function generateReport() {
    updateLog((prev) => ({
      ...prev,
      dailyReport: buildReport(prev),
      tomorrowFormation: buildTomorrowFormation(prev),
    }))
  }

  return (
    <section className="sf-section">
      <div className="sf-section-heading holy-life-heading">
        <div>
          <h2>圣洁生活引擎</h2>
          <p>基于 William Law 的 Daily Practice Layer：不是增加任务，而是把普通生活重新带回敬拜。</p>
        </div>
        <button className="sf-primary holy-life-save" type="button" onClick={save}>{saved ? '已保存' : '保存今日'}</button>
      </div>

      <div className="holy-life-summary">
        <article className="sf-card">
          <h3>今日进度</h3>
          <div className="holy-life-score">{summary.done}/{holyLifeSkills.length}</div>
          <div className="sf-progress"><i style={{ width: `${summary.completion}%` }} /></div>
          <p>完成率 {summary.completion}%</p>
        </article>
        <article className="sf-card">
          <h3>平均形成分</h3>
          <div className="holy-life-score">{summary.avg}</div>
          <div className="sf-progress"><i style={{ width: `${summary.avg}%` }} /></div>
          <p>较强：{summary.strongest} · 留意：{summary.weakest}</p>
        </article>
        <article className="sf-card">
          <h3>同在暂停</h3>
          <div className="holy-life-score">{log.presenceLogs.length}</div>
          <p>目标不是频率本身，而是日间真实归回。</p>
        </article>
      </div>

      <div className="sf-card holy-life-intention">
        <label>今日奉献意向
          <textarea value={log.intention} onChange={(event) => updateLog((prev) => ({ ...prev, intention: event.target.value }))} placeholder="今天我愿意在哪个具体领域承认：每一分钟都属于神？" />
        </label>
      </div>

      <div className="sf-card">
        <h3>Daily Pipeline</h3>
        <div className="holy-life-pipeline">
          {holyLifePipeline.map((step, index) => <span key={step}>{index + 1}. {step}</span>)}
        </div>
      </div>

      <div className="sf-card holy-life-presence">
        <div>
          <h3>30 秒神同在练习</h3>
          <p>暂停。观察此刻的心。必要时悔改。重新开始。</p>
        </div>
        <div>
          <textarea value={presenceDraft} onChange={(event) => setPresenceDraft(event.target.value)} placeholder="此刻我归回神的一句话..." />
          <button className="sf-primary" type="button" onClick={addPresencePause}>记录一次暂停</button>
        </div>
      </div>

      <div className="sf-tabs holy-life-filter" aria-label="Holy life skill time filters">
        {[
          ['morning', '早晨'],
          ['day', '日间'],
          ['decision', '决定'],
          ['evening', '晚上'],
          ['all', '全部'],
        ].map(([id, label]) => (
          <button key={id} className={activeTime === id ? 'active' : ''} type="button" onClick={() => setActiveTime(id)}>{label}</button>
        ))}
      </div>

      <div className="holy-life-grid">
        {visibleSkills.map((skill) => {
          const entry = log.entries.find((item) => item.skillId === skill.id) || createEntry(skill.id)
          return (
            <article className={`sf-card holy-life-skill ${entry.completed ? 'is-complete' : ''}`} key={skill.id}>
              <div className="holy-life-card-head">
                <div>
                  <span className="sf-card-short">{TIME_LABELS[skill.time]}</span>
                  <h3>{skill.shortTitle}</h3>
                  <p>{skill.title} · {skill.metric}</p>
                </div>
                <label className="holy-life-toggle">
                  <input type="checkbox" checked={entry.completed} onChange={(event) => updateEntry(skill.id, { completed: event.target.checked })} />
                  完成
                </label>
              </div>
              <p>{skill.purpose}</p>
              <div className="holy-life-practice">{skill.practice}</div>
              <label>{skill.prompt}
                <textarea value={entry.reflection} onChange={(event) => updateEntry(skill.id, { reflection: event.target.value })} placeholder={skill.placeholder} />
              </label>
              <div className="sf-chip-row">
                {skill.suggestions.map((suggestion) => (
                  <button className="sf-chip-btn" key={suggestion} type="button" onClick={() => applySuggestion(skill.id, suggestion)}>{suggestion}</button>
                ))}
              </div>
              <label className="holy-life-range">
                <span>{skill.metric}</span>
                <b>{entry.score}</b>
                <input type="range" min="0" max="100" step="5" value={entry.score} onChange={(event) => updateEntry(skill.id, { score: clampScore(event.target.value) })} />
              </label>
            </article>
          )
        })}
      </div>

      <div className="holy-life-report-grid">
        <article className="sf-card">
          <h3>Daily Holiness Report</h3>
          <textarea value={log.dailyReport} onChange={(event) => updateLog((prev) => ({ ...prev, dailyReport: event.target.value }))} placeholder="点击生成，或手动记录今天的圣洁生活报告。" />
          <button className="sf-primary" type="button" onClick={generateReport}>生成今日报告</button>
        </article>
        <article className="sf-card">
          <h3>Tomorrow Formation</h3>
          <textarea value={log.tomorrowFormation} onChange={(event) => updateLog((prev) => ({ ...prev, tomorrowFormation: event.target.value }))} placeholder="明天最重要的一步顺服是什么？" />
        </article>
      </div>

      <div className="sf-card">
        <h3>最近 14 天</h3>
        {recent.length ? (
          <div className="holy-life-history">
            {recent.map((item) => {
              const itemSummary = summarizeDay(ensureEntries(item))
              return (
                <div key={item.id}>
                  <strong>{item.date}</strong>
                  <span>{itemSummary.done}/{holyLifeSkills.length}</span>
                  <i><b style={{ width: `${itemSummary.avg}%` }} /></i>
                  <em>{itemSummary.avg}</em>
                </div>
              )
            })}
          </div>
        ) : <p className="sf-empty">还没有历史记录。保存今日后，这里会显示趋势。</p>}
      </div>
    </section>
  )
}
