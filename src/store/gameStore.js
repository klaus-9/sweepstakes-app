import { create } from 'zustand'

export const useGameStore = create((set) => ({
  balance: 0,
  betAmount: 0.4, // this is the per-line bet
  lines: 20,
  sessionId: null,
  isSpinning: false,
  lastWin: 0,

  updateBalance: (amount) => set({ balance: amount }),

  setBet: (amount) => set({ betAmount: amount }),

  setLines: (lines) => set({ lines }),

  setSpinning: (isSpinning) => set({ isSpinning }),

  setLastWin: (amount) => set({ lastWin: amount }),
}))
