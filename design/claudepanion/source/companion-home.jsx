// Generic companion home page — /c/:slug
// This is the shell every companion (except Build's special-case) uses.
// Shows: companion header, CTA row, entity list.
// Two states: empty (no runs yet) and populated (a few past runs).
// Two directions: A (editorial) and B (dashboard/terminal).
//
// Example companion: "github-pr-reviewer" — entity kind, installed from Build.

const CPG_PALETTE = (theme) => ({
  warm: { bg: "#F5EFE6", ink: "#1B1814", muted: "#6B6157", accent: "#C8553D", soft: "#E8DFD0", paper: "#FAF5EC", sage: "#7A8B7A", border: "#1B181420", code: "#1C1917", codefg: "#D6CDC4" },
  cool: { bg: "#F1F2F1", ink: "#15181A", muted: "#5C6266", accent: "#3D6FB8", soft: "#DDE2DE", paper: "#F6F7F4", sage: "#7A8788", border: "#15181A20", code: "#181C1E", codefg: "#C8D0D4" },
  dark: { bg: "#1B1814", ink: "#F5EFE6", muted: "#9A8F82", accent: "#E0826A", soft: "#2A2520", paper: "#1F1B16", sage: "#9DB09C", border: "#F5EFE614", code: "#0F0D0B", codefg: "#D6CDC4" },
  sage: { bg: "#EFEEE6", ink: "#1F2421", muted: "#5E6863", accent: "#B0493B", soft: "#DBDED0", paper: "#F6F5EE", sage: "#5C7A66", border: "#1F242114", code: "#181E1A", codefg: "#C4CEC6" },
})[theme] || {};

const COMPANION = {
  slug: "github-pr-reviewer",
  icon: "🔎",
  displayName: "GitHub PR reviewer",
  description: "Review a GitHub pull request — fetch the diff and review comments, flag risky changes, suggest review questions. Read-only.",
  version: "0.1.0",
  kind: "entity",
};

const PAST_RUNS = [
  { id: "gpr-c3f812", status: "completed", input: "PR #241 — refactor auth middleware in api/server.ts", when: "2h ago" },
  { id: "gpr-7a1e05", status: "completed", input: "PR #238 — add rate limiting to /api/entities endpoint", when: "yesterday" },
  { id: "gpr-b9d334", status: "running",   input: "PR #243 — migrate expense tracker to new artifact schema", when: "just now" },
  { id: "gpr-44f201", status: "error",     input: "PR #235 — update Vite config for new output paths", when: "3d ago" },
];

// ─── Shared sidebar ───────────────────────────────────────────────────────────
const CPGSidebarA = ({ p }) => (
  <aside style={{ background: p.paper, borderRight: `1px solid ${p.ink}14`, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 24, width: 240, flexShrink: 0 }}>
    <div style={{ padding: "4px 8px" }}>
      <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, fontStyle: "italic" }}>claudepanion</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.muted, marginTop: 2 }}>localhost:3001</div>
    </div>
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.muted, letterSpacing: ".12em", textTransform: "uppercase", padding: "0 8px 8px" }}>Core</div>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, color: p.ink, textDecoration: "none", fontSize: 14 }}>
        <span style={{ width: 22, height: 22, borderRadius: 5, background: p.ink, color: p.bg, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>B</span>
        <span>Build</span>
      </a>
    </div>
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.muted, letterSpacing: ".12em", textTransform: "uppercase", padding: "0 8px 8px" }}>Companions</div>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: p.sage + "22", color: p.ink, textDecoration: "none", fontSize: 14, borderLeft: `3px solid ${p.sage}` }}>
        <span style={{ fontSize: 18 }}>{COMPANION.icon}</span>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{COMPANION.displayName}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.muted }}>4</span>
      </a>
    </div>
    <div style={{ marginTop: "auto", padding: "10px 8px" }}>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", fontSize: 12, color: p.accent, textDecoration: "none" }}>
        <span>+</span> Install companion
      </a>
    </div>
    <div style={{ padding: "8px", fontSize: 10, color: p.muted, borderTop: `1px solid ${p.ink}10` }}>
      Not affiliated with Anthropic.
    </div>
  </aside>
);

const CPGSidebarB = ({ p }) => (
  <aside style={{ background: p.paper, borderRight: `1px solid ${p.ink}`, display: "flex", flexDirection: "column", width: 260, flexShrink: 0 }}>
    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${p.ink}`, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 10, height: 10, background: p.accent, borderRadius: 999 }} />
      <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>claudepanion</span>
      <span style={{ marginLeft: "auto", fontSize: 10, color: p.muted, fontFamily: "'JetBrains Mono', monospace" }}>:3001</span>
    </div>
    <div style={{ padding: "12px 8px" }}>
      <div style={{ padding: "0 10px 6px", fontSize: 10, color: p.muted, letterSpacing: ".15em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Core</div>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", color: p.ink, textDecoration: "none", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
        <span style={{ width: 18, height: 18, background: p.ink, color: p.bg, display: "grid", placeItems: "center", fontSize: 10 }}>B</span>
        <span>build</span>
      </a>
    </div>
    <div style={{ padding: "4px 8px" }}>
      <div style={{ padding: "0 10px 6px", fontSize: 10, color: p.muted, letterSpacing: ".15em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Companions</div>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: p.bg, border: `1px solid ${p.ink}`, borderLeft: `3px solid ${p.sage}`, color: p.ink, textDecoration: "none", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
        <span style={{ fontSize: 15 }}>{COMPANION.icon}</span>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{COMPANION.slug}</span>
        <span style={{ fontSize: 10, color: p.muted }}>4</span>
      </a>
    </div>
    <div style={{ marginTop: "auto", padding: "8px", borderTop: `1px solid ${p.ink}33` }}>
      <a href="#" style={{ display: "block", padding: "8px 10px", color: p.accent, textDecoration: "none", fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }}>
        $ install companion
      </a>
    </div>
    <div style={{ padding: "10px 16px", borderTop: `1px solid ${p.ink}`, fontSize: 10, color: p.muted, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>
      // not affiliated with anthropic
    </div>
  </aside>
);

// ─── Status pill shared ───────────────────────────────────────────────────────
const CPGPill = ({ status, p, mono = false }) => {
  const cfg = {
    pending:   { bg: p.soft,           color: p.muted,  label: "pending"   },
    running:   { bg: p.accent + "1a",  color: p.accent, label: "running"   },
    completed: { bg: p.sage + "22",    color: p.sage,   label: "completed" },
    error:     { bg: p.accent + "14",  color: p.accent, label: "error"     },
  }[status] || { bg: p.soft, color: p.muted, label: status };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px",
      borderRadius: mono ? 0 : 999, background: cfg.bg, color: cfg.color,
      fontSize: 11, fontFamily: mono ? "'JetBrains Mono', monospace" : "'JetBrains Mono', monospace",
      border: mono ? `1px solid ${cfg.color}44` : "none", whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: cfg.color }} />
      {cfg.label}
    </span>
  );
};

// ─── DIRECTION A · Editorial ──────────────────────────────────────────────────
const CompanionHomeEditorial = ({ theme = "sage", populated = true }) => {
  const p = CPG_PALETTE(theme);
  const runs = populated ? PAST_RUNS : [];

  return (
    <div style={{ background: p.bg, color: p.ink, minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif", display: "flex" }}>
      <style>{`
        .cpga-serif { font-family: 'Instrument Serif', Georgia, serif; }
        .cpga-mono  { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .cpga-row:hover { background: ${p.paper}; }
        .cpga-row { transition: background .12s ease; }
        .cpga-btn { cursor: pointer; transition: background .12s ease, border-color .12s ease; font-family: inherit; }
      `}</style>

      <CPGSidebarA p={p} />

      <main style={{ flex: 1, padding: "32px 48px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: p.muted, marginBottom: 20, display: "flex", gap: 6 }}>
          <span>claudepanion</span><span style={{ opacity: .4 }}>›</span>
          <span style={{ color: p.ink }}>{COMPANION.displayName}</span>
        </div>

        {/* Companion header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, gap: 20 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ width: 56, height: 56, background: p.soft, border: `1px solid ${p.ink}14`, borderRadius: 10, display: "grid", placeItems: "center", fontSize: 26, flexShrink: 0 }}>
              {COMPANION.icon}
            </div>
            <div>
              <h1 className="cpga-serif" style={{ fontSize: 40, lineHeight: 1.05, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                {COMPANION.displayName}
              </h1>
              <p style={{ margin: "0 0 8px", fontSize: 14, color: p.muted, lineHeight: 1.5, maxWidth: 560 }}>
                {COMPANION.description}
              </p>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span className="cpga-mono" style={{ fontSize: 10, color: p.muted, background: p.soft, padding: "3px 8px", borderRadius: 4 }}>v{COMPANION.version}</span>
                <span className="cpga-mono" style={{ fontSize: 10, color: p.muted }}>entity · {populated ? runs.length : 0} runs</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 10, flexShrink: 0, alignItems: "center" }}>
            <button className="cpga-btn" style={{ padding: "9px 16px", background: "transparent", border: `1px solid ${p.ink}26`, borderRadius: 999, fontSize: 13, color: p.ink }}>
              🔨 Iterate with Build
            </button>
            <button className="cpga-btn" style={{ padding: "9px 18px", background: p.ink, border: 0, borderRadius: 999, fontSize: 13, color: p.bg, fontWeight: 500 }}>
              + New run
            </button>
          </div>
        </div>

        {/* Entity list / empty state */}
        {runs.length === 0 ? (
          /* ── EMPTY STATE ── */
          <div style={{ textAlign: "center", padding: "60px 32px", border: `1px dashed ${p.ink}26`, borderRadius: 10 }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>{COMPANION.icon}</div>
            <h2 className="cpga-serif" style={{ fontSize: 32, margin: "0 0 10px" }}>No runs yet.</h2>
            <p style={{ fontSize: 14, color: p.muted, margin: "0 0 24px", lineHeight: 1.55, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
              Start a new run and fill out the form. Claude Code will pick it up when you run the slash command.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="cpga-btn" style={{ padding: "10px 22px", background: p.ink, border: 0, borderRadius: 999, fontSize: 14, color: p.bg, fontWeight: 500 }}>
                + New run
              </button>
              <button className="cpga-btn" style={{ padding: "10px 16px", background: "transparent", border: `1px solid ${p.ink}26`, borderRadius: 999, fontSize: 13, color: p.muted }}>
                🔨 Iterate with Build
              </button>
            </div>
          </div>
        ) : (
          /* ── ENTITY LIST ── */
          <div style={{ border: `1px solid ${p.ink}14`, borderRadius: 8, overflow: "hidden" }}>
            {/* List header */}
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 120px 90px", padding: "10px 18px", background: p.paper, borderBottom: `1px solid ${p.ink}10`, fontSize: 11, color: p.muted, fontWeight: 500 }}>
              <span>Status</span><span>Description</span><span style={{ textAlign: "right" }}>ID</span><span style={{ textAlign: "right" }}>Updated</span>
            </div>
            {runs.map((r, i) => (
              <a key={r.id} href="#" className="cpga-row" style={{
                display: "grid", gridTemplateColumns: "110px 1fr 120px 90px",
                padding: "14px 18px", alignItems: "center", gap: 12,
                borderBottom: i < runs.length - 1 ? `1px dashed ${p.ink}10` : 0,
                textDecoration: "none", color: p.ink, fontSize: 14,
              }}>
                <CPGPill status={r.status} p={p} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: r.status === "error" ? p.muted : p.ink }}>
                  {r.input}
                </span>
                <span className="cpga-mono" style={{ fontSize: 11, color: p.muted, textAlign: "right" }}>{r.id}</span>
                <span style={{ fontSize: 12, color: p.muted, textAlign: "right" }}>{r.when}</span>
              </a>
            ))}
          </div>
        )}

        {/* Footer hint */}
        {populated && (
          <div style={{ marginTop: 18, fontSize: 12, color: p.muted }}>
            Showing {runs.length} runs · <a href="#" style={{ color: p.accent, textDecoration: "none" }}>show all</a>
          </div>
        )}
      </main>
    </div>
  );
};

// ─── DIRECTION B · Dashboard/Terminal ─────────────────────────────────────────
const CompanionHomeDashboard = ({ theme = "sage", populated = true }) => {
  const p = CPG_PALETTE(theme);
  const runs = populated ? PAST_RUNS : [];

  return (
    <div style={{ background: p.bg, color: p.ink, minHeight: "100%", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 13, display: "flex" }}>
      <style>{`
        .cpgb-sans  { font-family: 'Inter', system-ui, sans-serif; }
        .cpgb-serif { font-family: 'Instrument Serif', Georgia, serif; }
        .cpgb-row:hover { background: ${p.soft}; cursor: pointer; }
        .cpgb-btn { cursor: pointer; font-family: inherit; transition: background .12s; }
      `}</style>

      <CPGSidebarB p={p} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ padding: "10px 24px", borderBottom: `1px solid ${p.ink}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: p.paper }}>
          <div style={{ fontSize: 12, color: p.muted }}>
            <span>~/</span><span style={{ color: p.ink }}>{COMPANION.slug}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="cpgb-btn" style={{ padding: "5px 12px", background: "transparent", border: `1px solid ${p.ink}44`, color: p.muted, fontSize: 11 }}>
              🔨 iterate with build
            </button>
            <button className="cpgb-btn" style={{ padding: "5px 12px", background: p.ink, border: `1px solid ${p.ink}`, color: p.bg, fontSize: 11 }}>
              $ new run
            </button>
          </div>
        </div>

        <div style={{ padding: "24px 28px 60px" }}>
          {/* Companion header */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 24, paddingBottom: 20, borderBottom: `1px dashed ${p.ink}33` }}>
            <div style={{ width: 48, height: 48, background: p.soft, border: `1px solid ${p.ink}`, display: "grid", placeItems: "center", fontSize: 22, flexShrink: 0 }}>
              {COMPANION.icon}
            </div>
            <div>
              <h1 className="cpgb-serif" style={{ fontSize: 38, lineHeight: 1.0, margin: "0 0 6px", color: p.ink }}>
                {COMPANION.displayName}
              </h1>
              <p className="cpgb-sans" style={{ margin: "0 0 8px", fontSize: 13, color: p.muted, lineHeight: 1.5, maxWidth: 560 }}>
                {COMPANION.description}
              </p>
              <div style={{ display: "flex", gap: 14, fontSize: 10, color: p.muted }}>
                <span>v{COMPANION.version}</span>
                <span>entity</span>
                <span>{populated ? runs.length : 0} runs</span>
              </div>
            </div>
          </div>

          {/* Entity list / empty state */}
          {runs.length === 0 ? (
            <div style={{ border: `1px dashed ${p.ink}44`, padding: "40px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{COMPANION.icon}</div>
              <div className="cpgb-serif" style={{ fontSize: 28, marginBottom: 8 }}>No runs yet.</div>
              <p className="cpgb-sans" style={{ fontSize: 13, color: p.muted, margin: "0 0 20px", lineHeight: 1.55, maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
                Start a new run and fill out the form. Claude picks it up when you paste the slash command.
              </p>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button className="cpgb-btn" style={{ padding: "8px 18px", background: p.ink, border: `1px solid ${p.ink}`, color: p.bg, fontSize: 12 }}>
                  $ new run
                </button>
                <button className="cpgb-btn" style={{ padding: "8px 14px", background: "transparent", border: `1px solid ${p.ink}44`, color: p.muted, fontSize: 12 }}>
                  🔨 iterate with build
                </button>
              </div>
            </div>
          ) : (
            <div style={{ border: `1px solid ${p.ink}` }}>
              {/* Header row */}
              <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 110px 80px", padding: "8px 14px", background: p.ink, color: p.bg, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase" }}>
                <span>status</span><span>description</span><span>id</span><span style={{ textAlign: "right" }}>updated</span>
              </div>
              {runs.map((r, i) => (
                <div key={r.id} className="cpgb-row" style={{
                  display: "grid", gridTemplateColumns: "100px 1fr 110px 80px",
                  padding: "12px 14px", gap: 12, alignItems: "center", fontSize: 12,
                  borderBottom: i < runs.length - 1 ? `1px dashed ${p.ink}33` : 0,
                }}>
                  <CPGPill status={r.status} p={p} mono />
                  <span className="cpgb-sans" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: r.status === "error" ? p.muted : p.ink }}>
                    {r.input}
                  </span>
                  <span style={{ color: p.muted, fontSize: 11 }}>{r.id}</span>
                  <span className="cpgb-sans" style={{ fontSize: 11, color: p.muted, textAlign: "right" }}>{r.when}</span>
                </div>
              ))}
            </div>
          )}

          {populated && (
            <div style={{ marginTop: 10, fontSize: 10, color: p.muted }}>
              {runs.length} runs · <a href="#" style={{ color: p.accent, textDecoration: "none" }}>show all</a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

window.CompanionHomeEditorial  = CompanionHomeEditorial;
window.CompanionHomeDashboard  = CompanionHomeDashboard;
