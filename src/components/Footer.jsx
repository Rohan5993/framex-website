export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #E2DDD3", padding: "clamp(18px, 3vw, 32px) 0 clamp(22px, 4vw, 40px)" }}>
      <div
        className="fx-wrap"
        style={{ display: "flex", flexWrap: "nowrap", justifyContent: "space-between", alignItems: "baseline", gap: "clamp(8px, 2vw, 16px)" }}
      >
        <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "clamp(14px, 3.6vw, 22px)", color: "#0C0E0D", flex: "0 0 auto" }}>
          Frame<span style={{ fontWeight: 700, color: "#FF5B2E" }}>X</span>
        </span>
        <span
          className="fx-label"
          style={{ fontSize: "clamp(7px, 1.9vw, 11px)", flex: "1 1 auto", minWidth: 0, textAlign: "center" }}
        >
          Positioning-to-Pipeline System for B2B Founders &amp; Firms
        </span>
        <span style={{ fontSize: "clamp(9px, 2.4vw, 13px)", color: "#5F5B53", flex: "0 0 auto", whiteSpace: "nowrap" }}>
          &copy; {new Date().getFullYear()} FrameX
        </span>
      </div>
    </footer>
  );
}
