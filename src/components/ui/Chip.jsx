// Gold poker-chip coin (pure CSS). Used everywhere money shows — balance,
// wins, collect. The single strongest casino cue, still tasteful.
export default function Chip({ size = 18, className = '' }) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-block',
        position: 'relative',
        flexShrink: 0,
        background:
          'radial-gradient(circle at 34% 30%, #ffe39a, var(--gold) 52%, var(--gold-deep))',
        boxShadow:
          '0 0 0 1.5px #12151d, 0 0 0 2.5px rgba(255,255,255,.08), inset 0 0 0 3px rgba(0,0,0,.12)',
      }}
    >
      <span
        style={{
          position: 'absolute',
          inset: Math.max(2, size * 0.16),
          borderRadius: '50%',
          border: '1.5px dashed rgba(58,44,5,.4)',
        }}
      />
    </span>
  )
}
