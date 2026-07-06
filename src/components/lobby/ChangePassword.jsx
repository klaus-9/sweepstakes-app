import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { changePassword } from '../../services/api'
import { useAuthStore } from '../../store/authStore'

export default function ChangePassword({ isOpen, onClose }) {
  const logout = useAuthStore((state) => state.logout)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (next.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    if (next !== confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await changePassword({ current, next })
      // Success: force a fresh login for security.
      logout()
    } catch (err) {
      setError(err.message || 'Could not change password')
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-center font-body text-[13px] font-medium text-danger"
          >
            {error}
          </p>
        )}
        <Input
          id="cur-pw"
          label="Current password"
          type="password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          autoComplete="current-password"
          disabled={loading}
        />
        <Input
          id="new-pw"
          label="New password"
          type="password"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          autoComplete="new-password"
          disabled={loading}
        />
        <Input
          id="conf-pw"
          label="Re-enter new password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          disabled={loading}
        />
        <Button type="submit" fullWidth loading={loading} disabled={loading}>
          {loading ? 'Saving…' : 'Confirm'}
        </Button>
      </form>
    </Modal>
  )
}
