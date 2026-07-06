import { useNavigate } from 'react-router-dom'
import AudioEngine from '../../services/AudioEngine'
import Badge from '../ui/Badge'
import GameTile from './GameTile'

// Curated lobby: one real playable game (featured), a short "coming soon" row.
// No fake app wall — honest that the platform is early, still premium.
const FEATURED = {
  id: 'magic_wheel_7s',
  title: 'Jungle Slot',
  tagline: 'Spin the reels, raid the treasure',
  image: '/assets/logo.png',
}

const COMING_SOON = [
  { id: 'golden_dragon', title: 'Golden Dragon', image: '/assets/thumbs/golden_dragon.webp' },
  { id: 'ocean_treasure', title: 'Ocean Treasure', image: '/assets/thumbs/ocean_treasure.webp' },
  { id: 'fire_joker', title: 'Fire Joker', image: '/assets/thumbs/fire_joker.webp' },
]

function FeaturedHero() {
  const navigate = useNavigate()

  function play() {
    AudioEngine.unlock()
    AudioEngine.playSFX('click')
    navigate(`/game/${FEATURED.id}`)
  }

  return (
    <button
      type="button"
      onClick={play}
      onMouseEnter={() => AudioEngine.playSFX('hover')}
      aria-label={`Play ${FEATURED.title}`}
      className="material group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border border-hair p-4 text-left transition-transform duration-200 hover:border-accent/40 active:scale-[0.99]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_18%_50%,rgba(108,92,231,0.22),transparent_60%)]"
      />
      <img
        src={FEATURED.image}
        alt=""
        aria-hidden="true"
        className="relative z-[1] h-24 w-24 shrink-0 object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
      />
      <div className="relative z-[1] min-w-0 flex-1">
        <span className="mb-1.5 inline-block">
          <Badge kind="hot" />
        </span>
        <h2 className="truncate font-display text-[21px] font-bold leading-tight text-txt">
          {FEATURED.title}
        </h2>
        <p className="mt-0.5 truncate font-body text-[12px] text-txt-sub">{FEATURED.tagline}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-display text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <path d="M2.5 1.5v9l7-4.5-7-4.5z" />
          </svg>
          Play now
        </span>
      </div>
    </button>
  )
}

export default function GameGrid() {
  return (
    <div className="flex flex-col gap-6 px-4 pt-4">
      <FeaturedHero />

      <section>
        <div className="mb-3 flex items-center gap-3">
          <h3 className="font-display text-[12px] font-semibold uppercase tracking-[0.16em] text-txt-sub">
            Coming soon
          </h3>
          <span className="h-px flex-1 bg-hair" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 gap-3.5">
          {COMING_SOON.map((game) => (
            <GameTile key={game.id} id={game.id} title={game.title} image={game.image} playable={false} />
          ))}
        </div>
      </section>
    </div>
  )
}
