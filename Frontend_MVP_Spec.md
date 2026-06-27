# SWEEPSTAKES PLATFORM — FRONTEND MVP SPEC
**Role:** Frontend Developer + UI/UX
**Target:** Week 1-2 Deliverable
**Stack:** React + Vite · Tailwind CSS · Phaser 3 · Socket.IO · Zustand

---

## 1. Tech Stack

| Tool | Purpose | Why |
|---|---|---|
| React 18 + Vite | Main UI framework | Fast HMR, Cursor AI knows it well |
| Tailwind CSS | Styling | Utility-first — build dark casino UI fast without custom CSS |
| Phaser 3 | Slot game engine | Browser canvas, handles animations + sprite sheets |
| Socket.IO Client | Real-time balance | Connects to backend WebSocket for live balance updates |
| Zustand | State management | Simpler than Redux — player balance, session, auth state |
| Axios | API calls | Interceptors for JWT auto-attach + error handling |
| React Router v6 | Page routing | Login → Lobby → Game routing |
| Howler.js | Audio | Sound effects for spins, wins, big jackpots |

> ⚡ **Do NOT use Next.js** — SSR adds complexity you don't need. Vite + React is faster to build and deploy.

> ⚡ **Phaser 3 runs inside React** — Phaser handles the spinning reels inside a canvas element. React handles everything else (lobby, HUD, API calls).

---

## 2. Visual Design System

Based on the Juwa screenshots: dark backgrounds, gold/neon accents, purple highlights, high-contrast white text. **Mobile-first — design for 390px width (iPhone 14 Pro).**

### Color Palette

```css
/* Paste these into your tailwind.config.js */
--bg-primary:     #0D0D1A  /* Main background, game backdrop */
--bg-card:        #16213E  /* Game tiles, modals, cards */
--bg-surface:     #1E1E2E  /* Navigation, inputs, sidebars */
--gold-primary:   #F5A623  /* CTA buttons, balance display, win amounts */
--gold-shine:     #FFD700  /* Win animations, jackpot text */
--purple-primary: #6C3FC5  /* Active states, category pills, header */
--purple-light:   #9B6FE8  /* Secondary headings, subtext */
--green-cta:      #27AE60  /* Login button, cashout, positive actions */
--red-danger:     #E74C3C  /* Suspend, warnings, losing flash */
--cyan-accent:    #00BCD4  /* Online indicators, info tooltips */
--text-primary:   #FFFFFF  /* Main text, headings */
--text-secondary: #AAAAAA  /* Subtext, timestamps, labels */
```

### Typography

Import from Google Fonts: **Oswald** (400, 700, 900) + **Roboto** (400, 600, 700) + **Roboto Mono**

| Element | Font | Size | Weight | Color |
|---|---|---|---|---|
| Platform logo | Oswald | 32px | 900 | --gold-primary |
| Section heading | Oswald | 20px | 700 | --gold-primary |
| Game tile name | Roboto | 13px | 600 | --text-primary |
| Balance display | Roboto Mono | 22px | 700 | --gold-shine |
| Button text | Roboto | 15px | 700 | --bg-primary |
| Body / labels | Roboto | 13px | 400 | --text-secondary |
| Player ID | Roboto Mono | 11px | 400 | --text-secondary |

---

## 3. Screens to Build — Priority Order

> Build exactly in this order. Do not start screen N+1 until screen N is connected to the real API.

---

### Screen 1: Login Page `[Day 1-2]`

**Layout:**
- Full-screen dark background (`--bg-primary`) with floating casino elements (cards, chips, dice) via CSS keyframe animations
- Platform logo top-right
- Left side: decorative casino character/graphic (placeholder image for MVP)
- Right side: login form

**Form elements:**
- Account input field (dark, `--bg-surface` background, white text)
- Password input field
- Remember Me checkbox
- Forgot Password link → shows modal: "Please contact your vendor to reset your password"
- LOGIN button — full width, green (`--green-cta`), rounded, gold text, large

**States:**
- Loading: spinner inside button, button disabled
- Error: red banner above form — `"Invalid credentials"` / `"Account suspended"`
- Success: decode JWT → store in Zustand → redirect to `/lobby`

---

### Screen 2: Game Lobby `[Day 2-3]`

**Layout:**
- Fixed TopBar (height: 60px)
- Fixed CategorySidebar (left, width: 70px on mobile)
- Scrollable game grid (main content area)

**TopBar contains (left to right):**
- Player avatar circle (initials fallback)
- Player ID below avatar (small, monospace)
- Gold coin icon + balance amount (from `gameStore.balance`, live via WebSocket)
- WITHDRAWAL button → opens modal: "Contact your vendor to withdraw"
- CASH BACK button → shows cashback balance (hardcode 0 for MVP)
- Hamburger menu → opens drawer: Leaderboard / Change Password / Logout

**CategorySidebar pills (vertical):**
- ALL (default active)
- FAVORITE (heart icon)
- SLOTS (slot machine icon)
- FISHING (fish icon)
- OTHER

**Game Grid:**
- 2 columns on mobile, 3-4 columns on desktop
- Each `GameTile`: thumbnail image, game name, optional HOT/NEW badge
- Tap tile → navigate to `/game/magic_wheel_7s` → call `POST /api/game/session/start`

---

### Screen 3: Slot Game — Magic Wheel 7s `[Day 3-6]`

**Layout:** Full-screen Phaser canvas. No browser chrome visible.

**Phaser elements:**
- Home button (top-left) → ends session → returns to lobby
- Balance display (top-right): gold coin icon + live amount
- 5×3 reel grid (centered)
- 7 symbols: Lucky 7, BAR BAR BAR, BAR BAR, BAR, Cherry, Dollar Sign, Wild
- Bonus wheel (left side, static for MVP — activates later)

**Bottom control bar:**
- `[i]` Info button (shows paytable)
- `[-]` BET `[+]` — adjustable bet levels: 0.40 / 1.00 / 2.00 / 5.00
- WIN display — shows last win amount
- SPIN button (large, green, right side) — hold for auto-spin

**Spin animation sequence:**
1. Player taps SPIN → button disabled → `POST /api/game/spin` sent
2. All 5 reels spin simultaneously (top-to-bottom scroll animation)
3. Backend returns outcome
4. Reels stop left to right, 200ms delay between each
5. Reels snap to exact symbol positions from server response
6. If `win_amount > 0`: winning symbols flash gold → WIN counter animates up
7. If `win_amount > 10x bet`: full-screen gold particle burst + fanfare sound
8. Balance updates via WebSocket push
9. SPIN button re-enabled

---

### Screen 4: Change Password `[Day 5]`

Modal overlay (not a new page):
- Current Password field
- New Password field
- Re-Enter New Password field
- CONFIRM button (green)
- Validation: min 6 chars, passwords must match, show inline errors
- On success: auto-logout → redirect to login

---

### Screen 5: Leaderboard `[Day 5]`

Modal overlay:
- Title: **LEADERBOARDS** with crown icon
- Subtitle: *"Ranking by betting, updated every 1 hour"*
- Rows: gold/silver/bronze crown for top 3, then numbered
- Columns: Rank | Username | Points wagered
- Current player highlighted at bottom: `"Your Ranking: 100+"`
- X button to close
- Data from `GET /api/game/leaderboard`

---

## 4. Phaser 3 Slot Game — Technical Spec

### React ↔ Phaser Communication

Use a shared event bus (`phaser/eventBus.js` — simple EventEmitter).

| Event | Direction | Payload | Purpose |
|---|---|---|---|
| SPIN_REQUEST | React → Phaser | `{ bet_amount }` | User pressed SPIN |
| SPIN_RESULT | React → Phaser | `{ outcome, win_amount, balance }` | Show reel result |
| BALANCE_UPDATE | WebSocket → React → Phaser | `{ balance }` | Update HUD balance |
| GAME_END | React → Phaser | none | Player left lobby |

### Symbol Definitions & Payouts

| Symbol | Code | 3x Payout | 4x Payout | 5x Payout |
|---|---|---|---|---|
| Lucky 7 (red) | SEVEN | 5x | 20x | 100x |
| BAR BAR BAR | BBB | 3x | 10x | 50x |
| BAR BAR | BB | 2x | 6x | 25x |
| BAR | B | 1x | 3x | 10x |
| Cherry | CHERRY | 1x | 2x | 5x |
| Dollar Sign | DOLLAR | 2x | 8x | 30x |
| Wild | WILD | Substitutes any symbol | | |

> ⚡ Payout multipliers apply to `bet_amount`. Wild substitutes for the highest-value adjacent symbol.

### Reel Strip (20 symbols per reel)

```
B, CHERRY, BB, DOLLAR, B, BBB, CHERRY, B, BB, DOLLAR,
B, CHERRY, BB, B, BBB, DOLLAR, B, CHERRY, SEVEN, WILD
```

> ⚡ The visual reel strip is cosmetic only. Actual win/loss is decided server-side. The client animates to whatever position the server returns.

### Phaser Scene File Structure

```
phaser/
├── SlotScene.js      ← Main scene: loads assets, manages game loop
├── ReelGroup.js      ← 5 reels, spin + stop animation logic
├── WinAnimator.js    ← Payline flash, particle burst, counter
└── eventBus.js       ← Simple EventEmitter for React ↔ Phaser
```

---

## 5. React Component Structure

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx          ← Gold CTA, Green CTA, Ghost variants
│   │   ├── Modal.jsx           ← Reusable dark modal wrapper
│   │   ├── Input.jsx           ← Styled dark input field
│   │   ├── Badge.jsx           ← HOT / NEW / LIVE badges on game tiles
│   │   └── Spinner.jsx         ← Loading spinner
│   ├── lobby/
│   │   ├── TopBar.jsx          ← Balance, withdrawal, cashback, menu
│   │   ├── CategorySidebar.jsx ← ALL/SLOTS/FISHING filter
│   │   ├── GameGrid.jsx        ← Responsive game tile grid
│   │   ├── GameTile.jsx        ← Single game card
│   │   ├── Leaderboard.jsx     ← Leaderboard modal
│   │   └── WithdrawModal.jsx   ← Contact vendor message
│   └── game/
│       ├── SlotGame.jsx        ← Phaser canvas wrapper
│       ├── GameHUD.jsx         ← Balance overlay on game
│       └── WinDisplay.jsx      ← Big win animation overlay
├── pages/
│   ├── Login.jsx
│   ├── Lobby.jsx
│   └── Game.jsx
├── store/
│   ├── authStore.js            ← JWT, player info, logout
│   └── gameStore.js            ← Balance, session, bet amount
├── services/
│   ├── api.js                  ← Axios instance with JWT interceptor
│   └── socket.js               ← Socket.IO client connection
├── phaser/
│   ├── SlotScene.js
│   ├── ReelGroup.js
│   └── eventBus.js
└── App.jsx                     ← Router setup
```

---

## 6. State Management (Zustand)

### authStore
| Field | Type | Description |
|---|---|---|
| token | string \| null | JWT — stored in memory only (NOT localStorage) |
| player | object \| null | `{ id, username, vendor_id }` |
| isAuthenticated | boolean | True when token valid |
| login(token, player) | action | Set token + player, start socket connection |
| logout() | action | Clear store, disconnect socket, redirect to login |

### gameStore
| Field | Type | Description |
|---|---|---|
| balance | number | Current player point balance |
| betAmount | number | Current bet per spin (default 0.40) |
| sessionId | string \| null | Active game session ID |
| isSpinning | boolean | Prevents double-spin |
| lastWin | number | Last spin win amount (0 if no win) |
| updateBalance(amount) | action | Called on WebSocket `balance:update` |
| setBet(amount) | action | Change bet level |

> ⚡ **Store JWT in memory (Zustand), NOT localStorage.** localStorage is accessible to any JS on the page. Memory-only is safer — token is lost on page refresh, which forces re-login (that's fine and intended).

---

## 7. Mobile-First Specs

Design for 390×844px (iPhone 14 Pro) first. Everything scales up.

### Touch Targets
| Element | Min Size | Notes |
|---|---|---|
| SPIN button | 80px × 60px | Players tap hundreds of times per session |
| BET +/- buttons | 44px × 44px | Apple HIG minimum |
| Category pills | 44px tall | Scrollable vertically on mobile |
| Game tiles | Full column width | 2 columns on mobile ≈ 170px wide each |
| Top bar icons | 44px × 44px | Withdrawal, cashback, menu |
| Modal close (X) | 44px × 44px | Easy to dismiss |

### Viewport Rules
- Lock to portrait mode — no landscape support needed for MVP
- Prevent rubber-band scroll on iOS: `overscroll-behavior: none` on body
- Game canvas: `100vw × 100vh`, no browser chrome visible during gameplay
- Lobby: fixed TopBar + fixed CategorySidebar + scrollable game grid
- Safe area insets: `padding-top: env(safe-area-inset-top)` for notched phones

---

## 8. Week 1-2 — Daily Build Plan

> Connect each screen to the real backend API before moving to the next.

### Day 1 — Project Setup + Design System
- [ ] Init Vite + React, install all dependencies
- [ ] Configure Tailwind with custom color tokens from Section 2
- [ ] Import Google Fonts (Oswald + Roboto + Roboto Mono)
- [ ] Build reusable components: Button, Input, Modal, Spinner
- [ ] Setup React Router: `/login`, `/lobby`, `/game/:gameId`
- [ ] Setup Axios instance with JWT interceptor
- [ ] Setup Zustand stores (authStore + gameStore)

### Day 2 — Login Page
- [ ] Build Login page matching Juwa screenshot layout
- [ ] Dark background with floating decorative elements (CSS keyframe animations)
- [ ] Form: Account + Password fields, Remember Me, Login button
- [ ] Wire to `POST /api/auth/player/login`
- [ ] Handle errors: suspended account, wrong credentials
- [ ] On success: store token in Zustand → redirect to `/lobby`
- [ ] Test with real backend API

### Day 3 — Game Lobby Shell + Top Bar
- [ ] Build lobby layout: fixed TopBar + fixed Sidebar + scroll area
- [ ] TopBar: avatar, balance (from gameStore), Withdrawal, Cashback, Menu
- [ ] CategorySidebar: ALL / FAVORITE / SLOTS / FISHING / OTHER
- [ ] Withdrawal modal: "Please contact your vendor to withdraw"
- [ ] Change Password modal wired to API
- [ ] Leaderboard modal wired to `GET /api/game/leaderboard`
- [ ] Socket.IO connection on login — listen for `balance:update`

### Day 4 — Game Grid + Tiles
- [ ] GameGrid: 2-col mobile, 3-col desktop
- [ ] GameTile: thumbnail, game name, HOT badge
- [ ] Category filter (SLOTS / FISHING / etc)
- [ ] Tap tile → navigate to `/game/magic_wheel_7s`
- [ ] Call `POST /api/game/session/start` on game entry
- [ ] Call `POST /api/game/session/end` on back button
- [ ] Placeholder thumbnails for all tiles

### Day 5-6 — Slot Game Phaser Scene
- [ ] Install Phaser 3, create `SlotScene.js`
- [ ] Load 7 symbol sprites + reel background
- [ ] Build `ReelGroup.js`: 5 reels, 3 visible symbols each
- [ ] Spin animation: all reels spin for 1-2 seconds
- [ ] Stop animation: reels stop left to right, 200ms delay each
- [ ] Snap reels to symbol positions from server
- [ ] Win visual: gold outline flash on winning symbols
- [ ] Embed Phaser canvas in React `SlotGame.jsx`
- [ ] Connect eventBus: React sends spin → Phaser plays result

### Day 7 — HUD + Win Animations
- [ ] GameHUD: balance top-right, bet controls bottom, SPIN button
- [ ] SPIN button: large green, hold for auto-spin, disabled while spinning
- [ ] BET +/- buttons: preset levels 0.40 / 1.00 / 2.00 / 5.00
- [ ] WIN counter animation: counts up to win_amount over 0.5s
- [ ] Big win overlay: `win > 10x bet` → full-screen gold particles + sound
- [ ] Add Howler.js: spin sound, win sound, big win fanfare, click sounds
- [ ] Test complete spin flow end-to-end with real backend

### Day 8-9 — Polish + Mobile Testing
- [ ] Test on real devices: iOS Safari + Android Chrome
- [ ] Fix layout issues at 390px width
- [ ] Add loading states to all API calls
- [ ] Handle errors: network failure, session expired, insufficient balance
- [ ] Smooth transitions between lobby and game (fade in/out)
- [ ] Confirm balance updates in real-time via WebSocket
- [ ] Fix any Phaser performance issues on low-end Android

### Day 10 — Vendor Beta Prep
- [ ] Final QA pass on all screens
- [ ] Deploy frontend to Nginx (same VPS as backend)
- [ ] Create test accounts for 2-3 vendor agents
- [ ] Record short Loom video showing full flow for vendors
- [ ] Document known issues + planned fixes

---

## 9. Assets Required — Get These on Day 1

> Waiting for assets kills momentum. Sort these before writing any code.

| Asset | Format | Notes |
|---|---|---|
| Platform logo | SVG | Gold text on transparent — design in Figma or Canva |
| 7 slot symbols | PNG 200×200 | SEVEN, BBB, BB, B, CHERRY, DOLLAR, WILD |
| Reel background | PNG | Dark purple gradient with gold border |
| Bonus wheel | PNG | Colorful segments — static image for MVP |
| Game tile thumbnails | PNG 300×200 | 8-10 placeholder tiles for lobby grid |
| Coin icon | SVG | Gold coin for balance display |
| Win particle | PNG spritesheet | Gold sparkle for win animation |
| Audio: spin | MP3 | Reel spinning sound — freesound.org (CC0) |
| Audio: win | MP3 | Coin drop / win jingle — freesound.org (CC0) |
| Audio: big win | MP3 | Fanfare for large wins — freesound.org (CC0) |

> ⚡ For MVP, symbols can be designed flat in Figma in 2-3 hours. Detailed art comes in v2.

> ⚡ All audio from freesound.org is free for commercial use under CC0 license.

---

*FRONTEND MVP SPEC v1.0 — CONFIDENTIAL*
