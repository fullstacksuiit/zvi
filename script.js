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

  // ===============================================================
  // BUS SHOWCASE — Apple-style scroll-pinned animation
  // ===============================================================
  const busSection = document.getElementById("bus-showcase");
  const busStage = document.querySelector("[data-bus-stage]");
  if (busSection && busStage) {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const canvas = busStage.querySelector(".bus-canvas");
    const fallback = busStage.querySelector(".bus-fallback");
    const callouts = busSection.querySelectorAll(".bus-callout");
    const progressBar = busSection.querySelector(".bus-progress-bar");
    const frameCount = parseInt(busStage.dataset.frames || "0", 10) || 0;
    const framePath = busStage.dataset.framePath || "";

    let frames = [];
    let useCanvas = false;
    let ctx = null;

    const padFrameNumber = (n) => String(n).padStart(3, "0");

    const tryLoadFrames = () => {
      return new Promise((resolve) => {
        if (!canvas || !frameCount || !framePath || reduced) {
          resolve(false);
          return;
        }
        // Probe frame 1 first — if missing, fall back to single image
        const probe = new Image();
        const probeSrc = framePath.replace("{n}", padFrameNumber(1));
        probe.onload = () => {
          // Preload all frames
          frames = new Array(frameCount);
          for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = framePath.replace("{n}", padFrameNumber(i + 1));
            frames[i] = img;
          }
          resolve(true);
        };
        probe.onerror = () => resolve(false);
        probe.src = probeSrc;
      });
    };

    const sizeCanvas = () => {
      if (!canvas) return;
      const rect = busStage.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
    };

    const drawFrame = (idx) => {
      if (!ctx || !frames[idx] || !frames[idx].complete) return;
      const img = frames[idx];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const aspect = img.naturalWidth / img.naturalHeight || 1;
      const cw = canvas.width;
      const ch = canvas.height;
      let w, h;
      if (cw / ch > aspect) {
        h = ch;
        w = h * aspect;
      } else {
        w = cw;
        h = w / aspect;
      }
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    let busTicking = false;
    const onBusScroll = () => {
      if (busTicking) return;
      busTicking = true;
      requestAnimationFrame(() => {
        const rect = busSection.getBoundingClientRect();
        const total = busSection.offsetHeight - window.innerHeight;
        let progress = total > 0 ? -rect.top / total : 0;
        progress = Math.max(0, Math.min(1, progress));

        if (useCanvas && frames.length) {
          const idx = Math.min(
            frameCount - 1,
            Math.floor(progress * frameCount)
          );
          drawFrame(idx);
        } else if (fallback && !reduced) {
          // CSS-3D fallback: rotate, scale, lift on scroll
          const rotateY = -25 + progress * 50;
          const scaleBase = 0.85;
          const scale = scaleBase + Math.sin(progress * Math.PI) * 0.18;
          const translateY = (0.5 - progress) * 40;
          fallback.style.transform =
            "perspective(1400px) " +
            "rotateY(" + rotateY.toFixed(2) + "deg) " +
            "rotateX(" + (Math.sin(progress * Math.PI * 2) * 6).toFixed(2) + "deg) " +
            "translateY(" + translateY.toFixed(2) + "px) " +
            "scale(" + scale.toFixed(3) + ")";
        }

        // Callouts: visible when scroll progress is near their target
        for (let i = 0; i < callouts.length; i++) {
          const at = parseFloat(callouts[i].dataset.at || "0");
          const dist = Math.abs(progress - at);
          callouts[i].classList.toggle("is-visible", dist < 0.18);
        }

        if (progressBar) {
          progressBar.style.width = (progress * 100).toFixed(1) + "%";
        }

        busTicking = false;
      });
    };

    tryLoadFrames().then((canUseCanvas) => {
      useCanvas = canUseCanvas;
      if (useCanvas && canvas) {
        ctx = canvas.getContext("2d");
        busStage.classList.add("is-canvas");
        sizeCanvas();
        // Draw frame 1 once preloaded
        if (frames[0]) {
          if (frames[0].complete) drawFrame(0);
          else frames[0].addEventListener("load", () => drawFrame(0));
        }
        window.addEventListener("resize", sizeCanvas, { passive: true });
      }
      window.addEventListener("scroll", onBusScroll, { passive: true });
      onBusScroll();
    });
  }
})();
