import Phaser from 'phaser'
import { CELL_HEIGHT, CELL_WIDTH, SYMBOL_COLORS, SYMBOLS } from './symbols'

const CHIP_DARK = 0x16213e
const CHIP_RADIUS = 12
const CHIP_INSET = 4

function resolveChipColor(symbol) {
  if (symbol.label === '7' || symbol.key === 'seven') return SYMBOL_COLORS['7']
  if (symbol.label === 'BAR' || symbol.key === 'bar') return SYMBOL_COLORS.BAR
  if (symbol.label === '🍒' || symbol.key === 'cherry') return SYMBOL_COLORS.CHERRY
  return symbol.topColor
}

export default class SymbolFactory {
  constructor(scene) {
    this.scene = scene
  }

  registerLoadFailures() {}

  ensureFallbackTextures() {}

  createSymbol(x, y, symbolIndex) {
    const container = this.scene.add.container(x, y)
    this.paintSymbol(container, symbolIndex)
    return container
  }

  paintSymbol(container, symbolIndex) {
    container.removeAll(true)

    const symbol = SYMBOLS[symbolIndex]
    const chipColor = resolveChipColor(symbol)
    const halfW = CELL_WIDTH / 2
    const halfH = CELL_HEIGHT / 2

    const outer = this.scene.add.graphics()
    outer.fillStyle(CHIP_DARK, 1)
    outer.fillRoundedRect(-halfW, -halfH, CELL_WIDTH, CELL_HEIGHT, CHIP_RADIUS)
    outer.lineStyle(1.5, 0xffffff, 0.12)
    outer.strokeRoundedRect(-halfW, -halfH, CELL_WIDTH, CELL_HEIGHT, CHIP_RADIUS)
    outer.lineStyle(1, 0x000000, 0.35)
    outer.strokeRoundedRect(-halfW + 1, -halfH + 1, CELL_WIDTH - 2, CELL_HEIGHT - 2, CHIP_RADIUS - 1)
    container.add(outer)

    const innerW = CELL_WIDTH - CHIP_INSET * 2
    const innerH = CELL_HEIGHT - CHIP_INSET * 2
    const inner = this.scene.add.graphics()
    inner.fillStyle(chipColor, 1)
    inner.fillRoundedRect(
      -halfW + CHIP_INSET,
      -halfH + CHIP_INSET,
      innerW,
      innerH,
      CHIP_RADIUS - 2,
    )
    inner.fillStyle(0xffffff, 0.18)
    inner.fillRoundedRect(
      -halfW + CHIP_INSET + 2,
      -halfH + CHIP_INSET + 2,
      innerW - 4,
      innerH * 0.38,
      CHIP_RADIUS - 4,
    )
    inner.lineStyle(1, chipColor, 0.65)
    inner.strokeRoundedRect(
      -halfW + CHIP_INSET,
      -halfH + CHIP_INSET,
      innerW,
      innerH,
      CHIP_RADIUS - 2,
    )
    container.add(inner)

    const fontSize =
      symbol.label.length > 2 ? 13 : symbol.label === '◆' ? 20 : symbol.label === '🍒' ? 22 : 24

    const label = this.scene.add
      .text(0, 0, symbol.label, {
        fontFamily: 'Oswald, Arial, sans-serif',
        fontSize,
        fontStyle: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setBlendMode(Phaser.BlendModes.ADD)

    label.setShadow(0, 0, '#ffffff', 12, true, true)
    container.add(label)

    container.symbolIndex = symbolIndex
  }

  setSymbolIndex(symbolContainer, symbolIndex) {
    if (symbolContainer.symbolIndex === symbolIndex) return
    this.paintSymbol(symbolContainer, symbolIndex)
  }
}
