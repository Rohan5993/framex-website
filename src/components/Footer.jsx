export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid #E2DDD3", padding: "32px 0 40px" }}>
      <div className="fx-wrap" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 16, alignItems: "baseline" }}>
        <span style={{ fontFamily: "'Newsreader', Georgia, serif", fontSize: 22, color: "#0C0E0D" }}>
          Frame<span style={{ fontWeight: 700, color: "#FF5B2E" }}>X</span>
        </span>
        <span className="fx-label" style={{ fontSize: 11 }}>
          The LinkedIn Authority-to-Pipeline System for B2B Founders & Firms
        </span>
        <span style={{ fontSize: 13, color: "#5F5B53" }}>&copy; {new Date().getFullYear()} FrameX</span>
      </div>
    </footer>
  );
}
