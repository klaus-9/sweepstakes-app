export const COLS = 5
export const ROWS = 3

export const CELL_WIDTH = 60
export const CELL_HEIGHT = 60
export const CELL_GAP = 6

export const SYMBOL_COLORS = {
  '7': 0xffd700,
  BAR: 0x6c3fc5,
  CHERRY: 0xe74c3c,
}

export const SYMBOLS = [
  {
    key: 'seven',
    label: '7',
    texturePath: '/assets/symbols/seven.png',
    topColor: 0xffd700,
    bottomColor: 0xc47f00,
  },
  {
    key: 'bar',
    label: 'BAR',
    texturePath: '/assets/symbols/bar.png',
    topColor: 0x9b6fe8,
    bottomColor: 0x4a2890,
  },
  {
    key: 'cherry',
    label: '🍒',
    texturePath: '/assets/symbols/cherry.png',
    topColor: 0xff4d6d,
    bottomColor: 0x9b1b30,
  },
  {
    key: 'diamond',
    label: '◆',
    texturePath: '/assets/symbols/diamond.png',
    topColor: 0x7df9ff,
    bottomColor: 0x0077b6,
  },
  {
    key: 'bell',
    label: '🔔',
    texturePath: '/assets/symbols/bell.png',
    topColor: 0xffe066,
    bottomColor: 0xd4a017,
  },
  {
    key: 'wheel',
    label: '🎡',
    texturePath: '/assets/symbols/wheel.png',
    topColor: 0xb388ff,
    bottomColor: 0x5e35b1,
  },
  {
    key: 'jackpot',
    label: '777',
    texturePath: '/assets/symbols/jackpot.png',
    topColor: 0xfff176,
    bottomColor: 0xf57f17,
  },
]

export const SYMBOL_COUNT = SYMBOLS.length

export function randomSymbolIndex() {
  return Math.floor(Math.random() * SYMBOL_COUNT)
}

export function randomGrid() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => randomSymbolIndex()),
  )
}

export function getGridMetrics(width, height) {
  const gridWidth = COLS * CELL_WIDTH + (COLS - 1) * CELL_GAP
  const gridHeight = ROWS * CELL_HEIGHT + (ROWS - 1) * CELL_GAP
  const originX = (width - gridWidth) / 2 + CELL_WIDTH / 2
  const originY = Math.max(96, height * 0.2)
  const frameX = originX - CELL_WIDTH / 2 - 14
  const frameY = originY - 10
  const frameWidth = gridWidth + 28
  const frameHeight = gridHeight + 20

  return {
    gridWidth,
    gridHeight,
    originX,
    originY,
    frameX,
    frameY,
    frameWidth,
    frameHeight,
    maskX: frameX + 14,
    maskY: originY,
    maskWidth: gridWidth,
    maskHeight: gridHeight,
  }
}
