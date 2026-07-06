import { create } from 'zustand'

export const useGameStore = create((set) => ({
  balance: 0,
  betAmount: 5, // credits wagered per spin (no paylines — a simple stake)
  sessionId: null,
  isSpinning: false,
  lastWin: 0,

  updateBalance: (amount) => set({ balance: amount }),

  setBet: (amount) => set({ betAmount: amount }),

  setSpinning: (isSpinning) => set({ isSpinning }),

  setLastWin: (amount) => set({ lastWin: amount }),
}))
