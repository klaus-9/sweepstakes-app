// Art-deco divider — faint gold rule with a center mark. Decorative by
// default (♦); pass a label for section headers.
const LINE = {
  height: '1px',
  flex: 1,
  background: 'linear-gradient(90deg, transparent, rgba(245,196,81,.35), transparent)',
}

export default function Divider({ label, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span style={LINE} />
      {label ? (
        <span className="font-display text-[11px] uppercase tracking-[0.14em] text-txt-sub">
          {label}
        </span>
      ) : (
        <span aria-hidden="true" className="text-[11px] text-gold/70">
          ◆
        </span>
      )}
      <span style={LINE} />
    </div>
  )
}
