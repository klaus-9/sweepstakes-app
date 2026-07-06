import { useEffect } from 'react'
import Chip from '../ui/Chip'
import Divider from '../ui/Divider'
import { useAuthStore } from '../../store/authStore'
import { useGameStore } from '../../store/gameStore'

function Row({ icon, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-hair bg-surface-1 px-4 py-3.5 text-left transition-colors hover:bg-surface-2 active:scale-[0.99]"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[17px] ${
          danger ? 'bg-danger/15 text-danger' : 'bg-surface-2 text-txt-sub'
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span
        className={`font-body text-[14px] font-medium ${danger ? 'text-danger' : 'text-txt'}`}
      >
        {label}
      </span>
    </button>
  )
}

export default function LobbyMenuSheet({
  isOpen,
  onClose,
  onWithdraw,
  onCashback,
  onLeaderboard,
  onChangePassword,
}) {
  const logout = useAuthStore((state) => state.logout)
  const player = useAuthStore((state) => state.player)
  const balance = useGameStore((state) => state.balance)

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const idLine = [player?.id?.replace(/^player_/, '#') ?? '—', player?.vendor_id]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-label="Profile and account">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close"
      />

      <div className="menu-sheet-enter material grain absolute bottom-0 left-0 right-0 overflow-hidden rounded-t-[24px] border-t border-hair px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15" aria-hidden="true" />

        <div className="flex items-center gap-3 px-1">
          <span
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent font-display text-[15px] font-semibold text-white"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)' }}
          >
            {(player?.username ?? 'PL').slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[15px] font-semibold text-txt">
              {player?.username ?? 'Player'}
            </p>
            <p className="truncate font-mono text-[11px] text-txt-muted">{idLine}</p>
          </div>
          <div
            className="flex shrink-0 items-center gap-2 rounded-full bg-surface-1 px-3 py-1.5"
            style={{ boxShadow: 'inset 0 1px 0 var(--hairline)' }}
          >
            <Chip size={16} />
            <span className="font-mono text-[13px] font-medium tabular-nums text-gold">
              {balance.toFixed(2)}
            </span>
          </div>
        </div>

        <Divider className="my-4" />

        <div className="flex flex-col gap-2.5">
          <Row icon="⤓" label="Withdrawal" onClick={onWithdraw} />
          <Row icon="⟳" label="Cash back" onClick={onCashback} />
          <Row icon="☆" label="Leaderboard" onClick={onLeaderboard} />
          <Row icon="⚿" label="Change password" onClick={onChangePassword} />
          <Row
            icon="⏻"
            label="Log out"
            danger
            onClick={() => {
              onClose()
              logout()
            }}
          />
        </div>
      </div>
    </div>
  )
}
