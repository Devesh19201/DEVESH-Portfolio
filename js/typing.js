/* TYPING EFFECT */
(function initTyping() {
  const el = document.getElementById('heroTyped');
  if (!el) return;

  const strings = [
    "production systems.",
    "real-time architectures.",
    "native desktop apps.",
    "scalable cloud infra."
  ];
  
  let stringIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;
  let deleteSpeed = 40;
  let pauseDuration = 2000;
  const cursorChar = '&#9608;'; // Block cursor █
  
  function type() {
    const currentString = strings[stringIndex];
    
    if (isDeleting) {
      el.innerHTML = currentString.substring(0, charIndex - 1) + cursorChar;
      charIndex--;
    } else {
      el.innerHTML = currentString.substring(0, charIndex + 1) + cursorChar;
      charIndex++;
    }
    
    let speed = isDeleting ? deleteSpeed : typeSpeed;
    
    if (!isDeleting && charIndex === currentString.length) {
      speed = pauseDuration;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      stringIndex = (stringIndex + 1) % strings.length;
      speed = 500;
    }
    
    setTimeout(type, speed);
  }
  
  setTimeout(type, 1000);
})();
