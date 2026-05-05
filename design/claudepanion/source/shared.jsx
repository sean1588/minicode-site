// Shared copy, icons, and utilities for both landing page directions.

const COPY = {
  name: "claudepanion",
  tagline_terse: "An AI-native framework for personal software.",
  tagline_verbose: "An AI-native framework for building personal software with Claude Code.",

  pitch_terse: "Software shaped to you, scaffolded by an agent, on demand.",
  pitch_verbose:
    "Traditional frameworks give humans abstractions to write code against. Claudepanion inverts that — it gives the agent a scaffold and lets it build the software itself. You describe what you want. Claude fills in the rest.",

  punchline_terse: "Specialized software used to be expensive. So we settled.",
  punchline_verbose:
    "Specialized software used to be expensive, so we all settled for general-purpose SaaS. AI collapsed that cost. The next generation of tools isn't shipped — it's scaffolded, by an agent, on demand, for an audience of one.",

  thesis_terse:
    "One-user, one-purpose tools used to be economically absurd. They aren't anymore.",
  thesis_verbose:
    "For decades, the economics of software made specialization rare. Writing a tool cost engineer-hours, so tools had to serve many users to pay for themselves. AI changes the cost curve. A capable agent can scaffold working software in minutes — not production-hardened software for millions, but good-enough, one-user, one-purpose software. The missing piece was a host. That's claudepanion.",

  install_cmd: "git clone github.com/you/claudepanion && cd claudepanion && npm i && npm start",

  positioning: [
    {
      name: "CopilotKit / assistant-ui",
      shape: "Chat widgets bolted onto your app",
      verdict: "Agent lives inside the product",
    },
    {
      name: "LangChain / LangGraph",
      shape: "Orchestration libs for production agents",
      verdict: "Built for shipping to other people",
    },
    {
      name: "Claude Code",
      shape: "An agent in a terminal",
      verdict: "General-purpose, no persistent UI",
    },
    {
      name: "claudepanion",
      shape: "A host where the agent IS the backend",
      verdict: "You're the user. Claude is the dev team.",
      self: true,
    },
  ],

  faq: [
    {
      q: "Is this a SaaS?",
      a: "No. It's a localhost host. One process, one URL, one user. Your companions and their data live on your machine.",
    },
    {
      q: "What is a 'companion,' exactly?",
      a: "A small personal app inside the host. It has a form, a slash command, a Claude Code skill, and a set of MCP tools that proxy to external systems. Think: PR reviewer, on-call investigator, reading tracker.",
    },
    {
      q: "Do I have to use Claude?",
      a: "Yes — and intentionally so. The primitives (MCP, slash commands, skills) assume Claude Code is the runtime. Companions can run without invoking Claude, but that's a side door, not a feature.",
    },
    {
      q: "How is this different from Claude Code with extra steps?",
      a: "Persistence across sessions. Visual artifacts (tables, dashboards, live logs). Ambient presence — a tab that stays open. Authenticated proxy tools so Claude can hit your AWS / GitHub / Linear without you pasting credentials.",
    },
    {
      q: "Where do shared companions live?",
      a: "On npm. Anything published as claudepanion-<name> drops into your sidebar after one install. We don't run a registry — npm already does that job.",
    },
    {
      q: "Is it production-ready?",
      a: "No, and intentionally so. It's for an audience of one — you. The bar is 'works for the next two weeks,' not 'serves a million users.'",
    },
  ],
};

// Tiny inline SVG icons — kept simple, hand-sketched feel
const Sketch = {
  Companion: ({ size = 48, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 14 Q10 10 14 10 L34 10 Q38 10 38 14 L38 30 Q38 34 34 34 L26 34 L22 39 L22 34 L14 34 Q10 34 10 30 Z" />
      <circle cx="20" cy="22" r="1.5" fill={color} />
      <circle cx="28" cy="22" r="1.5" fill={color} />
      <path d="M20 27 Q24 29 28 27" />
    </svg>
  ),
  Form: ({ size = 48, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="8" width="30" height="34" rx="2" />
      <path d="M14 16 L34 16 M14 22 L28 22 M14 28 L34 28 M14 34 L24 34" />
      <rect x="29" y="32" width="8" height="6" rx="1" fill={color} fillOpacity="0.15" />
    </svg>
  ),
  Slash: ({ size = 48, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="14" width="36" height="22" rx="2" />
      <path d="M14 22 L18 28 L14 34" />
      <path d="M22 34 L34 34" />
    </svg>
  ),
  Wrench: ({ size = 48, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 8 a8 8 0 0 1 8 8 a8 8 0 0 1 -10 7.7 L12 40 a3 3 0 0 1 -4 -4 L24.3 20 A8 8 0 0 1 30 8 Z" />
      <circle cx="32" cy="16" r="2" fill={color} />
    </svg>
  ),
  Doc: ({ size = 48, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 6 L30 6 L38 14 L38 42 L12 42 Z" />
      <path d="M30 6 L30 14 L38 14" />
      <path d="M17 22 L33 22 M17 28 L33 28 M17 34 L27 34" />
    </svg>
  ),
  Plant: ({ size = 48, color = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 40 L24 22" />
      <path d="M24 28 Q14 24 14 14 Q22 16 24 24" />
      <path d="M24 24 Q34 20 34 12 Q26 14 24 22" />
      <path d="M16 40 L32 40 L30 44 L18 44 Z" />
    </svg>
  ),
};

window.COPY = COPY;
window.Sketch = Sketch;
