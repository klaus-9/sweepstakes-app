import { Howl } from 'howler'

function buildWinWavDataUri() {
  const sampleRate = 22050
  const notes = [523.25, 659.25, 783.99]
  const noteDuration = 0.12
  const totalSamples = Math.floor(sampleRate * noteDuration * notes.length)
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
  view.setUint16(20, 1, true)
  view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true)
  view.setUint16(34, 16, true)
  writeString(36, 'data')
  view.setUint32(40, totalSamples * 2, true)

  let sampleOffset = 44
  notes.forEach((frequency, noteIndex) => {
    const start = Math.floor(noteIndex * noteDuration * sampleRate)
    const end = Math.floor((noteIndex + 1) * noteDuration * sampleRate)

    for (let i = start; i < end; i += 1) {
      const t = (i - start) / sampleRate
      const envelope = Math.min(1, t * 20) * Math.max(0, 1 - (t - 0.06) * 12)
      const sample = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.35
      view.setInt16(sampleOffset, sample * 32767, true)
      sampleOffset += 2
    }
  })

  const bytes = new Uint8Array(buffer)
  let binary = ''

  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i])
  }

  return `data:audio/wav;base64,${btoa(binary)}`
}

let winJingle = null

function getWinJingle() {
  if (!winJingle) {
    winJingle = new Howl({
      src: [buildWinWavDataUri()],
      volume: 0.55,
    })
  }

  return winJingle
}

export function playWinJingle() {
  getWinJingle().play()
}
