# JUWA Frontend — "Midnight Arcade" design spec

**Date:** 2026-07-03
**Goal:** Complete the JUWA frontend — a coherent visual identity plus every screen/flow — with mock data where a backend isn't wired yet.
**Status:** Design approved (direction + texture). Awaiting spec sign-off, then implementation plan.

---

## 1. Vision

JUWA is a **platform that hosts many games**, not a game itself. The shell must read as premium, calm, and neutral so that colorful game art is the star. The genre (Juwa, Orion Stars, Fire Kirin) is loud and cluttered; our edge is restraint.

**Two-tier identity:**
- **Platform** (login, lobby, profile, wallet) = Midnight Arcade — neutral dark, one accent, gold only for money.
- **Each game** keeps its own theme. The one built game (jungle Slot) stays jungle. The platform never adopts a single game's theme.

**Guiding line:** premium = *material and depth done quietly*, never loud color or glow. Garish is loud color; premium is quiet material.

---

## 2. Visual system — "Midnight Arcade"

### Palette

```
--bg            #0E1117   near-black base (cool indigo undertone)
--bg-deep       #0A0B12   edges / vignette
--surface-1     #171B24   cards, bars
--surface-2     #1C212C   raised / hover
--border        #262B36   dividers
--hairline      rgba(255,255,255,.06)   top highlight on material

--text          #E7EAF0   primary
--text-sub      #8A93A6   secondary
--text-muted    #5C6373   hints, disabled

--accent        #6C5CE7   violet — PRIMARY actions, active nav, focus (the platform signature)
--accent-deep   #4B3FB0   pressed / shadow
--gold          #F5C451   MONEY ONLY — balance, winnings, "collect"
--gold-deep     #C9973A
--win           #34C77B   positive money events (win, cashback credited)
--danger        #E24B4A   loss flash, errors, destructive
--info          #378ADD   online dots, info tooltips
```

Rule: **gold appears only where money appears.** Violet is the only UI accent. No third decorative color.

### Typography

- **Display / headings:** `Sora` (modern geometric sans — sophisticated, contemporary).
- **Body / labels:** `Inter`.
- **Numbers (balance, bet, win):** monospace with tabular figures (`Roboto Mono`) so digits don't jitter when counting up.

### Texture / material — **hybrid** (locked)

- **Base background:** the generated suede image `public/assets/midnight-bg.png` (optimize to ~150KB webp). Calm, organic backdrop.
- **Everything on top = CSS:**
  - Cards/bars: `--surface-1` + `inset 0 1px 0 var(--hairline)` top highlight + soft inner shadow (felt) or fine repeating-line brushed-metal for premium panels.
  - Fine grain overlay (SVG `feTurbulence`, ~5% opacity) on large surfaces to kill "flat dead color."
  - Accents matte, never chrome/shiny. Subtle depth, no neon glow.
- Reference implementation: `texture-lab.html` (project root) — the CSS recipes live there.

### Casino motifs (tone-on-tone, restrained)

Casino character comes from *quiet material*, never loud color. Adopted set (reference: `casino-lab.html`):
- **Chip coin** — replace the plain gold dot with a CSS poker-chip (rings + dashed edge) **everywhere money shows** (balance pill, wins, collect). Biggest casino cue, still tasteful.
- **Backgrounds:** login/hero uses the embossed casino-motif image `public/assets/login-bg.webp` (suits/chips/art-deco); the lobby and content-heavy screens keep the calmer plain suede `midnight-bg.webp` so game tiles stay the star.
- **Art-deco divider** — faint gold rule + center diamond for section headers and modal titles.
- **Ghost-suit** — a single ~8%-opacity embossed suit tucked in the corner of the **primary CTA only** (not every button).
- **Spinning-chip loader** — the chip spins in casino contexts (spin/win); the plain `Spinner` stays for generic async (login, forms).
- **Restraint rule:** two–three motifs per screen, never all six. Buttons stay mostly clean.

### Motion

Keep the existing juice layer (audio, particles, jackpot anticipation) in the game. Platform motion is quiet: 150–200ms ease transitions, `active:scale-98` on taps, respect `prefers-reduced-motion`.

---

## 3. Screen inventory & gaps

Legend: ✅ done · 🔶 partial · ❌ missing

| Screen / flow | State | Work to complete |
|---|---|---|
| **Login** | 🔶 | Reskin to Midnight; add Remember Me, Forgot Password modal ("contact your vendor"), distinct errors (invalid vs suspended), loading state in button |
| **Lobby shell** (TopBar, categories, grid) | 🔶 | Reskin to Midnight; verify category filter actually filters (games need a `category` field); safe-area insets |
| **Game tiles** | 🔶 | Real thumbnails per game; HOT/NEW badge component; "coming soon" state for the 8 non-playable games |
| **Withdrawal modal** | ✅ | Restyle only |
| **Cashback modal** | ✅ | Restyle only |
| **Leaderboard modal** (Screen 5) | ❌ | Build: ranked rows, top-3 crowns, current-player row; mock data now, `GET /leaderboard` later |
| **Change Password modal** (Screen 4) | ❌ | Build: 3 fields, validation (min 6, match), success → logout; add to menu |
| **Profile & Account panel** | 🔶 | Tap avatar → slide-up panel: identity header (avatar, username, player ID, vendor), balance, then all account actions (Withdrawal, Cashback, Leaderboard, Change Password, **Logout**). Upgrades the existing `LobbyMenuSheet`. Mock player data now. |
| **Logout** | ✅ | Already a real system: `authStore.logout()` disconnects socket, clears session, redirects to `/login`. Restyle its button only. |
| **Slot game (jungle)** | ✅ | Leave as-is (its own theme). Only wire the platform↔game entry/exit transition |
| **Loading / errors** | ❌ | `Spinner` component; loading states on async actions; friendly error copy |
| **Nav** | ✅ (resolved) | Keep the drawer model — no bottom nav for MVP. Avatar tap opens the Profile & Account panel; that panel is the account hub. |

---

## 4. Components

**New:**
- `ui/Badge.jsx` — HOT / NEW / SOON pill.
- `ui/Spinner.jsx` — loading spinner (button + page variants).
- `lobby/Leaderboard.jsx` — leaderboard modal.
- `lobby/ChangePassword.jsx` — change-password modal.
- `lobby/GameComingSoon` state (can live in `GameTile`).

**Updated:** `Button`, `Input`, `Modal`, `TopBar`, `GameGrid`, `GameTile`, `CategoryTabs`, `Login`, `Lobby` — reskinned to Midnight tokens.

**Tokens:** centralize the palette above in `tailwind.config.js` + `index.css` custom properties, so every component reads tokens (no hardcoded colors). This is the single most important structural fix — it's what makes the whole reskin fast and consistent.

---

## 5. Assets

- **Add:** `public/assets/midnight-bg.png` (generated) → optimize to `midnight-bg.webp`.
- **Retire:** `public/assets/casino-bg.png` (red stock gradient — fights the direction).
- **Jungle craftpix pack** (`public/craftpix-895410-...`) → **game-only**. Not used by the platform. Keep for the jungle Slot's own UI if wanted.
- **Cleanup (dead weight, ~4.6MB):** remove the five unreferenced `public/hf_*.png` generation dumps; de-dupe the oversized `logo.png` copies. (Sachit commits.)
- Game tile thumbnails: generate/collect per game (8–10). Placeholder colored tiles until then.

---

## 6. Mobile specs

- Design at 390×844; portrait lock.
- Touch targets: SPIN ≥ 80×60, bet ± / icons ≥ 44×44 (Apple HIG).
- `overscroll-behavior: none`; `env(safe-area-inset-*)` padding for notched phones.
- Game canvas fills viewport, no chrome.

---

## 7. Out of scope (this pass)

- Real backend: auth, wallet, server-side RNG stay **mock**. Build the frontend so wiring them later is a drop-in (keep `api.js`/`socket.js` seams).
- Building the other 8 games. They show as "coming soon".
- Jungle Slot game internals (mechanics/art) — untouched beyond entry/exit transition.

---

## 8. Build order (high level — detailed plan follows in writing-plans)

1. **Tokens first** — palette + type + texture utilities into `index.css` / `tailwind.config.js`.
2. **Login** reskin + Remember Me + Forgot Password + errors.
3. **Lobby shell** reskin + category filtering + safe areas.
4. **Game tiles** — badges, coming-soon, thumbnails.
5. **Missing modals** — Leaderboard, Change Password.
6. **Loading/errors** — Spinner, states, transitions.
7. **Asset cleanup** + optimize `midnight-bg`.
8. **Polish pass** at 390px.

---

## 9. Definition of Done (acceptance checklist)

The frontend is complete when a person can log in, move through every screen and flow with no dead ends, and it looks premium on a real phone — on mock data, with backend seams ready.

**Gate 1 — Visual system, zero drift**
- [ ] Every color from a token; no hardcoded hex in components.
- [ ] Midnight Arcade consistent across Login, Lobby, all modals, game shell.
- [ ] No red `casino-bg` / purple-neon remnants; gold only on money; violet the only accent.
- [ ] Suede base + CSS material applied; no flat-dead surfaces.
- [ ] Sora / Inter / mono loaded and applied per hierarchy.

**Gate 2 — Flows work end-to-end (mock)**
- [ ] Login: valid → lobby; invalid + suspended errors; Remember Me; Forgot Password modal; button loading.
- [ ] Lobby: balance shows; category filter actually filters; grid scrolls.
- [ ] Tiles: thumbnails, HOT/NEW badges, "coming soon" on the 8 locked games; playable tile → game.
- [ ] Modals reachable + functional: Withdrawal, Cashback, Leaderboard, Change Password, Menu, Logout.
- [ ] Slot: enter → play → exit to lobby.
- [ ] No dead buttons/links anywhere.

**Gate 3 — States**
- [ ] Loading state on every async action.
- [ ] Error states (bad login, insufficient balance, mock network fail) with friendly copy — no raw errors.
- [ ] Empty states where relevant; double-spin guard.

**Gate 4 — Mobile quality**
- [ ] Correct at 390×844; portrait locked.
- [ ] Touch targets met (SPIN ≥ 80×60; controls/icons ≥ 44×44).
- [ ] Safe-area insets; no rubber-band scroll; no horizontal overflow.
- [ ] Verified in iOS Safari + Android Chrome (emulation OK).

**Gate 5 — Code health**
- [ ] Components read tokens; no duplicated color logic.
- [ ] Mock logic isolated behind `api.js` / `socket.js` seams (backend = drop-in later).
- [ ] `npm run build` + `npm run lint` clean; no console errors on happy path.
- [ ] Dead assets removed; images optimized (no multi-MB PNGs shipped).

**Gate 6 — Polish**
- [ ] Lobby ↔ game transitions.
- [ ] Consistent spacing / radius / type scale.
- [ ] Focus states; `prefers-reduced-motion` respected; labels on icon buttons.

**Gate 7 — Demo-ready**
- [ ] Full loop runs clean: log in (`demo/demo123`) → browse lobby → open each modal → play slot → log out.

**Explicitly NOT in "done":** real backend wiring; the other 8 games actually playable; final art for every game. Later phases.
