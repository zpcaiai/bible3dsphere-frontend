// 守护者语音能力：STT（复用全站 useSpeechInput/Deepgram）+ TTS（浏览器原生中文女声）
// 支持「对话模式」：守护者说完后自动开麦，形成连续语音对话循环。
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSpeechInput } from '../../hooks/useSpeechInput'
import { pickVoiceFor, speechLangFor } from '../../voice'

const DEEPGRAM_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY || 'a87cbb2d1ec9b07a456fb55319a104731924b12f'

// 与 App.jsx 同一偏好序列：温柔的中文女声
const PREFERRED_VOICES = [
  'Tingting', '婷婷', 'Microsoft Xiaoxiao', 'Microsoft Yaoyao',
  'Microsoft Zhiyu', 'Ting-Ting', 'Google 普通话', 'Google 國語',
]

function pickVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || []
  for (const name of PREFERRED_VOICES) {
    const v = voices.find((x) => x.name?.includes(name) || x.voiceURI?.includes(name))
    if (v) return v
  }
  return (
    voices.find((v) => v.lang?.startsWith('zh') && (v.name.includes('Female') || v.name.includes('女'))) ||
    voices.find((v) => v.lang?.startsWith('zh')) ||
    voices[0] || null
  )
}

/** 朗读前清理：去 emoji / 括号符号 / markdown 残留，保留语句本身 */
export function cleanForSpeech(text) {
  return (text || '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
    .replace(/[（）()【】「」*#`]/g, '')
    .replace(/\n+/g, '。')
    .replace(/。+/g, '。')
    .trim()
}

export function useGuardianVoice({ onTranscript } = {}) {
  const [speaking, setSpeaking] = useState(false)
  const onSpeechEndRef = useRef(null)

  const speech = useSpeechInput({
    deepgramApiKey: DEEPGRAM_KEY,
    onTranscript: (t) => onTranscript?.(t),
  })

  // 部分浏览器 voices 异步加载
  useEffect(() => {
    window.speechSynthesis?.getVoices?.()
  }, [])

  const stopSpeaking = useCallback(() => {
    try { window.speechSynthesis?.cancel() } catch { /* noop */ }
    setSpeaking(false)
    onSpeechEndRef.current = null
  }, [])

  const speak = useCallback((text, { onEnd } = {}) => {
    const synth = window.speechSynthesis
    const cleaned = cleanForSpeech(text)
    if (!synth || !cleaned) { onEnd?.(); return }
    synth.cancel()
    const utter = new SpeechSynthesisUtterance(cleaned)
    // EN 模式用英文嗓音(守护者文本在 EN 模式下已是英文)，ZH 用中文女声
    const voice = pickVoiceFor(cleaned) || pickVoice()
    if (voice) utter.voice = voice
    utter.lang = speechLangFor(cleaned) || voice?.lang || 'zh-CN'
    utter.rate = 0.95   // 慢一点，温柔陪伴的节奏
    utter.pitch = 1.05
    onSpeechEndRef.current = onEnd || null
    utter.onend = () => {
      setSpeaking(false)
      const cb = onSpeechEndRef.current
      onSpeechEndRef.current = null
      cb?.()
    }
    utter.onerror = utter.onend
    setSpeaking(true)
    synth.speak(utter)
  }, [])

  useEffect(() => stopSpeaking, [stopSpeaking])  // 卸载时停止朗读

  return {
    // STT
    isRecording: speech.isRecording,
    recordingSeconds: speech.recordingSeconds,
    recordingError: speech.recordingError,
    startRecording: speech.startRecording,
    stopRecording: speech.stopRecording,
    // TTS
    speaking,
    speak,
    stopSpeaking,
  }
}
