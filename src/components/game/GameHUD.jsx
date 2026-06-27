import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AudioEngine from '../../services/AudioEngine'
import { eventBus, EVENTS } from '../../phaser/eventBus'
import { useGameStore } from '../../store/gameStore'

function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M13 5l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// The reels, SPIN, bet and readouts all live inside the Phaser scene now.
// This overlay only owns the Home button and resolves the win after a spin.
export default function GameHUD() {
  const navigate = useNavigate()
  const isSpinning = useGameStore((state) => state.isSpinning)

  useEffect(() => {
    AudioEngine.unlock()
    AudioEngine.playBGM('bgm_ambient')
  }, [])

  // The scene owns balance/lastWin/spinning + the result popup. The HUD just
  // plays the win sound (betAmount here is the stake the scene passed back).
  const handleSpinResult = useCallback(({ win_amount: winAmount, betAmount }) => {
    if (winAmount > 0) {
      const isBigWin = winAmount >= (betAmount || 0) * 10
      AudioEngine.playGameSound(isBigWin ? 'fanfare' : 'coins')
    }
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (useGameStore.getState().isSpinning) {
        useGameStore.getState().setSpinning(false)
      }
    }, 12000)

    eventBus.on(EVENTS.SPIN_RESULT, handleSpinResult)
    return () => {
      window.clearTimeout(timeout)
      eventBus.off(EVENTS.SPIN_RESULT, handleSpinResult)
    }
  }, [handleSpinResult])

  return (
    <div className="pointer-events-none absolute inset-0">
      <button
        type="button"
        onClick={() => navigate('/lobby')}
        disabled={isSpinning}
        className="pointer-events-auto absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65 disabled:opacity-40"
        aria-label="Back to lobby"
      >
        <BackIcon />
      </button>
    </div>
  )
}
