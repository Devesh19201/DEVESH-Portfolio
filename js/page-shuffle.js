/* PAGE SHUFFLE ENGINE */
(function initPageShuffle() {
  let currentPage = 0;
  let isAnimating = false;
  const totalPages = 6;
  const TRANSITION_DURATION = 700;
  const COOLDOWN = 800;
  
  const pages = document.querySelectorAll('.page-card');
  const dots = document.querySelectorAll('.page-dot');
  
  const sectionMap = {
    'hero': 0, 'about': 1, 'skills': 2,
    'projects': 3, 'experience': 4, 'contact': 5
  };
  const indexMap = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
  
  function init() {
    const hash = window.location.hash.replace('#', '');
    if (sectionMap[hash] !== undefined) {
      currentPage = sectionMap[hash];
    }
    
    updatePageStates(false);
    updateDots();
    updateNavLinks();
  }
  
  function updatePageStates(animate = true) {
    pages.forEach((page, i) => {
      page.classList.remove('active', 'shuffle-out-up', 'shuffle-out-down', 'stack-1', 'stack-2', 'stack-3');
      
      if (i === currentPage) {
        page.classList.add('active');
        page.style.zIndex = totalPages;
      } else if (i < currentPage) {
        page.classList.add('shuffle-out-up');
        page.style.zIndex = totalPages - Math.abs(currentPage - i);
      } else {
        const stackPos = i - currentPage;
        if (stackPos <= 3) {
          page.classList.add('stack-' + stackPos);
        }
        page.style.zIndex = totalPages - i;
      }
    });
  }
  
  function shuffleTo(targetIndex) {
    if (isAnimating || targetIndex === currentPage || targetIndex < 0 || targetIndex >= totalPages) return;
    isAnimating = true;
    
    const direction = targetIndex > currentPage ? 'up' : 'down';
    const currentCard = pages[currentPage];
    const targetCard = pages[targetIndex];
    
    targetCard.classList.remove('shuffle-out-up', 'shuffle-out-down', 'stack-1', 'stack-2', 'stack-3');
    
    if (direction === 'up') {
      currentCard.classList.add('shuffle-out-up');
      currentCard.style.zIndex = totalPages + 1;
      
      targetCard.classList.add('active');
      targetCard.style.zIndex = totalPages;
    } else {
      currentCard.classList.remove('active');
      currentCard.classList.add('stack-1');
      currentCard.style.zIndex = totalPages - 1;
      
      targetCard.classList.remove('shuffle-out-up', 'shuffle-out-down');
      targetCard.classList.add('active');
      targetCard.style.zIndex = totalPages;
    }
    
    currentPage = targetIndex;
    updateDots();
    updateNavLinks();
    updateHash();
    
    setTimeout(() => {
      updatePageStates(false);
      isAnimating = false;
    }, TRANSITION_DURATION);
  }
  
  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentPage);
    });
  }
  
  function updateNavLinks() {
    document.querySelectorAll('.nav-link:not(.nav-link--resume), .mobile-link:not([style])').forEach(link => {
      const pageIndex = parseInt(link.getAttribute('data-page'));
      link.classList.toggle('active', pageIndex === currentPage);
    });
  }
  
  function updateHash() {
    if(currentPage === 0) {
      history.replaceState(null, null, ' ');
    } else {
      window.location.hash = indexMap[currentPage];
    }
  }
  
  // Wheel Event
  let wheelTimeout;
  window.addEventListener('wheel', (e) => {
    // Only shuffle if not scrolling inside a card that has overflow
    const activeCard = pages[currentPage];
    const isAtTop = activeCard.scrollTop <= 0;
    const isAtBottom = activeCard.scrollHeight - activeCard.scrollTop <= activeCard.clientHeight + 1;
    
    if (e.deltaY > 0 && isAtBottom) {
      if(!isAnimating && currentPage < totalPages - 1) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => shuffleTo(currentPage + 1), 50);
      }
    } else if (e.deltaY < 0 && isAtTop) {
      if(!isAnimating && currentPage > 0) {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => shuffleTo(currentPage - 1), 50);
      }
    }
  }, { passive: true });
  
  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) {
      shuffleTo(currentPage + 1);
    } else if (['ArrowUp', 'PageUp'].includes(e.key)) {
      shuffleTo(currentPage - 1);
    }
  });
  
  // Touch
  let touchStartY = 0;
  window.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY, { passive: true });
  window.addEventListener('touchend', e => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    const activeCard = pages[currentPage];
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeCard.scrollHeight - activeCard.scrollTop <= activeCard.clientHeight + 1) {
        shuffleTo(currentPage + 1); // swipe up
      } else if (diff < 0 && activeCard.scrollTop <= 0) {
        shuffleTo(currentPage - 1); // swipe down
      }
    }
  }, { passive: true });
  
  // Expose globally
  window.shuffleTo = shuffleTo;
  window.getCurrentPage = () => currentPage;
  
  init();
})();
