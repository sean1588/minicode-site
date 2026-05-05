// Install companion page — /install
// Real flow: user types a claudepanion-<slug> npm package name,
// hits Install, the host runs `npm install`, dynamically imports,
// validates, and mounts without restart.
//
// States: idle | installing | success | error
// Two directions: A (editorial) and B (dashboard/terminal)

const INST_PALETTE = (theme) => ({
  warm: { bg: "#F5EFE6", ink: "#1B1814", muted: "#6B6157", accent: "#C8553D", soft: "#E8DFD0", paper: "#FAF5EC", sage: "#7A8B7A", border: "#1B181420", code: "#1C1917", codefg: "#D6CDC4" },
  cool: { bg: "#F1F2F1", ink: "#15181A", muted: "#5C6266", accent: "#3D6FB8", soft: "#DDE2DE", paper: "#F6F7F4", sage: "#7A8788", border: "#15181A20", code: "#181C1E", codefg: "#C8D0D4" },
  dark: { bg: "#1B1814", ink: "#F5EFE6", muted: "#9A8F82", accent: "#E0826A", soft: "#2A2520", paper: "#1F1B16", sage: "#9DB09C", border: "#F5EFE614", code: "#0F0D0B", codefg: "#D6CDC4" },
  sage: { bg: "#EFEEE6", ink: "#1F2421", muted: "#5E6863", accent: "#B0493B", soft: "#DBDED0", paper: "#F6F5EE", sage: "#5C7A66", border: "#1F242114", code: "#181E1A", codefg: "#C4CEC6" },
})[theme] || {};

// Placeholder "community" packages — shows the registry concept even before
// a real registry exists. All real claudepanion-* style names.
const EXAMPLE_PACKAGES = [
  { pkg: "claudepanion-oncall",     icon: "🚨", name: "On-call Investigator", desc: "Query CloudWatch + PagerDuty, triage alerts, suggest root causes." },
  { pkg: "claudepanion-standup",    icon: "💬", name: "Standup Summarizer",   desc: "Read Slack channel history, draft a standup, optionally post it back." },
  { pkg: "claudepanion-spend",      icon: "💸", name: "AWS Spend Watcher",    desc: "Query Cost Explorer daily, flag anomalies, email a digest." },
  { pkg: "claudepanion-reviewer",   icon: "🔎", name: "PR Reviewer",          desc: "Review GitHub PRs, flag risky diffs, suggest review questions." },
];

// ─── Shared sidebar ───────────────────────────────────────────────────────────
const InstSidebarA = ({ p }) => (
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
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, color: p.ink, textDecoration: "none", fontSize: 14 }}>
        <span style={{ fontSize: 18 }}>🔎</span>
        <span>GitHub PR reviewer</span>
      </a>
    </div>
    <div style={{ marginTop: "auto" }}>
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", fontSize: 13, color: p.accent, textDecoration: "none", fontWeight: 500, borderTop: `1px solid ${p.ink}10`, paddingTop: 14 }}>
        <span>+</span> Install companion
      </a>
    </div>
    <div style={{ padding: "8px", fontSize: 10, color: p.muted }}>
      Not affiliated with Anthropic.
    </div>
  </aside>
);

const InstSidebarB = ({ p }) => (
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
      <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", color: p.ink, textDecoration: "none", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
        <span>🔎</span><span>github-pr-reviewer</span>
      </a>
    </div>
    <div style={{ marginTop: "auto", borderTop: `1px solid ${p.ink}33` }}>
      <a href="#" style={{ display: "block", padding: "10px 16px", color: p.accent, textDecoration: "none", fontSize: 11, fontFamily: "'JetBrains Mono', monospace", borderBottom: `1px solid ${p.ink}` }}>
        $ install companion ←
      </a>
    </div>
    <div style={{ padding: "10px 16px", borderTop: `1px solid ${p.ink}`, fontSize: 10, color: p.muted, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.5 }}>
      // not affiliated with anthropic
    </div>
  </aside>
);

// ─── DIRECTION A · Editorial ──────────────────────────────────────────────────
const InstallEditorial = ({ theme = "sage", installState = "idle" }) => {
  const p = INST_PALETTE(theme);
  const pkgValue = installState !== "idle" ? "claudepanion-oncall" : "";

  return (
    <div style={{ background: p.bg, color: p.ink, minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif", display: "flex" }}>
      <style>{`
        .ia-serif { font-family: 'Instrument Serif', Georgia, serif; }
        .ia-mono  { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .ia-card  { border: 1px solid ${p.ink}14; border-radius: 8px; overflow: hidden; }
        .ia-pkg:hover { border-color: ${p.sage}; background: ${p.paper}; transform: translateY(-1px); }
        .ia-pkg { transition: border-color .15s, background .15s, transform .12s; cursor: pointer; }
        .ia-spin { animation: iaspin 1s linear infinite; display: inline-block; }
        @keyframes iaspin { to { transform: rotate(360deg); } }
      `}</style>

      <InstSidebarA p={p} />

      <main style={{ flex: 1, padding: "32px 48px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ fontSize: 12, color: p.muted, marginBottom: 20 }}>
          <span>claudepanion</span><span style={{ opacity: .4, margin: "0 6px" }}>›</span>
          <span style={{ color: p.ink }}>Install companion</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 className="ia-serif" style={{ fontSize: 52, lineHeight: 1.0, margin: "0 0 12px", letterSpacing: "-0.01em" }}>
            Install from <em style={{ color: p.accent }}>npm</em>.
          </h1>
          <p style={{ fontSize: 15, color: p.muted, margin: 0, maxWidth: 560, lineHeight: 1.55 }}>
            Any npm package named <code style={{ background: p.soft, padding: "2px 7px", borderRadius: 4, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>claudepanion-*</code> can be installed here. The host runs <code style={{ background: p.soft, padding: "2px 7px", borderRadius: 4, fontSize: 13, fontFamily: "'JetBrains Mono', monospace" }}>npm install</code>, validates the companion contract, and mounts it in the sidebar — no restart needed.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 40, alignItems: "start" }}>
          <div>
            {/* Install form */}
            <div className="ia-card" style={{ padding: "22px 24px", marginBottom: 24, background: p.paper }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.muted, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 14 }}>Package name</div>

              <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <input
                  readOnly
                  value={pkgValue}
                  placeholder="claudepanion-oncall"
                  style={{
                    flex: 1, padding: "10px 14px",
                    border: `1px solid ${installState === "error" ? p.accent + "88" : installState === "success" ? p.sage + "88" : p.ink + "26"}`,
                    borderRadius: 6, fontSize: 14,
                    fontFamily: "'JetBrains Mono', monospace",
                    background: p.bg, color: p.ink,
                  }}
                />
                <button style={{
                  padding: "10px 22px",
                  background: installState === "installing" ? p.muted : p.ink,
                  color: p.bg, border: 0, borderRadius: 6, fontSize: 13,
                  fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
                }}>
                  {installState === "installing" && <span className="ia-spin">⟳</span>}
                  {installState === "installing" ? "Installing…" : "Install"}
                </button>
              </div>

              <div style={{ fontSize: 11, color: p.muted }}>
                Must start with <code style={{ fontFamily: "'JetBrains Mono', monospace" }}>claudepanion-</code> · any valid npm package name
              </div>

              {/* State feedback */}
              {installState === "installing" && (
                <div style={{ marginTop: 16, padding: "12px 14px", background: p.soft, borderRadius: 6, fontSize: 13, color: p.muted, display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="ia-spin" style={{ fontSize: 16 }}>⟳</span>
                  <span>Running <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>npm install claudepanion-oncall</code>…</span>
                </div>
              )}

              {installState === "success" && (
                <div style={{ marginTop: 16, padding: "14px 16px", background: p.sage + "14", border: `1px solid ${p.sage}44`, borderRadius: 8 }}>
                  <div style={{ fontWeight: 600, color: p.sage, marginBottom: 4, fontSize: 14 }}>
                    ✓ Installed 🚨 On-call Investigator v0.2.1
                  </div>
                  <div style={{ fontSize: 12, color: p.muted, marginBottom: 10 }}>Mounted in the sidebar. No restart needed.</div>
                  <button style={{ padding: "7px 14px", background: p.ink, color: p.bg, border: 0, borderRadius: 6, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                    Open companion →
                  </button>
                </div>
              )}

              {installState === "error" && (
                <div style={{ marginTop: 16, padding: "12px 14px", background: p.accent + "0d", border: `1px solid ${p.accent}44`, borderRadius: 8 }}>
                  <div style={{ fontWeight: 600, color: p.accent, marginBottom: 4, fontSize: 13 }}>Install failed</div>
                  <pre style={{ margin: 0, fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: p.muted, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {`npm error 404 Not found - GET https://registry.npmjs.org/claudepanion-oncall\nnpm error 404 'claudepanion-oncall@latest' is not in this registry.`}
                  </pre>
                </div>
              )}
            </div>

            {/* How it works */}
            <div style={{ fontSize: 13, color: p.muted, lineHeight: 1.7 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: p.muted, marginBottom: 10 }}>How it works</div>
              <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                <li>Type any <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: p.soft, padding: "1px 5px", borderRadius: 3 }}>claudepanion-*</code> package name</li>
                <li>The host runs <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: p.soft, padding: "1px 5px", borderRadius: 3 }}>npm install</code> and dynamically imports it</li>
                <li>The companion contract is validated (manifest, form, tools)</li>
                <li>It mounts in the sidebar without a restart</li>
                <li>The install is persisted to <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, background: p.soft, padding: "1px 5px", borderRadius: 3 }}>companions/index.ts</code></li>
              </ol>
            </div>
          </div>

          {/* Community packages aside */}
          <aside>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.muted, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Community packages</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {EXAMPLE_PACKAGES.map(pkg => (
                <button key={pkg.pkg} className="ia-pkg" style={{
                  padding: "14px 16px", textAlign: "left", border: `1px solid ${p.ink}14`,
                  borderRadius: 8, background: p.bg, fontFamily: "inherit",
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{pkg.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: p.ink, marginBottom: 2 }}>{pkg.name}</div>
                    <div style={{ fontSize: 11, color: p.muted, lineHeight: 1.45, marginBottom: 6 }}>{pkg.desc}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.muted }}>{pkg.pkg}</div>
                  </div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: p.muted, lineHeight: 1.55 }}>
              The registry is npm. Search <a href="#" style={{ color: p.accent, textDecoration: "none" }}>npmjs.com/search?q=claudepanion</a> for more.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

// ─── DIRECTION B · Dashboard/Terminal ─────────────────────────────────────────
const InstallDashboard = ({ theme = "sage", installState = "idle" }) => {
  const p = INST_PALETTE(theme);
  const pkgValue = installState !== "idle" ? "claudepanion-oncall" : "";

  return (
    <div style={{ background: p.bg, color: p.ink, minHeight: "100%", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 13, display: "flex" }}>
      <style>{`
        .ib-sans  { font-family: 'Inter', system-ui, sans-serif; }
        .ib-serif { font-family: 'Instrument Serif', Georgia, serif; }
        .ib-card  { border: 1px solid ${p.ink}; background: ${p.paper}; margin-bottom: 12px; }
        .ib-pkg:hover { transform: translate(-1px,-1px); box-shadow: 2px 2px 0 ${p.ink}; }
        .ib-pkg { transition: transform .12s, box-shadow .12s; cursor: pointer; }
        .ib-spin { animation: ibspin 1s linear infinite; display: inline-block; }
        @keyframes ibspin { to { transform: rotate(360deg); } }
      `}</style>

      <InstSidebarB p={p} />

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ padding: "10px 24px", borderBottom: `1px solid ${p.ink}`, display: "flex", alignItems: "center", gap: 6, background: p.paper, fontSize: 12 }}>
          <span style={{ color: p.muted }}>~/</span>
          <span style={{ color: p.ink }}>install</span>
        </div>

        <div style={{ padding: "22px 28px 60px" }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 10, color: p.accent, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 8 }}>
              $ claudepanion install &lt;package&gt;
            </div>
            <h1 className="ib-serif" style={{ fontSize: 44, lineHeight: 1.0, margin: "0 0 10px", color: p.ink }}>
              Install from <em style={{ color: p.accent }}>npm</em>.
            </h1>
            <p className="ib-sans" style={{ fontSize: 13, color: p.muted, margin: 0, maxWidth: 600, lineHeight: 1.55 }}>
              Any <code style={{ background: p.soft, padding: "1px 6px", fontSize: 12 }}>claudepanion-*</code> npm package. The host installs, validates the companion contract, and hot-mounts it — no restart.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 28, alignItems: "start" }}>
            <div>
              {/* Install form */}
              <div className="ib-card">
                <div style={{ padding: "8px 14px", borderBottom: `1px solid ${p.ink}`, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.muted }}>
                  // package name
                </div>
                <div style={{ padding: "14px" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input
                      readOnly
                      value={pkgValue}
                      placeholder="claudepanion-oncall"
                      style={{
                        flex: 1, padding: "9px 12px",
                        border: `1px solid ${installState === "error" ? p.accent : installState === "success" ? p.sage : p.ink + "55"}`,
                        background: p.bg, color: p.ink, fontSize: 13,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    />
                    <button style={{
                      padding: "9px 18px",
                      background: installState === "installing" ? p.soft : p.ink,
                      color: installState === "installing" ? p.muted : p.bg,
                      border: `1px solid ${p.ink}`, fontSize: 12,
                      cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      {installState === "installing" && <span className="ib-spin">⟳</span>}
                      {installState === "installing" ? "installing…" : "install"}
                    </button>
                  </div>
                  <div style={{ fontSize: 10, color: p.muted }}>// must start with claudepanion-</div>

                  {installState === "installing" && (
                    <div style={{ marginTop: 12, padding: "10px 12px", background: p.bg, border: `1px dashed ${p.ink}44`, fontSize: 11, color: p.muted, display: "flex", gap: 8, alignItems: "center" }}>
                      <span className="ib-spin">⟳</span>
                      <span>running npm install claudepanion-oncall…</span>
                    </div>
                  )}

                  {installState === "success" && (
                    <div style={{ marginTop: 12, padding: "12px", background: p.sage + "14", border: `1px solid ${p.sage}`, fontSize: 12 }}>
                      <div style={{ color: p.sage, marginBottom: 4 }}>✓ installed 🚨 on-call-investigator v0.2.1</div>
                      <div style={{ color: p.muted, marginBottom: 10, fontSize: 11 }}>// mounted in sidebar · no restart needed</div>
                      <button style={{ padding: "6px 12px", background: p.ink, color: p.bg, border: 0, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                        open companion →
                      </button>
                    </div>
                  )}

                  {installState === "error" && (
                    <div style={{ marginTop: 12, padding: "10px 12px", background: p.accent + "0d", border: `1px solid ${p.accent}55`, fontSize: 11 }}>
                      <div style={{ color: p.accent, marginBottom: 6 }}>// install failed</div>
                      <pre style={{ margin: 0, color: p.muted, lineHeight: 1.65, whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                        {`npm error 404 Not found\nGET https://registry.npmjs.org/claudepanion-oncall\n'claudepanion-oncall@latest' is not in this registry.`}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* How it works */}
              <div className="ib-card">
                <div style={{ padding: "8px 14px", borderBottom: `1px solid ${p.ink}`, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.muted }}>
                  // how it works
                </div>
                <div style={{ padding: "12px 14px", fontSize: 11, color: p.muted, lineHeight: 1.9 }}>
                  <div>1. type any <code>claudepanion-*</code> package name</div>
                  <div>2. host runs <code>npm install</code> + dynamic import</div>
                  <div>3. companion contract is validated (manifest, form, tools)</div>
                  <div>4. hot-mounted in sidebar · no restart</div>
                  <div>5. persisted to <code>companions/index.ts</code></div>
                </div>
              </div>
            </div>

            {/* Community packages */}
            <aside>
              <div style={{ fontSize: 10, color: p.muted, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>// community packages</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {EXAMPLE_PACKAGES.map(pkg => (
                  <button key={pkg.pkg} className="ib-pkg" style={{
                    padding: "12px 14px", textAlign: "left",
                    border: `1px solid ${p.ink}`, background: p.paper,
                    fontFamily: "inherit", display: "grid", gridTemplateColumns: "28px 1fr", gap: 10,
                  }}>
                    <span style={{ fontSize: 18 }}>{pkg.icon}</span>
                    <div>
                      <div className="ib-sans" style={{ fontWeight: 600, fontSize: 12, color: p.ink, marginBottom: 2 }}>{pkg.name}</div>
                      <div className="ib-sans" style={{ fontSize: 11, color: p.muted, lineHeight: 1.4, marginBottom: 4 }}>{pkg.desc}</div>
                      <div style={{ fontSize: 10, color: p.muted }}>{pkg.pkg}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: 10, color: p.muted, lineHeight: 1.55 }}>
                // registry is npm<br />
                // search claudepanion on npmjs.com
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
};

window.InstallEditorial  = InstallEditorial;
window.InstallDashboard  = InstallDashboard;
