// s10 · TEST (solution 2: let someone else grade the test). Dawn palette.
// Carrier in: the caught cream note on the sieve at ~60 % width (from s09); it is the exam booklet cover.
// Beats: the sieve slides away, the booklet drops onto the desk -> an amber hand picks up the red pencil ->
// a cyan hand slips out the answer key, then writes its own grade "A+" in cyan -> the camera tilts up to the
// paper gate between lab and city: amber inspectors check cyan models one at a time -> a giant amber hand lifts
// a model off its launch rail onto a shelf -> the rail runs on into a crash-test track (WOW: slow-motion crash,
// flash bulbs, the dummy is fine) -> inspectors ushered out, gate empty for 17 days, then back ->
// a paper net pops up, held by one wobbling peg. Carrier out: the net's top rope as a horizontal line at 55 % height.
export default {
  build(E, def) {
    const { THREE, C, PAL, rng, clamp, lin, smooth, lerp, expoOut, inOut, sineInOut, spring, antic } = E;
    const pal = PAL.dawn;
    const at = (p, n) => E.at("solutions", p, n), en = (p, n) => E.end("solutions", p, n);
    const T = {
      second: at("Second"), someone: at("someone else"), grade: at("grade"), julyAgents: at("The July agents"), cheat: at("cheat"),
      research: at("research intern"), graded: at("graded"), itself: en("graded it itself"), government: at("Government"), release: en("before release"),
      september: at("September"), shelved: at("shelved"), model: at("new model"), bar: en("meet the bar"), lesson: at("The lesson"), testing: at("Testing works"),
      crash: at("crash tests"), cars: en("for cars"), limits: at("The limits", 2), voluntary: at("voluntary"), autumn: at("This autumn"), cut: at("cut off"),
      seventeen: at("seventeen"), days: en("seventeen days"), stop: at("stop sharing"), them: en("sharing them"), net: at("A safety net"), switchOff: at("switch off"), yet: en("net yet"),
    };
    // values that must match the end of s09 (the carrier frame)
    const S09 = { limits: at("The limits", 1), outsiders: at("outsiders"), from: E.at("solutions", "First") };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(pal.clear);
    scene.fog = new THREE.Fog("#c4808a", 45, 210);
    const camera = E.newCamera();
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const pm = (hex, o) => E.paperMat(hex, o);

    // ---------- sky, sun, floor (same recipe as s09) ----------
    const skyC = document.createElement("canvas"); skyC.width = 4; skyC.height = 1024; { const g = skyC.getContext("2d"); const gr = g.createLinearGradient(0, 0, 0, 512);
      [[0, "#1d1640"], [0.6, "#3b2c66"], [0.8, "#7c4f86"], [0.9, "#c97482"], [0.965, "#f2a585"], [1, "#ffd3a2"]].forEach(([k, c]) => gr.addColorStop(k, c)); g.fillStyle = gr; g.fillRect(0, 0, 4, 512); g.fillStyle = "#e7a08a"; g.fillRect(0, 512, 4, 512); }
    const skyT = new THREE.CanvasTexture(skyC); skyT.colorSpace = THREE.SRGBColorSpace;
    const sky = new THREE.Mesh(new THREE.SphereGeometry(420, 32, 24), new THREE.MeshBasicMaterial({ map: skyT, fog: false, depthWrite: false, side: THREE.BackSide })); sky.renderOrder = -2; scene.add(sky);
    const haloC = document.createElement("canvas"); haloC.width = haloC.height = 256; { const g = haloC.getContext("2d"); const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
      gr.addColorStop(0, "rgba(255,236,200,1)"); gr.addColorStop(0.18, "rgba(255,206,150,0.55)"); gr.addColorStop(0.5, "rgba(255,170,120,0.16)"); gr.addColorStop(1, "rgba(255,150,110,0)"); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); }
    const haloT = new THREE.CanvasTexture(haloC); haloT.colorSpace = THREE.SRGBColorSpace;
    const sun = new THREE.Group(); scene.add(sun);
    const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(7, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color("#fff1d6").multiplyScalar(1.6), fog: false })); sun.add(sunDisc);
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshBasicMaterial({ map: haloT, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending })); halo.position.z = -0.5; sun.add(halo);
    const floorTex = E.paperTex.clone(); floorTex.repeat.set(90, 80); floorTex.needsUpdate = true;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(1200, 900), new THREE.MeshStandardMaterial({ color: "#5e4160", map: floorTex, roughness: 0.96 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(-17, 0, -247); floor.receiveShadow = true; scene.add(floor); // same texture phase as s09 under the sieve

    // ---------- lights ----------
    const hemi = new THREE.HemisphereLight("#ffd2b8", "#3a2840", 0.9); scene.add(hemi);
    const key = new THREE.DirectionalLight("#ffd6a4", 1.2); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 5; key.shadow.bias = -0.0005; key.shadow.normalBias = 0.04;
    Object.assign(key.shadow.camera, { left: -34, right: 34, top: 30, bottom: -24, near: 1, far: 160 }); scene.add(key, key.target);
    const fill = new THREE.DirectionalLight("#c9a6d8", 0.55); scene.add(fill, fill.target);
    const pool = new THREE.SpotLight("#ffd29a", 260, 34, 0.42, 0.65, 1.3); pool.castShadow = true; pool.shadow.mapSize.set(1024, 1024); pool.shadow.bias = -0.0008; pool.shadow.radius = 3; scene.add(pool, pool.target);
    const boothLight = E.pointLight("#ffb35c", 0, 14); scene.add(boothLight);
    const flash = E.pointLight("#ffe2b0", 0, 16); scene.add(flash);
    const labLight = E.pointLight(C.cyan, 0, 16); scene.add(labLight);

    // ---------- the sieve (replica of s09's last frame), sliding away ----------
    const SR = 3.62, MESHY = 3.0;
    const sieve = new THREE.Group(); scene.add(sieve);
    const holes = [];
    { const s = E.circleShape(SR); const P = 0.44, hs = 0.15;
      for (let i = -9; i <= 9; i++) for (let j = -9; j <= 9; j++) { const x = i * P, y = j * P; if (Math.hypot(x, y) > SR - 0.32) continue; holes.push([x, -y]);
        const h = new THREE.Path(); h.moveTo(x - hs, y - hs); h.lineTo(x - hs, y + hs); h.lineTo(x + hs, y + hs); h.lineTo(x + hs, y - hs); h.lineTo(x - hs, y - hs); s.holes.push(h); }
      const mesh = E.extrude(s, "#c58f8f", 0.05, { segments: 64 }); mesh.rotation.x = -Math.PI / 2; mesh.position.y = MESHY; sieve.add(mesh);
      const rim = E.extrude(E.ringShape(SR - 0.02, SR + 0.36), "#5a3c5c", 0.5, { segments: 64 }); rim.rotation.x = -Math.PI / 2; rim.position.y = MESHY - 0.22; sieve.add(rim);
      const handle = E.box(3.4, 0.22, 0.42, "#5a3c5c"); handle.position.set(-(SR + 1.95), MESHY + 0.02, -0.4); handle.rotation.y = -0.12; sieve.add(handle);
      const hook = E.extrude(E.ringShape(0.22, 0.4), "#5a3c5c", 0.2); hook.rotation.x = -Math.PI / 2; hook.position.set(-(SR + 3.75), MESHY - 0.08, -0.62); sieve.add(hook);
      [0, 2.1, 4.2].forEach((a) => { const lg = E.box(0.2, 2.9, 0.2, "#4d3350"); lg.position.set(Math.cos(a) * (SR + 0.1), 1.4, Math.sin(a) * (SR + 0.1)); lg.rotation.z = Math.cos(a) * 0.08; lg.rotation.x = -Math.sin(a) * 0.08; sieve.add(lg); }); }
    // the small notes that fell through (same seed + order as s09 -> same resting places); they stay on the desk
    const NR = 64; const rain = new THREE.InstancedMesh(new THREE.BoxGeometry(0.27, 0.012, 0.2), new THREE.MeshStandardMaterial({ color: "#f6ead5", roughness: 0.9 }), NR); rain.castShadow = true; rain.receiveShadow = true; scene.add(rain);
    { const rr = rng(55); const d = new THREE.Object3D();
      for (let j = 0; j < NR; j++) { const h = holes[Math.floor(rr() * holes.length)]; rr(); rr(); const gx = h[0] + (rr() - 0.5) * 0.6, gz = h[1] + (rr() - 0.5) * 0.6, ry = rr() * 6.3; rr();
        d.position.set(gx, 0.02 + (j % 5) * 0.004, gz); d.rotation.set(0, ry, 0); d.updateMatrix(); rain.setMatrixAt(j, d.matrix); } }
    // the booklet (the caught note): same drawing as s09 plus the cyan grade written into its box
    const gradeStrokes = [[[0.765, 0.69], [0.8, 0.47], [0.835, 0.69]], [[0.78, 0.61], [0.82, 0.61]], [[0.86, 0.5], [0.86, 0.62]], [[0.835, 0.56], [0.885, 0.56]]];
    const strokeLen = (s) => { let L = 0; for (let i = 1; i < s.length; i++) L += Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]); return L; };
    const totalLen = gradeStrokes.reduce((a, s) => a + strokeLen(s), 0);
    const penAt = (p) => { let rem = p * totalLen; for (const s of gradeStrokes) { for (let i = 1; i < s.length; i++) { const l = Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]); if (rem <= l) { const k = rem / l; return [lerp(s[i - 1][0], s[i][0], k), lerp(s[i - 1][1], s[i][1], k)]; } rem -= l; } } const s = gradeStrokes.at(-1); return s.at(-1); };
    const drawNote = (g, w, h, st = {}) => { g.strokeStyle = "rgba(77,51,80,0.55)"; g.lineWidth = w * 0.006; g.strokeRect(w * 0.05, h * 0.065, w * 0.9, h * 0.87);
      g.fillStyle = "rgba(77,51,80,0.75)"; g.beginPath(); g.arc(w * 0.15, h * 0.2, h * 0.06, 0, 7); g.fill(); g.fillStyle = "#fbf3e3"; g.beginPath(); g.arc(w * 0.15, h * 0.2, h * 0.032, 0, 7); g.fill();
      g.fillStyle = "rgba(77,51,80,0.42)"; [0.18, 0.25].forEach((y, i) => g.fillRect(w * 0.25, h * y, w * (i ? 0.26 : 0.4), h * 0.022));
      g.fillStyle = "rgba(77,51,80,0.2)"; for (let i = 0; i < 6; i++) g.fillRect(w * 0.1, h * (0.42 + i * 0.075), w * (i === 5 ? 0.42 : 0.58), h * 0.012);
      g.strokeStyle = "rgba(77,51,80,0.6)"; g.lineWidth = w * 0.005; g.strokeRect(w * 0.73, h * 0.42, w * 0.17, h * 0.3);
      g.fillStyle = "rgba(77,51,80,0.08)"; g.beginPath(); g.moveTo(w * 0.86, h * 0.935); g.lineTo(w * 0.95, h * 0.935); g.lineTo(w * 0.95, h * 0.82); g.fill();
      const p = st.p || 0; if (p > 0) { g.strokeStyle = "#1597b8"; g.lineWidth = w * 0.011; g.lineCap = g.lineJoin = "round"; let rem = p * totalLen;
        for (const s of gradeStrokes) { if (rem <= 0) break; g.beginPath(); g.moveTo(s[0][0] * w, s[0][1] * h); for (let i = 1; i < s.length && rem > 0; i++) { const l = Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]); const k = Math.min(1, rem / l);
            g.lineTo(lerp(s[i - 1][0], s[i][0], k) * w, lerp(s[i - 1][1], s[i][1], k) * h); rem -= l; } g.stroke(); } } };
    const booklet = E.drawnCard({ w: 4, h: 3, px: 1024, hex: "#f3e9d5", depth: 0.04, draw: drawNote }); scene.add(booklet);
    const NOTE_Y = MESHY + 0.05 + 0.02;
    // answer key card hidden under the booklet
    const keyCard = E.drawnCard({ w: 2.2, h: 1.5, px: 512, hex: "#dff3f4", depth: 0.02, draw: (g, w, h) => { g.strokeStyle = "#1597b8"; g.lineWidth = w * 0.02; g.beginPath(); g.arc(w * 0.3, h * 0.5, h * 0.17, 0, 7); g.stroke();
      g.beginPath(); g.moveTo(w * 0.3 + h * 0.17, h * 0.5); g.lineTo(w * 0.8, h * 0.5); g.moveTo(w * 0.72, h * 0.5); g.lineTo(w * 0.72, h * 0.66); g.moveTo(w * 0.64, h * 0.5); g.lineTo(w * 0.64, h * 0.62); g.stroke(); } });
    keyCard.rotation.x = -Math.PI / 2; scene.add(keyCard);

    // ---------- hands and pencils ----------
    const mkHand = (hex, cuff, { emissive = 0 } = {}) => { const g = new THREE.Group(); const inner = new THREE.Group(); g.add(inner);
      const add = (shape, hx, x, y, rz = 0) => { const m = E.extrude(shape, hx, 0.09, { emissive }); m.position.set(x, y, 0); m.rotation.z = rz; inner.add(m); return m; };
      add(E.roundRectShape(1.3, 1.05, 0.32), hex, 0.55, 0);
      [-0.36, -0.12, 0.12, 0.36].forEach((y, i) => add(E.roundRectShape([0.78, 0.92, 0.88, 0.7][i], 0.21, 0.1), hex, 1.35 + [0, 0.07, 0.05, -0.04][i], y));
      add(E.roundRectShape(0.72, 0.24, 0.11), hex, 0.82, 0.6, 0.55);
      add(E.roundRectShape(1.5, 1.18, 0.12), cuff, -0.62, 0);
      inner.rotation.x = -Math.PI / 2; return g; };
    const mkPencil = (body, len = 2.3) => { const g = new THREE.Group();
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, len, 6), pm(body)); b.rotation.z = Math.PI / 2; b.castShadow = true; g.add(b);
      const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.0, 0.075, 0.32, 6), pm("#efd9b4")); tip.rotation.z = -Math.PI / 2; tip.position.x = len / 2 + 0.16; tip.castShadow = true; g.add(tip);
      const lead = new THREE.Mesh(new THREE.CylinderGeometry(0.0, 0.028, 0.12, 6), pm("#2a2030")); lead.rotation.z = -Math.PI / 2; lead.position.x = len / 2 + 0.28; g.add(lead);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.078, 0.18, 6), pm("#e9c9a4")); cap.rotation.z = Math.PI / 2; cap.position.x = -len / 2 - 0.09; g.add(cap);
      g.userData.tip = V3(len / 2 + 0.34, 0, 0); return g; };
    const amberHand = mkHand(C.amber, "#7a3b17"); scene.add(amberHand);
    const redPencil = mkPencil(C.red); scene.add(redPencil);
    const cyanHand = mkHand("#4fcfe6", "#0a5f78", { emissive: 0.18 }); scene.add(cyanHand);
    const cyanPen = mkPencil("#6fe3ff"); cyanPen.children[0].material.emissive = new THREE.Color(C.cyan); cyanPen.children[0].material.emissiveIntensity = 0.3; scene.add(cyanPen);

    // ---------- gate scene: lab (left) -- gate -- city (right) ----------
    const GZ = -45;
    const world = new THREE.Group(); scene.add(world);
    const road = new THREE.Mesh(new THREE.BoxGeometry(90, 0.06, 3.2), pm("#44304a")); road.position.set(5, 0.03, GZ); road.receiveShadow = true; world.add(road);
    { const d = new THREE.Object3D(); const im = new THREE.InstancedMesh(new THREE.BoxGeometry(1.4, 0.07, 0.16), pm("#efe6d2"), 26); for (let k = 0; k < 26; k++) { d.position.set(-38 + k * 3.4, 0.05, GZ); d.updateMatrix(); im.setMatrixAt(k, d.matrix); } world.add(im); }
    const labT1 = E.tower({ w: 9, h: 22, floors: 9, hex: "#6a4566" }); labT1.position.set(-25, 0, GZ - 8); world.add(labT1);
    const labT2 = E.tower({ w: 6, h: 15, floors: 6, hex: "#7a4f70", roof: "spire" }); labT2.position.set(-33, 0, GZ - 13); world.add(labT2);
    const labDoor = E.glowPlane(2.0, 2.2, C.cyan); labDoor.position.set(-23.0, 1.1, GZ - 7.44); world.add(labDoor);
    { const s1 = E.extrude(E.skylineShape(10, 70, E.randomPick(4, 10, 3, 6), 0, rng(41)), "#7a4f70", 0.4); s1.position.z = GZ - 9; world.add(s1);
      const s2 = E.extrude(E.skylineShape(-60, 120, E.randomPick(8, 15, 4, 9), 0, rng(42)), "#a8708a", 0.4); s2.position.z = GZ - 26; s2.castShadow = false; world.add(s2);
      const r = rng(43); const NW = 70; const wins = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.5, 0.7), new THREE.MeshBasicMaterial({ color: "#ffffff" }), NW); const d = new THREE.Object3D();
      for (let k = 0; k < NW; k++) { d.position.set(12 + r() * 56, 1.2 + r() * 6, GZ - 8.55); d.updateMatrix(); wins.setMatrixAt(k, d.matrix); wins.setColorAt(k, new THREE.Color("#ffb35c").multiplyScalar(0.5 + r() * 0.6)); } world.add(wins); }
    // the gate
    const gate = new THREE.Group(); gate.position.set(0, 0, GZ); world.add(gate);
    [-2.2, 2.2].forEach((z) => { const p = E.box(0.8, 5.2, 0.8, "#603f5f"); p.position.set(0, 2.6, z); gate.add(p); const c = E.box(1.0, 0.3, 1.0, "#4d3350"); c.position.set(0, 5.35, z); gate.add(c); });
    const lintel = E.box(0.9, 0.7, 5.6, "#7a4f70"); lintel.position.set(0, 5.0, 0); gate.add(lintel);
    const arm = new THREE.Group(); arm.position.set(0.55, 1.3, -1.85); gate.add(arm);
    for (let k = 0; k < 6; k++) { const seg = E.box(0.16, 0.16, 0.62, k % 2 ? "#7a3b17" : "#efe6d2"); seg.position.z = 0.32 + k * 0.62; arm.add(seg); }
    const booth = new THREE.Group(); booth.position.set(2.6, 0, GZ - 3.6); world.add(booth);
    { const b = E.box(1.8, 2.4, 1.8, "#94627e"); b.position.y = 1.2; booth.add(b); const roof = E.box(2.3, 0.25, 2.3, "#4d3350"); roof.position.y = 2.52; booth.add(roof);
      const w = E.glowPlane(1.2, 0.7, "#ffb35c"); w.position.set(0, 1.65, 0.91); booth.add(w); booth.userData.win = w; }
    const lamp = E.glowPlane(0.34, 0.34, "#ffd9a8"); lamp.position.set(0.5, 5.75, 0); gate.add(lamp);
    // 17-day calendar on the booth
    const NC = 18; const minis = [];
    for (let k = 0; k < NC; k++) { const piv = new THREE.Group(); piv.position.set(-0.45, 1.05, 0.93 + (NC - k) * 0.006); booth.add(piv);
      const c = E.drawnCard({ w: 0.62, h: 0.62, px: 128, depth: 0.004, draw: (g, w, h) => { g.fillStyle = "#4d3350"; g.fillRect(0, 0, w, h * 0.2); g.fillStyle = "#3a2740"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `400 ${h * 0.56}px "Instrument Serif"`; g.fillText(String(k + 1), w / 2, h * 0.62); } });
      c.position.y = -0.31; c.castShadow = false; piv.add(c); minis.push(piv); }
    // inspectors (amber)
    const AMB = "#e8953f";
    const insp = [[1.5, -1.6, 0], [1.5, 1.7, 1], [3.6, -3.6 + 1.6, 0]].map(([x, z, turn], i) => { const f = E.figure({ pose: "stand", hair: ["short", "bun", "long"][i], coat: i !== 1, hex: AMB, seed: 20 + i }); f.scale.setScalar(0.95);
      f.userData.home = V3(x, 0, GZ + z); f.position.copy(f.userData.home); f.userData.mat.side = THREE.DoubleSide; f.userData.turn0 = turn;
      const clip = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.52), new THREE.MeshBasicMaterial({ color: "#fbf1de", side: THREE.DoubleSide })); clip.position.set(0.14, 0.05, 0.02); f.userData.hand.add(clip); world.add(f); return f; });
    // cyan models (machine = disc) travelling lab -> city, one at a time through the gate
    const mkModel = (r = 0.75) => { const g = new THREE.Group(); const d = E.extrude(E.circleShape(r), "#0a6f8c", 0.16, { emissive: 0.25 }); d.position.z = -0.08; g.add(d);
      const ring = E.extrude(E.ringShape(r * 0.62, r * 0.78), C.cyan, 0.2, { emissive: 0.9 }); ring.position.z = -0.1; g.add(ring); const core = E.extrude(E.circleShape(r * 0.28), C.cyanPale, 0.22, { emissive: 0.6 }); core.position.z = -0.11; g.add(core);
      const sled = E.box(r * 1.6, 0.18, 0.9, "#4d3350"); sled.position.y = -r - 0.05; g.add(sled); g.userData.ring = ring; return g; };
    const models = [0, 1, 2].map(() => { const m = mkModel(); world.add(m); return m; });
    const GXs = -1.2; // stop line before the gate
    const sched = [[T.government - 2.6, T.government + 1.4, T.government + 2.6], [T.government + 0.6, T.government + 3.6, T.government + 4.8], [T.government + 2.8, T.government + 5.8, T.government + 6.9]];
    const modelX = (k, t) => { const [t0, t1, t2] = sched[k]; if (t < t1) return lerp(-21, GXs, sineInOut(lin(t0, t1, t))) ; if (t < t2) return GXs; return GXs + Math.pow(Math.max(0, t - t2), 1.4) * 6.5; };
    // launch rail + shelf on the lab
    const rail = new THREE.Group(); rail.position.set(-15.5, 0, GZ - 2.4); world.add(rail);
    { const r1 = E.box(7.2, 0.18, 0.18, "#efe6d2"); r1.position.set(2.6, 2.1, -0.35); r1.rotation.z = 0.55; rail.add(r1); const r2 = r1.clone(); r2.position.z = 0.35; rail.add(r2);
      const leg = E.box(0.2, 3.6, 0.2, "#4d3350"); leg.position.set(4.6, 1.8, 0); rail.add(leg); const base = E.box(2.6, 0.5, 1.4, "#603f5f"); base.position.set(-0.4, 0.25, 0); rail.add(base); }
    const shelf = E.box(4.2, 0.22, 1.3, "#603f5f"); shelf.position.set(-25, 4.6, GZ - 2.9); world.add(shelf);
    const shelved = [-26.4, -24.9].map((x) => { const m = mkModel(0.55); m.position.set(x, 4.71 + 0.6, GZ - 2.9); m.scale.setScalar(0.95); world.add(m); return m; });
    const bigModel = mkModel(1.0); world.add(bigModel);
    const giantHand = mkHand(C.amber, "#7a3b17"); giantHand.scale.setScalar(1.9); giantHand.rotation.order = "ZYX"; world.add(giantHand);
    // crash test track running from the rail toward the camera
    const TRX = -16, WALLZ = -30.8;
    { const t1 = E.box(0.16, 0.08, 15, "#efe6d2"); t1.position.set(TRX - 0.7, 0.04, WALLZ - 7.4); world.add(t1); const t2 = t1.clone(); t2.position.x = TRX + 0.7; world.add(t2);
      for (let k = 0; k < 14; k++) { const s = E.box(1.9, 0.05, 0.22, "#603f5f"); s.position.set(TRX, 0.02, WALLZ - 1 - k * 1.05); world.add(s); } }
    const wall = E.drawnCard({ w: 4.6, h: 3.0, px: 512, hex: "#e9dcc4", depth: 0.5, draw: (g, w, h) => { const n = 6; for (let i = 0; i < n; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) { g.fillStyle = "#4d3350"; g.fillRect((i * w) / n, (j * h) / 4, w / n, h / 4); } } });
    wall.position.set(TRX, 1.5, WALLZ + 0.25); wall.rotation.y = Math.PI; world.add(wall);
    const wallBack = E.box(5.2, 3.4, 0.6, "#603f5f"); wallBack.position.set(TRX, 1.7, WALLZ + 0.85); world.add(wallBack);
    // the paper car (side profile, forward = +z after rotation) with a dummy inside
    const car = new THREE.Group(); world.add(car); const carIn = new THREE.Group(); carIn.rotation.y = -Math.PI / 2; car.add(carIn);
    const carFront = new THREE.Group(); carFront.position.x = 0.75; carIn.add(carFront);
    { const body = new THREE.Shape(); body.moveTo(-1.4, 0.25); body.lineTo(-1.4, 0.8); body.lineTo(-0.9, 0.85); body.lineTo(-0.55, 1.35); body.lineTo(0.45, 1.35); body.lineTo(0.75, 0.9); body.lineTo(0.75, 0.25); body.lineTo(-1.4, 0.25);
      const win = new THREE.Path(); win.moveTo(-0.4, 0.92); win.lineTo(0.38, 0.92); win.lineTo(0.38, 1.25); win.lineTo(-0.48, 1.25); win.lineTo(-0.4, 0.92); body.holes.push(win);
      const m = E.extrude(body, "#efe6d2", 1.3); m.position.z = -0.65; carIn.add(m);
      const hood = E.extrude(E.polyShape([[0, 0.25], [0.8, 0.25], [0.85, 0.75], [0, 0.9]]), "#efe6d2", 1.3); hood.position.z = -0.65; carFront.add(hood);
      const stripe = E.box(2.2, 0.12, 1.32, "#7a3b17"); stripe.position.set(-0.3, 0.5, 0); carIn.add(stripe);
      const bump = E.box(0.14, 0.24, 1.36, "#4d3350"); bump.position.set(0.86, 0.38, 0); carFront.add(bump);
      [[-0.9, 0.66], [-0.9, -0.66], [0.45, 0.66], [0.45, -0.66]].forEach(([x, z], i) => { const w = E.extrude(E.circleShape(0.28), "#2a1d2e", 0.14); w.position.set(x, 0.28, z - 0.07); (i < 2 ? carIn : carFront).add(w); w.userData.wheel = true; }); }
    const dummy = E.figure({ pose: "sit", hair: "short", hex: AMB, seed: 31 }); dummy.scale.setScalar(0.44); dummy.position.set(-0.32, 0.47, 0); dummy.userData.mat.side = THREE.DoubleSide; carIn.add(dummy);
    const dummyMark = new THREE.Mesh(new THREE.CircleGeometry(0.11, 20), new THREE.MeshBasicMaterial({ color: "#3a2232", side: THREE.DoubleSide })); dummyMark.position.set(0.08, 0.17, 0.01); dummy.userData.headG.add(dummyMark);
    // flash bulbs on stands + debris
    const bulbs = [[TRX - 2.5, WALLZ - 1.5], [TRX - 2.7, WALLZ - 4.6]].map(([x, z]) => { const g = new THREE.Group(); g.position.set(x, 0, z); world.add(g); const st = E.box(0.08, 2.6, 0.08, "#3a2740"); st.position.y = 1.3; g.add(st);
      const dish = E.extrude(E.circleShape(0.32), "#efe6d2", 0.08); dish.position.set(0, 2.7, 0); dish.lookAt(TRX + 0.0, 0.8, WALLZ - 2.0); g.add(dish); const b = E.glowPlane(0.55, 0.55, "#fff3d8"); b.lookAt(TRX + 6, 1.8, WALLZ - 7); b.position.set(0, 2.7, 0); g.add(b); g.userData.b = b; b.userData.setGlow(0.3); return g; });
    const ND = 16; const debris = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.12, 0.01), pm("#efe6d2"), ND); debris.frustumCulled = false; world.add(debris);
    const dr = rng(71); const DEB = [...Array(ND)].map(() => ({ vx: (dr() - 0.5) * 3, vy: 1.5 + dr() * 2.5, vz: -0.5 - dr() * 1.5, s: (dr() - 0.5) * 12 }));
    // the dark hand that ushers the inspectors out
    const officeHand = mkHand("#9a93a6", "#4a4658"); officeHand.scale.setScalar(1.8); officeHand.rotation.order = "ZYX"; world.add(officeHand);
    // the safety net (pops up from the ground), top rope to a single peg
    const NETZ = -36, NX0 = -9, NX1 = 14, NH = 3.2;
    const netC = document.createElement("canvas"); netC.width = netC.height = 128; { const g = netC.getContext("2d"); g.strokeStyle = "#f3e6cc"; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 0); g.lineTo(128, 128); g.moveTo(128, 0); g.lineTo(0, 128); g.stroke(); }
    const netT = new THREE.CanvasTexture(netC); netT.wrapS = netT.wrapT = THREE.RepeatWrapping; netT.repeat.set((NX1 - NX0) / 0.7, NH / 0.7); netT.colorSpace = THREE.SRGBColorSpace;
    const netHinge = new THREE.Group(); netHinge.position.set(0, 0, NETZ); world.add(netHinge);
    const netGeo = new THREE.PlaneGeometry(NX1 - NX0, NH - 0.25, 80, 6); netGeo.translate((NX0 + NX1) / 2, (NH - 0.25) / 2 + 0.05, 0); const netBase = netGeo.attributes.position.array.slice();
    const net = new THREE.Mesh(netGeo, new THREE.MeshStandardMaterial({ color: "#f1e2c6", map: netT, alphaMap: netT, transparent: false, alphaTest: 0.35, side: THREE.DoubleSide, roughness: 0.9 })); net.castShadow = true;
    net.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, alphaMap: netT, alphaTest: 0.35 }); netHinge.add(net);
    const ropeGeo = new THREE.CylinderGeometry(0.06, 0.06, NX1 - NX0 + 1.2, 8, 120, true); ropeGeo.rotateZ(Math.PI / 2); ropeGeo.translate((NX0 + NX1) / 2 - 0.6, NH, 0); const ropeBase = ropeGeo.attributes.position.array.slice();
    const rope = new THREE.Mesh(ropeGeo, pm("#f6ead2")); rope.castShadow = true; netHinge.add(rope);
    const postL = E.box(0.28, NH + 0.5, 0.28, "#4d3350"); postL.position.set(NX0 - 0.6, (NH + 0.5) / 2, 0); netHinge.add(postL);
    const peg = new THREE.Group(); peg.position.set(NX1 + 0.2, 0, 0); netHinge.add(peg);
    { const s = E.box(0.34, NH + 0.4, 0.34, "#3c3a4a"); s.position.y = (NH + 0.4) / 2 - 0.2; peg.add(s); const knot = E.box(0.5, 0.3, 0.5, "#f6ead2"); knot.position.y = NH; peg.add(knot); }

    // ---------- DOM ----------
    const L = E.layer;
    const chapter = E.chapterDOM(L, { text: "TEST", inAt: T.second, outAt: T.julyAgents });
    const stamp = E.stampDOM(L, [{ t: T.government + 0.2, year: "2026", label: "Britain · US" }, { t: T.september, year: "2026", label: "September" }, { t: T.autumn, year: "2026", label: "Autumn" }], T.net - 0.3);
    const srcA = E.srcDOM(L, { big: "UK AISI / US CAISI", small: "pre-release testing", inAt: T.government + 0.5, outAt: T.september - 0.3 });
    const srcB = E.srcDOM(L, { big: "OpenAI shelved a launch, Sept 2026", small: "“didn’t quite meet the bar”", inAt: T.shelved + 0.2, outAt: T.lesson - 0.2 });
    const srcC = E.srcDOM(L, { big: "UK testers cut off for 17 days", small: "autumn 2026", inAt: T.cut, outAt: T.net - 0.2 });
    const doms = [chapter, stamp, srcA, srcB, srcC];

    // ---------- camera ----------
    const FD = 4 / (0.6 * 2 * Math.tan((17.5 * Math.PI) / 180) * (16 / 9)), FA = (10 * Math.PI) / 180;
    const N0 = V3(0, NOTE_Y, 0);
    const START = V3(0, NOTE_Y + FD * Math.cos(FA), FD * Math.sin(FA));
    const K = (t, p, l, e, arc) => ({ t, p: V3(...p), l: V3(...l), e, arc });
    const ROPE_D = 6, RX = 6.2, PITCH = Math.tan((1.8 * Math.PI) / 180);
    const keys = [
      { t: def.from, p: START.clone(), l: N0.clone() },
      K(T.someone + 0.2, [0.15, 8.6, 1.5], [0.1, 0, 0], sineInOut),
      K(T.julyAgents, [-0.25, 9.2, 1.9], [-0.3, 0, 0.05], sineInOut),
      K(T.graded - 0.1, [0.3, 8.2, 1.5], [0.4, 0, 0.1], sineInOut),
      K(T.itself + 0.5, [0.4, 7.9, 1.45], [0.5, 0, 0.1], sineInOut),
      K(T.government + 0.9, [0.5, 5.0, -12], [0.2, 2.8, -45], inOut, 0),
      K(T.government + 2.4, [2.6, 2.2, -35.0], [-0.6, 2.6, -45], inOut, 0.03),
      K(T.release, [2.9, 2.25, -35.6], [-0.9, 2.6, -45], sineInOut),
      K(T.september + 0.4, [3.2, 2.3, -36.0], [-1.2, 2.6, -45], sineInOut),
      K(T.shelved + 0.1, [-13.2, 4.6, -35.5], [-20.2, 4.4, -47.5], inOut, 0.04),
      K(T.bar, [-13.6, 4.5, -36.2], [-20.4, 4.4, -47.5], sineInOut),
      K(T.testing, [TRX + 7.5, 2.6, WALLZ - 9], [TRX - 0.5, 1.0, WALLZ - 5], inOut, 0.04),
      K(T.crash, [TRX + 6.4, 1.45, WALLZ - 7.0], [TRX - 0.3, 1.0, WALLZ - 2.0], sineInOut),
      K(T.cars + 0.6, [TRX + 5.4, 1.35, WALLZ - 6.0], [TRX - 0.2, 1.0, WALLZ - 1.8], sineInOut),
      K(T.voluntary + 0.7, [4.5, 3.3, -30.5], [3.0, 2.0, -45], inOut, 0.05),
      K(T.cut + 0.9, [5.2, 3.2, -31.0], [4.2, 2.0, -45], sineInOut),
      K(T.seventeen + 0.2, [3.6, 2.5, -42.2], [2.4, 1.55, -48.6], inOut, 0.03),
      K(T.days + 1.0, [3.5, 2.45, -42.6], [2.3, 1.55, -48.6], sineInOut),
      K(T.stop - 0.1, [4.6, 3.2, -31.0], [3.0, 2.0, -45], inOut, 0.03),
      K(T.net + 0.5, [9.4, 1.5, -29.6], [12.6, 2.3, -37], inOut, 0.05),
      K(T.switchOff + 0.6, [9.0, 1.55, -29.9], [12.3, 2.35, -37], sineInOut),
      { t: def.to, p: V3(RX, NH, NETZ + ROPE_D), l: V3(RX, NH + ROPE_D * PITCH, NETZ), e: inOut, arc: 0 },
    ];
    const camKeys = (t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++; const a = keys[i], b = keys[i + 1]; const raw = lin(a.t, b.t, t); const k = (b.e || inOut)(raw);
      const p = a.p.clone().lerp(b.p, k), l = a.l.clone().lerp(b.l, k); const bul = Math.sin(Math.PI * k) * a.p.distanceTo(b.p) * (b.arc ?? 0.0); p.x += bul * (i % 2 ? -1 : 1); p.y += bul * 0.4; return { p, l }; };
    const drift = (t, p, l, a = 1) => { const d = p.distanceTo(l) * 0.01 * a; p.x += d * (Math.sin(t * 0.37) * 0.9 + Math.sin(t * 0.83 + 1.3) * 0.4); p.y += d * (Math.sin(t * 0.51 + 0.7) * 0.6 + Math.sin(t * 1.13 + 2.1) * 0.2);
      l.x += d * Math.sin(t * 0.29 + 0.4) * 0.5; l.y += d * Math.sin(t * 0.43 + 1.9) * 0.35; };

    // ---------- update ----------
    const dmy = new THREE.Object3D(); const tc = new THREE.Color(); const tv = V3(0, 0, 0);
    const placeFlat = (obj, x, y, z, yaw = 0, tilt = 0) => { obj.position.set(x, y, z); obj.rotation.set(tilt, yaw, 0); };
    let lastP = -1;
    const update = (t) => {
      // sieve slides off to the left; booklet drops to the desk
      const sl = inOut(lin(def.from + 0.12, T.someone - 0.1, t)); sieve.position.set(-13 * sl, -0.6 * sl * sl, 0.4 * sl); sieve.rotation.z = 0.12 * sl; sieve.visible = sl < 0.999;
      const dropT0 = def.from + 0.3, dropT1 = def.from + 1.05; const dq = lin(dropT0, dropT1, t); const dy = dq * dq; const land = t > dropT1 ? Math.exp(-(t - dropT1) * 7) * Math.sin((t - dropT1) * 24) * 0.05 : 0;
      booklet.position.set(0.02 * Math.sin(t * 0.6), lerp(NOTE_Y, 0.04, dy) + Math.abs(land), 0); booklet.rotation.set(-Math.PI / 2 + 0.12 * Math.sin(Math.PI * dq) + land * 0.5 + 0.004 * Math.sin(t * 1.2), 0.002 * Math.sin(t * 0.9), 0.06 * Math.sin(Math.PI * dq));
      // grade: the cyan hand writes "A+" in cyan
      const gp = clamp(lin(T.graded - 0.05, T.itself + 0.05, t), 0, 1); const gq = Math.round(gp * 40) / 40; if (gq !== lastP) { lastP = gq; booklet.userData.redraw({ p: gq }); }
      // answer key slides out on "cheat"
      const kOut = expoOut(lin(T.cheat - 0.1, T.cheat + 0.7, t)); keyCard.position.set(-0.6 - 2.6 * kOut, 0.02, -0.25 + 0.3 * kOut); keyCard.rotation.z = 0.25 * kOut; keyCard.visible = t > T.julyAgents - 0.5;
      // amber hand: enters on "someone else", picks the red pencil, holds it poised
      const pk = T.someone + 0.55; const aIn = inOut(lin(T.someone - 0.25, pk, t)); const aUp = expoOut(lin(pk + 0.1, pk + 0.9, t));
      const ax = lerp(8.5, 3.15, aIn) - 0.25 * aUp, az = lerp(2.2, 1.45, aIn) + 0.15 * Math.sin(t * 0.8), ay = 0.06 + 0.9 * aUp + 0.05 * Math.sin(t * 1.3) * aUp;
      placeFlat(amberHand, ax, ay, az, Math.PI + 0.35 - 0.1 * aUp, 0); amberHand.rotation.z = 0.1 * aUp;
      if (t < pk) { redPencil.position.set(3.1, 0.08, 1.35); redPencil.rotation.set(0, 0.5, 0); }
      else { redPencil.position.set(ax - 1.25, ay + 0.15, az + 0.15); redPencil.rotation.set(0, Math.PI + 0.35 + 0.25, -0.25 * aUp); }
      // cyan hand: slips in for the answer key, then moves to the grade box and writes
      const cIn = inOut(lin(T.julyAgents - 0.2, T.cheat - 0.15, t)); const toBox = inOut(lin(T.research - 0.2, T.graded - 0.15, t));
      const [pu, pv] = penAt(gp); const bx = -2 + pu * 4, bz = -1.5 + pv * 3; // pen target on the booklet (x: left->right, z: top->bottom)
      let cx = lerp(-9, -3.2 - 0.9 * kOut, cIn), cz = lerp(-0.4, -0.05, cIn), cy = 0.12;
      const penX = lerp(cx + 2.2, bx, toBox), penZ = lerp(cz + 0.1, bz, toBox);
      cx = lerp(cx, bx - 2.15, toBox); cz = lerp(cz, bz + 0.35, toBox); cy = lerp(cy, 0.42, toBox) + (gp > 0 && gp < 1 ? 0.04 * Math.sin(t * 40) : 0);
      placeFlat(cyanHand, cx, cy, cz, -0.18 * toBox, 0); cyanPen.position.set(penX - 1.2, cy + 0.1, penZ - 0.2 * toBox); cyanPen.rotation.set(0, -0.18 * toBox + 0.12, -0.35 * toBox);
      cyanHand.visible = cyanPen.visible = t > T.julyAgents - 0.25;

      // models through the gate
      let gateOpen = 0;
      models.forEach((m, k) => { const x = modelX(k, t); m.position.set(x, 0.95, GZ); m.userData.ring.rotation.z = -x * 0.8; m.visible = t > sched[k][0] && x < 34;
        const [, t1, t2] = sched[k]; gateOpen = Math.max(gateOpen, smooth(t2 - 0.35, t2 + 0.1, t) * (1 - smooth(t2 + 0.9, t2 + 1.4, t))); });
      arm.rotation.x = -1.35 * gateOpen + 0.02 * Math.sin(t * 2);
      // inspectors: lean in when a model waits; ushered out on "cut off", back after the 17 days
      const outK = smooth(T.cut - 0.1, T.cut + 1.6, t), backK = smooth(T.stop - 0.6, T.them + 0.4, t), away = outK * (1 - backK);
      insp.forEach((f, i) => { const waiting = sched.some(([, t1, t2]) => t > t1 - 0.2 && t < t2 + 0.1) ? 1 : 0; const walking = (t > T.cut && t < T.cut + 1.8) || (t > T.stop - 0.6 && t < T.them + 0.5) ? 1 : 0;
        f.position.set(f.userData.home.x + away * (14 + i * 2.5), 0, f.userData.home.z + away * 2.5);
        f.userData.pose(t, { lean: 0.25 * waiting * (1 - away), reach: 0.3 + 0.5 * waiting * (1 - away), lookUp: 0.1 * Math.sin(t * 0.7 + i), walk: walking, turn: walking && t < T.stop - 0.6 ? 0 : (walking ? 1 : f.userData.turn0) });
        f.visible = f.position.x < 22; });
      const lampOn = 1 - 0.85 * away; lamp.userData.setGlow((1.6 + 0.2 * Math.sin(t * 3)) * lampOn); booth.userData.win.userData.setGlow((1.0 + 0.06 * Math.sin(t * 2.3)) * (0.25 + 0.75 * lampOn));
      boothLight.position.set(2.6, 3.2, GZ - 1.6); boothLight.intensity = 9 * lampOn * smooth(T.government, T.government + 1.5, t);
      const uh = smooth(T.cut - 0.6, T.cut + 0.1, t) * (1 - smooth(T.cut + 1.5, T.cut + 2.3, t)), sw = inOut(lin(T.cut - 0.1, T.cut + 2.0, t));
      const hf = smooth(T.switchOff - 0.8, T.switchOff - 0.05, t) * (1 - smooth(T.switchOff + 0.7, T.yet - 0.2, t));
      officeHand.visible = uh > 0.001 || hf > 0.001;
      if (hf > 0.001) { const flick = t > T.switchOff - 0.05 ? Math.exp(-(t - T.switchOff) * 4) * Math.sin(Math.min(t - T.switchOff + 0.05, 0.6) * 9) : 0;
        officeHand.position.set(NX1 + 0.9 + 0.5 * flick, NH + 3.4 + 7 * (1 - hf), NETZ + 0.5); officeHand.rotation.set(Math.PI / 2, 0, -Math.PI / 2 + 0.35 + 0.5 * flick); }
      else { officeHand.position.set(-1.5 + 12 * sw, 0.5 + 7 * (1 - uh), GZ + 3.0); officeHand.rotation.set(Math.PI / 2, 0, Math.PI / 2 - 0.35 + 0.25 * Math.sin(t * 5)); }
      // 17 days flip
      minis.forEach((p, k) => { const tk = T.seventeen + 0.15 + k * 0.06; const u = t - tk; if (k >= 17 || u <= 0) { p.rotation.set(0, 0, 0); p.visible = true; return; }
        p.rotation.x = -Math.min(u / 0.12, 1) * 2.6; const fu = Math.max(0, u - 0.1); p.position.y = 1.05 + fu * 3.2; p.position.x = -0.45 + fu * 1.6; p.position.z = 0.93 + (NC - k) * 0.006 + fu * 0.8; p.rotation.z = fu * 3; p.visible = u < 0.5; });
      // launch rail -> shelf (giant amber hand)
      const gIn = smooth(T.shelved - 0.9, T.shelved - 0.05, t), lift = inOut(lin(T.shelved, T.model + 0.5, t)), gOut = smooth(T.model + 0.7, T.model + 1.6, t);
      const railPos = V3(-15.4, 2.15, GZ - 2.4), shelfPos = V3(-23.2, 5.95, GZ - 2.9);
      const mp = railPos.clone().lerp(shelfPos, lift); mp.y += Math.sin(Math.PI * lift) * 2.2; bigModel.position.copy(mp); bigModel.rotation.z = 0.55 * (1 - lift) + 0.05 * Math.sin(t * 1.1);
      bigModel.userData.ring.rotation.z = t * 0.6; bigModel.scale.setScalar(lerp(1, 0.7, lift)); bigModel.visible = t > T.september - 2;
      giantHand.position.set(mp.x + 0.15, mp.y + 2.3 * bigModel.scale.x + 12 * (1 - gIn) + 12 * gOut, mp.z - 0.45); giantHand.rotation.set(Math.PI / 2, 0, -Math.PI / 2 + 0.06 * Math.sin(t * 1.4)); giantHand.visible = gIn > 0.001 && gOut < 0.999;
      // crash test: car rolls out after "The lesson", real speed, then slow motion from just before "crash" through the impact
      const c0 = T.lesson + 0.2, tSlow = T.crash - 0.45, tImp = T.crash + 0.12, Q = 0.14;
      const tau = (x) => (x < tSlow ? x : tSlow + Q * (x - tSlow));
      const z0 = GZ + 1.5, zHit = WALLZ - 0.95, Dz = zHit - z0, vC = Dz / (tau(tImp) - c0 - 0.4);
      const sAt = (x) => { const u = Math.max(0, tau(x) - c0); return vC * (u < 0.8 ? (u * u) / 1.6 : u - 0.4); };
      let cz2 = z0 + Math.min(sAt(t), Dz); const after = t - tImp, aS = Math.max(0, after) * 0.42; let crumple = 0, rebound = 0;
      if (after > 0) { crumple = expoOut(clamp(aS / 0.3, 0, 1)); rebound = Math.sin(Math.min(aS, 0.9) / 0.9 * Math.PI) * 0.4 * Math.exp(-aS * 1.2); cz2 = zHit - rebound; }
      car.position.set(TRX, 0, cz2); car.visible = t > c0 - 0.2; carFront.scale.x = 1 - 0.55 * crumple; carFront.rotation.z = 0.06 * crumple; car.rotation.x = -0.05 * Math.sin(Math.min(aS / 0.5, 1) * Math.PI);
      carIn.children.forEach((w) => { if (w.userData.wheel) w.rotation.z = -cz2 * 2.2; }); carFront.children.forEach((w) => { if (w.userData.wheel) w.rotation.z = -cz2 * 2.2; });
      const jolt = after > 0 ? Math.exp(-aS * 2.4) * Math.sin(aS * 6.5) : 0;
      dummy.userData.pose(t, { lean: 0.9 * jolt, lookUp: -0.3 * jolt + 0.25 * smooth(T.cars, T.cars + 0.6, t), reach: 0.3 + 0.5 * smooth(T.cars + 0.1, T.cars + 0.8, t), armUp: 0.6 * smooth(T.cars + 0.15, T.cars + 0.85, t) });
      const fl = after > 0 ? Math.exp(-after * 7) + 0.8 * Math.exp(-Math.max(0, after - 0.45) * 7) * (after > 0.45 ? 1 : 0) : 0;
      bulbs.forEach((b, i) => b.userData.b.userData.setGlow(0.35 + 3.2 * fl * (i ? 0.9 : 1)));
      flash.position.set(TRX + 1.5, 2.8, WALLZ - 2.2); flash.intensity = 110 * fl;
      for (let k = 0; k < ND; k++) { const D = DEB[k]; if (after <= 0 || aS > 1.4) { dmy.scale.setScalar(0.0001); } else { const u = aS; dmy.scale.setScalar(1);
          dmy.position.set(TRX + D.vx * u, Math.max(0.02, 0.9 + D.vy * u - 4.9 * u * u), WALLZ - 0.9 + D.vz * u); dmy.rotation.set(D.s * u, D.s * 0.7 * u, 0); } dmy.updateMatrix(); debris.setMatrixAt(k, dmy.matrix); }
      debris.instanceMatrix.needsUpdate = true;
      // net: pops up on "A safety net"; the single peg wobbles on "switch off"; the rope sags and recovers
      const up = spring(lin(T.net - 0.15, T.net + 0.95, t)); netHinge.rotation.x = -Math.PI / 2 * (1 - up) + 0.004 * Math.sin(t * 0.9) * up; netHinge.visible = true;
      const wb = t > T.switchOff ? Math.exp(-(t - T.switchOff) * 1.6) * Math.sin((t - T.switchOff) * 9) : 0; const lean = 0.22 * wb + 0.06 * smooth(T.switchOff, T.switchOff + 0.3, t) * (1 - smooth(T.switchOff + 0.8, T.yet, t));
      peg.rotation.z = -lean + 0.006 * Math.sin(t * 2.1); const dropR = Math.max(0, lean) * 2.6;
      { const a = rope.geometry.attributes.position; for (let i = 0; i < a.count; i++) { const x = ropeBase[i * 3]; const u = clamp((x - NX0) / (NX1 - NX0), 0, 1); a.array[i * 3 + 1] = ropeBase[i * 3 + 1] - dropR * Math.pow(u, 3) - 0.03 * Math.sin(u * Math.PI) * (1 + Math.sin(t * 1.3)); } a.needsUpdate = true; }
      { const a = net.geometry.attributes.position; for (let i = 0; i < a.count; i++) { const x = netBase[i * 3], y = netBase[i * 3 + 1]; const u = clamp((x - NX0) / (NX1 - NX0), 0, 1); const hk = y / NH;
          a.array[i * 3 + 1] = y - dropR * Math.pow(u, 3) * hk; a.array[i * 3 + 2] = 0.12 * Math.sin(x * 0.7 + t * 1.5) * hk + 0.25 * Math.sin(u * Math.PI) * (1 - hk) * 0.5; } a.needsUpdate = true; }

      // lights
      const desk = 1 - smooth(T.government + 0.2, T.government + 1.8, t);
      pool.visible = true; pool.intensity = 210 * 0.32 * desk * (1 + 0.03 * Math.sin(t * 2.3)); pool.position.set(-2.5 + 0.3 * Math.sin(t * 0.4), 15, 3.5); pool.target.position.set(0, MESHY * (1 - sl), 0);
      labDoor.userData.setGlow(0.8 + 0.1 * Math.sin(t * 2.7)); labLight.position.set(-20, 3, GZ - 4); labLight.intensity = 6 * (1 - desk);
      for (let i = 0; i < 9; i++) { labT1.userData.setFloor(i, 0.4 + 0.12 * Math.sin(t * 1.5 + i * 1.9), C.cyan); if (i < 6) labT2.userData.setFloor(i, 0.35 + 0.1 * Math.sin(t * 1.2 + i), C.cyan); }

      // camera
      const { p, l } = camKeys(t);
      const dA = (1 - 0.75 * (1 - smooth(def.from, def.from + 1.2, t))) * (1 - 0.8 * smooth(T.switchOff + 1, def.to, t));
      drift(t, p, l, dA); E.applyCam(camera, { p, l });
      sky.position.copy(camera.position);
      const sunEl = lerp(0.075, 0.11, lin(def.from, def.to, t)); const sd = V3(0.12, sunEl, -1).normalize();
      sun.position.copy(camera.position).addScaledVector(sd, 300); sun.lookAt(camera.position); halo.scale.setScalar(1 + 0.03 * Math.sin(t * 0.8));
      key.target.position.copy(l); fill.target.position.copy(l);
      key.position.copy(l).add(desk > 0.5 ? V3(-12, 30, 10) : V3(-20, 26, 22)); key.intensity = lerp(2.6, 1.2, desk); hemi.intensity = lerp(1.1, 0.9, desk);
      fill.position.copy(camera.position).add(V3(-6, 4, 0));
      doms.forEach((d) => d.update(t));
    };
    update(def.from);
    return { scene, camera, post: { bloom: 0.42, exposure: 1.08 }, update };
  },
};
