import AudioEngine from '../../services/AudioEngine'

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-bg-primary/30 border-t-bg-primary"
      aria-hidden="true"
    />
  )
}

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
    primary:
      'bg-green-cta text-bg-primary hover:bg-green-cta/90 focus-visible:ring-green-cta/50',
    secondary:
      'bg-purple-primary text-text-primary hover:bg-purple-primary/90 focus-visible:ring-purple-primary/50',
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
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-roboto text-[15px] font-bold transition-transform duration-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
        variants[variant]
      } ${pulse && !isDisabled ? 'animate-neon-pulse' : ''} ${fullWidth ? 'w-full' : ''}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  )
}
