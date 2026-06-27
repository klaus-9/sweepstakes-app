import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import GameHUD from './GameHUD'
import SlotScene from '../../phaser/SlotScene'
import { eventBus, EVENTS } from '../../phaser/eventBus'
import { useGameStore } from '../../store/gameStore'

const GAME_WIDTH = 1920
const GAME_HEIGHT = 1080

export default function SlotGame() {
  const shellRef = useRef(null)
  const containerRef = useRef(null)
  const gameRef = useRef(null)
  const [bigWinAmount, setBigWinAmount] = useState(null)
  const [bootError, setBootError] = useState(null)

  useEffect(() => {
    useGameStore.getState().setSpinning(false)
  }, [])

  useEffect(() => {
    const handleBigWin = ({ amount }) => {
      setBigWinAmount(amount)
    }

    eventBus.on(EVENTS.BIG_WIN, handleBigWin)
    return () => eventBus.off(EVENTS.BIG_WIN, handleBigWin)
  }, [])

  useEffect(() => {
    if (bigWinAmount === null) return undefined

    const timeout = window.setTimeout(() => {
      setBigWinAmount(null)
    }, 2400)

    return () => window.clearTimeout(timeout)
  }, [bigWinAmount])

  useLayoutEffect(() => {
    const parent = containerRef.current
    const shell = shellRef.current
    if (!parent || !shell) {
      console.error('[SlotGame] Missing game shell or container')
      setBootError('Game container not found')
      return undefined
    }

    if (gameRef.current) {
      return undefined
    }

    const syncScale = () => {
      const game = gameRef.current
      if (!game || !shell) return

      const width = shell.clientWidth
      const height = shell.clientHeight
      if (width > 0 && height > 0) {
        game.scale.setParentSize(width, height)
        game.scale.refresh()
      }
    }

    try {
      const config = {
        type: Phaser.WEBGL,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        parent,
        backgroundColor: '#0a0a0e',
        antialias: true,
        roundPixels: true,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
        },
        scene: [SlotScene],
      }

      const game = new Phaser.Game(config)
      gameRef.current = game

      const canvas = game.canvas
      canvas.style.display = 'block'
      canvas.style.maxWidth = '100%'
      canvas.style.maxHeight = '100%'

      const resizeObserver = new ResizeObserver(() => {
        syncScale()
      })
      resizeObserver.observe(shell)

      requestAnimationFrame(() => {
        syncScale()
        requestAnimationFrame(syncScale)
      })

      setBootError(null)

      return () => {
        resizeObserver.disconnect()
        if (gameRef.current) {
          gameRef.current.destroy(true)
          gameRef.current = null
        }
        parent.innerHTML = ''
        useGameStore.getState().setSpinning(false)
      }
    } catch (error) {
      console.error('[SlotGame] Phaser boot failed:', error)
      setBootError(error instanceof Error ? error.message : 'Phaser failed to start')
      return undefined
    }
  }, [])

  return (
    <div className="slot-game-shell">
      <div ref={shellRef} className="slot-scale-frame">
        <div ref={containerRef} className="phaser-slot-host" />
      </div>

      {bootError && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center bg-[#0a0a0e]/90 p-6 text-center">
          <p className="font-roboto text-sm text-red-400">{bootError}</p>
        </div>
      )}

      {bigWinAmount !== null && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <p
            className="big-win-burst font-oswald text-7xl font-black tracking-wide text-gold-shine"
            style={{ filter: 'drop-shadow(0 0 20px #FFD700)' }}
          >
            +{bigWinAmount.toFixed(2)}
          </p>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 z-20">
        <GameHUD />
      </div>
    </div>
  )
}
