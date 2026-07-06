import { useNavigate } from 'react-router-dom'
import AudioEngine from '../../services/AudioEngine'
import Badge from '../ui/Badge'

export default function GameTile({ id, title, badge = null, image = null, playable = false }) {
  const navigate = useNavigate()
  const initial = title?.[0]?.toUpperCase() ?? '?'

  function openGame() {
    if (!playable) return
    AudioEngine.unlock()
    AudioEngine.playSFX('click')
    navigate(`/game/${id}`)
  }

  return (
    <button
      type="button"
      onClick={openGame}
      onMouseEnter={() => playable && AudioEngine.playSFX('hover')}
      disabled={!playable}
      aria-disabled={!playable}
      aria-label={playable ? title : `${title} — coming soon`}
      className={`group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-hair text-left transition-transform duration-200 ${
        playable ? 'hover:border-accent/50 active:scale-[0.97]' : 'cursor-not-allowed'
      }`}
    >
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            playable ? '' : 'opacity-85'
          }`}
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-surface-1 font-display text-[40px] font-semibold text-txt-muted opacity-50"
        >
          {initial}
        </span>
      )}

      {/* Bottom scrim so the title stays legible over art */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-deep/90 via-bg-deep/10 to-transparent"
      />

      {playable && <span className="tile-shimmer" aria-hidden="true" />}

      <span className="absolute right-2 top-2 z-[2]">
        {playable ? badge && <Badge kind={badge} /> : <Badge kind="soon" />}
      </span>

      <div className="absolute inset-x-0 bottom-0 z-[2] px-3 py-2.5">
        <p
          className={`truncate font-body text-[13px] font-semibold ${
            playable ? 'text-txt' : 'text-txt-sub'
          }`}
        >
          {title}
        </p>
      </div>
    </button>
  )
}
