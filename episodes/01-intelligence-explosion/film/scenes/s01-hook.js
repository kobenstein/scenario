// s01 · Hook (0 → 45.96 s). "It has started, and you probably missed it." … "What if it arrives like this, quietly, while we're busy?"
// One continuous night shot over a paper San Francisco (Golden Gate, Transamerica, Salesforce, Coit, Victorians, the bay):
//   1 "It has started": one window of one lab building ignites cyan (flicker, then steady). Hero light.
//   2 "you probably missed it": in the foreground a small figure walks under a warm street lamp, head down over a glowing phone.
//   3 "no announcement …": the camera glides up over the street; in a few buildings the warm windows turn cyan, one by one.
//   4 "The AI started writing the code": the camera flies into the lit window; on the lab wall the human (amber) code rows are
//      rewritten in cyan by a light; the bar beneath fills cyan to 80 % on "eighty", an amber sliver stays.
//   5 "research on the next AI": the light leaves the wall and draws a small ring in the room.
//   6 "a machine that builds a better machine …": the ring floats out of the window, rises over the roofs, and builds a bigger
//      ring, which builds a bigger one, faster each time.
//   7 WOW "explosion": rings cascade outward and fill the sky; far below, the tiny figure stops under its lamp and looks up.
//   8 "We thought …": the sky calms into a slow pulse high above.
//   9 "quietly, while we're busy": the figure lowers its head to the phone and walks on; behind it more windows turn cyan.
//  10 title; the camera pushes into the phone screen until the cream PAGE fills the frame (→ s02 typewriter page).
export default {
  build(E, def) {
    const { THREE, C, PAL, V, lin, smooth, lerp, clamp, expoOut, inOut, sineInOut, spring, wob } = E;
    const pal = PAL.night;
    const scene = new THREE.Scene();
    const camera = E.newCamera();
    const A = (p, n = 1) => E.at("hook", p, n), Z = (p, n = 1) => E.end("hook", p, n);
    const T0 = def.from, T1 = def.to;
    const T = {
      it: A("It"), started: A("started"), and: A("and"), missed: A("missed"), there: A("There"), ann: A("announcement"),
      date: A("date"), just: A("just"), quiet: A("quiet"), buildings: A("buildings"), san: A("San"), sfEnd: Z("Francisco"),
      the: A("The AI"), ai: A("AI"), started2: A("started", 2), writing: A("writing"), code: A("code"), more: A("more"), eighty: A("eighty"), lab: A("lab"),
      then: A("Then"), research: A("research"), next: A("next"), ai2: A("AI", 2), ai2End: Z("AI", 2),
      sci: A("Scientists"), machine: A("machine"), b1: A("builds"), b2: A("builds", 2), one: A("one", 2), an: A("an intelligence"), intel: A("intelligence"),
      boom: A("explosion"), boomEnd: Z("explosion"), we: A("We"), day: A("day"), once: A("once"), onceEnd: Z("once"),
      what: A("What"), arrives: A("arrives"), quietly: A("quietly"), busy: A("busy"), voEnd: E.section("hook").voEnd,
    };
    const R = E.rng(101);

    // ---------------- textures ----------------
    const canvasTex = (w, h, draw) => { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
    const radTex = canvasTex(256, 256, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.18, "rgba(255,255,255,0.55)"); gr.addColorStop(0.45, "rgba(255,255,255,0.16)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(0, 0, w, w); });
    const softTex = canvasTex(256, 256, (g, w) => { const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      gr.addColorStop(0, "rgba(255,255,255,0.9)"); gr.addColorStop(0.5, "rgba(255,255,255,0.35)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(0, 0, w, w); });
    const glow = (size, hex, tex = radTex, opacity = 1) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size),
      new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(hex), transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
      m.userData.base = new THREE.Color(hex); m.userData.set = (k) => m.material.color.copy(m.userData.base).multiplyScalar(Math.max(0, k)); m.renderOrder = 5; return m; };
    const flat = (hex, opts) => E.paperMat(hex, opts);

    // ---------------- sky, moon, stars, clouds ----------------
    scene.background = new THREE.Color(pal.clear);
    scene.fog = new THREE.Fog("#24345a", 120, 600);
    const skyTex = canvasTex(4, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h);
      [[0, "#03050c"], [0.42, "#0a1226"], [0.7, "#162244"], [0.86, "#26365f"], [0.95, "#36487a"], [1, "#40538a"]].forEach(([k, c]) => gr.addColorStop(k, c));
      g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(1900, 640), new THREE.MeshBasicMaterial({ map: skyTex, fog: false })); sky.position.set(0, -14 + 320, -440); scene.add(sky);
    const nStars = 260; const stars = new THREE.InstancedMesh(new THREE.CircleGeometry(0.55, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false }), nStars);
    const starD = []; { const d = new THREE.Object3D(); for (let i = 0; i < nStars; i++) { const x = -800 + R() * 1600, y = 70 + Math.pow(R(), 0.8) * 520;
      d.position.set(x, y, -436); d.scale.setScalar(0.5 + R() * 1.3); d.updateMatrix(); stars.setMatrixAt(i, d.matrix); starD.push({ ph: R() * 6.3, sp: 0.6 + R() * 2.2, b: 0.35 + R() * 0.5 });
      stars.setColorAt(i, new THREE.Color("#d9d2bd")); } }
    scene.add(stars);
    const moon = new THREE.Mesh(new THREE.CircleGeometry(11, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color("#e9dfc6").multiplyScalar(0.92), fog: false }));
    moon.position.set(-150, 118, -430); scene.add(moon);
    const moonHalo = glow(120, "#8fa6d8", softTex, 0.35); moonHalo.position.set(-150, 118, -431); scene.add(moonHalo);
    const clouds = [];
    { const cshape = (w, h, r) => { const s = new THREE.Shape(); let x = -w; s.moveTo(-w, 0); while (x < w) { const rr = h * (0.45 + r() * 0.55); s.absarc(x + rr, 0, rr, Math.PI, 0, true); x += rr * 2; } s.lineTo(x, -0.6); s.lineTo(-w, -0.6); return s; };
      [[-230, 150, -400, 44, 10], [-60, 190, -405, 60, 12], [120, 140, -395, 40, 9], [260, 175, -400, 52, 11], [-150, 96, -380, 30, 7], [40, 110, -385, 34, 7.5], [200, 92, -375, 28, 6]].forEach(([x, y, z, w, h], i) => {
        const m = E.extrude(cshape(w, h, E.rng(40 + i)), "#1c2849", 0.6, { cast: false }); m.material[0].emissive = new THREE.Color("#3a4c7c"); m.material[0].emissiveIntensity = 0.18;
        m.position.set(x, y, z); scene.add(m); clouds.push({ m, x, y, v: 0.8 + (i % 3) * 0.35 }); }); }

    // ---------------- light rig (moonlight + fill) ----------------
    const hemi = new THREE.HemisphereLight("#7088c0", "#0a0f1a", 0.85); scene.add(hemi);
    const key = new THREE.DirectionalLight("#bcd0ff", 1.15); key.position.set(-70, 90, 70); key.target.position.set(4, 0, -26);
    key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 5; key.shadow.bias = -0.0008; key.shadow.normalBias = 0.05;
    Object.assign(key.shadow.camera, { left: -95, right: 95, top: 80, bottom: -60, near: 1, far: 320 }); scene.add(key, key.target);

    // ---------------- far hills + the bay ----------------
    const hill = (x0, x1, z, fH, hex, seed) => { const s = new THREE.Shape(); s.moveTo(x0, -20); for (let x = x0; x <= x1; x += 4) s.lineTo(x, fH(x)); s.lineTo(x1, -20);
      const m = E.extrude(s, hex, 1, { cast: false }); m.position.z = z; scene.add(m); return m; };
    const hills = [
      hill(-700, 40, -340, (x) => -6 + Math.max(0, 44 * Math.exp(-(((x + 220) / 170) ** 2)) + 10 * Math.sin(x * 0.021 + 1) + 6 * Math.sin(x * 0.057)), "#1e2b4c"),
      hill(-60, 700, -360, (x) => -6 + 18 + 6 * Math.sin(x * 0.017) + 3 * Math.sin(x * 0.051 + 2), "#22305a"),
    ];
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(1800, 110), flat("#0e1529")); ground.rotation.x = -Math.PI / 2; ground.position.set(0, -6, -45); ground.receiveShadow = true; scene.add(ground);
    const water = new THREE.Mesh(new THREE.PlaneGeometry(1800, 380), new THREE.MeshStandardMaterial({ color: "#0c1532", roughness: 0.55, metalness: 0.25, map: E.paperTex }));
    water.rotation.x = -Math.PI / 2; water.position.set(0, -5.96, -88 - 190); scene.add(water);
    // shimmer: thin additive strips on the water (moon column + city light reflections)
    const nSh = 320; const shimmer = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }), nSh);
    const shD = []; { for (let i = 0; i < nSh; i++) { const moonCol = i < 190; const z = -92 - Math.pow(R(), 0.8) * (moonCol ? 300 : 90);
      const x = moonCol ? -120 + (z + 92) * 0.12 + (R() - 0.5) * (14 + (-z - 92) * 0.12) : -120 + R() * 240;
      shD.push({ x, z, l: (moonCol ? 3 : 1.5) + R() * (moonCol ? 9 : 4), ph: R() * 6.3, sp: 0.7 + R() * 1.6, hue: moonCol ? 0 : R() < 0.75 ? 1 : 2, b: moonCol ? 0.35 + R() * 0.5 : 0.25 + R() * 0.35 }); } }
    shimmer.frustumCulled = false; scene.add(shimmer);
    const SH_COL = [new THREE.Color("#c9d3ef"), new THREE.Color(C.amber), new THREE.Color(C.cyan)];

    // ---------------- the Golden Gate Bridge (paper cut-out, broadside) ----------------
    const GG = new THREE.Group(); GG.position.set(-128, -6, -262); scene.add(GG);
    const GGHEX = "#2e2742", ggMats = E.paperMats(GGHEX);
    const strip = (pts, th) => { const s = new THREE.Shape(); const up = [], dn = [];
      for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)]; const dx = q[0] - o[0], dy = q[1] - o[1], L = Math.hypot(dx, dy) || 1;
        up.push([p[0] - dy / L * th / 2, p[1] + dx / L * th / 2]); dn.push([p[0] + dy / L * th / 2, p[1] - dx / L * th / 2]); }
      s.moveTo(...up[0]); up.forEach((p) => s.lineTo(...p)); dn.reverse().forEach((p) => s.lineTo(...p)); return s; };
    const ggAdd = (shape, z = 0, d = 0.8) => { const m = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false, curveSegments: 6 }), ggMats); m.position.z = z; m.castShadow = false; GG.add(m); return m; };
    const TWX = 46, TOP = 66, DECK = 22;
    [-TWX, TWX].forEach((tx) => { // art-deco portal tower: two tapering legs + stepped struts
      [-1, 1].forEach((sd) => { ggAdd(E.polyShape([[tx + sd * 4.6 - 1.2, 0], [tx + sd * 4.6 + 1.2, 0], [tx + sd * 4.0 + 0.9, TOP], [tx + sd * 4.0 - 0.9, TOP]]), 0, 1.4);
        ggAdd(E.rectShape(1.2, 2.6, tx + sd * 4.0, TOP + 1.3), 0, 1.2); });
      [[DECK + 10, 2.4], [DECK + 22, 2.0], [DECK + 33, 1.8], [TOP - 2.5, 2.6]].forEach(([y, h]) => ggAdd(E.rectShape(8.6, h, tx, y), 0.2, 1.0)); });
    ggAdd(E.rectShape(320, 1.6, 0, DECK), 0.1, 2.0);
    const cableY = (x) => { const ax = Math.abs(x); if (ax <= TWX) return DECK + 1.6 + (TOP - DECK - 1.6) * (x / TWX) ** 2; return DECK + 0.8 + (TOP - DECK - 0.8) * Math.pow(clamp((150 - ax) / (150 - TWX), 0, 1), 1.7); };
    { const pts = []; for (let x = -150; x <= 150; x += 2) pts.push([x, cableY(x)]); ggAdd(strip(pts, 0.75), 0.5, 0.4);
      const sus = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 1, 0.16), flat(GGHEX), 100); const d = new THREE.Object3D(); let k = 0;
      for (let x = -146; x <= 146 && k < 100; x += 3) { if (Math.abs(Math.abs(x) - TWX) < 4) continue; const y0 = DECK + 0.8, y1 = cableY(x); d.position.set(x, (y0 + y1) / 2, 0.7); d.scale.set(1, Math.max(0.1, y1 - y0), 1); d.updateMatrix(); sus.setMatrixAt(k++, d.matrix); }
      sus.count = k; GG.add(sus); }
    const ggTopLights = [-TWX, TWX].map((tx) => { const g = glow(9, "#ffcf9a", radTex); g.position.set(tx, TOP + 3.2, 2); GG.add(g); return g; });
    // cars on the deck: tiny warm and white points moving both ways
    const nCars = 30; const cars = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.1, 0.5), new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false }), nCars);
    const carD = []; for (let i = 0; i < nCars; i++) { const dir = i % 2 ? 1 : -1; carD.push({ dir, x0: R() * 320, v: 5 + R() * 4, y: DECK + 1.15 + (dir > 0 ? 0 : 0.35) });
      cars.setColorAt(i, dir > 0 ? new THREE.Color("#ffe8c8").multiplyScalar(1.3) : new THREE.Color(C.amber).multiplyScalar(1.0)); }
    cars.position.z = 2.2; GG.add(cars);

    // ---------------- the city ----------------
    const WIN = []; // {x,y,z,w,h, lit, amberK, tc (cyan time), soft, grp}
    const BLD = [];
    const addWindows = (x, z, w, h, base, grp, litP = 0.22, opts = {}) => {
      const cw = opts.cw || 1.75, rh = opts.rh || 2.45; const cols = Math.max(1, Math.floor((w - 1.0) / cw)), rows = Math.max(1, Math.floor((h - 2.0) / rh));
      const x0 = x - (cols - 1) * cw / 2;
      for (let r = 0; r < rows; r++) { const y = base + 1.9 + r * rh; if (opts.skip && opts.skip(y)) continue;
        for (let c = 0; c < cols; c++) { const lit = R() < litP; WIN.push({ x: x0 + c * cw, y, z, w: cw * 0.52, h: rh * 0.5, lit, amberK: 0.35 + R() * 0.55, tc: Infinity, soft: false, grp, fl: R() }); } } };
    const building = (x, z, w, h, d, hex, grp = "city", litP) => { const b = E.box(w, h, d, hex); b.position.set(x, -6 + h / 2, z); scene.add(b); BLD.push(b);
      if (R() < 0.35 && h > 12) { const cap = E.box(w * 0.55, 1.4, d * 0.55, hex); cap.position.set(x + (R() - 0.5) * w * 0.3, -6 + h + 0.7, z); scene.add(cap); }
      addWindows(x, z + d / 2 + 0.03, w, h, -6, grp, litP); return b; };

    // the lab (hollow, with the hero room on a double-height glass floor)
    const LX = 10, LZ = -30, LW = 11, LH = 27, LD = 10, FRONT = LZ + LD / 2; // front face z = -25
    const RY = 12, RH = 3.6, RW = 5.2, RD = 6.2, WX = 2.4, WY0 = RY + 0.55, WY1 = RY + 3.05; // room floor / height / width / depth; window opening
    const LABHEX = "#1f2b4a";
    { const s = E.rectShape(LW, LH, 0, LH / 2); const hp = new THREE.Path(); hp.moveTo(-WX, WY0 + 6); hp.lineTo(WX, WY0 + 6); hp.lineTo(WX, WY1 + 6); hp.lineTo(-WX, WY1 + 6); hp.lineTo(-WX, WY0 + 6); s.holes.push(hp);
      const f = E.extrude(s, LABHEX, 0.4); f.position.set(LX, -6, FRONT - 0.4); scene.add(f);
      const body = (w, h, d, x, y, z, hex = LABHEX) => { const b = E.box(w, h, d, hex); b.position.set(x, y, z); scene.add(b); return b; };
      const zb = LZ - LD / 2, zf = FRONT - 0.4;
      body(LW, RY + 6, zf - zb, LX, -6 + (RY + 6) / 2, (zb + zf) / 2);
      body(LW, LH - 6 - (RY + RH) - 0, zf - zb, LX, (RY + RH + 21) / 2, (zb + zf) / 2);
      body((LW - RW) / 2, RH, zf - zb, LX - RW / 2 - (LW - RW) / 4, RY + RH / 2, (zb + zf) / 2);
      body((LW - RW) / 2, RH, zf - zb, LX + RW / 2 + (LW - RW) / 4, RY + RH / 2, (zb + zf) / 2);
      body(RW, RH, (zf - RD) - zb, LX, RY + RH / 2, (zb + zf - RD) / 2);
      const cap = body(LW * 0.6, 1.6, LD * 0.6, LX - 1, 21 + 0.8, LZ); // roof plant
      // window mullions (thin, so the camera can pass between them)
      [-WX, WX].forEach((x) => body(0.16, WY1 - WY0, 0.3, LX + x, (WY0 + WY1) / 2, FRONT - 0.15, "#2a3961"));
      body(WX * 2 + 0.16, 0.14, 0.34, LX, WY0, FRONT - 0.12, "#2a3961"); body(WX * 2 + 0.16, 0.14, 0.34, LX, WY1, FRONT - 0.12, "#2a3961");
      addWindows(LX, FRONT + 0.03, LW, LH, -6, "lab", 0.55, { skip: (y) => y > RY - 0.6 && y < RY + RH + 0.4 }); }

    // cluster neighbours (the "few buildings")
    building(-4, -38, 9, 22, 8, "#1d2846", "cl", 0.55);
    building(25, -40, 10, 32, 9, "#1b2644", "cl", 0.5);
    building(35, -27, 8, 19, 8, "#1e2a49", "cl", 0.55);
    // Transamerica pyramid (+ wings + spire)
    const TA = new THREE.Group(); TA.position.set(-22, -6, -58); scene.add(TA);
    { const m = new THREE.Mesh(new THREE.ConeGeometry(6.6, 66, 4, 1), E.paperMats("#22304f")); m.rotation.y = Math.PI / 4; m.position.y = 33; m.castShadow = m.receiveShadow = true; TA.add(m);
      [-1, 1].forEach((sd) => { const w = new THREE.Mesh(new THREE.ExtrudeGeometry(E.polyShape([[0, 0], [1.4, 3], [1.4, 11], [0, 14]]), { depth: 2.2, bevelEnabled: false }), E.paperMats("#22304f"));
        w.position.set(sd * 1.55, 40, -1.1); w.scale.x = sd; w.castShadow = true; TA.add(w); });
      const sp = E.box(0.3, 9, 0.3, "#22304f"); sp.position.y = 70; TA.add(sp);
      for (let i = 0; i < 9; i++) { const y = 4 + i * 4.2, half = 6.6 * (1 - y / 66) * 0.62; for (let c = -1; c <= 1; c += 2) if (R() < 0.6) WIN.push({ x: -22 + c * half * 0.5, y: -6 + y, z: -58 + 6.6 * 0.71 * (1 - y / 66) + 0.1, w: 0.7, h: 1.0, lit: R() < 0.5, amberK: 0.5, tc: Infinity, grp: "city", fl: R() }); } }
    const taLight = glow(6, "#ffe2b8"); taLight.position.set(-22, -6 + 75, -57.5); scene.add(taLight);
    // Salesforce tower (rounded crown)
    { const w = 10, h = 76; const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2 * 0.86, h - 9); s.quadraticCurveTo(w / 2 * 0.75, h, 0, h + 1.5); s.quadraticCurveTo(-w / 2 * 0.75, h, -w / 2 * 0.86, h - 9); s.lineTo(-w / 2, 0);
      const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 9, bevelEnabled: false, curveSegments: 24 }), E.paperMats("#202d4d")); m.position.set(50, -6, -70); m.castShadow = m.receiveShadow = true; scene.add(m);
      addWindows(50, -61 + 0.03, 8.6, h - 10, -6, "city", 0.25, { cw: 1.6 }); }
    const sfCrown = glow(14, "#cfe2ff", radTex, 0.5); sfCrown.position.set(50, -6 + 72, -60.5); scene.add(sfCrown);
    // Telegraph Hill + Coit Tower
    { const s = new THREE.Shape(); s.moveTo(-26, 0); for (let x = -26; x <= 26; x += 2) s.lineTo(x, 14 * Math.exp(-((x / 13) ** 2))); s.lineTo(26, 0);
      const m = E.extrude(s, "#1a2542", 14); m.position.set(-58, -6, -78); scene.add(m);
      const ct = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.35, 11, 20), E.paperMats("#253459")); ct.position.set(-58, -6 + 13.6 + 5.5, -71); ct.castShadow = true; scene.add(ct);
      const top = E.box(3.0, 0.7, 3.0, "#253459"); top.position.set(-58, -6 + 13.6 + 11.2, -71); scene.add(top); }
    // generic blocks (downtown taller around x≈15, lower toward the edges; the near row stays low)
    const avoid = [[10, -30, 9], [-4, -38, 7], [25, -40, 7], [35, -27, 6], [-22, -58, 8], [50, -66, 8], [-58, -74, 16]];
    [[-14, 0.3, 6], [-24, 0.42, 10], [-47, 0.62, 6], [-64, 0.5, 8]].forEach(([z0, hk, sp]) => {
      for (let x = -150; x < 160;) { const w = 5 + R() * 6, d = 5 + R() * 4, z = z0 - R() * 5; const cx = x + w / 2; x += w + 0.8 + R() * 1.6;
        if (avoid.some(([ax, az, ar]) => Math.abs(cx - ax) < ar + w / 2 && Math.abs(z - az) < ar + d / 2)) continue;
        let h = (5 + 30 * Math.exp(-(((cx - 12) / 48) ** 2)) * (0.5 + R() * 0.7) + R() * 5) * hk + 3;
        if (z0 === -14) h = Math.min(h, cx > -6 && cx < 30 ? 7.5 : 11);
        const hex = ["#1a2442", "#1c2746", "#1f2a4b", "#212e50"][Math.floor(R() * 4)];
        building(cx, z, w, h, d, hex, "city", 0.12); } });
    // a waterfront avenue: car lights at the foot of the city
    const nAv = 26; const av = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.9, 0.35), new THREE.MeshBasicMaterial({ color: 0xffffff }), nAv); const avD = [];
    for (let i = 0; i < nAv; i++) { const dir = i % 2 ? 1 : -1; avD.push({ dir, x0: R() * 300, v: 4 + R() * 3 }); av.setColorAt(i, dir > 0 ? new THREE.Color("#ffe8c8").multiplyScalar(1.1) : new THREE.Color(C.amber).multiplyScalar(0.9)); }
    av.position.set(0, -5.6, -84); scene.add(av);

    // windows (one InstancedMesh for the whole city)
    const NW = WIN.length; const winIM = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ color: 0xffffff }), NW);
    { const d = new THREE.Object3D(); WIN.forEach((w, i) => { d.position.set(w.x, w.y, w.z); d.scale.set(w.w, w.h, 1); d.updateMatrix(); winIM.setMatrixAt(i, d.matrix); winIM.setColorAt(i, new THREE.Color("#141c33")); }); }
    scene.add(winIM);
    // schedule: cluster amber windows turn cyan one by one (beat 3); later a quiet wave across the city (beat 9)
    { const cl = WIN.filter((w) => (w.grp === "cl" || w.grp === "lab") && w.lit); for (let i = cl.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [cl[i], cl[j]] = [cl[j], cl[i]]; }
      const t0 = T.there + 0.7, t1 = T.sfEnd - 0.2; cl.forEach((w, k) => { w.tc = t0 + (t1 - t0) * Math.pow(k / Math.max(1, cl.length - 1), 0.75); });
      WIN.forEach((w) => { if (w.grp !== "city") return; const dist = Math.hypot(w.x - LX, w.z - LZ); if (R() < (w.lit ? 0.85 : 0.22) && dist < 150) { w.tc = T.what + 0.3 + dist / 13 + R() * 1.6; w.soft = true; } }); }
    const cDark = new THREE.Color("#141c33"), cAmb = new THREE.Color(C.amber), cCy = new THREE.Color(C.cyan), _c = new THREE.Color();
    const winColor = (w, t, i) => {
      const fl = 1 + 0.06 * Math.sin(t * (3 + w.fl * 5) + i);
      if (t >= w.tc) { const k = w.soft ? smooth(w.tc, w.tc + 0.7, t) : (t < w.tc + 0.22 ? (Math.sin((t - w.tc) * 70) > 0 ? 0.7 : 0.15) : 1);
        const from = w.lit ? _c.copy(cAmb).multiplyScalar(w.amberK) : _c.copy(cDark); return from.lerp(new THREE.Color(C.cyan).multiplyScalar(1.5 * fl), k); }
      if (w.lit) return _c.copy(cAmb).multiplyScalar(w.amberK * fl); return _c.copy(cDark); };

    // ---------------- the room behind the hero window ----------------
    const ROOM = new THREE.Group(); ROOM.position.set(LX, RY, FRONT - 0.4); scene.add(ROOM); // local: x across, y up from floor, z 0 (inner window plane) → -RD (back wall)
    const roomPlane = (w, h, hex, pos, rot) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), flat(hex)); m.position.set(...pos); m.rotation.set(...rot); m.receiveShadow = true; ROOM.add(m); return m; };
    roomPlane(RW, RD, "#262a3e", [0, 0.01, -RD / 2], [-Math.PI / 2, 0, 0]);
    roomPlane(RW, RD, "#161d33", [0, RH - 0.01, -RD / 2], [Math.PI / 2, 0, 0]);
    roomPlane(RW, RH, "#1b2340", [0, RH / 2, -RD + 0.01], [0, 0, 0]);
    roomPlane(RD, RH, "#19203a", [-RW / 2 + 0.01, RH / 2, -RD / 2], [0, Math.PI / 2, 0]);
    roomPlane(RD, RH, "#19203a", [RW / 2 - 0.01, RH / 2, -RD / 2], [0, -Math.PI / 2, 0]);
    // the wall screen: code rows + the 80 % bar
    const SC = { x: 0.35, y: 2.0, z: -RD + 0.06, w: 3.9, h: 2.25 };
    { const fr = E.box(SC.w + 0.16, SC.h + 0.16, 0.06, "#0d1222"); fr.position.set(SC.x, SC.y, SC.z); ROOM.add(fr); }
    const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(SC.w, SC.h), new THREE.MeshBasicMaterial({ color: "#0b1830" })); screenFace.position.set(SC.x, SC.y, SC.z + 0.035); ROOM.add(screenFace);
    const ROWS = 10, RX0 = SC.x - SC.w / 2 + 0.22, RX1 = SC.x + SC.w / 2 - 0.22, RYT = SC.y + SC.h / 2 - 0.2, RSTEP = 0.155, RHGT = 0.075;
    const TOK = []; const rr = E.rng(77);
    for (let r = 0; r < ROWS; r++) { let x = RX0 + Math.floor(rr() * 4) * 0.22 * (r % 4 === 0 ? 0 : 1); const n = 1 + Math.floor(rr() * 3);
      for (let k = 0; k < n && x < RX1 - 0.3; k++) { const l = Math.min(0.25 + rr() * 1.0, RX1 - x); TOK.push({ r, a: x, b: x + l }); x += l + 0.1; } }
    const stripMat = (hex, k) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k) });
    const ambIM = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), stripMat(C.amber, 0.95), TOK.length);
    const cyIM = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), stripMat(C.cyan, 1.6), TOK.length);
    ambIM.position.z = cyIM.position.z = SC.z + 0.045; ambIM.frustumCulled = cyIM.frustumCulled = false; ROOM.add(ambIM, cyIM);
    const BAR = { x0: SC.x - SC.w / 2 + 0.22, x1: SC.x + SC.w / 2 - 0.22, y: SC.y - SC.h / 2 + 0.24, h: 0.17 };
    { const bw = BAR.x1 - BAR.x0; const fr = new THREE.Mesh(new THREE.PlaneGeometry(bw + 0.06, BAR.h + 0.06), new THREE.MeshBasicMaterial({ color: "#2a3a5c" })); fr.position.set((BAR.x0 + BAR.x1) / 2, BAR.y, SC.z + 0.04); ROOM.add(fr);
      for (let i = 1; i < 10; i++) { const tk = new THREE.Mesh(new THREE.PlaneGeometry(0.012, BAR.h + 0.1), new THREE.MeshBasicMaterial({ color: "#3a4a6c" })); tk.position.set(BAR.x0 + bw * i / 10, BAR.y, SC.z + 0.05); ROOM.add(tk); } }
    const barGeo = new THREE.PlaneGeometry(1, 1).translate(0.5, 0, 0);
    const barCy = new THREE.Mesh(barGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan).multiplyScalar(1.7) })); barCy.position.set(BAR.x0, BAR.y, SC.z + 0.046); barCy.scale.y = BAR.h; ROOM.add(barCy);
    const barAm = new THREE.Mesh(barGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(C.amber).multiplyScalar(1.05) })); barAm.position.set(BAR.x0, BAR.y, SC.z + 0.045); barAm.scale.y = BAR.h; ROOM.add(barAm);
    // the engineer at a desk (left), with a small amber monitor and lamp
    const desk = new THREE.Group(); desk.position.set(-1.0, 0, -3.9); ROOM.add(desk);
    { const top = E.box(1.7, 0.07, 0.8, "#2b2c40"); top.position.y = 0.76; desk.add(top); [-0.78, 0.78].forEach((x) => { const l = E.box(0.06, 0.76, 0.7, "#24253a"); l.position.set(x, 0.38, 0); desk.add(l); });
      const mon = E.box(0.06, 0.42, 0.62, "#141522"); mon.position.set(0.55, 1.03, 0); desk.add(mon); }
    const monGlow = E.glowPlane(0.025, 0.36, C.amber); monGlow.position.set(0.515, 1.04, 0); monGlow.rotation.y = -Math.PI / 2; desk.add(monGlow);
    const monSide = E.glowPlane(0.5, 0.34, C.amber); monSide.position.set(0.515, 1.04, 0.0); monSide.rotation.y = -Math.PI / 2; desk.add(monSide);
    const lampArm = E.box(0.04, 0.5, 0.04, "#2b2c40"); lampArm.position.set(-0.6, 1.02, -0.2); lampArm.rotation.z = 0.35; desk.add(lampArm);
    const lampShade = E.box(0.22, 0.1, 0.14, "#3a3046"); lampShade.position.set(-0.5, 1.27, -0.2); desk.add(lampShade);
    const lampBulb = glow(0.7, C.amber); lampBulb.position.set(-0.47, 1.2, -0.12); desk.add(lampBulb);
    const deskLamp = E.pointLight(C.amber, 0, 5); deskLamp.position.set(-0.4, 1.1, -0.1); desk.add(deskLamp);
    const eng = E.figure({ pose: "sit", hair: "short", hex: "#120d10", scale: 0.95, seed: 5 }); eng.position.set(-0.75, 0.0, 0.05); desk.add(eng);
    const chair = E.box(0.5, 0.06, 0.5, "#24253a"); chair.position.set(-0.55, 0.5, 0); desk.add(chair);
    // the writing light (cursor) and room lights
    const cursor = new THREE.Group(); ROOM.add(cursor);
    const curDot = glow(0.18, "#e9fbff"); const curHalo = glow(0.8, C.cyan); cursor.add(curHalo, curDot);
    const curLight = E.pointLight(C.cyan, 0, 7); cursor.add(curLight);
    const roomCy = E.pointLight(C.cyan, 0, 12); roomCy.position.set(SC.x, SC.y, -RD + 1.4); ROOM.add(roomCy);
    // the hero window from outside: a cyan pane + halo that give way as the camera comes in
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(WX * 2, WY1 - WY0), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan), transparent: true, opacity: 1, depthWrite: false }));
    pane.position.set(LX, (WY0 + WY1) / 2, FRONT + 0.02); scene.add(pane);
    const winHalo = glow(10, C.cyan, radTex, 1); winHalo.position.set(LX, (WY0 + WY1) / 2, FRONT + 0.3); scene.add(winHalo);
    const winSpill = E.pointLight(C.cyan, 0, 24); winSpill.position.set(LX, (WY0 + WY1) / 2, FRONT + 2.5); scene.add(winSpill);

    // ---------------- the rings (the machine as a circle) ----------------
    const RINGS = [ // radius, width, draw start, draw duration
      { r: 0.36, w: 0.055, s: T.research, d: T.ai2 - T.research },
      { r: 2.6, w: 0.2, s: T.b1, d: 0.85 },
      { r: 7.0, w: 0.42, s: T.b2, d: 0.62 },
      { r: 15, w: 0.75, s: T.one - 0.02, d: 0.42 },
      { r: 29, w: 1.2, s: T.an - 0.05, d: 0.3 },
      { r: 50, w: 1.8, s: T.intel + 0.18, d: 0.26 },
    ];
    const RG = new THREE.Group(); scene.add(RG);
    const SEG = 180;
    RINGS.forEach((q) => { const geo = new THREE.RingGeometry(q.r - q.w, q.r, SEG, 1); const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      m.renderOrder = 6; RG.add(m); q.m = m; const h = glow(q.r * 3.2, C.cyan, softTex, 1); h.renderOrder = 4; RG.add(h); q.h = h; });
    const spark = new THREE.Group(); const spDot = glow(1, "#effdff"), spHalo = glow(4, C.cyan); spark.add(spHalo, spDot); scene.add(spark);
    const nBoom = 26; const boomIM = new THREE.InstancedMesh(new THREE.RingGeometry(0.955, 1, 160, 1), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false }), nBoom);
    boomIM.frustumCulled = false; boomIM.renderOrder = 6; RG.add(boomIM);
    for (let i = 0; i < nBoom; i++) boomIM.setColorAt(i, new THREE.Color(0, 0, 0));
    const ringLight = E.pointLight(C.cyan, 0, 160); scene.add(ringLight);
    const coreGlow = glow(30, C.cyan, softTex, 1); coreGlow.renderOrder = 4; RG.add(coreGlow);
    // ring centre path (world): room → out of the window → above the roof → high over the city
    const RC1 = V(LX + 0.95, RY + 2.05, FRONT - 0.4 - 3.0);
    const qb = (a, b, c, k) => a.clone().multiplyScalar((1 - k) * (1 - k)).add(b.clone().multiplyScalar(2 * k * (1 - k))).add(c.clone().multiplyScalar(k * k));
    const ringCentre = (t) => {
      if (t < T.sci) return RC1.clone().add(V(0.03 * wob(t, 1, 2), 0.04 * Math.sin(t * 1.3), 0));
      if (t < T.b1) { const k = inOut(lin(T.sci, T.b1, t)); return qb(RC1, V(LX + 0.4, RY + 1.9, FRONT + 6), V(LX + 1.5, 26, LZ - 1), k); }
      const k = sineInOut(lin(T.b1, T.boom + 0.6, t)); return V(lerp(LX + 1.5, LX + 3, k), lerp(26, 36, k) + 0.4 * Math.sin(t * 0.7), lerp(LZ - 1, LZ - 8, k));
    };

    // ---------------- foreground: the street on the hill ----------------
    const terrace = E.box(700, 6, 46, "#121a2f"); terrace.position.set(0, -3, 19); scene.add(terrace);
    const walk = E.box(700, 0.22, 6.5, "#222c48"); walk.position.set(0, 0.11, 10.6); scene.add(walk);
    const curb = E.box(700, 0.3, 0.35, "#2e3a5c"); curb.position.set(0, 0.15, 7.4); scene.add(curb);
    { const n = 60; const im = new THREE.InstancedMesh(new THREE.PlaneGeometry(2.2, 0.16), new THREE.MeshBasicMaterial({ color: new THREE.Color("#8a8778").multiplyScalar(0.35) }), n); const d = new THREE.Object3D();
      for (let i = 0; i < n; i++) { d.position.set(-180 + i * 6, 0.012, 2.6); d.rotation.x = -Math.PI / 2; d.updateMatrix(); im.setMatrixAt(i, d.matrix); } scene.add(im);
      const j = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.05, 6.4), new THREE.MeshBasicMaterial({ color: "#18203a" }), 120);
      for (let i = 0; i < 120; i++) { d.position.set(-180 + i * 3, 0.225, 10.6); d.rotation.x = -Math.PI / 2; d.updateMatrix(); j.setMatrixAt(i, d.matrix); } scene.add(j); }
    // the railing at the hill edge (balusters)
    { const rail = E.box(700, 0.18, 0.3, "#2a3556"); rail.position.set(0, 1.05, -3.6); scene.add(rail);
      const n = 260; const im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 1.0, 0.12), flat("#222c4a"), n); im.castShadow = true; const d = new THREE.Object3D();
      for (let i = 0; i < n; i++) { d.position.set(-130 + i * 1.0, 0.5, -3.6); d.updateMatrix(); im.setMatrixAt(i, d.matrix); } scene.add(im); }
    // Victorian row houses (left), paper silhouettes with bay windows and warm windows
    const VIC = new THREE.Group(); scene.add(VIC);
    [[-49, 5.4, 9.6, "#1f2a4a"], [-43.2, 5.2, 10.4, "#232f52"], [-37.6, 5.4, 9.2, "#1d2847"], [-32, 5.4, 10.0, "#222d4f"], [-26.4, 5.2, 9.4, "#1f2a4a"]].forEach(([x, w, h, hex], i) => {
      const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h); s.lineTo(w / 2 + 0.25, h); s.lineTo(0, h + w * 0.55); s.lineTo(-w / 2 - 0.25, h); s.lineTo(-w / 2, h); s.lineTo(-w / 2, 0);
      const m = E.extrude(s, hex, 5); m.position.set(x, 0, -9.0); VIC.add(m);
      const bay = E.extrude(E.polyShape([[-1.3, 0], [1.3, 0], [1.3, 5.2], [-1.3, 5.2]]), hex, 0.9); bay.position.set(x - 0.6, 1.2, -4.0); VIC.add(bay);
      const cor = E.box(w + 0.5, 0.35, 0.5, "#2c3a62"); cor.position.set(x, h, -4.0); VIC.add(cor);
      const st = E.box(1.3, 0.9, 1.2, hex); st.position.set(x + 1.6, 0.45, -3.5); VIC.add(st);
      [[x - 0.6, 2.4], [x - 0.6, 5.0], [x + 1.6, 5.0], [x + 1.6, 7.4], [x - 0.6, 7.4]].forEach(([wx, wy], k) => { const lit = (i * 5 + k) % 3 === 0;
        const p = E.glowPlane(0.9, 1.4, lit ? C.amber : "#141c33"); if (lit) p.userData.setGlow(0.55 + 0.2 * ((i + k) % 2)); p.position.set(wx, wy, wy < 6.4 && wx < x ? -3.08 : -3.97); VIC.add(p); }); });
    // sidewalk trees
    const trees = [[-19, 6.6], [-4.4, 6.8], [20.4, 6.6]].map(([x, z], i) => { const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
      const tr = E.box(0.25, 3.2, 0.25, "#141a2c"); tr.position.y = 1.6; g.add(tr);
      const crown = new THREE.Group(); crown.position.y = 4.1; g.add(crown);
      [[0, 0, 1.6], [-1.0, -0.4, 1.1], [1.0, -0.3, 1.2], [0.3, 0.9, 1.1]].forEach(([cx, cy, r], k) => { const c = E.extrude(E.circleShape(r), ["#141d33", "#17213a", "#121a2e"][k % 3], 0.3); c.position.set(cx, cy, -0.4 + k * 0.12); crown.add(c); });
      return crown; });
    // walking: speed profile integrated once (deterministic)
    const walkK = (t) => clamp(1 - smooth(27.3, T.boom - 0.15, t) + smooth(T.arrives + 0.1, T.arrives + 1.0, t) - smooth(41.2, 43.0, t), 0, 1);
    const XT = []; { let x = -14.2; for (let i = 0; i <= 47 * 60; i++) { XT.push(x); x += 0.52 * walkK(i / 60) / 60; } }
    const figX = (t) => { const f = clamp(t, 0, 47) * 60, i = Math.floor(f); return lerp(XT[i], XT[Math.min(i + 1, XT.length - 1)], f - i); };
    // street lamps: post, arm, head, bulb, halo, pool; A and B carry the real (shadowed) light
    const XB = figX(T.boom) + 1.15, XA = figX(4.3) + 0.9;
    const LAMPS = [XA - 12.4, XA, XB, XB + 12.6, XB + 25.2, XB + 37.8].map((x, i) => { const g = new THREE.Group(); g.position.set(x, 0, 7.9); scene.add(g);
      const post = E.box(0.16, 4.7, 0.16, "#151b2e"); post.position.y = 2.35; g.add(post);
      const base = E.box(0.36, 0.5, 0.36, "#151b2e"); base.position.y = 0.25; g.add(base);
      const arm = E.box(0.1, 0.1, 1.1, "#151b2e"); arm.position.set(0, 4.6, 0.5); g.add(arm);
      const head = E.extrude(E.polyShape([[-0.32, 0], [0.32, 0], [0.18, 0.3], [-0.18, 0.3]]), "#1c2236", 0.5); head.position.set(0, 4.32, 0.82); g.add(head);
      const bulb = E.glowPlane(0.46, 0.08, "#fff0d0"); bulb.userData.setGlow(1.6); bulb.rotation.x = -Math.PI / 2; bulb.position.set(0, 4.31, 1.07); g.add(bulb);
      const halo = glow(3.2, C.amber, radTex, 0.8); halo.position.set(0, 4.15, 1.3); g.add(halo);
      const pool = new THREE.Mesh(new THREE.PlaneGeometry(9, 7), new THREE.MeshBasicMaterial({ map: softTex, color: new THREE.Color(C.amber).multiplyScalar(0.32), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      pool.rotation.x = -Math.PI / 2; pool.position.set(0, 0.235, 2.2); g.add(pool);
      return { g, x, halo, pool, bulb, ph: i * 1.7 }; });
    const spotFor = (x) => { const s = new THREE.SpotLight("#ffb766", 60, 15, 0.82, 0.75, 1.4); s.position.set(x, 4.25, 8.95); s.target.position.set(x + 0.3, 0, 10.4);
      s.castShadow = true; s.shadow.mapSize.set(1024, 1024); s.shadow.radius = 6; s.shadow.bias = -0.0015; s.shadow.camera.near = 0.5; s.shadow.camera.far = 16; scene.add(s, s.target); return s; };
    const spotA = spotFor(XA), spotB = spotFor(XB);

    // ---------------- the figure ("you") with a phone ----------------
    const FZ = 10.2;
    const fig = E.figure({ pose: "stand", hair: "short", coat: true, hex: "#0b0810", seed: 2 }); scene.add(fig);
    const rim = E.figure({ pose: "stand", hair: "short", coat: true, hex: C.amber, seed: 2 }); scene.add(rim);
    fig.traverse((o) => { if (o.isMesh) o.castShadow = true; });
    // the phone: dark body + cream screen (a feed that the thumb flicks; it ends on a blank page)
    const PH = { w: 0.13, h: 0.24 };
    const phone = new THREE.Group(); scene.add(phone);
    const phBody = E.box(PH.w + 0.018, PH.h + 0.024, 0.014, "#0c0b12"); phone.add(phBody);
    const scrC = document.createElement("canvas"); scrC.width = 512; scrC.height = Math.round(512 * PH.h / PH.w); const sg = scrC.getContext("2d");
    const scrTex = new THREE.CanvasTexture(scrC); scrTex.colorSpace = THREE.SRGBColorSpace; scrTex.anisotropy = 8;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(PH.w, PH.h), new THREE.MeshBasicMaterial({ map: scrTex, toneMapped: false, fog: false })); screen.position.z = 0.0075; phone.add(screen);
    const phHalo = glow(1.0, "#ffe2bf", radTex, 0.9); phHalo.position.z = 0.02; phone.add(phHalo);
    const CREAM = "#e4e3df";
    const feed = []; { const fr = E.rng(55); let y = 40; for (let i = 0; i < 9; i++) { const img = fr() < 0.6; const hgt = img ? 380 : 210; feed.push({ y, hgt, img, lines: 2 + Math.floor(fr() * 2), hue: fr() }); y += hgt + 36; } }
    const FEED_END = feed.at(-1).y + feed.at(-1).hgt + 40;
    let lastScroll = -1;
    const drawScreen = (scroll) => { const s = Math.round(scroll); if (s === lastScroll) return; lastScroll = s; const W2 = scrC.width, H2 = scrC.height;
      sg.fillStyle = CREAM; sg.fillRect(0, 0, W2, H2);
      feed.forEach((f) => { const y = f.y - s; if (y > H2 || y + f.hgt < 0) return;
        sg.fillStyle = "rgba(40,38,48,0.10)"; sg.beginPath(); sg.roundRect(28, y, W2 - 56, f.hgt, 22); sg.fill();
        sg.fillStyle = "rgba(40,38,48,0.28)"; sg.beginPath(); sg.arc(68, y + 44, 20, 0, 7); sg.fill(); sg.fillRect(100, y + 32, 170, 14); sg.fillStyle = "rgba(40,38,48,0.16)"; sg.fillRect(100, y + 54, 110, 10);
        let yy = y + 92; if (f.img) { sg.fillStyle = `rgba(${90 + f.hue * 60 | 0},${100 + f.hue * 30 | 0},130,0.32)`; sg.beginPath(); sg.roundRect(48, yy, W2 - 96, 170, 14); sg.fill(); yy += 190; }
        sg.fillStyle = "rgba(40,38,48,0.22)"; for (let k = 0; k < f.lines; k++) { sg.fillRect(48, yy + k * 26, (W2 - 96) * (k === f.lines - 1 ? 0.55 : 0.92), 12); } });
      scrTex.needsUpdate = true; };
    // thumb flicks: every ~1.9 s a quick scroll with a long ease-out; the last flick runs past the end of the feed
    const FLICKS = []; { let t = 2.0, acc = 0; const fr = E.rng(9); while (t < 42.4) { const amt = 110 + fr() * 170; FLICKS.push({ t, amt }); acc += amt; t += 1.5 + fr() * 1.1; } }
    const scrollAt = (t) => { let s = 0; for (const f of FLICKS) { if (t < f.t) break; s += f.amt * expoOut(lin(f.t, f.t + 0.9, t)); }
      const base = s % (FEED_END - 900); const fin = expoOut(lin(42.9, 44.5, t)); return lerp(base, FEED_END + 40, fin); };
    const _hp = new THREE.Vector3();

    // ---------------- DOM text ----------------
    const layer = E.layer;
    const stamp = E.stampDOM(layer, [{ t: T.san, year: "2026", label: "San Francisco" }], T.writing);
    const src1 = E.srcDOM(layer, { big: "&gt;80% of code", small: "Anthropic, 2026", inAt: T.eighty - 0.12, outAt: T.then - 0.2 });
    const src2 = E.srcDOM(layer, { small: "OpenAI · automated research intern · Sept 2026", inAt: T.research - 0.05, outAt: T.sci - 0.3 });
    const tIn = T.voEnd + 0.4, tOut = 43.2;
    const title1 = E.titleDOM(layer, { text: "Has the Intelligence Explosion", inAt: tIn, outAt: tOut, size: 104 });
    const title2 = E.titleDOM(layer, { text: "Already Begun?", inAt: tIn + 0.32, outAt: tOut + 0.12, size: 104 });
    title1.el.style.top = "27%"; title2.el.style.top = "38.5%";
    title2.el.querySelectorAll("span > span").forEach((s) => (s.style.fontStyle = "italic"));

    // ---------------- camera ----------------
    const KEYS = [
      { t: T0, p: [-6, 14.5, 50], l: [4, 5.5, -60] },
      { t: T.and - 0.2, p: [-6.6, 13.6, 47.5], l: [4, 5.5, -60], ease: "sine" },
      { t: T.there, p: [-14.6, 2.5, 19.5], l: [-2, 4.9, -30], ease: "inOut", arc: 0.5 },
      { t: T.date, p: [-12.6, 6.0, 19.5], l: [2, 9, -30], ease: "sine" },
      { t: T.buildings, p: [-2, 13, 5], l: [9, 12.5, -32], ease: "sine", arc: 0.3 },
      { t: T.the, p: [6.8, 14.2, -9], l: [10, 13.8, -30], ease: "sine" },
      { t: T.code - 0.1, p: [LX + 0.25, 13.62, FRONT - 0.15], l: [LX + 0.25, 13.8, -36], ease: "inOut", arc: 0.05 },
      { t: T.then, p: [LX + 0.3, 13.6, FRONT - 0.55], l: [LX + 0.3, 13.85, -36], ease: "sine" },
      { t: T.sci - 0.1, p: [LX + 0.45, 13.62, FRONT - 0.8], l: [LX + 0.75, 13.95, -36], ease: "sine" },
      { t: T.b1, p: [LX - 1, 17, FRONT + 18], l: [LX + 1.5, 24, -30], ease: "inOut", arc: 0.15 },
      { t: T.b2 + 0.3, p: [2, 10.5, 30], l: [LX + 2, 26, -30], ease: "sine", arc: 0.2 },
      { t: T.boom - 0.12, p: [-3.4, 1.7, 27], l: [5, 15.5, -40], ease: "inOut", arc: 0.2 },
      { t: T.we, p: [-4.0, 1.6, 28.6], l: [5, 16.5, -40], ease: "sine" },
      { t: T.onceEnd + 0.4, p: [-2.6, 1.9, 25], l: [3, 12, -40], ease: "sine" },
      { t: T.busy, p: [5.8, 2.3, 19.2], l: [-16, 7, -40], ease: "inOut", arc: 0.25 },
      { t: 42.6, p: [6.2, 2.1, 17.6], l: [-14, 6, -40], ease: "sine" },
      { t: T1, p: [6.4, 2.0, 16.6], l: [-13, 5.5, -40], ease: "sine" },
    ];
    const PUSH0 = 42.2;

    const post = { bloom: 0.55, exposure: 1.15 };
    const _o = new THREE.Object3D();
    const halos = [];
    LAMPS.forEach((L) => halos.push(L.halo)); halos.push(winHalo, moonHalo, phHalo, curHalo, curDot, spDot, spHalo, lampBulb, taLight, sfCrown, ...ggTopLights);

    scene.traverse((o) => { if (o.isInstancedMesh) o.frustumCulled = false; });
    return {
      scene, camera, post,
      update(t) {
        // ---- world motion: stars, clouds, bay, cars ----
        starD.forEach((s, i) => { stars.setColorAt(i, _c.set("#d9d2bd").multiplyScalar(s.b * (0.75 + 0.25 * Math.sin(t * s.sp + s.ph)))); }); stars.instanceColor.needsUpdate = true;
        clouds.forEach((c, i) => { c.m.position.x = c.x + t * c.v; c.m.position.y = c.y + 0.6 * Math.sin(t * 0.2 + i); });
        hills.forEach((h, i) => (h.position.x = 0.6 * Math.sin(t * 0.05 + i)));
        shD.forEach((s, i) => { const k = Math.pow(Math.max(0, Math.sin(t * s.sp + s.ph)), 3);
          _o.position.set(s.x + 1.2 * Math.sin(t * 0.3 + s.ph), 0, s.z); _o.rotation.set(0, 0, 0); _o.scale.set(s.l * (0.6 + 0.4 * k), 1, 0.32); _o.updateMatrix(); shimmer.setMatrixAt(i, _o.matrix);
          const boomK = s.hue === 2 ? 1 + 3 * smooth(T.boom, T.boom + 0.5, t) * (1 - smooth(T.we, T.onceEnd, t)) : 1;
          shimmer.setColorAt(i, _c.copy(SH_COL[s.hue === 2 && t < T.there ? 1 : s.hue]).multiplyScalar(s.b * k * boomK)); });
        shimmer.position.y = -5.9; shimmer.instanceMatrix.needsUpdate = true; shimmer.instanceColor.needsUpdate = true;
        carD.forEach((c, i) => { const x = ((c.x0 + c.dir * c.v * t) % 320 + 320) % 320 - 160; _o.position.set(x, c.y, 0); _o.scale.set(1, 1, 1); _o.updateMatrix(); cars.setMatrixAt(i, _o.matrix); }); cars.instanceMatrix.needsUpdate = true;
        avD.forEach((c, i) => { const x = ((c.x0 + c.dir * c.v * t) % 300 + 300) % 300 - 150; _o.position.set(x, c.dir > 0 ? 0 : 0.3, 0); _o.updateMatrix(); av.setMatrixAt(i, _o.matrix); }); av.instanceMatrix.needsUpdate = true;
        ggTopLights.forEach((g, i) => g.userData.set(0.5 + 0.5 * Math.max(0, Math.sin(t * 2.2 + i * 2))));
        taLight.userData.set(0.55 + 0.45 * Math.max(0, Math.sin(t * 1.7)));
        sfCrown.userData.set(0.35 + 0.1 * Math.sin(t * 0.8) + 0.5 * smooth(T.what, T.busy, t) * 0);
        trees.forEach((c, i) => { c.rotation.z = 0.012 * Math.sin(t * 0.9 + i * 2); c.position.x = 0.04 * Math.sin(t * 0.7 + i); });
        LAMPS.forEach((L) => { const f = 1 + 0.025 * Math.sin(t * 9.3 + L.ph) * Math.sin(t * 2.1 + L.ph) + 0.02 * wob(t, L.ph, 2); L.halo.userData.set(0.5 * f); L.pool.material.opacity = f; L.bulb.userData.setGlow(1.6 * f); });
        const flickA = 1 + 0.03 * Math.sin(t * 11.1) * Math.sin(t * 2.7); spotA.intensity = 55 * flickA; spotB.intensity = 55 * (1 + 0.03 * Math.sin(t * 9.7 + 1) * Math.sin(t * 3.1));

        // ---- the hero window: anticipation flicker, then a steady cyan glow ----
        const ign = t < T.it - 0.3 ? 0 : t < T.started ? (Math.sin((t - T.it) * 47) > 0.2 ? 0.25 + 0.5 * lin(T.it - 0.3, T.started, t) : 0.06) : 1;
        const winK = t < T.started ? ign : (1 + 0.35 * Math.exp(-(t - T.started) * 4)) * (1 + 0.04 * Math.sin(t * 2.3));
        // the room's light comes from the screen; from outside the pane carries it
        const camToWin = E.camPath(KEYS, t, { arc: 0.1, drift: 1, push: 0.4, seed: 3 }).p.distanceTo(V(LX, (WY0 + WY1) / 2, FRONT));
        const paneK = 0.12 * smooth(1.2, 5.0, camToWin) + 0.88 * smooth(9.0, 30, camToWin);
        pane.material.opacity = paneK; pane.material.color.set("#141c33").lerp(_c.set(C.cyan).multiplyScalar(1.15), clamp(winK, 0, 1.2)); pane.visible = paneK > 0.01;
        winHalo.userData.set(winK * 0.55 * smooth(3, 9, camToWin) * (0.35 + 0.65 * smooth(6, 30, camToWin)) * (1 - 0.6 * smooth(T.boom, T.boom + 1, t)));
        winSpill.intensity = 7 * winK;
        roomCy.intensity = 6 * winK; deskLamp.intensity = 2.2;
        lampBulb.userData.set(0.9);

        // ---- the code wall: amber rows rewritten in cyan; bar to 80 % on "eighty" ----
        const D0 = (T.eighty - T.started2) * 0.2 / (1 - Math.pow(0.8, 8));
        let rowP = []; { let s = T.started2; for (let r = 0; r < ROWS; r++) { const d = D0 * Math.pow(0.8, r); rowP.push(r < 8 ? sineInOut(lin(s, s + d, t)) : 0); s += d; } }
        const wallDim = 1 - 0.55 * smooth(T.then, T.research, t) * (1 - smooth(T.sci, T.b1, t) * 0);
        let curX = RX0, curY = RYT, curOn = 0;
        TOK.forEach((k, i) => { const y = RYT - k.r * RSTEP; const cx = lerp(RX0, RX1, rowP[k.r]);
          const ca = k.a, cb = Math.min(k.b, cx), aa = Math.max(k.a, cx), ab = k.b;
          _o.rotation.set(0, 0, 0);
          if (cb > ca) { _o.position.set(SC.x * 0 + (ca + cb) / 2, SC.y * 0 + y, 0); _o.scale.set(cb - ca, RHGT, 1); } else { _o.position.set(0, -50, 0); _o.scale.set(0.001, 0.001, 1); }
          _o.updateMatrix(); cyIM.setMatrixAt(i, _o.matrix);
          if (ab > aa) { _o.position.set((aa + ab) / 2, y, 0); _o.scale.set(ab - aa, RHGT, 1); } else { _o.position.set(0, -50, 0); _o.scale.set(0.001, 0.001, 1); }
          _o.updateMatrix(); ambIM.setMatrixAt(i, _o.matrix); });
        cyIM.instanceMatrix.needsUpdate = true; ambIM.instanceMatrix.needsUpdate = true;
        // the cursor rides on the row being written
        { let r = 0; while (r < 7 && rowP[r] >= 1) r++; curX = lerp(RX0, RX1, rowP[r]); curY = RYT - r * RSTEP; }
        const rowsDone = rowP.reduce((a, b) => a + b, 0);
        const fillK = rowsDone / 10 + (t > T.eighty ? 0.025 * Math.exp(-(t - T.eighty) * 5) * Math.sin((t - T.eighty) * 16) : 0);
        const bw = BAR.x1 - BAR.x0; barCy.scale.x = Math.max(0.0001, bw * fillK); barAm.scale.x = bw;
        const hit = t > T.eighty ? Math.exp(-(t - T.eighty) * 3.2) : 0;
        barCy.material.color.set(C.cyan).multiplyScalar((1.05 + 1.4 * hit) * wallDim);
        cyIM.material.color.set(C.cyan).multiplyScalar((1.1 + 0.5 * hit) * wallDim); ambIM.material.color.set(C.amber).multiplyScalar(0.95 * (0.8 + 0.2 * wallDim));
        screenFace.material.color.set("#0b1830").multiplyScalar(0.6 + 0.6 * wallDim * smooth(T.started2, T.eighty, t) + 0.4);
        // cursor path: appears on "AI" (anticipation spark), writes, rests, lifts off on "Then", draws ring 1 on "research"
        const wallZ = SC.z + 0.12;
        let cp = V(curX, curY, wallZ), cOn = 0;
        if (t < T.ai) cOn = 0;
        else if (t < T.started2) { cOn = Math.sin((t - T.ai) * 40) > 0 ? 0.6 : 0.15; cp.set(RX0, RYT, wallZ); }
        else if (t < T.then) { cOn = 1; if (t > T.eighty) cp.y += 0.03 * Math.sin((t - T.eighty) * 3); }
        else { cOn = 1; const ring1 = RC1.clone().sub(ROOM.position);
          const startP = V(lerp(RX0, RX1, 1), RYT - 7 * RSTEP, wallZ);
          if (t < T.research) { const k = lin(T.then, T.research, t); const kk = k < 0.18 ? -0.25 * Math.sin(k / 0.18 * Math.PI) : inOut((k - 0.18) / 0.82); // tiny dip toward the wall, then the arc
            const a0 = 0; const goal = ring1.clone().add(V(RINGS[0].r * Math.cos(a0), RINGS[0].r * Math.sin(a0), 0));
            cp = qb(startP, V(lerp(startP.x, goal.x, 0.5) + 0.2, startP.y + 0.9, lerp(startP.z, goal.z, 0.5)), goal, clamp(kk, -0.1, 1)); if (kk < 0) cp.z = wallZ + kk * 0.2; }
          else if (t < T.ai2) { const k = sineInOut(lin(T.research, T.ai2, t)); const a = k * Math.PI * 2; cp = ring1.clone().add(V(RINGS[0].r * Math.cos(a), RINGS[0].r * Math.sin(a), 0)); }
          else { cOn = 1 - smooth(T.ai2, T.ai2 + 0.5, t); cp = ring1.clone().add(V(RINGS[0].r, 0, 0)); } }
        cursor.position.copy(cp); curDot.userData.set(2.2 * cOn); curHalo.userData.set(0.75 * cOn * (1 + 0.15 * Math.sin(t * 9))); curLight.intensity = 4 * cOn;
        // engineer: types until the machine starts, then leans back and watches
        { const back = smooth(T.started2, T.code, t); eng.userData.pose(t, { lean: lerp(0.6, -0.6, back), reach: lerp(0.85, 0.2, back) });
          if (back < 0.5) eng.userData.forearm.rotation.z += 0.08 * Math.sin(t * 22); monSide.userData.setGlow(0.9 + 0.05 * Math.sin(t * 5)); monGlow.userData.setGlow(1.2); }

        // ---- rings: draw, build, explode, settle ----
        const rc = ringCentre(t);
        const calm = smooth(T.we, T.onceEnd + 0.3, t);
        const boomK = smooth(T.boom - 0.05, T.boom + 0.25, t) * (1 - 0.65 * calm);
        RG.position.copy(rc); RG.scale.setScalar(1 + 0.08 * boomK - 0.18 * calm);
        RG.position.y += 4 * calm;
        let spP = null;
        RINGS.forEach((q, i) => { const k = lin(q.s, q.s + q.d, t); const drawn = i === 0 ? sineInOut(k) : expoOut(k) * 0 + sineInOut(k);
          q.m.visible = k > 0; q.m.geometry.setDrawRange(0, Math.max(0, Math.floor(drawn * SEG)) * 6);
          q.m.rotation.z = Math.PI / 2 * 0 + (i % 2 ? -1 : 1) * 0.03 * t;
          if (i > 0 && k > 0 && k < 1) { const a = drawn * Math.PI * 2 + q.m.rotation.z; spP = rc.clone().add(V(q.r * Math.cos(a), q.r * Math.sin(a), 0).multiplyScalar(RG.scale.x)); }
          const born = k >= 1 ? Math.exp(-(t - q.s - q.d) * 2.2) : 0;
          // pulses run inward while it "thinks"
          const ph = ((t * 0.55 - i * 0.17) % 1 + 1) % 1; const pulse = 0.55 + 0.45 * Math.pow(1 - ph, 3);
          const b = (0.9 + 1.4 * born) * pulse * (1 + 0.5 * boomK) * (1 - 0.35 * calm) * (i === 0 ? 1.6 : 1);
          q.m.material.color.set(C.cyan).multiplyScalar(b * (k > 0 ? 1 : 0));
          q.h.visible = k > 0; q.h.userData.set((0.05 + 0.25 * born + 0.12 * boomK) * (i === 0 ? 2.5 : 1) * (1 - 0.5 * calm)); });
        // spark: ring 1 is traced by the cursor; later rings by a spark leaving the previous ring
        spark.visible = !!spP; if (spP) { spark.position.copy(spP); spDot.userData.set(2.5); spHalo.userData.set(1.1); const s = 0.6 + 0.12 * RINGS.findIndex((q) => t >= q.s && t < q.s + q.d); spark.scale.setScalar(Math.max(0.6, s * (1 + rc.distanceTo(camera.position) / 40))); }
        // explosion: rings cascade outward, exponentially, then thin out
        for (let i = 0; i < nBoom; i++) { const te = T.boom + i * 0.11 * Math.pow(1.06, i); const a = t - te;
          let r = 0, b = 0; if (a > 0) { r = 6 * Math.exp(a * 1.55); b = Math.exp(-a * 0.7) * (1 - smooth(T.we, T.onceEnd, t)) * 0.75 * (i < 3 ? 1.4 : 1); if (r > 900) b = 0; }
          _o.position.set(0, 0, -0.2 - i * 0.05); _o.rotation.set(0, 0, i); _o.scale.setScalar(Math.max(0.001, r)); _o.updateMatrix(); boomIM.setMatrixAt(i, _o.matrix); boomIM.setColorAt(i, _c.set(C.cyan).multiplyScalar(b)); }
        boomIM.instanceMatrix.needsUpdate = true; boomIM.instanceColor.needsUpdate = true;
        coreGlow.userData.set((0.1 * smooth(T.b1, T.b2, t) + 0.18 * boomK) * (1 + 0.1 * Math.sin(t * 1.3)));
        coreGlow.scale.setScalar(1 + 1.4 * boomK);
        ringLight.position.copy(rc); ringLight.intensity = (smooth(T.b1, T.boom, t) * 80 + 220 * boomK) * (1 - 0.6 * calm);
        RG.visible = t > T.research - 0.1;

        // ---- city windows ----
        WIN.forEach((w, i) => winIM.setColorAt(i, winColor(w, t, i))); winIM.instanceColor.needsUpdate = true;

        // ---- the figure ----
        const x = figX(t); const wk = walkK(t);
        const look = t < T.boom - 0.2 ? -0.55 : t < T.what ? lerp(-0.55, 0.95, spring(lin(T.boom - 0.2, T.boom + 0.9, t))) : lerp(0.95, -0.6, inOut(lin(T.what, T.arrives + 0.7, t)));
        const P = { walk: wk * 0.75, lookUp: look, breathe: 1 };
        [fig, rim].forEach((f, k) => { f.position.set(x + (k ? 0.012 : 0), 0.24 + (k ? 0.012 : 0), FZ - (k ? 0.03 : 0)); f.scale.set(k ? 1.03 : 1, k ? 1.015 : 1, 1); f.userData.pose(t, P);
          // phone arm: upper arm down-forward, forearm up toward the face; drops when it looks up
          const drop = t < T.boom - 0.2 ? 0 : t < T.what ? spring(lin(T.boom - 0.1, T.boom + 1.0, t)) : 1 - inOut(lin(T.what + 0.2, T.arrives + 0.9, t));
          f.userData.arm.rotation.z = lerp(-1.18, -1.42, drop) + 0.02 * Math.sin(t * 1.3);
          f.userData.forearm.rotation.z = lerp(1.62, 0.32, drop); });
        const nearLamp = LAMPS.reduce((m, L) => Math.min(m, Math.abs(L.x - x)), 99);
        rim.userData.mat.color.set(C.amber).multiplyScalar((0.25 + 0.9 * (1 - smooth(1.0, 5.5, nearLamp))) * (1 - smooth(PUSH0 + 0.6, PUSH0 + 1.6, t))); rim.visible = t < PUSH0 + 1.6;
        fig.updateMatrixWorld(true); fig.userData.forearm.children[1].getWorldPosition(_hp);
        // the phone in the hand (screen tilted to the face, a little toward us); at the end it turns to face the camera
        const pushK = smooth(PUSH0, PUSH0 + 2.2, t);
        phone.position.set(_hp.x + 0.03, _hp.y + 0.07, FZ + 0.1);
        phone.rotation.set(lerp(-0.35, 0, pushK), lerp(-0.55, 0, pushK), lerp(0.25, 0, pushK) + 0.04 * Math.sin(t * 1.1) * (1 - pushK));
        drawScreen(scrollAt(t));
        phHalo.userData.set(0.75 * (1 - smooth(PUSH0, PUSH0 + 2.0, t)));

        // ---- camera ----
        const cam = E.camPath(KEYS, t, { arc: 0.1, drift: 1, push: 0.4, seed: 3 });
        if (t > PUSH0) { // push into the phone screen until the cream page fills the frame
          phone.updateMatrixWorld(true); const sc = new THREE.Vector3(); screen.getWorldPosition(sc); const n = V(0, 0, 1).applyQuaternion(screen.getWorldQuaternion(new THREE.Quaternion()));
          const k = lin(PUSH0, T1, t); const e = k * k * (3 - 2 * k) * 0.25 + 0.75 * (1 - Math.pow(1 - k, 2.4)) * 0 + 0.75 * inOut(k);
          const d0 = cam.p.distanceTo(sc), dEnd = (PH.w / 2) / Math.tan(Math.atan(Math.tan((35 * Math.PI / 360)) * (16 / 9))) / 1.08;
          const d = Math.exp(lerp(Math.log(d0), Math.log(dEnd), e));
          const dir = cam.p.clone().sub(sc).normalize().lerp(n, smooth(0, 0.85, k)).normalize();
          const p = sc.clone().addScaledVector(dir, d), l = cam.l.clone().lerp(sc, smooth(0, 0.5, k));
          cam.p = p; cam.l = l; camera.near = clamp(d * 0.2, 0.004, 0.1); }
        else camera.near = 0.1;
        camera.updateProjectionMatrix();
        E.applyCam(camera, cam, 0.006 * Math.sin(t * 0.31));
        halos.forEach((h) => h.quaternion.copy(camera.quaternion));
        RINGS.forEach((q) => q.h.quaternion.identity());

        // ---- post ----
        post.bloom = 0.5 + 0.2 * smooth(T.b1, T.boom, t) + 0.35 * boomK - 0.35 * smooth(PUSH0 + 1, T1, t);
        post.exposure = 1.15 + 0.05 * boomK;

        stamp.update(t); src1.update(t); src2.update(t); title1.update(t); title2.update(t);
      },
    };
  },
};
