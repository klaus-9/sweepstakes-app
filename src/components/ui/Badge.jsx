// Small pill for game tiles. HOT (danger), NEW (accent), SOON (muted).
const STYLES = {
  hot: { className: 'bg-danger-strong text-white', label: 'HOT' },
  new: { className: 'bg-accent text-white', label: 'NEW' },
  soon: { className: 'bg-surface-2 text-txt-sub', label: 'SOON' },
}

export default function Badge({ kind }) {
  const s = STYLES[kind]
  if (!s) return null
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 font-display text-[10px] font-semibold tracking-wide ${s.className}`}
    >
      {s.label}
    </span>
  )
}
