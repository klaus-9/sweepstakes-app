import AudioEngine from '../../services/AudioEngine'
import Spinner from './Spinner'

export default function Button({
  children,
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  variant = 'primary',
  pulse = false,
}) {
  const isDisabled = disabled || loading

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent/90 focus-visible:ring-accent/50',
    gold: 'bg-gold text-[#3a2c05] hover:bg-gold/90 focus-visible:ring-gold/50',
    ghost:
      'bg-transparent border border-hair text-txt hover:bg-surface-1 focus-visible:ring-hair',
  }

  // Every button auto-clicks and gives tactile compression on press.
  function handleClick(event) {
    AudioEngine.unlock()
    AudioEngine.playSFX('click')
    onClick?.(event)
  }

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      style={variant !== 'ghost' ? { boxShadow: 'inset 0 1px 0 rgba(255,255,255,.2)' } : undefined}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-display text-[15px] font-semibold transition-transform duration-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
        variants[variant]
      } ${pulse && !isDisabled ? 'animate-neon-pulse' : ''} ${fullWidth ? 'w-full' : ''}`}
    >
      {loading && <Spinner size={16} className="text-current" />}
      {children}
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-3.5 -right-1.5 text-[52px] leading-none"
          style={{ color: 'rgba(255,255,255,.08)' }}
        >
          ♠
        </span>
      )}
    </button>
  )
}
