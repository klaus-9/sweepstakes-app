import GameGrid from '../components/lobby/GameGrid'
import TopBar from '../components/lobby/TopBar'

export default function Lobby() {
  return (
    <div className="route-fade flex min-h-dvh flex-col">
      <TopBar />

      <main className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(16px,env(safe-area-inset-bottom))]">
        <GameGrid />
      </main>
    </div>
  )
}
