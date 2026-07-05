/* ════════════════════════════════════════
   JS MODULE: SKILLS GALAXY
   Interactive 3D constellation galaxy
════════════════════════════════════════ */
(function initSkillGalaxy() {
  const canvas = document.getElementById('skillGalaxyCanvas');
  const tooltip = document.getElementById('galaxyTooltip');
  if (!canvas || typeof THREE === 'undefined') return;

  const W = canvas.parentElement.offsetWidth;
  const H = canvas.parentElement.offsetHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 500);
  camera.position.set(0, 0, 110);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W, H);
  renderer.setClearColor(0x000000, 0);

  /* ── SKILL DATA ── */
  const SKILLS = [
    // Frontend (teal/cyan family)
    { name: 'React 19',         cat: 'frontend', pct: 94, color: 0x00c9a7, size: 2.4 },
    { name: 'TypeScript',       cat: 'frontend', pct: 91, color: 0x3178c6, size: 2.2 },
    { name: 'Vite',             cat: 'frontend', pct: 90, color: 0xffd166, size: 2.1 },
    { name: 'Zustand',          cat: 'frontend', pct: 88, color: 0xffd166, size: 2.0 },
    { name: 'React Router v7',  cat: 'frontend', pct: 91, color: 0x00c9a7, size: 2.0 },
    { name: 'Axios',            cat: 'frontend', pct: 90, color: 0x22d3ee, size: 1.9 },
    { name: 'Recharts',         cat: 'frontend', pct: 82, color: 0xc084fc, size: 1.7 },
    { name: 'CSS3',             cat: 'frontend', pct: 93, color: 0x264de4, size: 2.1 },
    { name: 'Lucide React',     cat: 'frontend', pct: 88, color: 0x4ade80, size: 1.6 },
    // Backend (orange family)
    { name: 'CF Workers',       cat: 'backend', pct: 90, color: 0xff6b35, size: 2.4 },
    { name: 'Hono',             cat: 'backend', pct: 88, color: 0xe36002, size: 2.1 },
    { name: 'Durable Objects',  cat: 'backend', pct: 86, color: 0xff8c5a, size: 2.0 },
    { name: 'D1 / SQLite',      cat: 'backend', pct: 83, color: 0x00c9a7, size: 1.9 },
    { name: 'WebSocket',        cat: 'backend', pct: 84, color: 0x36d399, size: 1.9 },
    { name: 'Razorpay',         cat: 'backend', pct: 82, color: 0xff6b6b, size: 1.8 },
    { name: 'R2 Storage',       cat: 'backend', pct: 80, color: 0xff6b35, size: 1.7 },
    { name: 'KV Store',         cat: 'backend', pct: 79, color: 0xff8c5a, size: 1.6 },
    { name: 'JWT Auth',         cat: 'backend', pct: 87, color: 0x7c5cfc, size: 1.8 },
    { name: 'Node.js',          cat: 'backend', pct: 81, color: 0x36d399, size: 1.8 },
    { name: 'AWS',              cat: 'backend', pct: 72, color: 0xffd166, size: 1.6 },
    // Desktop (teal family)
    { name: 'Electron 42',      cat: 'desktop', pct: 89, color: 0x00c9a7, size: 2.3 },
    { name: 'pdf-lib',          cat: 'desktop', pct: 86, color: 0xf87171, size: 2.0 },
    { name: 'Electron Builder', cat: 'desktop', pct: 83, color: 0xc084fc, size: 1.8 },
    { name: 'IPC / preload',    cat: 'desktop', pct: 85, color: 0x4ade80, size: 1.8 },
    { name: 'pdf-to-printer',   cat: 'desktop', pct: 80, color: 0xff8c5a, size: 1.6 },
    // Testing (blue)
    { name: 'SonarQube',        cat: 'testing', pct: 78, color: 0x61dafb, size: 1.9 },
    { name: 'Vitest',           cat: 'testing', pct: 80, color: 0x7c5cfc, size: 1.8 },
    { name: 'ESLint',           cat: 'testing', pct: 88, color: 0xffd166, size: 2.0 },
    { name: 'Wrangler CLI',     cat: 'testing', pct: 84, color: 0x22d3ee, size: 1.7 },
    // Languages (yellow/green)
    { name: 'JavaScript',       cat: 'languages', pct: 96, color: 0xf7df1e, size: 2.5 },
    { name: 'Python',           cat: 'languages', pct: 70, color: 0x3776ab, size: 1.5 },
    { name: 'HTML5',            cat: 'languages', pct: 95, color: 0xe34c26, size: 2.2 },
  ];

  const CAT_COLORS = {
    frontend:  0x00c9a7,
    backend:   0xff6b35,
    desktop:   0x00c9a7,
    testing:   0xffd166,
    languages: 0xffd166,
  };

  /* ── POSITION SKILLS ON SPHERE ── */
  const nodeGroup = new THREE.Group();
  const lineGroup = new THREE.Group();
  scene.add(nodeGroup);
  scene.add(lineGroup);

  const nodeMeshes = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle

  SKILLS.forEach((skill, i) => {
    const y = 1 - (i / (SKILLS.length - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const r = 42 + (skill.pct - 70) * 0.3;

    const x = Math.cos(theta) * radius * r;
    const z = Math.sin(theta) * radius * r;
    const yPos = y * r;

    // Glow sphere
    const geo = new THREE.SphereGeometry(skill.size, 16, 16);
    const mat = new THREE.MeshBasicMaterial({ color: skill.color, transparent: true, opacity: 0.9 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, yPos, z);
    mesh.userData = { skill, originalColor: skill.color, index: i };
    nodeGroup.add(mesh);
    nodeMeshes.push(mesh);

    // Halo ring
    const haloGeo = new THREE.RingGeometry(skill.size + 0.5, skill.size + 1.2, 24);
    const haloMat = new THREE.MeshBasicMaterial({ color: skill.color, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.copy(mesh.position);
    nodeGroup.add(halo);
  });

  /* ── CONSTELLATION LINES ── */
  const catPositions = {};
  SKILLS.forEach((skill, i) => {
    if (!catPositions[skill.cat]) catPositions[skill.cat] = [];
    catPositions[skill.cat].push(nodeMeshes[i].position);
  });

  Object.keys(catPositions).forEach(cat => {
    const pts = catPositions[cat];
    const color = new THREE.Color(CAT_COLORS[cat]);
    for (let i = 0; i < pts.length - 1; i++) {
      const dist = pts[i].distanceTo(pts[i+1]);
      if (dist < 60) {
        const lGeo = new THREE.BufferGeometry().setFromPoints([pts[i], pts[i+1]]);
        const lMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.15 });
        lineGroup.add(new THREE.Line(lGeo, lMat));
      }
    }
  });

  /* ── BACKGROUND STARS ── */
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(300 * 3);
  for (let i = 0; i < 300 * 3; i++) starPos[i] = (Math.random() - 0.5) * 400;
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.4, transparent: true, opacity: 0.35 })));

  /* ── MOUSE / DRAG ROTATION ── */
  let isDragging = false, prevMX = 0, prevMY = 0;
  let rotX = 0, rotY = 0, velX = 0, velY = 0;
  let mouseNDC = new THREE.Vector2(-999, -999);

  canvas.addEventListener('mousedown', e => { isDragging = true; prevMX = e.clientX; prevMY = e.clientY; });
  window.addEventListener('mouseup', () => { isDragging = false; });
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    if (isDragging) {
      velY += (e.clientX - prevMX) * 0.003;
      velX += (e.clientY - prevMY) * 0.003;
      prevMX = e.clientX; prevMY = e.clientY;
    }
  });
  canvas.addEventListener('mouseleave', () => { mouseNDC.set(-999, -999); tooltip.classList.remove('visible'); });

  /* ── RAYCASTER ── */
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points = { threshold: 2 };
  let hoveredMesh = null;
  let activeCategory = 'all';

  /* ── CATEGORY FILTER ── */
  function setGalaxyCategory(cat) {
    activeCategory = cat;
    nodeMeshes.forEach((mesh, i) => {
      const skillCat = SKILLS[i].cat;
      const match = cat === 'all' || skillCat === cat;
      mesh.material.opacity = match ? 0.9 : 0.1;
    });
    lineGroup.children.forEach(line => {
      line.material.opacity = cat === 'all' ? 0.15 : 0.04;
    });
  }

  /* ── ANIMATION loop ── */
  let animId;
  function galaxyAnimate() {
    animId = requestAnimationFrame(galaxyAnimate);

    rotY += velY;
    rotX += velX;
    velX *= 0.93;
    velY *= 0.93;
    if (!isDragging) { rotY += 0.003; }

    nodeGroup.rotation.y = rotY;
    nodeGroup.rotation.x = rotX * 0.4;
    lineGroup.rotation.y = rotY;
    lineGroup.rotation.x = rotX * 0.4;

    raycaster.setFromCamera(mouseNDC, camera);
    const hits = raycaster.intersectObjects(nodeMeshes);
    if (hits.length > 0) {
      const mesh = hits[0].object;
      if (hoveredMesh !== mesh) {
        if (hoveredMesh) hoveredMesh.scale.set(1, 1, 1);
        hoveredMesh = mesh;
        mesh.scale.set(1.6, 1.6, 1.6);
        const s = mesh.userData.skill;
        tooltip.textContent = s.name;
        tooltip.classList.add('visible');
      }
      const screenPos = mesh.position.clone().project(camera);
      const rect = canvas.getBoundingClientRect();
      tooltip.style.left = ((screenPos.x + 1) / 2 * rect.width + 12) + 'px';
      tooltip.style.top = ((-screenPos.y + 1) / 2 * rect.height - 20) + 'px';
    } else {
      if (hoveredMesh) { hoveredMesh.scale.set(1, 1, 1); hoveredMesh = null; }
      tooltip.classList.remove('visible');
    }

    const t = Date.now() * 0.001;
    nodeMeshes.forEach((mesh, i) => {
      const base = SKILLS[i].size;
      const isActive = activeCategory === 'all' || SKILLS[i].cat === activeCategory;
      if (isActive && mesh !== hoveredMesh) {
        const pulse = base + Math.sin(t * 1.5 + i * 0.7) * 0.15;
        mesh.scale.set(pulse / base, pulse / base, pulse / base);
      }
    });

    renderer.render(scene, camera);
  }

  galaxyAnimate();

  window.addEventListener('resize', () => {
    const nW = canvas.parentElement.offsetWidth;
    const nH = canvas.parentElement.offsetHeight;
    camera.aspect = nW / nH;
    camera.updateProjectionMatrix();
    renderer.setSize(nW, nH);
  });

  const wrap = canvas.parentElement;
  const visObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) galaxyAnimate();
      else cancelAnimationFrame(animId);
    });
  }, { threshold: 0 });
  visObs.observe(wrap);

  window.filterSkillGalaxy = setGalaxyCategory;
})();
