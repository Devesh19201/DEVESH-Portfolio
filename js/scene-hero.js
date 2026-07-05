/* ════════════════════════════════════════
   JS MODULE: HERO WEBGL PARTICLES
════════════════════════════════════════ */
(function initHeroParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const width = canvas.parentElement.offsetWidth;
  const height = canvas.parentElement.offsetHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 220;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Particle creation
  const count = 100;
  const posArr = new Float32Array(count * 3);
  const velArr = [];

  for (let i = 0; i < count; i++) {
    // Spread in 3D space
    posArr[i * 3] = (Math.random() - 0.5) * 350;
    posArr[i * 3 + 1] = (Math.random() - 0.5) * 350;
    posArr[i * 3 + 2] = (Math.random() - 0.5) * 350;

    velArr.push({
      x: (Math.random() - 0.5) * 0.4,
      y: (Math.random() - 0.5) * 0.4,
      z: (Math.random() - 0.5) * 0.4
    });
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

  // Orange color scheme for Midnight Ember theme
  const pMat = new THREE.PointsMaterial({
    size: 2.2,
    color: 0xff6b35,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });

  const pMesh = new THREE.Points(pGeo, pMat);
  scene.add(pMesh);

  // Line connection geometry
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x00c9a7, // seafoam teal accent lines
    transparent: true,
    opacity: 0.08
  });

  let lineMesh;

  // Interactivity
  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', e => {
    targetX = (e.clientX - window.innerWidth / 2) * 0.04;
    targetY = (e.clientY - window.innerHeight / 2) * 0.04;
  });

  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);

    const positions = pGeo.attributes.position.array;

    // Move particles inside space bounds
    for (let i = 0; i < count; i++) {
      positions[i * 3] += velArr[i].x;
      positions[i * 3 + 1] += velArr[i].y;
      positions[i * 3 + 2] += velArr[i].z;

      // Bounce boundaries
      if (Math.abs(positions[i * 3]) > 180) velArr[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 180) velArr[i].y *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 180) velArr[i].z *= -1;
    }
    pGeo.attributes.position.needsUpdate = true;

    // Recompute constellation lines dynamically
    if (lineMesh) scene.remove(lineMesh);

    const linePoints = [];
    for (let i = 0; i < count; i++) {
      const p1 = new THREE.Vector3(positions[i*3], positions[i*3+1], positions[i*3+2]);
      for (let j = i + 1; j < count; j++) {
        const p2 = new THREE.Vector3(positions[j*3], positions[j*3+1], positions[j*3+2]);
        if (p1.distanceTo(p2) < 55) {
          linePoints.push(p1, p2);
        }
      }
    }

    if (linePoints.length > 0) {
      const lGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      lineMesh = new THREE.LineSegments(lGeo, lineMat);
      scene.add(lineMesh);
    }

    // Parallax mouse follow
    pMesh.rotation.y += 0.001;
    scene.rotation.y += (targetX - scene.rotation.y) * 0.05;
    scene.rotation.x += (targetY - scene.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // Offscreen optimization
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animate();
      else cancelAnimationFrame(animationId);
    });
  }, { threshold: 0.1 });
  observer.observe(canvas.parentElement);
})();
