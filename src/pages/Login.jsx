import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuthStore } from '../store/authStore'
import { useGameStore } from '../store/gameStore'
import './Login.css'

const MOCK_ACCOUNT = 'demo'
const MOCK_PASSWORD = 'demo123'

async function mockLogin(account, password) {
  await new Promise((resolve) => setTimeout(resolve, 900))

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

  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      login(data.token, data.player)
      updateBalance(data.balance)
      navigate('/lobby', { replace: true })
    } catch {
      setError('Invalid credentials')
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
        <section className="login-hero-glow flex flex-1 flex-col items-center justify-center px-4 py-10">
          <div className="login-emblem" aria-hidden="true">
            <span className="login-emblem__mark">777</span>
            <span className="login-emblem__sheen" />
          </div>

          <h1 className="mt-6 bg-gradient-to-b from-gold-shine to-gold-deep bg-clip-text font-oswald text-[44px] font-black tracking-[0.18em] text-transparent">
            JUWA
          </h1>
          <div className="mt-1 h-px w-16 bg-gradient-to-r from-transparent via-gold-primary to-transparent" />
          <p className="mt-3 font-roboto text-[13px] tracking-wide text-text-secondary">
            Sign in to start playing
          </p>
        </section>

        <section className="rounded-2xl border border-gold-primary/15 bg-bg-card/80 p-5 shadow-[0_0_40px_rgba(212,175,55,0.06)] backdrop-blur-sm">
          <h2 className="mb-5 font-oswald text-xl font-bold text-gold-primary">
            Player Login
          </h2>

          {error && (
            <p
              role="alert"
              className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-center font-roboto text-[13px] font-semibold text-red-400"
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

            <Button type="submit" fullWidth loading={loading} disabled={loading} pulse>
              {loading ? 'Signing in…' : 'LOGIN'}
            </Button>
          </form>

          <p className="mt-4 text-center font-roboto text-[11px] text-text-secondary">
            Demo: <span className="font-mono text-purple-light">{MOCK_ACCOUNT}</span>{' '}
            / <span className="font-mono text-purple-light">{MOCK_PASSWORD}</span>
          </p>
        </section>
      </main>
    </div>
  )
}
