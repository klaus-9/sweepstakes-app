import { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Chip from '../ui/Chip'
import { useGameStore } from '../../store/gameStore'

const PRESETS = [1, 5, 10, 25, 50, 100]

export default function BetModal({ isOpen, onClose }) {
  const betAmount = useGameStore((s) => s.betAmount)
  const balance = useGameStore((s) => s.balance)
  const setBet = useGameStore((s) => s.setBet)
  const [value, setValue] = useState(String(betAmount))

  useEffect(() => {
    if (isOpen) setValue(String(betAmount))
  }, [isOpen, betAmount])

  const num = Number(value)
  const valid = Number.isFinite(num) && num > 0
  const tooHigh = valid && num > balance

  function confirm() {
    if (!valid || tooHigh) return
    setBet(Number(num.toFixed(2)))
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set your bet">
      <p className="-mt-1 mb-3 flex items-center gap-2 text-[13px] text-txt-sub">
        You have <Chip size={15} />
        <span className="font-mono text-gold">{balance.toFixed(2)}</span> credits
      </p>

      <label htmlFor="bet-input" className="mb-1.5 block font-body text-[13px] text-txt-sub">
        Bet amount per spin
      </label>
      <input
        id="bet-input"
        type="number"
        inputMode="decimal"
        min="1"
        step="1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && confirm()}
        className="mb-3 w-full rounded-lg border border-border bg-surface-1 px-4 py-3 font-mono text-[18px] text-txt outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(108,92,231,0.25)]"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setValue(String(p))}
            className={`rounded-lg px-3 py-1.5 font-mono text-[13px] transition-colors ${
              num === p
                ? 'bg-accent text-white'
                : 'border border-hair bg-surface-1 text-txt-sub hover:text-txt'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {tooHigh && (
        <p role="alert" className="mb-3 text-[13px] text-danger">
          That's more than your credits.
        </p>
      )}

      <Button fullWidth onClick={confirm} disabled={!valid || tooHigh}>
        Confirm bet
      </Button>
    </Modal>
  )
}
