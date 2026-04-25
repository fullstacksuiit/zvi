// Zain Ventures India — interactions

(function () {
  const nav = document.getElementById("nav");
  const progress = document.getElementById("scrollProgress");
  const orbs = Array.from(document.querySelectorAll(".hero .orb"));

  // Cache layout-dependent values; recompute only on resize
  let scrollMax = 0;
  const recomputeMax = () => {
    scrollMax = document.documentElement.scrollHeight - window.innerHeight;
  };
  recomputeMax();
  window.addEventListener("resize", recomputeMax, { passive: true });
  // After fonts/images load, layout shifts — recompute then too
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(recomputeMax);
  }
  window.addEventListener("load", recomputeMax);

  // Single rAF-batched scroll handler for nav state, parallax, progress
  let scrollTicking = false;
  let lastScrolledClass = false;
  const onScrollFrame = () => {
    const y = window.scrollY;

    // Nav state — only toggle class when crossing threshold
    const shouldScrolled = y > 24;
    if (shouldScrolled !== lastScrolledClass && nav) {
      nav.classList.toggle("is-scrolled", shouldScrolled);
      lastScrolledClass = shouldScrolled;
    }

    // Scroll progress
    if (progress) {
      const pct = scrollMax > 0 ? (y / scrollMax) * 100 : 0;
      progress.style.setProperty("--p", pct + "%");
    }

    // Hero parallax — skip when hero is off-screen
    if (orbs.length && y < window.innerHeight * 1.2) {
      for (let i = 0; i < orbs.length; i++) {
        orbs[i].style.transform = `translate3d(0, ${y * (i + 1) * 0.06}px, 0)`;
      }
    }

    scrollTicking = false;
  };
  const onScroll = () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(onScrollFrame);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScrollFrame();

  // Mobile menu
  const navToggle = document.getElementById("navToggle");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    if (navToggle) navToggle.setAttribute("aria-expanded", String(open));
  };
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      setMenu(!document.body.classList.contains("menu-open"));
    });
  }
  document.querySelectorAll(".menu-overlay a").forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });

  // Smooth scroll for hash links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Reveal-on-scroll
  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          reveal.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => reveal.observe(el));

  // Animated counters
  const counterIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        counterIO.unobserve(el);
        const target = parseFloat(el.dataset.count);
        const decimals = (el.dataset.count.split(".")[1] || "").length;
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const v = target * eased;
          el.textContent = decimals
            ? v.toFixed(decimals)
            : Math.floor(v).toString();
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    },
    { threshold: 0.4 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => counterIO.observe(el));

  // Cursor glow on dark fleet cards (rAF-throttled per-card)
  document.querySelectorAll(".fleet-card").forEach((card) => {
    let pending = false;
    let lastEvent = null;
    card.addEventListener(
      "pointermove",
      (e) => {
        lastEvent = e;
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          card.style.setProperty(
            "--mx",
            ((lastEvent.clientX - r.left) / r.width) * 100 + "%"
          );
          card.style.setProperty(
            "--my",
            ((lastEvent.clientY - r.top) / r.height) * 100 + "%"
          );
          pending = false;
        });
      },
      { passive: true }
    );
  });

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
