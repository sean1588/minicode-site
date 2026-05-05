// Direction B — "The Workbench"
// Terminal-forward, ASCII diagrams, ruled lines, technical density.
// Same warm palette, but composed like a man-page or a zine.

const Workbench = ({ tone = "verbose", theme = "warm" }) => {
  const C = window.COPY;
  const Sk = window.Sketch;
  const t = (terse, verbose) => (tone === "terse" ? terse : verbose);

  const palettes = {
    warm: { bg: "#F2EADE", ink: "#1C1814", muted: "#6B5F52", accent: "#C8553D", soft: "#E5DAC6", paper: "#FAF5EC", sage: "#7A8B7A" },
    cool: { bg: "#EDEEEC", ink: "#13171A", muted: "#5C6266", accent: "#3D6FB8", soft: "#DCE0DA", paper: "#F6F7F4", sage: "#7A8788" },
    dark: { bg: "#161311", ink: "#F2EADE", muted: "#9A8F82", accent: "#E0826A", soft: "#221E19", paper: "#1F1B16", sage: "#9DB09C" },
    sage: { bg: "#EFEEE6", ink: "#1F2421", muted: "#5E6863", accent: "#B0493B", soft: "#DBDED0", paper: "#F6F5EE", sage: "#5C7A66" },
  };
  const p = palettes[theme] || palettes.warm;

  return (
    <div style={{
      background: p.bg,
      color: p.ink,
      minHeight: "100%",
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: 14,
      lineHeight: 1.6,
    }}>
      <style>{`
        .wb-mono  { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .wb-serif { font-family: 'Instrument Serif', Georgia, serif; }
        .wb-sans  { font-family: 'Inter', system-ui, sans-serif; }
        .wb-rule  { border: 0; border-top: 1px dashed ${p.ink}33; }
        .wb-hr-double { height: 6px; border-top: 1px solid ${p.ink}; border-bottom: 1px solid ${p.ink}; margin: 0; }
        .wb-link  { color: ${p.accent}; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
        .wb-link:hover { background: ${p.accent}; color: ${p.bg}; }
        .wb-btn   { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; background: ${p.ink}; color: ${p.bg}; text-decoration: none; font-size: 13px; border: 1px solid ${p.ink}; transition: all .15s ease; }
        .wb-btn:hover { background: ${p.accent}; border-color: ${p.accent}; }
        .wb-btn-ghost { background: transparent; color: ${p.ink}; }
        .wb-btn-ghost:hover { background: ${p.ink}; color: ${p.bg}; }
        .wb-tag   { display: inline-block; padding: 2px 8px; border: 1px solid ${p.ink}; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; }
        .wb-blink { animation: wbblink 1s steps(2) infinite; }
        @keyframes wbblink { 50% { opacity: 0; } }
        .wb-card  { background: ${p.paper}; border: 1px solid ${p.ink}; }
        .wb-pre   { white-space: pre; line-height: 1.45; font-size: 12px; }
        .wb-h-display { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; letter-spacing: -0.01em; }
        .wb-section-num { display: inline-block; padding: 2px 8px; background: ${p.ink}; color: ${p.bg}; font-size: 10px; letter-spacing: .15em; }
        .wb-row-hover:hover { background: ${p.soft}; }
        .wb-marker { background: ${p.accent}; color: ${p.bg}; padding: 0 4px; }
        .wb-fig-label { font-size: 10px; letter-spacing: .15em; text-transform: uppercase; color: ${p.muted}; }
      `}</style>

      {/* ============== TOP BAR ============== */}
      <header style={{ borderBottom: `1px solid ${p.ink}`, padding: "10px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", background: p.paper }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ width: 12, height: 12, background: p.accent, borderRadius: 999 }} />
          <span style={{ fontWeight: 600 }}>claudepanion(1)</span>
          <span style={{ color: p.muted, fontSize: 12 }}>— a localhost host for personal companions</span>
        </div>
        <nav style={{ display: "flex", gap: 24, fontSize: 12 }}>
          <a href="#registry" style={{ color: p.ink, textDecoration: "none" }}>§01 sharing</a>
          <a href="#faq"      style={{ color: p.ink, textDecoration: "none" }}>§02 faq</a>
        </nav>
      </header>

      {/* ============== HERO ============== */}
      <section style={{ padding: "48px 32px 32px", borderBottom: `1px solid ${p.ink}`, position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 48, alignItems: "start" }}>
          <div>
            <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
              <span className="wb-tag">v0.1.0</span>
              <span className="wb-tag" style={{ background: p.ink, color: p.bg }}>localhost only</span>
              <span className="wb-tag">claude-native</span>
            </div>

            <h1 className="wb-h-display" style={{ fontSize: 78, lineHeight: .98, margin: "0 0 24px" }}>
              Software,<br />
              <span style={{ fontStyle: "italic" }}>scaffolded</span> by<br />
              an agent, for<br />
              an audience<br />
              of <span className="wb-marker">one</span>.
            </h1>

            <p className="wb-sans" style={{ fontSize: 17, lineHeight: 1.55, color: p.muted, maxWidth: 540, margin: "0 0 28px" }}>
              {t(C.pitch_terse, C.pitch_verbose)}
            </p>

            <div style={{ display: "flex", gap: 10 }}>
              <a className="wb-btn" href="#install">$ git clone …</a>
              <a className="wb-btn wb-btn-ghost" href="#registry">read manpage →</a>
            </div>
          </div>

          {/* Terminal block */}
          <div id="install" className="wb-card" style={{ overflow: "hidden", boxShadow: `6px 6px 0 ${p.ink}` }}>
            <div style={{ padding: "8px 14px", borderBottom: `1px solid ${p.ink}`, fontSize: 11, color: p.muted, display: "flex", justifyContent: "space-between" }}>
              <span>~/projects/claudepanion — bash</span>
              <span>● ● ●</span>
            </div>
            <div style={{ padding: "18px 18px", fontSize: 12.5, lineHeight: 1.85, background: p.paper }}>
              <div><span style={{ color: p.muted }}>$</span> <span style={{ color: p.ink }}>git clone github.com/you/claudepanion</span></div>
              <div style={{ color: p.muted, paddingLeft: 16, fontSize: 11 }}>Cloning into 'claudepanion'... done.</div>
              <div><span style={{ color: p.muted }}>$</span> cd claudepanion && npm install</div>
              <div style={{ color: p.muted, paddingLeft: 16, fontSize: 11 }}>added 412 packages in 8s</div>
              <div><span style={{ color: p.muted }}>$</span> npm start</div>
              <div style={{ color: p.sage, paddingLeft: 16, fontSize: 11 }}>✓ host on http://localhost:3001</div>
              <div style={{ color: p.sage, paddingLeft: 16, fontSize: 11 }}>✓ MCP server at /mcp</div>
              <div style={{ color: p.sage, paddingLeft: 16, fontSize: 11 }}>✓ build companion mounted</div>
              <div style={{ marginTop: 8, color: p.muted, fontSize: 11 }}># open Claude Code in any repo, then:</div>
              <div style={{ color: p.accent }}>›  /build-companion <span className="wb-blink">▍</span></div>
              <hr className="wb-rule" style={{ margin: "10px 0" }} />
              <div style={{ fontSize: 11, color: p.muted }}>describe the tool you want, then paste the command back. Claude scaffolds it. Hot-reload picks it up.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== ASCII anatomy diagram ============== */}
      <section style={{ padding: "40px 32px", borderBottom: `1px solid ${p.ink}`, background: p.paper }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
          <span className="wb-fig-label">FIG. 1 — anatomy of one run</span>
          <span className="wb-fig-label">data flows ↓</span>
        </div>
        <pre className="wb-pre" style={{ margin: 0, color: p.ink }}>
{`   BROWSER                  HOST :3001                 CLAUDE CODE              EXTERNAL API
   ╔═══════╗                ╔══════════╗               ╔══════════╗            ╔══════════╗
   ║ form  ║──POST entity──►║  JSON    ║               ║          ║            ║          ║
   ║       ║◄──poll 2s─────►║  on disk ║◄────MCP──────►║  agent   ║──aws-sdk──►║  AWS     ║
   ║ logs  ║                ║  status  ║   (proxy)     ║          ║            ║  GitHub  ║
   ║ artifact◄──────────────╚══════════╝               ╚════╤═════╝            ║  Linear  ║
   ╚═══════╝                                                │                  ║  …       ║
                                              user pastes:  │                  ╚══════════╝
                                              /build-companion <id>
                                              /oncall-investigate <id>`}
        </pre>
        <p className="wb-sans" style={{ fontSize: 13, color: p.muted, margin: "16px 0 0", maxWidth: 720 }}>
          Two bright lines: <strong style={{ color: p.ink }}>UI ↔ REST</strong> reads JSON and renders. <strong style={{ color: p.ink }}>Claude ↔ MCP</strong> writes JSON and proxies to external systems with credentials that never leave your machine.
        </p>
      </section>

      {/* ============== REGISTRY ============== */}
      <section id="registry" style={{ padding: "72px 32px", borderBottom: `1px solid ${p.ink}` }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 28 }}>
          <span className="wb-section-num">§ 01</span>
          <span className="wb-fig-label">sharing</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
          <div>
            <h2 className="wb-h-display" style={{ fontSize: 56, lineHeight: 1.0, margin: "0 0 24px" }}>
              The registry is <span className="wb-marker">npm</span>.<br />We didn't build one.
            </h2>
            <p className="wb-sans" style={{ fontSize: 16, lineHeight: 1.6, color: p.muted, margin: "0 0 24px" }}>
              A companion is just a set of exports following a stable contract. Source it from a folder. Source it from npm. Same contract.
            </p>

            <pre className="wb-pre" style={{ background: p.paper, padding: 16, border: `1px solid ${p.ink}`, fontSize: 12, color: p.ink, margin: 0 }}>
{`# install a community companion
npm install claudepanion-pr-reviewer

# install an official one
npm install @claudepanion/oncall

# host rescans on next start.
# new sidebar entry appears.`}
            </pre>
          </div>

          <div>
            <pre className="wb-pre" style={{ margin: 0, fontSize: 11, color: p.ink, lineHeight: 1.5 }}>
{`         ┌──────────────────┐
         │  YOUR LOCALHOST  │
         │  :3001           │
         └────────┬─────────┘
                  │  reads from
       ┌──────────┴───────────┐
       ▼                      ▼
 ┌──────────┐          ┌──────────────┐
 │ companions/         │ node_modules │
 │ <name>/             │ claudepanion-│
 │                     │ <name>       │
 │ (local, hand-       │ (installed   │
 │  written or Build-  │  from npm)   │
 │  scaffolded)        │              │
 └──────────┘          └──────┬───────┘
                              │ npm install
                              ▼
                       ┌────────────┐
                       │  npmjs.com │
                       │  registry  │
                       └────────────┘`}
            </pre>
          </div>
        </div>

        <hr className="wb-rule" style={{ margin: "40px 0 24px" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { label: "01 contract", title: "Exports, not files", body: "A companion is whatever exports the manifest shape. Folder or npm package — same contract." },
            { label: "02 versioning", title: "Forward-compatible", body: "Each companion declares a claudepanionContract version. Host refuses anything it doesn't understand." },
            { label: "03 prefix", title: "claudepanion-*", body: "Reserved socially. Bare for community, @claudepanion/* for official. Discoverable via npm search." },
          ].map((c, i) => (
            <div key={i} className="wb-card" style={{ padding: 18, transition: "transform .2s ease" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translate(-2px, -2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "none"}
            >
              <div className="wb-fig-label" style={{ marginBottom: 6 }}>{c.label}</div>
              <div className="wb-h-display" style={{ fontSize: 22, lineHeight: 1.1, marginBottom: 8 }}>{c.title}</div>
              <p className="wb-sans" style={{ margin: 0, fontSize: 13, color: p.muted, lineHeight: 1.55 }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section id="faq" style={{ padding: "72px 32px", borderBottom: `1px solid ${p.ink}`, background: p.paper }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 28 }}>
          <span className="wb-section-num">§ 02</span>
          <span className="wb-fig-label">frequently asked</span>
        </div>

        <h2 className="wb-h-display" style={{ fontSize: 56, lineHeight: 1.0, margin: "0 0 36px" }}>
          Questions, with answers.
        </h2>

        <div style={{ borderTop: `1px solid ${p.ink}` }}>
          {C.faq.map((f, i) => <WbFaq key={i} f={f} idx={i + 1} p={p} />)}
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section style={{ padding: "80px 32px", borderBottom: `1px solid ${p.ink}` }}>
        <div className="wb-card" style={{ padding: "48px 40px", textAlign: "center", background: p.ink, color: p.bg, boxShadow: `8px 8px 0 ${p.accent}` }}>
          <div className="wb-fig-label" style={{ color: p.accent, marginBottom: 14 }}>END OF MANPAGE</div>
          <h2 className="wb-h-display" style={{ fontSize: 64, lineHeight: 1.0, margin: "0 0 18px" }}>
            Bring an idea.<br /><em>Claude builds it.</em>
          </h2>
          <p className="wb-sans" style={{ fontSize: 15, color: p.bg + "b3", margin: "0 0 28px" }}>
            One process. One URL. Many small personal apps. Throw them away when you're done — or don't.
          </p>
          <a href="#install" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "14px 22px", background: p.accent, color: p.bg, textDecoration: "none",
            fontSize: 14, border: `1px solid ${p.accent}`,
          }}>
            $ git clone github.com/you/claudepanion
          </a>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer style={{ padding: "20px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: p.muted, gap: 16, flexWrap: "wrap" }}>
        <span>claudepanion(1) · v0.1.0 · built for an audience of one</span>
        <span style={{ flex: 1, textAlign: "center" }}>independent open-source project · not affiliated with anthropic</span>
        <span>localhost ⊙ never the cloud</span>
      </footer>
    </div>
  );
};

const WbFaq = ({ f, idx, p }) => {
  const [open, setOpen] = React.useState(idx === 1);
  return (
    <div style={{ borderBottom: `1px dashed ${p.ink}33` }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", textAlign: "left", padding: "16px 0", background: "none", border: 0, cursor: "pointer", color: p.ink,
        display: "grid", gridTemplateColumns: "60px 1fr 24px", alignItems: "center", gap: 16,
      }}>
        <span className="wb-mono" style={{ fontSize: 11, color: p.muted }}>Q.{String(idx).padStart(2, "0")}</span>
        <span className="wb-h-display" style={{ fontSize: 22, lineHeight: 1.2 }}>{f.q}</span>
        <span style={{ fontSize: 18, color: p.accent, transition: "transform .2s ease", transform: open ? "rotate(45deg)" : "none", justifySelf: "end" }}>+</span>
      </button>
      {open && (
        <div className="wb-sans" style={{ paddingLeft: 76, paddingBottom: 20, paddingRight: 40, fontSize: 14, lineHeight: 1.6, color: p.muted }}>
          {f.a}
        </div>
      )}
    </div>
  );
};

window.Workbench = Workbench;
