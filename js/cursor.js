/* ════════════════════════════════════════
   JS MODULE: CUSTOM CURSOR
════════════════════════════════════════ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let cx = 0, cy = 0; // cursor position
  let fx = 0, fy = 0; // follower position

  window.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  });

  // Smooth lerp animation for the follower circle
  function animateFollower() {
    fx += (cx - fx) * 0.15;
    fy += (cy - fy) * 0.15;
    follower.style.left = fx + 'px';
    follower.style.top = fy + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover triggers to expand follower scale
  document.querySelectorAll('a, button, .contact-card, .new-tab, .fw-pill').forEach(el => {
    el.addEventListener('mouseenter', () => {
      follower.style.transform = 'translate(-50%, -50%) scale(1.6)';
      follower.style.borderColor = 'var(--accent)';
      cursor.style.backgroundColor = 'var(--accent)';
    });
    el.addEventListener('mouseleave', () => {
      follower.style.transform = 'translate(-50%, -50%) scale(1)';
      follower.style.borderColor = 'rgba(255, 107, 53, 0.35)';
      cursor.style.backgroundColor = 'var(--accent2)';
    });
  });
})();
