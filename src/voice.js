// 统一语音(TTS)语言/嗓音选择：EN 模式用英文嗓音，ZH 用中文。
// 规则：EN 模式优先英文；但若待读文本本身以中文为主(如和合本经文)，仍用中文，
// 避免英文嗓音硬念中文。所有原生 speechSynthesis 调用点共用此模块，保持一致。
import { getRuntimeLang } from './i18n/runtime'

const CJK = /[一-鿿]/

// 返回 'en-US' | 'zh-CN'
export function speechLangFor(text) {
  if (getRuntimeLang() !== 'en') return 'zh-CN'
  if (text && CJK.test(text)) {
    const compact = String(text).replace(/\s/g, '')
    const cjk = (compact.match(/[一-鿿]/g) || []).length
    if (compact.length && cjk / compact.length > 0.2) return 'zh-CN'
  }
  return 'en-US'
}

// 根据文本应读语言挑一个最合适的本地嗓音(可能为 null)
export function pickVoiceFor(text) {
  const lang = speechLangFor(text)
  const voices = (typeof window !== 'undefined' && window.speechSynthesis?.getVoices?.()) || []
  if (lang.startsWith('en')) {
    return voices.find(v => /aria|jenny|guy|natural|samantha|female/i.test(v.name || '') && v.lang?.startsWith('en'))
      || voices.find(v => v.lang === 'en-US')
      || voices.find(v => v.lang?.startsWith('en'))
      || null
  }
  return voices.find(v => /xiaoxiao|tingting|婷婷|yaoyao|zhiyu/i.test(v.name || ''))
    || voices.find(v => v.lang?.startsWith('zh') && /female|女/i.test(v.name || ''))
    || voices.find(v => v.lang === 'zh-CN')
    || voices.find(v => v.lang?.startsWith('zh'))
    || null
}

// 服务端 TTS 参数 [language_code, voice_name]
export function ttsServerParamsFor(text) {
  return speechLangFor(text).startsWith('en')
    ? ['en-US', 'en-US-AriaNeural']
    : ['zh-CN', 'zh-CN-XiaoxiaoNeural']
}
