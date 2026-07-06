// Loading spinner. `ring` = neutral SVG arc (generic async: login, forms).
// `chip` = spinning gold poker-chip for casino contexts (spin/win).
export default function Spinner({ size = 16, variant = 'ring', className = '' }) {
  if (variant === 'chip') {
    return (
      <span
        className={`inline-block animate-spin ${className}`}
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 34% 30%, #ffe39a, var(--gold) 52%, var(--gold-deep))',
          boxShadow: 'inset 0 0 0 3px rgba(0,0,0,.15), 0 0 0 1.5px rgba(0,0,0,.35)',
        }}
      >
        <span
          style={{
            position: 'absolute',
            inset: Math.max(2, size * 0.18),
            borderRadius: '50%',
            border: '1.5px dashed rgba(58,44,5,.45)',
          }}
        />
      </span>
    )
  }
  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
