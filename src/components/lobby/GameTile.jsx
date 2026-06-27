import { useNavigate } from 'react-router-dom'
import AudioEngine from '../../services/AudioEngine'

const GLOW_COLORS = [
  'shadow-[0_0_24px_rgba(245,197,66,0.22)]',
  'shadow-[0_0_24px_rgba(120,200,80,0.2)]',
  'shadow-[0_0_24px_rgba(245,166,35,0.22)]',
  'shadow-[0_0_24px_rgba(90,180,90,0.2)]',
  'shadow-[0_0_24px_rgba(231,140,60,0.2)]',
  'shadow-[0_0_24px_rgba(212,169,58,0.22)]',
]

export default function GameTile({
  id,
  title,
  badge = null,
  icon = '🎰',
  index = 0,
}) {
  const navigate = useNavigate()
  const glow = GLOW_COLORS[index % GLOW_COLORS.length]

  return (
    <button
      type="button"
      onClick={() => {
        AudioEngine.unlock()
        AudioEngine.playSFX('click')
        navigate(`/game/${id}`)
      }}
      onMouseEnter={() => AudioEngine.playSFX('hover')}
      className={`group relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#caa13e]/30 bg-gradient-to-b from-[#2e2410] to-[#1c1409] text-left shadow-lg transition-transform duration-200 active:scale-[0.97] ${glow}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(245,197,66,0.16),transparent_65%)]" />

      {/* Sweeping light reflection on hover */}
      <span className="tile-shimmer" aria-hidden="true" />

      <div className="relative flex h-full flex-col items-center justify-center px-3 pb-10 pt-4">
        <span
          className="text-[42px] leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] transition-transform duration-200 group-active:scale-95"
          aria-hidden="true"
        >
          {icon}
        </span>
      </div>

      {badge === 'hot' && (
        <span className="badge-pulse absolute right-2 top-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-2 py-0.5 font-roboto text-[9px] font-bold uppercase tracking-wider text-white shadow-[0_0_12px_rgba(239,68,68,0.55)]">
          HOT
        </span>
      )}

      {badge === 'new' && (
        <span className="badge-pulse absolute right-2 top-2 rounded-full bg-gradient-to-r from-green-cta to-emerald-400 px-2 py-0.5 font-roboto text-[9px] font-bold uppercase tracking-wider text-[#0D0D1A] shadow-[0_0_12px_rgba(39,174,96,0.45)]">
          NEW
        </span>
      )}

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-black/40 px-2 py-2 text-center backdrop-blur-sm">
        <p className="truncate font-roboto text-xs font-semibold tracking-wide text-white">
          {title}
        </p>
      </div>
    </button>
  )
}
