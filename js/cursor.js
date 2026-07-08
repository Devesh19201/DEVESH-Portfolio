/* CUSTOM CURSOR (Brutalist style) */
(function initCursor() {
  if (window.matchMedia("(max-width: 768px)").matches) return;

  const cursor = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  if (!cursor || !dot) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animate() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  const addHover = () => cursor.classList.add('hover');
  const removeHover = () => cursor.classList.remove('hover');
  const addDrag = () => cursor.classList.add('drag');
  const removeDrag = () => cursor.classList.remove('drag');

  const interactives = document.querySelectorAll('a, button, .nb-btn, .nav-link, .page-dot');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', addHover);
    el.addEventListener('mouseleave', removeHover);
  });
  
  const pages = document.querySelectorAll('.page-card');
  pages.forEach(el => {
    el.addEventListener('mousedown', addDrag);
    el.addEventListener('mouseup', removeDrag);
  });
})();
