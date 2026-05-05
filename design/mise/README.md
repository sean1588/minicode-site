# Handoff: Mise — *mise en place* for your data

> Paste a CSV or JSON, get a dashboard you can keep. The schema is portable; the data stays yours.

---

## Overview

**Mise** is a browser-side dashboard generator. The user pastes/uploads CSV or JSON, optionally adds Notes ("treat MRR as the hero"), and an LLM proposes a layout — KPIs, charts, tables, observations — which the app renders entirely client-side. The dashboard exports as a portable **recipe** (JSON) plus an HTML/PNG snapshot. Re-running the recipe on new data of the same shape produces the same dashboard with new numbers.

The product wedge is that **the dashboard outlives the data**. You start with a CSV; you walk away with a `.recipe.json` you can hand to a teammate, rerun next quarter, or version-control. Nothing about the data is uploaded or stored on our servers — the only network call is a single stateless LLM request to plan the layout.

This bundle contains the working prototype + brand + product decisions from a single design pass.

---

## About the design files

The HTML/CSS/JS files in this bundle are **design references**, not production code. They are working prototypes that demonstrate the intended look and behavior. The dev's task is to **recreate these designs in the target stack** described below — preserving the visual language, copy, and behavior — not to copy the prototype files into the production repo as-is.

That said, the prototype is closer to production than most design handoffs: no framework, no build step, vanilla DOM/CSS/JS that already works. The dev *can* lift logic and styles directly when convenient. The structural decisions in `notes/architecture.md` and `notes/backend.md` should be honored regardless.

---

## Fidelity

**High-fidelity.** Final colors, typography, spacing, copy, and interactions are committed. The prototype is the contract:

- Wordmark (*Mise.* in Fraunces italic with oxblood period)
- Type system (Fraunces display + IBM Plex Mono + system body)
- Color tokens (warm cream paper, near-black ink, oxblood accent)
- Widget set (KPI, line, bar, donut, statlist, table, observations)
- Copy across landing page and app
- Working chef chat-to-edit panel with undo + change-pulse animation

The dev should match these pixel-for-pixel where the framework allows, and adapt sensibly where it doesn't.

---

## Stack & deployment (committed)

| Surface | Stack | Domain | Why |
|---|---|---|---|
| Marketing site | **Hugo** (static) | `mise.app` | Content-heavy, SEO matters, blog/changelog incoming |
| App | **Vanilla HTML/CSS/JS** (no framework) | `app.mise.app` | Single-page in spirit, small DOM, no SSR benefit |
| LLM proxy | **Cloudflare Worker** (single endpoint) | `app.mise.app/api/cook` | Edge-deployed, cheap, key stays server-side |

**The LLM provider is OpenAI-compatible by default**, with a thin adapter that swaps to Anthropic native via env var. Full spec in `notes/backend.md`.

We are deliberately **not using Next.js, React, Svelte, or any framework for the app.** The prototype demonstrates that vanilla JS handles this scope cleanly. If the dev wants to deviate, write the rationale first. Full architecture rationale in `notes/architecture.md`.

---

## Surfaces

### `marketing.html` — Landing (`mise.app`)

Long-scroll single page:
1. **Top nav** — wordmark left, ghost links (How it works / Pantry / Pricing), primary CTA "Sauté it →" linking to app
2. **Hero** — mono eyebrow + Fraunces italic h1 + sub + CTA row + browser-chrome screenshot stub
3. **Two-doorway section** — Snapshot + Live URL (POST/markdown were killed; do not re-add)
4. **How it works** — three columns: paste → plate → portable
5. **Three-column principles** — privacy, AI-native, portable
6. **Dark oxblood footer CTA** + bottom nav

Key decisions:
- 1280px max-width column
- 2.5px hard rules between sections (editorial device)
- Hero h1 uses Fraunces italic with `<em>` on one word per line break for emphasis

### `prototype.html` + `prototype-app.js` — App (`app.mise.app`)

Single-page, three stages controlled by show/hide of `<section class="stage">`:

1. **Empty** — drop zone, paste textarea, Notes, sample chips, plates rail
2. **Loading** — schema inference panel right, AI step list left
3. **Dashboard** — rendered widgets + floating Chef panel

No router. State = `{rows, schema, recipe, title, id}` + `showStage(name)`. Persistence is `localStorage` only (key: `mise.plates.v1`).

### `d-screens.html` — Supporting screens

Reference artboards (empty, loading variants, error states, plates rail). Redundant once the app is implemented; useful for stakeholder reference.

### `index.html` — Design canvas

Internal tool with the design history side-by-side. **Not a deliverable.** Don't ship.

---

## Design tokens

```css
/* Colors */
--bg:        #fafaf7;              /* warm cream — page surface */
--bg-elev:   #ffffff;              /* widgets, cards, chef panel */
--bg-soft:   #f3f0e8;              /* observations widget, chef header */
--fg:        #1f1c16;              /* near-black ink */
--fg-mute:   #6b6457;              /* meta, eyebrows, axis labels */
--rule:      #1f1c16;              /* hard rules, key borders */
--rule-soft: #d6d0c2;              /* inner separators */
--accent:    oklch(0.42 0.16 30);  /* oxblood — brand */
--accent-2:  oklch(0.55 0.13 60);  /* warm tan — secondary */
--accent-3:  oklch(0.50 0.10 165); /* sage — tertiary, sparingly */

/* Typography */
--font-display: 'Fraunces', serif;        /* italic, 400-600 */
--font-mono:    'IBM Plex Mono', monospace; /* uppercase, 0.06-0.12em tracking */
--font-body:    -apple-system, 'Segoe UI', system-ui, sans-serif;
```

Three fonts. **Do not add a fourth.** Loaded from Google Fonts in both prototype and marketing — the dev can self-host if they prefer.

Type scale (display): h1 marketing 56-96px clamp · h1 app 36px · widget heads 17px
Type scale (mono): eyebrow 10-12px tracked uppercase
Spacing: loose 8px grid · widget padding 18-24px · section padding 80-96px desktop, 56-64px tablet, 32-48px mobile
Border radius: 0 (we are editorial; do not round corners)
Shadows: minimal — `0 1px 0 rgba(31,28,22,0.03)` on widgets, hard 2.5px borders elsewhere

---

## Components & widgets

The recipe planner returns one of seven widget types. Each has a fixed shape (see `notes/architecture.md` and the validators in `prototype-app.js` `chefValidateRecipe()` / `inferSchema()`).

| Type | Span options | Key fields | Notes |
|---|---|---|---|
| `kpi` | 3, 4 | `metric`, `spark?` | Big number + delta vs prev period; optional sparkline |
| `line` | 6, 8, 12 | `x` (date), `y` (number) | SVG, 700×200, axis ticks |
| `bar` | 6, 12 | `x`, `y` | SVG, 400×200 |
| `donut` | 6 | `cat`, `metric` | Top 8 categories, brand colors in `--accent / -2 / -3` rotation |
| `statlist` | 6 | `cat`, `metric` | Ranked list with bar fills |
| `table` | 12 | `limit` | Raw rows, default 10 |
| `observations` | 12 | `observations[]` | 1-3 chef-written sentences in `--bg-soft` block |

Spans must compose to multiples of 12 per row.

---

## Interactions & behavior

### Paste/upload → render
1. User pastes text or drops a file or selects a sample chip
2. (Optional) types in Notes textarea
3. Clicks "Render dashboard →"
4. App: parses (CSV-detect or JSON-parse) → infers schema → calls `/api/cook` → validates returned recipe → renders
5. On LLM failure, deterministic local fallback fires (`fallbackRecipe()` in `prototype-app.js`) and a small banner says "Couldn't reach the AI"

### The Chef (chat-to-edit)
- Floating oxblood pill bottom-right of dashboard reads "M. · Talk to the chef"
- Click → 420px panel slides in from right (becomes bottom-sheet on mobile)
- 4 suggestion chips visible empty state
- Send → loading dot "tasting…" → recipe diff applied
- **Pulse:** widgets whose fingerprint (type + key fields) changed get a 1.6s oxblood outline animation
- **Undo:** every chef reply has a `↶ Undo` mono button. Click → reverts to pre-edit recipe, message dims to "reverted"
- Errors stay inline as small mono red text

### Persistence
- Every render writes the current `{id, title, rows, schema, recipe, savedAt, cols}` to `localStorage` under `mise.plates.v1`
- Plates rail on empty state shows the most recent 12
- Click a plate → restores state, jumps to dashboard view
- Clear button asks for confirmation, wipes the key

### Exports
- **Recipe** → `<title>.recipe.json` with `{title, schema, widgets, rowCount, generatedAt, generator}`
- **PNG** → SVG `foreignObject` of the dashboard rasterized via canvas, no external deps

### Animation
- Stage transitions: opacity 200ms
- Chef panel: transform 220ms ease-out
- Widget pulse: 1.6s `wPulse` keyframe (oxblood box-shadow + border-color)
- Step advance in loading: 380-200ms gated waits to feel deliberate

---

## State management

Single global `state` object in `prototype-app.js`:

```js
const state = {
  rows:   null,   // Array<Record<string, any>>
  schema: null,   // Array<{name, type, cardinality?, sample?}>
  recipe: null,   // {title, widgets[], fallback?}
  title:  "Untitled dashboard",
  id:     null    // localStorage id, e.g. "d_lk5z9q"
};
```

Plus the chef's local store:
```js
const chef = {
  history: [],          // [{role: 'user'|'chef'|'error', content, changes?, prevRecipe?, undone?}]
  thinking: false,
  pendingHighlight: null  // Set<fingerprint> for next-render pulse
};
```

When porting to the production stack: state stays this small. Don't introduce Redux/Zustand/Context. A module-scope object plus DOM refs is the right shape for this app.

---

## Backend (LLM proxy)

The prototype calls `window.claude.complete(prompt: string)` — that is the design environment's helper. **In production, replace with a single `fetch('/api/cook', {method: 'POST', body: JSON.stringify({prompt})})` call to the Cloudflare Worker.**

Two call sites in `prototype-app.js`:
1. `planRecipe(rows, schema, notes)` — the initial layout call
2. `chefSubmit(userRequest)` — the chef chat-to-edit call

Both pass a single composed prompt string and expect a JSON response that gets fence-stripped and parsed. **Full proxy spec, OpenAI-compatible adapter design, and rate-limiting strategy are in `notes/backend.md`.** Read that before writing any backend code.

---

## Privacy claim (load-bearing)

The marketing copy promises *"nothing leaves your browser"* with one carve-out: the schema-only LLM call. This must remain literally true:

- **The proxy must not log prompt content.** Only counts (`request_id, ip_hash, status, ms`).
- **No analytics SDKs in the app.** No Mixpanel, no Segment, no Sentry breadcrumbs that capture prompt content. If we add telemetry it's a single anonymous event ping with no payload — see `notes/followups.md` Tier 1.4.
- **No file upload server.** All parsing is in the browser via `FileReader`.
- **`Cache-Control: no-store` on the proxy** — even at the edge.

If the dev needs to violate any of this for performance or debugging, **flag it back to product**. The brand promise is the moat.

---

## Screenshots

The `screenshots/` folder has reference captures of every surface:

| File | What it shows |
|---|---|
| `marketing-01-hero.png` → `-05-footer.png` | Marketing landing, top to bottom |
| `empty.png` | App empty state (drop / paste / Notes / plates rail) |
| `loading.png` | Loading stage (schema panel + step list) |
| `dashboard.png` | Rendered dashboard with KPIs, line chart, observations |
| `dashboard-chef.png` | Same dashboard with The Chef panel open |

> ⚠️ The marketing hero shot has minor type-overlap artifacts from the screenshotter struggling with our extreme line-height (`0.94`) on Fraunces italic. Open `marketing.html` in a real browser to see the intended rendering — it's clean.

---

## Files in this bundle

```
prototype.html              ← App entry. Becomes index.html in mise-app/
prototype-app.js            ← App logic. Becomes app.js in mise-app/
marketing.html              ← Marketing landing. Port to Hugo templates in mise-marketing/
d-screens.html              ← Supporting screens reference (no direct deliverable)
samples/saas-metrics.json   ← Sample chip data
samples/stripe-payouts.json ← Sample chip data

notes/
  v1-scope.md         ← What's in v1, what's deferred, what's killed (read first)
  vocabulary.md       ← Mise / Recipe / Pantry / Plates / Chef / Sauté glossary
  backend.md          ← LLM proxy spec, OpenAI-compatible adapter
  architecture.md     ← Repo split, hosting, framework rationale, mobile, perf
  followups.md        ← Tiered backlog (read before prioritizing)
  demo-video-plan.md  ← Launch-video script (post-implementation)
```

---

## Brand & product principles (don't break these)

1. **Nothing leaves the browser** — except one stateless LLM call
2. **The recipe is portable** — `.recipe.json` is the user's; they can re-run on new data without us
3. **The Chef is a tool, not a chatbot** — every reply produces a recipe diff or an honest "I can't"
4. **Editorial > playful** — when in doubt, lean toward Stripe/Linear/Mercury, not Notion AI confetti
5. **Mobile-respectable** — desktop-primary by reality of inputs, but never mobile-broken

---

## What's intentionally NOT in v1

- POST endpoints / live API auth → v2 (paid)
- Cloud storage / cross-device persistence → v2 (paid)
- Sharing / public dashboard URLs → v2 (paid)
- Markdown source format → killed
- Manual widget insertion (drag from Pantry) → v1.1

Don't reopen these without re-reading `notes/v1-scope.md`. The discipline paid for itself.

---

_The design is the contract. The dev's job is to honor it without modernizing it into something it shouldn't be._
