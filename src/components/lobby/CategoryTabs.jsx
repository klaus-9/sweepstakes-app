import AudioEngine from '../../services/AudioEngine'

const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'favorite', label: 'FAVORITE' },
  { id: 'slots', label: 'SLOTS' },
  { id: 'fishing', label: 'FISHING' },
  { id: 'other', label: 'OTHER' },
]

export default function CategoryTabs({ activeCategory, onCategoryChange }) {
  return (
    <nav
      className="scrollbar-none flex gap-2 overflow-x-auto whitespace-nowrap border-b border-[#1E1E2E]/80 bg-[#0D0D1A]/60 px-4 py-3 backdrop-blur-sm"
      aria-label="Game categories"
    >
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category.id

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => {
              AudioEngine.unlock()
              AudioEngine.playSFX('hover')
              onCategoryChange(category.id)
            }}
            className={`shrink-0 rounded-full px-4 py-2 font-roboto text-[11px] font-bold uppercase tracking-wider transition-all duration-200 ${
              isActive
                ? 'bg-purple-primary text-white shadow-[0_0_18px_rgba(108,63,197,0.55)]'
                : 'border border-white/5 bg-[#1E1E2E]/70 text-text-secondary hover:bg-[#1E1E2E] hover:text-text-primary'
            }`}
            aria-pressed={isActive}
          >
            {category.label}
          </button>
        )
      })}
    </nav>
  )
}
