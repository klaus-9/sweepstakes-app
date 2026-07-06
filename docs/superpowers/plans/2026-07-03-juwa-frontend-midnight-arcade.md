# JUWA Frontend (Midnight Arcade) Implementation Plan

> **For agentic workers:** implement task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. There is no unit-test framework in this project — the verification loop for every task is **`npm run build` clean → `npm run lint` clean → visual check in `npm run dev` → no console errors**, mapping to the spec's Definition of Done. Sachit commits; each task ends at a review checkpoint, not an auto-commit.

**Goal:** Complete the JUWA frontend — apply the Midnight Arcade identity across every screen and finish the missing flows — on mock data, satisfying the 7-gate Definition of Done.

**Architecture:** Token-first. All color/type/texture live as CSS custom properties + Tailwind theme tokens; components consume tokens only. Platform chrome (login/lobby/modals) = Midnight Arcade; the jungle Slot game keeps its own theme. Mock data stays behind `src/services/api.js` + `src/services/socket.js` seams so a real backend is a drop-in later.

**Tech Stack:** React 19, Vite 8, Tailwind v4 (`@tailwindcss/vite` + `@config` shim), Phaser 4, Zustand 5, Howler 2.

**Spec:** `docs/superpowers/specs/2026-07-03-juwa-frontend-midnight-arcade-design.md`

## Global Constraints

- Colors: **only** from tokens — no hardcoded hex in components. Gold (`--gold`) appears only on money; violet (`--accent`) is the only UI accent.
- Palette (exact): `--bg #0E1117`, `--bg-deep #0A0B12`, `--surface-1 #171B24`, `--surface-2 #1C212C`, `--border #262B36`, `--hairline rgba(255,255,255,.06)`, `--text #E7EAF0`, `--text-sub #8A93A6`, `--text-muted #5C6373`, `--accent #6C5CE7`, `--accent-deep #4B3FB0`, `--gold #F5C451`, `--gold-deep #C9973A`, `--win #34C77B`, `--danger #E24B4A`, `--info #378ADD`.
- Fonts: Sora (display/headings), Inter (body), Roboto Mono (numbers, tabular).
- Mobile-first 390×844, portrait lock; touch targets SPIN ≥80×60, controls/icons ≥44×44; `env(safe-area-inset-*)`; no horizontal overflow.
- Keep the existing juice layer (`AudioEngine`, Phaser particles) intact.
- Verification per task: `npm run build` + `npm run lint` clean, no console errors on the happy path.
- No new heavy dependencies. Fonts via the existing Google-Fonts `@import`.

---

### Task 1: Tokenize — Midnight Arcade palette, fonts, texture utilities

**Files:**
- Modify: `src/index.css` (`:root` block, `@import` fonts, `body`/`#root` backgrounds; add texture utility classes)
- Modify: `tailwind.config.js` (color + font token map)

**Produces:** CSS vars + Tailwind classes every later task consumes: `bg-bg`, `bg-surface-1`, `text-txt`, `text-accent`, `bg-accent`, `text-gold`, `border-hair`, fonts `font-display`/`font-body`/`font-mono`, and utility classes `.grain`, `.material`, `.material-metal`.

- [ ] **Step 1: Replace the font import** (top of `src/index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Inter:wght@400;500;600&family=Roboto+Mono:wght@400;500&display=swap');
```

- [ ] **Step 2: Replace the `:root` palette** with Midnight Arcade tokens

```css
:root {
  --bg: #0E1117;
  --bg-deep: #0A0B12;
  --surface-1: #171B24;
  --surface-2: #1C212C;
  --border: #262B36;
  --hairline: rgba(255, 255, 255, 0.06);
  --text: #E7EAF0;
  --text-sub: #8A93A6;
  --text-muted: #5C6373;
  --accent: #6C5CE7;
  --accent-deep: #4B3FB0;
  --gold: #F5C451;
  --gold-deep: #C9973A;
  --win: #34C77B;
  --danger: #E24B4A;
  --info: #378ADD;
}
```

- [ ] **Step 3: Update `body` + `#root` backgrounds** — suede image base + indigo depth, retire the red glow

```css
body {
  margin: 0;
  min-height: 100%;
  overscroll-behavior: none;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text);
  background-color: var(--bg-deep);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#root {
  width: 100%;
  max-width: 390px;
  min-height: 100dvh;
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;
  background-color: var(--bg);
  background-image: url('/assets/midnight-bg.webp');
  background-size: cover;
  background-position: center;
}
```

- [ ] **Step 4: Update the desktop phone-frame** (`@media (min-width: 440px)` `#root`) — swap red border/glow for neutral

```css
  #root {
    min-height: min(844px, calc(100dvh - 40px));
    border-radius: 28px;
    border: 1px solid var(--hairline);
    box-shadow: 0 32px 64px rgba(0, 0, 0, 0.6);
  }
```

- [ ] **Step 5: Add texture utility classes** (append to `src/index.css`)

```css
.grain { position: relative; }
.grain::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
.material {
  background: var(--surface-1);
  box-shadow: inset 0 1px 0 var(--hairline), 0 6px 18px rgba(0, 0, 0, 0.35);
}
.material-metal {
  background: linear-gradient(180deg, #1e232e 0%, #141821 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.09), inset 0 -1px 0 rgba(0, 0, 0, 0.5);
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 6: Replace the Tailwind color/font map** in `tailwind.config.js`

```js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', 'bg-deep': 'var(--bg-deep)',
        'surface-1': 'var(--surface-1)', 'surface-2': 'var(--surface-2)',
        border: 'var(--border)', hair: 'var(--hairline)',
        txt: 'var(--text)', 'txt-sub': 'var(--text-sub)', 'txt-muted': 'var(--text-muted)',
        accent: 'var(--accent)', 'accent-deep': 'var(--accent-deep)',
        gold: 'var(--gold)', 'gold-deep': 'var(--gold-deep)',
        win: 'var(--win)', danger: 'var(--danger)', info: 'var(--info)',
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      maxWidth: { mobile: '390px' },
    },
  },
  plugins: [],
}
```

- [ ] **Step 7: Optimize the background** — produce the webp the CSS references

```bash
node -e "const s=require('sharp'); s('public/assets/midnight-bg.png').resize(780).webp({quality:82}).toFile('public/assets/midnight-bg.webp').then(r=>console.log('webp',r.size,'bytes'))"
```

- [ ] **Step 8: Verify** — `npm run build` (clean), `npm run lint` (clean), `npm run dev` → app loads on the dark suede background, no red remnants, no console errors. **Checkpoint for Sachit.**

> After this task the app will look partially unstyled (components still reference old class names like `bg-primary`). That is expected — Tasks 2-6 reskin each surface onto the new tokens. Old token names (`--bg-primary`, `--purple-primary`, etc.) are intentionally removed so any missed spot shows up loudly.

---

### Task 2: Shared UI primitives — Button, Input, Modal, + new Spinner & Badge

**Files:**
- Modify: `src/components/ui/Button.jsx`, `src/components/ui/Input.jsx`, `src/components/ui/Modal.jsx`
- Create: `src/components/ui/Spinner.jsx`, `src/components/ui/Badge.jsx`, `src/components/ui/Chip.jsx`, `src/components/ui/Divider.jsx`

**Interfaces produced:**
- `Button({ variant='primary'|'gold'|'ghost', loading=false, pulse=false, ...props })` — `primary` variant carries an ~8% ghost-suit (♠) in the corner; other variants stay clean.
- `Spinner({ size=16, variant='ring'|'chip', className })` — `ring` = SVG arc; `chip` = spinning CSS poker-chip for casino contexts.
- `Badge({ kind='hot'|'new'|'soon' })` — pill.
- `Chip({ size=18 })` — CSS poker-chip coin (rings + dashed edge, gold). Used wherever money shows.
- `Divider({ label })` — art-deco rule + center ♦ for headers/modal titles.
- `Modal({ isOpen, onClose, title, children })` — Midnight surface; title uses `Divider`.

**Casino motifs (from `casino-lab.html`, spec §2):** recipes for `Chip`, `Divider`, ghost-suit, and the spinning-chip are in `casino-lab.html` — copy the exact CSS. Restraint: chip everywhere money shows; ghost-suit on primary CTA only.

- [ ] **Step 1: Create `Spinner.jsx`**

```jsx
export default function Spinner({ size = 16, className = '' }) {
  return (
    <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
```

- [ ] **Step 2: Create `Badge.jsx`**

```jsx
const STYLES = {
  hot: { bg: 'var(--danger)', fg: '#fff', label: 'HOT' },
  new: { bg: 'var(--accent)', fg: '#fff', label: 'NEW' },
  soon: { bg: 'var(--surface-2)', fg: 'var(--text-sub)', label: 'SOON' },
}
export default function Badge({ kind }) {
  const s = STYLES[kind]
  if (!s) return null
  return (
    <span style={{ background: s.bg, color: s.fg }}
      className="px-2 py-0.5 rounded-full text-[10px] font-display font-semibold tracking-wide">
      {s.label}
    </span>
  )
}
```

- [ ] **Step 3: Reskin `Button.jsx`** — keep its existing click-sound/`active:scale-95`/`pulse` behavior; replace color logic with three token variants and add a `loading` state that renders `<Spinner>` and disables the button. Variants: `primary` = `bg-accent text-white`, `gold` = `bg-gold text-[#3a2c05]`, `ghost` = `bg-transparent border border-hair text-txt`. All: `rounded-xl font-display font-semibold`, `inset 0 1px 0 rgba(255,255,255,.2)` highlight via a `material`-style inline shadow. When `loading`, show `<Spinner size={16} className="text-current" />` before the label and set `disabled`.

- [ ] **Step 4: Reskin `Input.jsx`** — `bg-surface-1 text-txt placeholder:text-txt-muted border border-border focus:border-accent` + focus ring `0 0 0 3px rgba(108,92,231,.25)`; error state uses `border-danger`. Keep the existing `error` prop.

- [ ] **Step 5: Reskin `Modal.jsx`** — backdrop `rgba(0,0,0,.6)`; panel uses the `material grain` classes, `rounded-2xl`, `border border-hair`; title `font-display text-txt`; close (X) button ≥44×44 with `aria-label="Close"`.

- [ ] **Step 6: Verify** — build + lint clean; render `<Spinner/>` and `<Badge kind="hot"/>` on the login page temporarily to eyeball, then remove. **Checkpoint for Sachit.**

---

### Task 3: Login — reskin + Remember Me + Forgot Password + error/loading states

**Files:**
- Modify: `src/pages/Login.jsx`, `src/pages/Login.css`

**Consumes:** `Button` (with `loading`), `Input`, `Modal` from Task 2.

- [ ] **Step 1: Reskin the page** — in `Login.css`, replace the red `casino-bg` with the embossed casino-motif hero background `url('/assets/login-bg.webp')` (`background-size: cover`), plus a `rgba(10,11,18,.45)` scrim for text legibility. JUWA logo (`/assets/juwa-logo.png`) centered top; heading in `font-display`.
- [ ] **Step 2: Add Remember Me** — a controlled checkbox (`useState`) styled with `accent-color: var(--accent)`; label `text-txt-sub`. On submit, if checked, persist only the username (not password/token) to `localStorage` under `juwa_remember_user`; prefill it on mount.
- [ ] **Step 3: Add Forgot Password** — a text button that opens a `Modal` titled "Reset password" with body: "Contact your vendor to reset your password." Single OK button.
- [ ] **Step 4: Distinct errors** — extend the mock in `Login.jsx`: username `suspended` → throw `Error('Account suspended')`; anything else wrong → `Error('Invalid credentials')`. Render the thrown message in the existing red banner (`bg-danger/15 text-danger`).
- [ ] **Step 5: Loading state** — set a `loading` state around the mock auth (add a 400ms delay so it's visible) and pass `loading` to the LOGIN `Button`; disable inputs while loading.
- [ ] **Step 6: Verify** — build + lint clean; in dev: `demo/demo123` → lobby; `suspended/x` → "Account suspended"; wrong → "Invalid credentials"; Remember Me prefills on reload; Forgot Password modal opens; button shows spinner. **Checkpoint for Sachit.**

---

### Task 4: Lobby shell — reskin, working category filter, safe-area insets

**Files:**
- Modify: `src/pages/Lobby.jsx`, `src/components/lobby/TopBar.jsx`, `src/components/lobby/CategoryTabs.jsx`, `src/components/lobby/LobbyMenuSheet.jsx`

**Consumes:** tokens from Task 1; `Modal` from Task 2.

- [ ] **Step 1: Reskin TopBar** — `material` bar; avatar circle `bg-accent`, **tappable (≥44×44) → opens the Profile & Account panel** (Step 5); player id `font-mono text-txt-muted`; balance pill = **`<Chip>` poker-chip** + `font-mono text-gold` (money = gold + chip). Withdraw/Cashback/menu icon buttons ≥44×44. Restyle the existing inline Withdrawal + Cashback modals to the new `Modal`.
- [ ] **Step 2: Reskin CategoryTabs** — active pill `bg-accent text-white`, inactive `bg-surface-1 text-txt-sub`; pills ≥44px tall; horizontal scroll with `-webkit-overflow-scrolling: touch`.
- [ ] **Step 3: Wire real filtering** — in `Lobby.jsx`, filter the games array by `activeCategory` (see Task 5 for the `category` field on each game); `all` shows everything; `favorite` shows games flagged `favorite` (mock: none yet → empty state "No favorites yet — tap the heart on any game.").
- [ ] **Step 4: Safe-area insets** — add `padding-top: env(safe-area-inset-top)` to TopBar and `padding-bottom: env(safe-area-inset-bottom)` to the scroll area; confirm no horizontal overflow.
- [ ] **Step 5: Turn LobbyMenuSheet into the Profile & Account panel** — slide-up panel uses `material grain`. Add an **identity header** at the top: avatar (`bg-accent`, initials), `username` (`font-display`), `player_id · vendor_id` (`font-mono text-txt-muted`), and the balance (coin + `font-mono text-gold`) — all from `authStore.player` + `gameStore.balance`. Below a `border-hair` divider, the action rows (tokens): Withdrawal, Cash Back, Leaderboard, **Change Password** (icon `🔑`, opens the Task 6 modal), and **Log out** (calls `authStore.logout()`, danger-tinted). Opened by tapping the TopBar avatar (Step 1).
- [ ] **Step 6: Verify** — build + lint clean; dev: tabs filter the grid, empty favorites message shows, TopBar modals styled, no overflow at 390px. **Checkpoint for Sachit.**

---

### Task 5: Game tiles — category data, thumbnails, badges, "coming soon"

**Files:**
- Modify: `src/components/lobby/GameGrid.jsx`, `src/components/lobby/GameTile.jsx`

**Consumes:** `Badge` from Task 2.

- [ ] **Step 1: Add `category` + `playable` to each game** in `GameGrid.jsx`'s games array — the one real game (`magic_wheel_7s` / jungle) gets `category:'slots', playable:true`; tag the rest `slots`/`fishing`/`other` per their names and `playable:false`. Example shape:

```js
{ id: 'magic_wheel_7s', name: 'Jungle Treasure', category: 'slots', playable: true, badge: 'hot', image: '/assets/logo.png' },
{ id: 'ocean_treasure', name: 'Ocean Treasure', category: 'fishing', playable: false, badge: null, image: null },
```

- [ ] **Step 2: Reskin `GameTile.jsx`** — `rounded-xl material` tile; thumbnail fills; name `font-body text-txt`; `<Badge>` top-right when `badge` set. Keep the existing hover shimmer/beep.
- [ ] **Step 3: "Coming soon" state** — when `!playable`: overlay `bg-bg-deep/70`, a centered `<Badge kind="soon"/>`, tile not clickable (`aria-disabled`), no navigation. Playable tiles navigate to `/game/:id` as today.
- [ ] **Step 4: Thumbnail fallback** — when `image` is null, render a token-colored placeholder block with the game's initial (so the grid never shows broken images).
- [ ] **Step 5: Verify** — build + lint clean; dev: only Jungle Treasure is playable, others show SOON and don't navigate; badges render; filter by FISHING shows the fishing games. **Checkpoint for Sachit.**

---

### Task 6: Missing modals — Leaderboard + Change Password

**Files:**
- Create: `src/components/lobby/Leaderboard.jsx`, `src/components/lobby/ChangePassword.jsx`
- Modify: `src/pages/Lobby.jsx` (wire open state), `src/components/lobby/LobbyMenuSheet.jsx` (Leaderboard row already exists; Change Password row added in Task 4)
- Modify: `src/services/api.js` (add mock `getLeaderboard()` + `changePassword()` seams)

**Consumes:** `Modal`, `Button`, `Input` from Task 2.

- [ ] **Step 1: Mock seams in `api.js`**

```js
export async function getLeaderboard() {
  await new Promise((r) => setTimeout(r, 300))
  return [
    { rank: 1, username: 'DragonKing', points: 184200 },
    { rank: 2, username: 'LuckyNova', points: 152980 },
    { rank: 3, username: 'ReefRunner', points: 141050 },
    { rank: 4, username: 'GoldenApe', points: 98760 },
    { rank: 5, username: 'MysticSpin', points: 87340 },
  ]
}
export async function changePassword({ current, next }) {
  await new Promise((r) => setTimeout(r, 300))
  if (!current) throw new Error('Enter your current password')
  return { ok: true }
}
```

- [ ] **Step 2: Create `Leaderboard.jsx`** — `Modal` titled "Leaderboards" (crown icon) + subtitle "Ranking by betting · updated hourly". On open, call `getLeaderboard()` (show `<Spinner>` while loading). Rows: rank (gold/silver/bronze dot for 1-3, else number), username, `font-mono` points. Pin current player at the bottom: "Your ranking: 100+". X to close.
- [ ] **Step 3: Create `ChangePassword.jsx`** — `Modal` titled "Change password" with three `Input`s (current, new, re-enter, all `type=password`). Validation: new ≥6 chars, new === re-enter, else inline `text-danger` message. CONFIRM `Button variant="primary" loading`. On success call `changePassword()`, then `authStore.logout()` → redirect to `/login`.
- [ ] **Step 4: Wire open state** in `Lobby.jsx` — `leaderboardOpen` / `changePwOpen` `useState`, passed to `LobbyMenuSheet` handlers and rendered.
- [ ] **Step 5: Verify** — build + lint clean; dev: menu → Leaderboard shows ranked rows + your row; menu → Change Password validates (mismatch + <6 blocked), success logs out to login. **Checkpoint for Sachit.**

---

### Task 7: States, transitions, and the lobby↔game seam

**Files:**
- Modify: `src/pages/Lobby.jsx`, `src/pages/Game.jsx`, `src/components/game/GameHUD.jsx`, `src/index.css`

- [ ] **Step 1: Route transition** — add a 180ms fade class (`.route-fade` keyframe in `index.css`) applied on `Lobby` and `Game` mount so lobby↔game isn't a hard cut. Respect `prefers-reduced-motion` (guard already added in Task 1).
- [ ] **Step 2: Insufficient-balance + spin guard** — confirm `GameHUD` shows a friendly inline message (token `text-danger`) on insufficient balance and blocks double-spin via the existing `isSpinning` flag; restyle any leftover old-token colors.
- [ ] **Step 3: Loading states audit** — ensure every async action (login, leaderboard, change password) shows a `Spinner`; no raw thrown strings surface to the user.
- [ ] **Step 4: Verify** — build + lint clean; dev: lobby↔game fades; spin with 0 balance shows the message, no double-spin; no console errors across the full loop. **Checkpoint for Sachit.**

---

### Task 8: Asset cleanup + optimization

**Files:** `public/` (deletions), `public/assets/` (optimized bg)

- [ ] **Step 1: Remove dead generations** (unreferenced — verified via grep in the spec)

```bash
cd /Users/sachitghimire/Desktop/Game/sweepstakes-app
git rm public/hf_20260702_*.png
```

- [ ] **Step 2: Retire the red background** — remove `public/assets/casino-bg.png` once Task 3/4 no longer reference it (grep to confirm zero refs first).

```bash
grep -rn "casino-bg" src/ && echo "STILL REFERENCED — fix before deleting" || git rm public/assets/casino-bg.png
```

- [ ] **Step 3: De-dupe logos** — confirm which `logo.png` the app uses (`grep -rn "logo.png" src index.html`), keep the referenced/optimized one, remove the 1.7MB duplicate.
- [ ] **Step 4: Confirm `midnight-bg.webp`** exists and is <200KB (from Task 1 Step 7); the source PNG stays only in `generated/`.
- [ ] **Step 5: Verify** — `npm run build` clean; dev: no broken images; `du -sh dist/` noticeably smaller. **Checkpoint for Sachit.**

---

### Task 9: 390px polish pass + Definition-of-Done sweep

**Files:** any with visual defects found.

- [ ] **Step 1: Walk the DoD checklist** (spec §9) gate by gate at 390×844 (dev responsive + one real device if possible), fixing drift: stray old-token colors, spacing/type inconsistencies, missing focus states, icon-button `aria-label`s.
- [ ] **Step 2: Full-loop smoke test** — log in (`demo/demo123`) → browse + filter lobby → open Withdrawal, Cashback, Leaderboard, Change Password → play the slot → back to lobby → log out. Zero dead buttons, zero unstyled surfaces, zero console errors.
- [ ] **Step 3: Final `npm run build` + `npm run lint`** clean; tick every DoD checkbox in the spec. **Final checkpoint for Sachit.**

---

## Self-review notes

- **Spec coverage:** every spec §3 gap and §9 DoD gate maps to a task (identity → T1-T5; Login extras → T3; Leaderboard/Change Password → T6; filtering → T4/T5; coming-soon → T5; states/Spinner/transitions → T2/T6/T7; mobile → T4/T9; cleanup/optimize → T8; polish/demo → T9).
- **Backend seams:** leaderboard + change-password mocks live in `api.js` (T6) — swappable later. No task wires a real backend (out of scope, per spec §7).
- **Type consistency:** `Button` gains `loading`/`variant` in T2 and is used with those props in T3/T6; `Badge kind` values `hot|new|soon` are produced in T2 and consumed in T5; `getLeaderboard`/`changePassword` defined in T6 Step 1 and used in T6 Steps 2-3.
