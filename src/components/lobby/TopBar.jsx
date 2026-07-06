import { useState } from 'react'
import Modal from '../ui/Modal'
import Chip from '../ui/Chip'
import LobbyMenuSheet from './LobbyMenuSheet'
import Leaderboard from './Leaderboard'
import ChangePassword from './ChangePassword'
import { useAuthStore } from '../../store/authStore'
import { useGameStore } from '../../store/gameStore'

function getInitials(username = '') {
  return username.slice(0, 2).toUpperCase() || 'PL'
}

function formatPlayerId(id) {
  if (!id) return '—'
  return id.replace(/^player_/, '#')
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5.5H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M3 10H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M3 14.5H17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  )
}

export default function TopBar() {
  const player = useAuthStore((state) => state.player)
  const balance = useGameStore((state) => state.balance)

  const [menuOpen, setMenuOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [cashbackOpen, setCashbackOpen] = useState(false)
  const [leaderboardOpen, setLeaderboardOpen] = useState(false)
  const [changePwOpen, setChangePwOpen] = useState(false)

  const cashbackBalance = 0

  function openFromMenu(action) {
    setMenuOpen(false)
    action()
  }

  return (
    <>
      <header
        className="material sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b border-hair px-3"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* Identity → opens Profile & Account panel */}
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex min-h-[44px] min-w-0 items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-surface-2"
          aria-label="Open profile and account"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent font-display text-[12px] font-semibold text-white"
            style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,.25)' }}
          >
            {getInitials(player?.username)}
          </span>
          <span className="flex min-w-0 flex-col items-start leading-tight">
            <span className="max-w-[92px] truncate font-body text-[12px] font-medium text-txt">
              {player?.username ?? 'Player'}
            </span>
            <span className="font-mono text-[10px] text-txt-muted">
              {formatPlayerId(player?.id)}
            </span>
          </span>
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <div
            className="flex items-center gap-2 rounded-full bg-surface-1 px-3 py-1.5"
            style={{ boxShadow: 'inset 0 1px 0 var(--hairline)' }}
          >
            <Chip size={18} />
            <span className="font-mono text-[14px] font-medium tabular-nums text-gold">
              {balance.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-1 text-txt-sub transition-colors hover:text-txt"
            style={{ boxShadow: 'inset 0 1px 0 var(--hairline)' }}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      <LobbyMenuSheet
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onWithdraw={() => openFromMenu(() => setWithdrawOpen(true))}
        onCashback={() => openFromMenu(() => setCashbackOpen(true))}
        onLeaderboard={() => openFromMenu(() => setLeaderboardOpen(true))}
        onChangePassword={() => openFromMenu(() => setChangePwOpen(true))}
      />

      <Modal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} title="Withdrawal">
        <p>Contact your vendor to withdraw.</p>
      </Modal>

      <Modal isOpen={cashbackOpen} onClose={() => setCashbackOpen(false)} title="Cash back">
        <p className="mb-3">Your available cashback balance:</p>
        <div className="flex items-center gap-2">
          <Chip size={22} />
          <span className="font-mono text-2xl font-medium tabular-nums text-gold">
            {cashbackBalance.toFixed(2)}
          </span>
        </div>
      </Modal>

      <Leaderboard isOpen={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} />

      <ChangePassword isOpen={changePwOpen} onClose={() => setChangePwOpen(false)} />
    </>
  )
}
