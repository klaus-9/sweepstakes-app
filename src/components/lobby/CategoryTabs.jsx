import AudioEngine from '../../services/AudioEngine'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'favorite', label: 'Favorite' },
  { id: 'slots', label: 'Slots' },
  { id: 'fishing', label: 'Fishing' },
  { id: 'other', label: 'Other' },
]

export default function CategoryTabs({ activeCategory, onCategoryChange }) {
  return (
    <nav
      className="scrollbar-none flex shrink-0 gap-2 overflow-x-auto whitespace-nowrap px-4 py-3"
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
            style={isActive ? { boxShadow: 'inset 0 1px 0 rgba(255,255,255,.2)' } : undefined}
            className={`flex min-h-[44px] shrink-0 items-center rounded-full px-4 font-display text-[12px] font-semibold tracking-wide transition-colors duration-200 ${
              isActive
                ? 'bg-accent text-white'
                : 'border border-hair bg-surface-1 text-txt-sub hover:text-txt'
            }`}
            aria-pressed={isActive}
          >
            {category.label}
          </button>
        )
      })}
      <span className="w-1 shrink-0" aria-hidden="true" />
    </nav>
  )
}
