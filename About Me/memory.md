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
- **2026-07-02:** Ankit committed all prior work into 120c22e (working tree clean) and
  improved viewport scaling himself — Game.jsx now createPortal()s the .game-viewport to
  document.body to escape #root clipping (good fix for the earlier cut-off issue).
- **2026-07-02:** Renamed the app JUWA → "Slot" (index.html <title>, theme-color). Higgsfield
  image-gen now has plenty of credits (984, Ultimate plan). GENERATED the app LOGO via
  Higgsfield nano_banana_pro (jungle-slot vibe: wood-frame badge, green leaves, gold "SLOT"
  lettering, treasure, and the thumbs-up monkey mascot). Ankit picked option 3 (job
  edbe0723). White bg removed locally via edge flood-fill (sharp), trimmed → public/assets/
  logo.png + public/logo.png (favicon) + public/apple-touch-icon.png. Login now shows the
  logo (replaced the 777 medallion + JUWA wordmark). Verified in-browser. Old login-emblem
  CSS in Login.css is now unused (harmless). Not committed (Ankit commits).
- **2026-07-02 (BRAND RESTRUCTURE):** Ankit clarified the architecture — **JUWA is the
  PLATFORM** (profiles, credits, lobby); **Slot (jungle game) is one game inside it**. The
  monkey logo was wrongly used as the app logo. Redesign done: (1) JUWA logo = casino chip
  (Higgsfield, 3 options, Ankit picked chip 3: flat crimson/charcoal chip, gold rim, gold
  JUWA text) → public/assets/juwa-logo.png + favicons; app title back to "JUWA". (2) First
  navy/emerald casino backgrounds REJECTED ("too flashy/congested, colors don't match the
  chip — keep RED AND WHITE as primary"). Regenerated minimal deep-crimson bg (tone-on-tone
  suit motifs, thin white lines, ~70% clean space) → public/assets/casino-bg.png, used on
  login + lobby. (3) Palette tokens now red/white (bg #1c0a0e family, --red-primary
  #d32f3f, white text; gold kept ONLY for money/branding accents; headings white; CTA red
  with white text; neon-pulse red). (4) Lobby: TopBar has JUWA chip mark + red/white
  chrome; GameTile red/white with `image` prop — Jungle Slot tile (renamed from "Magic
  Wheel 7s") shows the monkey Slot logo. Ankit had added a Coming Soon gate for
  non-playable tiles (kept). GOTCHA: a CSS comment containing "purple-*/" terminated the
  block comment early and broke the dev server (postcss "Unknown word tokens") while
  `npm run build` still passed — beware `*/` inside CSS comments. All verified in-browser.
  DESIGN RULE going forward: platform = red/white/chip casino brand; each game keeps its
  own theme inside.

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

### 2026-07-03 — Installed the `watch` skill (from claude-watch repo) into the desktop app
- Ankit wanted the `claude-watch` skill (github.com/taoufik123-collab/claude-watch). It's
  built for the Claude Code **CLI** (`/plugin marketplace add ...`), which the desktop
  (Cowork) app doesn't support — `/plugin` returns "isn't available in this environment."
- Installed it manually instead:
  - `brew install ffmpeg yt-dlp` (were missing; now present).
  - Pinned the skill's Python scripts to a stable dir `~/.claude-watch/scripts/` and
    rewrote the 7 `${CLAUDE_SKILL_DIR}` refs in SKILL.md to `$HOME/.claude-watch`.
  - Registered a `watch` skill in the active desktop skills bucket at
    `~/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/9447f8bd.../feb1909a.../`
    (copied `skills/watch/`, added manifest entry; backup at `manifest.json.bak-before-watch`).
  - Ran `setup.py` → scaffolded `~/.config/watch/.env`. Status `needs_key`: all binaries
    OK, only optional Whisper key missing (only needed for caption-less videos).
  - Fallback `.skill` package saved to `~/Desktop/watch.skill`.
- ACTION for Ankit: fully quit + reopen the desktop app so it loads the new skill, then
  ask "watch this video: <link>". If it doesn't appear after restart (app may re-sync its
  skill list from server and drop the manual manifest entry), use the Desktop `watch.skill`
  or I can just run the pipeline on demand via `~/.claude-watch/scripts/watch.py`.

### 2026-07-03 — Skill-install location (the "one folder") + installed `prompt-master`
- **Where desktop-app skills live (the single folder):**
  `~/Library/Application Support/Claude/local-agent-mode-sessions/skills-plugin/9447f8bd-0589-477b-b547-d34058ee091f/feb1909a-46be-450d-94b1-3db6233e1106/skills/`
  All desktop skills sit here (pdf, docx, council, watch, prompt-master...). Register each
  by adding an entry to the sibling `manifest.json`. **Install every new skill HERE.**
- `~/.claude/skills/` is the **CLI-only** location — the desktop app does NOT read it. Don't
  put desktop skills there.
- Installed `prompt-master` (github.com/nidhinjs/prompt-master) into that folder: pure
  markdown (SKILL.md + references/, no scripts), added manifest entry. Generates optimized
  prompts for AI tools; only triggers when Ankit explicitly asks to write/fix/improve a prompt.
- Both `watch` and `prompt-master` need a full app restart (Cmd+Q + reopen) to appear.

### 2026-07-03 — CORRECTION: skills belong in `~/Desktop/Brain/Skills/`, install via Settings
- Ankit keeps a central **Brain** folder at `~/Desktop/Brain/` (README explains it):
  `Skills/` (.skill files), `Memory/`, `Instructions/`, `Documents/`. This is the "one
  folder" he meant.
- **Correct way to install a desktop skill:** put the `.skill` file in `~/Desktop/Brain/Skills/`,
  then upload it at **Settings → Capabilities → Skills**. This is the supported, durable path.
- Superseded my earlier note about hand-editing the app's `skills-plugin` manifest — I reverted
  that manual injection (restored manifest backup, removed the copied watch/prompt-master folders)
  because it's fragile (app re-syncs from server) and creates duplicates vs. the Settings upload.
- `Brain/Skills/` now holds: `council.skill`, `watch.skill`, `prompt-master.skill`. README updated.
- `watch` still depends on its scripts at `~/.claude-watch/` (SKILL.md points there) + ffmpeg/yt-dlp.

### 2026-07-03 — Reviewed 4 more skills/tools; installed only Elements of Style
- Ankit sent 4 more: `SawyerHood/dev-browser`, `obra/superpowers-marketplace`,
  `JuliusBrussee/caveman`, `supermemoryai/supermemory`. Assessed each:
  - **caveman** — behavior skill that makes replies terse/broken-grammar to cut ~65% output
    tokens. Ships a prebuilt `.skill`. Advised against (clashes with his clear-writing pref).
  - **dev-browser** — browser automation; needs `npm i -g dev-browser` + Playwright + Chromium
    + Rust daemon. Heavy + redundant with built-in browser tools. Advised skip.
  - **superpowers** — a marketplace bundle of mostly coder plugins (TDD, debugging, chrome,
    episodic-memory) + `elements-of-style`. Advised cherry-pick, not the whole bundle.
  - **supermemory** — NOT a skill: it's a memory/context engine (service + API + SDK) to plug
    INTO apps he builds. Different category; keep in mind for his products, not Brain/Skills.
- Ankit chose: **Elements of Style only**. Installed `writing-clearly-and-concisely.skill`
  (from github.com/obra/the-elements-of-style, pure markdown) into `~/Desktop/Brain/Skills/`.
  README updated. Brain/Skills now: council, prompt-master, watch, writing-clearly-and-concisely.

### 2026-07-03 — Reviewed 2 mega skill-collections; installed 2 design skills
- Ankit sent `alirezarezvani/claude-skills` (772 skills!) and `Jeffallan/claude-skills` (66).
  Both are huge unvetted grab-bags, mostly dev/framework specialists + generic business
  personas. Advised against bulk-installing; curated to his design-founder profile instead.
- Installed 2 (his pick) into `~/Desktop/Brain/Skills/`, both self-contained stdlib-Python,
  no pinning needed:
  - `apple-hig-expert.skill` — audits Apple-platform UI vs Human Interface Guidelines.
  - `a11y-audit.skill` — WCAG 2.2 accessibility scan+fix for frontends.
- Skipped the marketing ones and the other ~760. README updated.
- Brain/Skills now (6): council, prompt-master, watch, writing-clearly-and-concisely,
  apple-hig-expert, a11y-audit. Reminder: install each via Settings → Capabilities → Skills.

### 2026-07-03 — Set up Obsidian, connected to the Brain folder
- Ankit wanted Obsidian + Claude. Neither Obsidian nor any vault existed. Went with the
  simple shared-folder approach (not MCP): a vault is just a folder of .md files, so his
  existing `~/Desktop/Brain` becomes the vault — Obsidian gives the UI, Claude reads/writes
  the same files. Always in sync, no plugins/API keys.
- Installed Obsidian via `brew install --cask obsidian` (v1.12.7, /Applications).
- Added `export WATCH_VAULT_DIR="$HOME/Desktop/Brain"` to `~/.zshrc` so the `watch` skill
  auto-saves video notes into the Brain vault.
- REMAINING manual step for Ankit: in Obsidian → "Open folder as vault" → select
  `~/Desktop/Brain`. (Opened the app for him.)

### 2026-07-03 — Name = Sachit; automated Brain-reading every session
- His name is **Sachit** (primary); sometimes uses **Ankit** — same person. Updated
  `About Me/about-me.md` and saved to harness memory (`user-name.md`). Older About Me docs
  still say "Ankit" — that's him.
- Made the Brain workflow automatic:
  - SessionStart hook in `~/.claude/settings.json` auto-injects `Brain/Instructions/*.md` +
    `Brain/Memory/*.md` (backup at `settings.json.bak`).
  - Added the same to project `CLAUDE.md` (belt-and-suspenders) + a "Save-to-Brain" rule:
    on "save this to my Brain", write a clean note into Brain/{Memory|Documents|Instructions}.
  - Saved a `brain-workflow` feedback memory.

### 2026-07-03 — Installed superpowers curated subset (4 skills)
- From obra/superpowers (14-skill dev framework, CLI-oriented). Sachit chose the curated
  subset; installed the 4 self-contained methodology skills into `~/Desktop/Brain/Skills/`:
  `brainstorming`, `systematic-debugging`, `writing-plans`, `verification-before-completion`.
  Skipped the CLI-only ones (git-worktrees, subagent/parallel dispatch, dispatcher, etc.).
- Brain/Skills now 10 total: council, prompt-master, watch, writing-clearly-and-concisely,
  apple-hig-expert, a11y-audit, brainstorming, systematic-debugging, writing-plans,
  verification-before-completion. README updated. Install each via Settings → Capabilities → Skills.

### 2026-07-03 — JUWA frontend: design LOCKED (Midnight Arcade) + DoD
- Goal: complete the whole frontend (design + all screens/flows), mock data OK, backend seams ready.
- **Visual identity LOCKED = "Midnight Arcade"** (supersedes the old "premium dark gold"): neutral
  near-black platform (cool indigo undertone), ONE violet accent (#6C5CE7) for primary actions,
  **gold (#F5C451) ONLY for money** (balance/wins). Platform is NOT themed after any game; jungle
  stays inside the Slot game. Palette/tokens in the spec.
- **Texture = hybrid (LOCKED):** generated suede background (`public/assets/midnight-bg.png`, dark
  suede + indigo, from nano_banana_pro) as the base + CSS material (felt/brushed-metal/grain, matte
  accents, hairline highlights) on top. CSS recipes in `texture-lab.html`. Retire red `casino-bg.png`.
- **Fonts LOCKED:** Sora (display) + Inter (body) + Roboto Mono (numbers).
- Jungle craftpix pack (`public/craftpix-895410-...`) = GAME-ONLY, not platform.
- **Full design spec:** `docs/superpowers/specs/2026-07-03-juwa-frontend-midnight-arcade-design.md`
  — includes a 7-gate **Definition of Done** (acceptance checklist) Sachit signed off on.
- Next: writing-plans → implementation. Build order: tokens first, then Login, Lobby, tiles,
  missing modals (Leaderboard, Change Password), states/spinner, asset cleanup, 390px polish.
- Gen-assets archived in `generated/`; rule: always save generations locally (URLs expire).

### 2026-07-03 — Casino elements added to the Midnight Arcade design (tasteful, tone-on-tone)
- Sachit wanted a casino vibe. Approach: quiet material, never loud color. Adopted set:
  - **Chip coin** (CSS poker-chip) wherever money shows (balance/wins). Biggest cue.
  - **Backgrounds:** login/hero = embossed casino-motif image `public/assets/login-bg.webp`
    (generated, 58KB — suits/chips/art-deco); lobby + content screens = plain suede
    `midnight-bg.webp` (calmer, so game tiles pop). Raw in `generated/2026-07-03_casino-motif-bg_d5968049.png`.
  - **Art-deco divider** (gold rule + center ♦) on headers/modal titles.
  - **Ghost-suit** (~8% embossed ♠) on the PRIMARY CTA only.
  - **Spinning-chip loader** in casino contexts; plain ring Spinner for generic async.
  - Restraint rule: 2–3 motifs per screen, not all six.
- CSS recipes live in `casino-lab.html` (project root). Spec §2 + plan Task 2 updated
  (new components Chip.jsx, Divider.jsx; Spinner gets a 'chip' variant; Login bg; TopBar chip).
- Note: casino-motif bg job (d5968049) had completed — was not actually stuck; UI just lagged.

### 2026-07-03 — JUWA lobby rebuilt (Tasks 4+5) + apple-hig-expert audit → 100/100
- Sachit flagged the lobby looked "AI-built, no attention to detail" (red bleed, COMING SOON
  burying names, emoji tiles). Rebuilt the whole lobby on Midnight tokens with real craft:
  - Lobby.jsx: removed red casino-bg; suede #root shows through.
  - TopBar: material bar, avatar+id → Profile & Account panel, poker-Chip balance pill (gold mono).
  - CategoryTabs: violet active pill, material inactive, 44px targets, sentence case.
  - Profile panel (LobbyMenuSheet): identity header (avatar, username, id·vendor, Chip balance)
    + art-deco Divider + rows (Withdrawal, Cash back, Leaderboard, Log out danger). Change Password
    row still TODO in Task 6.
  - GameTile: material tile, Badge component, monogram placeholder (no emoji), coming-soon = dim +
    SOON badge with the game NAME still readable. Only Jungle Slot playable.
- Ran apple-hig-expert (the senior-review skill Sachit asked for): scored 60→100. Fixed:
  --text-muted #5C6373→#808995 (contrast 2.86→4.87), --danger #E24B4A→#E85A58 (error text),
  added --danger-strong #B23330 for HOT badge (white passes 6.16), category pills + profile
  button to 44px targets. Build + lint clean.
- Remaining: Task 6 (Leaderboard + Change Password real modals), Task 7 states/transitions,
  Task 8 asset cleanup, Task 9 polish/DoD sweep.

### 2026-07-03/04 — Tasks 6 & 7 done; jungle-game audit; QA-per-task adopted
- Task 6 DONE: Leaderboard.jsx + ChangePassword.jsx modals + api.js mock seams (getLeaderboard,
  changePassword); wired into TopBar + profile panel (Change Password row added). Build/lint clean.
- Task 7 DONE: lobby↔game route-fade (index.css .route-fade), fixed last stale tokens in
  SlotGame.jsx (text-gold-shine→text-gold, font-oswald→font-display). Fully migrated, 0 stale classes.
- NEW PROCESS (Sachit): QA check after EVERY task (build+lint+HIG/a11y audit+functional walk).
- JUNGLE GAME AUDIT (senior designer+eng): controls are baked into public/assets/jungle/chrome_plate.png
  with invisible hit-zones. Functional & kept: Spin, Auto Start, Info(paytable), Lines, Bet Max,
  Bet x Line, Back; readouts Lines/Line bet/Total bet/Won/Credits all live.
  DEAD/CLUTTER (painted, no logic): (1) "−" bubble top-left (no handler); (2) "Spines" button —
  TYPO for Spins + no handler; (3) bottom-right "Spins" readout plate — no value wired; (4) scrambled
  payline number badges (random 1-20, read as confetti; real slots use ordered lines). Redundancy:
  "Lines" appears 3× (round button + badges + readout). Root cause = free generic jungle UI kit;
  can't delete painted buttons in code. Options: A regenerate clean plate, B surgical PNG edit
  (sharp: paint over dead bits), C code-only mitigation (leaves painted dead buttons). Rec: B (or A).
  Remaining plan tasks after this: 8 asset cleanup, 9 polish/DoD.

### 2026-07-04 — Jungle game: clean frame + code-drawn controls (built blind, needs visual QA)
- Chose "regenerate clean plate". Generated clean jungle FRAME (no baked buttons/numbers):
  public/assets/jungle/frame-clean.png (raw in generated/2026-07-04_jungle-frame-clean_ba4f68d7.png).
- Measured reel window programmatically: (448,200)-(1475,838). Realigned reels: REEL_X0=448,
  REEL_Y0=200, CELL_W=205, CELL_H=213, SYMBOL_SIZE=150. Swapped jungle_plate → frame-clean.png.
- DELETED the scrambled payline BADGES (+ PANEL const). Controls now DRAWN IN CODE onto the empty
  rails/bar (SlotScene: makeControlButton + setupControls + new setupReadouts):
  LEFT rail (x157): INFO, AUTO. RIGHT rail (x1765): LINES(shows count), MAX, BET(shows line bet).
  BOTTOM bar (y940): CREDITS, BET(total), WIN readouts + SPIN sprite center (962,926). All wired to
  existing handlers; every button has a job. autoGlow ring kept.
- Build+lint clean (only pre-existing REEL_W unused warning). BUILT BLIND (preview MCP down) —
  needs Sachit to verify alignment in dev (localhost:5173) and report nudges. frame-clean.png is
  3.3MB → optimize in Task 8.

### 2026-07-04 — Jungle game feedback fixes (SPIN + manual bet)
- Frame + code-controls rebuild VERIFIED by Sachit via screenshot — reels centered, rail buttons
  on rails, readouts on bar. Looks great. Two fixes requested:
  1. SPIN sprite was squished (forced square) + cramped high → now aspect-preserved (setScale by
     width, spinBaseScale stored so pressSpin animation respects it) + moved down to y=964.
  2. Manual bet entry: BET rail button now emits eventBus EVENTS.OPEN_BET → GameHUD opens new
     BetModal.jsx (number input pre-filled with current per-line bet + preset chips 0.2-5.0 +
     shows resulting total × lines + Confirm→setBet). Removed cycleBet (dead). Uses shared Modal.
- Removed unused REEL_W. Build clean; lint down to 1 benign warning (GameGrid GAMES export).
- Remaining plan: Task 8 (asset cleanup incl. optimize frame-clean 3.3MB), Task 9 (polish/DoD).

### 2026-07-04 — Jungle game simplified: no paylines, credit bet, fixed modal X
- Sachit: slot must be simple — credits, a credit bet you set, spin, win. "Lines" confused people.
  Removed the ENTIRE lines concept: gameStore (no lines/setLines; betAmount default 5 = credit
  stake), SlotScene (totalBet→currentBet = betAmount; deleted LINES button, cycleLines, setLines,
  LINE_PRESETS; BET_LEVELS→BET_MAX=100). Rails now: LEFT INFO+AUTO, RIGHT BET+MAX.
- Fixed the bet-modal X: GameHUD wraps children in pointer-events-none, so Modal buttons never got
  clicks → added pointer-events-auto to Modal root. (Fixes close on ALL game modals.)
- BetModal reworked: "Bet amount per spin" (credits), presets [1,5,10,25,50,100], shows your
  credits, blocks bet > balance. AUTO already loops until stopped or credits < bet (kept).
- Build+lint clean (1 benign GameGrid warning). Built blind — needs Sachit visual verify.

### 2026-07-04 — Jungle game win/lose juice (tasteful tier) + monkey overlap fix
- Sachit: monkey surfaced over CREDITS readout; win/lose visuals undesigned. Chose "tasteful/
  restrained". Done:
  - showResultPopup → showWinPopup: WIN-only, gold Sora text on a soft gold glow (no harsh box),
    amount COUNTS UP from 0 (addCounter). Loss shows NOTHING now (removed the punishing red −x box).
  - showWin tiered by win/bet ratio: any win = gentle symbol pulse (scaleX/Y yoyo) on middle row;
    ≥3× = sparkle explode on row; ≥10× (mega) = coin fountain + camera shake + monkey + BIG_WIN.
  - Monkey now MEGA-only, moved to far bottom-left (x−14, scale 0.6, depth 11) so it never covers
    the CREDITS readout (x≈548).
- Build+lint clean (1 benign GameGrid warning). Built blind — Sachit to verify.
- STILL PENDING plan tasks: 8 asset cleanup (incl optimize frame-clean 3.3MB), 9 polish/DoD.
