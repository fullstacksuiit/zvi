// Zain Ventures India — Travelogue interactions
(function () {
  "use strict";

  // ---------- Year ----------
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  // ---------- Live IST clock ----------
  const t1 = document.getElementById("liveTime");
  const t2 = document.getElementById("liveTime2");
  const fmtTime = () => {
    const opts = { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" };
    return new Date().toLocaleTimeString("en-IN", opts) + " IST";
  };
  const tickClock = () => {
    const s = fmtTime();
    if (t1) t1.textContent = s;
    if (t2) t2.textContent = s.replace(" IST", "");
  };
  tickClock(); setInterval(tickClock, 30 * 1000);

  // ---------- Random pass number ----------
  const passNo = document.getElementById("passNo");
  if (passNo) {
    const a = Math.floor(100 + Math.random() * 900);
    const b = Math.floor(1000 + Math.random() * 9000);
    passNo.textContent = `${a}-${b}`;
  }

  // ---------- Nav scroll state ----------
  const nav = document.getElementById("nav");
  let lastScrolled = false;
  const onScroll = () => {
    const y = window.scrollY;
    const scrolled = y > 24;
    if (scrolled !== lastScrolled && nav) {
      nav.classList.toggle("is-scrolled", scrolled);
      lastScrolled = scrolled;
    }
  };
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  // ---------- Mobile menu ----------
  const navToggle = document.getElementById("navToggle");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    if (navToggle) navToggle.setAttribute("aria-expanded", String(open));
  };
  if (navToggle) navToggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  document.querySelectorAll(".menu nav a, .menu .menu-cta a").forEach(a => a.addEventListener("click", () => setMenu(false)));

  // ---------- Smooth scroll for hash links ----------
  document.querySelectorAll('a[href^="#"]:not(.row)').forEach(a => {
    a.addEventListener("click", e => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // ---------- Route switching: bus follows the selected destination ----------
  // Map destination key → SVG path id, station-style code, name, geometry.
  const ROUTES = {
    PURI:        { id: "route-puri",        label: "PUR", name: "Puri",        km: "500 KM", dur: "9H 30M",  ms: 12000 },
    BHUBANESWAR: { id: "route-bhubaneswar", label: "BBI", name: "Bhubaneswar", km: "370 KM", dur: "7H 00M",  ms: 10000 },
    KOLKATA:     { id: "route-kolkata",     label: "CCU", name: "Kolkata",     km: "540 KM", dur: "10H 30M", ms: 13000 },
    RANCHI:      { id: "route-ranchi",      label: "IXR", name: "Ranchi",      km: "210 KM", dur: "4H 30M",  ms: 7000  },
    JAMSHEDPUR:  { id: "route-jamshedpur",  label: "IXW", name: "Jamshedpur",  km: "180 KM", dur: "3H 30M",  ms: 6500  },
    SAMBALPUR:   { id: "route-sambalpur",   label: "SBP", name: "Sambalpur",   km: "165 KM", dur: "3H 30M",  ms: 6500  },
    SIMLIPAL:    { id: "route-simlipal",    label: "SIM", name: "Simlipal",    km: "230 KM", dur: "5H 00M",  ms: 7500  },
    VARANASI:    { id: "route-varanasi",    label: "VNS", name: "Varanasi",    km: "880 KM", dur: "16H 00M", ms: 17000 },
    CUTTACK:     { id: "route-cuttack",     label: "CTC", name: "Cuttack",     km: "350 KM", dur: "7H 00M",  ms: 9500  },
    // Common alternates / extras useful for free-text "to" input
    KONARK:      { id: "route-puri",        label: "KNK", name: "Konark",      km: "490 KM", dur: "9H 30M",  ms: 12000 },
    DEOGHAR:     { id: "route-varanasi",    label: "DGR", name: "Deoghar",     km: "420 KM", dur: "9H 00M",  ms: 12000 },
    GAYA:        { id: "route-varanasi",    label: "GAY", name: "Gaya",        km: "660 KM", dur: "13H 00M", ms: 15000 },
    BOKARO:      { id: "route-jamshedpur",  label: "BKO", name: "Bokaro",      km: "230 KM", dur: "5H 00M",  ms: 7500  },
    DHANBAD:     { id: "route-jamshedpur",  label: "DHN", name: "Dhanbad",     km: "260 KM", dur: "5H 30M",  ms: 8000  },
  };

  const mapStateEl = document.getElementById("mapState");
  const mapDistEl  = document.getElementById("mapDist");

  // Boarding-pass refs
  const passFromCode = document.getElementById("passFromCode");
  const passFromName = document.getElementById("passFromName");
  const passToCode   = document.getElementById("passToCode");
  const passToName   = document.getElementById("passToName");
  const passR        = document.querySelector(".pass-r");

  function updatePassPanel(dest) {
    if (!passToCode) return;
    if (dest && ROUTES[dest]) {
      const r = ROUTES[dest];
      passToCode.textContent = r.label;
      passToName.textContent = r.name;
      if (passR) passR.classList.add("is-active");
      // Force animation restart
      passToCode.style.animation = "none";
      void passToCode.getBoundingClientRect();
      passToCode.style.animation = "";
    } else {
      passToCode.textContent = "—";
      passToName.textContent = "choose route";
      if (passR) passR.classList.remove("is-active");
    }
  }

  // Derive an IATA-ish code from any free-text "to" value
  function codeFor(text) {
    const upper = (text || "").trim().toUpperCase();
    if (!upper) return null;
    if (ROUTES[upper]) return upper;
    // Fuzzy: starts-with match against known dests
    const keys = Object.keys(ROUTES);
    const startsWith = keys.find(k => k.startsWith(upper));
    if (startsWith) return startsWith;
    return null;
  }

  function setActiveRoute(destKey, opts) {
    const r = ROUTES[destKey];
    if (!r) return;
    const fillForm = !!(opts && opts.fillForm);

    document.querySelectorAll(".route-line").forEach(el => {
      el.classList.toggle("is-active", el.getAttribute("data-route") === r.id);
    });
    const activeEl = document.querySelector(`.route-line[data-route="${r.id}"]`);
    if (activeEl) {
      activeEl.classList.remove("is-active");
      void activeEl.getBoundingClientRect();
      activeEl.classList.add("is-active");
    }

    document.querySelectorAll(".pin").forEach(p => p.classList.remove("is-active"));
    const pin = document.getElementById("pin-" + r.id);
    if (pin) pin.classList.add("is-active");

    const oldBus = document.getElementById("busMover");
    if (oldBus) {
      const newBus = oldBus.cloneNode(true);
      const am = newBus.querySelector("#busMotion");
      const mp = newBus.querySelector("#busMpath");
      if (mp) mp.setAttribute("href", "#" + r.id);
      if (am) am.setAttribute("dur", (r.ms / 1000) + "s");
      oldBus.replaceWith(newBus);
    }

    if (mapStateEl) mapStateEl.textContent = "● LIVE ROUTE · " + r.name.toUpperCase();
    if (mapDistEl)  mapDistEl.textContent  = `RKL → ${r.label} · ${r.km} · ${r.dur}`;

    // Only overwrite the form's "to" field when explicitly asked (row CLICK).
    // Hovering or typing must never fight the user's input.
    if (fillForm) {
      const toInput = document.querySelector('.pass-form input[name="to"]');
      if (toInput) toInput.value = r.name;
    }
    updatePassPanel(destKey);
  }

  // Wire rows: click & hover preview the route on the (sticky) map alongside.
  function wireRouteRows() {
    document.querySelectorAll(".row[data-row]").forEach(row => {
      const dest = row.dataset.dest;
      if (!ROUTES[dest]) return;
      row.addEventListener("click", (e) => {
        e.preventDefault();
        setActiveRoute(dest, { fillForm: true });
      });
      if (matchMedia("(hover: hover)").matches) {
        let hoverTimer = null;
        row.addEventListener("mouseenter", () => {
          hoverTimer = setTimeout(() => setActiveRoute(dest, { fillForm: false }), 220);
        });
        row.addEventListener("mouseleave", () => clearTimeout(hoverTimer));
      }
    });
  }
  wireRouteRows();

  // Live-update the boarding pass when the form's "from"/"to" fields change
  function wireFormSync() {
    const toInput   = document.querySelector('.pass-form input[name="to"]');
    const fromInput = document.querySelector('.pass-form input[name="from"]');

    if (toInput) {
      const onTo = () => {
        const code = codeFor(toInput.value);
        if (code) {
          // Update pass panel + map without re-firing form sync (guarded by setActiveRoute)
          setActiveRoute(code);
        } else {
          updatePassPanel(null);
        }
      };
      toInput.addEventListener("input", onTo);
      toInput.addEventListener("change", onTo);
    }

    if (fromInput && passFromCode) {
      const onFrom = () => {
        const v = (fromInput.value || "").trim();
        if (!v) {
          passFromCode.textContent = "RKL";
          passFromName.textContent = "Rourkela";
          return;
        }
        // Default behaviour: first 3 letters uppercased, full name preserved
        passFromCode.textContent = v.replace(/\s+/g, "").slice(0, 3).toUpperCase() || "RKL";
        passFromName.textContent = v;
      };
      fromInput.addEventListener("input", onFrom);
    }
  }
  wireFormSync();

  // Default: Puri
  setTimeout(() => setActiveRoute("PURI"), 500);

  // ---------- Departures board: split-flap rendering ----------
  // Renders each row's data-* fields as columns of split-flap tiles, animated in stagger.
  const FLAP_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 →·-/₹";
  function makeFlapsHTML(text) {
    if (!text) return "";
    const chars = String(text).split("");
    return `<span class="flaps">` + chars.map((c, i) => {
      const ch = c === " " ? "&nbsp;" : c;
      const d = (i * 0.04).toFixed(2);
      return `<span class="flap"><span class="flap-inner" style="animation-delay:${d}s">${ch}</span></span>`;
    }).join("") + `</span>`;
  }

  function buildRow(row) {
    const status = row.dataset.status || "";
    const dest   = row.dataset.dest   || "";
    const dist   = row.dataset.dist   || "";
    const dur    = row.dataset.dur    || "";
    const from   = row.dataset.from   || "";
    const tag    = row.dataset.tag    || "";
    row.innerHTML = `
      <span class="status">${status}</span>
      <span class="dest">${dest}<small>${tag}</small></span>
      <span class="dist">${makeFlapsHTML(dist)}</span>
      <span class="dur">${makeFlapsHTML(dur)}</span>
      <span class="from">${from}</span>
      <span class="arrow-cell">→</span>
    `;
  }

  const boardRows = document.querySelectorAll(".row[data-row]");
  // We delay render until rows scroll into view, so the flap animation triggers visibly.
  const boardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting && !entry.target.dataset.built) {
        const idx = Array.from(boardRows).indexOf(entry.target);
        const row = entry.target;
        row.dataset.built = "1";
        // Build with a slight delay per row for cascade
        setTimeout(() => buildRow(row), idx * 80);
        boardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });
  // HTML is pre-populated for SEO/no-JS — only attach observer for animation.
  boardRows.forEach(r => boardObserver.observe(r));

  // ---------- Periodic re-flap of board (subtle "live update" feel) ----------
  setInterval(() => {
    if (document.hidden) return;
    const visible = Array.from(boardRows).filter(r => {
      const rect = r.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom > 0;
    });
    if (visible.length === 0) return;
    const r = visible[Math.floor(Math.random() * visible.length)];
    if (r.dataset.built) buildRow(r);
  }, 7000);

  // ---------- Odometer count-up ----------
  const counters = document.querySelectorAll("[data-count]");
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10) || 0;
      const dur = 1400;
      const start = performance.now();
      const from = 0;
      const ease = (t) => 1 - Math.pow(1 - t, 3);
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const v = Math.floor(from + (target - from) * ease(t));
        el.textContent = v;
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(c => countObserver.observe(c));

  // ---------- Stamp drop-in ----------
  const stamps = document.querySelectorAll("[data-stamp]");
  const stampObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const idx = Array.from(stamps).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add("in"), idx * 120);
        stampObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  stamps.forEach(s => stampObserver.observe(s));

  // ---------- Reveal-on-scroll ----------
  const reveals = document.querySelectorAll("[data-reveal]");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(r => revealObserver.observe(r));

  // ---------- Hero parallax (light): map card tilts with mouse ----------
  const mapCard = document.querySelector(".map-card");
  if (mapCard && matchMedia("(hover: hover)").matches) {
    const heroRight = document.querySelector(".hero-right");
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = heroRight.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mapCard.style.transform = `rotate(${-1.4 + x * 2}deg) translate3d(${x * 6}px, ${y * 4}px, 0)`;
        raf = null;
      });
    };
    const onLeave = () => { mapCard.style.transform = ""; };
    if (heroRight) {
      heroRight.addEventListener("mousemove", onMove);
      heroRight.addEventListener("mouseleave", onLeave);
    }
  }

  // ---------- Pass barcode random heights for organic feel ----------
  document.querySelectorAll(".pass-barcode span").forEach(s => {
    const h = 50 + Math.random() * 50;
    s.style.height = h + "%";
  });

  // ---------- Form: decorative submit feedback ----------
  const bookForm = document.getElementById("bookForm");
  if (bookForm) {
    bookForm.addEventListener("submit", () => {
      const btn = bookForm.querySelector("button[type=submit]");
      if (btn) {
        btn.querySelector("span").textContent = "Booking…";
      }
    });
  }
})();
