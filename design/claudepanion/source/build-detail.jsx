// Entity detail page — all 4 states of a Build run
// Route: /c/build/:id
// States: pending | running | completed | error
// Two directions: A (editorial) and B (dashboard/terminal)

const DETAIL_PALETTE = (theme) => ({
  warm: { bg: "#F5EFE6", ink: "#1B1814", muted: "#6B6157", accent: "#C8553D", soft: "#E8DFD0", paper: "#FAF5EC", sage: "#7A8B7A", border: "#1B181420", code: "#1C1917", codefg: "#D6CDC4" },
  cool: { bg: "#F1F2F1", ink: "#15181A", muted: "#5C6266", accent: "#3D6FB8", soft: "#DDE2DE", paper: "#F6F7F4", sage: "#7A8788", border: "#15181A20", code: "#181C1E", codefg: "#C8D0D4" },
  dark: { bg: "#1B1814", ink: "#F5EFE6", muted: "#9A8F82", accent: "#E0826A", soft: "#2A2520", paper: "#1F1B16", sage: "#9DB09C", border: "#F5EFE614", code: "#0F0D0B", codefg: "#D6CDC4" },
  sage: { bg: "#EFEEE6", ink: "#1F2421", muted: "#5E6863", accent: "#B0493B", soft: "#DBDED0", paper: "#F6F5EE", sage: "#5C7A66", border: "#1F242114", code: "#181E1A", codefg: "#C4CEC6" },
})[theme] || {};

// ─── Shared sidebar & chrome ──────────────────────────────────────────────────
const DetailSidebarA = ({ p }) => (
  <aside style={{ background: p.paper, borderRight: `1px solid ${p.ink}14`, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 24 }}>
    <div style={{ padding: "4px 8px" }}>
      <div style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 22, fontStyle: "italic" }}>claudepanion</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.muted, marginTop: 2 }}>localhost:3001</div>
    </div>
    <div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.muted, letterSpacing: ".12em", textTransform: "uppercase", padding: "0 8px 8px" }}>Core</div>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: p.sage + "26", color: p.ink, textDecoration: "none", fontSize: 14, borderLeft: `3px solid ${p.sage}` }}>
        <span style={{ width: 22, height: 22, borderRadius: 5, background: p.ink, color: p.bg, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>B</span>
        <span>Build</span>
      </a>
    </div>
    <div style={{ marginTop: "auto", padding: "10px 8px", fontSize: 10, color: p.muted, borderTop: `1px solid ${p.ink}10` }}>
      Not affiliated with Anthropic.
    </div>
  </aside>
);

const DetailSidebarB = ({ p }) => (
  <aside style={{ background: p.paper, borderRight: `1px solid ${p.ink}`, display: "flex", flexDirection: "column" }}>
    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${p.ink}`, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 10, height: 10, background: p.accent, borderRadius: 999 }} />
      <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>claudepanion</span>
      <span style={{ marginLeft: "auto", fontSize: 10, color: p.muted, fontFamily: "'JetBrains Mono', monospace" }}>:3001</span>
    </div>
    <div style={{ padding: "12px 8px" }}>
      <div style={{ padding: "0 10px 6px", fontSize: 10, color: p.muted, letterSpacing: ".15em", textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Core</div>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: p.bg, border: `1px solid ${p.ink}`, borderLeft: `3px solid ${p.sage}`, color: p.ink, textDecoration: "none", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
        <span style={{ width: 18, height: 18, background: p.ink, color: p.bg, display: "grid", placeItems: "center", fontSize: 10 }}>B</span>
        <span>build</span>
      </a>
    </div>
    <div style={{ marginTop: "auto", padding: "10px 16px", borderTop: `1px solid ${p.ink}`, fontSize: 10, color: p.muted, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>
      // not affiliated with anthropic
    </div>
  </aside>
);

// ─── Shared log entries for the running/completed mock ────────────────────────
const MOCK_LOGS = [
  { t: "10:42:01", level: "info", msg: "build_get — loaded entity build-f05218" },
  { t: "10:42:01", level: "info", msg: "build_update_status — running" },
  { t: "10:42:03", level: "info", msg: "build_append_log — reading companion template files" },
  { t: "10:42:05", level: "info", msg: "build_append_log — drafting manifest.ts + types.ts" },
  { t: "10:42:11", level: "info", msg: "build_append_log — writing companions/github-pr-reviewer/" },
  { t: "10:42:18", level: "info", msg: "build_append_log — writing skills/github-pr-reviewer/SKILL.md" },
  { t: "10:42:22", level: "info", msg: "build_append_log — running validator" },
  { t: "10:42:24", level: "info", msg: "build_append_log — validator passed" },
  { t: "10:42:25", level: "info", msg: "build_append_log — running smoke test" },
  { t: "10:42:29", level: "info", msg: "build_append_log — smoke test passed" },
  { t: "10:42:30", level: "info", msg: "build_save_artifact — artifact saved" },
  { t: "10:42:30", level: "info", msg: "build_update_status — completed" },
];

// ─── DIRECTION A — Editorial ──────────────────────────────────────────────────
const DetailPageA = ({ theme = "sage", state = "pending" }) => {
  const p = DETAIL_PALETTE(theme);
  const entityId = "build-f05218";
  const companionName = "github-pr-reviewer";

  return (
    <div style={{ background: p.bg, color: p.ink, minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif", display: "grid", gridTemplateColumns: "240px 1fr" }}>
      <style>{`
        .da-serif { font-family: 'Instrument Serif', Georgia, serif; }
        .da-mono  { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .da-panel { border: 1px solid ${p.ink}14; border-radius: 8px; overflow: hidden; margin-bottom: 14px; }
        .da-panel-hd { padding: 11px 16px; border-bottom: 1px solid ${p.ink}10; font-weight: 600; font-size: 13px; display: flex; justify-content: space-between; align-items: center; background: ${p.paper}; }
        .da-panel-bd { padding: 14px 16px; }
        .da-pulse { display:inline-block; width:8px; height:8px; border-radius:999px; background:${p.sage}; animation: dapulse 2s infinite; }
        @keyframes dapulse { 0%{box-shadow:0 0 0 0 ${p.sage}55} 70%{box-shadow:0 0 0 8px transparent} 100%{box-shadow:0 0 0 0 transparent} }
        .da-running-dot { display:inline-block; width:8px; height:8px; border-radius:999px; background:${p.accent}; animation: dapulse 1.2s infinite; }
      `}</style>

      <DetailSidebarA p={p} />

      <main style={{ padding: "32px 48px 80px", overflow: "hidden" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: p.muted, marginBottom: 20, display: "flex", gap: 6, alignItems: "center" }}>
          <a href="#" style={{ color: p.muted, textDecoration: "none" }}>Build</a>
          <span style={{ opacity: .4 }}>›</span>
          <span style={{ color: p.ink }}>{entityId}</span>
        </div>

        {/* Page title */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, gap: 16 }}>
          <div>
            <h1 className="da-serif" style={{ fontSize: 40, lineHeight: 1.05, margin: "0 0 6px", letterSpacing: "-0.01em" }}>
              {companionName}
            </h1>
            <div className="da-mono" style={{ fontSize: 11, color: p.muted }}>
              {state === "pending"   && `Created just now · ID ${entityId}`}
              {state === "running"   && `Started 32s ago · ID ${entityId}`}
              {state === "completed" && `Completed · took 29s · ID ${entityId}`}
              {state === "error"     && `Failed · ran for 12s · ID ${entityId}`}
            </div>
          </div>
          {/* Status pill */}
          <span style={{
            padding: "5px 14px", borderRadius: 999, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap",
            background: state === "pending" ? p.soft : state === "running" ? p.accent + "1a" : state === "completed" ? p.sage + "22" : "#B0493B1a",
            color:      state === "pending" ? p.muted : state === "running" ? p.accent : state === "completed" ? p.sage : p.accent,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: "currentColor" }} />
            {state}
          </span>
        </div>

        {/* ── PENDING ─────────────────────────────── */}
        {state === "pending" && (
          <>
            {/* Slash command — HERO */}
            <div style={{ background: `linear-gradient(160deg, ${p.sage}14 0%, ${p.sage}08 100%)`, border: `1px solid ${p.sage}44`, borderRadius: 10, padding: "22px 24px", marginBottom: 16 }}>
              <div className="da-mono" style={{ fontSize: 10, color: p.sage, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 6 }}>Hand off to Claude</div>
              <div style={{ fontSize: 14, color: p.ink, marginBottom: 14, lineHeight: 1.45 }}>
                Paste this in Claude Code to start work on this companion:
              </div>
              <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
                <div style={{ flex: 1, background: p.code, color: p.codefg, borderRadius: 7, padding: "13px 16px", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, display: "flex", alignItems: "center" }}>
                  /build-companion {entityId}
                </div>
                <button style={{ background: p.ink, color: p.bg, border: 0, borderRadius: 7, padding: "0 20px", fontWeight: 600, cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" }}>
                  📋 Copy
                </button>
              </div>
              <div style={{ marginTop: 12, padding: "10px 14px", background: p.paper, borderLeft: `3px solid ${p.sage}`, borderRadius: 4, fontSize: 12, color: p.muted, lineHeight: 1.55 }}>
                <strong style={{ color: p.ink }}>Heads-up:</strong> start your Claude Code session inside the <code style={{ background: p.soft, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>claudepanion</code> repo, and make sure the plugin is installed. Build scaffolds files into <code style={{ background: p.soft, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>companions/</code> and <code style={{ background: p.soft, padding: "1px 5px", borderRadius: 3, fontSize: 11 }}>skills/</code> relative to Claude's working directory.
              </div>
            </div>

            {/* Waiting for Claude */}
            <div className="da-panel">
              <div className="da-panel-hd">
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="da-pulse" />
                  Logs <span style={{ fontWeight: 400, color: p.muted, fontSize: 12 }}>· polling every 2s</span>
                </span>
                <span style={{ fontSize: 11, color: p.muted, fontWeight: 400 }}>0 entries</span>
              </div>
              <div style={{ padding: "36px 16px", textAlign: "center", color: p.muted, fontSize: 13 }}>
                <div style={{ marginBottom: 8, fontSize: 28 }}>⏳</div>
                <div style={{ fontWeight: 500, color: p.ink, marginBottom: 4 }}>Waiting for Claude to start…</div>
                <div style={{ fontSize: 12 }}>Logs stream in once the slash command is run in Claude Code.</div>
              </div>
            </div>

            {/* Input (collapsed) */}
            <div className="da-panel" style={{ fontSize: 13 }}>
              <div className="da-panel-hd" style={{ cursor: "pointer" }}>
                <span>Input</span>
                <span className="da-mono" style={{ fontSize: 11, color: p.muted, fontWeight: 400 }}>{"{ mode: 'new-companion', name: 'github-pr-reviewer'… }"}</span>
              </div>
            </div>
          </>
        )}

        {/* ── RUNNING ─────────────────────────────── */}
        {state === "running" && (
          <>
            {/* Status bar */}
            <div style={{ background: p.accent + "0f", border: `1px solid ${p.accent}33`, borderRadius: 8, padding: "13px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <span className="da-running-dot" />
              <div>
                <div className="da-mono" style={{ fontSize: 10, color: p.accent, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 2 }}>Running</div>
                <div style={{ fontSize: 14, color: p.ink }}>writing <code style={{ background: p.soft, padding: "1px 6px", borderRadius: 3, fontSize: 13 }}>skills/github-pr-reviewer/SKILL.md</code></div>
              </div>
              <span className="da-mono" style={{ marginLeft: "auto", fontSize: 11, color: p.muted }}>32s</span>
            </div>

            {/* Slash command — collapsed strip */}
            <div style={{ marginBottom: 14, padding: "10px 14px", border: `1px solid ${p.ink}14`, borderRadius: 6, display: "flex", gap: 14, alignItems: "center", background: p.paper, fontSize: 12 }}>
              <span style={{ color: p.muted }}>Slash command</span>
              <code style={{ background: p.code, color: p.codefg, padding: "4px 10px", borderRadius: 5, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>/build-companion {entityId}</code>
            </div>

            {/* Live logs */}
            <div className="da-panel">
              <div className="da-panel-hd">
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="da-running-dot" />
                  Logs <span style={{ fontWeight: 400, color: p.muted, fontSize: 12 }}>· polling every 2s</span>
                </span>
                <span style={{ fontSize: 11, color: p.muted, fontWeight: 400 }}>8 entries</span>
              </div>
              <div style={{ background: p.code, color: p.codefg, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: "12px 16px", maxHeight: 260, overflow: "auto", lineHeight: 1.65 }}>
                {MOCK_LOGS.slice(0, 8).map((l, i) => (
                  <div key={i}>
                    <span style={{ color: "#4B5563" }}>{l.t}</span>{" "}
                    <span style={{ color: l.level === "info" ? "#7DD3FC" : l.level === "warn" ? "#FDE047" : "#F87171" }}>{l.level}</span>{" "}
                    <span>{l.msg}</span>
                  </div>
                ))}
                <div style={{ color: p.accent, marginTop: 4 }}>▌</div>
              </div>
            </div>

            {/* Input (collapsed) */}
            <div className="da-panel" style={{ fontSize: 13 }}>
              <div className="da-panel-hd" style={{ cursor: "pointer" }}>
                <span>Input</span>
                <span className="da-mono" style={{ fontSize: 11, color: p.muted, fontWeight: 400 }}>{"{ mode: 'new-companion', name: 'github-pr-reviewer'… }"}</span>
              </div>
            </div>
          </>
        )}

        {/* ── COMPLETED ───────────────────────────── */}
        {state === "completed" && (
          <>
            {/* Artifact hero */}
            <div style={{ border: `1px solid ${p.sage}55`, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ background: `linear-gradient(160deg, ${p.sage}18, ${p.sage}0d)`, padding: "14px 18px", borderBottom: `1px solid ${p.sage}33`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="da-mono" style={{ fontSize: 10, color: p.sage, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 2 }}>Artifact · completed</div>
                  <div style={{ fontSize: 14, color: p.ink, fontWeight: 500 }}>Scaffolded github-pr-reviewer — validator ✓, smoke test ✓</div>
                </div>
                <button style={{ padding: "7px 14px", background: p.ink, color: p.bg, border: 0, borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Open companion →</button>
              </div>
              <div style={{ padding: "18px" }}>
                <div style={{ display: "flex", gap: 24, marginBottom: 18, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, color: p.sage, fontWeight: 600 }}>✓ validator passed</span>
                  <span style={{ fontSize: 13, color: p.sage, fontWeight: 600 }}>✓ smoke test passed</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                  <div>
                    <div className="da-mono" style={{ fontSize: 10, color: p.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Files created</div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.9, color: p.ink }}>
                      {["companions/github-pr-reviewer/manifest.ts","companions/github-pr-reviewer/index.ts","companions/github-pr-reviewer/types.ts","companions/github-pr-reviewer/form.tsx","companions/github-pr-reviewer/pages/List.tsx","companions/github-pr-reviewer/pages/Detail.tsx","companions/github-pr-reviewer/server/tools.ts","skills/github-pr-reviewer/SKILL.md"].map(f => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div className="da-mono" style={{ fontSize: 10, color: p.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8 }}>Files modified</div>
                    <ul style={{ margin: 0, paddingLeft: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, lineHeight: 1.9, color: p.ink }}>
                      <li>companions/index.ts</li>
                    </ul>
                    <div className="da-mono" style={{ fontSize: 10, color: p.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 8, marginTop: 16 }}>Next step</div>
                    <p style={{ margin: 0, fontSize: 13, color: p.muted, lineHeight: 1.55 }}>
                      The companion is now mounted in the sidebar. Click it to open, then fill out the form to start your first run.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Continuation form */}
            <div style={{ border: `1px solid ${p.ink}14`, borderRadius: 8, padding: "16px 18px", marginBottom: 14, background: p.paper }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>Not quite right? Ask Claude to revise.</div>
              <div style={{ fontSize: 12, color: p.muted, marginBottom: 10 }}>Describe what to change and get a new slash command. The artifact above is kept as context.</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input readOnly placeholder="e.g. 'add a summary field to the artifact'" style={{ flex: 1, padding: "9px 12px", border: `1px solid ${p.ink}20`, borderRadius: 6, fontSize: 13, background: p.bg, color: p.ink, fontFamily: "inherit" }} />
                <button style={{ padding: "9px 16px", background: p.ink, color: p.bg, border: 0, borderRadius: 6, fontSize: 13, cursor: "pointer" }}>Continue</button>
              </div>
            </div>

            {/* Logs (collapsed) */}
            <div className="da-panel">
              <div className="da-panel-hd" style={{ cursor: "pointer" }}>
                <span>Logs · 12 entries</span>
                <span style={{ fontSize: 12, color: p.muted, fontWeight: 400 }}>▸ show</span>
              </div>
            </div>
          </>
        )}

        {/* ── ERROR ───────────────────────────────── */}
        {state === "error" && (
          <>
            {/* Error hero */}
            <div style={{ border: `1px solid ${p.accent}44`, borderRadius: 10, overflow: "hidden", marginBottom: 14 }}>
              <div style={{ background: p.accent + "0f", padding: "14px 18px", borderBottom: `1px solid ${p.accent}33` }}>
                <div className="da-mono" style={{ fontSize: 10, color: p.accent, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 4 }}>Error</div>
                <div style={{ fontSize: 14, color: p.ink, fontWeight: 500 }}>Validator failed — manifest.ts missing contractVersion field</div>
              </div>
              <div style={{ background: p.code, color: "#FCA5A5", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: "12px 14px", lineHeight: 1.6 }}>
                {`ValidationError: manifest must include 'contractVersion'\n  at validateManifest (src/server/reliability/validator.ts:42)\n  at validateCompanion (src/server/reliability/validator.ts:88)`}
              </div>
            </div>

            {/* Retry form */}
            <div style={{ border: `1px solid ${p.ink}14`, borderRadius: 8, padding: "16px 18px", marginBottom: 14, background: p.paper }}>
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 3 }}>Try again with a hint</div>
              <div style={{ fontSize: 12, color: p.muted, marginBottom: 10 }}>Describe a workaround. The original input is preserved.</div>
              <div style={{ display: "flex", gap: 8 }}>
                <input readOnly placeholder="e.g. 'add contractVersion: 1 to the manifest'" style={{ flex: 1, padding: "9px 12px", border: `1px solid ${p.ink}20`, borderRadius: 6, fontSize: 13, background: p.bg, color: p.ink, fontFamily: "inherit" }} />
                <button style={{ padding: "9px 16px", background: p.accent, color: "#fff", border: 0, borderRadius: 6, fontSize: 13, cursor: "pointer" }}>Retry</button>
              </div>
            </div>

            {/* Logs */}
            <div className="da-panel">
              <div className="da-panel-hd">
                <span>Logs</span>
                <span style={{ fontSize: 11, color: p.muted, fontWeight: 400 }}>4 entries</span>
              </div>
              <div style={{ background: p.code, color: p.codefg, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: "12px 16px", lineHeight: 1.65 }}>
                {MOCK_LOGS.slice(0, 2).map((l, i) => (
                  <div key={i}><span style={{ color: "#4B5563" }}>{l.t}</span> <span style={{ color: "#7DD3FC" }}>{l.level}</span> {l.msg}</div>
                ))}
                <div style={{ color: "#F87171" }}>10:42:14 error ValidationError: manifest must include 'contractVersion'</div>
                <div style={{ color: "#F87171" }}>10:42:14 error build_fail — entity marked as error</div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

// ─── DIRECTION B — Dashboard/Terminal ─────────────────────────────────────────
const DetailPageB = ({ theme = "sage", state = "pending" }) => {
  const p = DETAIL_PALETTE(theme);
  const entityId = "build-f05218";
  const companionName = "github-pr-reviewer";

  return (
    <div style={{ background: p.bg, color: p.ink, minHeight: "100%", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 13, display: "grid", gridTemplateColumns: "260px 1fr" }}>
      <style>{`
        .db-sans   { font-family: 'Inter', system-ui, sans-serif; }
        .db-serif  { font-family: 'Instrument Serif', Georgia, serif; }
        .db-card   { border: 1px solid ${p.ink}; background: ${p.paper}; margin-bottom: 12px; }
        .db-card-hd { padding: 9px 14px; border-bottom: 1px solid ${p.ink}; background: ${p.soft}; font-size: 10px; letterSpacing: .1em; textTransform: uppercase; color: ${p.muted}; display: flex; justify-content: space-between; }
        .db-card-bd { padding: 13px 14px; }
        .db-pulse { display:inline-block; width:7px; height:7px; border-radius:999px; background:${p.sage}; animation: dbpulse 2s infinite; }
        .db-run-dot { display:inline-block; width:7px; height:7px; border-radius:999px; background:${p.accent}; animation: dbpulse 1.2s infinite; }
        @keyframes dbpulse { 0%{box-shadow:0 0 0 0 ${p.sage}55} 70%{box-shadow:0 0 0 7px transparent} 100%{box-shadow:0 0 0 0 transparent} }
      `}</style>

      <DetailSidebarB p={p} />

      <main style={{ display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ padding: "10px 24px", borderBottom: `1px solid ${p.ink}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: p.paper }}>
          <div style={{ display: "flex", gap: 6, fontSize: 12, color: p.muted }}>
            <a href="#" style={{ color: p.muted, textDecoration: "none" }}>~/build</a>
            <span>/</span>
            <span style={{ color: p.ink }}>{entityId}</span>
          </div>
          <span style={{
            padding: "3px 12px", fontSize: 11, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6,
            border: `1px solid ${state === "pending" ? p.ink + "44" : state === "running" ? p.accent : state === "completed" ? p.sage : p.accent}`,
            color: state === "pending" ? p.muted : state === "running" ? p.accent : state === "completed" ? p.sage : p.accent,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: 999, background: "currentColor" }} />
            {state}
          </span>
        </div>

        <div style={{ padding: "22px 28px 60px" }}>
          {/* Title */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, color: p.muted, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 8 }}>
              {state === "pending" ? "// waiting for handoff" : state === "running" ? "// claude is working" : state === "completed" ? "// scaffold complete" : "// build failed"}
            </div>
            <h1 className="db-serif" style={{ fontSize: 44, lineHeight: 1.0, margin: "0 0 6px", color: p.ink }}>
              {companionName}
            </h1>
            <div style={{ fontSize: 11, color: p.muted }}>
              {state === "pending"   && `created just now · ${entityId}`}
              {state === "running"   && `started 32s ago · ${entityId}`}
              {state === "completed" && `completed · 29s · ${entityId}`}
              {state === "error"     && `failed · 12s · ${entityId}`}
            </div>
          </div>

          {/* ── PENDING ── */}
          {state === "pending" && (
            <>
              {/* Slash command HERO */}
              <div className="db-card" style={{ border: `1px solid ${p.sage}`, background: p.sage + "0a", marginBottom: 12 }}>
                <div style={{ padding: "9px 14px", borderBottom: `1px solid ${p.sage}55`, fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: p.sage, display: "flex", justifyContent: "space-between" }}>
                  <span>// hand off to claude</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="db-pulse" />polling every 2s
                  </span>
                </div>
                <div style={{ padding: "14px" }}>
                  <div className="db-sans" style={{ fontSize: 13, color: p.muted, marginBottom: 12 }}>Paste in Claude Code to start work on this entity:</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1, background: p.code, color: p.codefg, padding: "12px 14px", fontSize: 14, fontFamily: "inherit", display: "flex", alignItems: "center" }}>
                      /build-companion {entityId}
                    </div>
                    <button style={{ background: p.ink, color: p.bg, border: 0, padding: "0 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                      copy
                    </button>
                  </div>
                  <div style={{ marginTop: 10, padding: "8px 12px", borderLeft: `2px solid ${p.sage}`, fontSize: 11, color: p.muted, lineHeight: 1.6, background: p.bg }}>
                    // run claude code inside the claudepanion repo<br />
                    // `claudepanion plugin install` must have been run first<br />
                    // build writes to companions/ and skills/ from claude's cwd
                  </div>
                </div>
              </div>

              {/* Waiting logs */}
              <div className="db-card">
                <div style={{ padding: "8px 14px", borderBottom: `1px solid ${p.ink}`, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.muted, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="db-pulse" />logs</span>
                  <span>0 entries</span>
                </div>
                <div style={{ padding: "28px 14px", textAlign: "center", color: p.muted, fontSize: 12 }}>
                  <div style={{ marginBottom: 6 }}>// waiting for claude to start…</div>
                  <div>// logs stream here once slash command is run</div>
                </div>
              </div>

              <div className="db-card" style={{ fontSize: 12 }}>
                <div style={{ padding: "8px 14px", borderBottom: `1px solid ${p.ink}`, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.muted, display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
                  <span>input</span>
                  <span style={{ color: p.muted + "aa" }}>{"{ mode: 'new-companion', name: 'github-pr-reviewer'… } ▸"}</span>
                </div>
              </div>
            </>
          )}

          {/* ── RUNNING ── */}
          {state === "running" && (
            <>
              {/* Status */}
              <div className="db-card" style={{ border: `1px solid ${p.accent}55`, background: p.accent + "08" }}>
                <div style={{ padding: "9px 14px", borderBottom: `1px solid ${p.accent}33`, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.accent, display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="db-run-dot" />claude is running
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div className="db-sans" style={{ fontSize: 14, color: p.ink }}>
                    writing <code style={{ background: p.code, color: p.codefg, padding: "2px 8px", fontSize: 12 }}>skills/github-pr-reviewer/SKILL.md</code>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: p.muted }}>elapsed: 32s</div>
                </div>
              </div>

              {/* Collapsed slash */}
              <div className="db-card" style={{ fontSize: 11 }}>
                <div style={{ padding: "8px 14px", display: "flex", gap: 14, alignItems: "center" }}>
                  <span style={{ color: p.muted }}>slash command</span>
                  <code style={{ background: p.code, color: p.codefg, padding: "3px 10px", fontSize: 12 }}>/build-companion {entityId}</code>
                </div>
              </div>

              {/* Logs */}
              <div className="db-card">
                <div style={{ padding: "8px 14px", borderBottom: `1px solid ${p.ink}`, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.muted, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span className="db-run-dot" />logs · polling</span>
                  <span>8 entries</span>
                </div>
                <div style={{ background: p.code, color: p.codefg, fontFamily: "inherit", fontSize: 11, padding: "10px 14px", maxHeight: 240, overflow: "auto", lineHeight: 1.75 }}>
                  {MOCK_LOGS.slice(0, 8).map((l, i) => (
                    <div key={i}>
                      <span style={{ color: "#4B5563" }}>{l.t}</span>{" "}
                      <span style={{ color: l.level === "info" ? "#7DD3FC" : "#FDE047" }}>{l.level}</span>{" "}
                      {l.msg}
                    </div>
                  ))}
                  <div style={{ color: p.accent }}>▌</div>
                </div>
              </div>
            </>
          )}

          {/* ── COMPLETED ── */}
          {state === "completed" && (
            <>
              <div className="db-card" style={{ border: `1px solid ${p.sage}` }}>
                <div style={{ padding: "9px 14px", borderBottom: `1px solid ${p.sage}55`, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.sage, display: "flex", justifyContent: "space-between", alignItems: "center", background: p.sage + "0d" }}>
                  <span>// artifact · build complete</span>
                  <button style={{ padding: "4px 12px", background: p.ink, color: p.bg, border: 0, fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>open companion →</button>
                </div>
                <div style={{ padding: "14px" }}>
                  <div style={{ display: "flex", gap: 20, marginBottom: 14, fontSize: 12 }}>
                    <span style={{ color: p.sage }}>✓ validator</span>
                    <span style={{ color: p.sage }}>✓ smoke test</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 11 }}>
                    <div>
                      <div style={{ color: p.muted, marginBottom: 6, letterSpacing: ".05em" }}>// files created</div>
                      {["companions/github-pr-reviewer/manifest.ts","companions/github-pr-reviewer/types.ts","companions/github-pr-reviewer/form.tsx","companions/github-pr-reviewer/pages/List.tsx","companions/github-pr-reviewer/pages/Detail.tsx","companions/github-pr-reviewer/server/tools.ts","skills/github-pr-reviewer/SKILL.md"].map(f => (
                        <div key={f} style={{ color: p.sage, lineHeight: 1.85 }}>+ {f}</div>
                      ))}
                    </div>
                    <div>
                      <div style={{ color: p.muted, marginBottom: 6, letterSpacing: ".05em" }}>// files modified</div>
                      <div style={{ color: p.muted, lineHeight: 1.85 }}>~ companions/index.ts</div>
                      <div style={{ color: p.muted, marginTop: 14, marginBottom: 6, letterSpacing: ".05em" }}>// next step</div>
                      <div style={{ color: p.muted, lineHeight: 1.65, fontSize: 11 }}>companion mounted in sidebar → click to open → fill the form → run it.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue */}
              <div className="db-card" style={{ fontSize: 12 }}>
                <div style={{ padding: "8px 14px", borderBottom: `1px solid ${p.ink}`, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.muted }}>
                  // not right? continue
                </div>
                <div style={{ padding: "12px 14px", display: "flex", gap: 8 }}>
                  <input readOnly placeholder="// describe what to change…" style={{ flex: 1, padding: "8px 12px", border: `1px solid ${p.ink}33`, background: p.bg, color: p.ink, fontSize: 12, fontFamily: "inherit" }} />
                  <button style={{ padding: "8px 14px", background: p.ink, color: p.bg, border: 0, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>continue</button>
                </div>
              </div>
            </>
          )}

          {/* ── ERROR ── */}
          {state === "error" && (
            <>
              <div className="db-card" style={{ border: `1px solid ${p.accent}` }}>
                <div style={{ padding: "9px 14px", borderBottom: `1px solid ${p.accent}55`, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.accent, background: p.accent + "0a" }}>
                  // error
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div className="db-sans" style={{ fontSize: 14, color: p.ink, fontWeight: 500, marginBottom: 10 }}>Validator failed — manifest.ts missing contractVersion field</div>
                  <div style={{ background: p.code, color: "#FCA5A5", padding: "10px 12px", fontSize: 11, lineHeight: 1.7 }}>
                    {`ValidationError: manifest must include 'contractVersion'\n  at validateManifest (src/server/reliability/validator.ts:42)\n  at validateCompanion (src/server/reliability/validator.ts:88)`}
                  </div>
                </div>
              </div>

              <div className="db-card" style={{ fontSize: 12 }}>
                <div style={{ padding: "8px 14px", borderBottom: `1px solid ${p.ink}`, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.muted }}>
                  // retry with a hint
                </div>
                <div style={{ padding: "12px 14px", display: "flex", gap: 8 }}>
                  <input readOnly placeholder="// e.g. 'add contractVersion: 1 to the manifest'" style={{ flex: 1, padding: "8px 12px", border: `1px solid ${p.ink}33`, background: p.bg, color: p.ink, fontSize: 12, fontFamily: "inherit" }} />
                  <button style={{ padding: "8px 14px", background: p.accent, color: "#fff", border: 0, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>retry</button>
                </div>
              </div>

              <div className="db-card">
                <div style={{ padding: "8px 14px", borderBottom: `1px solid ${p.ink}`, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.muted, display: "flex", justifyContent: "space-between" }}>
                  <span>// logs</span><span>4 entries</span>
                </div>
                <div style={{ background: p.code, color: p.codefg, fontSize: 11, padding: "10px 14px", lineHeight: 1.75 }}>
                  {MOCK_LOGS.slice(0, 2).map((l, i) => (
                    <div key={i}><span style={{ color: "#4B5563" }}>{l.t}</span> <span style={{ color: "#7DD3FC" }}>{l.level}</span> {l.msg}</div>
                  ))}
                  <div><span style={{ color: "#4B5563" }}>10:42:14</span> <span style={{ color: "#F87171" }}>error</span> ValidationError: manifest must include &apos;contractVersion&apos;</div>
                  <div><span style={{ color: "#4B5563" }}>10:42:14</span> <span style={{ color: "#F87171" }}>error</span> build_fail — entity marked as error</div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

window.DetailPageA = DetailPageA;
window.DetailPageB = DetailPageB;
