import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import { useAuthStore } from '../store/authStore'
import { useGameStore } from '../store/gameStore'
import './Login.css'

const MOCK_ACCOUNT = 'demo'
const MOCK_PASSWORD = 'demo123'
const REMEMBER_KEY = 'juwa_remember_user'

async function mockLogin(account, password) {
  await new Promise((resolve) => setTimeout(resolve, 700))

  if (account.toLowerCase() === 'suspended') {
    throw new Error('Account suspended')
  }

  if (account === MOCK_ACCOUNT && password === MOCK_PASSWORD) {
    return {
      token: 'mock-jwt.eyJzdWIiOiJwbGF5ZXJfMDAxIn0.mock-signature',
      player: {
        id: 'player_001',
        username: account,
        vendor_id: 'vendor_01',
      },
      balance: 1250.0,
    }
  }

  throw new Error('Invalid credentials')
}

export default function Login() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const login = useAuthStore((state) => state.login)
  const updateBalance = useGameStore((state) => state.updateBalance)

  const [account, setAccount] = useState(() => localStorage.getItem(REMEMBER_KEY) || '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(() => Boolean(localStorage.getItem(REMEMBER_KEY)))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/lobby', { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) {
    return <Navigate to="/lobby" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!account.trim() || !password.trim()) {
      setError('Invalid credentials')
      return
    }

    setLoading(true)

    try {
      const data = await mockLogin(account.trim(), password)
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, account.trim())
      } else {
        localStorage.removeItem(REMEMBER_KEY)
      }
      login(data.token, data.player)
      updateBalance(data.balance)
      navigate('/lobby', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page flex min-h-dvh flex-col">
      <div className="login-embers" aria-hidden="true">
        <span className="login-ember" />
        <span className="login-ember" />
        <span className="login-ember" />
        <span className="login-ember" />
        <span className="login-ember" />
        <span className="login-ember" />
        <span className="login-ember" />
        <span className="login-ember" />
      </div>

      <main className="relative z-10 flex flex-1 flex-col gap-6 px-5 pb-8 pt-4">
        <section className="login-hero-glow flex flex-1 flex-col items-center justify-center px-4 py-8">
          <img
            src="/assets/juwa-logo.png"
            alt="JUWA"
            className="w-44 max-w-[55vw] drop-shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
          />
          <p className="mt-4 font-body text-[13px] tracking-wide text-txt-sub">
            Sign in to start playing
          </p>
        </section>

        <section className="material grain overflow-hidden rounded-2xl border border-hair p-5">
          <h2 className="mb-5 font-display text-xl font-semibold text-txt">Player login</h2>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-center font-body text-[13px] font-medium text-danger"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="account"
              label="Account"
              value={account}
              onChange={(event) => setAccount(event.target.value)}
              placeholder="Enter your account"
              autoComplete="username"
              disabled={loading}
              error={error}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
              error={error}
            />

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 font-body text-[13px] text-txt-sub">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4"
                  style={{ accentColor: 'var(--accent)' }}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="font-body text-[13px] text-accent transition-colors hover:text-txt"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" fullWidth loading={loading} disabled={loading} pulse>
              {loading ? 'Signing in…' : 'Log in'}
            </Button>
          </form>

          <p className="mt-4 text-center font-body text-[11px] text-txt-muted">
            Demo: <span className="font-mono text-accent">{MOCK_ACCOUNT}</span> /{' '}
            <span className="font-mono text-accent">{MOCK_PASSWORD}</span>
          </p>
        </section>
      </main>

      <Modal isOpen={forgotOpen} onClose={() => setForgotOpen(false)} title="Reset password">
        <p>Contact your vendor to reset your password.</p>
      </Modal>
    </div>
  )
}
