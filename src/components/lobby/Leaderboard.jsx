import { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import Spinner from '../ui/Spinner'
import { getLeaderboard } from '../../services/api'

const MEDAL = { 1: '#F5C451', 2: '#C7CDD6', 3: '#C9873A' }

export default function Leaderboard({ isOpen, onClose }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    let active = true
    setLoading(true)
    getLeaderboard().then((data) => {
      if (active) {
        setRows(data)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leaderboards">
      <p className="-mt-2 mb-3 text-[12px] text-txt-muted">Ranking by betting · updated hourly</p>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner variant="chip" size={30} />
        </div>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {rows.map((r) => (
            <li
              key={r.rank}
              className="flex items-center gap-3 rounded-lg bg-surface-1 px-3 py-2.5"
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-display text-[12px] font-semibold ${
                  MEDAL[r.rank] ? '' : 'bg-surface-2 text-txt-sub'
                }`}
                style={MEDAL[r.rank] ? { background: MEDAL[r.rank], color: '#1a1206' } : undefined}
              >
                {r.rank}
              </span>
              <span className="min-w-0 flex-1 truncate font-body text-[13px] text-txt">
                {r.username}
              </span>
              <span className="font-mono text-[12px] tabular-nums text-txt-sub">
                {r.points.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex items-center gap-3 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-display text-[10px] font-semibold text-white">
          99+
        </span>
        <span className="flex-1 font-body text-[13px] text-txt">Your ranking</span>
        <span className="font-mono text-[12px] text-txt-sub">100+</span>
      </div>
    </Modal>
  )
}
