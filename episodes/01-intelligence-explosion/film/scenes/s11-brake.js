// s11 · BRAKE — "Third: build the brake while the road is still straight" … "aren't secure enough for it yet."
// One continuous paper landscape at sunrise (dawn palette). A long straight road runs to the rising sun.
// Carriers: road horizon at 55 % (from s10's rope) → push to the lever the workers assemble → pan left to 1974 lab benches
// → arc right across the road to Asilomar (1975) and its P1–P4 boxes → WOW: the boxes unfold into a gold garden (biotech)
// → crane up: the road splits at the lever into several roads, each to a tower → descend to the lever's globe: a chip pings beacons
// → crane back: the garden is tiny next to the towers → down again: a shadow spoofs one ping → tilt UP into the dawn sky (→ s12).
export default {
  build(E, def) {
    const { THREE, C, V } = E;
    const { lin, smooth, clamp, lerp, expoOut, spring, sineInOut, wob, rng } = E;
    const S = "solutions";
    const A = (p, n = 1) => E.at(S, p, n), Z = (p, n = 1) => E.end(S, p, n);
    const T0 = def.from, T1 = def.to;
    // ---------- word anchors ----------
    const tThird = A("Third build the brake"), tBrake = A("brake while"), tStraight = A("still straight");
    const tWeve = A("We've done this before"), t1974 = A("1974 biologists"), tBiol = A("biologists who"), tSplice = A("splice DNA");
    const tPause = A("pause certain"), tHeld = A("pause held"), tAsil = A("At Asilomar"), tAbout = A("about a hundred");
    const tMatching = A("matching each"), tExperiment = A("experiment to a"), tLevel = A("level of containment"), tContain = A("containment");
    const tResearch = A("Research went on"), tGrew = A("grew into biotech"), tBiotech = A("biotech");
    const tForAI = A("For AI Anthropic"), tPauseAI = A("pause would need"), tLabs = A("several labs"), tCountries = A("several countries");
    const tAgree = A("to agree"), tCheck = A("way to check"), tStopped = A("really stopped");
    const tIdea = A("One promising idea"), tChips = A("check the chips"), tPhysical = A("physical and"), tTracked = A("tracked"),
      tResearchers = A("researchers are designing"), tProve = A("prove where");
    const tLimits = A("limits Asilomar"), tSmall = A("small field"), tTrillion = A("trillion-dollar"), tChipVer = A("chip verification"),
      tUntested = A("untested"), tSay = A("Researchers say"), tSecure = A("secure enough"), tYet = Z("for it yet");

    const scene = new THREE.Scene();
    const camera = E.newCamera();
    const R = rng(1101);
    const PAL = E.PAL.dawn;
    scene.background = new THREE.Color(PAL.clear);
    scene.fog = new THREE.Fog("#8c5f78", 70, 330);

    // ---------- helpers ----------
    const fig = (o) => { const f = E.figure(o); f.userData.mat.side = THREE.DoubleSide; f.traverse((m) => { if (m.isMesh) m.castShadow = true; }); return f; };
    const mesh = (geo, hex, o = {}) => { const m = new THREE.Mesh(geo, E.paperMat(hex, o)); m.castShadow = o.cast !== false; m.receiveShadow = true; return m; };
    const basic = (geo, hex, o = {}) => new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: hex, fog: o.fog ?? true, transparent: !!o.opacity, opacity: o.opacity ?? 1, side: o.side ?? THREE.FrontSide, depthWrite: o.depthWrite ?? true }));
    // a stick between two points (rope, legs)
    const stick = (r, hex) => { const m = mesh(new THREE.CylinderGeometry(r, r, 1, 6), hex); m.userData.set = (a, b) => { m.position.copy(a).add(b).multiplyScalar(0.5);
      const d = b.clone().sub(a); m.scale.set(1, Math.max(0.001, d.length()), 1); m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize()); }; return m; };
    // flat road ribbon along a polyline of [x,z]; reveal(k) runs it on from the first point
    const ribbon = (pts, w, hex, y = 0.05) => {
      const N = pts.length, pos = [], uv = [], nor = [], idx = [];
      for (let i = 0; i < N; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N - 1, i + 1)]; let tx = b[0] - a[0], tz = b[1] - a[1]; const l = Math.hypot(tx, tz) || 1; tx /= l; tz /= l;
        const nx = -tz, nz = tx; const L = [pts[i][0] + nx * w / 2, pts[i][1] + nz * w / 2], Rr = [pts[i][0] - nx * w / 2, pts[i][1] - nz * w / 2];
        pos.push(L[0], y, L[1], Rr[0], y, Rr[1]); uv.push(L[0], L[1], Rr[0], Rr[1]); nor.push(0, 1, 0, 0, 1, 0); }
      for (let i = 0; i < N - 1; i++) { const a = 2 * i, b = a + 1, c = a + 2, d = a + 3; idx.push(a, c, b, b, c, d); }
      const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
      g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
      const m = new THREE.Mesh(g, E.paperMat(hex)); m.material.side = THREE.DoubleSide; m.receiveShadow = true;
      m.userData.reveal = (k) => g.setDrawRange(0, Math.round(clamp(k, 0, 1) * (N - 1)) * 6); return m; };
    const bez = (p0, p1, p2, n) => { const o = []; for (let i = 0; i <= n; i++) { const u = i / n; o.push([(1 - u) * (1 - u) * p0[0] + 2 * u * (1 - u) * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * u * (1 - u) * p1[1] + u * u * p2[1]]); } return o; };
    const puff = (w, h, r) => { const s = new THREE.Shape(); s.moveTo(-w, 0); let x = -w; while (x < w) { const rr = h * (0.45 + r() * 0.55); s.absarc(x + rr, 0, rr, Math.PI, 0, true); x += rr * 2; }
      while (x > -w) { const rr = Math.min(h * (0.25 + r() * 0.2), (x + w) / 2 + 0.01); s.absarc(x - rr, 0, rr, 0, -Math.PI, true); x -= rr * 2; } return s; };
    const cloudShape = (w, h, r) => { const s = new THREE.Shape(); s.moveTo(-w, 0); let x = -w; while (x < w) { const rr = h * (0.45 + r() * 0.55); s.absarc(x + rr, 0, rr, Math.PI, 0, true); x += rr * 2; } s.lineTo(x, -0.3); s.lineTo(-w, -0.3); return s; };
    const dummy = new THREE.Object3D();
    const at = (m, x, y, z) => { m.position.set(x, y, z); return m; };

    // ---------- sky dome (dawn gradient with grain), sun, clouds ----------
    const SUN0 = V(0, 4.2, -230);
    const skyU = { k: { value: 0 }, sunDir: { value: V(0, 0.03, -1).normalize() },
      z0: { value: new THREE.Color("#30264f") }, m0: { value: new THREE.Color("#8a5a86") }, h0: { value: new THREE.Color("#f2a679") },
      z1: { value: new THREE.Color("#55497e") }, m1: { value: new THREE.Color("#d98a8a") }, h1: { value: new THREE.Color("#ffd29c") }, sunCol: { value: new THREE.Color("#ffcf96") } };
    const sky = new THREE.Mesh(new THREE.SphereGeometry(450, 48, 32), new THREE.ShaderMaterial({ uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: "varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: `uniform float k; uniform vec3 sunDir,z0,m0,h0,z1,m1,h1,sunCol; varying vec3 vD;
        float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
        void main(){ vec3 d = normalize(vD); float e = d.y;
          vec3 Zc = mix(z0,z1,k), Mc = mix(m0,m1,k), Hc = mix(h0,h1,k);
          vec3 c = mix(Hc, Mc, smoothstep(-0.03, 0.16, e)); c = mix(c, Zc, smoothstep(0.16, 1.0, e));
          float s = max(dot(d, normalize(sunDir)), 0.0);
          c += sunCol * (pow(s, 40.0) * 0.5 + pow(s, 6.0) * 0.16);
          c *= 1.0 + (hash(floor(gl_FragCoord.xy / 2.0)) - 0.5) * 0.05;
          gl_FragColor = vec4(c, 1.0); }` }));
    sky.frustumCulled = false; sky.renderOrder = -10; scene.add(sky);
    // the sun: stacked paper discs (hero light at the end of the road)
    const sun = new THREE.Group(); scene.add(sun);
    const sunCore = basic(new THREE.CircleGeometry(7, 64), "#fff1d6", { fog: false }); sunCore.material.color.multiplyScalar(1.6); sun.add(sunCore);
    [[9.5, "#ffd9a8", 0.55], [13, "#f7b98a", 0.32], [18, "#eb9e86", 0.18]].forEach(([r, h, o], i) => { const m = basic(new THREE.RingGeometry(r - (i ? 3.5 : 2.5), r, 64), h, { fog: false, opacity: o, depthWrite: false }); m.position.z = -0.5 - i * 0.2; sun.add(m); });
    // horizon clouds (vertical paper, lit pink from below) and high clouds for the tilt-up (faces down)
    const clouds = [];
    const cloudMat = (hex) => new THREE.MeshBasicMaterial({ color: hex, map: E.paperTex, fog: false, side: THREE.DoubleSide });
    [[-70, 22, -200, 22, 4, "#d48a8a", 0.5], [60, 30, -210, 26, 5, "#c98094", 0.35], [-10, 38, -215, 18, 3.6, "#b97795", 0.42], [120, 18, -190, 20, 4, "#e09a8c", 0.3], [-130, 30, -200, 24, 4.4, "#c27f92", 0.38]]
      .forEach(([x, y, z, w, h, hex, v]) => { const m = new THREE.Mesh(new THREE.ShapeGeometry(cloudShape(w, h, R), 12), cloudMat(hex)); m.position.set(x, y, z); scene.add(m); clouds.push({ m, x0: x, y0: y, v, k: 0 }); });
    [[-18, 62, 6, 20, 5, "#e8a08e"], [22, 70, -12, 26, 6, "#d68e98"], [2, 56, 26, 16, 4, "#f0b394"], [-40, 74, -30, 22, 5, "#c88597"], [40, 60, 36, 18, 4.5, "#e7a796"], [-6, 80, -48, 30, 6, "#b9809a"], [30, 66, 60, 20, 5, "#f1b99a"], [-34, 58, 44, 16, 4, "#dc9a92"]]
      .forEach(([x, y, z, w, h, hex], i) => { const m = new THREE.Mesh(new THREE.ShapeGeometry(puff(w, h, R), 12), cloudMat(hex)); m.rotation.x = Math.PI / 2; m.rotation.z = (R() - 0.5) * 0.6; m.position.set(x, y, z); scene.add(m); clouds.push({ m, x0: x, y0: y, v: 0.25 + 0.1 * (i % 3), k: 1 }); });
    // paper birds crossing the sky (secondary motion)
    const birdShape = new THREE.Shape(); birdShape.moveTo(-0.9, 0.25); birdShape.quadraticCurveTo(-0.4, 0.15, 0, -0.1); birdShape.quadraticCurveTo(0.4, 0.15, 0.9, 0.25); birdShape.quadraticCurveTo(0.4, 0.02, 0, -0.25); birdShape.quadraticCurveTo(-0.4, 0.02, -0.9, 0.25);
    const birds = new THREE.InstancedMesh(new THREE.ShapeGeometry(birdShape), new THREE.MeshBasicMaterial({ color: "#3a2740", side: THREE.DoubleSide, fog: false }), 7); birds.frustumCulled = false; scene.add(birds);
    const birdData = [...Array(7)].map((_, i) => ({ x: -40 + i * 7 + R() * 6, y: 14 + R() * 10, z: -120 - R() * 30, s: 0.9 + R() * 0.8, ph: R() * 6 }));

    // ---------- light ----------
    const hemi = new THREE.HemisphereLight("#ffd6bc", "#5a4064", 1.25); scene.add(hemi);
    const key = new THREE.DirectionalLight("#ffd3a0", 2.3); key.position.set(-34, 40, -50); key.target.position.set(2, 0, 22);
    key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 6; key.shadow.bias = -0.0006; key.shadow.normalBias = 0.04;
    Object.assign(key.shadow.camera, { left: -48, right: 48, top: 40, bottom: -40, near: 1, far: 220 }); scene.add(key, key.target);
    const fill = new THREE.DirectionalLight("#f0b0b8", 0.8); fill.position.set(14, 18, 90); scene.add(fill);

    // ---------- ground, fields, trees, far hills ----------
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(700, 420), new THREE.MeshStandardMaterial({ color: "#83607e", map: E.paperTex, bumpMap: E.bumpTex, bumpScale: 0.5, roughness: 0.95 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, -30); floor.receiveShadow = true; scene.add(floor);
    const HORIZ_Z = -176;
    [[HORIZ_Z, "#b98393", 1.4, 3.6, 0.05, 3], [HORIZ_Z + 14, "#9c6c85", 0.9, 2.6, 0.08, 5]].forEach(([z, hex, h0, h1, f, sd]) => {
      const s = new THREE.Shape(); s.moveTo(-340, -1); for (let x = -340; x <= 340; x += 4) s.lineTo(x, h0 + (h1 - h0) * (0.5 + 0.5 * Math.sin(x * f + sd)) * (0.6 + 0.4 * Math.sin(x * 0.013 + sd))); s.lineTo(340, -1);
      const m = E.extrude(s, hex, 0.3); m.position.z = z; m.castShadow = false; scene.add(m); });
    // field patches (instanced), avoiding the road and the near dioramas
    const FIELD_COLS = ["#6f4a66", "#7c5570", "#5f405e", "#86607a", "#9a6a72", "#a77a6a", "#73506c"];
    { const n = 120; const fm = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.04, 1), E.paperMat("#ffffff"), n); fm.receiveShadow = true; let k = 0; const c = new THREE.Color();
      for (let tries = 0; k < n && tries < 2000; tries++) { const x = (R() - 0.5) * 300, z = 12 - R() * 175, w = 6 + R() * 14, d = 4 + R() * 10;
        if (Math.abs(x) - w / 2 < 3.2) continue; if (z > -6 && Math.abs(x) < 24) continue; if (z > -2 && x > 0 && x < 80) continue;
        dummy.position.set(x, 0.02, z); dummy.rotation.set(0, 0, 0); dummy.scale.set(w, 1, d); dummy.updateMatrix(); fm.setMatrixAt(k, dummy.matrix); fm.setColorAt(k, c.set(FIELD_COLS[Math.floor(R() * FIELD_COLS.length)])); k++; }
      fm.count = k; scene.add(fm); }
    // flat paper trees (instanced cut-outs facing the camera)
    const treeShape = (() => { const s = new THREE.Shape(); s.moveTo(-0.08, 0); s.lineTo(0.08, 0); s.lineTo(0.08, 0.5); s.quadraticCurveTo(0.7, 0.6, 0.6, 1.3); s.quadraticCurveTo(0.5, 2.2, 0, 2.6); s.quadraticCurveTo(-0.5, 2.2, -0.6, 1.3); s.quadraticCurveTo(-0.7, 0.6, -0.08, 0.5); s.lineTo(-0.08, 0); return s; })();
    const trees = new THREE.InstancedMesh(new THREE.ExtrudeGeometry(treeShape, { depth: 0.12, bevelEnabled: false, curveSegments: 8 }), E.paperMat("#ffffff"), 140); trees.castShadow = true; trees.receiveShadow = true;
    { let k = 0; const c = new THREE.Color(); for (let tries = 0; k < 140 && tries < 3000; tries++) { const x = (R() - 0.5) * 260, z = 8 - R() * 170;
        if (Math.abs(x) < 6) continue; if (z > -8 && Math.abs(x) < 26) continue; if (z > -4 && x > 0 && x < 80) continue;
        const s = 1.2 + R() * 2.4; dummy.position.set(x, 0, z); dummy.rotation.set(0, (R() - 0.5) * 0.4, 0); dummy.scale.set(s, s * (0.9 + R() * 0.5), s); dummy.updateMatrix(); trees.setMatrixAt(k, dummy.matrix);
        trees.setColorAt(k, c.set(["#4d3350", "#3a2740", "#5a3a58", "#603f5f"][Math.floor(R() * 4)])); k++; } trees.count = k; }
    scene.add(trees);

    // ---------- the road (straight to the sun) ----------
    const ROAD_W = 3.6;
    const road = ribbon([...Array(76)].map((_, i) => [0, 120 - i * 4]), ROAD_W, "#cf9b88", 0.05); road.userData.reveal(1); scene.add(road);
    const edgeL = ribbon([...Array(76)].map((_, i) => [-ROAD_W / 2 - 0.12, 120 - i * 4]), 0.18, "#8e6474", 0.055); edgeL.userData.reveal(1); scene.add(edgeL);
    const edgeR = ribbon([...Array(76)].map((_, i) => [ROAD_W / 2 + 0.12, 120 - i * 4]), 0.18, "#8e6474", 0.055); edgeR.userData.reveal(1); scene.add(edgeR);
    const dashGeo = new THREE.PlaneGeometry(0.16, 1.5); dashGeo.rotateX(-Math.PI / 2);
    { const n = 100; const dm = new THREE.InstancedMesh(dashGeo, E.paperMat("#f6dcb4"), n); dm.receiveShadow = true;
      for (let i = 0; i < n; i++) { dummy.position.set(0, 0.07, 110 - i * 3.0); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); dm.setMatrixAt(i, dummy.matrix); } scene.add(dm); }

    { const n = 120; const fp = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 0.7, 0.12).translate(0, 0.35, 0), E.paperMat("#e2c6ae"), n); fp.castShadow = true; let k = 0;
      for (let i = 0; i < 60; i++) for (const sx of [-1, 1]) { const z = 70 - i * 4; if (z > 14 && z < 46 && (sx > 0 ? true : z > 22 && z < 34)) continue; dummy.position.set(sx * 3.1, 0, z); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 0.9 + 0.2 * ((i * 7) % 3), 1); dummy.updateMatrix(); fp.setMatrixAt(k++, dummy.matrix); }
      fp.count = k; scene.add(fp); }
    // ---------- the brake lever on its globe (roadside, the later fork point) ----------
    const LEV = V(2.9, 0, 20);
    const lever = new THREE.Group(); lever.position.copy(LEV); scene.add(lever);
    lever.add(at(mesh(new THREE.BoxGeometry(1.9, 0.3, 1.9), "#4d3350"), 0, 0.15, 0));
    const globeTex = (() => { const c = document.createElement("canvas"); c.width = 512; c.height = 256; const g = c.getContext("2d"); g.fillStyle = "#8a6a9a"; g.fillRect(0, 0, 512, 256);
      const r = rng(77); g.fillStyle = "#e3bf98"; for (let k = 0; k < 9; k++) { const cx = r() * 512, cy = 50 + r() * 156; g.beginPath(); for (let a = 0; a < 6.3; a += 0.3) { const rr = 18 + r() * 30; g.lineTo(cx + Math.cos(a) * rr * 1.4, cy + Math.sin(a) * rr); } g.fill(); }
      g.strokeStyle = "rgba(255,240,220,0.35)"; g.lineWidth = 2; for (let x = 0; x < 512; x += 64) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 256); g.stroke(); } for (let y = 32; y < 256; y += 48) { g.beginPath(); g.moveTo(0, y); g.lineTo(512, y); g.stroke(); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.72, 40, 24), new THREE.MeshStandardMaterial({ map: globeTex, roughness: 0.9, bumpMap: E.bumpTex, bumpScale: 0.3 }));
    globe.position.y = 0.3 + 0.72; globe.castShadow = globe.receiveShadow = true; lever.add(globe);
    const meridian = mesh(new THREE.TorusGeometry(0.86, 0.035, 6, 48), "#e6d2b8"); meridian.position.copy(globe.position); meridian.rotation.set(0.3, 0.2, 0); lever.add(meridian);
    // quadrant plate behind the lever (the brake's travel)
    { const s = new THREE.Shape(); s.absarc(0, 0, 1.45, Math.PI * 0.28, Math.PI * 0.72, false); s.absarc(0, 0, 1.2, Math.PI * 0.72, Math.PI * 0.28, true);
      const q = E.extrude(s, "#7a4f70", 0.06); q.position.set(0, 1.74, -0.22); lever.add(q);
      for (let i = 0; i < 5; i++) { const a = Math.PI * (0.32 + i * 0.09); const n = mesh(new THREE.BoxGeometry(0.05, 0.18, 0.06), "#efe6d2"); n.position.set(Math.cos(a) * 1.33, 1.74 + Math.sin(a) * 1.33, -0.14); n.rotation.z = a - Math.PI / 2; lever.add(n); } }
    const pivot = new THREE.Group(); pivot.position.set(0, 1.74, 0); lever.add(pivot);
    const arm = new THREE.Group(); pivot.add(arm);
    arm.add(at(mesh(new THREE.BoxGeometry(0.13, 1.25, 0.13), "#e8d6bf"), 0, 0.62, 0));
    arm.add(at(mesh(new THREE.BoxGeometry(1.9, 0.12, 0.12), "#d9b48f"), 0, 1.25, 0));
    const knobMat = E.paperMat(C.amber, { emissive: 0.5 });
    [-0.98, 0.98].forEach((x) => { const k = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 12), knobMat); k.position.set(x, 1.25, 0); k.castShadow = true; arm.add(k); });
    const hub = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.3, 16), "#d9b48f"); hub.rotation.x = Math.PI / 2; pivot.add(hub);
    // chip on the globe's front: dark paper square, cyan core, pins
    const chip = new THREE.Group(); chip.position.set(0.0, 1.02, 0.73); lever.add(chip);
    chip.add(mesh(new THREE.BoxGeometry(0.3, 0.3, 0.04), "#241c33"));
    for (let i = 0; i < 4; i++) for (let s = -1; s <= 1; s += 2) { const p = mesh(new THREE.BoxGeometry(0.04, 0.07, 0.02), "#d9c7b0", { cast: false }); p.position.set(-0.105 + i * 0.07, s * 0.18, 0); chip.add(p);
      const q = mesh(new THREE.BoxGeometry(0.07, 0.04, 0.02), "#d9c7b0", { cast: false }); q.position.set(s * 0.18, -0.105 + i * 0.07, 0); chip.add(q); }
    const chipCore = E.glowPlane(0.15, 0.15, C.cyan); chipCore.position.z = 0.025; chip.add(chipCore); chipCore.userData.setGlow(0.08);
    const chipLight = E.pointLight(C.cyan, 0, 6); chipLight.position.set(0, 1.1, 1.2); lever.add(chipLight);
    // assembly gantry (A-frame) + rope; workers
    const gantry = new THREE.Group(); lever.add(gantry);
    const legA = stick(0.06, "#5a3a58"), legB = stick(0.06, "#5a3a58"); gantry.add(legA, legB);
    legA.userData.set(V(-1.7, 0, 0.15), V(0, 4.4, 0.15)); legB.userData.set(V(1.7, 0, 0.15), V(0, 4.4, 0.15));
    const ropeA = stick(0.018, "#efe6d2"), ropeB = stick(0.018, "#efe6d2"); lever.add(ropeA, ropeB);
    const workers = [fig({ pose: "stand", hair: "short", seed: 3 }), fig({ pose: "stand", hair: "bun", seed: 5 }), fig({ pose: "stand", hair: "short", seed: 8 })];
    workers[0].position.set(2.6, 0, 0.6); workers[0].scale.x = -1; workers[1].position.set(3.3, 0, 0.3); workers[1].scale.x = -1; workers[2].position.set(-1.5, 0, 0.5);
    workers.forEach((w) => lever.add(w));

    // ---------- 1974: paper lab benches (left of the road) ----------
    const LAB = V(-9.5, 0, 28.5);
    const lab = new THREE.Group(); lab.position.copy(LAB); scene.add(lab);
    const labPop = new THREE.Group(); lab.add(labPop);
    { const s = E.rectShape(10, 4.4, 0, 2.2); [[-3.3, 2.7], [3.3, 2.7]].forEach(([x, y]) => { const h = new THREE.Path(); h.moveTo(x - 1, y - 0.8); h.lineTo(x + 1, y - 0.8); h.lineTo(x + 1, y + 1); h.lineTo(x - 1, y + 1); h.lineTo(x - 1, y - 0.8); s.holes.push(h); });
      const wall = E.extrude(s, "#7d6a96", 0.2); wall.position.z = -1.8; labPop.add(wall);
      [-3.3, 3.3].forEach((x) => { const gp = E.glowPlane(2.2, 2.0, "#f4a77c"); gp.position.set(x, 2.8, -2.1); gp.userData.setGlow(0.85); labPop.add(gp);
        const mv = mesh(new THREE.BoxGeometry(0.08, 1.9, 0.08), "#5a3a55"); mv.position.set(x, 2.8, -1.65); labPop.add(mv); const mh = mesh(new THREE.BoxGeometry(2.0, 0.08, 0.08), "#5a3a55"); mh.position.set(x, 2.8, -1.65); labPop.add(mh); }); }
    const benchTop = "#e2c6ae";
    [[-0.6, 9], [1.6, 9]].forEach(([z, w]) => { const b = mesh(new THREE.BoxGeometry(w, 0.86, 0.9), "#5a3a55"); b.position.set(0, 0.43, z); labPop.add(b);
      const tp = mesh(new THREE.BoxGeometry(w + 0.2, 0.06, 1.0), benchTop); tp.position.set(0, 0.89, z); labPop.add(tp); });
    // sample tubes (instanced, amber glow) on the benches
    { const n = 16; const tm = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.035, 0.22, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.amber).multiplyScalar(1.1) }), n);
      for (let i = 0; i < n; i++) { dummy.position.set(-4 + (i % 8) * 1.1 + R() * 0.3, 1.03, i < 8 ? -0.75 : 1.45); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); tm.setMatrixAt(i, dummy.matrix); } labPop.add(tm); }
    // pendant lamps (hero light of the 1974 shot)
    const lamps = [];
    [-2.6, 2.6].forEach((x) => { const sh = new THREE.Shape(); sh.moveTo(-0.45, 0); sh.lineTo(0.45, 0); sh.lineTo(0.18, 0.42); sh.lineTo(-0.18, 0.42); sh.lineTo(-0.45, 0);
      const shade = E.extrude(sh, "#3a2740", 0.3); shade.position.set(x, 3.05, 0.35); labPop.add(shade);
      const cord = mesh(new THREE.BoxGeometry(0.025, 1.0, 0.025), "#3a2740"); cord.position.set(x, 3.95, 0.5); labPop.add(cord);
      const bulb = E.glowPlane(0.7, 0.1, C.amberSoft); bulb.position.set(x, 3.05, 0.66); labPop.add(bulb); lamps.push(bulb); });
    const labLight = E.pointLight("#ffc890", 0, 14); labLight.position.set(0, 3.0, 1.5); labPop.add(labLight);
    // scientists with pipettes
    const sci = [[-3.4, -1.25, 1], [-0.6, -1.25, -1], [2.6, -1.25, 1], [-1.9, 0.95, 1], [1.2, 0.95, -1]].map(([x, z, dir], i) => {
      const f = fig({ pose: "stand", coat: true, hair: ["bun", "short", "long", "short", "bun"][i], seed: 11 + i }); f.position.set(x, 0, z); f.scale.x = dir; labPop.add(f);
      const pip = new THREE.Group(); pip.position.set(0.36, 0, 0.02); f.userData.forearm.add(pip);
      const tube = mesh(new THREE.CylinderGeometry(0.022, 0.012, 0.42, 8), "#efe6d2"); tube.position.y = -0.14; pip.add(tube);
      const cap = mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 8), "#d9b48f"); cap.position.y = 0.1; pip.add(cap);
      return { f, pip, ph: R() * 6, dir }; });
    // the DNA helix floating above the back bench (two strands + rungs); splices on "splice"
    const HN = 26; const helix = new THREE.Group(); helix.position.set(0, 2.15, -0.4); labPop.add(helix);
    const beadMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffd9a8").multiplyScalar(1.05) });
    const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.06, 10, 8), beadMat, HN * 2); helix.add(beads);
    const rungs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 1, 0.03), new THREE.MeshBasicMaterial({ color: "#e9b88a" }), HN); helix.add(rungs);
    const newBeads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.07, 10, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.amber).multiplyScalar(1.4) }), 8); helix.add(newBeads);

    // ---------- 1975: Asilomar — seaside hall, cypresses, sea, P1–P4 boxes ----------
    const HALL = V(21, 0, 27);
    const asil = new THREE.Group(); scene.add(asil);
    const hall = new THREE.Group(); hall.position.copy(HALL); asil.add(hall);
    { const s = E.polyShape([[-5, 0], [5, 0], [5, 2.8], [5.6, 2.8], [0, 5.4], [-5.6, 2.8], [-5, 2.8]]);
      const wins = []; [-3.6, -1.9, 1.9, 3.6].forEach((x) => { const h = new THREE.Path(); h.moveTo(x - 0.5, 0.9); h.lineTo(x + 0.5, 0.9); h.lineTo(x + 0.5, 2.2); h.lineTo(x - 0.5, 2.2); h.lineTo(x - 0.5, 0.9); s.holes.push(h); wins.push(x); });
      const d = new THREE.Path(); d.moveTo(-0.6, 0); d.lineTo(0.6, 0); d.lineTo(0.6, 2.2); d.absarc(0, 2.2, 0.6, 0, Math.PI, false); d.lineTo(-0.6, 0); s.holes.push(d);
      const front = E.extrude(s, "#d4ab9c", 0.25); hall.add(front);
      const body = mesh(new THREE.BoxGeometry(10, 2.8, 4), "#b08a92"); body.position.set(0, 1.4, -2.25); hall.add(body);
      const roofS = E.polyShape([[-5.6, 2.8], [5.6, 2.8], [0, 5.4]]); const roof = new THREE.Mesh(new THREE.ExtrudeGeometry(roofS, { depth: 4.3, bevelEnabled: false }), E.paperMats("#5a3a58")); roof.position.z = -4.3; roof.castShadow = roof.receiveShadow = true; hall.add(roof);
      [...wins, 0].forEach((x, i) => { const gp = E.glowPlane(i === 4 ? 1.3 : 1.1, i === 4 ? 2.9 : 1.4, C.amber); gp.position.set(x, i === 4 ? 1.4 : 1.55, 0.04); gp.userData.setGlow(0.75); hall.add(gp); });
      const chim = mesh(new THREE.BoxGeometry(0.6, 1.6, 0.6), "#5a3a58"); chim.position.set(3.2, 4.6, -2); hall.add(chim); }
    const hallLight = E.pointLight("#ffc890", 0, 12); hallLight.position.set(HALL.x, 1.6, HALL.z + 2.5); scene.add(hallLight);
    // hall people (a few of the ~150)
    const guests = [[-2.8, 1.2, 1], [-2.2, 1.6, -1], [2.1, 1.3, 1], [2.9, 1.0, -1], [-0.9, 2.2, 1]].map(([x, z, dir], i) => { const f = fig({ pose: "stand", hair: ["short", "bun", "long", "short", "bun"][i], seed: 31 + i, coat: i % 2 === 0 });
      f.scale.set(0.78 * dir, 0.78, 0.78); f.position.set(HALL.x + x, 0, HALL.z + z); asil.add(f); return f; });
    // cypresses (wind-swept, flat-topped)
    const cypress = (x, z, sc, lean) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(sc); asil.add(g);
      const tr = E.extrude(E.polyShape([[-0.18, 0], [0.18, 0], [0.12 + lean, 2.4], [-0.06 + lean, 2.4]]), "#3a2740", 0.18); g.add(tr);
      [[lean - 0.3, 2.5, 1.9, 0.55], [lean + 0.7, 2.95, 1.5, 0.5], [lean - 0.9, 2.9, 1.1, 0.42], [lean + 0.2, 3.35, 1.2, 0.45]].forEach(([cx, cy, rx, ry]) => {
        const b = E.extrude(E.circleShape(1), "#3d2a47", 0.2); b.scale.set(rx, ry, 1); b.position.set(cx, cy, 0.05); g.add(b); }); };
    cypress(HALL.x - 7.2, HALL.z - 2.2, 1.25, 0.6); cypress(HALL.x + 7.4, HALL.z - 3.2, 1.45, 1.0); cypress(HALL.x + 11.5, HALL.z - 0.8, 1.1, 0.8);
    // the sea: layered wave strips (right of the hall)
    const waves = [];
    [[6, "#5d4a80", 0.5], [10, "#6f5a90", 0.5], [14, "#8a6a9a", 0.45], [18, "#b98ba5", 0.38], [21.5, "#d9a6ae", 0.3]].forEach(([z, hex, a], i) => {
      const s = new THREE.Shape(); s.moveTo(-32, -0.2); for (let x = -32; x <= 32; x += 0.5) s.lineTo(x, a + a * 0.45 * Math.sin(x * 1.3 + i) + 0.1 * Math.sin(x * 3.1 + i * 2)); s.lineTo(32, -0.2);
      const m = E.extrude(s, hex, 0.12); m.position.set(47, 0, z); asil.add(m); waves.push({ m, x0: m.position.x, z0: m.position.z, i }); });
    { const sea = new THREE.Mesh(new THREE.PlaneGeometry(64, 20), new THREE.MeshStandardMaterial({ color: "#5d4a80", roughness: 0.55, map: E.paperTex })); sea.rotation.x = -Math.PI / 2; sea.position.set(46, 0.03, 13); sea.receiveShadow = true; asil.add(sea);
      const glit = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 20), new THREE.MeshBasicMaterial({ color: "#ffd9a8", transparent: true, opacity: 0.35, depthWrite: false })); glit.rotation.x = -Math.PI / 2; glit.position.set(30, 0.06, 13); asil.add(glit); waves.glit = glit; }
    // P1–P4: a staircase of paper boxes, each more sealed
    const BOX = [{ x: 13.2, z: 34.6, s: 0.95 }, { x: 15.5, z: 34.1, s: 1.2 }, { x: 18.2, z: 33.5, s: 1.48 }, { x: 21.4, z: 32.8, s: 1.8 }];
    const boxCol = ["#d9b9a0", "#c9a08f", "#b4858a", "#8f6680"];
    const boxes = BOX.map((b, i) => {
      const g = new THREE.Group(); g.position.set(b.x, 0, b.z); scene.add(g);
      const w = 1.7 * b.s, h = 1.25 * b.s, d = 1.4 * b.s, th = 0.06 + i * 0.03; const hex = boxCol[i];
      const base = mesh(new THREE.BoxGeometry(w, 0.05, d), hex); base.position.y = 0.025; g.add(base);
      const wall = (pw, ph, front) => front ? E.drawnCard({ w: pw, h: ph, depth: th, hex, px: 512, draw: (ctx, cw, ch) => {
          ctx.fillStyle = "rgba(60,30,50,0.85)"; ctx.font = `400 ${Math.round(ch * 0.42)}px "Instrument Serif"`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("P" + (i + 1), cw / 2, ch * 0.5);
          if (i >= 2) { ctx.strokeStyle = "rgba(60,30,50,0.5)"; ctx.lineWidth = ch * 0.02; ctx.strokeRect(cw * 0.08, ch * 0.08, cw * 0.84, ch * 0.84); }
          if (i === 3) { ctx.strokeRect(cw * 0.14, ch * 0.14, cw * 0.72, ch * 0.72); } } }) : mesh(new THREE.BoxGeometry(pw, ph, th), hex);
      const hinge = (px, pz) => { const p = new THREE.Group(); p.position.set(px, 0.05, pz); g.add(p); return p; };
      const W = [hinge(0, d / 2), hinge(0, -d / 2), hinge(-w / 2, 0), hinge(w / 2, 0)];
      const fw = wall(w, h, true); fw.position.set(0, h / 2, -th / 2); W[0].add(fw);
      const bw = wall(w, h); bw.position.set(0, h / 2, th / 2); W[1].add(bw);
      const lw = wall(d, h); lw.rotation.y = Math.PI / 2; lw.position.set(th / 2, h / 2, 0); W[2].add(lw);
      const rw = wall(d, h); rw.rotation.y = Math.PI / 2; rw.position.set(-th / 2, h / 2, 0); W[3].add(rw);
      let lid = null; if (i > 0) { lid = new THREE.Group(); lid.position.set(0, h + 0.05, -d / 2); g.add(lid); const lm = mesh(new THREE.BoxGeometry(w + 0.04, th, d + 0.04), hex); lm.position.set(0, th / 2, d / 2); lid.add(lm);
        if (i === 3) { const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.05, 20), knobMat); seal.position.set(0, th + 0.03, d / 2); lid.add(seal); } }
      let lamp = null; if (i === 3) { lamp = E.glowPlane(0.28, 0.28, C.amber); lamp.position.set(w * 0.34, h * 0.82, d / 2 + th + 0.01); g.add(lamp); }
      return { g, W, lid, w, h, d, i, lamp };
    });
    const BOXC = V(17.4, 0, 33.8);

    // ---------- the garden (biotech): instanced stems, leaves, flowers, bottles ----------
    const PN = 260;
    const plants = []; for (let k = 0, tries = 0; k < PN && tries < 4000; tries++) { const x = 6 + R() * 30, z = HALL.z + 0.8 + R() * 18;
      if (Math.abs(x - HALL.x) < 5.4 && z < HALL.z + 0.6) continue; if (x < ROAD_W / 2 + 0.6) continue;
      const dist = Math.hypot(x - BOXC.x, z - BOXC.z); const big = R() < 0.12; plants.push({ x, z, h: big ? 2.2 + R() * 1.2 : 0.5 + R() * 1.3, t0: tResearch + 0.15 + dist * 0.17 + R() * 0.35, ph: R() * 6, s: big ? 1.6 : 0.8 + R() * 0.6, lean: (R() - 0.5) * 0.25 }); k++; }
    // boxes' own plants: several tall ones straight out of each box
    BOX.forEach((b, i) => { for (let k = 0; k < 4; k++) plants.push({ x: b.x + (R() - 0.5) * b.s * 1.2, z: b.z + (R() - 0.5) * b.s * 0.8, h: 1.1 + b.s * 0.7 + R() * 0.5, t0: tResearch + 0.05 + i * 0.12 + k * 0.08, ph: R() * 6, s: 1.1, lean: (R() - 0.5) * 0.2 }); });
    const NPl = plants.length;
    const stems = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 1, 0.05).translate(0, 0.5, 0), E.paperMat("#7d7a43"), NPl); stems.castShadow = true;
    const leafShape = (() => { const s = new THREE.Shape(); s.moveTo(0, 0); s.quadraticCurveTo(0.22, 0.12, 0.42, 0); s.quadraticCurveTo(0.22, -0.1, 0, 0); return s; })();
    const leaves = new THREE.InstancedMesh(new THREE.ExtrudeGeometry(leafShape, { depth: 0.02, bevelEnabled: false, curveSegments: 6 }), E.paperMat("#ffffff"), NPl * 2); leaves.castShadow = true;
    const flShape = (() => { const s = new THREE.Shape(); const n = 7; for (let i = 0; i <= n * 2; i++) { const a = i / (n * 2) * Math.PI * 2, r = i % 2 ? 0.1 : 0.2; i ? s.lineTo(Math.cos(a) * r, Math.sin(a) * r) : s.moveTo(r, 0); } return s; })();
    const flowerMat = E.paperMat("#ffffff", { emissive: 0.0 }); flowerMat.emissive = new THREE.Color("#ffb35c"); flowerMat.emissiveIntensity = 0;
    const flowers = new THREE.InstancedMesh(new THREE.ExtrudeGeometry(flShape, { depth: 0.03, bevelEnabled: false, curveSegments: 4 }), flowerMat, NPl); flowers.castShadow = true;
    const bottleShape = (() => { const s = new THREE.Shape(); s.moveTo(-0.12, 0); s.lineTo(0.12, 0); s.quadraticCurveTo(0.15, 0, 0.15, 0.05); s.lineTo(0.15, 0.3); s.quadraticCurveTo(0.15, 0.36, 0.07, 0.38); s.lineTo(0.06, 0.46); s.lineTo(-0.06, 0.46); s.lineTo(-0.07, 0.38); s.quadraticCurveTo(-0.15, 0.36, -0.15, 0.3); s.lineTo(-0.15, 0.05); s.quadraticCurveTo(-0.15, 0, -0.12, 0); return s; })();
    const BN = 46; const bottleMat = E.paperMat("#ffffff"); bottleMat.emissive = new THREE.Color("#ff9a3c"); bottleMat.emissiveIntensity = 0;
    const bottles = new THREE.InstancedMesh(new THREE.ExtrudeGeometry(bottleShape, { depth: 0.2, bevelEnabled: false, curveSegments: 6 }), bottleMat, BN); bottles.castShadow = true;
    const caps = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.08, 0.22), E.paperMat("#efe6d2"), BN);
    const bott = []; for (let k = 0; k < BN; k++) { const x = 7 + R() * 27, z = HALL.z + 1.5 + R() * 19; if (Math.abs(x - HALL.x) < 5.2 && z < HALL.z + 0.6) { k--; continue; }
      bott.push({ x, z, s: 1.0 + R() * 1.4, t0: tResearch + 0.9 + Math.hypot(x - BOXC.x, z - BOXC.z) * 0.15 + R() * 0.3, ry: (R() - 0.5) * 0.5 }); }
    { const c = new THREE.Color(); const LC = ["#9a9a50", "#b8a85a", "#7f8a4a", "#c4b06a"], FC = ["#ffd9a8", "#ffb35c", "#f7c6a0", "#fff0d6", "#f2a679"];
      for (let i = 0; i < NPl; i++) { leaves.setColorAt(2 * i, c.set(LC[i % 4])); leaves.setColorAt(2 * i + 1, c.set(LC[(i + 1) % 4])); flowers.setColorAt(i, c.set(FC[i % 5])); }
      for (let i = 0; i < BN; i++) bottles.setColorAt(i, c.set(["#ffb35c", "#e7954a", "#ffc47a"][i % 3])); }
    [stems, leaves, flowers, bottles, caps].forEach((m) => { m.frustumCulled = false; scene.add(m); });
    const gardenLight = E.pointLight("#ffc27a", 0, 30); gardenLight.position.set(BOXC.x, 3.5, BOXC.z + 3); scene.add(gardenLight);

    // ---------- the split: several roads, each to its own tower ----------
    const FORK = [0.6, 19];
    const TW = [{ x: -66, z: -66, h: 46, w: 9, hex: "#4d3350", fl: 13 }, { x: -28, z: -98, h: 58, w: 10, hex: "#5a3a58", fl: 16 }, { x: 30, z: -100, h: 54, w: 9.5, hex: "#4a3352", fl: 15 }, { x: 68, z: -70, h: 44, w: 8.5, hex: "#553752", fl: 12 }];
    const branches = TW.map((tw, i) => { const ctrl = [tw.x * 0.18, FORK[1] - 34 - i * 2]; const pts = bez(FORK, ctrl, [tw.x, tw.z + 3], 60);
      const rb = ribbon(pts, 3.0, "#c9927f", 0.052); rb.userData.reveal(0); scene.add(rb);
      const dm = new THREE.InstancedMesh(dashGeo, E.paperMat("#f6dcb4"), 60); dm.receiveShadow = true; dm.count = 0; scene.add(dm);
      // arc length table for dashes
      const L = [0]; for (let k = 1; k < pts.length; k++) L.push(L[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
      return { rb, dm, pts, L, len: L.at(-1), t0: tLabs - 0.1 + [0.2, 0.0, 0.1, 0.3][i] }; });
    const samplePath = (b, s) => { let k = 1; while (k < b.L.length - 1 && b.L[k] < s) k++; const u = (s - b.L[k - 1]) / Math.max(1e-6, b.L[k] - b.L[k - 1]); const a = b.pts[k - 1], c = b.pts[k];
      return [lerp(a[0], c[0], u), lerp(a[1], c[1], u), Math.atan2(c[0] - a[0], c[1] - a[1])]; };
    const towers = TW.map((tw, i) => { const hingeG = new THREE.Group(); hingeG.position.set(tw.x, 0, tw.z); scene.add(hingeG);
      const t = E.tower({ w: tw.w, h: tw.h, floors: tw.fl, hex: tw.hex, roof: i % 2 ? "spire" : "flat" }); hingeG.add(t);
      // pennant (several countries: each tower its own paper colour)
      const pen = E.extrude(E.polyShape([[0, 0], [2.6, -0.6], [0, -1.2]]), ["#e6c29a", "#c9a0b8", "#a8b8c8", "#e0a88e"][i], 0.06); pen.position.set(0.1, tw.h + (i % 2 ? tw.w * 0.6 : 0) + 3.2, 0.2); t.add(pen);
      const pole = mesh(new THREE.BoxGeometry(0.12, 3.4, 0.12), "#3a2740"); pole.position.set(0, tw.h + (i % 2 ? tw.w * 0.6 : 0) + 1.7, 0.2); t.add(pole);
      hingeG.rotation.x = -Math.PI / 2; return { g: hingeG, t, tw, pen, t0: 0 }; });
    // representatives: one from each road reaches toward the one shared lever
    const reps = [[-1.35, 0.55, 1, -9, 6], [-1.0, -0.6, 1, -6, -9], [1.35, -0.55, -1, 7, -9], [1.25, 0.6, -1, 10, 5]].map(([x, z, dir, sx, sz], i) => {
      const f = fig({ pose: "stand", hair: ["short", "bun", "long", "short"][i], seed: 51 + i }); f.scale.set(dir * 1.05, 1.05, 1.05); lever.add(f);
      return { f, to: V(x, 0, z), from: V(x + sx * 0.5, 0, z + sz * 0.5), dir, t0: tCountries + 0.2 + i * 0.25 }; });

    // ---------- beacons around the globe + pings ----------
    const GC = V(LEV.x, 1.02, LEV.z); // globe centre (world)
    const BEA = []; { const angs = [150, 195, 240, 285, 330, 20]; angs.forEach((a, i) => { const r = 3.6, ar = a * Math.PI / 180; const x = LEV.x + Math.cos(ar) * r, z = LEV.z - Math.sin(ar) * r * 0.95;
      const hg = new THREE.Group(); hg.position.set(x, 0, z); scene.add(hg);
      const post = mesh(new THREE.BoxGeometry(0.09, 1.5, 0.09), "#e2c6ae"); post.position.y = 0.75; hg.add(post);
      const dish = E.extrude(E.ringShape(0.13, 0.26), "#efe6d2", 0.05); dish.position.set(0, 1.62, 0); hg.add(dish);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan).multiplyScalar(0.15) })); head.position.y = 1.62; hg.add(head);
      hg.rotation.x = -Math.PI / 2; BEA.push({ g: hg, head, top: V(x, 1.62, z), t0: tTracked - 0.35 + i * 0.13, flash: 0 }); }); }
    const pingMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyanPale).multiplyScalar(2.2) });
    const fakeMat = new THREE.MeshBasicMaterial({ color: "#2a1f38" });
    const pings = BEA.map((b) => { const ctrl = GC.clone().add(b.top).multiplyScalar(0.5); ctrl.y += 1.4; const curve = new THREE.QuadraticBezierCurve3(GC.clone().add(V(0, 0, 0.75)), ctrl, b.top.clone());
      const line = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.012, 4, false), new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0, depthWrite: false })); scene.add(line);
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), pingMat); dot.scale.set(1, 1, 1); dot.visible = false; scene.add(dot);
      const back = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), pingMat); back.visible = false; scene.add(back);
      return { curve, line, dot, back }; });
    // ground ring (location proven)
    const ringG = new THREE.RingGeometry(3.5, 3.62, 96, 1); ringG.rotateX(-Math.PI / 2);
    const ring = new THREE.Mesh(ringG, new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan).multiplyScalar(1.3), transparent: true, opacity: 0.9, side: THREE.DoubleSide }));
    ring.position.set(LEV.x, 0.09, LEV.z); ring.scale.z = 0.95; ringG.setDrawRange(0, 0); scene.add(ring);
    // the shadow that spoofs one ping
    const SPOOF = 4; const spoofB = BEA[SPOOF];
    const shadow = new THREE.Group(); scene.add(shadow);
    { const s = new THREE.Shape(); s.moveTo(-0.4, 0); s.lineTo(0.4, 0); s.quadraticCurveTo(0.42, 1.3, 0.2, 1.75); s.quadraticCurveTo(0, 2.05, -0.2, 1.75); s.quadraticCurveTo(-0.42, 1.3, -0.4, 0);
      const m = new THREE.Mesh(new THREE.ShapeGeometry(s, 16), new THREE.MeshBasicMaterial({ color: "#1a1226", side: THREE.DoubleSide, transparent: true, opacity: 0.92 })); shadow.add(m);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), fakeMat); eye.position.y = 1.62; shadow.add(eye); shadow.userData.eye = eye; }
    const SHPOS = spoofB.top.clone().lerp(GC, 0.38); SHPOS.y = 0; shadow.position.copy(SHPOS); shadow.visible = false;

    // ---------- DOM ----------
    const chapter = E.chapterDOM(E.layer, { text: "BRAKE", inAt: tThird, outAt: tWeve + 1.2 });
    const stamp = E.stampDOM(E.layer, [{ t: t1974 + 0.05, year: "1974", label: "Biology labs" }, { t: A("Asilomar") + 0.05, year: "1975", label: "Asilomar, California" }], tForAI - 0.2);
    const src1 = E.srcDOM(E.layer, { big: "Asilomar, 1975", small: "~150 people, mostly scientists", inAt: tAbout, outAt: tResearch - 0.2 });
    const src2 = E.srcDOM(E.layer, { big: "Chip location verification", small: "proposed, untested", inAt: tResearchers, outAt: tSecure + 0.4 });
    const doms = [chapter, stamp, src1, src2];
    [src1, src2].forEach((d) => (d.el.style.textShadow = "0 1px 10px rgba(40,22,48,0.85), 0 0 2px rgba(40,22,48,0.6)"));

    // ---------- camera ----------
    // start: road horizon (hill foot at HORIZ_Z) exactly at 55 % of frame height
    const P0 = V(0, 2.4, 40); const fovH = Math.tan((35 * Math.PI / 180) / 2);
    const pitch0 = Math.atan2(-P0.y, P0.z - HORIZ_Z) + Math.atan(0.1 * fovH);
    const L0 = V(0, P0.y + Math.tan(pitch0) * 16, P0.z - 16);
    const up70 = (p, a = 72) => { const r = a * Math.PI / 180; return [p[0], p[1] + Math.sin(r) * 16, p[2] - Math.cos(r) * 16]; };
    const KEYS = [
      { t: T0, p: [P0.x, P0.y, P0.z], l: [L0.x, L0.y, L0.z] },
      { t: tStraight + 0.3, p: [1.6, 2.1, 30.2], l: [2.7, 1.75, 18], ease: "sine" },
      { t: t1974 - 0.3, p: [-4.6, 2.55, 37.6], l: [-9.6, 1.5, 28], arc: 0.6 },
      { t: tPause - 0.4, p: [-5.3, 2.3, 36.2], l: [-9.6, 1.55, 28], ease: "sine" },
      { t: tAsil - 0.2, p: [-5.9, 2.2, 35.4], l: [-9.6, 1.5, 28.2], ease: "sine" },
      { t: tAbout + 0.2, p: [17.6, 3.1, 47.5], l: [19.4, 1.8, 30.5], arc: 0.45 },
      { t: tResearch - 0.1, p: [18.2, 2.8, 44.2], l: [19.4, 1.5, 31], ease: "sine" },
      { t: tBiotech + 0.9, p: [15.5, 8.6, 61], l: [20.5, 0.9, 34], ease: "smooth" },
      { t: tLabs - 0.3, p: [0.5, 20, 66], l: [0.5, 5, 2], ease: "sine", arc: 0.3 },
      { t: tAgree + 0.2, p: [0.3, 23, 62], l: [0, 7.5, -22], ease: "sine" },
      { t: tIdea - 0.2, p: [5.6, 3.3, 28.2], l: [2.8, 2.0, 19.6], ease: "inOut", arc: 0.2 },
      { t: tChips + 0.3, p: [4.4, 2.0, 24.6], l: [2.9, 1.25, 19.8], ease: "sine" },
      { t: tTracked + 0.2, p: [5.6, 3.9, 30.0], l: [2.9, 1.15, 19.6], ease: "sine" },
      { t: tLimits - 0.1, p: [5.9, 4.2, 30.8], l: [2.9, 1.1, 19.6], ease: "sine" },
      { t: tSmall - 0.2, p: [7, 34, 108], l: [0, 9, -20], ease: "inOut", arc: 0.15 },
      { t: tChipVer - 0.4, p: [6, 35, 104], l: [0, 10, -26], ease: "sine" },
      { t: tUntested - 0.3, p: [7.6, 4.8, 31.5], l: [3.0, 1.4, 20], ease: "inOut", arc: 0.15 },
      { t: tSecure - 0.9, p: [7.9, 4.6, 30.6], l: [3.1, 1.5, 20], ease: "sine" },
      { t: T1, p: [8.2, 6.4, 29.4], l: up70([8.2, 6.4, 29.4]), ease: "sine" },
    ];

    // calibrate the first key so the road's horizon sits exactly at 55 % of frame height (carrier from s10's rope)
    { const tc = E.newCamera(); for (let it = 0; it < 4; it++) { E.applyCam(tc, E.camPath(KEYS, T0, { arc: 0.08, drift: 1, push: 0.25, seed: 11 }), 0.004 * Math.sin(T0 * 0.31));
        const y = E.project(V(0, 0, HORIZ_Z), tc).y; KEYS[0].l[1] -= ((y - 0.55 * E.H) / (E.H / 2)) * fovH * 16; } }

    // ---------- update ----------
    const tmpV = V(0, 0, 0);
    const update = (t) => {
      // --- camera ---
      const cam = E.camPath(KEYS, t, { arc: 0.08, drift: 1, push: 0.25, seed: 11 });
      E.applyCam(camera, cam, 0.004 * Math.sin(t * 0.31));
      sky.position.copy(camera.position);
      // sky: sun climbs, palette warms a little through the scene (s12 continues to full dawn)
      const kSky = 0.05 + 0.3 * smooth(T0, T1, t) + 0.08 * smooth(tResearch, tBiotech + 1, t) * (1 - smooth(tForAI, tLabs, t));
      skyU.k.value = kSky;
      const sunY = 4.2 + 9 * smooth(T0, T1, t) + 1.5 * smooth(tResearch, tBiotech, t);
      sun.position.set(SUN0.x, sunY, SUN0.z); sun.lookAt(camera.position); sun.rotation.z += t * 0.01;
      const sd = sun.position.clone().sub(camera.position).normalize(); skyU.sunDir.value.copy(sd);
      sunCore.material.color.set("#fff1d6").multiplyScalar(1.55 + 0.05 * Math.sin(t * 1.7));
      clouds.forEach((c, i) => { c.m.position.x = c.x0 + (t - 540) * c.v * (c.k ? 0.35 : 0.6); c.m.position.y = c.y0 + 0.3 * Math.sin(t * 0.3 + i); });
      birdData.forEach((b, i) => { const x = b.x + (t - 540) * 1.6; dummy.position.set(((x + 80) % 160) - 80, b.y + Math.sin(t * 0.7 + b.ph) * 0.8, b.z); dummy.rotation.set(0, 0, 0); const fl = 0.55 + 0.45 * Math.sin(t * 7 + b.ph);
        dummy.scale.set(b.s, b.s * fl, b.s); dummy.updateMatrix(); birds.setMatrixAt(i, dummy.matrix); }); birds.instanceMatrix.needsUpdate = true;
      // light warms to gold at the garden
      const gold = smooth(tResearch, tBiotech, t) * (1 - 0.6 * smooth(tForAI, tLabs, t));
      key.color.set("#ffd3a0").lerp(new THREE.Color("#ffbf66"), gold); key.intensity = 2.2 + 1.3 * gold + 0.05 * Math.sin(t * 1.3);
      hemi.intensity = 1.25 + 0.25 * gold;

      // --- lever assembly ---
      const drop = smooth(tBrake - 0.55, tBrake, t); const settle = t > tBrake ? Math.exp(-(t - tBrake) * 5) * Math.sin((t - tBrake) * 22) * 0.06 : 0;
      arm.position.y = (1 - drop) * 1.35 + settle; arm.rotation.z = (1 - drop) * 0.14 * Math.sin(t * 1.6) - 0.08 * drop + 0.012 * Math.sin(t * 0.8);
      const apex = V(0, 4.4, 0.15); const armTop = V(0, 1.74 + arm.position.y + 1.25, 0);
      const fold = smooth(tWeve + 1.6, tWeve + 3.0, t); gantry.rotation.x = -fold * 1.45; gantry.position.z = fold * -0.1;
      ropeA.visible = ropeB.visible = fold < 0.02; gantry.visible = fold < 0.98;
      ropeA.userData.set(apex, armTop); const hand0 = V(2.4, 1.55 + 0.1 * Math.sin(t * 2), 0.6); ropeB.userData.set(apex, hand0);
      workers.forEach((w, i) => { const pull = (1 - drop) * (i < 2 ? 1 : 0); const cheer = i === 1 ? smooth(tBrake + 0.25, tBrake + 0.8, t) * (1 - smooth(tStraight + 0.5, tWeve + 0.6, t)) : 0;
        const walk = smooth(tWeve + 3, tWeve + 3.6, t); w.position.x = [2.6, 3.3, -1.5][i] + (i === 2 ? -1 : 1) * Math.max(0, t - tWeve - 3) * 1.2;
        w.visible = t < tWeve + 2.4; w.userData.pose(t, { lean: i < 2 ? -0.4 * pull + 0.1 : 0.3 * (1 - drop), reach: i < 2 ? 0.75 * pull + 0.2 : 0.7 * (1 - drop) + 0.2, armUp: cheer * 0.6, walk, lookUp: i === 2 ? 0.25 * (1 - drop) : 0.1 }); });

      // --- 1974 lab ---
      const labUp = spring(lin(tWeve - 0.15, tWeve + 0.95, t)); labPop.rotation.x = -Math.PI / 2 * (1 - labUp) + 0.004 * Math.sin(t * 0.7) * labUp; labPop.visible = t > tWeve - 0.2;
      const lampK = smooth(tWeve + 0.2, tWeve + 1.0, t); lamps.forEach((l, i) => l.userData.setGlow(lampK * (1.6 + 0.05 * Math.sin(t * 9 + i * 2)))); labLight.intensity = lampK * 9 * (1 - smooth(tAsil + 1, tAsil + 3, t));
      const paused = smooth(tPause - 0.05, tPause + 0.1, t); // the hard accent: all pipettes down at once
      sci.forEach((s, i) => { const work = 0.5 + 0.12 * Math.sin(t * 3.1 + s.ph) * (1 - paused); s.f.userData.pose(t, { reach: lerp(work, 0.12, paused), lean: lerp(0.35, 0.05, paused), lookUp: paused * 0.15 * smooth(tPause + 0.3, tHeld, t) });
        s.pip.rotation.z = lerp(-0.2, 1.35, paused); s.pip.position.y = lerp(0, 0.05, paused); });
      // helix: rotates; splices on "splice" (halves part, new amber segment drops in, halves close)
      const part = smooth(tSplice - 0.1, tSplice + 0.35, t) * (1 - smooth(tSplice + 0.75, tSplice + 1.15, t)); const ins = smooth(tSplice + 0.2, tSplice + 0.8, t);
      const spin = t * 1.2 * (1 - 0.75 * paused) - paused * (t - tPause) * 0; const tw0 = 0.62;
      for (let i = 0; i < HN; i++) { const u = i / (HN - 1); const x = (u - 0.5) * 3.6 + (u < 0.5 ? -1 : 1) * part * 0.35; const a = u * Math.PI * 4 + spin;
        const y = Math.cos(a) * 0.22, z = Math.sin(a) * 0.22; const mid = Math.abs(u - 0.5) < 0.08; const hide = mid ? 1 - ins : 1;
        dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(hide); dummy.position.set(x, y, z); dummy.updateMatrix(); beads.setMatrixAt(2 * i, dummy.matrix);
        dummy.position.set(x, -y, -z); dummy.updateMatrix(); beads.setMatrixAt(2 * i + 1, dummy.matrix);
        dummy.position.set(x, 0, 0); dummy.rotation.set(a, 0, 0); dummy.scale.set(hide, 0.44, hide); dummy.updateMatrix(); rungs.setMatrixAt(i, dummy.matrix); }
      for (let k = 0; k < 8; k++) { const u = 0.44 + (k >> 1) * 0.04; const a = u * Math.PI * 4 + spin; const s = k & 1 ? -1 : 1; const y = s * Math.cos(a) * 0.22, z = s * Math.sin(a) * 0.22;
        dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(ins > 0 ? 1 : 0.0001); dummy.position.set((u - 0.5) * 3.6, y + (1 - ins) * 1.2, z); dummy.updateMatrix(); newBeads.setMatrixAt(k, dummy.matrix); }
      beads.instanceMatrix.needsUpdate = rungs.instanceMatrix.needsUpdate = newBeads.instanceMatrix.needsUpdate = true;
      helix.rotation.z = 0.04 * Math.sin(t * 0.6); helix.position.y = 2.15 + 0.05 * Math.sin(t * 0.9);

      // --- Asilomar ---
      hallLight.intensity = 6 * smooth(tAsil - 0.5, tAsil + 1, t) * (1 - 0.4 * smooth(tForAI, tLabs, t));
      guests.forEach((g, i) => g.userData.pose(t, { turn: 0, lookUp: 0.1 + 0.1 * Math.sin(t * 0.5 + i), reach: 0.15 + 0.08 * Math.sin(t * 0.9 + i * 2) }));
      waves.forEach((w) => { w.m.position.x = w.x0 + Math.sin(t * 0.35 + w.i) * 0.8; w.m.position.y = 0.06 * Math.sin(t * 0.9 + w.i * 1.3); }); waves.glit.material.opacity = 0.3 + 0.08 * Math.sin(t * 2.3);
      const boxT = [tMatching, tExperiment, tLevel, tContain];
      const bloomK = smooth(tResearch - 0.1, tGrew + 0.2, t);
      boxes.forEach((b, i) => { const up = spring(lin(boxT[i] - 0.2, boxT[i] + 0.8, t)); const open = smooth(tResearch + i * 0.12, tResearch + 0.9 + i * 0.12, t);
        b.g.visible = t > boxT[i] - 0.25; const wk = up * (1 - open);
        b.W[0].rotation.x = Math.PI / 2 * (1 - wk) + 0.01 * Math.sin(t + i); b.W[1].rotation.x = -Math.PI / 2 * (1 - clamp(up * 1.4, 0, 1) * (1 - open));
        b.W[2].rotation.z = Math.PI / 2 * (1 - clamp(up * 1.2, 0, 1) * (1 - open)); b.W[3].rotation.z = -Math.PI / 2 * (1 - clamp(up * 1.2, 0, 1) * (1 - open));
        if (b.lid) { const closeK = smooth(boxT[i] + 0.35, boxT[i] + 0.9, t); const closed = [0, 0.55, 1, 1][i] * closeK; b.lid.rotation.x = -Math.PI * 0.9 * (1 - closed) * up - open * 0.0;
          b.lid.visible = up > 0.6 && open < 0.6; b.lid.position.y = b.h * up + 0.05; }
        if (b.lamp) { b.lamp.userData.setGlow(up * (1 - open) * (1.2 + 0.2 * Math.sin(t * 3))); b.lamp.visible = open < 0.5; } });
      // garden growth
      const c0 = new THREE.Color();
      for (let i = 0; i < NPl; i++) { const p = plants[i]; const gk = spring(lin(p.t0, p.t0 + 1.0, t)); const g = Math.max(0.0001, gk);
        const sway = 0.06 * Math.sin(t * 1.4 + p.ph) * gk + p.lean; const H = p.h * g * p.s;
        dummy.position.set(p.x, 0, p.z); dummy.rotation.set(0, 0, sway); dummy.scale.set(1, H, 1); dummy.updateMatrix(); stems.setMatrixAt(i, dummy.matrix);
        for (let k = 0; k < 2; k++) { const lk = clamp(gk * 1.3 - 0.2 - k * 0.15, 0.0001, 1.1); const hy = H * (0.35 + k * 0.28);
          dummy.position.set(p.x - Math.sin(sway) * hy, Math.cos(sway) * hy, p.z + 0.03); dummy.rotation.set(0, 0, (k ? Math.PI - 0.5 : 0.5) + sway + 0.1 * Math.sin(t * 2 + p.ph + k)); dummy.scale.setScalar(lk * p.s * 1.25); dummy.updateMatrix(); leaves.setMatrixAt(2 * i + k, dummy.matrix); }
        const fk = clamp((gk - 0.55) / 0.45, 0.0001, 1.08); dummy.position.set(p.x - Math.sin(sway) * H, Math.cos(sway) * H, p.z + 0.04); dummy.rotation.set(0, 0, t * 0.2 + p.ph); dummy.scale.setScalar(fk * p.s); dummy.updateMatrix(); flowers.setMatrixAt(i, dummy.matrix); }
      for (let i = 0; i < BN; i++) { const b = bott[i]; const k = Math.max(0.0001, spring(lin(b.t0, b.t0 + 0.8, t))); dummy.position.set(b.x, 0, b.z); dummy.rotation.set(0, b.ry, 0.03 * Math.sin(t + i)); dummy.scale.setScalar(k * b.s * 0.9); dummy.updateMatrix(); bottles.setMatrixAt(i, dummy.matrix);
        dummy.position.set(b.x, 0.5 * k * b.s * 0.9, b.z); dummy.translateZ(0.1 * k * b.s * 0.9); dummy.updateMatrix(); caps.setMatrixAt(i, dummy.matrix); }
      [stems, leaves, flowers, bottles, caps].forEach((m) => (m.instanceMatrix.needsUpdate = true));
      flowerMat.emissiveIntensity = 0.25 * bloomK + 0.04 * Math.sin(t * 2); bottleMat.emissiveIntensity = 0.35 * bloomK;
      gardenLight.intensity = 26 * bloomK * (1 - 0.5 * smooth(tForAI, tLabs, t)) * (1 + 0.04 * Math.sin(t * 2.3));

      // --- split roads + towers ---
      branches.forEach((b, i) => { const k = sineInOut(lin(b.t0, b.t0 + 1.9, t)); b.rb.userData.reveal(k); b.rb.visible = k > 0;
        const race = smooth(tTrillion - 0.3, tTrillion + 0.5, t) * (1 - smooth(tChipVer, tUntested, t)); const flow = (t - tTrillion) * 9 * race + (t - T0) * 0.25;
        let n = 0; for (let s = 2 + (flow % 3.2 + 3.2) % 3.2; s < b.len * k && n < 60; s += 3.2) { const [x, z, a] = samplePath(b, s); dummy.position.set(x, 0.07, z); dummy.rotation.set(0, a, 0); dummy.scale.set(1, 1, 1); dummy.updateMatrix(); b.dm.setMatrixAt(n++, dummy.matrix); }
        b.dm.count = n; b.dm.instanceMatrix.needsUpdate = true; });
      towers.forEach((tw, i) => { const t0 = branches[i].t0 + 1.4; const up = spring(lin(t0, t0 + 1.3, t)); tw.g.rotation.x = -Math.PI / 2 * (1 - up) + 0.003 * Math.sin(t * 0.5 + i) * up; tw.g.visible = t > t0 - 0.05;
        const race = smooth(tTrillion - 0.2, tTrillion + 0.6, t);
        const fl = tw.t.userData.floors.length; for (let f = 0; f < fl; f++) { const lit = smooth(t0 + 0.6 + f * 0.06, t0 + 0.9 + f * 0.06, t); const flick = 0.85 + 0.15 * Math.sin(t * 3 + f * 1.7 + i);
          const runner = race * Math.max(0, Math.sin((t - tTrillion) * 6 - f * 0.6 + i)) * 0.9; tw.t.userData.setFloor(f, lit * 0.55 * flick + runner, C.cyan); }
        tw.pen.rotation.y = 0.25 * Math.sin(t * 2.2 + i); tw.pen.scale.x = 1 + 0.06 * Math.sin(t * 3.1 + i); });
      reps.forEach((r, i) => { const k = smooth(r.t0, r.t0 + 1.5, t); r.f.visible = t > tLabs; r.f.position.lerpVectors(r.from, r.to, k);
        const walking = k > 0 && k < 1 ? 1 : 0; const reachK = smooth(r.t0 + 1.4, r.t0 + 2.2, t);
        r.f.userData.pose(t, { walk: walking, armUp: 0.42 * reachK + 0.02 * Math.sin(t * 1.2 + i), reach: 0.6 * reachK, lookUp: 0.35 * reachK, lean: -0.1 * reachK }); });
      // lever: once hands are on it, it eases back a notch (the shared brake)
      pivot.rotation.z = -0.05 * smooth(tStopped - 0.2, tStopped + 0.6, t) + 0.01 * Math.sin(t * 0.9);
      globe.rotation.y = t * 0.06; meridian.rotation.y = 0.2 + t * 0.03;

      // --- chip, beacons, pings ---
      const chipOn = smooth(tChips - 0.05, tChips + 0.2, t); const flick = t > tChips - 0.45 && t < tChips ? (Math.sin(t * 60) > 0.3 ? 0.6 : 0.1) : 0;
      const spoofed = smooth(tUntested - 0.05, tUntested + 0.15, t); const unsure = smooth(tSay - 0.2, tSay + 0.4, t);
      const chipJit = unsure * (Math.sin(t * 23) > 0.6 ? 0.5 : 0);
      chipCore.userData.setGlow(0.08 + Math.max(flick, chipOn * (2.4 + 0.3 * Math.sin(t * 4))) * (1 - chipJit) + spoofed * 0.0);
      chipLight.intensity = chipOn * 3.2 * (1 - chipJit); chip.position.z = 0.73 + 0.06 * spring(lin(tPhysical, tPhysical + 0.6, t)) * (1 - smooth(tTracked, tTracked + 1, t));
      chip.scale.setScalar(1 + 0.25 * spring(lin(tPhysical, tPhysical + 0.6, t)) * (1 - smooth(tTracked, tTracked + 1, t)));
      BEA.forEach((b, i) => { const up = spring(lin(b.t0, b.t0 + 0.9, t)); b.g.rotation.x = -Math.PI / 2 * (1 - up); b.g.visible = t > b.t0 - 0.05; });
      const proveK = smooth(tProve - 0.05, tProve + 0.9, t);
      ringG.setDrawRange(0, Math.round(proveK * 96) * 6); ring.material.opacity = 0.85 * (1 - 0.5 * unsure * (Math.sin(t * 17) > 0 ? 1 : 0)) * (1 - 0.6 * spoofed);
      pings.forEach((p, i) => { const b = BEA[i]; const start = tResearchers + 0.1 + i * 0.22; const per = 1.7;
        const lineOn = smooth(start, start + 0.4, t); p.line.material.opacity = 0.35 * lineOn * (i === SPOOF ? 1 - 0.7 * spoofed : 1);
        // outgoing ping: periodic
        let ph = t < start ? -1 : ((t - start) % per) / 0.75; const cyc = Math.floor((t - start) / per);
        p.dot.visible = ph >= 0 && ph <= 1 && t < T1 - 0.2; if (p.dot.visible) { const pt = p.curve.getPoint(ph); if (i === SPOOF && spoofed > 0) pt.lerp(V(SHPOS.x, 1.62, SHPOS.z), ph); p.dot.position.copy(pt); p.dot.scale.setScalar(1 + 0.5 * Math.sin(ph * Math.PI)); }
        p.dot.material = i === SPOOF && spoofed > 0.5 && ph > 0.6 ? fakeMat : pingMat;
        // arrival flash
        const arrive = ph > 0.85 && ph <= 1.4 ? 1 - (ph - 0.85) / 0.55 : 0; const proveFlash = proveK > 0 && proveK < 1 ? 1 : 0;
        let glow = up(b) * (0.45 + 1.8 * arrive + 1.2 * proveFlash); if (i === SPOOF) glow *= 1 - 0.85 * spoofed; glow *= 1 - unsure * (Math.sin(t * 13 + i * 2.1) > 0.2 ? 0.75 : 0);
        b.head.material.color.set(C.cyan).multiplyScalar(0.15 + glow);
        // return pings at "prove where they are", and the fake return from the shadow
        const rb = lin(tProve, tProve + 0.8, t); p.back.visible = rb > 0 && rb < 1; if (p.back.visible) p.back.position.copy(p.curve.getPoint(1 - rb));
        p.back.material = pingMat;
        if (i === SPOOF && t > tUntested + 0.25) { const fr = ((t - tUntested - 0.25) % 1.8) / 0.8; p.back.visible = fr <= 1 && t < T1 - 0.2; if (p.back.visible) { p.back.material = fakeMat; p.back.position.copy(V(SHPOS.x, 1.62, SHPOS.z).lerp(GC.clone().add(V(0, 0, 0.75)), fr)); p.back.position.y += Math.sin(fr * Math.PI) * 1.0; } } });
      function up(b) { return clamp(lin(b.t0, b.t0 + 0.6, t), 0, 1); }
      // the shadow slides in from behind the spoofed beacon
      shadow.visible = t > tChipVer - 0.2; const sk = smooth(tChipVer - 0.2, tUntested - 0.1, t);
      shadow.position.set(lerp(spoofB.top.x + 1.2, SHPOS.x, sk), 0, lerp(spoofB.top.z - 1.2, SHPOS.z, sk)); shadow.lookAt(camera.position.x, 0, camera.position.z);
      shadow.scale.set(1.25 + 0.03 * Math.sin(t * 2), 1.25 + 0.05 * Math.sin(t * 1.3), 1); shadow.userData.eye.material.color.set(spoofed > 0 ? "#3a2a50" : "#1a1226");

      doms.forEach((d) => d.update(t));
      // post: bloom swells with the garden and the chip
      post.bloom = 0.42 + 0.35 * bloomK * (1 - 0.6 * smooth(tForAI, tLabs, t)) + 0.15 * chipOn * (1 - smooth(tLimits, tSmall, t));
    };
    const post = { bloom: 0.42, exposure: 1.08 };
    return { scene, camera, post, update };
  },
};
