/* ════════════════════════════════════════
   JS MODULE: TYPING EFFECT
════════════════════════════════════════ */
(function initTyping() {
  const el = document.getElementById('heroTyped');
  if (!el) return;

  const phrases = [
    'cloud-native SaaS platforms.',
    'real-time WebSocket systems.',
    'Electron 42 desktop clients.',
    'React 19 + TypeScript SPAs.',
    'serverless Cloudflare backends.',
    'full-stack production systems.',
    'Hono + Durable Objects APIs.',
  ];

  let pIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let speed = 80;

  function type() {
    const current = phrases[pIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      speed = 30;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      speed = 60;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      speed = 1800; // Pause at end of phrase
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      pIdx = (pIdx + 1) % phrases.length;
      speed = 400; // Pause before typing next
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 800);
})();
