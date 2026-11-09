import { useEffect } from "react";

/**
 * Port of the original app.js interaction layer to a React hook.
 * Runs once after the full page has mounted: scroll progress bar,
 * nav hide-on-scroll, cursor spotlight, scroll-reveal, counters,
 * the "gap/bridge" diagram's scroll-driven progress, the Problem
 * section's horizontal leak meter, and the System section's active
 * module tracking.
 */
export function useFxInteractions(rootRef, spotRef, progRef, bookingUrl) {
  useEffect(() => {
    var calHref = bookingUrl || "https://cal.com/theframex/30min";
    var root = rootRef.current;
    var spot = spotRef.current;
    var prog = progRef.current;
    var nav = document.getElementById("fxNavbar");
    var problemSection = document.getElementById("problem");
    var viewport = document.getElementById("fxViewport");
    var track = document.getElementById("fxTrack");
    var problemCards = problemSection ? Array.prototype.slice.call(problemSection.querySelectorAll(".fx-stk")) : [];
    var bar = document.getElementById("fxBar");
    var sysLine = document.getElementById("fxSysLine");
    var sysCards = Array.prototype.slice.call(document.querySelectorAll(".fx-sys-card"));
    var mapDots = Array.prototype.slice.call(document.querySelectorAll("[data-map-dot]"));
    var mapBtns = Array.prototype.slice.call(document.querySelectorAll("[data-map-btn]"));
    var sysNavNum = document.getElementById("fxSysNavNum");
    var sysNavTotal = document.getElementById("fxSysNavTotal");
    var leakNumEl = document.querySelector("#problem .fx-hs-meter .fx-label");

    var mq = function (q) {
      return !!(window.matchMedia && window.matchMedia(q).matches);
    };
    var reduced = mq("(prefers-reduced-motion: reduce)");
    var cursorOn = mq("(hover: hover) and (pointer: fine)") && !reduced;

    // Problem section: pin in place and turn vertical scroll into horizontal
    // movement through all 7 cards, then release back to normal vertical
    // scroll. Only on desktop-ish viewports with a real pointer; otherwise
    // falls back to native horizontal swipe/scroll-snap (CSS already handles it).
    var canScroll = document.documentElement.scrollHeight > window.innerHeight * 1.5;
    var pinned =
      !reduced &&
      canScroll &&
      window.innerWidth >= 900 &&
      window.innerHeight >= 620 &&
      window.innerHeight < 1400 &&
      cursorOn;
    var maxShift = 0;
    if (problemSection) problemSection.classList.toggle("fx-hs-on", pinned);

    function measureProblemPin() {
      if (!problemSection || !track || !viewport) return;
      if (pinned) {
        track.style.transform = "";
        maxShift = Math.max(0, track.scrollWidth - viewport.clientWidth);
        problemSection.style.height = window.innerHeight + maxShift + "px";
      } else {
        problemSection.style.height = "";
        track.style.transform = "";
      }
    }

    function updateProgress() {
      var docMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var p = Math.max(0, Math.min(1, window.scrollY / docMax));
      if (prog) prog.style.transform = "scaleX(" + p.toFixed(4) + ")";
    }

    var lastY = 0;
    function updateNav() {
      if (!nav || reduced) return;
      var y = window.scrollY;
      if (y > lastY + 4 && y > 320) nav.classList.add("fx-navbar-hide");
      else if (y < lastY - 4 || y < 120) nav.classList.remove("fx-navbar-hide");
      lastY = y;
    }

    var tx = 0, ty = 0, cx = 0, cy = 0, shown = false, sraf = 0;
    function paintSpot() {
      if (spot) spot.style.transform = "translate3d(" + (cx - 480).toFixed(1) + "px," + (cy - 480).toFixed(1) + "px,0)";
    }
    function spotTick() {
      sraf = 0;
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      paintSpot();
      if (Math.abs(tx - cx) > 0.4 || Math.abs(ty - cy) > 0.4) sraf = requestAnimationFrame(spotTick);
    }
    function onPointerMove(e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      var r = root.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!shown) {
        shown = true;
        cx = tx;
        cy = ty;
        paintSpot();
        spot.style.opacity = "1";
      }
      if (!sraf) sraf = requestAnimationFrame(spotTick);
    }
    function onPointerLeave() {
      shown = false;
      if (spot) spot.style.opacity = "0";
    }
    if (cursorOn && root && spot) {
      root.addEventListener("pointermove", onPointerMove);
      root.addEventListener("pointerleave", onPointerLeave);
    }

    var revealEls = Array.prototype.slice.call(document.querySelectorAll(".fx-reveal, .fx-draw, .fx-pop"));
    var stkEls = Array.prototype.slice.call(document.querySelectorAll(".fx-stk"));
    var cxBodies = Array.prototype.slice.call(document.querySelectorAll(".fx-cx-body"));
    var observers = [];

    if (reduced) {
      revealEls.forEach(function (el) { el.classList.add("fx-vis"); });
      stkEls.forEach(function (el) { el.classList.add("in"); });
      cxBodies.forEach(function (el) { el.classList.add("fx-vis"); });
    } else if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add("fx-vis");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
      );
      revealEls.concat(cxBodies).forEach(function (el) { io.observe(el); });
      observers.push(io);

      var ioStk = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) e.target.classList.add("in");
          });
        },
        { threshold: 0.3 }
      );
      stkEls.forEach(function (el) { ioStk.observe(el); });
      observers.push(ioStk);
    } else {
      revealEls.forEach(function (el) { el.classList.add("fx-vis"); });
      stkEls.forEach(function (el) { el.classList.add("in"); });
    }

    var countEls = Array.prototype
      .slice.call(document.querySelectorAll(".fx-count, .fx-ticks-fill"))
      .map(function (el) {
        return {
          el: el,
          box: el.closest(".fx-ledger") || el.closest(".fx-reveal") || el,
          to: el.classList.contains("fx-count") ? +el.getAttribute("data-to") || 0 : null,
          p: el.classList.contains("fx-ticks-fill") ? parseFloat(getComputedStyle(el).getPropertyValue("--p")) || 0 : null,
        };
      });
    function scrollCounts() {
      if (reduced) return;
      var H = window.innerHeight;
      countEls.forEach(function (c) {
        var r = c.box.getBoundingClientRect();
        var t = Math.max(0, Math.min(1, (H * 0.92 - r.top) / (H * 0.45)));
        var e = 1 - Math.pow(1 - t, 3);
        if (c.to !== null) {
          var v = String(Math.round(c.to * e));
          if (c.el.textContent !== v) c.el.textContent = v;
        } else {
          c.el.style.clipPath = "inset(0 " + (100 - c.p * e).toFixed(2) + "% 0 0)";
        }
      });
    }

    var spEls = Array.prototype.slice.call(document.querySelectorAll(".fx-sp"));
    function scrollSp() {
      var H = window.innerHeight;
      spEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var p = Math.max(0, Math.min(1, (H * 0.9 - r.top) / (H * 0.62)));
        el.style.setProperty("--p", p.toFixed(3));
      });
    }

    var tmEls = Array.prototype.slice.call(document.querySelectorAll(".fx-timed"));
    function scrollTimed() {
      var H = window.innerHeight;
      tmEls.forEach(function (el) {
        if (!el._t0 && el.getBoundingClientRect().top < H * 0.8) {
          el._t0 = performance.now();
          (function run() {
            var v = Math.max(0, Math.min(1, (performance.now() - el._t0 - 500) / 6000));
            el.style.setProperty("--p", v.toFixed(3));
            if (v < 1) requestAnimationFrame(run);
          })();
        } else if (!el._t0) {
          el.style.setProperty("--p", "0");
        }
      });
    }

    var gapFig = document.querySelector(".fx-gap3");
    function scrollGap() {
      if (!gapFig) return;
      var H = window.innerHeight;
      var pin = gapFig.closest(".fx-br-pin");
      var pv;
      if (pin && pin.offsetHeight > H * 1.2) {
        var pr = pin.getBoundingClientRect();
        var raw = -pr.top / Math.max(1, pr.height - H);
        pv = Math.max(0, Math.min(1, (raw - 0.2) / 0.68));
      } else {
        var gr = gapFig.getBoundingClientRect();
        pv = Math.max(0, Math.min(1, (H * 0.72 - gr.top) / (gr.height * 1.25)));
      }
      gapFig.style.setProperty("--p", pv.toFixed(3));
    }

    function scrollProblemMeter() {
      var H = window.innerHeight,
        W = window.innerWidth;
      var p = 0;
      if (pinned && problemSection && track) {
        var r = problemSection.getBoundingClientRect();
        p = Math.max(0, Math.min(1, -r.top / Math.max(1, problemSection.offsetHeight - H)));
        track.style.transform = "translate3d(" + (-p * maxShift).toFixed(1) + "px,0,0)";
        problemCards.forEach(function (c) {
          var cr = c.getBoundingClientRect();
          var d = Math.min(1, Math.abs((cr.left + cr.width / 2 - W / 2) / W));
          c.style.transform = "scale(" + (1 - d * 0.08).toFixed(3) + ") rotate(" + (((cr.left + cr.width / 2 - W / 2) / W) * 2).toFixed(2) + "deg)";
          c.style.opacity = (1 - d * 0.55).toFixed(3);
        });
      } else if (viewport) {
        var max = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
        p = Math.max(0, Math.min(1, viewport.scrollLeft / max));
      }
      if (bar) bar.style.transform = "scaleX(" + (0.143 + p * 0.857).toFixed(3) + ")";
      var idx = Math.round(p * 6);
      if (leakNumEl) leakNumEl.textContent = "0" + (idx + 1) + " / 07";
    }
    if (viewport) viewport.addEventListener("scroll", onScroll, { passive: true });

    var sysStage = document.querySelector(".fx-sys-stage");
    function measureSysCards() {
      if (!sysStage || !sysCards.length) return;
      sysStage.style.removeProperty("--cardh");
      if (window.innerWidth < 900) return;
      var tallest = 0;
      sysCards.forEach(function (c) {
        tallest = Math.max(tallest, c.offsetHeight);
      });
      if (tallest > 0) sysStage.style.setProperty("--cardh", tallest + "px");
    }

    function scrollSysMap() {
      if (!sysCards.length) return;
      var stackOn = window.innerWidth >= 900;
      var active = 0;
      var lastStepNum = "05";
      sysCards.forEach(function (c, i) {
        var stickTop = stackOn ? parseFloat(getComputedStyle(c).top) || 104 : window.innerHeight * 0.5;
        if (c.getBoundingClientRect().top <= stickTop + 4) active = i;
      });
      for (var mi = mapBtns.length - 1; mi >= 0; mi--) {
        var n = mapBtns[mi].getAttribute("data-step-number");
        if (n) {
          lastStepNum = n;
          break;
        }
      }
      if (sysLine) sysLine.style.transform = "scaleY(" + (active / Math.max(1, sysCards.length - 1)).toFixed(4) + ")";
      mapDots.forEach(function (d, i) { d.classList.toggle("fx-map-dot-on", i <= active); });
      mapBtns.forEach(function (b, i) { b.classList.toggle("fx-map-on", i === active); });
      if (sysNavNum) {
        var stepNum = mapBtns[active] ? mapBtns[active].getAttribute("data-step-number") : "";
        sysNavNum.textContent = stepNum || lastStepNum;
        if (sysNavTotal) sysNavTotal.textContent = " / " + lastStepNum;
      }
    }

    window.fxGoSys = function (i) {
      var c = sysCards[i];
      if (!c) return;
      var stackOn = window.innerWidth >= 900;
      var offset = stackOn ? 104 + i * 64 : 104;
      var top = window.scrollY + c.getBoundingClientRect().top - offset + 2;
      window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
    };

    var raf = 0;
    function tick() {
      raf = 0;
      updateProgress();
      updateNav();
      scrollCounts();
      scrollSp();
      scrollTimed();
      scrollGap();
      scrollProblemMeter();
      scrollSysMap();
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function onResize() {
      measureProblemPin();
      measureSysCards();
      onScroll();
    }

    function hydrateBookCallLinks() {
      var links = Array.prototype.slice.call(document.querySelectorAll('a[data-book-call="true"]'));
      links.forEach(function (a) {
        a.setAttribute("href", calHref);
        a.setAttribute("rel", "noopener noreferrer");
      });
    }

    var calOverlay = null;
    var calCloseBtn = null;
    var calMount = null;
    var calEmbedReady = false;

    function getCalTarget() {
      try {
        var u = new URL(calHref);
        return {
          origin: u.origin,
          link: u.pathname.replace(/^\/+/, "").replace(/\/+$/, ""),
          href: u.href,
        };
      } catch (_e) {
        var raw = String(calHref || "").trim();
        return {
          origin: "https://cal.com",
          link: raw.replace(/^https?:\/\/[^/]+\//, "").replace(/^\/+/, "").replace(/\/+$/, ""),
          href: raw,
        };
      }
    }

    function mountCalIframeFallback() {
      if (!calMount || calMount.querySelector("iframe")) return;
      var fallback = document.createElement("iframe");
      fallback.title = "FrameX booking";
      var base = getCalTarget().href || "https://cal.com/theframex/30min";
      var sep = base.indexOf("?") === -1 ? "?" : "&";
      fallback.src = base + sep + "theme=light&layout=month_view";
      fallback.style.width = "100%";
      fallback.style.height = "100%";
      fallback.style.border = "0";
      fallback.style.background = "#FFFDF8";
      fallback.setAttribute("allow", "fullscreen");
      calMount.innerHTML = "";
      calMount.appendChild(fallback);
    }

    function ensureCalScript(done) {
      var target = getCalTarget();
      var primarySrc = target.origin.replace(/\/+$/, "") + "/embed/embed.js";
      var fallbackSrc = "https://app.cal.com/embed/embed.js";

      if (window.Cal && typeof window.Cal === "function") {
        done(true);
        return;
      }

      function load(src, onDone) {
        var existing = document.querySelector('script[data-fx-cal-embed="' + src + '"]');
        if (existing) {
          if (window.Cal && typeof window.Cal === "function") onDone(true);
          else existing.addEventListener("load", function () { onDone(true); }, { once: true });
          return;
        }
        var s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.setAttribute("data-fx-cal-embed", src);
        s.onload = function () { onDone(true); };
        s.onerror = function () { onDone(false); };
        document.head.appendChild(s);
      }

      load(primarySrc, function (ok) {
        if (ok) done(true);
        else if (primarySrc !== fallbackSrc) load(fallbackSrc, done);
        else done(false);
      });
    }

    function mountCalEmbed() {
      if (!calMount || calEmbedReady) return;
      calMount.innerHTML = "";
      var loading = document.createElement("div");
      loading.textContent = "Loading booking...";
      loading.style.height = "100%";
      loading.style.display = "grid";
      loading.style.placeItems = "center";
      loading.style.fontFamily = "Montserrat, sans-serif";
      loading.style.fontSize = "14px";
      loading.style.color = "#5F5B53";
      calMount.appendChild(loading);

      ensureCalScript(function (ok) {
        if (!ok || !window.Cal || typeof window.Cal !== "function") {
          mountCalIframeFallback();
          return;
        }
        try {
          var target = getCalTarget();
          if (!target.link) {
            mountCalIframeFallback();
            return;
          }
          window.Cal("ui", {
            theme: "light",
            cssVarsPerTheme: {
              light: {
                "cal-brand": "#FF5B2E",
                "cal-brand-emphasis": "#E04A1F",
                "cal-brand-text": "#FFFDF8",
                "cal-brand-subtle": "#FFD7C8",
                "cal-brand-accent": "#FFFFFF",
                "cal-bg": "#FAF8F4",
                "cal-bg-emphasis": "#F3EFE8",
                "cal-bg-subtle": "#FFFDF8",
                "cal-border": "#E2DDD3",
                "cal-border-subtle": "#ECE7DC",
                "cal-text": "#3F3C36",
                "cal-text-emphasis": "#0C0E0D",
                "cal-text-subtle": "#5F5B53",
                radius: "16px",
                spacing: "0.92rem",
              },
            },
          });
          window.Cal("inline", {
            elementOrSelector: calMount,
            calLink: target.link,
            layout: "month_view",
          });
          calEmbedReady = true;
        } catch (_e) {
          mountCalIframeFallback();
        }
      });
    }

    function ensureCalModal() {
      if (calOverlay) return;

      calOverlay = document.createElement("div");
      calOverlay.setAttribute("aria-hidden", "true");
      calOverlay.style.position = "fixed";
      calOverlay.style.inset = "0";
      calOverlay.style.zIndex = "9999";
      calOverlay.style.display = "none";
      calOverlay.style.alignItems = "center";
      calOverlay.style.justifyContent = "center";
      calOverlay.style.padding = "clamp(12px, 2vw, 28px)";
      calOverlay.style.background = "radial-gradient(70% 85% at 50% 115%, rgba(255,91,46,0.22) 0%, rgba(255,91,46,0.08) 42%, rgba(255,91,46,0) 75%), rgba(12,14,13,0.62)";

      var modal = document.createElement("div");
      modal.style.position = "relative";
      modal.style.width = "min(1180px, 98vw)";
      modal.style.height = "min(90vh, 900px)";
      modal.style.background = "#FAF8F4";
      modal.style.border = "1px solid #E2DDD3";
      modal.style.borderRadius = "20px";
      modal.style.overflow = "hidden";
      modal.style.boxShadow = "0 40px 90px -38px rgba(120,90,40,.55), 0 24px 80px rgba(0,0,0,0.28)";

      var head = document.createElement("div");
      head.style.height = "56px";
      head.style.display = "flex";
      head.style.alignItems = "center";
      head.style.justifyContent = "space-between";
      head.style.padding = "0 14px 0 18px";
      head.style.borderBottom = "1px solid #E2DDD3";
      head.style.background = "linear-gradient(180deg, #FAF8F4 0%, #F3EFE8 100%)";

      var headLabel = document.createElement("span");
      headLabel.textContent = "Book a call";
      headLabel.style.fontFamily = "Montserrat, sans-serif";
      headLabel.style.fontSize = "12px";
      headLabel.style.letterSpacing = ".12em";
      headLabel.style.textTransform = "uppercase";
      headLabel.style.color = "#5F5B53";

      calCloseBtn = document.createElement("button");
      calCloseBtn.type = "button";
      calCloseBtn.setAttribute("aria-label", "Close booking popup");
      calCloseBtn.textContent = "Close";
      calCloseBtn.style.border = "1px solid #E2DDD3";
      calCloseBtn.style.background = "#FFFFFF";
      calCloseBtn.style.color = "#0C0E0D";
      calCloseBtn.style.borderRadius = "999px";
      calCloseBtn.style.padding = "7px 13px";
      calCloseBtn.style.fontFamily = "Montserrat, sans-serif";
      calCloseBtn.style.fontSize = "11px";
      calCloseBtn.style.letterSpacing = ".08em";
      calCloseBtn.style.textTransform = "uppercase";
      calCloseBtn.style.cursor = "pointer";

      calMount = document.createElement("div");
      calMount.style.width = "100%";
      calMount.style.height = "calc(100% - 56px)";
      calMount.style.background = "#FFFDF8";
      calMount.style.overflow = "auto";

      head.appendChild(headLabel);
      head.appendChild(calCloseBtn);
      modal.appendChild(head);
      modal.appendChild(calMount);
      calOverlay.appendChild(modal);
      document.body.appendChild(calOverlay);
    }

    function closeCalModal() {
      if (!calOverlay) return;
      calOverlay.style.display = "none";
      calOverlay.setAttribute("aria-hidden", "true");
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    function openCalModal() {
      ensureCalModal();
      if (!calOverlay) {
        window.location.href = calHref;
        return;
      }
      calOverlay.style.display = "flex";
      calOverlay.setAttribute("aria-hidden", "false");
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      mountCalEmbed();
    }

    function onCalKeydown(e) {
      if (e.key === "Escape") closeCalModal();
    }

    function onCalOverlayClick(e) {
      if (!calOverlay) return;
      if (e.target === calOverlay || e.target === calCloseBtn) closeCalModal();
    }

    function onCalClick(e) {
      var link = e.target && e.target.closest ? e.target.closest('a[data-book-call="true"]') : null;
      if (!link) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      e.preventDefault();
      openCalModal();
    }

    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("click", onCalClick, true);
    document.addEventListener("keydown", onCalKeydown);
    document.addEventListener("click", onCalOverlayClick);

    hydrateBookCallLinks();
    measureProblemPin();
    measureSysCards();
    var fontsPromise =
      document.fonts && document.fonts.ready
        ? document.fonts.ready.then(function () {
            measureProblemPin();
            measureSysCards();
            tick();
          })
        : null;
    tick();

    return function cleanup() {
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onResize);
      if (viewport) viewport.removeEventListener("scroll", onScroll);
      if (root && spot) {
        root.removeEventListener("pointermove", onPointerMove);
        root.removeEventListener("pointerleave", onPointerLeave);
      }
      document.removeEventListener("click", onCalClick, true);
      document.removeEventListener("keydown", onCalKeydown);
      document.removeEventListener("click", onCalOverlayClick);
      if (calOverlay && calOverlay.parentNode) calOverlay.parentNode.removeChild(calOverlay);
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      if (problemSection) {
        problemSection.classList.remove("fx-hs-on");
        problemSection.style.height = "";
      }
      if (track) track.style.transform = "";
      observers.forEach(function (o) { o.disconnect(); });
      delete window.fxGoSys;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
