import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ---- Mock seams (swap for real endpoints later; shapes stay the same) ----

export async function getLeaderboard() {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return [
    { rank: 1, username: 'DragonKing', points: 184200 },
    { rank: 2, username: 'LuckyNova', points: 152980 },
    { rank: 3, username: 'ReefRunner', points: 141050 },
    { rank: 4, username: 'GoldenApe', points: 98760 },
    { rank: 5, username: 'MysticSpin', points: 87340 },
    { rank: 6, username: 'CoralQueen', points: 72110 },
    { rank: 7, username: 'JokerWild', points: 64890 },
  ]
}

export async function changePassword({ current, next }) {
  await new Promise((resolve) => setTimeout(resolve, 500))
  if (!current) throw new Error('Enter your current password')
  if (current === next) throw new Error('New password must differ from the current one')
  return { ok: true }
}

export default api
