// Build companion home — grounded in the real claudepanion repo
// (sean1588/claudepanion @ main).
//
// Real facts wired in:
//   - Sidebar order: Core (Build) → Companions → Tools → footer (+ Install)
//   - 3 example chips matching companions/build/examples.ts exactly
//   - Build has two modes: New companion / Iterate on existing
//   - Statuses: pending | running | completed | error
//   - IDs: build-f05218 (6 hex)
//   - Slash command: /build-companion <id>
//   - Slogan: AI-native framework for building personal software with Claude Code
//   - "+ Install companion" lives in sidebar footer, routes to /install,
//      accepts claudepanion-<slug> npm packages.

const REAL_EXAMPLES = [
  {
    slug: "github-pr-reviewer",
    icon: "🔎",
    name: "GitHub PR reviewer",
    desc: "Review a GitHub pull request: fetch the PR metadata, the unified diff, and existing review comments. Flag risky diffs (auth changes, swallowed errors, missing tests) and suggest review questions for the author. Read-only.",
    short: "Flag risky diffs, suggest review questions. Read-only.",
    system: "GitHub API",
  },
  {
    slug: "cloudwatch-investigator",
    icon: "📊",
    name: "CloudWatch investigator",
    desc: "Investigate AWS CloudWatch logs for an alarm in a given time range. Query the relevant log groups, identify error patterns, and suggest root-cause hypotheses. Uses local AWS credentials. Read-only.",
    short: "Query log groups, suggest root-cause hypotheses. Read-only.",
    system: "AWS CloudWatch",
  },
  {
    slug: "linear-groomer",
    icon: "📋",
    name: "Linear backlog groomer",
    desc: "Triage Linear issues for a team: list stale tickets (untouched for over 30 days), summarize each one, and suggest priority changes. Read-only.",
    short: "Surface stale tickets, suggest priority changes. Read-only.",
    system: "Linear API",
  },
];

const REAL_BUILDS = [
  { id: "build-f05218", mode: "new",     target: "github-pr-reviewer",   status: "completed", when: "2h ago",   desc: "Review a GitHub PR — fetch the diff and existing comments, flag risky diffs.", proxy: 4 },
  { id: "build-3c8e44", mode: "new",     target: "reading-log",          status: "completed", when: "yesterday", desc: "Track books I'm reading and have Claude summarize them.", proxy: 0 },
  { id: "build-91bd02", mode: "iterate", target: "github-pr-reviewer",   status: "running",   when: "just now", desc: "Add a check for migration files and surface schema diffs separately.", proxy: 0 },
  { id: "build-15a7d3", mode: "new",     target: "cost-watcher",         status: "error",     when: "3d ago",   desc: "Alert me on AWS cost anomalies daily.", proxy: 3 },
];

// Common left sidebar — matches src/client/components/Sidebar.tsx structure
const RealSidebar = ({ p, variant = "editorial" }) => {
  const isEditorial = variant === "editorial";
  return (
    <aside style={{
      background: isEditorial ? p.paper : p.paper,
      borderRight: `1px solid ${p.ink}${isEditorial ? "14" : ""}`,
      padding: isEditorial ? "20px 0" : 0,
      display: "flex", flexDirection: "column",
      fontFamily: isEditorial ? "'Inter', system-ui, sans-serif" : "'JetBrains Mono', ui-monospace, monospace",
    }}>
      {/* Logo block */}
      <div style={{ padding: "0 16px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: isEditorial ? 0 : `1px solid ${p.ink}` }}>
        <div style={{ width: 22, height: 22, background: p.accent, borderRadius: isEditorial ? 6 : 0 }} />
        <span style={{ fontWeight: 600, fontSize: 14, color: p.ink }}>claudepanion</span>
      </div>

      {/* Core */}
      <SectionLabel p={p} isEditorial={isEditorial}>Core</SectionLabel>
      <NavItem p={p} isEditorial={isEditorial} active icon="🔨" label="Build" />

      {/* Companions header — note in real app, this section only renders if entities exist.
           Out of the box only Build is installed → no companions section.
           We show a hint instead so the empty state is legible. */}
      <SectionLabel p={p} isEditorial={isEditorial}>Companions</SectionLabel>
      <div style={{
        padding: isEditorial ? "4px 16px 8px" : "8px 16px",
        fontSize: 11, color: p.muted, fontStyle: isEditorial ? "italic" : "normal", lineHeight: 1.5,
      }}>
        {isEditorial ? "Build something to fill this section." : "// none installed"}
      </div>

      <SectionLabel p={p} isEditorial={isEditorial}>Tools</SectionLabel>
      <div style={{
        padding: isEditorial ? "4px 16px 8px" : "8px 16px",
        fontSize: 11, color: p.muted, fontStyle: isEditorial ? "italic" : "normal", lineHeight: 1.5,
      }}>
        {isEditorial ? "—" : "// none installed"}
      </div>

      {/* Footer: + Install companion */}
      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${p.ink}${isEditorial ? "14" : ""}` }}>
        <NavItem p={p} isEditorial={isEditorial} icon="+" label="Install companion" muted />
        <div style={{ padding: "10px 16px 4px", fontSize: 10, color: p.muted, lineHeight: 1.5 }}>
          {isEditorial ? "Independent open-source project. Not affiliated with Anthropic." : "// independent · not affiliated\n// with anthropic"}
        </div>
      </div>
    </aside>
  );
};

const SectionLabel = ({ children, p, isEditorial }) => (
  <div style={{
    padding: isEditorial ? "12px 16px 4px" : "12px 16px 6px",
    fontSize: 10, color: p.muted, letterSpacing: ".12em", textTransform: "uppercase",
    fontWeight: isEditorial ? 500 : 400,
  }}>{children}</div>
);

const NavItem = ({ p, isEditorial, active = false, icon, label, muted = false }) => {
  if (isEditorial) {
    return (
      <a href="#" style={{
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 10,
        textDecoration: "none", fontSize: 13, minHeight: 40,
        color: muted ? p.muted : p.ink,
        background: active ? p.accent + "1a" : "transparent",
        borderLeft: active ? `3px solid ${p.accent}` : "3px solid transparent",
        paddingLeft: 13,
      }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span>{label}</span>
      </a>
    );
  }
  return (
    <a href="#" style={{
      padding: "9px 16px", display: "grid", gridTemplateColumns: "20px 1fr", gap: 10, alignItems: "center",
      textDecoration: "none", fontSize: 12,
      color: muted ? p.muted : p.ink,
      background: active ? p.bg : "transparent",
      borderLeft: active ? `2px solid ${p.accent}` : "2px solid transparent",
      paddingLeft: 14,
    }}>
      <span style={{ fontSize: 13 }}>{icon}</span>
      <span>{label}</span>
    </a>
  );
};

// ====================================================================
// DIRECTION A — Editorial
// Welcome → suggested chips → past builds. Centers the "I'm Build, scaffold something" framing.
// ====================================================================
const BuildHomeEditorial = ({ tone = "verbose", theme = "sage" }) => {
  const palettes = {
    warm: { bg: "#F5EFE6", ink: "#1B1814", muted: "#6B6157", accent: "#C8553D", soft: "#E8DFD0", paper: "#FAF5EC", sage: "#7A8B7A" },
    cool: { bg: "#F1F2F1", ink: "#15181A", muted: "#5C6266", accent: "#3D6FB8", soft: "#DDE2DE", paper: "#F6F7F4", sage: "#7A8788" },
    dark: { bg: "#1B1814", ink: "#F5EFE6", muted: "#9A8F82", accent: "#E0826A", soft: "#2A2520", paper: "#1F1B16", sage: "#9DB09C" },
    sage: { bg: "#EFEEE6", ink: "#1F2421", muted: "#5E6863", accent: "#B0493B", soft: "#DBDED0", paper: "#F6F5EE", sage: "#5C7A66" },
  };
  const p = palettes[theme] || palettes.sage;
  const t = (terse, verbose) => (tone === "terse" ? terse : verbose);

  return (
    <div style={{ background: p.bg, color: p.ink, minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif", display: "grid", gridTemplateColumns: "240px 1fr" }}>
      <style>{`
        .bha-serif { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; }
        .bha-mono  { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .bha-tag   { display: inline-block; padding: 3px 10px; border: 1px solid ${p.ink}26; border-radius: 999px; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: ${p.muted}; }
        .bha-chip  { transition: transform .15s ease, border-color .15s ease, background .15s ease; cursor: pointer; }
        .bha-chip:hover { transform: translateY(-2px); border-color: ${p.accent}; background: ${p.paper}; }
        .bha-chip:hover .bha-arrow { transform: translateX(3px); color: ${p.accent}; }
        .bha-arrow { transition: transform .15s ease, color .15s ease; }
        .bha-row:hover { background: ${p.paper}; }
      `}</style>

      <RealSidebar p={p} variant="editorial" />

      <main style={{ padding: "32px 48px 64px", overflow: "hidden" }}>
        {/* Top strip — breadcrumb + meta */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div className="bha-mono" style={{ display: "flex", gap: 8, alignItems: "center", color: p.muted, fontSize: 11 }}>
            <span>~/</span><span style={{ color: p.ink }}>build</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span className="bha-tag">v0.2.0 · localhost:3001</span>
            <button style={{ padding: "8px 14px", background: "transparent", border: `1px solid ${p.ink}26`, borderRadius: 6, color: p.ink, fontSize: 13, cursor: "pointer" }}>Docs</button>
          </div>
        </div>

        {/* Welcome card — mirrors BuildEmptyState.tsx welcome block */}
        <section style={{
          background: p.paper, border: `1px solid ${p.ink}1a`, borderRadius: 12,
          padding: "28px 32px", marginBottom: 36, display: "grid",
          gridTemplateColumns: "1fr auto", gap: 32, alignItems: "center",
        }}>
          <div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <span className="bha-tag" style={{ borderColor: p.accent + "66", color: p.accent }}>The Build companion · core</span>
            </div>
            <h1 className="bha-serif" style={{ fontSize: 52, lineHeight: 1.0, margin: "0 0 14px", letterSpacing: "-0.01em" }}>
              <span style={{ fontStyle: "italic" }}>Hi, I'm Build</span> — your first<br />companion.
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.55, color: p.muted, margin: 0, maxWidth: 600 }}>
              {t(
                "Describe a tool. I scaffold the manifest, MCP tools, skill, and pages — then mount it next to me.",
                "I scaffold new companions from a plain-English description. Everything else you add to the sidebar came from me. Try one of the ideas below, or describe your own."
              )}
            </p>
          </div>
          <div style={{
            width: 160, height: 160, background: p.bg, border: `1px dashed ${p.ink}33`, borderRadius: 12,
            display: "grid", placeItems: "center", flexShrink: 0,
          }}>
            <span style={{ fontSize: 64, lineHeight: 1 }}>🔨</span>
          </div>
        </section>

        {/* Two-mode row — mirrors form.tsx tabs */}
        <section style={{ marginBottom: 36 }}>
          <div className="bha-mono" style={{ fontSize: 10, color: p.muted, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 12 }}>
            Two ways to start
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ padding: "20px 22px", background: p.paper, border: `1px solid ${p.ink}1a`, borderRadius: 8, display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="bha-mono" style={{ fontSize: 11, color: p.accent, letterSpacing: ".08em" }}>✨ NEW COMPANION</div>
              <div className="bha-serif" style={{ fontSize: 24, lineHeight: 1.15 }}>Scaffold from scratch</div>
              <div style={{ fontSize: 13, color: p.muted, lineHeight: 1.5 }}>Pick a kind (entity / tool), describe what it should do — Build authors the manifest, types, form, pages, MCP tools, and the skill.</div>
            </div>
            <div style={{ padding: "20px 22px", background: p.paper, border: `1px solid ${p.ink}1a`, borderRadius: 8, display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="bha-mono" style={{ fontSize: 11, color: p.accent, letterSpacing: ".08em" }}>⟳ ITERATE ON EXISTING</div>
              <div className="bha-serif" style={{ fontSize: 24, lineHeight: 1.15 }}>Evolve a companion</div>
              <div style={{ fontSize: 13, color: p.muted, lineHeight: 1.5 }}>Pick a target companion, describe the change — Build edits files in place and bumps the version.</div>
            </div>
          </div>
        </section>

        {/* Suggested chips — exact copy from companions/build/examples.ts */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <h2 className="bha-mono" style={{ margin: 0, fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: p.muted }}>Ideas to start from · prefills the form</h2>
            <a href="#" style={{ fontSize: 12, color: p.accent, textDecoration: "none" }}>or describe your own →</a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {REAL_EXAMPLES.map((c) => (
              <button key={c.slug} className="bha-chip" style={{
                textAlign: "left", padding: "20px 22px", background: p.bg, border: `1px solid ${p.ink}1a`, borderRadius: 8,
                display: "flex", flexDirection: "column", gap: 10, minHeight: 200,
              }}>
                <div style={{ fontSize: 26 }}>{c.icon}</div>
                <div className="bha-serif" style={{ fontSize: 22, lineHeight: 1.15 }}>{c.name}</div>
                <div style={{ fontSize: 13, color: p.muted, lineHeight: 1.5, flex: 1 }}>{c.short}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px dashed ${p.ink}14` }}>
                  <span className="bha-mono" style={{ fontSize: 10, color: p.muted, letterSpacing: ".05em" }}>→ {c.system}</span>
                  <span className="bha-arrow bha-serif" style={{ fontSize: 18, color: p.muted, fontStyle: "italic" }}>→</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Past builds — uses real status names */}
        <section>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
            <h2 className="bha-mono" style={{ margin: 0, fontSize: 11, letterSpacing: ".15em", textTransform: "uppercase", color: p.muted }}>Past builds · 4 entities</h2>
            <a href="#" style={{ fontSize: 12, color: p.muted, textDecoration: "none" }}>show all →</a>
          </div>

          <div style={{ background: p.paper, border: `1px solid ${p.ink}14`, borderRadius: 8, overflow: "hidden" }}>
            <div className="bha-mono" style={{
              display: "grid", gridTemplateColumns: "100px 80px 1fr 100px 80px 20px",
              padding: "10px 18px", fontSize: 10, color: p.muted, letterSpacing: ".1em", textTransform: "uppercase",
              borderBottom: `1px solid ${p.ink}14`, gap: 14,
            }}>
              <span>id</span><span>mode</span><span>target · description</span><span>status</span><span style={{ textAlign: "right" }}>updated</span><span></span>
            </div>
            {REAL_BUILDS.map((b, i) => (
              <div key={i} className="bha-row" style={{
                display: "grid", gridTemplateColumns: "100px 80px 1fr 100px 80px 20px",
                padding: "14px 18px", alignItems: "center", gap: 14,
                borderBottom: i < REAL_BUILDS.length - 1 ? `1px dashed ${p.ink}14` : 0,
                cursor: "pointer", transition: "background .15s ease", fontSize: 13,
              }}>
                <span className="bha-mono" style={{ fontSize: 11, color: p.muted }}>{b.id}</span>
                <span style={{
                  fontSize: 11, padding: "2px 8px", borderRadius: 999, alignSelf: "center", justifySelf: "start",
                  background: b.mode === "new" ? "#ede9fe" : "#dbeafe",
                  color: b.mode === "new" ? "#6d28d9" : "#1e40af",
                }}>{b.mode === "new" ? "✨ new" : "⟳ iterate"}</span>
                <div style={{ minWidth: 0 }}>
                  <div className="bha-serif" style={{ fontSize: 17, fontStyle: "italic" }}>{b.target}</div>
                  <div style={{ fontSize: 12, color: p.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.desc}</div>
                </div>
                <RealStatusPill status={b.status} p={p} />
                <span style={{ fontSize: 11, color: p.muted, textAlign: "right" }}>{b.when}</span>
                <span className="bha-serif" style={{ fontSize: 18, fontStyle: "italic", color: p.muted, textAlign: "right" }}>›</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const RealStatusPill = ({ status, p }) => {
  const styles = {
    pending:   { bg: "#e2e8f0", color: "#475569", label: "pending" },
    running:   { bg: "#fef3c7", color: "#92400e", label: "running" },
    completed: { bg: "#dcfce7", color: "#166534", label: "completed" },
    error:     { bg: "#fee2e2", color: "#991b1b", label: "error" },
  }[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: 999, background: styles.bg, color: styles.color,
      fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: ".05em",
      width: "fit-content",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: styles.color }} />
      {styles.label}
    </span>
  );
};

// ====================================================================
// DIRECTION B — Dashboard / pragmatic terminal
// Same data, denser. Foregrounds the slash-command + hand-off model
// (the actual UX innovation: UI creates entity, Claude Code picks it up over MCP).
// ====================================================================
const BuildHomeDashboard = ({ tone = "verbose", theme = "sage" }) => {
  const palettes = {
    warm: { bg: "#F5EFE6", ink: "#1B1814", muted: "#6B6157", accent: "#C8553D", soft: "#E8DFD0", paper: "#FAF5EC", sage: "#7A8B7A" },
    cool: { bg: "#F1F2F1", ink: "#15181A", muted: "#5C6266", accent: "#3D6FB8", soft: "#DDE2DE", paper: "#F6F7F4", sage: "#7A8788" },
    dark: { bg: "#1B1814", ink: "#F5EFE6", muted: "#9A8F82", accent: "#E0826A", soft: "#2A2520", paper: "#1F1B16", sage: "#9DB09C" },
    sage: { bg: "#EFEEE6", ink: "#1F2421", muted: "#5E6863", accent: "#B0493B", soft: "#DBDED0", paper: "#F6F5EE", sage: "#5C7A66" },
  };
  const p = palettes[theme] || palettes.sage;
  const t = (terse, verbose) => (tone === "terse" ? terse : verbose);

  return (
    <div style={{ background: p.bg, color: p.ink, minHeight: "100%", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 13, display: "grid", gridTemplateColumns: "240px 1fr" }}>
      <style>{`
        .bhb-sans  { font-family: 'Inter', system-ui, sans-serif; }
        .bhb-serif { font-family: 'Instrument Serif', Georgia, serif; }
        .bhb-card  { background: ${p.paper}; border: 1px solid ${p.ink}; }
        .bhb-row:hover { background: ${p.soft}; cursor: pointer; }
        .bhb-chip:hover { transform: translate(-1px, -1px); box-shadow: 3px 3px 0 ${p.ink}; }
        .bhb-chip { transition: transform .12s ease, box-shadow .12s ease; cursor: pointer; }
        .bhb-pulse { width: 7px; height: 7px; border-radius: 999px; display: inline-block; }
      `}</style>

      <RealSidebar p={p} variant="dashboard" />

      <main style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{ padding: "10px 24px", borderBottom: `1px solid ${p.ink}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: p.paper }}>
          <div style={{ color: p.muted, fontSize: 12 }}>
            <span>~/</span><span style={{ color: p.ink }}>build</span>
            <span> — the build companion</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ padding: "5px 12px", background: "transparent", border: `1px solid ${p.ink}`, color: p.ink, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>docs</button>
            <button style={{ padding: "5px 12px", background: p.ink, border: `1px solid ${p.ink}`, color: p.bg, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>$ new build</button>
          </div>
        </div>

        {/* Hero strip */}
        <section style={{ padding: "28px 24px 24px", borderBottom: `1px solid ${p.ink}` }}>
          <div className="bhb-sans" style={{ fontSize: 10, color: p.accent, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 10 }}>Core companion · v0.2.0 · localhost:3001</div>
          <h1 className="bhb-serif" style={{ fontSize: 48, lineHeight: 1.05, margin: "0 0 12px", letterSpacing: "-0.01em" }}>
            <em>Hi, I'm Build</em> — your first companion.
          </h1>
          <p className="bhb-sans" style={{ fontSize: 14, color: p.muted, lineHeight: 1.5, margin: 0, maxWidth: 720 }}>
            {t(
              "Pick an idea or describe your own. Claude Code does the work over MCP.",
              "I scaffold new companions from a plain-English description. Everything else you add to the sidebar came from me. Pick an idea below or describe your own — once you submit, I hand you a slash command to paste into Claude Code."
            )}
          </p>
        </section>

        {/* Suggested */}
        <section style={{ padding: "20px 24px 24px", borderBottom: `1px solid ${p.ink}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <span style={{ fontSize: 10, color: p.muted, letterSpacing: ".15em", textTransform: "uppercase" }}>// ideas to start from</span>
            <a href="#" className="bhb-sans" style={{ fontSize: 12, color: p.accent, textDecoration: "none" }}>or write your own description →</a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {REAL_EXAMPLES.map((c) => (
              <button key={c.slug} className="bhb-chip" style={{
                textAlign: "left", padding: 14, background: p.paper, border: `1px solid ${p.ink}`, color: p.ink,
                display: "grid", gridTemplateColumns: "32px 1fr", gap: 12, fontFamily: "inherit",
              }}>
                <div style={{ fontSize: 22, lineHeight: 1 }}>{c.icon}</div>
                <div>
                  <div className="bhb-sans" style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{c.name}</div>
                  <div className="bhb-sans" style={{ fontSize: 12, color: p.muted, lineHeight: 1.45, marginBottom: 8 }}>{c.short}</div>
                  <div style={{ fontSize: 10, color: p.muted, letterSpacing: ".03em" }}>→ {c.system}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Past builds + new-build form side by side */}
        <section style={{ padding: "20px 24px 24px", display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 20, flex: 1 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <span style={{ fontSize: 10, color: p.muted, letterSpacing: ".15em", textTransform: "uppercase" }}>// past builds</span>
              <span style={{ fontSize: 11, color: p.muted }}>4 entities · 1 running</span>
            </div>

            <div className="bhb-card">
              <div style={{ display: "grid", gridTemplateColumns: "100px 60px 1fr 90px 70px", padding: "8px 14px", borderBottom: `1px solid ${p.ink}`, background: p.ink, color: p.bg, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", gap: 10 }}>
                <span>id</span><span>mode</span><span>target · description</span><span>status</span><span style={{ textAlign: "right" }}>when</span>
              </div>
              {REAL_BUILDS.map((b, i) => (
                <div key={i} className="bhb-row" style={{
                  display: "grid", gridTemplateColumns: "100px 60px 1fr 90px 70px",
                  padding: "12px 14px", gap: 10, alignItems: "center",
                  borderBottom: i < REAL_BUILDS.length - 1 ? `1px dashed ${p.ink}33` : 0,
                  fontSize: 11,
                }}>
                  <span style={{ color: p.muted }}>{b.id}</span>
                  <span style={{ fontSize: 10, color: b.mode === "new" ? "#6d28d9" : "#1e40af" }}>
                    {b.mode === "new" ? "new" : "iter"}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div className="bhb-sans" style={{ fontSize: 13, color: p.ink, fontWeight: 500 }}>{b.target}</div>
                    <div className="bhb-sans" style={{ fontSize: 12, color: p.muted, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.desc}</div>
                  </div>
                  <RealStatusPill status={b.status} p={p} />
                  <span style={{ fontSize: 10, color: p.muted, textAlign: "right" }}>{b.when}</span>
                </div>
              ))}
            </div>

            {/* Slash command preview — load-bearing UX detail of the real product */}
            <div style={{ marginTop: 16, padding: 14, background: p.paper, border: `1px solid ${p.ink}` }}>
              <div style={{ fontSize: 10, color: p.accent, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>// last slash command</div>
              <div className="bhb-sans" style={{ fontSize: 12, color: p.muted, marginBottom: 8 }}>Paste into Claude Code in any repo where claudepanion is installed.</div>
              <div style={{
                background: "#0c1220", color: "#e2e8f0", padding: "12px 14px",
                fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span>/build-companion build-91bd02</span>
                <button style={{ background: p.accent, color: "#fff", border: 0, padding: "4px 10px", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>copy</button>
              </div>
            </div>
          </div>

          {/* New-build form preview */}
          <aside style={{ minWidth: 0 }}>
            <div style={{ fontSize: 10, color: p.muted, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 10 }}>// or describe your own</div>
            <div className="bhb-card" style={{ padding: 16 }}>
              {/* Mode tabs — matches form.tsx */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                <button style={{ padding: "6px 10px", background: p.accent, color: "#fff", border: `1px solid ${p.accent}`, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>✨ new</button>
                <button style={{ padding: "6px 10px", background: "transparent", color: p.ink, border: `1px solid ${p.ink}`, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>⟳ iterate</button>
              </div>

              <div className="bhb-sans" style={{ fontSize: 11, color: p.muted, marginBottom: 6 }}>name <span style={{ color: p.muted, opacity: .6 }}>· lowercase, hyphens</span></div>
              <div style={{ padding: "8px 10px", border: `1px solid ${p.ink}`, fontSize: 12, color: p.muted, marginBottom: 12, background: p.bg }}>my-companion</div>

              <div className="bhb-sans" style={{ fontSize: 11, color: p.muted, marginBottom: 6 }}>kind</div>
              <div style={{ padding: "8px 10px", border: `1px solid ${p.ink}`, fontSize: 12, color: p.ink, marginBottom: 12, background: p.bg }}>entity — has lifecycle, form, artifacts ▾</div>

              <div className="bhb-sans" style={{ fontSize: 11, color: p.muted, marginBottom: 6 }}>description</div>
              <div style={{ padding: "10px", border: `1px solid ${p.ink}`, fontSize: 12, color: p.muted, lineHeight: 1.6, marginBottom: 12, background: p.bg, minHeight: 84 }}>
                <span style={{ opacity: .65 }}>Name the external service (GitHub, AWS, Linear, …), what to fetch, and what the artifact should contain. Read-only by default — say so explicitly if it should write back.</span>
              </div>

              <button style={{ width: "100%", padding: "10px", background: p.ink, color: p.bg, border: `1px solid ${p.ink}`, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                Build companion →
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
};

window.BuildHomeEditorial = BuildHomeEditorial;
window.BuildHomeDashboard = BuildHomeDashboard;
