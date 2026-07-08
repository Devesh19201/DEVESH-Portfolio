/* MENU NAVIGATION */
(function initMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const nav = document.getElementById('nav');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });
  }

  // Handle nav clicks using shuffleTo
  const links = document.querySelectorAll('.nav-link, .mobile-link');
  links.forEach(link => {
    link.addEventListener('click', e => {
      // Ignore external links like resume
      if (link.getAttribute('target') === '_blank') return;
      
      e.preventDefault();
      
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
      }
      
      const pageIndex = parseInt(link.getAttribute('data-page'));
      if (!isNaN(pageIndex) && window.shuffleTo) {
        window.shuffleTo(pageIndex);
      }
    });
  });
  
  // Handle dots click
  const dots = document.querySelectorAll('.page-dot');
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const pageIndex = parseInt(dot.getAttribute('data-page'));
      if (!isNaN(pageIndex) && window.shuffleTo) {
        window.shuffleTo(pageIndex);
      }
    });
  });

  // Hide nav when scrolling down inside a card (optional refinement)
  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const pages = document.querySelectorAll('.page-card');
    let activeCard;
    pages.forEach(p => { if (p.classList.contains('active')) activeCard = p; });
    
    if (activeCard) {
      const scrollY = activeCard.scrollTop;
      if (scrollY > 100 && scrollY > lastScrollY) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
      lastScrollY = scrollY;
    }
  }, { capture: true, passive: true });
})();
