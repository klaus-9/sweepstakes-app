# Sweepstakes App — Progress & Handoff

> Handoff note for picking the project back up (e.g. after an app restart).
> Last updated: 2026-06-25

## What this is

A mobile-first (390px) cyberpunk/neon **slot machine / sweepstakes** web app.
Phone-preview framing on desktop; full-screen immersive game view.

## Stack

- **React 19** + **Vite 8**, **react-router-dom 7**
- **Tailwind v4** (via `@tailwindcss/vite`) with a `@config '../tailwind.config.js'` compat shim. Custom animations live as plain CSS classes in `src/index.css` (NOT as `tailwind.config.js` keyframes).
- **Phaser 4** for the slot canvas (note: Phaser **4**, not 3 — particle API is the v4 `this.add.particles(x, y, key, config)` form).
- **Howler.js** for audio.
- **Zustand** for state (`authStore`, `gameStore`).
- `axios` + `socket.io-client` are installed but **not yet used** (no real backend wired).

## How to run

```bash
npm install      # if node_modules is missing in the shell sandbox
npm run dev      # vite dev server
npm run build    # production build
npm run lint     # oxlint
```

## Key files / architecture

- `src/pages/` — `Login.jsx` (mock auth: demo / demo123), `Lobby.jsx`, `Game.jsx`
- `src/components/ui/` — `Button.jsx`, `Input.jsx`, `Modal.jsx`
- `src/components/lobby/` — `GameGrid`, `GameTile`, `CategoryTabs`, `TopBar`, `LobbyMenuSheet`
- `src/components/game/` — `SlotGame.jsx` (Phaser bootstrap), `GameHUD.jsx` (balance, bet, SPIN)
- `src/phaser/` — `SlotScene.js` (main scene), `eventBus.js`, `symbols.js`, `SymbolFactory.js`, `ReelGroup.js`
- `src/services/` — `AudioEngine.js`, `api.js`, `socket.js`, `audio.js` (legacy, now unused)
- `src/store/` — `authStore.js`, `gameStore.js`

**Communication:** React HUD <-> Phaser scene talk through `src/phaser/eventBus.js`
events: `SPIN_REQUEST`, `SPIN_STARTED`, `SPIN_RESULT`, `BIG_WIN`.

## DONE — "Juice" / Game-Feel feedback layer (Phase 11)

A layered, multi-sensory feedback system was implemented:

- **`src/services/AudioEngine.js`** (NEW) — Howler singleton: `playBGM` / `playSFX` /
  `playGameSound` + `unlock()` (autoplay) + `setMuted` / `toggleMute`.
  All 8 sounds are **procedurally synthesized** (no asset files needed): ambient drone
  loop, click, hover, error buzz, spin wind-up, reel thud, coin cascade, big-win fanfare.
  Real files dropped in `public/assets/audio/` matching `ASSET_MANIFEST` keys auto-override the synth.
- **Tactile UI** — `Button.jsx` auto-plays click + `active:scale-95` + optional `pulse` prop
  (LOGIN uses it). `GameTile.jsx` hover shimmer sweep + hover beep. `CategoryTabs.jsx` tick on switch.
- **SPIN button** (`GameHUD.jsx`) breathes via `.animate-neon-pulse`; plays spin wind-up;
  error buzz on insufficient balance; coins vs. fanfare based on win size; starts BGM on mount.
- **`SlotScene.js`** — `explodeSymbol(x,y,color)` (neon shatter, ADD blend, 300ms);
  camera `shake(500, 0.015)` on Big Win (>= 10x bet); **jackpot anticipation** (if reels
  1-3 middle row match, reels 4 & 5 stop +500ms / +1000ms later with pulsing gold border
  + rising pitch); bass thud on each reel lock.
- **`index.css`** — added keyframes/classes: `neon-pulse`, `neon-pulse-gold`, `tile-shimmer`,
  plus `prefers-reduced-motion` guards.

## KNOWN GAPS / current shortcuts

- Slot logic is **client-side mock**: `calculateMockWin()` and `randomGrid()` in `SlotScene.js`,
  `mockLogin()` in `Login.jsx`. No server RNG / no real wallet.
- `axios` / `socket.io-client` installed but unused.
- Real symbol art + audio files are absent; code falls back to generated textures/sounds.
- No mute/volume control in the UI yet (engine supports it).

## SUGGESTED NEXT STEPS (not yet started)

- [ ] Add a mute/volume toggle in the HUD (wire to `AudioEngine.setMuted`).
- [ ] Decide: keep mocks, or wire a real backend (auth, balance, server-side spin RNG via socket/axios).
- [ ] Replace procedural audio with real asset files in `public/assets/audio/` (optional).
- [ ] Real slot symbol artwork in `public/assets/` (`symbol_7.png`, `symbol_cherry.png`, `symbol_bar.png`, `particle.png`).
- [ ] Win-line rendering / paylines beyond the middle row.
- [ ] More games (lobby currently routes all tiles to the one slot game).
- [ ] Deployment target / build config.

## Notes for the assistant

- Edit files at the host path `/Users/sachitghimire/Desktop/Game/sweepstakes-app` with Read/Write/Edit.
- After restart, FIRST verify shell access: `node -v` and check `node_modules` in the sandbox;
  run `npm install` if missing before `npm run build`.
