/* MAIN INIT & MISC LOGIC */
document.addEventListener('DOMContentLoaded', () => {
  // Stats counter animation in Hero
  const stats = document.querySelectorAll('.stat-number');
  
  function animateStats() {
    stats.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'));
      let current = 0;
      const inc = target / 30; // 30 frames
      
      const update = () => {
        current += inc;
        if (current < target) {
          stat.innerText = Math.ceil(current) + '+';
          requestAnimationFrame(update);
        } else {
          stat.innerText = target + '+';
        }
      };
      update();
    });
  }

  // Run stats animation when hero is active
  let statsAnimated = false;
  setInterval(() => {
    if (!statsAnimated && window.getCurrentPage && window.getCurrentPage() === 0) {
      animateStats();
      statsAnimated = true;
    } else if (window.getCurrentPage && window.getCurrentPage() !== 0) {
      statsAnimated = false; // Reset if you want it to animate every time they return
    }
  }, 500);

  // Bento Tabs logic
  const tabs = document.querySelectorAll('.new-tab');
  const panels = document.querySelectorAll('.bento-panel');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs & panels
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      
      // Add active to clicked
      tab.classList.add('active');
      const targetPanel = document.getElementById('bento-' + tab.getAttribute('data-tab'));
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  // Local time update
  const timeEl = document.getElementById('localTime');
  if (timeEl) {
    const updateTime = () => {
      const now = new Date();
      timeEl.innerText = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }) + ' IST';
    };
    updateTime();
    setInterval(updateTime, 60000);
  }

  // Back to top button inside card
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    setInterval(() => {
      const activeCard = document.querySelector('.page-card.active');
      if (activeCard && activeCard.scrollTop > 500) {
        backBtn.classList.add('visible');
      } else {
        backBtn.classList.remove('visible');
      }
    }, 200);

    backBtn.addEventListener('click', () => {
      const activeCard = document.querySelector('.page-card.active');
      if (activeCard) {
        activeCard.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }
});
