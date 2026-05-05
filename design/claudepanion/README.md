# Handoff: claudepanion — Design System & Full UX Flow

## Overview

Claudepanion is a **localhost host for AI-scaffolded personal software** — one process, one URL, one user. It's a place where Claude Code (the agent) builds small "companions" (one-purpose apps for one user) on demand, and those companions live in a sidebar UI you can return to.

This handoff covers the complete first-run UX:

1. **Marketing landing page** — explains the thesis to a developer who's never heard of it
2. **`/build` (build companion home)** — the entry point inside the host where you start scaffolding
3. **`/build/new` (build form)** — the prompt-the-agent form
4. **`/build/run/:id` (build run detail)** — live build progress (4 states: pending / running / completed / error)
5. **Generic companion home** — what *any* finished companion's main page looks like (empty + populated)
6. **`/install` (community install)** — install a companion from npm (4 states: idle / installing / success / error)

---

## About the Design Files

The files in `source/` are **design references** — React-via-Babel HTML prototypes showing the intended look, copy, and behavior. **They are not production code to copy directly.** Your job is to recreate these designs in claudepanion's actual codebase (or the framework you choose if starting fresh) using its established patterns and libraries.

The screenshots in `screenshots/` show each screen in its committed visual direction (**Editorial · Cool theme**) at 1280px wide.

If you're rebuilding in Next.js / Remix / Vite, lift the **layout, copy, color tokens, type scale, and component anatomy**, but render with your real router, real data fetching, and real component primitives.

---

## Fidelity

**High-fidelity (hifi).** All colors, type, spacing, and copy are final. Recreate pixel-perfectly using the codebase's existing patterns. The `cool` palette is locked; the prototype keeps `warm`, `dark`, `sage` available behind a Tweaks panel as themes for future exploration but **`cool` is the production default**.

---

## Visual Direction: "Editorial"

The design is **editorial**, not dashboard-y. It reads like a quiet field-guide pamphlet rather than a SaaS app.

- **Display type**: `Instrument Serif`, italic for accent, used at 64–96px for hero phrases
- **Body type**: `Inter` 400/500, generous line-height (1.5–1.7), measure-capped (~62ch)
- **Mono type**: `JetBrains Mono` 400/500, 12–14px — used for terminal blocks, command tags, keyboard hints, version stamps
- **Layout**: asymmetric two-column with deliberate whitespace; serif headlines anchor the left column, dense mono/UI specimens float at the right edge
- **Decoration**: hand-sketched 1.4-stroke SVG line-icons (companion bubble, form, slash, wrench, doc, plant); a "magazine-page" feel with eyebrow tags ("A FIELD GUIDE TO" / "AI-NATIVE FRAMEWORKS")
- **Motion**: minimal — hover transitions on links/buttons (150ms ease-out), spinner on installing state, no parallax, no entrance animations

---

## Design Tokens

### Colors — `cool` palette (production default)

| Token | Hex | Usage |
|---|---|---|
| `bg` | `#F1F2F1` | Page background — slightly cool off-white |
| `ink` | `#15181A` | Primary text, terminal chrome backgrounds |
| `muted` | `#5C6266` | Secondary text, captions, eyebrow tags |
| `accent` | `#3D6FB8` | Italic display words, links, primary CTA highlight |
| `soft` | `#DDE2DE` | Card hairlines, divider rules, subtle fills |
| `sage` | `#7A8788` | Tertiary accents (rarely used; keep as a third tone) |

**Traffic-light dots** (in mock terminal chrome): `#E36658` red, `#E5A24A` amber, `#7BAE6B` green.

**Status colors** (build run states):
- Success / Completed: `#7BAE6B`
- Warning / Pending: `#E5A24A`
- Error / Failed: `#E36658`
- Info / Running: the `accent` blue `#3D6FB8`

### Other palettes (kept around for future, not for production)

```js
warm: { bg: "#F5EFE6", ink: "#1B1814", muted: "#6B6157", accent: "#C8553D", soft: "#E8DFD0", sage: "#7A8B7A" }
dark: { bg: "#1B1814", ink: "#F5EFE6", muted: "#9A8F82", accent: "#E0826A", soft: "#2A2520", sage: "#9DB09C" }
sage: { bg: "#F2F1EC", ink: "#1F2421", muted: "#5E6863", accent: "#B0493B", soft: "#DDE0D2", sage: "#5C7A66" }
```

### Typography scale

| Role | Family | Size / Weight | Line-height | Tracking |
|---|---|---|---|---|
| Display (hero) | Instrument Serif | 80–96px / 400 | 1.05 | -0.02em |
| Display italic accent | Instrument Serif Italic | matches display | 1.05 | -0.02em |
| H2 section | Instrument Serif | 40–56px / 400 | 1.1 | -0.015em |
| H3 sub-section | Inter | 18–20px / 600 | 1.3 | 0 |
| Body | Inter | 16–17px / 400 | 1.55 | 0 |
| Body small / caption | Inter | 13–14px / 400 | 1.5 | 0 |
| Eyebrow tag | Inter | 11px / 500, UPPERCASE | 1 | 0.12em |
| Mono / terminal | JetBrains Mono | 12–14px / 400–500 | 1.5 | 0 |

### Spacing scale

The prototypes use a loose 8-px-ish rhythm. Concrete values that recur: `8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 120`. Section vertical rhythm = 96px between major sections, 48px within.

### Border radius

| Use | Radius |
|---|---|
| Buttons, pill tags | 999 (full pill) |
| Cards, inputs, terminal blocks | 8px |
| Larger surfaces (whole panels) | 12px |

### Shadows

Used very sparingly — this design leans on **hairline borders** (`1px solid {ink}14`, i.e. ink with ~8% alpha) rather than shadows. The only place shadows appear is in subtle floating cards on the landing page hero (offset 4px / blur 24px / `rgba(0,0,0,0.06)`).

---

## Screen-by-Screen Spec

### 1. Landing Page (`/` for unauthenticated marketing visitors)

**File:** `source/Landing Page.html` (entry point — pulls in `direction-a.jsx` → `FieldGuide` component)
**Screenshot:** `screenshots/01-landing-page.png`
**Component name:** `FieldGuide`

#### Purpose
Convert a developer who's never heard of claudepanion into someone who clones the repo. Communicate the thesis (AI-native framework, audience-of-one software) without being a SaaS landing page.

#### Layout
Single long page, max-width ~1280px centered. Left-heavy editorial column (~720px content) with a smaller floating-card column at the right edge. Sections from top to bottom:

1. **Header** — `claudepanion` wordmark (Instrument Serif, 28px) + version stamp "v0.1 · localhost" (mono, muted) on the left; nav links "Sharing" and "FAQ" on the right.
2. **Hero**
   - Eyebrow tags: `A FIELD GUIDE TO` and `AI-NATIVE FRAMEWORKS` (pill, soft fill)
   - Display headline (Instrument Serif, 96px, line-height 1.05): "Software shaped to *you*, scaffolded by an agent." — the word *you* is italic and `accent` colored
   - Sub-paragraph (Inter 17, muted, max 62ch): the verbose `pitch` from `COPY.pitch_verbose`
   - Floating card cluster on the right showing two stacked sketch-cards (PR review, github_get_diff snippet)
3. **Thesis** — "Specialized software used to be expensive…" headline + paragraph. See `COPY.thesis_verbose` for exact copy.
4. **Anatomy of a companion** — 4-card grid (Form, Slash, Wrench, Doc) showing the four primitives of a companion. Each card has a sketch icon, label, one-line description.
5. **Install block** — mock macOS-window-styled terminal with traffic lights and the `git clone …` command from `COPY.install_cmd`. Below: `Read the README →` link.
6. **Positioning** — table comparing claudepanion to CopilotKit / LangChain / Claude Code. The `claudepanion` row is bolded; others are muted. See `COPY.positioning`.
7. **FAQ** — six accordion rows numbered 01–06. Each row collapses by default, expanding on click to reveal the answer. See `COPY.faq` for exact Q/A pairs.
8. **Footer** — minimal: wordmark + version stamp + a single `github.com/you/claudepanion` link.

#### Copy
All copy lives in `source/shared.jsx` as the `COPY` object. Use `verbose` variants on the landing page (the user has confirmed the verbose tone). **Do not reword.**

#### Interactions
- FAQ rows: click toggles open/closed; the `+` becomes `−`. Animation: `max-height` 0 → auto over 200ms ease-out.
- Smooth-scroll anchor links (`#install`, `#faq`).
- All hover states: text links underline with 150ms ease-out; CTA buttons darken `ink` background by ~10%.

---

### 2. Build Companion Home (`/build` — first-run inside the host)

**File:** `source/build-home.jsx` — `BuildHomeEditorial`
**Screenshot:** `screenshots/02-build-home.png`

#### Purpose
The user has installed and opened claudepanion. This is what they see first inside the host — an entry point to **build a new companion**, with suggestions to inspire them and a list of past builds.

#### Layout
- Left rail: claudepanion wordmark + persistent sidebar (Companions list — empty here on first run, just a "+" affordance and "Browse community →" link)
- Main column:
  - **Hero**: Instrument Serif "What would you like Claude to build?" (56px) + a single large prompt input (multi-line, ~96px tall, `ink` border, soft inner shadow)
  - **Suggested companions** strip — 3 cards in a row: 🔎 GitHub PR reviewer / 📊 CloudWatch investigator / 📋 Linear backlog groomer. Each card: emoji, title (Inter 18/600), one-line description (muted), "Try this →" link. Click prefills the prompt input.
  - **Recent builds**: empty state message "No builds yet. The first one always feels like magic." Center-aligned, muted.

#### Interactions
- Prompt input: focus → border becomes `accent`. Cmd+Enter submits.
- Suggested cards: hover lifts (4px translateY) + border `accent`.
- Submit → POST → navigate to `/build/run/:id` (run detail screen, pending state).

---

### 3. Build Form — Blank / Prefilled (`/build/new`)

**File:** `source/build-form.jsx` — `BuildFormEditorial`
**Screenshots:** `03-build-form-blank.png`, `04-build-form-prefilled.png`

#### Purpose
An expanded form where the user can refine their prompt before kicking off a build. Includes optional structured fields (name, slash-command alias, MCP tools to wire up).

#### Layout
- Same left rail as build home
- Main column, centered, max 720px:
  - Eyebrow: `NEW COMPANION`
  - H1 (Instrument Serif 56): "Describe what you want Claude to build."
  - Field 1: **Companion name** (text input, optional — auto-suggested from prompt)
  - Field 2: **Description** — large textarea, this is the prompt. Placeholder shows an example like "A personal RSS reader that summarizes new posts and surfaces the ones I'd actually open."
  - Field 3: **Slash command** (mono input, prefixed with `/`)
  - Field 4: **MCP tools** — multi-select chip picker. Pre-populated chips: GitHub, Linear, AWS, Notion, Slack, Custom…
  - Footer: secondary "Cancel" + primary "Build" (ink-filled button, 14px Inter 500)

The **prefilled** variant shows the form populated with a coherent example (suggest: "On-call investigator" — slash `/oncall`, tools: AWS, GitHub, Linear).

---

### 4. Build Run Detail (`/build/run/:id`)

**File:** `source/build-detail.jsx` — `DetailPageA`
**Screenshots:** `05-detail-pending.png` / `06-detail-running.png` / `07-detail-completed.png` / `08-detail-error.png`
**States:** `pending` / `running` / `completed` / `error`

#### Purpose
Show live progress as Claude Code scaffolds the companion. The header anatomy is shared across all four states; the body changes.

#### Anatomy (all states)
- **Header strip**: companion name + slash command + state pill (pending = amber dot, running = blue spinner, completed = green dot, error = red dot)
- **Two-column body**:
  - Left (60%): a step list — "Reading prompt", "Designing companion shape", "Generating form schema", "Wiring MCP tools", "Writing skill file", "First boot". Each step has an icon + status (pending → spinner → check / cross).
  - Right (40%): a **live terminal pane** (mono, dark `ink` background, `bg` text) streaming Claude Code's output. Auto-scrolls. Shows ~20 lines of context.
- **Footer bar**: "Cancel build" (text link, muted) on the left; "Open companion →" (primary, disabled until completed) on the right.

#### State variants
- **Pending**: all steps muted; terminal shows a single line "Waiting for agent…"
- **Running**: current step has a small spinner; previous steps are checked; future steps are muted. Terminal streams real output.
- **Completed**: all steps checked, last line of terminal shows ✓ + "Companion ready at /:slug". "Open companion →" is enabled and styled `accent`.
- **Error**: failing step has a red `×`; terminal pane shows last 20 lines including the error trace. Below the columns: an "Error" panel with the error class, message, and a "Retry build" button + "Edit prompt" link.

---

### 5. Generic Companion Home — Empty / Populated

**File:** `source/companion-home.jsx` — `CompanionHomeEditorial`
**Screenshots:** `09-companion-empty.png`, `10-companion-populated.png`

#### Purpose
The "main page" template that **any** finished companion uses. This is what the host renders when you click into a companion — the form/dashboard surface where the companion actually does its work. The example used in the mock is the **PR reviewer** companion.

#### Layout
- Same left rail (companion list now shows ≥1 item, with the active one highlighted)
- Main column:
  - **Companion header**: emoji + name (Instrument Serif 40), one-line description (muted), the slash command shown as a mono pill on the right
  - **Primary form** (always at the top): a single prominent input/area. For the PR reviewer this is "Paste a PR URL or just type the PR number". A large "Review" CTA below.
  - **Output area** below the form:
    - **Empty**: a faint sketch illustration (the `Plant` icon at large scale) + muted text "Past reviews will live here." — this is the empty state.
    - **Populated**: a chronological feed of past reviews. Each row: PR title, repo/number, summary excerpt, timestamp, "Open →" link. Style: hairline-divided rows, no shadows, generous vertical padding (24px).

---

### 6. Install Page (`/install`)

**File:** `source/install-page.jsx` — `InstallEditorial`
**Screenshots:** `11-install-idle.png` / `12-install-installing.png` / `13-install-success.png` / `14-install-error.png`
**States:** `idle` / `installing` / `success` / `error`

#### Purpose
Install a community-published companion from npm. Surface the **npm-as-registry** thesis ("we don't run a registry — npm already does that job").

#### Layout
- Same left rail
- Main column:
  - Eyebrow: `INSTALL FROM npm`
  - H1: "What would you like to install?"
  - Mono input prefixed with `$ npx claudepanion install` — user types the package name (e.g. `claudepanion-pr-reviewer`)
  - Right aside: **Community packages** — a card listing 4 placeholder `claudepanion-*` packages (e.g. `claudepanion-pr-reviewer`, `claudepanion-oncall`, `claudepanion-linear-grooming`, `claudepanion-rss-summarizer`). Each shows author, version, downloads, "Install" pill button.
  - Below the input, a small note: *"Anything published as `claudepanion-<name>` works. Browse all on [npmjs.com →](https://npmjs.com/search?q=claudepanion-)"*
- **State variants**:
  - **Idle**: input ready; aside visible
  - **Installing**: input becomes a feedback block showing the running npm command + a spinner; previous command output streams below in mono
  - **Success**: green border, ✓, "Installed claudepanion-pr-reviewer v1.2.3 — Open companion →"
  - **Error**: red border, ×, npm 404 error block reproduced verbatim with the error message in mono

---

## Interactions & Behavior (cross-cutting)

### Routing
- `/` (marketing) — only when not yet installed; once the host is running locally, replace with redirect to `/build`
- `/build` — build companion home
- `/build/new` — build form
- `/build/run/:id` — build run detail (subscribes to a build job stream)
- `/companion/:slug` — generic companion home (slug derived from companion name)
- `/install` — install from npm

### State management
- **Build runs**: server-streamed (SSE or WebSocket). Each run has `id`, `status` (pending/running/completed/error), `steps[]` (each `{ id, label, status }`), `log` (rolling string buffer).
- **Companions list**: read on app start; refetched after each successful build or install.
- **No global auth**. This is localhost — single user, no login. All state is local-server-backed.

### Loading & error states
- Loading: never use a full-page spinner. Use inline spinners next to the thing being loaded, or skeletons for list items.
- Error: never use a toast. Use inline error blocks (red border, mono message, retry button) anchored to the action that failed.

### Form validation
- Inline only. Required fields show a small red caption *below* the input on submit.
- Slash command must match `^/[a-z][a-z0-9-]*$` — show example placeholder `/oncall`.

### Responsive
The mocks are designed for a localhost desktop window — **1280px target, 960px minimum**. Below 960px, the left rail collapses to a top bar with a hamburger; below 768px, single-column with the rail behind a drawer.

---

## Component Inventory

| Component | Lives in | Used by |
|---|---|---|
| `Sketch.*` (icons) | `shared.jsx` | All screens |
| `COPY` (all marketing/UI strings) | `shared.jsx` | Landing page, build form placeholders, FAQ |
| `FieldGuide` (landing page root) | `direction-a.jsx` | Marketing |
| `BuildHomeEditorial` | `build-home.jsx` | `/build` |
| `BuildFormEditorial` | `build-form.jsx` | `/build/new` |
| `DetailPageA` | `build-detail.jsx` | `/build/run/:id` (all 4 states via `state` prop) |
| `CompanionHomeEditorial` | `companion-home.jsx` | `/companion/:slug` (all companions reuse this shell) |
| `InstallEditorial` | `install-page.jsx` | `/install` (all 4 states via `installState` prop) |

The `direction-b.jsx` file holds the *Dashboard* alternate visual direction. **Do not ship it.** It's preserved for future exploration only.

---

## Assets

- **Fonts** — Google Fonts: `Instrument Serif` (Regular, Italic), `Inter` (300/400/500/600/700), `JetBrains Mono` (400/500/600). Load via Google Fonts or self-host equivalents.
- **Icons** — All inline SVG, hand-sketched style, defined in `shared.jsx` as `Sketch.{Companion, Form, Slash, Wrench, Doc, Plant}`. No external icon library is needed. If you need additional icons, **draw new ones in the same 1.4-stroke, round-cap, 48×48 viewBox style**; do not mix in Lucide / Heroicons / Phosphor.
- **No raster images** are used in the design. The "PR review" floating cards on the hero are constructed from SVG + DOM.

---

## Files in This Bundle

```
design_handoff_claudepanion/
├── README.md                           ← you are here
├── screenshots/                        ← 14 PNG renders @ 1280px wide
│   ├── 01-landing-page.png
│   ├── 02-build-home.png
│   ├── 03-build-form-blank.png
│   ├── 04-build-form-prefilled.png
│   ├── 05-detail-pending.png
│   ├── 06-detail-running.png
│   ├── 07-detail-completed.png
│   ├── 08-detail-error.png
│   ├── 09-companion-empty.png
│   ├── 10-companion-populated.png
│   ├── 11-install-idle.png
│   ├── 12-install-installing.png
│   ├── 13-install-success.png
│   └── 14-install-error.png
└── source/                             ← React-via-Babel HTML prototypes
    ├── Landing Page.html               ← entry point; loads everything below
    ├── shared.jsx                      ← COPY object + Sketch icons
    ├── direction-a.jsx                 ← FieldGuide (landing page) — SHIP THIS
    ├── direction-b.jsx                 ← alternate "Workbench" direction — DO NOT SHIP
    ├── build-home.jsx                  ← BuildHomeEditorial + BuildHomeDashboard
    ├── build-form.jsx                  ← BuildFormEditorial + BuildFormDashboard
    ├── build-detail.jsx                ← DetailPageA + DetailPageB
    ├── companion-home.jsx              ← CompanionHomeEditorial + CompanionHomeDashboard
    ├── install-page.jsx                ← InstallEditorial + InstallDashboard
    ├── design-canvas.jsx               ← prototype-tooling shim (NOT a product component)
    └── tweaks-panel.jsx                ← prototype-tooling shim (NOT a product component)
```

To preview the prototypes locally: open `source/Landing Page.html` in a browser. (Babel runs in-page; no build step needed.)

---

## Implementation Notes for the Developer

1. **Don't ship the prototype's React-via-Babel pattern.** It's a fast iteration tool, not production. Recreate components in claudepanion's real React + bundler setup.
2. **The `*Dashboard` variants in each file are obsolete.** They were the alternative direction we considered and rejected. Only build the `*Editorial` variants.
3. **The Tweaks panel** (`tweaks-panel.jsx`) is design-time only — it lets us hot-swap themes during exploration. Do not include it in production.
4. **The `design-canvas.jsx`** is the multi-artboard pan/zoom canvas used to lay out variations. Do not include it in production.
5. **Themes other than `cool`** stay in the codebase as named constants but are not user-switchable in production. If we ever ship a "dark mode," we'll start from the `dark` palette already defined.
6. **Real Anthropic brand assets** — if you have access to Anthropic's design system in your codebase (claude.com / Anthropic UI kit), use those primitives where they map cleanly (buttons, inputs). The prototype rolls its own to be self-contained, but production should compose with the existing system.
7. **The host renders the agent's output** — keep that mental model. Most companions render their own page inside `<CompanionHome>` shell. Build the shell once; let companions plug in their form + output area.

---

## Open Questions for Product

These weren't resolved in this design pass — flag them with the team before implementing:

- **Companion lifecycle**: Edit / re-scaffold / delete UX is not designed yet. Where does that live?
- **MCP tool authentication**: How does the user grant the host access to GitHub / AWS / Linear? (Probably out-of-band CLI, but the UI affordance is undefined.)
- **Sharing & publishing**: We say "shared companions live on npm" but the *publish* flow from inside the host is not in this handoff.
- **Multi-window / tabs**: Does each companion get its own window? Tab? Or is everything in the single host SPA? Mock assumes SPA.

---

*Built using the Editorial direction · Cool theme · Verbose tone. April–May 2026.*
