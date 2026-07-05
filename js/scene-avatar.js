/* ════════════════════════════════════════
   JS MODULE: AVATAR 3D GEOMETRY
════════════════════════════════════════ */
(function initAvatarScene() {
  const canvas = document.getElementById('avatarCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const width = canvas.parentElement.offsetWidth;
  const height = canvas.parentElement.offsetHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 20;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Geometry: Orbit/DNA Wireframe Structure
  const geometry = new THREE.IcosahedronGeometry(7, 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0xff6b35, // Coral/orange outline
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const innerGeo = new THREE.IcosahedronGeometry(4.5, 1);
  const innerMat = new THREE.MeshBasicMaterial({
    color: 0x00c9a7, // Seafoam teal inner orbit
    wireframe: true,
    transparent: true,
    opacity: 0.15
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  scene.add(innerMesh);

  // Orbiting float dots
  const dotCount = 12;
  const dotGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const dotMat1 = new THREE.MeshBasicMaterial({ color: 0xff6b35 });
  const dotMat2 = new THREE.MeshBasicMaterial({ color: 0x00c9a7 });
  const dots = [];

  for (let i = 0; i < dotCount; i++) {
    const activeMat = i % 2 === 0 ? dotMat1 : dotMat2;
    const dot = new THREE.Mesh(dotGeo, activeMat);
    dot.userData = {
      angle: (i / dotCount) * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.012,
      radius: 8.5 + Math.random() * 2
    };
    scene.add(dot);
    dots.push(dot);
  }

  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);

    mesh.rotation.y += 0.005;
    mesh.rotation.x += 0.0025;

    innerMesh.rotation.y -= 0.007;
    innerMesh.rotation.z += 0.003;

    dots.forEach(dot => {
      dot.userData.angle += dot.userData.speed;
      dot.position.x = Math.cos(dot.userData.angle) * dot.userData.radius;
      dot.position.z = Math.sin(dot.userData.angle) * dot.userData.radius;
      dot.position.y = Math.sin(dot.userData.angle * 1.5) * 2;
    });

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

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animate();
      else cancelAnimationFrame(animationId);
    });
  }, { threshold: 0.1 });
  observer.observe(canvas.parentElement);
})();
