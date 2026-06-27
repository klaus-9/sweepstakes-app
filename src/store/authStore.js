import { create } from 'zustand'
import { connectSocket, disconnectSocket } from '../services/socket'

export const useAuthStore = create((set) => ({
  token: null,
  player: null,
  isAuthenticated: false,

  login: (token, player) => {
    set({ token, player, isAuthenticated: true })
    connectSocket(token)
  },

  logout: () => {
    disconnectSocket()
    set({ token: null, player: null, isAuthenticated: false })
    window.location.assign('/login')
  },
}))
