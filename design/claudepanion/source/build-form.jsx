// Build companion form page — /c/build/new
// Two states: blank arrival + chip-prefilled (github-pr-reviewer)
// Two directions: A (editorial) and B (dashboard/terminal)
// Both export to window for use in Landing Page.html canvas.

const FORM_PALETTE = (theme) => ({
  warm: { bg: "#F5EFE6", ink: "#1B1814", muted: "#6B6157", accent: "#C8553D", soft: "#E8DFD0", paper: "#FAF5EC", sage: "#7A8B7A", border: "#1B181420" },
  cool: { bg: "#F1F2F1", ink: "#15181A", muted: "#5C6266", accent: "#3D6FB8", soft: "#DDE2DE", paper: "#F6F7F4", sage: "#7A8788", border: "#15181A20" },
  dark: { bg: "#1B1814", ink: "#F5EFE6", muted: "#9A8F82", accent: "#E0826A", soft: "#2A2520", paper: "#1F1B16", sage: "#9DB09C", border: "#F5EFE614" },
  sage: { bg: "#EFEEE6", ink: "#1F2421", muted: "#5E6863", accent: "#B0493B", soft: "#DBDED0", paper: "#F6F5EE", sage: "#5C7A66", border: "#1F242114" },
})[theme] || {bg:"#EFEEE6",ink:"#1F2421",muted:"#5E6863",accent:"#B0493B",soft:"#DBDED0",paper:"#F6F5EE",sage:"#5C7A66",border:"#1F242114"};

const PR_EXAMPLE = {
  slug: "github-pr-reviewer",
  icon: "🔎",
  displayName: "GitHub PR reviewer",
  kind: "entity",
  description: "Review a GitHub pull request: fetch the PR metadata, the unified diff, and existing review comments. Flag risky diffs (auth changes, swallowed errors, missing tests) and suggest review questions for the author. Read-only — do not post anything back to GitHub.",
};

// ─── Shared chrome (sidebar + header) ────────────────────────────────────────
const ChromeA = ({ p, children }) => (
  <div style={{ background: p.bg, color: p.ink, minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif", display: "grid", gridTemplateColumns: "240px 1fr" }}>
    <style>{`
      .bfa-serif { font-family: 'Instrument Serif', Georgia, serif; }
      .bfa-mono  { font-family: 'JetBrains Mono', ui-monospace, monospace; }
      .bfa-link:hover { background: ${p.soft}; }
      .bfa-field { width: 100%; padding: 10px 12px; border: 1px solid ${p.ink}26; border-radius: 6px; background: ${p.bg}; color: ${p.ink}; font-size: 14px; font-family: inherit; transition: border-color .15s; }
      .bfa-field:focus { outline: none; border-color: ${p.sage}; box-shadow: 0 0 0 3px ${p.sage}22; }
      .bfa-tab-active   { background: ${p.ink}; color: ${p.bg}; border-color: ${p.ink}; }
      .bfa-tab-inactive { background: transparent; color: ${p.muted}; border-color: ${p.ink}26; }
      .bfa-tab-inactive:hover { background: ${p.soft}; color: ${p.ink}; }
      .bfa-chip { border: 1px solid ${p.ink}1a; transition: border-color .15s, background .15s, transform .12s; cursor: pointer; background: ${p.bg}; }
      .bfa-chip:hover { border-color: ${p.accent}; background: ${p.paper}; transform: translateY(-1px); }
      .bfa-chip.selected { border-color: ${p.sage}; background: ${p.sage}14; }
      .bfa-pulse { width:8px; height:8px; border-radius:999px; display:inline-block; background:${p.sage}; animation: bfapulse 2s infinite; }
      @keyframes bfapulse { 0%{box-shadow:0 0 0 0 ${p.sage}55} 70%{box-shadow:0 0 0 7px transparent} 100%{box-shadow:0 0 0 0 transparent} }
    `}</style>
    {/* Sidebar */}
    <aside style={{ background: p.paper, borderRight: `1px solid ${p.ink}14`, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ padding: "4px 8px" }}>
        <div className="bfa-serif" style={{ fontSize: 22, fontStyle: "italic" }}>claudepanion</div>
        <div className="bfa-mono" style={{ fontSize: 10, color: p.muted, marginTop: 2 }}>localhost:3001</div>
      </div>
      <div>
        <div className="bfa-mono" style={{ fontSize: 10, color: p.muted, letterSpacing: ".12em", textTransform: "uppercase", padding: "0 8px 8px" }}>Core</div>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: p.sage + "26", color: p.ink, textDecoration: "none", fontSize: 14, borderLeft: `3px solid ${p.sage}` }}>
          <span style={{ width: 22, height: 22, borderRadius: 5, background: p.ink, color: p.bg, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>B</span>
          <span>Build</span>
        </a>
      </div>
      <div>
        <div className="bfa-mono" style={{ fontSize: 10, color: p.muted, letterSpacing: ".12em", textTransform: "uppercase", padding: "0 8px 8px" }}>System</div>
        <div style={{ padding: "0 10px", fontSize: 11, lineHeight: 2 }}>
          {["host running", "MCP /mcp open", "plugin installed"].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, color: p.muted }}>
              <span className="bfa-pulse" />
              {s}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "auto", padding: "10px 8px", fontSize: 10, color: p.muted, borderTop: `1px solid ${p.ink}10` }}>
        Independent open-source project.<br />Not affiliated with Anthropic.
      </div>
    </aside>
    <main style={{ padding: "36px 56px 80px", display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 12, color: p.muted, marginBottom: 24, display: "flex", gap: 6, alignItems: "center" }}>
        <span>claudepanion</span><span style={{ opacity: .4 }}>›</span>
        <a href="#" style={{ color: p.muted, textDecoration: "none" }}>Build</a><span style={{ opacity: .4 }}>›</span>
        <span style={{ color: p.ink }}>New companion</span>
      </div>
      {children}
    </main>
  </div>
);

const ChromeB = ({ p, children }) => (
  <div style={{ background: p.bg, color: p.ink, minHeight: "100%", fontFamily: "'JetBrains Mono', ui-monospace, monospace", fontSize: 13, display: "grid", gridTemplateColumns: "260px 1fr" }}>
    <style>{`
      .bfb-sans  { font-family: 'Inter', system-ui, sans-serif; }
      .bfb-serif { font-family: 'Instrument Serif', Georgia, serif; }
      .bfb-field { width:100%; padding:9px 12px; border:1px solid ${p.ink}; background:${p.bg}; color:${p.ink}; font-size:13px; font-family:'JetBrains Mono',monospace; }
      .bfb-field:focus { outline:none; border-color:${p.sage}; box-shadow:0 0 0 2px ${p.sage}33; }
      .bfb-tab-active   { background:${p.ink}; color:${p.bg}; border:1px solid ${p.ink}; }
      .bfb-tab-inactive { background:transparent; color:${p.muted}; border:1px solid ${p.ink}33; }
      .bfb-tab-inactive:hover { background:${p.soft}; color:${p.ink}; }
      .bfb-chip { border:1px solid ${p.ink}; background:${p.paper}; cursor:pointer; transition:transform .12s, box-shadow .12s; }
      .bfb-chip:hover { transform:translate(-1px,-1px); box-shadow:2px 2px 0 ${p.ink}; }
      .bfb-chip.selected { background:${p.sage}22; border-color:${p.sage}; }
      .bfb-dot { width:7px;height:7px;border-radius:999px;display:inline-block;background:${p.sage}; }
    `}</style>
    {/* Sidebar */}
    <aside style={{ background: p.paper, borderRight: `1px solid ${p.ink}`, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${p.ink}`, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 10, height: 10, background: p.accent, borderRadius: 999 }} />
        <span style={{ fontWeight: 600 }}>claudepanion</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: p.muted }}>:3001</span>
      </div>
      <div style={{ padding: "12px 8px" }}>
        <div style={{ padding: "0 10px 6px", fontSize: 10, color: p.muted, letterSpacing: ".15em", textTransform: "uppercase" }}>Core</div>
        <a href="#" style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 10, alignItems: "center", padding: "8px 10px", background: p.bg, border: `1px solid ${p.ink}`, color: p.ink, textDecoration: "none", fontSize: 12, borderLeft: `3px solid ${p.sage}` }}>
          <span style={{ width: 18, height: 18, background: p.ink, color: p.bg, display: "grid", placeItems: "center", fontSize: 10 }}>B</span>
          <span>build</span>
        </a>
      </div>
      <div style={{ padding: "4px 8px", marginTop: 4 }}>
        <div style={{ padding: "0 10px 6px", fontSize: 10, color: p.muted, letterSpacing: ".15em", textTransform: "uppercase" }}>System</div>
        <div style={{ padding: "0 10px", fontSize: 11, lineHeight: 2 }}>
          {["host :3001", "MCP /mcp", "plugin ok"].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, color: p.muted }}>
              <span className="bfb-dot" />{s}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "auto", padding: "10px 16px", borderTop: `1px solid ${p.ink}`, fontSize: 10, color: p.muted, lineHeight: 1.5 }}>
        // independent open-source project<br />// not affiliated with anthropic
      </div>
    </aside>
    <main style={{ display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ padding: "10px 24px", borderBottom: `1px solid ${p.ink}`, display: "flex", alignItems: "center", gap: 6, background: p.paper, fontSize: 12 }}>
        <span style={{ color: p.muted }}>~/</span>
        <a href="#" style={{ color: p.muted, textDecoration: "none" }}>build</a>
        <span style={{ color: p.muted }}>/</span>
        <span style={{ color: p.ink }}>new</span>
      </div>
      <div style={{ padding: "28px 32px 80px" }}>
        {children}
      </div>
    </main>
  </div>
);

// ─── Direction A · Editorial ─────────────────────────────────────────────────
const BuildFormEditorial = ({ theme = "sage", prefilled = false }) => {
  const p = FORM_PALETTE(theme);
  const ex = prefilled ? PR_EXAMPLE : null;

  const ModeTab = ({ active, children }) => (
    <button style={{
      padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500,
      border: `1px solid ${active ? p.ink : p.ink + "26"}`,
      background: active ? p.ink : "transparent",
      color: active ? p.bg : p.muted,
      fontFamily: "inherit",
      transition: "background .15s, color .15s",
    }}>
      {children}
    </button>
  );

  return (
    <ChromeA p={p}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 className="bfa-serif" style={{ fontSize: 52, lineHeight: 1.0, margin: "0 0 12px", letterSpacing: "-0.01em" }}>
          {prefilled
            ? <>Scaffolding <em style={{ color: p.accent }}>{ex.icon} {ex.displayName}</em></>
            : <>Build a new <em style={{ color: p.accent }}>companion</em>.</>
          }
        </h1>
        <p style={{ fontSize: 15, color: p.muted, margin: 0, maxWidth: 560, lineHeight: 1.55 }}>
          {prefilled
            ? "Prefilled from the example chip. Review the description below and adjust any details before submitting — Build will scaffold the manifest, MCP proxy tools, skill, and pages."
            : "Describe the tool you want. Name the external service, what data to fetch, and what the output should look like. Build interprets the description and scaffolds everything from there."
          }
        </p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        <ModeTab active={true}>✨ New companion</ModeTab>
        <ModeTab active={false}>⟳ Iterate on existing</ModeTab>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 40, alignItems: "start" }}>
        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Companion name</label>
            <input
              className="bfa-field"
              readOnly
              value={prefilled ? ex.slug : ""}
              placeholder="oncall-investigator"
              style={{ padding: "10px 12px", border: `1px solid ${p.ink}26`, borderRadius: 6, background: prefilled ? p.sage + "10" : p.bg, color: p.ink, fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}
            />
            <span style={{ fontSize: 11, color: p.muted }}>lowercase · hyphens only · starts with a letter</span>
          </div>

          {/* Kind */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Kind</label>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { val: "entity", label: "entity", hint: "form, lifecycle, artifacts" },
                { val: "tool",   label: "tool",   hint: "MCP tools only, auto About page" },
              ].map(({ val, label, hint }) => (
                <button key={val} style={{
                  flex: 1, padding: "12px 14px", textAlign: "left", cursor: "pointer",
                  border: `1px solid ${(prefilled ? ex.kind === val : val === "entity") ? p.sage : p.ink + "1a"}`,
                  borderRadius: 6, background: (prefilled ? ex.kind === val : val === "entity") ? p.sage + "14" : "transparent",
                  fontFamily: "inherit",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: p.ink, marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 11, color: p.muted }}>{hint}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Description</label>
            <textarea
              className="bfa-field"
              readOnly
              rows={prefilled ? 7 : 5}
              value={prefilled ? ex.description : ""}
              placeholder={`Describe the companion. Name the external service (GitHub, AWS, Linear, Slack…), what data to fetch, and what the artifact should contain.

Tip: companions get value from authenticated proxy access to external systems. The form captures where to query — not 'paste your text here'.`}
              style={{ padding: "10px 12px", border: `1px solid ${p.ink}26`, borderRadius: 6, background: prefilled ? p.sage + "08" : p.bg, color: prefilled ? p.ink : p.muted, fontSize: prefilled ? 14 : 13, fontFamily: "inherit", lineHeight: 1.6, resize: "vertical", borderColor: prefilled ? p.sage + "88" : p.ink + "26" }}
            />
            {!prefilled && (
              <span style={{ fontSize: 11, color: p.muted, lineHeight: 1.5 }}>
                Tip: companions get architectural value from <strong style={{ color: p.ink }}>authenticated proxy access</strong> to external systems. The form captures <em>where</em> to query — not "paste your text here."
              </span>
            )}
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", paddingTop: 4 }}>
            <button style={{ padding: "11px 22px", background: p.ink, color: p.bg, border: 0, borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}>
              Build companion →
            </button>
            <button style={{ padding: "11px 16px", background: "transparent", border: `1px solid ${p.ink}26`, borderRadius: 999, fontSize: 13, color: p.muted, cursor: "pointer", fontFamily: "inherit" }}>
              Cancel
            </button>
          </div>
        </div>

        {/* Aside — context panel */}
        <aside style={{ position: "sticky", top: 24 }}>
          {prefilled ? (
            <div style={{ border: `1px solid ${p.sage}55`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", background: p.sage + "18", borderBottom: `1px solid ${p.sage}33`, display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 22 }}>{ex.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Starting from example</div>
                  <div style={{ fontSize: 11, color: p.muted }}>{ex.displayName}</div>
                </div>
              </div>
              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div className="bfa-mono" style={{ fontSize: 10, color: p.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>What Build will create</div>
                  <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: p.ink, lineHeight: 2 }}>
                    <li>manifest.ts + index.ts</li>
                    <li>types.ts (Input + Artifact)</li>
                    <li>form.tsx</li>
                    <li>pages/List.tsx + Detail.tsx</li>
                    <li>server/tools.ts</li>
                    <li>skills/{ex.slug}/SKILL.md</li>
                  </ul>
                </div>
                <div style={{ paddingTop: 10, borderTop: `1px solid ${p.ink}10` }}>
                  <div className="bfa-mono" style={{ fontSize: 10, color: p.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 4 }}>After submitting</div>
                  <p style={{ margin: 0, fontSize: 12, color: p.muted, lineHeight: 1.55 }}>
                    A pending entity appears. Run the slash command in Claude Code — Build scaffolds, validates, and mounts the companion without a restart.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: "16px", background: p.soft, borderRadius: 8 }}>
              <div className="bfa-serif" style={{ fontSize: 18, marginBottom: 8 }}>Or start from an example</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: "🔎", name: "GitHub PR reviewer" },
                  { icon: "📊", name: "CloudWatch investigator" },
                  { icon: "📋", name: "Linear backlog groomer" },
                ].map(c => (
                  <button key={c.name} className="bfa-chip" style={{
                    padding: "10px 12px", borderRadius: 6, textAlign: "left", display: "flex", gap: 10, alignItems: "center", fontFamily: "inherit", fontSize: 13,
                  }}>
                    <span>{c.icon}</span>
                    <span style={{ color: p.ink }}>{c.name}</span>
                    <span style={{ marginLeft: "auto", color: p.muted, fontSize: 16 }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </ChromeA>
  );
};

// ─── Direction B · Dashboard/Terminal ────────────────────────────────────────
const BuildFormDashboard = ({ theme = "sage", prefilled = false }) => {
  const p = FORM_PALETTE(theme);
  const ex = prefilled ? PR_EXAMPLE : null;

  return (
    <ChromeB p={p}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 10, color: p.accent, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 10 }}>
          {prefilled ? `$ build new-companion --from ${ex.slug}` : "$ build new-companion"}
        </div>
        <h1 className="bfb-serif" style={{ fontSize: 48, lineHeight: 1.0, margin: "0 0 10px", color: p.ink }}>
          {prefilled
            ? <><em style={{ color: p.accent }}>{ex.icon}</em> {ex.displayName}</>
            : <>New companion.</>
          }
        </h1>
        <p className="bfb-sans" style={{ fontSize: 14, color: p.muted, margin: 0, maxWidth: 560, lineHeight: 1.5 }}>
          {prefilled
            ? "Prefilled from example chip. Adjust the description if needed, then submit."
            : "Describe what it should do. Name the external system, what to fetch, what the artifact should contain."
          }
        </p>
      </div>

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {["✨ new-companion", "⟳ iterate-companion"].map((label, i) => (
          <button key={label} className={i === 0 ? "bfb-tab-active" : "bfb-tab-inactive"} style={{
            padding: "6px 14px", cursor: "pointer", fontSize: 12, fontFamily: "inherit",
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>
        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Name */}
          <div>
            <div style={{ fontSize: 10, color: p.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>name</div>
            <input
              className="bfb-field"
              readOnly
              value={prefilled ? ex.slug : ""}
              placeholder="oncall-investigator"
              style={{ padding: "9px 12px", border: `1px solid ${prefilled ? p.sage : p.ink + "66"}`, background: prefilled ? p.sage + "0d" : p.bg, color: p.ink, fontSize: 13, fontFamily: "'JetBrains Mono', monospace", width: "100%" }}
            />
            <div style={{ marginTop: 4, fontSize: 10, color: p.muted }}>// lowercase · hyphens · starts with a letter</div>
          </div>

          {/* Kind */}
          <div>
            <div style={{ fontSize: 10, color: p.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>kind</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { val: "entity", hint: "// form, lifecycle, artifacts" },
                { val: "tool",   hint: "// MCP tools only, auto About" },
              ].map(({ val, hint }) => {
                const active = prefilled ? ex.kind === val : val === "entity";
                return (
                  <button key={val} style={{
                    flex: 1, padding: "10px 12px", textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                    border: `1px solid ${active ? p.sage : p.ink + "33"}`,
                    background: active ? p.sage + "18" : "transparent",
                    color: p.ink,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{val}</div>
                    <div style={{ fontSize: 10, color: p.muted, marginTop: 2 }}>{hint}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <div style={{ fontSize: 10, color: p.muted, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 6 }}>
              {prefilled ? "description (prefilled — review before submitting)" : "description"}
            </div>
            <textarea
              className="bfb-field"
              readOnly
              rows={prefilled ? 8 : 6}
              value={prefilled ? ex.description : ""}
              placeholder={"// describe the companion\n// name the external system (GitHub, AWS, Linear...)\n// what data to fetch, what the artifact should contain\n// read-only by default — say explicitly if it should write back"}
              style={{ padding: "10px 12px", border: `1px solid ${prefilled ? p.sage : p.ink + "33"}`, background: prefilled ? p.sage + "08" : p.bg, color: prefilled ? p.ink : p.muted + "99", fontSize: 12, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.65, resize: "vertical", width: "100%", borderColor: prefilled ? p.sage + "77" : p.ink + "44" }}
            />
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
            <button style={{ padding: "10px 20px", background: p.ink, color: p.bg, border: `1px solid ${p.ink}`, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              $ submit → claude scaffolds
            </button>
            <button style={{ padding: "10px 14px", background: "transparent", border: `1px solid ${p.ink}33`, fontSize: 12, color: p.muted, cursor: "pointer", fontFamily: "inherit" }}>
              cancel
            </button>
          </div>
        </div>

        {/* Aside */}
        <aside>
          {prefilled ? (
            <div style={{ border: `1px solid ${p.ink}`, background: p.paper }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${p.ink}`, background: p.soft, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.muted }}>
                // what build will create
              </div>
              <div style={{ padding: "12px 14px" }}>
                <pre style={{ margin: 0, fontSize: 11, color: p.muted, lineHeight: 1.8, fontFamily: "'JetBrains Mono', monospace" }}>{`companions/
  ${ex.slug}/
    manifest.ts
    index.ts
    types.ts
    form.tsx
    pages/
      List.tsx
      Detail.tsx
    server/
      tools.ts
skills/
  ${ex.slug}/
    SKILL.md`}
                </pre>
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px dashed ${p.ink}33`, fontSize: 10, color: p.muted, lineHeight: 1.55 }}>
                  // after submit: pending entity appears.<br />
                  // run <span style={{ color: p.accent }}>/build-companion &lt;id&gt;</span><br />
                  // in claude code → builds + mounts.
                </div>
              </div>
            </div>
          ) : (
            <div style={{ border: `1px solid ${p.ink}`, background: p.paper }}>
              <div style={{ padding: "10px 14px", borderBottom: `1px solid ${p.ink}`, fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: p.muted }}>
                // or start from an example
              </div>
              <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: "🔎", name: "github-pr-reviewer" },
                  { icon: "📊", name: "cloudwatch-investigator" },
                  { icon: "📋", name: "linear-groomer" },
                ].map(c => (
                  <button key={c.name} className="bfb-chip" style={{
                    padding: "9px 12px", textAlign: "left", display: "flex", gap: 10, alignItems: "center", fontFamily: "inherit", fontSize: 12, color: p.ink,
                  }}>
                    <span>{c.icon}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{c.name}</span>
                    <span style={{ marginLeft: "auto", color: p.muted }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tip */}
          <div style={{ marginTop: 14, padding: "10px 14px", background: p.bg, border: `1px dashed ${p.ink}44`, fontSize: 10, color: p.muted, lineHeight: 1.6 }}>
            // tip: name the external system<br />
            // companions work best with<br />
            // authenticated proxy access —<br />
            // not "paste text here."
          </div>
        </aside>
      </div>
    </ChromeB>
  );
};

window.BuildFormEditorial  = BuildFormEditorial;
window.BuildFormDashboard  = BuildFormDashboard;
