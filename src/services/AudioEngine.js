/**
 * AudioEngine — global, layered audio singleton built on Howler.js.
 *
 * Three layers (per the "Juice" blueprint):
 *   - BGM:        looping ambient drone at low volume (~20%)
 *   - SFX:        crisp UI clicks / hovers / ticks
 *   - GameSound:  heavy slot feedback (spin wind-up, reel thuds, payouts)
 *
 * Assets are 100% procedural by default, so the app makes sound with ZERO
 * downloads. If you later drop real files into /public/assets/audio/ matching
 * the keys in ASSET_MANIFEST, they transparently override the synth versions.
 */
import { Howl, Howler } from 'howler'

/* -------------------------------------------------------------------------- */
/* WAV synthesis helpers                                                       */
/* -------------------------------------------------------------------------- */

const SAMPLE_RATE = 22050

function encodeWav(samples) {
  const totalSamples = samples.length
  const buffer = new ArrayBuffer(44 + totalSamples * 2)
  const view = new DataView(buffer)

  const writeString = (offset, value) => {
    for (let i = 0; i < value.length; i += 1) {
      view.setUint8(offset + i, value.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + totalSamples * 2, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, SAMPLE_RATE, true)
  view.setUint32(28, SAMPLE_RATE * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, totalSamples * 2, true)

  let offset = 44
  for (let i = 0; i < totalSamples; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(offset, clamped * 32767, true)
    offset += 2
  }

  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }
  return `data:audio/wav;base64,${btoa(binary)}`
}

const sine = (freq, t) => Math.sin(2 * Math.PI * freq * t)
const square = (freq, t) => (Math.sin(2 * Math.PI * freq * t) >= 0 ? 1 : -1)
function noise() {
  return Math.random() * 2 - 1
}

function alloc(durationSec) {
  return new Float32Array(Math.floor(SAMPLE_RATE * durationSec))
}

/* ---- individual synth recipes -------------------------------------------- */

// short, crisp digital click for UI taps
function synthClick() {
  const out = alloc(0.06)
  for (let i = 0; i < out.length; i += 1) {
    const t = i / SAMPLE_RATE
    const env = Math.exp(-t * 70)
    out[i] = (square(1400, t) * 0.5 + sine(2600, t) * 0.5) * env * 0.3
  }
  return out
}

// soft high blip for hover / tab switch
function synthHover() {
  const out = alloc(0.08)
  for (let i = 0; i < out.length; i += 1) {
    const t = i / SAMPLE_RATE
    const env = Math.exp(-t * 45)
    const freq = 900 + 700 * t * 12
    out[i] = sine(freq, t) * env * 0.22
  }
  return out
}

// low error/deny buzz
function synthError() {
  const out = alloc(0.22)
  for (let i = 0; i < out.length; i += 1) {
    const t = i / SAMPLE_RATE
    const env = Math.min(1, t * 30) * Math.exp(-t * 8)
    out[i] = (square(140, t) * 0.5 + sine(95, t) * 0.5) * env * 0.3
  }
  return out
}

// rising mechanical wind-up for SPIN press
function synthSpin() {
  const out = alloc(0.7)
  for (let i = 0; i < out.length; i += 1) {
    const t = i / SAMPLE_RATE
    const p = t / 0.7
    const freq = 180 + 520 * p * p
    const env = Math.min(1, t * 8) * (1 - p * 0.2)
    const grit = noise() * 0.15 * (1 - p)
    out[i] = (sine(freq, t) * 0.6 + square(freq * 0.5, t) * 0.2 + grit) * env * 0.28
  }
  return out
}

// heavy bass "CLUNK" when a reel stops
function synthThud() {
  const out = alloc(0.18)
  for (let i = 0; i < out.length; i += 1) {
    const t = i / SAMPLE_RATE
    const env = Math.exp(-t * 26)
    const freq = 120 - 50 * t * 4
    out[i] = (sine(freq, t) * 0.8 + noise() * 0.25 * Math.exp(-t * 60)) * env * 0.4
  }
  return out
}

// cascading digital coins for a small win
function synthCoins() {
  const out = alloc(0.6)
  const blips = 9
  for (let b = 0; b < blips; b += 1) {
    const start = Math.floor((b / blips) * 0.42 * SAMPLE_RATE)
    const freq = 1200 + b * 140 + Math.random() * 120
    const len = Math.floor(0.12 * SAMPLE_RATE)
    for (let i = 0; i < len && start + i < out.length; i += 1) {
      const t = i / SAMPLE_RATE
      const env = Math.exp(-t * 40)
      out[start + i] += (sine(freq, t) * 0.6 + sine(freq * 2, t) * 0.3) * env * 0.22
    }
  }
  return out
}

// aggressive synth-horn fanfare for a big win
function synthFanfare() {
  const out = alloc(1.1)
  const notes = [392, 523.25, 659.25, 783.99] // G major-ish rising stab
  notes.forEach((freq, n) => {
    const start = Math.floor(n * 0.16 * SAMPLE_RATE)
    const len = Math.floor((n === notes.length - 1 ? 0.6 : 0.28) * SAMPLE_RATE)
    for (let i = 0; i < len && start + i < out.length; i += 1) {
      const t = i / SAMPLE_RATE
      const env = Math.min(1, t * 30) * Math.exp(-t * 3.2)
      const saw = 2 * (((freq * t) % 1) - 0.5)
      out[start + i] +=
        (saw * 0.4 + square(freq, t) * 0.3 + sine(freq * 2, t) * 0.2) * env * 0.3
    }
  })
  return out
}

// seamless low ambient drone loop for BGM
function synthDrone() {
  const dur = 4.0
  const out = alloc(dur)
  const base = 55 // A1
  for (let i = 0; i < out.length; i += 1) {
    const t = i / SAMPLE_RATE
    // slow LFO so the loop point is continuous (whole cycles over `dur`)
    const lfo = 0.5 + 0.5 * Math.sin((2 * Math.PI * 1 * t) / dur)
    const v =
      sine(base, t) * 0.5 +
      sine(base * 1.5, t) * 0.18 * lfo +
      sine(base * 2.01, t) * 0.12 +
      noise() * 0.015
    out[i] = v * 0.5
  }
  // gentle crossfade at the seam to guarantee click-free looping
  const fade = Math.floor(0.05 * SAMPLE_RATE)
  for (let i = 0; i < fade; i += 1) {
    const k = i / fade
    out[i] *= k
    out[out.length - 1 - i] *= k
  }
  return out
}

/* -------------------------------------------------------------------------- */
/* Sound registry                                                              */
/* -------------------------------------------------------------------------- */

// Optional real-file overrides. Drop matching files in /public/assets/audio/
// and they'll be used instead of the synth versions.
const ASSET_MANIFEST = {
  bgm_ambient: { file: '/assets/audio/ambient.webm', synth: synthDrone, loop: true, volume: 0.2 },
  click: { file: '/assets/audio/click.webm', synth: synthClick, volume: 0.5 },
  hover: { file: '/assets/audio/hover.webm', synth: synthHover, volume: 0.4 },
  error: { file: '/assets/audio/error.webm', synth: synthError, volume: 0.5 },
  spin: { file: '/assets/audio/spin.webm', synth: synthSpin, volume: 0.6 },
  thud: { file: '/assets/audio/thud.webm', synth: synthThud, volume: 0.65 },
  coins: { file: '/assets/audio/coins.webm', synth: synthCoins, volume: 0.6 },
  fanfare: { file: '/assets/audio/fanfare.webm', synth: synthFanfare, volume: 0.7 },
}

class AudioEngineImpl {
  constructor() {
    this.sounds = new Map()
    this.bgm = null
    this.bgmKey = null
    this.muted = false
    this.unlocked = false
    this.bgmVolume = 0.2
  }

  /** Build a Howl for a key, preferring a real file and falling back to synth. */
  _getSound(key) {
    if (this.sounds.has(key)) return this.sounds.get(key)

    const def = ASSET_MANIFEST[key]
    if (!def) {
      console.warn(`[AudioEngine] Unknown sound key: ${key}`)
      return null
    }

    const synthSrc = encodeWav(def.synth())

    // Try the real file first; if it 404s/decodes-fail, swap to the synth WAV.
    const howl = new Howl({
      src: def.file ? [def.file, synthSrc] : [synthSrc],
      loop: Boolean(def.loop),
      volume: def.volume ?? 0.5,
      onloaderror: () => {
        // Real file unavailable — rebuild from the procedural source only.
        if (!howl._fellBack) {
          howl._fellBack = true
          howl.unload()
          howl._src = [synthSrc]
          howl.load()
        }
      },
    })

    this.sounds.set(key, howl)
    return howl
  }

  /** Call once from a user gesture to satisfy autoplay policies. */
  unlock() {
    if (this.unlocked) return
    this.unlocked = true
    if (Howler.ctx && Howler.ctx.state === 'suspended') {
      Howler.ctx.resume().catch(() => {})
    }
  }

  /** Loop an ambient track at low volume. */
  playBGM(trackName = 'bgm_ambient') {
    if (this.muted) return
    if (this.bgmKey === trackName && this.bgm && this.bgm.playing()) return

    this.stopBGM()
    const howl = this._getSound(trackName)
    if (!howl) return
    this.bgmKey = trackName
    this.bgm = howl
    howl.volume(this.bgmVolume)
    if (!howl.playing()) howl.play()
  }

  stopBGM() {
    if (this.bgm) {
      this.bgm.stop()
      this.bgm = null
      this.bgmKey = null
    }
  }

  /** Crisp interface sounds (clicks, hovers, ticks). */
  playSFX(soundName = 'click') {
    if (this.muted) return
    const howl = this._getSound(soundName)
    howl?.play()
  }

  /** Heavy slot sounds (spin wind-up, reel thuds, payouts). */
  playGameSound(soundName) {
    if (this.muted) return
    const howl = this._getSound(soundName)
    howl?.play()
  }

  setMuted(muted) {
    this.muted = muted
    Howler.mute(muted)
    if (muted) this.stopBGM()
  }

  toggleMute() {
    this.setMuted(!this.muted)
    return this.muted
  }
}

export const AudioEngine = new AudioEngineImpl()
export default AudioEngine
