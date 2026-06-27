import { createPortal } from 'react-dom'
import { useParams, Navigate } from 'react-router-dom'
import SlotGame from '../components/game/SlotGame'

const PLAYABLE_GAME_ID = 'magic_wheel_7s'

export default function Game() {
  const { gameId } = useParams()

  if (gameId !== PLAYABLE_GAME_ID) {
    return <Navigate to="/lobby" replace />
  }

  // Portal to body so the game escapes #root max-width / overflow clipping.
  return createPortal(
    <div className="game-viewport">
      <SlotGame />
    </div>,
    document.body,
  )
}
