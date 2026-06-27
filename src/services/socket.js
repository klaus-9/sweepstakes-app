import { io } from 'socket.io-client'
import { useGameStore } from '../store/gameStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:3000'

let socket = null

export function connectSocket(token) {
  if (!token) return

  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    socket = null
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    autoConnect: true,
    transports: ['websocket', 'polling'],
  })

  socket.on('balance:update', (payload) => {
    const balance =
      typeof payload === 'object' && payload !== null ? payload.balance : payload
    useGameStore.getState().updateBalance(balance)
  })
}

export function disconnectSocket() {
  if (!socket) return

  socket.removeAllListeners()
  socket.disconnect()
  socket = null
}

export function getSocket() {
  return socket
}
