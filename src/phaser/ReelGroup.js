import { COLS, ROWS, SYMBOL_COUNT } from './symbols'

export const BUFFER_ABOVE = 2
export const BUFFER_BELOW = 2
const STRIP_LENGTH = BUFFER_ABOVE + ROWS + BUFFER_BELOW

export default class ReelGroup {
  constructor(scene, config) {
    this.scene = scene
    this.symbolFactory = config.symbolFactory
    this.cols = COLS
    this.rows = ROWS
    this.cellWidth = config.cellWidth
    this.cellHeight = config.cellHeight
    this.gap = config.gap
    this.originX = config.originX
    this.originY = config.originY
    this.step = this.cellHeight + this.gap

    this.root = scene.add.container(0, 0)
    this.reels = []

    this.createReels()
    this.updateBufferVisibility(false)
    this.clipSymbolsToWindow()
  }

  createReels() {
    for (let col = 0; col < this.cols; col += 1) {
      const x = this.originX + col * (this.cellWidth + this.gap)
      const container = this.scene.add.container(x, this.originY)
      const strip = []

      for (let i = 0; i < STRIP_LENGTH; i += 1) {
        const y = (i - BUFFER_ABOVE) * this.step + this.cellHeight / 2
        const symbolIndex = Math.floor(Math.random() * SYMBOL_COUNT)
        const symbol = this.symbolFactory.createSymbol(0, y, symbolIndex)
        container.add(symbol)
        strip.push(symbol)
      }

      this.root.add(container)

      this.reels.push({
        container,
        strip,
        spinning: false,
        speed: 0,
        offset: 0,
      })
    }
  }

  clipSymbolsToWindow() {
    const windowTop = this.originY
    const windowBottom = this.originY + this.rows * this.step - this.gap

    this.reels.forEach((reel) => {
      reel.strip.forEach((symbol) => {
        if (!symbol.visible) return

        const worldY = reel.container.y + symbol.y
        const symbolTop = worldY - this.cellHeight / 2
        const symbolBottom = worldY + this.cellHeight / 2
        const inWindow = symbolBottom > windowTop && symbolTop < windowBottom

        symbol.setAlpha(inWindow ? 1 : 0)
      })
    })
  }

  setMask(mask) {
    this.containerMask = mask
    this.root.setMask(mask)
  }

  clearMask() {
    this.root.clearMask(true)
    this.containerMask = null
  }

  updateBufferVisibility(showBuffers) {
    this.reels.forEach((reel) => {
      reel.strip.forEach((symbol, index) => {
        const isBuffer = index < BUFFER_ABOVE || index >= BUFFER_ABOVE + ROWS
        symbol.setVisible(showBuffers || !isBuffer)
      })
    })
  }

  setColumnSymbols(col, indices) {
    const reel = this.reels[col]
    indices.forEach((symbolIndex, row) => {
      this.symbolFactory.setSymbolIndex(reel.strip[row + BUFFER_ABOVE], symbolIndex)
    })
  }

  startAll() {
    this.updateBufferVisibility(true)

    this.reels.forEach((reel) => {
      reel.spinning = true
      reel.speed = 24
    })

    this.clipSymbolsToWindow()
  }

  update(delta) {
    const frameScale = delta / 16.67

    this.reels.forEach((reel) => {
      if (!reel.spinning) return

      reel.offset += reel.speed * frameScale
      reel.container.y = this.originY + (reel.offset % this.step)

      if (reel.offset >= this.step) {
        reel.offset -= this.step
        const top = reel.strip.pop()
        const nextIndex = Math.floor(Math.random() * SYMBOL_COUNT)
        this.symbolFactory.setSymbolIndex(top, nextIndex)
        top.y = reel.strip[0].y - this.step
        reel.strip.unshift(top)
        reel.strip.forEach((symbol, index) => {
          symbol.y = (index - BUFFER_ABOVE) * this.step + this.cellHeight / 2
        })
      }

      this.clipSymbolsToWindow()
    })
  }

  stopColumn(col, symbolIndices) {
    return new Promise((resolve) => {
      const reel = this.reels[col]
      reel.spinning = false

      this.setColumnSymbols(col, symbolIndices)

      const targetY = this.originY + this.step * 0.35

      this.scene.tweens.add({
        targets: reel.container,
        y: targetY,
        duration: 380,
        ease: 'Cubic.easeOut',
        onComplete: () => {
          reel.offset = 0

          this.scene.tweens.add({
            targets: reel.container,
            y: this.originY,
            duration: 160,
            ease: 'Bounce.easeOut',
            onComplete: () => {
              this.clipSymbolsToWindow()
              resolve()
            },
          })
        },
      })
    })
  }

  stopSequentially(grid, delayMs = 200) {
    const run = async () => {
      for (let col = 0; col < this.cols; col += 1) {
        if (col > 0) {
          await new Promise((resolve) => {
            this.scene.time.delayedCall(delayMs, resolve)
          })
        }

        const columnSymbols = [grid[0][col], grid[1][col], grid[2][col]]
        await this.stopColumn(col, columnSymbols)
      }

      this.updateBufferVisibility(false)
      this.clipSymbolsToWindow()
    }

    return run()
  }

  destroy() {
    this.clearMask()
    this.root?.destroy()
    this.reels = []
  }
}
