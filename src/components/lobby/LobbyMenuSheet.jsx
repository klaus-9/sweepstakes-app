import { useEffect } from 'react'
import Modal from '../ui/Modal'
import { useAuthStore } from '../../store/authStore'

function MenuRow({ icon, label, onClick, accent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border border-white/5 bg-[#1E1E2E]/80 px-4 py-3.5 text-left transition-colors hover:bg-[#16213E] active:scale-[0.99]"
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
          accent ? 'bg-purple-primary/25 text-purple-light' : 'bg-[#16213E] text-gold-primary'
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <span className="font-roboto text-[14px] font-semibold text-text-primary">
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
}) {
  const logout = useAuthStore((state) => state.logout)
  const player = useAuthStore((state) => state.player)

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

  return (
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-label="Close menu"
      />

      <div className="menu-sheet-enter absolute bottom-0 left-0 right-0 rounded-t-[24px] border-t border-white/10 bg-gradient-to-b from-[#16213E] to-[#0D0D1A] px-4 pb-[max(20px,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.45)]">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" aria-hidden="true" />

        <div className="mb-5 flex items-center gap-3 px-1">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-primary font-roboto text-[12px] font-bold text-white">
            {(player?.username ?? 'PL').slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-roboto text-[14px] font-semibold text-text-primary">
              {player?.username ?? 'Player'}
            </p>
            <p className="truncate font-mono text-[11px] text-text-secondary">
              {player?.id ?? '—'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <MenuRow icon="💰" label="Withdrawal" onClick={onWithdraw} />
          <MenuRow icon="↩" label="Cash Back" onClick={onCashback} accent />
          <MenuRow icon="🏆" label="Leaderboard" onClick={onLeaderboard} accent />
          <MenuRow
            icon="⏻"
            label="Log Out"
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
