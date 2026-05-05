// Direction A — "The Field Guide"
// Editorial, asymmetric, warm. Magazine-style with sketch-y illustrations and serif display.

const FieldGuide = ({ tone = "verbose", theme = "warm" }) => {
  const C = window.COPY;
  const Sk = window.Sketch;
  const t = (terse, verbose) => (tone === "terse" ? terse : verbose);

  const palettes = {
    warm: { bg: "#F5EFE6", ink: "#1B1814", muted: "#6B6157", accent: "#C8553D", soft: "#E8DFD0", sage: "#7A8B7A" },
    cool: { bg: "#F1F2F1", ink: "#15181A", muted: "#5C6266", accent: "#3D6FB8", soft: "#DDE2DE", sage: "#7A8788" },
    dark: { bg: "#1B1814", ink: "#F5EFE6", muted: "#9A8F82", accent: "#E0826A", soft: "#2A2520", sage: "#9DB09C" },
    sage: { bg: "#F2F1EC", ink: "#1F2421", muted: "#5E6863", accent: "#B0493B", soft: "#DDE0D2", sage: "#5C7A66" },
  };
  const p = palettes[theme] || palettes.warm;

  return (
    <div style={{
      background: p.bg,
      color: p.ink,
      minHeight: "100%",
      fontFamily: "'Inter', system-ui, sans-serif",
      fontSize: 16,
      lineHeight: 1.55,
    }}>
      <style>{`
        .fg-serif { font-family: 'Instrument Serif', 'Cormorant Garamond', Georgia, serif; font-weight: 400; }
        .fg-mono  { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .fg-rule  { border: 0; border-top: 1px solid ${p.ink}1a; }
        .fg-link  { color: ${p.accent}; text-decoration: none; border-bottom: 1px solid ${p.accent}66; }
        .fg-link:hover { border-bottom-color: ${p.accent}; }
        .fg-btn   { display: inline-flex; align-items: center; gap: 8px; padding: 12px 18px; border-radius: 999px; background: ${p.ink}; color: ${p.bg}; text-decoration: none; font-size: 14px; font-weight: 500; transition: transform .15s ease; }
        .fg-btn:hover { transform: translateY(-1px); }
        .fg-btn-ghost { background: transparent; color: ${p.ink}; border: 1px solid ${p.ink}33; }
        .fg-card  { background: ${p.soft}; border-radius: 6px; }
        .fg-tag   { display: inline-block; padding: 3px 10px; border: 1px solid ${p.ink}26; border-radius: 999px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: ${p.muted}; }
        .fg-noise::before {
          content: ""; position: absolute; inset: 0; pointer-events: none; opacity: .35; mix-blend-mode: multiply;
          background-image: radial-gradient(${p.ink}0a 1px, transparent 1px);
          background-size: 4px 4px;
        }
        .fg-marquee { animation: fgmarquee 40s linear infinite; }
        @keyframes fgmarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .fg-fade-in { animation: fgfade .8s ease both; }
        @keyframes fgfade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .fg-blink { animation: fgblink 1.05s steps(2) infinite; }
        @keyframes fgblink { 50% { opacity: 0; } }
      `}</style>

      {/* ============== TOP BAR ============== */}
      <header style={{ padding: "20px 56px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${p.ink}14` }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span className="fg-serif" style={{ fontSize: 22, fontStyle: "italic" }}>claudepanion</span>
          <span className="fg-mono" style={{ fontSize: 11, color: p.muted }}>v0.1 · localhost</span>
        </div>
        <nav style={{ display: "flex", gap: 28, fontSize: 14, color: p.muted }}>
          <a href="#registry" style={{ color: "inherit", textDecoration: "none" }}>Sharing</a>
          <a href="#faq" style={{ color: "inherit", textDecoration: "none" }}>FAQ</a>
        </nav>
        <a className="fg-btn" href="#install">Clone the repo →</a>
      </header>

      {/* ============== HERO ============== */}
      <section style={{ padding: "72px 56px 64px", display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 56, alignItems: "start", position: "relative" }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
            <span className="fg-tag">A field guide to</span>
            <span className="fg-tag" style={{ borderColor: p.accent + "66", color: p.accent }}>AI-native frameworks</span>
          </div>
          <h1 className="fg-serif" style={{ fontSize: 88, lineHeight: .95, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
            Software shaped to <em style={{ color: p.accent }}>you</em>,
            <br />scaffolded by an agent,
            <br />on demand.
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.5, color: p.muted, maxWidth: 540, margin: "0 0 32px" }}>
            {t(C.pitch_terse, C.pitch_verbose)} A localhost host for personal companions, with Claude Code as the runtime backend.
          </p>

          {/* Terminal install block */}
          <div id="install" className="fg-card" style={{ padding: 0, overflow: "hidden", border: `1px solid ${p.ink}14`, maxWidth: 640 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: p.ink, color: p.bg }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#E36658" }} />
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#E5A24A" }} />
              <span style={{ width: 10, height: 10, borderRadius: 999, background: "#7BAE6B" }} />
              <span className="fg-mono" style={{ fontSize: 11, marginLeft: 8, opacity: .6 }}>~/projects/claudepanion</span>
            </div>
            <div className="fg-mono" style={{ padding: "18px 20px", fontSize: 13, lineHeight: 1.8, color: p.ink, background: p.soft }}>
              <div><span style={{ color: p.accent }}>$</span> git clone <span style={{ color: p.muted }}>github.com/you/claudepanion</span></div>
              <div><span style={{ color: p.accent }}>$</span> cd claudepanion && npm install</div>
              <div><span style={{ color: p.accent }}>$</span> npm start <span style={{ color: p.muted }}># → http://localhost:3001</span></div>
              <div style={{ color: p.sage, marginTop: 12 }}>✓ host running</div>
              <div style={{ color: p.sage }}>✓ build companion mounted</div>
              <div style={{ color: p.muted }}># now open Claude Code in any repo and type:</div>
              <div><span style={{ color: p.accent }}>›</span> /build-companion <span className="fg-blink">▍</span></div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
            <a className="fg-btn" href="#install">git clone the repo</a>
            <a className="fg-btn fg-btn-ghost" href="#registry">How sharing works</a>
          </div>
        </div>

        {/* Hero illustration — sketchy companion zoo */}
        <div style={{ position: "relative", height: 520 }}>
          <CompanionZoo p={p} />
        </div>
      </section>

      {/* ============== MARQUEE ============== */}
      <div style={{ borderTop: `1px solid ${p.ink}14`, borderBottom: `1px solid ${p.ink}14`, padding: "18px 0", overflow: "hidden", background: p.soft }}>
        <div style={{ display: "flex", gap: 48, whiteSpace: "nowrap", width: "max-content" }} className="fg-marquee">
          {Array.from({ length: 2 }).map((_, k) => (
            <React.Fragment key={k}>
              {[
                "a tool for triaging your on-call alerts",
                "a tool for reviewing your team's PRs",
                "a tool for tracking what you read",
                "a tool for grooming your Linear backlog",
                "a tool for summarising your Slack standups",
                "a tool for spotting AWS cost anomalies",
                "a tool for testing your local endpoints",
                "a tool for ◇◇◇◇◇",
              ].map((s, i) => (
                <span key={`${k}-${i}`} className="fg-serif" style={{ fontSize: 26, fontStyle: "italic", color: p.muted }}>
                  {s} <span style={{ color: p.accent }}>·</span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ============== REGISTRY / NPM ============== */}
      <section id="registry" style={{ padding: "96px 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <div className="fg-tag" style={{ marginBottom: 18 }}>§01 · Sharing</div>
            <h2 className="fg-serif" style={{ fontSize: 64, lineHeight: 1.0, margin: "0 0 24px", letterSpacing: "-0.01em" }}>
              The registry is<br /><em style={{ color: p.accent }}>npm</em>. We didn't<br />build one.
            </h2>
            <p style={{ fontSize: 18, lineHeight: 1.55, color: p.muted, margin: "0 0 16px", maxWidth: 540 }}>
              A companion is just a set of exports following a stable contract. Source it from a folder. Source it from npm. Same contract.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.55, color: p.muted, margin: 0, maxWidth: 540 }}>
              npm is already globally replicated, versioned, permissioned, and familiar. Private packages? Already work. Org-scoped? Already work. We just reserved the prefix.
            </p>

            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Local", "companions/<name>/", "your hand-written or Build-scaffolded ones"],
                ["Published", "claudepanion-<name>", "drop-in from the npm registry"],
                ["Official", "@claudepanion/<name>", "scoped, blessed, curated"],
              ].map(([k, code, desc]) => (
                <div key={k} style={{
                  display: "grid", gridTemplateColumns: "100px 1fr 1.4fr", gap: 16, alignItems: "center",
                  padding: "12px 0", borderBottom: `1px dashed ${p.ink}1a`,
                }}>
                  <span className="fg-mono" style={{ fontSize: 11, color: p.accent, letterSpacing: ".08em", textTransform: "uppercase" }}>{k}</span>
                  <span className="fg-mono" style={{ fontSize: 14 }}>{code}</span>
                  <span style={{ fontSize: 13, color: p.muted }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <RegistryDoodle p={p} />
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section id="faq" style={{ padding: "96px 56px 64px", background: p.soft, borderTop: `1px solid ${p.ink}14` }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 64 }}>
          <div>
            <div className="fg-tag" style={{ marginBottom: 18 }}>§02 · FAQ</div>
            <h2 className="fg-serif" style={{ fontSize: 64, lineHeight: 1.0, margin: 0, letterSpacing: "-0.01em" }}>
              Things people<br /><em style={{ color: p.accent }}>actually ask</em>.
            </h2>
          </div>
          <div>
            {C.faq.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} p={p} idx={i + 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section style={{ padding: "120px 56px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <h2 className="fg-serif" style={{ fontSize: 96, lineHeight: .95, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
          Bring an idea.
          <br /><em style={{ color: p.accent }}>Claude builds it.</em>
        </h2>
        <p style={{ fontSize: 19, color: p.muted, margin: "0 0 36px" }}>
          Run it locally. Throw it away when you're done. Or don't.
        </p>
        <a className="fg-btn" href="#install" style={{ fontSize: 16, padding: "16px 28px" }}>
          git clone github.com/you/claudepanion →
        </a>
      </section>

      {/* ============== FOOTER ============== */}
      <footer style={{ padding: "32px 56px", borderTop: `1px solid ${p.ink}14`, display: "flex", justifyContent: "space-between", alignItems: "center", color: p.muted, fontSize: 13, gap: 16, flexWrap: "wrap" }}>
        <span className="fg-serif" style={{ fontStyle: "italic", fontSize: 18 }}>claudepanion</span>
        <span style={{ fontSize: 11, color: p.muted, textAlign: "center", flex: 1 }}>An independent open-source project. Not affiliated with, endorsed by, or sponsored by Anthropic.</span>
        <span className="fg-mono" style={{ fontSize: 11 }}>built for an audience of one · v0.1</span>
      </footer>
    </div>
  );
};

const FaqItem = ({ q, a, p, idx }) => {
  const [open, setOpen] = React.useState(idx === 1);
  return (
    <div style={{ borderTop: `1px solid ${p.ink}1a` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", textAlign: "left", padding: "20px 0", background: "none", border: 0,
          display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", color: p.ink,
        }}
      >
        <span style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
          <span className="fg-mono" style={{ fontSize: 11, color: p.muted, width: 24 }}>{String(idx).padStart(2, "0")}</span>
          <span className="fg-serif" style={{ fontSize: 24, lineHeight: 1.2 }}>{q}</span>
        </span>
        <span className="fg-serif" style={{ fontSize: 28, color: p.accent, transition: "transform .2s ease", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      {open && (
        <div className="fg-fade-in" style={{ paddingLeft: 40, paddingBottom: 24, fontSize: 16, lineHeight: 1.6, color: p.muted }}>
          {a}
        </div>
      )}
    </div>
  );
};

// ====== Hand-drawn-ish illustrations ======

const CompanionZoo = ({ p }) => (
  <svg viewBox="0 0 480 520" width="100%" height="100%" style={{ overflow: "visible" }}>
    <defs>
      <pattern id="dots-a" width="6" height="6" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="0.7" fill={p.ink} opacity="0.18" />
      </pattern>
    </defs>

    {/* Big circle frame */}
    <circle cx="240" cy="260" r="220" fill={p.soft} />
    <circle cx="240" cy="260" r="220" fill="url(#dots-a)" />
    <circle cx="240" cy="260" r="220" fill="none" stroke={p.ink} strokeWidth="1" strokeDasharray="3 4" opacity="0.3" />

    {/* Center: the host */}
    <g transform="translate(180, 200)">
      <rect x="0" y="0" width="120" height="100" rx="6" fill={p.bg} stroke={p.ink} strokeWidth="1.5" />
      <rect x="0" y="0" width="120" height="22" rx="6" fill={p.ink} />
      <circle cx="10" cy="11" r="2" fill="#E36658" />
      <circle cx="18" cy="11" r="2" fill="#E5A24A" />
      <circle cx="26" cy="11" r="2" fill="#7BAE6B" />
      <text x="60" y="58" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="22" fontStyle="italic" fill={p.ink}>host</text>
      <text x="60" y="80" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill={p.muted}>localhost:3001</text>
    </g>

    {/* Companion: PR reviewer */}
    <g transform="translate(60, 80)">
      <rect x="0" y="0" width="110" height="78" rx="6" fill={p.bg} stroke={p.ink} strokeWidth="1.4" transform="rotate(-6 55 39)" />
      <text x="55" y="32" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="18" fontStyle="italic" fill={p.ink} transform="rotate(-6 55 39)">PRs</text>
      <text x="55" y="52" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill={p.muted} transform="rotate(-6 55 39)">github_get_diff()</text>
      <circle cx="20" cy="20" r="4" fill={p.accent} transform="rotate(-6 55 39)" />
    </g>
    <path d="M170 130 Q 200 175 232 220" stroke={p.ink} strokeWidth="1" fill="none" strokeDasharray="3 4" opacity="0.5" />

    {/* Companion: oncall */}
    <g transform="translate(330, 70)">
      <rect x="0" y="0" width="110" height="78" rx="6" fill={p.bg} stroke={p.ink} strokeWidth="1.4" transform="rotate(7 55 39)" />
      <text x="55" y="32" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="18" fontStyle="italic" fill={p.ink} transform="rotate(7 55 39)">oncall</text>
      <text x="55" y="52" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill={p.muted} transform="rotate(7 55 39)">query_logs()</text>
      <circle cx="92" cy="22" r="4" fill={p.sage} transform="rotate(7 55 39)" />
    </g>
    <path d="M340 130 Q 310 175 280 220" stroke={p.ink} strokeWidth="1" fill="none" strokeDasharray="3 4" opacity="0.5" />

    {/* Companion: reading */}
    <g transform="translate(40, 350)">
      <rect x="0" y="0" width="110" height="78" rx="6" fill={p.bg} stroke={p.ink} strokeWidth="1.4" transform="rotate(4 55 39)" />
      <text x="55" y="32" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="18" fontStyle="italic" fill={p.ink} transform="rotate(4 55 39)">reading</text>
      <text x="55" y="52" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill={p.muted} transform="rotate(4 55 39)">log_book()</text>
      <circle cx="22" cy="60" r="4" fill={p.accent} transform="rotate(4 55 39)" />
    </g>
    <path d="M150 380 Q 195 350 235 310" stroke={p.ink} strokeWidth="1" fill="none" strokeDasharray="3 4" opacity="0.5" />

    {/* Companion: Linear */}
    <g transform="translate(330, 360)">
      <rect x="0" y="0" width="110" height="78" rx="6" fill={p.bg} stroke={p.ink} strokeWidth="1.4" transform="rotate(-5 55 39)" />
      <text x="55" y="32" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="18" fontStyle="italic" fill={p.ink} transform="rotate(-5 55 39)">Linear</text>
      <text x="55" y="52" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill={p.muted} transform="rotate(-5 55 39)">groom()</text>
      <circle cx="90" cy="58" r="4" fill={p.sage} transform="rotate(-5 55 39)" />
    </g>
    <path d="M335 380 Q 305 345 275 310" stroke={p.ink} strokeWidth="1" fill="none" strokeDasharray="3 4" opacity="0.5" />

    {/* Floating Claude */}
    <g transform="translate(390, 240)">
      <circle cx="0" cy="0" r="22" fill={p.accent} />
      <text x="0" y="5" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="20" fontStyle="italic" fill={p.bg}>C</text>
    </g>
    <path d="M370 245 Q 340 250 305 250" stroke={p.accent} strokeWidth="1.5" fill="none" />
    <text x="335" y="240" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill={p.accent}>MCP</text>
  </svg>
);

const ThesisDoodle = ({ p }) => (
  <svg viewBox="0 0 280 200" width="100%" style={{ maxWidth: 320 }}>
    {/* Old curve: cost over time, flat-high */}
    <text x="14" y="20" fontFamily="JetBrains Mono, monospace" fontSize="10" fill={p.muted}>cost of one tool ↑</text>
    <line x1="20" y1="180" x2="260" y2="180" stroke={p.ink} strokeWidth="1" />
    <line x1="20" y1="20" x2="20" y2="180" stroke={p.ink} strokeWidth="1" />
    <text x="260" y="195" textAnchor="end" fontFamily="JetBrains Mono, monospace" fontSize="10" fill={p.muted}>time →</text>

    <path d="M30 60 Q 90 55 150 65 Q 200 72 250 70" fill="none" stroke={p.ink} strokeWidth="1.5" strokeDasharray="4 3" />
    <text x="50" y="50" fontFamily="Instrument Serif, serif" fontSize="14" fontStyle="italic" fill={p.muted}>old: ━━━ flat & high</text>

    <path d="M30 70 Q 100 80 160 130 Q 200 165 250 172" fill="none" stroke={p.accent} strokeWidth="2" />
    <text x="155" y="158" fontFamily="Instrument Serif, serif" fontSize="14" fontStyle="italic" fill={p.accent}>new: ↘ AI</text>
    <circle cx="250" cy="172" r="3.5" fill={p.accent} />
  </svg>
);

const RegistryDoodle = ({ p }) => (
  <svg viewBox="0 0 480 480" width="100%" style={{ maxWidth: 480 }}>
    {/* Boxes orbiting npm */}
    <circle cx="240" cy="240" r="200" fill="none" stroke={p.ink} strokeWidth="1" strokeDasharray="3 5" opacity="0.3" />
    <circle cx="240" cy="240" r="120" fill="none" stroke={p.ink} strokeWidth="1" strokeDasharray="3 5" opacity="0.3" />

    {/* npm node */}
    <g transform="translate(240,240)">
      <circle r="58" fill={p.ink} />
      <text textAnchor="middle" y="-2" fontFamily="JetBrains Mono, monospace" fontSize="11" fill={p.bg} opacity="0.6">registry</text>
      <text textAnchor="middle" y="14" fontFamily="Instrument Serif, serif" fontSize="22" fontStyle="italic" fill={p.bg}>npm</text>
    </g>

    {/* Packages */}
    {[
      { x: 80,  y: 120, name: "claudepanion-pr-reviewer", rot: -6 },
      { x: 360, y: 110, name: "@claudepanion/oncall", rot: 5 },
      { x: 80,  y: 360, name: "claudepanion-reading", rot: 4 },
      { x: 360, y: 380, name: "claudepanion-slack-summary", rot: -5 },
      { x: 220, y: 60,  name: "claudepanion-cost-watcher", rot: 2 },
      { x: 220, y: 420, name: "claudepanion-endpoint-tester", rot: -3 },
    ].map((pkg, i) => (
      <g key={i} transform={`translate(${pkg.x}, ${pkg.y}) rotate(${pkg.rot})`}>
        <rect x="-70" y="-18" width="140" height="36" rx="4" fill={p.bg} stroke={p.ink} strokeWidth="1.2" />
        <text textAnchor="middle" y="5" fontFamily="JetBrains Mono, monospace" fontSize="10" fill={p.ink}>{pkg.name}</text>
        <line x1={pkg.x > 240 ? -70 : 70} y1="0" x2={pkg.x > 240 ? -150 : 150} y2={pkg.y > 240 ? -100 : 100} stroke={p.ink} strokeWidth="0.8" opacity="0.3" strokeDasharray="2 3" />
      </g>
    ))}

    {/* Local box */}
    <g transform="translate(240, 240)">
      <circle r="92" fill="none" stroke={p.accent} strokeWidth="1.5" strokeDasharray="2 4" />
    </g>
    <text x="240" y="158" textAnchor="middle" fontFamily="Instrument Serif, serif" fontSize="14" fontStyle="italic" fill={p.accent}>your machine ↑</text>
  </svg>
);

window.FieldGuide = FieldGuide;
