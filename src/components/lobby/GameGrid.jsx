import GameTile from './GameTile'

export const GAMES = [
  {
    id: 'magic_wheel_7s',
    title: 'Magic Wheel 7s',
    category: 'slots',
    badge: 'hot',
    favorite: true,
    icon: '🎡',
  },
  {
    id: 'golden_dragon',
    title: 'Golden Dragon',
    category: 'slots',
    badge: null,
    favorite: true,
    icon: '🐉',
  },
  {
    id: 'lucky_sevens',
    title: 'Lucky Sevens',
    category: 'slots',
    badge: 'new',
    favorite: false,
    icon: '7️⃣',
  },
  {
    id: 'ocean_treasure',
    title: 'Ocean Treasure',
    category: 'fishing',
    badge: null,
    favorite: false,
    icon: '🐠',
  },
  {
    id: 'deep_sea_hunter',
    title: 'Deep Sea Hunter',
    category: 'fishing',
    badge: null,
    favorite: true,
    icon: '🎣',
  },
  {
    id: 'fire_joker',
    title: 'Fire Joker',
    category: 'slots',
    badge: 'hot',
    favorite: false,
    icon: '🔥',
  },
  {
    id: 'coral_reef',
    title: 'Coral Reef',
    category: 'fishing',
    badge: 'new',
    favorite: false,
    icon: '🪸',
  },
  {
    id: 'mega_spin',
    title: 'Mega Spin',
    category: 'slots',
    badge: null,
    favorite: false,
    icon: '💎',
  },
  {
    id: 'keno_blitz',
    title: 'Keno Blitz',
    category: 'other',
    badge: 'new',
    favorite: false,
    icon: '🎱',
  },
]

function filterGames(games, category) {
  switch (category) {
    case 'favorite':
      return games.filter((game) => game.favorite)
    case 'slots':
      return games.filter((game) => game.category === 'slots')
    case 'fishing':
      return games.filter((game) => game.category === 'fishing')
    case 'other':
      return games.filter((game) => game.category === 'other')
    default:
      return games
  }
}

export default function GameGrid({ activeCategory }) {
  const visibleGames = filterGames(GAMES, activeCategory)

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {visibleGames.map((game, index) => (
        <GameTile
          key={game.id}
          id={game.id}
          title={game.title}
          badge={game.badge}
          icon={game.icon}
          index={index}
        />
      ))}

      {visibleGames.length === 0 && (
        <p className="col-span-full py-16 text-center font-roboto text-[13px] text-text-secondary">
          No games in this category yet.
        </p>
      )}
    </div>
  )
}
