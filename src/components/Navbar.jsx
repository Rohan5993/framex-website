import { useEffect, useRef, useState } from "react";

const LINKS = [
  { n: "01", label: "The Problem", href: "#problem" },
  { n: "02", label: "The System", href: "#system" },
  { n: "03", label: "Getting started", href: "#start" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false });
  const navRef = useRef(null);
  const linkRefs = useRef([]);

  // subtle elevation once the page has scrolled past the top
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // track which section is currently in view, to light up the matching link
  useEffect(() => {
    const sections = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive("#" + e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // slide the pill-shaped indicator under whichever link is active
  useEffect(() => {
    function place() {
      const i = LINKS.findIndex((l) => l.href === active);
      const el = linkRefs.current[i];
      if (!el) {
        setIndicator((s) => ({ ...s, visible: false }));
        return;
      }
      setIndicator({ left: el.offsetLeft, width: el.offsetWidth, visible: true });
    }
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <header className={"fx-navbar fx-nb" + (scrolled ? " fx-nb-scrolled" : "")} id="fxNavbar">
      <div className="fx-nb-meta fx-hide-sm">
        <div className="fx-wrap fx-nb-meta-in">
          <span>LinkedIn Authority-to-Pipeline <span>Authority-to-Pipeline System &middot; B2B Tech</span>middot; B2B Founders &amp; Firms</span>
          <span className="fx-nb-live">
            <i className="fx-nb-dot" aria-hidden="true" />
            Built in 14 days &middot; live on day 15
          </span>
        </div>
      </div>

      <div className="fx-wrap fx-nb-main">
        <a href="#top" className="fx-nb-mark">
          <span className="fx-nb-wordmark">
            Frame<span className="fx-nb-wordmark-x">X</span>
          </span>
        </a>

        <nav className="fx-nb-links" aria-label="Primary" ref={navRef}>
          <span
            className={"fx-nb-indicator" + (indicator.visible ? " fx-on" : "")}
            style={{ transform: `translateX(${indicator.left}px)`, width: indicator.width }}
            aria-hidden="true"
          />
          {LINKS.map((l, i) => (
            <a key={l.href} href={l.href} data-active={active === l.href} ref={(el) => (linkRefs.current[i] = el)}>
              <span className="fx-nb-n">{l.n}</span>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="fx-nb-actions">
          <a
            className="fx-btn fx-btn-primary fx-nb-cta fx-hide-sm"
            href="#contact"
            style={{ minHeight: 44, padding: "10px 20px", fontSize: 15 }}
          >
            Book a call
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h9.5M8 3.5 11.5 7 8 10.5" stroke="#0C0E0D" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <button
            type="button"
            className="fx-nb-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="fxNavDrawer"
            onClick={() => setOpen((o) => !o)}
          >
            <span>
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div id="fxNavDrawer" className={"fx-nb-drawer" + (open ? " fx-open" : "")}>
        <div className="fx-nb-drawer-in">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              <span className="fx-nb-n">{l.n}</span>
              {l.label}
            </a>
          ))}
          <a className="fx-btn fx-btn-primary fx-nb-drawer-cta" href="#contact" onClick={() => setOpen(false)}>
            Book a call
          </a>
        </div>
      </div>
    </header>
  );
}
