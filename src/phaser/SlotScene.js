import Phaser from 'phaser'
import { eventBus, EVENTS } from './eventBus'
import AudioEngine from '../services/AudioEngine'
import { useGameStore } from '../store/gameStore'

// The whole game is laid out in the source artwork's coordinate space (the
// jungle PSD is 1920x1080). Every asset — background, frame, buttons, readouts —
// keeps its original position, so nothing has to be hand-aligned.
const GAME_WIDTH = 1920
const GAME_HEIGHT = 1080

// Reel window inside the wood frame (measured from the frame art).
const COLS = 5
const ROWS = 3
// Dark reel window measured from the frame art: x 320–1605, y 236–722.
const REEL_X0 = 320
const REEL_Y0 = 236
const CELL_W = 257
const CELL_H = 162
const REEL_W = COLS * CELL_W
const REEL_H = ROWS * CELL_H
// Symbols stay smaller than the cell so rows have clear gaps between them.
const SYMBOL_SIZE = 132

const BUFFER_ABOVE = 2
const BUFFER_BELOW = 2
const STRIP_LENGTH = BUFFER_ABOVE + ROWS + BUFFER_BELOW

const API_DELAY_MS = 800
const REEL_STOP_DELAY_MS = 220
const ANTICIPATION_DELAY_REEL4_MS = 500
const ANTICIPATION_DELAY_REEL5_MS = 1000
const BIG_WIN_MULTIPLIER = 10

const BET_LEVELS = [0.2, 0.4, 0.8, 1.0, 2.0, 5.0]

// Button hit zones, in artwork coordinates (measured from the side-button art).
const SPIN_CENTER = { x: 965, y: 1052, r: 95 }
const BTN = {
  betUp: { x: 1811, y: 743, w: 150, h: 150 }, // "Bet x Line"
  betMax: { x: 1817, y: 543, w: 170, h: 170 }, // "Bet Max"
  lines: { x: 1815, y: 341, w: 150, h: 150 }, // "Lines"
  auto: { x: 106, y: 543, w: 170, h: 170 }, // "Auto Start"
  info: { x: 112, y: 743, w: 150, h: 150 }, // "Info"
}
const LINE_PRESETS = [1, 5, 10, 15, 20]

// Readout panel value positions (in the dark value strip of each wooden panel).
const PANEL = {
  lines: { x: 143, y: 1014 },
  lineBet: { x: 379, y: 1014 },
  totalBet: { x: 616, y: 1014 },
  won: { x: 1305, y: 1014 },
  credits: { x: 1541, y: 1014 },
}

// Payline number badges flanking the reels — clicking one sets the line count.
const BADGES = [
  { n: 1, cx: 276, cy: 584 }, { n: 2, cx: 276, cy: 367 }, { n: 3, cx: 276, cy: 744 },
  { n: 4, cx: 276, cy: 313 }, { n: 5, cx: 276, cy: 798 }, { n: 6, cx: 1649, cy: 530 },
  { n: 7, cx: 1649, cy: 584 }, { n: 8, cx: 1649, cy: 692 }, { n: 9, cx: 1649, cy: 421 },
  { n: 10, cx: 276, cy: 530 }, { n: 11, cx: 276, cy: 638 }, { n: 12, cx: 1649, cy: 367 },
  { n: 13, cx: 1649, cy: 744 }, { n: 14, cx: 1649, cy: 313 }, { n: 15, cx: 1649, cy: 798 },
  { n: 16, cx: 276, cy: 475 }, { n: 17, cx: 276, cy: 692 }, { n: 18, cx: 1649, cy: 475 },
  { n: 19, cx: 1649, cy: 638 }, { n: 20, cx: 276, cy: 421 },
]
const BADGE_W = 70
const BADGE_H = 56

function totalBet() {
  const { betAmount, lines } = useGameStore.getState()
  return Number((betAmount * lines).toFixed(2))
}

const ASSETS = [
  { key: 'jungle_bg', path: '/assets/jungle/background.png' },
  { key: 'jungle_plate', path: '/assets/jungle/chrome_plate.png' },
  { key: 'jungle_monkey', path: '/assets/jungle/monkey.png' },
  { key: 'jungle_spin', path: '/assets/jungle/spin.png' },
  { key: 'particle', path: '/assets/particle.png' },
]

// Coin/treasure symbols, ordered low → high value.
const SYMBOLS = [
  { key: 'sym_coin', path: '/assets/symbols/coin.png' },
  { key: 'sym_coins', path: '/assets/symbols/coins.png' },
  { key: 'sym_bars', path: '/assets/symbols/bars.png' },
  { key: 'sym_emerald', path: '/assets/symbols/emerald.png' },
  { key: 'sym_ruby', path: '/assets/symbols/ruby.png' },
  { key: 'sym_diamond', path: '/assets/symbols/diamond.png' },
  { key: 'sym_crown', path: '/assets/symbols/crown.png' },
  { key: 'sym_chest', path: '/assets/symbols/chest.png' },
]

function randomSymbolIndex() {
  return Math.floor(Math.random() * SYMBOLS.length)
}

function randomGrid() {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => randomSymbolIndex()),
  )
}

function calculateMockWin(grid, betAmount) {
  const middleRow = grid[1]
  const allMatch = middleRow.every((symbol) => symbol === middleRow[0])

  if (allMatch) {
    return Number((betAmount * (8 + Math.floor(Math.random() * 12))).toFixed(2))
  }

  const pairCount = middleRow.filter(
    (symbol, index, row) => row.indexOf(symbol) !== index,
  ).length

  if (pairCount >= 2 && Math.random() > 0.45) {
    return Number((betAmount * (2 + Math.random() * 4)).toFixed(2))
  }

  if (Math.random() > 0.62) {
    return 0
  }

  return Number((betAmount * (1 + Math.random() * 2)).toFixed(2))
}

export default class SlotScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SlotScene' })
    this.failedKeys = new Set()
  }

  preload() {
    this.failedKeys = new Set()
    this.load.on('loaderror', (file) => {
      console.warn(`[SlotScene] asset missing, using fallback: ${file.key}`)
      this.failedKeys.add(file.key)
    })

    ;[...ASSETS, ...SYMBOLS].forEach(({ key, path }) => this.load.image(key, path))
  }

  create() {
    try {
      this.isProcessing = false
      this.autoSpin = false
      this.paytable = null
      this.reels = []
      this.ensureFallbackTextures()

      this.add.image(0, 0, this.hasTexture('jungle_bg') ? 'jungle_bg' : 'fallback_bg')
        .setOrigin(0, 0)
        .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
        .setDepth(0)

      this.setupReels()

      // The chrome plate sits below the coins (depth 6) so its dark cells show
      // behind them. Two cropped copies of the same plate — just the strips above
      // and below the reel window — sit above the coins (depth 8) to hide the
      // symbols that scroll past the window during a spin (stands in for a mask,
      // which Container.setMask doesn't honour in this Phaser build).
      if (this.hasTexture('jungle_plate')) {
        this.add.image(0, 0, 'jungle_plate').setOrigin(0, 0).setDepth(6)
        this.addOverflowCovers()
      }

      this.setupMonkey()
      this.setupSpinButton()
      this.setupReadouts()
      this.setupInputZones()
      this.setupAmbientParticles()

      this.spinHandler = (payload) => this.handleSpinRequest(payload)
      eventBus.on(EVENTS.SPIN_REQUEST, this.spinHandler)

      // Keep the wooden Credits/Won/Bet panels in sync with the store.
      this.unsubscribeStore = useGameStore.subscribe(() => this.refreshReadouts())
      this.refreshReadouts()

      if (import.meta.env.DEV && typeof window !== 'undefined') {
        window.__slotScene = this
      }
    } catch (error) {
      console.error('[SlotScene] create() failed:', error)
    }
  }

  hasTexture(key) {
    return Boolean(this.textures.exists(key) && !this.failedKeys.has(key))
  }

  ensureFallbackTextures() {
    if (!this.textures.exists('fallback_bg')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      g.fillStyle(0x14110a, 1)
      g.fillRect(0, 0, 64, 64)
      g.generateTexture('fallback_bg', 64, 64)
      g.destroy()
    }
    if (!this.textures.exists('fallback_symbol')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      g.fillStyle(0xd4af37, 1)
      g.fillCircle(64, 64, 60)
      g.generateTexture('fallback_symbol', 128, 128)
      g.destroy()
    }
    if (!this.textures.exists('fallback_particle')) {
      const g = this.make.graphics({ x: 0, y: 0, add: false })
      g.fillStyle(0xffffff, 1)
      g.fillCircle(8, 8, 8)
      g.generateTexture('fallback_particle', 16, 16)
      g.destroy()
    }
  }

  symbolTexture(symbolIndex) {
    const def = SYMBOLS[symbolIndex]
    return def && this.hasTexture(def.key) ? def.key : 'fallback_symbol'
  }

  particleTexture() {
    return this.hasTexture('particle') ? 'particle' : 'fallback_particle'
  }

  cellCenter(col, row) {
    return {
      x: REEL_X0 + col * CELL_W + CELL_W / 2,
      y: REEL_Y0 + row * CELL_H + CELL_H / 2,
    }
  }

  makeSymbol(symbolIndex) {
    const img = this.add.image(0, 0, this.symbolTexture(symbolIndex))
    const size = img.width >= img.height ? { w: SYMBOL_SIZE, h: SYMBOL_SIZE * (img.height / img.width) }
      : { w: SYMBOL_SIZE * (img.width / img.height), h: SYMBOL_SIZE }
    img.setDisplaySize(size.w, size.h)
    img.symbolIndex = symbolIndex
    return img
  }

  setSymbol(img, symbolIndex) {
    if (img.symbolIndex === symbolIndex) return
    img.setTexture(this.symbolTexture(symbolIndex))
    const ratio = img.width >= img.height ? img.height / img.width : img.width / img.height
    if (img.width >= img.height) img.setDisplaySize(SYMBOL_SIZE, SYMBOL_SIZE * ratio)
    else img.setDisplaySize(SYMBOL_SIZE * ratio, SYMBOL_SIZE)
    img.symbolIndex = symbolIndex
  }

  setupReels() {
    // Above the chrome plate (depth 6) so coins are visible inside the cells;
    // the geometry mask keeps them clipped to the reel window, so the wood frame
    // border around the window is never covered.
    this.reelsContainer = this.add.container(0, 0).setDepth(7)
    this.gridStep = CELL_H

    for (let col = 0; col < COLS; col += 1) {
      const x = REEL_X0 + col * CELL_W + CELL_W / 2
      const column = this.add.container(x, REEL_Y0)
      const strip = []
      for (let i = 0; i < STRIP_LENGTH; i += 1) {
        const y = (i - BUFFER_ABOVE) * CELL_H + CELL_H / 2
        const symbol = this.makeSymbol(randomSymbolIndex())
        symbol.y = y
        column.add(symbol)
        strip.push(symbol)
      }
      this.reelsContainer.add(column)
      this.reels.push({ column, strip, spinning: false, speed: 0, offset: 0 })
    }
    this.updateBufferVisibility(false)
  }

  updateBufferVisibility(show) {
    this.reels.forEach((reel) => {
      reel.strip.forEach((symbol, index) => {
        const isBuffer = index < BUFFER_ABOVE || index >= BUFFER_ABOVE + ROWS
        symbol.setVisible(show || !isBuffer)
      })
    })
  }

  setColumnSymbols(col, indices) {
    const reel = this.reels[col]
    indices.forEach((symbolIndex, row) => {
      this.setSymbol(reel.strip[row + BUFFER_ABOVE], symbolIndex)
    })
  }

  // Hide symbols that scroll past the reel window. Each strip is the opaque
  // background (covers the coins) with the plate redrawn on top (restores the
  // frame border / title / readouts).
  addOverflowCovers() {
    const bgKey = this.hasTexture('jungle_bg') ? 'jungle_bg' : 'fallback_bg'
    const strips = [
      { y: 0, h: REEL_Y0 },
      { y: REEL_Y0 + REEL_H, h: GAME_HEIGHT - (REEL_Y0 + REEL_H) },
    ]
    strips.forEach(({ y, h }) => {
      const bg = this.add.image(0, 0, bgKey).setOrigin(0, 0).setDepth(8)
      bg.setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
      bg.setCrop(0, y * (bg.height / GAME_HEIGHT), bg.width, h * (bg.height / GAME_HEIGHT))
      const plate = this.add.image(0, 0, 'jungle_plate').setOrigin(0, 0).setDepth(8)
      plate.setCrop(0, y, GAME_WIDTH, h)
    })
  }

  // The monkey is hidden until a win, then it pops up from the bottom-left,
  // cheers, and slides back out.
  setupMonkey() {
    if (!this.hasTexture('jungle_monkey')) return
    // Bottom-left anchored, ABOVE the overflow covers (depth 8) so the whole
    // body shows on a win instead of being clipped at the reel-window edge.
    this.monkeyRestY = GAME_HEIGHT + 30
    this.monkeyHideY = GAME_HEIGHT + 760
    this.monkey = this.add.image(15, this.monkeyHideY, 'jungle_monkey')
      .setOrigin(0, 1)
      .setScale(0.82)
      .setDepth(9)
      .setAlpha(0)
  }

  // A separate SPIN sprite over the baked plate button so it can react to taps.
  setupSpinButton() {
    if (!this.hasTexture('jungle_spin')) return
    this.spinButton = this.add.image(SPIN_CENTER.x, 1044, 'jungle_spin').setDepth(9)
  }

  pressSpin() {
    if (!this.spinButton) return
    this.tweens.killTweensOf(this.spinButton)
    this.spinButton.setScale(1)
    this.tweens.add({
      targets: this.spinButton, scale: 0.88, duration: 90, yoyo: true, ease: 'Quad.easeOut',
    })
  }

  cheerMonkey() {
    if (!this.monkey) return
    this.tweens.killTweensOf(this.monkey)
    this.monkey.setAlpha(1).setY(this.monkeyHideY)
    this.tweens.add({
      targets: this.monkey,
      y: this.monkeyRestY,
      duration: 420,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: this.monkey,
          y: this.monkeyHideY,
          alpha: 0,
          delay: 1400,
          duration: 380,
          ease: 'Quad.easeIn',
        })
      },
    })
  }

  setupReadouts() {
    const style = {
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: 34,
      fontStyle: 'bold',
      color: '#FFF3C0',
    }
    this.linesText = this.add.text(PANEL.lines.x, PANEL.lines.y, '0', style).setOrigin(0.5).setDepth(9)
    this.lineBetText = this.add.text(PANEL.lineBet.x, PANEL.lineBet.y, '0', style).setOrigin(0.5).setDepth(9)
    this.betText = this.add.text(PANEL.totalBet.x, PANEL.totalBet.y, '0', style).setOrigin(0.5).setDepth(9)
    this.wonText = this.add.text(PANEL.won.x, PANEL.won.y, '0', { ...style, color: '#FFE066' }).setOrigin(0.5).setDepth(9)
    this.creditsText = this.add.text(PANEL.credits.x, PANEL.credits.y, '0', style).setOrigin(0.5).setDepth(9)
  }

  refreshReadouts() {
    const { balance, betAmount, lines, lastWin } = useGameStore.getState()
    this.linesText?.setText(String(lines))
    this.lineBetText?.setText(betAmount.toFixed(2))
    this.betText?.setText(totalBet().toFixed(2))
    this.wonText?.setText((lastWin || 0).toFixed(2))
    this.creditsText?.setText(balance.toFixed(2))
  }

  // Pop-up after EVERY spin: gold "WIN +x" on a win, red "−x" (stake lost) on a loss.
  showResultPopup(amount, isWin) {
    this.resultPopup?.destroy()
    const cx = GAME_WIDTH / 2
    const cy = REEL_Y0 + REEL_H / 2
    const text = isWin ? `WIN +${amount.toFixed(2)}` : `−${amount.toFixed(2)}`
    const color = isWin ? '#FFE066' : '#FF5347'

    const label = this.add.text(0, 0, text, {
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: isWin ? 84 : 64,
      fontStyle: 'bold',
      color,
      stroke: isWin ? '#2a1c05' : '#3a0a06',
      strokeThickness: 8,
    }).setOrigin(0.5)

    const padX = 50
    const bg = this.add.rectangle(0, 0, label.width + padX * 2, label.height + 36, 0x140d04, 0.8)
      .setStrokeStyle(4, isWin ? 0xffd24a : 0xff5347)
      .setOrigin(0.5)

    const popup = this.add.container(cx, cy, [bg, label]).setDepth(9).setScale(0.5).setAlpha(0)
    this.resultPopup = popup

    this.tweens.add({ targets: popup, scale: 1, alpha: 1, duration: 260, ease: 'Back.easeOut' })
    this.tweens.add({
      targets: popup, alpha: 0, scale: 0.9, delay: 1200, duration: 320, ease: 'Quad.easeIn',
      onComplete: () => { popup.destroy(); if (this.resultPopup === popup) this.resultPopup = null },
    })
  }

  addZone(cx, cy, w, h, onTap) {
    const zone = this.add.zone(cx, cy, w, h).setInteractive({ useHandCursor: true }).setDepth(10)
    zone.on('pointerdown', onTap)
    return zone
  }

  setupInputZones() {
    this.addZone(SPIN_CENTER.x, SPIN_CENTER.y, SPIN_CENTER.r * 2, SPIN_CENTER.r * 2, () => this.requestSpin())
    this.addZone(BTN.betUp.x, BTN.betUp.y, BTN.betUp.w, BTN.betUp.h, () => this.cycleBet())
    this.addZone(BTN.betMax.x, BTN.betMax.y, BTN.betMax.w, BTN.betMax.h, () => this.maxBet())
    this.addZone(BTN.lines.x, BTN.lines.y, BTN.lines.w, BTN.lines.h, () => this.cycleLines())
    this.addZone(BTN.auto.x, BTN.auto.y, BTN.auto.w, BTN.auto.h, () => this.toggleAuto())
    this.addZone(BTN.info.x, BTN.info.y, BTN.info.w, BTN.info.h, () => this.togglePaytable())

    // Each payline badge sets the number of active lines (raises total bet).
    BADGES.forEach(({ n, cx, cy }) => {
      this.addZone(cx, cy, BADGE_W, BADGE_H, () => this.setLines(n))
    })

    // Glowing ring shown around the Auto button while auto-spin is active.
    this.autoGlow = this.add.circle(BTN.auto.x, BTN.auto.y, 96)
      .setStrokeStyle(7, 0x6fe06f)
      .setDepth(8)
      .setVisible(false)
  }

  cycleLines() {
    if (this.isProcessing) return
    const current = useGameStore.getState().lines
    const idx = LINE_PRESETS.indexOf(current)
    const next = LINE_PRESETS[(idx + 1) % LINE_PRESETS.length] ?? LINE_PRESETS[0]
    this.setLines(next)
  }

  toggleAuto() {
    this.autoSpin = !this.autoSpin
    this.autoGlow?.setVisible(this.autoSpin)
    AudioEngine.playSFX('click')
    if (this.autoSpin && !this.isProcessing) this.requestSpin()
  }

  togglePaytable() {
    AudioEngine.playSFX('click')
    if (this.paytable) {
      this.paytable.destroy()
      this.paytable = null
      return
    }
    this.buildPaytable()
  }

  buildPaytable() {
    const items = [
      { key: 'sym_chest', label: 'Chest  ×50' },
      { key: 'sym_crown', label: 'Crown  ×25' },
      { key: 'sym_diamond', label: 'Diamond  ×15' },
      { key: 'sym_ruby', label: 'Ruby  ×10' },
      { key: 'sym_emerald', label: 'Emerald  ×8' },
      { key: 'sym_bars', label: 'Bars  ×5' },
      { key: 'sym_coins', label: 'Coins  ×3' },
      { key: 'sym_coin', label: 'Note  ×2' },
    ]
    const overlay = this.add.container(0, 0).setDepth(20)
    const shade = this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.72)
      .setOrigin(0, 0).setInteractive()
    shade.on('pointerdown', () => this.togglePaytable())
    overlay.add(shade)

    const panel = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, 1100, 760, 0x1c1408, 0.98)
      .setStrokeStyle(6, 0xd4a93a)
    overlay.add(panel)

    const title = this.add.text(GAME_WIDTH / 2, 230, 'PAYTABLE', {
      fontFamily: 'Oswald, Arial, sans-serif', fontSize: 56, fontStyle: 'bold', color: '#FFE066',
    }).setOrigin(0.5)
    overlay.add(title)

    items.forEach((it, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const x = GAME_WIDTH / 2 - 260 + col * 520
      const y = 340 + row * 105
      if (this.hasTexture(it.key)) {
        const icon = this.add.image(x, y, it.key).setDisplaySize(80, 80)
        overlay.add(icon)
      }
      const t = this.add.text(x + 60, y, it.label, {
        fontFamily: 'Oswald, Arial, sans-serif', fontSize: 38, fontStyle: 'bold', color: '#F3EEDF',
      }).setOrigin(0, 0.5)
      overlay.add(t)
    })

    const hint = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 330, 'tap anywhere to close', {
      fontFamily: 'Oswald, Arial, sans-serif', fontSize: 28, color: '#9a917a',
    }).setOrigin(0.5)
    overlay.add(hint)

    this.paytable = overlay
  }

  setLines(n) {
    if (this.isProcessing) return
    useGameStore.getState().setLines(n)
    AudioEngine.playSFX('click')
    this.refreshReadouts()
  }

  cycleBet() {
    if (this.isProcessing) return
    const { betAmount, setBet } = useGameStore.getState()
    const idx = BET_LEVELS.indexOf(betAmount)
    const next = BET_LEVELS[(idx + 1) % BET_LEVELS.length]
    setBet(next)
    AudioEngine.playSFX('click')
    this.refreshReadouts()
  }

  maxBet() {
    if (this.isProcessing) return
    useGameStore.getState().setBet(BET_LEVELS[BET_LEVELS.length - 1])
    AudioEngine.playSFX('click')
    this.refreshReadouts()
  }

  requestSpin() {
    AudioEngine.unlock()
    if (this.isProcessing) return
    const { balance } = useGameStore.getState()
    const stake = totalBet()
    if (balance < stake) {
      AudioEngine.playSFX('error')
      return
    }
    AudioEngine.playGameSound('spin')
    this.pressSpin()
    useGameStore.getState().setSpinning(true)
    useGameStore.getState().setLastWin(0)
    useGameStore.getState().updateBalance(Number((balance - stake).toFixed(2)))
    this.refreshReadouts()
    this.handleSpinRequest({ betAmount: stake })
  }

  setupAmbientParticles() {
    this.ambientEmitter = this.add.particles(0, 0, this.particleTexture(), {
      x: { min: 0, max: GAME_WIDTH },
      y: GAME_HEIGHT,
      lifespan: 4000,
      speedY: { min: -40, max: -120 },
      speedX: { min: -10, max: 10 },
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.15, end: 0 },
      blendMode: Phaser.BlendModes.ADD,
      tint: 0xffd86a,
      frequency: 320,
      quantity: 1,
    }).setDepth(7)
  }

  update(_time, delta) {
    const frameScale = delta / 16.67
    this.reels.forEach((reel) => {
      if (!reel.spinning) return
      reel.offset += reel.speed * frameScale
      reel.column.y = REEL_Y0 + (reel.offset % this.gridStep)
      if (reel.offset >= this.gridStep) {
        reel.offset -= this.gridStep
        const top = reel.strip.pop()
        this.setSymbol(top, randomSymbolIndex())
        top.y = reel.strip[0].y - this.gridStep
        reel.strip.unshift(top)
        reel.strip.forEach((symbol, index) => {
          symbol.y = (index - BUFFER_ABOVE) * this.gridStep + CELL_H / 2
        })
      }
    })
  }

  async handleSpinRequest({ betAmount }) {
    if (this.isProcessing || this.reels.length === 0) return
    this.isProcessing = true
    eventBus.emit(EVENTS.SPIN_STARTED)

    try {
      this.updateBufferVisibility(true)
      this.reels.forEach((reel) => {
        reel.spinning = true
        reel.speed = 70
      })

      await new Promise((resolve) => this.time.delayedCall(API_DELAY_MS, resolve))

      const grid = randomGrid()
      const winAmount = calculateMockWin(grid, betAmount)

      const jackpotSymbol = grid[1][0]
      const anticipation = grid[1][1] === jackpotSymbol && grid[1][2] === jackpotSymbol

      for (let col = 0; col < COLS; col += 1) {
        let delay = col > 0 ? REEL_STOP_DELAY_MS : 0
        if (anticipation && col === 3) delay += ANTICIPATION_DELAY_REEL4_MS
        if (anticipation && col === 4) delay += ANTICIPATION_DELAY_REEL5_MS
        if (delay > 0) {
          if (anticipation && (col === 3 || col === 4)) this.startAnticipation(col)
          await new Promise((resolve) => this.time.delayedCall(delay, resolve))
        }
        await this.stopColumn(col, [grid[0][col], grid[1][col], grid[2][col]])
        this.stopAnticipation(col)
      }

      this.updateBufferVisibility(false)

      useGameStore.getState().setLastWin(winAmount)
      if (winAmount > 0) {
        const { balance } = useGameStore.getState()
        useGameStore.getState().updateBalance(Number((balance + winAmount).toFixed(2)))
        this.showWin(winAmount, betAmount, grid)
        this.cheerMonkey()
        this.showResultPopup(winAmount, true)
      } else {
        this.showResultPopup(betAmount, false)
      }
      this.refreshReadouts()

      eventBus.emit(EVENTS.SPIN_RESULT, { win_amount: winAmount, grid, betAmount })
    } catch (error) {
      console.error('[SlotScene] spin failed:', error)
      eventBus.emit(EVENTS.SPIN_RESULT, { win_amount: 0, grid: randomGrid(), betAmount })
    } finally {
      this.isProcessing = false
      useGameStore.getState().setSpinning(false)

      // Auto-spin: queue the next spin once the result has been shown, unless the
      // balance can no longer cover the stake.
      if (this.autoSpin) {
        if (useGameStore.getState().balance >= totalBet()) {
          this.time.delayedCall(1400, () => {
            if (this.autoSpin && !this.isProcessing) this.requestSpin()
          })
        } else {
          this.autoSpin = false
          this.autoGlow?.setVisible(false)
        }
      }
    }
  }

  startAnticipation(col) {
    if (!this.anticipationGlows) this.anticipationGlows = {}
    if (this.anticipationGlows[col]) return
    const x = REEL_X0 + col * CELL_W
    const glow = this.add.graphics().setDepth(8)
    glow.lineStyle(6, 0xffe066, 1)
    glow.strokeRoundedRect(x + 4, REEL_Y0, CELL_W - 8, REEL_H, 8)
    const pulse = this.tweens.add({
      targets: glow, alpha: { from: 0.3, to: 1 }, duration: 220, yoyo: true, repeat: -1,
    })
    this.anticipationGlows[col] = { glow, pulse }
    AudioEngine.playGameSound('spin')
  }

  stopAnticipation(col) {
    const entry = this.anticipationGlows?.[col]
    if (!entry) return
    entry.pulse?.remove()
    entry.glow?.destroy()
    delete this.anticipationGlows[col]
  }

  stopColumn(col, symbolIndices) {
    return new Promise((resolve) => {
      const reel = this.reels[col]
      reel.spinning = false
      this.setColumnSymbols(col, symbolIndices)
      const targetY = REEL_Y0 + this.gridStep * 0.35
      this.tweens.add({
        targets: reel.column, y: targetY, duration: 380, ease: 'Cubic.easeOut',
        onComplete: () => {
          reel.offset = 0
          AudioEngine.playGameSound('thud')
          this.tweens.add({
            targets: reel.column, y: REEL_Y0, duration: 160, ease: 'Bounce.easeOut',
            onComplete: () => { this.popColumn(reel); resolve() },
          })
        },
      })
    })
  }

  explodeSymbol(x, y) {
    const burst = this.add.particles(x, y, this.particleTexture(), {
      speed: { min: 150, max: 380 }, angle: { min: 0, max: 360 }, lifespan: 320,
      scale: { start: 0.9, end: 0 }, alpha: { start: 1, end: 0 },
      blendMode: Phaser.BlendModes.ADD, tint: 0xffd700, emitting: false,
    }).setDepth(9)
    burst.explode(20)
    this.time.delayedCall(380, () => burst.destroy())
  }

  showWin(amount, betAmount, grid) {
    const middleRow = grid?.[1] ?? []
    middleRow.forEach((_symbolIndex, col) => {
      const { x, y } = this.cellCenter(col, 1)
      this.time.delayedCall(col * 70, () => this.explodeSymbol(x, y))
    })

    const burst = this.add.particles(GAME_WIDTH / 2, REEL_Y0 + REEL_H / 2, this.particleTexture(), {
      speed: { min: 250, max: 700 }, angle: { min: 0, max: 360 }, gravityY: 500,
      lifespan: { min: 900, max: 1600 }, scale: { start: 1, end: 0 }, alpha: { start: 0.9, end: 0 },
      blendMode: Phaser.BlendModes.ADD, tint: 0xffd86a, emitting: false,
    }).setDepth(9)
    burst.explode(60)
    this.time.delayedCall(2200, () => burst.destroy())

    if (betAmount > 0 && amount >= betAmount * BIG_WIN_MULTIPLIER) {
      this.cameras.main.shake(500, 0.01)
      eventBus.emit(EVENTS.BIG_WIN, { amount })
    }
  }

  // Quick scale-pop on the landed row of symbols for a tactile stop.
  popColumn(reel) {
    for (let row = 0; row < ROWS; row += 1) {
      const symbol = reel.strip[row + BUFFER_ABOVE]
      if (!symbol) continue
      this.tweens.add({
        targets: symbol,
        scaleX: symbol.scaleX * 1.14,
        scaleY: symbol.scaleY * 1.14,
        duration: 110,
        yoyo: true,
        ease: 'Quad.easeOut',
      })
    }
  }

  shutdown() {
    this.autoSpin = false
    this.paytable?.destroy()
    if (this.spinHandler) eventBus.off(EVENTS.SPIN_REQUEST, this.spinHandler)
    this.unsubscribeStore?.()
    if (this.anticipationGlows) {
      Object.keys(this.anticipationGlows).forEach((col) => this.stopAnticipation(col))
    }
    this.ambientEmitter?.destroy()
    this.reelsContainer?.destroy()
    this.reels = []
  }
}
