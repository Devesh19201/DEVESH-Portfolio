/* ════════════════════════════════════════
   JS MODULE: EXPERIENCE WAVE GRID
════════════════════════════════════════ */
(function initExpScene() {
  const canvas = document.getElementById('expCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.parentElement.offsetWidth;
  const H = canvas.parentElement.offsetHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
  camera.position.set(0, 75, 140);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particles Grid
  const countX = 45;
  const countY = 45;
  const spacing = 7;
  const total = countX * countY;

  const posArr = new Float32Array(total * 3);
  let idx = 0;

  for (let ix = 0; ix < countX; ix++) {
    for (let iy = 0; iy < countY; iy++) {
      posArr[idx] = ix * spacing - (countX * spacing) / 2;
      posArr[idx + 1] = 0;
      posArr[idx + 2] = iy * spacing - (countY * spacing) / 2;
      idx += 3;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

  // Ember gold particles matching midnight theme
  const material = new THREE.PointsMaterial({
    color: 0xff8c5a,
    size: 1.1,
    transparent: true,
    opacity: 0.22
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  let animationId;
  let count = 0;

  function animate() {
    animationId = requestAnimationFrame(animate);

    const positions = geometry.attributes.position.array;
    let index = 0;

    for (let ix = 0; ix < countX; ix++) {
      for (let iy = 0; iy < countY; iy++) {
        // Double sine wave ripple
        positions[index + 1] = (Math.sin((ix + count) * 0.25) * 5) + (Math.sin((iy + count) * 0.2) * 5);
        index += 3;
      }
    }

    geometry.attributes.position.needsUpdate = true;
    count += 0.05;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    const nW = canvas.parentElement.offsetWidth;
    const nH = canvas.parentElement.offsetHeight;
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animate();
      else cancelAnimationFrame(animationId);
    });
  }, { threshold: 0.1 });
  observer.observe(canvas.parentElement);
})();
