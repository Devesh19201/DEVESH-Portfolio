/* ════════════════════════════════════════
   JS MODULE: MENU, SCROLL, AND MISC
════════════════════════════════════════ */
(function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const nav = document.getElementById('nav');
  const backToTop = document.getElementById('backToTop');
  const localTimeEl = document.getElementById('localTime');

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close mobile menu on clicking links
    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // Scroll animations/blurs
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;

    // Navbar scroll dynamic classes
    if (nav) {
      if (scroll > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }

    // Back-to-top visibility toggle
    if (backToTop) {
      if (scroll > 600) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Local clock sync (India Time)
  if (localTimeEl) {
    function updateClock() {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const timeStr = new Date().toLocaleTimeString('en-US', options);
      localTimeEl.textContent = `Local Time: ${timeStr} (IST)`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Counter stats animation observers
  function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.target);
      let current = 0;
      const step = target / 50;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + (target >= 10 ? '+' : '');
        if (current >= target) clearInterval(timer);
      }, 30);
    });
  }

  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) {
    const heroObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounters();
          heroObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    heroObserver.observe(statsEl);
  }

  // Timeline dot highlighting on scroll
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length) {
    const timeObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelector('.timeline-dot').classList.add('active');
        }
      });
    }, { threshold: 0.5 });
    timelineItems.forEach(item => timeObserver.observe(item));
  }
})();
