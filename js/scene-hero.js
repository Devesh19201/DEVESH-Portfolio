/* HERO WEBGL PARTICLES (Neu-Brutalism Style) */
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

  // Reduced particle count for performance and brutalist style
  const count = 60;
  const posArr = new Float32Array(count * 3);
  const velArr = [];

  for (let i = 0; i < count; i++) {
    posArr[i * 3] = (Math.random() - 0.5) * 350;
    posArr[i * 3 + 1] = (Math.random() - 0.5) * 350;
    posArr[i * 3 + 2] = (Math.random() - 0.5) * 350;

    // Much slower velocity for smooth movement
    velArr.push({
      x: (Math.random() - 0.5) * 0.08,
      y: (Math.random() - 0.5) * 0.08,
      z: (Math.random() - 0.5) * 0.08
    });
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

  // Black particles for yellow background
  const pMat = new THREE.PointsMaterial({
    size: 4.0,
    color: 0x1a1a1a,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  });

  const pMesh = new THREE.Points(pGeo, pMat);
  scene.add(pMesh);

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x1a1a1a,
    transparent: true,
    opacity: 0.15
  });

  let lineMesh;

  let targetX = 0, targetY = 0;
  window.addEventListener('mousemove', e => {
    targetX = (e.clientX - window.innerWidth / 2) * 0.001; // Reduced follow distance
    targetY = (e.clientY - window.innerHeight / 2) * 0.001;
  });

  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Only animate when hero is visible
    if (window.getCurrentPage && window.getCurrentPage() !== 0) return;

    const positions = pGeo.attributes.position.array;

    for (let i = 0; i < count; i++) {
      positions[i * 3] += velArr[i].x;
      positions[i * 3 + 1] += velArr[i].y;
      positions[i * 3 + 2] += velArr[i].z;

      if (Math.abs(positions[i * 3]) > 180) velArr[i].x *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 180) velArr[i].y *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 180) velArr[i].z *= -1;
    }
    pGeo.attributes.position.needsUpdate = true;

    if (lineMesh) scene.remove(lineMesh);

    const linePoints = [];
    for (let i = 0; i < count; i++) {
      const p1 = new THREE.Vector3(positions[i*3], positions[i*3+1], positions[i*3+2]);
      for (let j = i + 1; j < count; j++) {
        const p2 = new THREE.Vector3(positions[j*3], positions[j*3+1], positions[j*3+2]);
        if (p1.distanceTo(p2) < 60) {
          linePoints.push(p1, p2);
        }
      }
    }

    if (linePoints.length > 0) {
      const lGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      lineMesh = new THREE.LineSegments(lGeo, lineMat);
      scene.add(lineMesh);
    }

    pMesh.rotation.y += 0.0005; // Slower idle rotation
    
    // Smoother interpolation for mouse tracking
    scene.rotation.y += (targetX - scene.rotation.y) * 0.02;
    scene.rotation.x += (targetY - scene.rotation.x) * 0.02;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    const w = canvas.parentElement.offsetWidth;
    const h = canvas.parentElement.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
