import { useParams } from 'react-router-dom'
import SlotGame from '../components/game/SlotGame'

export default function Game() {
  const { gameId } = useParams()

  if (gameId !== 'magic_wheel_7s') {
    return (
      <div className="game-viewport flex items-center justify-center p-6">
        <p className="text-center font-roboto text-text-secondary">
          Game &quot;{gameId}&quot; is not available yet.
        </p>
      </div>
    )
  }

  return (
    <div className="game-viewport">
      <SlotGame />
    </div>
  )
}
