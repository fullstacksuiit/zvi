// Zain Ventures India — interactions

(function () {
  // Nav scroll state
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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

  // Hero parallax orbs
  const orbs = document.querySelectorAll(".hero .orb");
  if (orbs.length) {
    const onParallax = () => {
      const y = window.scrollY;
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 0.06;
        orb.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
    };
    window.addEventListener("scroll", onParallax, { passive: true });
  }

  // Animated counters
  const counters = document.querySelectorAll("[data-count]");
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
  counters.forEach((el) => counterIO.observe(el));

  // Cursor glow on dark fleet cards
  document.querySelectorAll(".fleet-card").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty(
        "--mx",
        ((e.clientX - r.left) / r.width) * 100 + "%"
      );
      card.style.setProperty(
        "--my",
        ((e.clientY - r.top) / r.height) * 100 + "%"
      );
    });
  });

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
