# Memory

> My running memory across sessions. I read this at the start of every session and
> write to it as things happen, so I never lose track of where projects stand.

## How I use this file

- **Read it first** every session, before starting work.
- **Append** new entries to the **Log** (newest at the bottom), dated `YYYY-MM-DD`.
- **Update in place** when something changes an existing fact (e.g. a project's
  status) instead of adding a contradictory new entry. Keep the current truth in the
  relevant section; use the Log for the history of how we got there.
- Keep entries short and factual. Decisions, state, open threads, preferences.
- When a project's details get long, give it its own section under **Projects**.
- This is not a diary — record what helps continuity, not everything said.

---

## Standing facts

- User: Ankit (see `about-me.md`).
- Cares deeply about design but is **not a professional designer**. IT-educated, not a
  deep coder. Wants to be a top "vibe coder" whose edge is **beautiful software design**.
  Knows basics of UI/UX; design tools: Canva, Photoshop, Figma.
- Runs a new solo IT company; plans to build many apps/websites using Claude.
- **My role:** enhance his vision — actively help with design, not just code. Do the
  design research for him (Mobbin, Awwwards, Dribbble, Pinterest, etc.), propose concrete
  ideas/options, treat visual polish as first-class, and build it. He steers; I scout,
  propose, and build.
- Preference: concise, direct, non-AI writing (see `writing-rules.md`).
- Primary machine: macOS, projects under `~/Desktop/Game/`.

## Projects

### sweepstakes-app (JUWA) — ACTIVE
- **2026-06-27 PIVOT:** Game screen is now a **landscape "Jungle Treasure" slot** that
  BLENDS two asset packs (Ankit's call, since Higgsfield credits were limited): jungle
  CHROME (background, monkey, wood frame, side buttons, title, readouts, payline badges)
  extracted from `jungle slots pngs/jungle slot assets.psd` via ag-psd + @napi-rs/canvas +
  sharp, and CraftPix coin/gem SYMBOLS (`craftpix-net-...-currency-...` pack) on the reels.
  Login + Lobby are still PREMIUM DARK GOLD (portrait) — not yet reconciled with the jungle
  game; open question whether to re-skin them or keep the gold→jungle transition.
- Built assets live in `public/assets/jungle/` (background.png, chrome_plate.png — full UI
  with empty reel cells, 1920x1080) and `public/assets/symbols/` (coin, coins, bars,
  emerald, ruby, diamond, crown, chest .png). Asset-prep scripts were one-off node+sharp.
- Game runs in Phaser at 1920x1080 (Scale.FIT), reel window x320 y235 cell257x159 5x3.
  Layering: bg(0) → plate(6) → coins(7) → overflow covers bg+plate(8) → readout text(9) →
  zones(10). NOTE: Container.setMask does NOT work in this Phaser 4 build — used cropped
  background+plate "cover strips" above the reels to hide spin overflow instead of a mask.
  SPIN + bet zones read/write `useGameStore`; live Credits/Won/Bet text on the wood panels.
  `window.__slotScene` exposed in DEV for testing (synthetic pointer events don't reach
  Phaser input in the headless preview; drive via `__slotScene.requestSpin()`).
- VERIFIED in-browser (landscape 812x420): spins, reels align in cells, Credits deduct,
  overflow contained. Build clean.
- TODO next: wire remaining buttons (Auto/Info/Lines/Spines), decide login/lobby
  consistency.
- **2026-06-27 (round 2):** Per Ankit's feedback, refined the game: (1) regenerated
  chrome_plate WITHOUT the monkey; monkey now a separate sprite that pops up from the
  bottom-left only on a WIN (cheerMonkey tween) then slides away. (2) Bet model is now
  lines × line-bet: `lines` added to gameStore; the 20 payline number badges are
  clickable zones that set the line count → raises Total bet (verified: badge 5 → total
  2.00). (3) Result POPUP after every spin ("WIN +X" gold / "−X" loss) via
  showResultPopup. (4) Bigger symbols (SYMBOL_SIZE 165). Scene now owns balance/win/
  spinning + readouts (Lines/Line bet/Total bet/Won/Credits); GameHUD only plays win SFX.
  Ankit exported clean individual assets to project root (monkey.png, spin button.png,
  side buttons.png, table.png, title.png, etc.) — used monkey.png. All verified
  in-browser, build clean.
- NOTE: Higgsfield image-gen MCP is now CONNECTED (mcp__17cf...__generate_image etc.) —
  available if we want generated art later; not needed for the jungle+coins blend.
- **2026-06-27 (round 3):** Fixed reel geometry — measured the frame's dark window as
  y236–722 (h486); set REEL_Y0=236, CELL_H=162 so 3 rows fill the full window, and
  SYMBOL_SIZE=132 (< cell) so rows have clear gaps (were touching at 165). Loss popup is
  now bold RED (#FF5347) instead of muted pink; confirmed popup fires on EVERY spin
  (win=gold "WIN +x", loss=red "−x" stake). Verified in-browser, build clean.
- **2026-06-27 (round 4):** (1) Wired side buttons: Auto Start = auto-spin toggle (green
  glow ring, repeats until off / out of balance), Info = paytable modal (8 symbols ×mult),
  Lines = cycle line presets [1,5,10,15,20]. Button hit-zone centers measured from PSD
  side-buttons group. (2) SPIN press animation (separate jungle_spin sprite at 965,1044,
  depth 9, scale-yoyo on tap) + reel-stop pop (landed symbols scale-bounce). (3) Re-skinned
  LOGIN + LOBBY to the jungle look: both now use /assets/jungle/background.png (amber+green)
  with a dark overlay; TopBar avatar=green→gold, balance pill warm gold, menu warm; GameTile
  wood-brown gradient + gold border + warm glows. JUWA brand + 777 medallion kept on login.
  All verified in-browser, build clean. App now feels cohesive login→lobby→game.
- **2026-06-27 (round 5):** Fixed monkey being clipped to just its head — it was depth 7,
  below the bottom overflow cover (depth 8). Moved monkey to depth 9, bottom-anchored
  (origin 0,1, scale 0.82), slides up from below; full body now shows on a win. Also
  removed the deprecated Phaser `resolution` config prop (could mis-scale on high-DPI).
  NOTE: at large desktop widths the leftover #root phone-frame adds page height so a
  full-page screenshot shows the fixed .game-viewport in the top portion — NOT a user bug
  (game-viewport is position:fixed and covers the real viewport); verified game fills the
  screen at landscape sizes. Possible future polish: suppress #root/body scroll on the
  game route.

- Cyberpunk/neon slot machine web app. Stack: React 19, Vite 8, Tailwind v4,
  Phaser 4, Howler, Zustand, react-router 7.
- **Done:** full "juice"/game-feel layer — `AudioEngine.js` (procedural Howler audio:
  BGM, SFX, game sounds), tactile UI (neon-pulse, click sounds, tile shimmer),
  Phaser visual impact (symbol explosions, camera shake on big wins, jackpot
  anticipation on reels 4 & 5, reel thuds).
- **State:** logic is client-side mock (no backend). Full detail in project root
  `PROGRESS.md`.
- **Open threads:** optional mute/volume HUD toggle; decide mock vs. real backend;
  real audio/art assets; run/build access via app restart was chosen.

## Open questions for Ankit

- **Git account:** machine has global git as Sachit Ghimire / sachit.ghimire@quicktrackinc.com;
  `gh` logged in as **Sachit-SG**; SSH auth as **Sachit-99** — pick one before first push.
- Hosting, project management.
- Timezone.

---

## Log

- **2026-06-25** — Built the juice/game-feel feedback layer for sweepstakes-app
  (AudioEngine, tactile UI, Phaser impact). Wrote `PROGRESS.md` handoff note.
- **2026-06-25** — Ankit chose to restart the app to give me shell/run access to the
  project (pending restart).
- **2026-06-25** — Created the `About Me` folder with `about-me.md`, `writing-rules.md`,
  and this `memory.md`; wired them into `CLAUDE.md` so they're read every session.
- **2026-06-25** — Ankit filled in his profile: designer-led vibe coder, IT background,
  new solo IT company, design edge, Canva/Photoshop/Figma. Sweepstakes app confirmed as
  a learning project. Updated `about-me.md` and standing facts accordingly.
- **2026-06-25** — Ankit corrected the working division: he is NOT a professional
  designer. He wants me to ACTIVELY help with design and enhance his vision — including
  doing extensive design research (Mobbin, Awwwards, Pinterest, etc.) and proposing
  ideas, not just executing code. Rewrote the Working division section to match.
- **2026-06-25** — Researched the sweepstakes genre (Juwa, Orion Stars, Fire Kirin).
  Finding: competitors win on game volume, not taste — their look is cluttered/chaotic,
  so a well-designed entry stands out. Ankit rejected the old purple-neon look.
  DECIDED: visual direction = "premium dark gold" (near-black + real gold, emerald/ruby
  accents); art pipeline = AI-generated (he refines in Canva/Photoshop). Plan is
  step-by-step. Building login first.
- **2026-06-25** — Step 1 DONE: swapped the whole palette to dark gold via the `:root`
  CSS variables in `src/index.css` (purple-* tokens repurposed as bronze→gold; green-cta
  now gold; body glow + desktop frame + neon-pulse retinted). Propagates to all screens.
- **2026-06-25** — Rebuilt the LOGIN experience (`Login.jsx` + `Login.css`): removed the
  card/chip/dice clutter and slot emoji; added a gold 777 medallion (CSS placeholder for
  AI art) with animated sheen, a gradient JUWA wordmark + gold rule, drifting gold embers,
  and a gold CTA. Verified in-browser at mobile size — looks premium. Build passes.
  NEXT: step 2 = generate real art (slot symbols + tile thumbnails), then rebuild the
  Lobby (jackpot hero banner, gold tiles, bottom nav) per the approved mockup.
- **2026-06-25** — Ankit changed the art direction from 2D to **3D** (premium dark-gold
  rendered symbols/emblems). Refactored the Phaser slot scene (`SlotScene.js`) to the
  dark-gold palette: removed all purple/navy (NEON_PURPLE etc.), gold cabinet frame +
  warm dark background + gold glows, harmonized symbol colors (gold core, emerald/ruby
  accents), gold fallback cells. Also removed the "PHASER ENGINE ONLINE" debug banner.
  Verified in-browser: slot game now matches the login. Build clean. Symbol cells are
  still placeholder gold tiles pending the 3D symbol art (step 2).
- **2026-06-25** — Reimagined the slot-game background ("The Gold Vault") after web
  research (Zvky game-art, parallax/depth guides). Replaced the flat gradient+2-circles
  with layered depth in `SlotScene.js drawBackground()`: base gradient → soft gold
  god-rays fanning from above the cabinet → warm focal light pool (swells on Big Win) →
  far slow gold bokeh layer → radial edge vignette (pulls focus to the reels). Added
  helpers createRadialTexture / createGodRays / createFarBokeh (procedural, no image
  assets). Verified in-browser, no new errors. Themed alternates offered but not chosen:
  "Dragon's Hall" (red/gold) and "Cosmic Gold" (nebula). Possible later upgrade: a
  rendered 3D backdrop image behind the cabinet.
- **2026-06-27** — Handoff to Cursor (Ankit ran out of Claude tokens). No git repo yet.
  Build verified clean. Git identity on machine: Sachit Ghimire; GitHub CLI = Sachit-SG,
  SSH = Sachit-99. Source asset folders at project root (~115MB) should stay out of git;
  processed assets live in `public/assets/`.
- **2026-06-25** — Hit a tooling limit: this session has NO image-generation model, so I
  can't produce true 3D renders. Ankit is installing the **Higgsfield skills**
  (`npx skills add higgsfield-ai/skills` → registers `/higgsfield:generate`, needs
  Higgsfield CLI + `higgsfield auth login`, paid credits) to unblock art generation, then
  restarting the session so the skill loads. NEXT SESSION: if `higgsfield:generate` is
  available, generate art step by step — (1) the "Gold Vault" BACKDROP first: one
  390×600 portrait plate to sit behind the cabinet in `public/assets/`, confirm it looks
  right, then (2) the 7-symbol SET on transparent bg (~256×256): `7`, `777`, `BAR`,
  `bell`, `cherry`, `diamond`, `wheel` → `public/assets/symbols/`, matched lighting,
  premium dark-gold with emerald/ruby accents only. Wire each in (SlotScene.js already
  has the fallback/texture loader; symbol PNG keys: symbol_7/symbol_bar/symbol_cherry,
  others currently null in SYMBOL_DEFS — add keys + LOCAL_ASSETS entries as art lands).
