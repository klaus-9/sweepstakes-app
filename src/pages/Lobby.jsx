import { useState } from 'react'
import CategoryTabs from '../components/lobby/CategoryTabs'
import GameGrid from '../components/lobby/GameGrid'
import TopBar from '../components/lobby/TopBar'

export default function Lobby() {
  const [activeCategory, setActiveCategory] = useState('all')

  return (
    <div
      className="flex min-h-dvh flex-col bg-[#1a1206]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(12,9,4,0.62), rgba(12,9,4,0.82)), url(/assets/jungle/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
      }}
    >
      <TopBar />
      <CategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <GameGrid activeCategory={activeCategory} />
      </main>
    </div>
  )
}
