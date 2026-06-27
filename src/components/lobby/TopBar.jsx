import { useState } from 'react'
import Modal from '../ui/Modal'
import LobbyMenuSheet from './LobbyMenuSheet'
import { useAuthStore } from '../../store/authStore'
import { useGameStore } from '../../store/gameStore'

function CoinIcon() {
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#F5A623] text-[10px] font-bold text-[#0D0D1A]"
      aria-hidden="true"
    >
      $
    </span>
  )
}

function getInitials(username = '') {
  return username.slice(0, 2).toUpperCase() || 'PL'
}

function formatPlayerId(id) {
  if (!id) return '—'
  return id.replace(/^player_/, '#')
}

function MenuIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 5.5H17"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M3 10H17"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M3 14.5H17"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
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

  const cashbackBalance = 0

  function openFromMenu(action) {
    setMenuOpen(false)
    action()
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b border-[#caa13e]/25 bg-[#150f06]/80 px-4 backdrop-blur-md">
        <div className="flex min-w-0 shrink-0 items-center gap-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f5c542] to-[#3a8a3a] font-roboto text-[11px] font-bold text-[#1a1206] shadow-[0_0_12px_rgba(120,200,80,0.35)]"
            aria-hidden="true"
          >
            {getInitials(player?.username)}
          </div>
          <p
            className="truncate font-mono text-[11px] font-medium text-text-secondary"
            title={player?.id}
          >
            {formatPlayerId(player?.id)}
          </p>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <div className="flex max-w-[140px] items-center gap-2 rounded-full border border-[#F5C542]/40 bg-[#2a1d09]/90 px-3 py-1.5 shadow-[0_0_12px_rgba(245,197,66,0.18)]">
            <CoinIcon />
            <span className="truncate font-mono text-[14px] font-bold tabular-nums text-[#FFD86A]">
              {balance.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#caa13e]/25 bg-[#2a1d09]/80 text-text-primary transition-colors hover:border-[#F5C542]/50 hover:bg-[#3a2810]"
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
      />

      <Modal
        isOpen={withdrawOpen}
        onClose={() => setWithdrawOpen(false)}
        title="Withdrawal"
      >
        <p>Contact your vendor to withdraw.</p>
      </Modal>

      <Modal
        isOpen={cashbackOpen}
        onClose={() => setCashbackOpen(false)}
        title="Cash Back"
      >
        <p className="mb-3">Your available cashback balance:</p>
        <p className="font-mono text-2xl font-bold text-gold-shine">
          ${cashbackBalance.toFixed(2)}
        </p>
      </Modal>

      <Modal
        isOpen={leaderboardOpen}
        onClose={() => setLeaderboardOpen(false)}
        title="Leaderboard"
      >
        <p>Top players this week will appear here.</p>
      </Modal>
    </>
  )
}
