import { modules } from "../data/modules";

function goSys(i) {
  if (typeof window !== "undefined" && window.fxGoSys) window.fxGoSys(i);
}

export default function System() {
  return (
    <section
      id="system"
      className="fx-sys"
      style={{ background: "linear-gradient(180deg, #FAF8F4 0%, #F3EFE8 8%, #F3EFE8 92%, #FAF8F4 100%)" }}
    >
      <div className="fx-sys-sticky">
        <div className="fx-wrap fx-sys-inner">
          <div className="fx-split" style={{ alignItems: "flex-end", rowGap: 14 }}>
            <div style={{ flex: "1 1 460px", display: "flex", flexDirection: "column", gap: 14 }}>
              <p className="fx-label" style={{ margin: 0 }}>
                Our 6-step Authority-to-Pipeline System
              </p>
              <h2 className="fx-display fx-sys-h2">
                Six connected systems. <em>One commercial path.</em>
              </h2>
            </div>
            <p className="fx-lede fx-sys-lede" style={{ flex: "1 1 340px", maxWidth: "50ch" }}>
              Each system fixes a specific leak. Together they take a buyer from &ldquo;never heard of you&rdquo; to a qualified
              conversation your team is ready to win. The first five are built in your first 14 days and go live on day 15.
            </p>
          </div>

          <div className="fx-sys-body">
            <nav aria-label="System map" className="fx-sys-map fx-hide-sm">
              <p className="fx-label" style={{ margin: "0 0 18px", fontSize: 11 }}>
                System map &middot; <span className="fx-sig" id="fxSysNavNum">01</span> / 06
              </p>
              <div style={{ position: "relative" }}>
                <span aria-hidden="true" style={{ position: "absolute", left: 6, top: 10, bottom: 26, width: 1.5, background: "#D9D3C7" }} />
                <span aria-hidden="true" className="fx-sys-line" id="fxSysLine" />
                <ol style={{ position: "relative", listStyle: "none", margin: 0, padding: 0 }}>
                  {modules.map((m, i) => (
                    <li key={m.id} style={{ position: "relative", padding: "0 0 16px 30px" }}>
                      <span aria-hidden="true" className={"fx-map-dot" + (i === 0 ? " fx-map-dot-on" : "")} data-map-dot={i} />
                      <button
                        type="button"
                        className={"fx-map-btn" + (i === 0 ? " fx-map-on" : "")}
                        data-map-btn={i}
                        onClick={() => goSys(i)}
                      >
                        <span className="fx-label" style={{ fontSize: 10 }}>
                          {m.num}
                        </span>{" "}
                        {m.short}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
              <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid #D9D3C7", display: "flex", flexDirection: "column", gap: 6 }}>
                <span className="fx-label" style={{ fontSize: 10 }}>
                  Build &middot; days 1&ndash;14
                </span>
                <span className="fx-label fx-sig" style={{ fontSize: 10 }}>
                  Live &middot; day 15
                </span>
              </div>
            </nav>

            <ol className="fx-sys-stage" id="fxSysStage">
              {modules.map((m, i) => (
                <li key={m.id} id={m.id} className="fx-sys-card" data-sys-index={i} style={{ "--o": i }}>
                  <div className="fx-sys-bar">
                    <span className="fx-label fx-sig" style={{ fontSize: 11 }}>
                      {m.num}
                    </span>
                    <h3 className="fx-sys-bar-t">{m.title}</h3>
                    <span className="fx-chip fx-fixes fx-hide-sm">
                      <i aria-hidden="true" />
                      Fixes {m.fixes}
                    </span>
                  </div>
                  <div className="fx-sys-body-in">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 28px", alignItems: "flex-end" }}>
                      <span aria-hidden="true" className="fx-outline-num">
                        {m.num}
                      </span>
                      <p
                        style={{
                          flex: "1 1 260px",
                          margin: "0 0 8px",
                          fontFamily: "'Newsreader', Georgia, serif",
                          fontStyle: "italic",
                          fontSize: "clamp(22px, 2.2vw, 30px)",
                          lineHeight: 1.2,
                          color: "#0C0E0D",
                        }}
                      >
                        {m.tag}
                      </p>
                    </div>
                    <div className="fx-files" style={{ marginTop: 18, background: "#FFFFFF", border: "1px solid #E2DDD3" }}>
                      <div
                        className="fx-files-h"
                        style={{ display: "flex", justifyContent: "space-between", padding: "9px 18px", borderBottom: "1px solid #E2DDD3", background: "#F8F6F2" }}
                      >
                        <span className="fx-label" style={{ fontSize: 10 }}>
                          You get
                        </span>
                        <span className="fx-label" style={{ fontSize: 10 }}>
                          Cadence
                        </span>
                      </div>
                      {m.files.map(([name, desc, cad]) => (
                        <div className="fx-file" key={name}>
                          <span className="fx-file-name">{name}</span>
                          <span className="fx-file-desc">{desc}</span>
                          <span className="fx-file-cad">{cad}</span>
                        </div>
                      ))}
                    </div>
                    {m.isClose && (
                      <div className="fx-close">
                        <span className="fx-close-check" aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="22" height="22">
                            <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#0C0E0D" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <div style={{ position: "relative", zIndex: 1 }}>
                          <strong>Your team closes.</strong>
                          <span className="fx-close-sub">Qualified, with context, ready to win. That&rsquo;s the deal.</span>
                        </div>
                        <i className="fx-spark" aria-hidden="true" />
                        <i className="fx-spark" aria-hidden="true" />
                        <i className="fx-spark" aria-hidden="true" />
                        <i className="fx-spark" aria-hidden="true" />
                      </div>
                    )}
                    {m.note && (
                      <p style={{ margin: "12px 0 0", fontSize: 15, color: "#3F3C36", display: "flex", gap: 10, alignItems: "baseline" }}>
                        <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF5B2E", flex: "none", transform: "translateY(-1px)" }} />
                        {m.note}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
