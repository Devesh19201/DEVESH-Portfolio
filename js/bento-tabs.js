/* ════════════════════════════════════════
   JS MODULE: BENTO SKILLS GRID TABS
════════════════════════════════════════ */
(function initBentoTabs() {
  const tabs = document.querySelectorAll('.new-tab');
  const slider = document.getElementById('tabSlider');
  const panels = document.querySelectorAll('.bento-panel');
  if (!tabs.length || !slider) return;

  function moveSlider(tab) {
    const tw = tab.getBoundingClientRect();
    const pw = tab.parentElement.getBoundingClientRect();
    slider.style.left = (tw.left - pw.left - 5) + 'px';
    slider.style.width = tw.width + 'px';
  }

  // Set initial slider position
  const activeTab = document.querySelector('.new-tab.active');
  if (activeTab) setTimeout(() => moveSlider(activeTab), 50);

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      moveSlider(tab);

      const panelId = 'bento-' + tab.dataset.tab;
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add('active');

        // Reset and trigger ring progress re-animations
        panel.querySelectorAll('.bcr-fill').forEach(ring => {
          ring.classList.remove('animated');
          void ring.getBoundingClientRect(); // force reflow
        });

        setTimeout(() => {
          panel.querySelectorAll('.bcr-fill').forEach(ring => {
            ring.classList.add('animated');
          });
        }, 40);
      }

      // Filter skill galaxy constellation dynamically
      if (window.filterSkillGalaxy) {
        window.filterSkillGalaxy(tab.dataset.tab);
      }
    });
  });

  // Observe and animate progress rings on scroll reveal
  const ringObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const rings = e.target.querySelectorAll('.bcr-fill');
        rings.forEach(r => r.classList.remove('animated'));
        void e.target.offsetWidth; // reflow
        setTimeout(() => rings.forEach(r => r.classList.add('animated')), 80);
        ringObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.bento-card').forEach(c => ringObs.observe(c));
})();
