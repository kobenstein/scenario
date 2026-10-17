// s07 · Two endings (endings section, "First ending" → "with her eyes open").
// One paper world, two lights. Bad ending in the cold grey palette: the cyan door swings wide, every tower follows,
// the flipbook spins into a blur next to a small Lena, a log scroll unrolls from the book to a kitchen where summary
// cards slide under the door and the pen rolls off the table. WOW on "Second ending": in that same kitchen frame a dawn
// sun breaks through the window, colour floods outward from it, and the world rewinds (pen, cards, scroll, doors) to
// the same Thursday. Good ending in the dawn palette: inspectors with amber lamps open the model's panels, a note
// flies to every tower, a shared paper clock rises with threads from every tower, the book turns at a readable pace,
// Lena ticks the card and the cyan door opens with amber light inside. Carriers: in = cyan FILL, out = gold FILL.
export default {
  build(E, def) {
    const { THREE, C, PAL, lin, smooth, lerp, clamp, expoOut, inOut, sineInOut, spring, antic, wob } = E;
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const scene = new THREE.Scene();
    const camera = E.newCamera();
    const A = (p, n = 1) => E.at("endings", p, n), Z = (p, n = 1) => E.end("endings", p, n);
    const T = {
      from: def.from, to: def.to,
      yes: A("yes"), every: A("every other lab"), noOne: A("no one can"), nothing: A("Nothing explodes"), pages: A("pages just turn"), faster: A("faster"),
      read1: A("read them"), shortcut: A("shortcut"), july: A("July"), deeper: A("deeper"), finds: A("finds"), logs: A("logs"), later: A("later"),
      choices: A("choices"), job: A("job"), news: A("news"), school: A("school"), summaries: A("summaries"), fully: A("fully"),
      notA: A("Not a catastrophe"), just: A("just a world"), authors: A("authors"), authorsE: Z("authors"),
      second: A("Second ending"), sameLab: A("Same lab"), thursday: A("Thursday"), plan: A("plan on"), screen: A("screen"),
      thisTime: A("This time"), before: A("before anything"), runs: A("runs"), outside: A("outside team"), tests: A("tests"), inspectors: A("inspectors"), aircraft: A("aircraft"),
      every2: A("Every near miss"), near: A("near miss"), reported: A("reported"), days: A("days"), otherLabs: A("other labs learn"), learn: A("learn"), it: A("from it"),
      labsIn: A("Labs in different"), countries: A("countries"), shared: A("shared clock"), clock: A("clock"), each: A("each check"), check: A("check"),
      book: A("The book still"), turns: A("turns"), medicine: A("Medicine"), pace: A("pace people"), read2: A("read", 3),
      lena: A("Lena still"), yes2: A("yes", 2), three: A("three months"), months: A("months"), withH: A("with her eyes"), eyes: A("eyes"), open: A("open"),
    };
    const G = PAL.grey, D = PAL.dawn;
    const R = E.rng(707);

    // ---------- palette registry: every paper face carries a grey and a dawn colour ----------
    const REG = [];
    const tint = (mat, g, d, delay = 0.4) => { REG.push({ m: mat, a: new THREE.Color(g), b: new THREE.Color(d), delay }); return mat; };
    const pm = (g, d, delay, opts = {}) => { const mats = E.paperMats(g, opts); tint(mats[0], g, d, delay); return mats; };
    const ex = (shape, g, d, depth = 0.22, delay, opts = {}) => E.extrude(shape, g, depth, { ...opts, mats: pm(g, d, delay, opts) });
    const bx = (w, h, dp, g, d, delay) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, dp), pm(g, d, delay)[0]); m.castShadow = m.receiveShadow = true; return m; };
    // dawn progress for a given delay (light leaks in from the kitchen window, then the world)
    const dawnK = (t, delay = 0) => smooth(T.second + 0.05 + delay, T.second + 1.0 + delay, t);

    // ---------- textures ----------
    const canvasTex = (w, h, draw) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d"); draw(g, w, h);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData = { c, g }; return t; };
    // soft light pool (door spill / light shaft): bright at v=1 edge, fading
    const spillTex = canvasTex(128, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "rgba(255,255,255,0.95)"); gr.addColorStop(0.35, "rgba(255,255,255,0.4)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.beginPath(); g.moveTo(w * 0.3, 0); g.lineTo(w * 0.7, 0); g.lineTo(w, h); g.lineTo(0, h); g.closePath(); g.fill(); });
    spillTex.colorSpace = THREE.NoColorSpace;
    const haloTex = canvasTex(256, 256, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.25, "rgba(255,255,255,0.5)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    haloTex.colorSpace = THREE.NoColorSpace;
    const addMat = (hex, tex) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex), map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    const halo = (size, hex) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), addMat(hex, haloTex)); m.renderOrder = 5; return m; };

    // ---------- stage ----------
    const st = E.stage(scene, G, { stars: 0, clouds: true, seed: 17, floorColor: "#2c373c" });
    tint(st.floor.material, "#2c373c", D.floor, 0.5);
    scene.children.forEach((o) => { if (o !== st.floor && o !== st.sky && o.isMesh && Array.isArray(o.material)) tint(o.material[0], G.layers[0], "#c98e98", 0.2); });
    // sky: redrawn while the palette turns (horizon warms first)
    const skyTex = canvasTex(4, 256, () => {}); st.sky.material.map = skyTex; st.sky.material.needsUpdate = true;
    let skyK = -1; const ca = new THREE.Color(), cb = new THREE.Color();
    const drawSky = (k) => { const g = skyTex.userData.g; const gr = g.createLinearGradient(0, 0, 0, 256);
      const kk = [smooth(0.25, 1, k), smooth(0.1, 0.8, k), smooth(0, 0.6, k)];
      [0, 0.55, 1].forEach((s, i) => { ca.set(G.sky[i]).lerp(cb.set(D.sky[i]), kk[i]); gr.addColorStop(s, "#" + ca.getHexString()); });
      g.fillStyle = gr; g.fillRect(0, 0, 4, 256); skyTex.needsUpdate = true; };
    const fogA = new THREE.Color(G.fog), fogB = new THREE.Color(D.fog), bgA = new THREE.Color(G.clear), bgB = new THREE.Color("#3a2c55");
    // far city (two paper skylines) and hills
    const city = E.city(scene, G, { zs: [-58, -52, -47], holes: [0, 0.03, 0.06], heights: [[7, 13], [5, 10], [4, 8]], width: 120, seed: 31, popAt: -1000 });
    city.layers.forEach((L, i) => tint(L.g.children[0].material[0], G.layers[i], D.layers[i], 0.15));

    // ---------- lights ----------
    const L = E.lights(scene, G, { key: [-28, 34, 40], target: [0, 0, -8], intensity: 1.7, hemi: 0.75, box: 30 });
    const hemiA = [new THREE.Color(G.hemiSky), new THREE.Color(G.hemiGround)], hemiB = [new THREE.Color(D.hemiSky), new THREE.Color("#4a3050")];
    const keyA = new THREE.Color(G.key), keyB = new THREE.Color("#ffc79a");
    const keyDirA = V3(-28, 34, 40).normalize(), keyDirB = V3(30, 20, 36).normalize();

    // ---------- the sun (dawn) and the shared clock ----------
    const H = { x: 15, z: 16 }; // kitchen house
    const WX = 2.6; const WIN = V3(H.x + WX, 3.25, H.z - 2.5); // kitchen window centre (world)
    const turnCam = V3(H.x + 0.9, 2.35, H.z + 5.6);
    const SUN = V3(20, 12.5, -60);
    const sun = E.extrude(E.circleShape(4.2), "#ffd28a", 0.2, { cast: false }); sun.material[0].emissive = new THREE.Color("#ffc070"); sun.material[0].emissiveIntensity = 1.4;
    sun.position.set(SUN.x, SUN.y - 12, -60); scene.add(sun);
    const sunHalo = halo(40, "#ffb070"); sunHalo.position.set(SUN.x, SUN.y, -59.5); scene.add(sunHalo);

    // ---------- towers with doors ----------
    const TW = [
      { x: 0, z: -14, w: 11, h: 22, dw: 3.2, dh: 5.4, li: 3, seed: 1 },
      { x: -22, z: -24, w: 8, h: 27, dw: 2.2, dh: 3.8, li: 2, seed: 2, desk: [1.2, 15] },
      { x: 27, z: -28, w: 9, h: 31, dw: 2.4, dh: 4.0, li: 2, seed: 3, desk: [-1.4, 19] },
      { x: -45, z: -38, w: 9, h: 24, dw: 2.4, dh: 4.0, li: 1, seed: 4, desk: [1.5, 13] },
      { x: 47, z: -42, w: 9, h: 29, dw: 2.4, dh: 4.0, li: 1, seed: 5, desk: [-1.5, 17] },
      { x: -10, z: -46, w: 8, h: 30, dw: 2.2, dh: 3.8, li: 0, seed: 6, desk: [1.0, 25] },
    ];
    const towers = TW.map((o, idx) => {
      const g = new THREE.Group(); g.position.set(o.x, 0, o.z); scene.add(g);
      const { w, h, dw, dh } = o; const r = E.rng(100 + o.seed);
      const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-dw / 2, 0); s.lineTo(-dw / 2, dh); s.lineTo(dw / 2, dh); s.lineTo(dw / 2, 0); s.lineTo(w / 2, 0);
      s.lineTo(w / 2, h); const step = r() < 0.5; if (step) { s.lineTo(w * 0.3, h); s.lineTo(w * 0.3, h + 2.2); s.lineTo(-w * 0.2, h + 2.2); s.lineTo(-w * 0.2, h); } s.lineTo(-w / 2, h); s.lineTo(-w / 2, 0);
      const desk = o.desk ? { x: o.desk[0], y: o.desk[1], w: 2.4, h: 1.6 } : null;
      for (let y = dh + 1.6; y < h - 1.6; y += 1.9) for (let x = -w / 2 + 0.9; x < w / 2 - 1.3; x += 1.35) {
        if (desk && x + 0.6 > desk.x - desk.w / 2 - 0.2 && x < desk.x + desk.w / 2 + 0.2 && y + 0.95 > desk.y - desk.h / 2 - 0.2 && y < desk.y + desk.h / 2 + 0.2) continue;
        if (r() < 0.62) { const hp = new THREE.Path(); hp.moveTo(x, y); hp.lineTo(x + 0.6, y); hp.lineTo(x + 0.6, y + 0.95); hp.lineTo(x, y + 0.95); hp.lineTo(x, y); s.holes.push(hp); } }
      if (desk) { const hp = new THREE.Path(); hp.moveTo(desk.x - desk.w / 2, desk.y - desk.h / 2); hp.lineTo(desk.x + desk.w / 2, desk.y - desk.h / 2); hp.lineTo(desk.x + desk.w / 2, desk.y + desk.h / 2); hp.lineTo(desk.x - desk.w / 2, desk.y + desk.h / 2); hp.closePath(); s.holes.push(hp); }
      const body = ex(s, G.layers[o.li], D.layers[o.li], 0.5, 0.2 + idx * 0.05); g.add(body);
      // backing glow behind the small windows
      const back = E.glowPlane(w - 0.8, h - dh - 1.4, "#ffffff"); back.position.set(0, dh + 0.8 + (h - dh - 1.4) / 2, -0.3); g.add(back);
      // door interior light + inner amber core (good ending)
      const dGlow = E.glowPlane(dw, dh, C.cyan); dGlow.position.set(0, dh / 2, -0.35); g.add(dGlow);
      const dCore = new THREE.Mesh(new THREE.PlaneGeometry(dw * 1.1, dh * 1.0), new THREE.MeshBasicMaterial({ color: new THREE.Color("#ff9a3c").multiplyScalar(1.3), map: haloTex, transparent: true, depthWrite: false, fog: false })); dCore.position.set(0, dh * 0.45, -0.3); dCore.material.opacity = 0; g.add(dCore);
      // door leaf hinged on its left edge, swings toward the camera
      const piv = new THREE.Group(); piv.position.set(dw / 2, 0, 0.5); g.add(piv);
      const leaf = E.extrude(E.rectShape(dw - 0.06, dh - 0.04, -(dw - 0.06) / 2 - 0.03, dh / 2), "#1d7f96", 0.12, { emissive: 0.15 }); leaf.position.z = -0.12; piv.add(leaf);
      // light spilling onto the floor
      const spill = new THREE.Mesh(new THREE.PlaneGeometry(dw * 3.4, 11), addMat(C.cyan, spillTex)); spill.rotation.x = -Math.PI / 2; spill.position.set(0, 0.03, 0.5 + 5.5); g.add(spill);
      spill.material.fog = true;
      let deskGlow = null, worker = null;
      if (desk) { deskGlow = E.glowPlane(desk.w + 0.3, desk.h + 0.3, "#ffffff"); deskGlow.position.set(desk.x, desk.y, -0.4); g.add(deskGlow);
        worker = E.figure({ pose: "sit", hair: idx % 2 ? "short" : "long", scale: 0.62, seed: idx }); worker.position.set(desk.x - 0.7, desk.y - desk.h / 2 - 0.12, -0.2); g.add(worker);
        const dk = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.06), worker.userData.mat); dk.position.set(desk.x + 0.25, desk.y - desk.h / 2 + 0.36, -0.2); g.add(dk); }
      return { o, g, back, dGlow, dCore, piv, leaf, spill, deskGlow, worker, desk, top: V3(o.x + (step ? w * 0.05 : 0), h + (step ? 2.2 : 0), o.z + 0.3) };
    });
    // Lena's door throws real light
    const doorLight = E.pointLight(C.cyan, 0, 34); doorLight.position.set(0, 2.6, -11.5); scene.add(doorLight);

    // ---------- Lena's desk on the plaza ----------
    const DK = { x: 3.4, z: -3.6 };
    const desk = new THREE.Group(); desk.position.set(DK.x, 0, DK.z); scene.add(desk);
    const dTop = bx(3.0, 0.1, 1.3, "#33434a", "#5e3c58", 0.9); dTop.position.set(0.2, 1.17, 0); desk.add(dTop);
    [[-1.2, -0.5], [1.6, -0.5], [-1.2, 0.5], [1.6, 0.5]].forEach(([x, z]) => { const l = bx(0.08, 1.12, 0.08, "#2a363c", "#4a3050", 0.9); l.position.set(x, 0.56, z); desk.add(l); });
    // screen showing the plan (system builds its successor): cyan rings → arrow → rings
    const planTex = canvasTex(512, 320, (g, w, h) => { g.fillStyle = "#06121a"; g.fillRect(0, 0, w, h); g.strokeStyle = "#6fe3ff"; g.lineWidth = 5;
      [[150, 160], [372, 160]].forEach(([x, y], k) => { for (let i = 0; i < 4; i++) { g.globalAlpha = k ? 0.55 + i * 0.1 : 1; g.beginPath(); g.arc(x, y, 70 - i * 16, 0, Math.PI * 2); g.stroke(); } });
      g.globalAlpha = 1; g.beginPath(); g.moveTo(232, 160); g.lineTo(290, 160); g.moveTo(276, 146); g.lineTo(292, 160); g.lineTo(276, 174); g.stroke();
      g.setLineDash([10, 10]); g.strokeRect(290, 78, 164, 164); });
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.94), new THREE.MeshBasicMaterial({ map: planTex, color: new THREE.Color(1, 1, 1) })); scr.position.set(0.95, 1.85, -0.25); desk.add(scr);
    const scrFrame = bx(1.62, 1.06, 0.06, "#1f292e", "#3a2740", 0.9); scrFrame.position.set(0.95, 1.85, -0.29); desk.add(scrFrame);
    const scrStand = bx(0.08, 0.3, 0.06, "#1f292e", "#3a2740", 0.9); scrStand.position.set(0.95, 1.3, -0.3); desk.add(scrStand);
    const scrLight = E.pointLight(C.cyan, 6, 6); scrLight.position.set(0.9, 1.9, 0.6); desk.add(scrLight);
    // desk lamp (amber: the human)
    const lampArm = bx(0.05, 0.9, 0.05, "#1f292e", "#3a2740", 0.9); lampArm.position.set(-1.0, 1.62, -0.35); lampArm.rotation.z = 0.35; desk.add(lampArm);
    const lampHead = E.extrude(E.polyShape([[-0.25, 0], [0.25, 0], [0.12, 0.22], [-0.12, 0.22]]), "#1f292e", 0.25); lampHead.position.set(-0.85, 1.93, -0.47); lampHead.rotation.z = -0.5; desk.add(lampHead);
    const lampBulb = halo(0.9, C.amber); lampBulb.position.set(-0.78, 1.92, -0.2); desk.add(lampBulb);
    const lampLight = E.pointLight(C.amber, 8, 9); lampLight.position.set(-0.6, 1.9, 0.4); desk.add(lampLight);
    // the question card ("?") she ticks
    const qCard = E.drawnCard({ w: 1.1, h: 0.76, px: 512, draw: (g, w, h, s) => { g.fillStyle = "#2a2018"; g.font = `400 ${h * 0.8}px "Instrument Serif"`; g.textAlign = "center"; g.fillText("?", w * 0.42, h * 0.78);
      const k = s.tick || 0; if (k > 0) { g.strokeStyle = C.red; g.lineWidth = h * 0.08; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); const p0 = [w * 0.58, h * 0.55], p1 = [w * 0.68, h * 0.75], p2 = [w * 0.92, h * 0.2];
        const k1 = clamp(k / 0.35, 0, 1), k2 = clamp((k - 0.35) / 0.65, 0, 1); g.moveTo(...p0); g.lineTo(lerp(p0[0], p1[0], k1), lerp(p0[1], p1[1], k1)); if (k2 > 0) g.lineTo(lerp(p1[0], p2[0], k2), lerp(p1[1], p2[1], k2)); g.stroke(); } } });
    qCard.material[4].color.setScalar(0.72); qCard.position.set(-0.05, 1.24, 0.25); qCard.rotation.x = -1.25; desk.add(qCard);
    let qTick = -1;
    // calendar block: three pages flip on "three months"
    const calBase = bx(0.5, 0.36, 0.22, "#5a6a70", "#c7909a", 0.9); calBase.position.set(1.55, 1.4, 0.3); desk.add(calBase);
    const calPages = [0, 1, 2, 3].map((i) => { const piv = new THREE.Group(); piv.position.set(1.55, 1.58, 0.42 - i * 0.004); desk.add(piv);
      const pg = E.drawnCard({ w: 0.46, h: 0.34, px: 128, depth: 0.01, draw: (g, w, h) => { g.fillStyle = "#b8463a"; g.fillRect(0, 0, w, h * 0.22); g.fillStyle = "#2a2018"; for (let k = 0; k < 3; k++) for (let j = 0; j < 5; j++) g.fillRect(10 + j * 23, 38 + k * 26, 14, 14); } });
      pg.position.y = -0.17; piv.add(pg); return piv; });
    // Lena (seated, faces +x toward her screen), red pencil in hand
    const lena = E.figure({ pose: "sit", hair: "bun", coat: true, scale: 1.5, seed: 3 }); lena.position.set(-1.95, 0, 0.05); desk.add(lena);
    const chair = new THREE.Mesh(new THREE.ShapeGeometry(E.polyShape([[-0.05, 0], [0.05, 0], [0.05, 0.5], [0.42, 0.5], [0.42, 0.56], [-0.02, 0.56], [-0.12, 1.25], [-0.2, 1.25], [-0.08, 0.5]])), lena.userData.mat);
    chair.scale.setScalar(1.5); chair.position.set(-1.98, 0, 0.02); desk.add(chair);
    const pencil = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.42, 8), new THREE.MeshStandardMaterial({ color: C.red, roughness: 0.7 }));
    pencil.rotation.z = 0.5; pencil.position.set(0.38, 0.06, 0.02); lena.userData.forearm.add(pencil);

    // ---------- the flipbook on its easel ----------
    const motif = (g, w, h, i) => { g.strokeStyle = "#3b2c22"; g.fillStyle = "#3b2c22"; g.lineWidth = 7; g.lineCap = "round"; g.lineJoin = "round"; const cx = w / 2, cy = h / 2, s = h * 0.32;
      const m = i % 6; g.beginPath();
      if (m === 0) { g.arc(cx, cy, s, 0, Math.PI * 2); g.stroke(); g.fillRect(cx - s * 0.16, cy - s * 0.6, s * 0.32, s * 1.2); g.fillRect(cx - s * 0.6, cy - s * 0.16, s * 1.2, s * 0.32); }
      else if (m === 1) { g.arc(cx + s * 0.9, cy - s * 0.7, s * 0.3, 0, Math.PI * 2); g.stroke(); for (let k = 0; k < 3; k++) { g.beginPath(); const x = cx - s * 1.2 + k * s * 0.8, y = cy + s * 0.1 + k * 0.0; g.moveTo(x, y + s * 0.6); g.lineTo(x + s * 0.3, y - s * 0.2); g.lineTo(x + s * 0.9, y - s * 0.2); g.lineTo(x + s * 0.6, y + s * 0.6); g.closePath(); g.stroke(); } }
      else if (m === 2) { g.moveTo(cx, cy + s); g.quadraticCurveTo(cx - s * 0.2, cy, cx, cy - s * 0.6); g.stroke(); g.beginPath(); g.ellipse(cx - s * 0.4, cy - s * 0.3, s * 0.4, s * 0.18, -0.6, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.ellipse(cx + s * 0.38, cy - s * 0.55, s * 0.38, s * 0.17, 0.6, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.moveTo(cx - s, cy + s); g.lineTo(cx + s, cy + s); g.stroke(); }
      else if (m === 3) { const P = [[-0.8, 0.3], [0, -0.4], [0.8, 0.2], [0.1, 0.8], [-0.2, -1.0]]; [[0, 1], [1, 2], [2, 3], [1, 4], [3, 0]].forEach(([a, b]) => { g.moveTo(cx + P[a][0] * s, cy + P[a][1] * s); g.lineTo(cx + P[b][0] * s, cy + P[b][1] * s); }); g.stroke(); P.forEach(([x, y]) => { g.beginPath(); g.arc(cx + x * s, cy + y * s, s * 0.17, 0, Math.PI * 2); g.fill(); }); }
      else if (m === 4) { g.moveTo(cx - s, cy + s * 0.8); g.lineTo(cx - s, cy - s * 0.1); g.lineTo(cx, cy - s * 0.9); g.lineTo(cx + s, cy - s * 0.1); g.lineTo(cx + s, cy + s * 0.8); g.closePath(); g.stroke(); g.strokeRect(cx - s * 0.25, cy + s * 0.2, s * 0.5, s * 0.6); }
      else { g.arc(cx, cy - s * 0.2, s * 0.6, Math.PI * 0.8, Math.PI * 2.2); g.stroke(); g.beginPath(); g.moveTo(cx - s * 0.3, cy + s * 0.35); g.lineTo(cx - s * 0.3, cy + s * 0.7); g.lineTo(cx + s * 0.3, cy + s * 0.7); g.lineTo(cx + s * 0.3, cy + s * 0.35); g.stroke(); }
      g.font = `400 ${h * 0.09}px "Inter"`; g.fillStyle = "#8a7a66"; g.textAlign = "right"; g.fillText(String(i + 1), w - 18, h - 16); };
    const BK = { x: 10.6, y: 3.7, z: -7 };
    const book = E.flipbook({ w: 6.2, h: 4.4, pages: 18, cover: "#3a4a52", drawPage: motif, seed: 9 }); book.position.set(BK.x, BK.y, BK.z); book.rotation.x = -0.12; scene.add(book);
    tint(book.children[0].material, "#3a4a52", "#6a3f62", 0.6);
    const streakTex = canvasTex(512, 16, (g, w, h) => { const r = E.rng(77); g.fillStyle = "#000"; g.fillRect(0, 0, w, h); for (let x = 0; x < w; x += 2) { const a = r(); const v = Math.floor(80 + 175 * a * a); g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(x, 0, 2, h); } }); streakTex.colorSpace = THREE.NoColorSpace;
    const fan = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 6.2, 4.4, 40, 1, true, -Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: "#c9c9c2", map: streakTex, alphaMap: streakTex, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, roughness: 0.95 }));
    book.add(fan);
    const easel = new THREE.Group(); easel.position.set(BK.x, 0, BK.z - 0.4); scene.add(easel);
    [[-0.6, 0.12], [5.6, -0.12]].forEach(([x, rz]) => { const l = bx(0.14, 3.6, 0.14, "#2a363c", "#4a3050", 0.6); l.position.set(x, 1.7, 0); l.rotation.z = rz; easel.add(l); });
    const ledge = bx(6.8, 0.14, 0.6, "#2a363c", "#4a3050", 0.6); ledge.position.set(3.1, 1.42, 0.35); easel.add(ledge);
    // flip speed profile (pages/s): slow → blur (bad ending) → back to a readable pace (good ending)
    const ramp = (a, b, dv) => ({ a, b, dv });
    const RAMPS = [ramp(T.pages - 0.15, T.read1 + 0.1, 40), ramp(T.second + 0.2, T.plan, -39.2), ramp(T.medicine, T.pace + 0.3, -0.45)];
    const V0 = 0.55;
    const flipAt = (t) => { let f = V0 * (t - T.from); RAMPS.forEach(({ a, b, dv }) => { if (t <= a) return; const x = clamp((t - a) / (b - a), 0, 1); f += dv * (b - a) * (x * x * x - x * x * x * x / 2); if (t > b) f += dv * (t - b); }); return f; };
    const speedAt = (t) => RAMPS.reduce((v, { a, b, dv }) => v + dv * smooth(a, b, t), V0);

    // ---------- the log scroll ----------
    const S0 = V3(BK.x + 1.6, 0, BK.z + 1.5), S1 = V3(H.x - 4.35, 0, H.z + 0.3);
    const SDIR = S1.clone().sub(S0); const LS = SDIR.length(); SDIR.normalize(); const SW = 2.0, SEG = 320;
    const SCUT = LS * 0.74;
    const logTex = canvasTex(4096, Math.round(4096 * SW / LS), (g, w, h) => { g.fillStyle = "#d9d6cc"; g.fillRect(0, 0, w, h); const r = E.rng(55);
      const rows = 6, rh = h / (rows + 1);
      for (let k = 0; k < rows; k++) { const y = rh * (k + 0.75); let x = 24; while (x < w - 40) { g.fillStyle = "#7b8489"; g.fillRect(x, y, 46, rh * 0.32); x += 60;
          const n = 2 + Math.floor(r() * 5); for (let j = 0; j < n && x < w - 40; j++) { const ww = 14 + r() * 70; g.fillStyle = r() < 0.08 ? "#4f6066" : "#a3a9a8"; g.fillRect(x, y + 2, ww, rh * 0.24); x += ww + 9; } x += 30 + r() * 40; } }
      const cx = w * SCUT / LS; g.strokeStyle = "#0a6f8c"; g.lineWidth = 9; g.beginPath(); g.moveTo(cx - 26, h * 0.3); g.lineTo(cx + 22, h * 0.7); g.stroke(); g.strokeStyle = "#6fe3ff"; g.lineWidth = 4; g.stroke(); });
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(LS, SW, SEG, 1), new THREE.MeshStandardMaterial({ map: logTex, roughness: 0.92, side: THREE.DoubleSide, bumpMap: E.bumpTex, bumpScale: 0.2 }));
    tint(strip.material, "#c9ccc6", "#ffe8d2", 0.6);
    strip.castShadow = strip.receiveShadow = true; strip.frustumCulled = false;
    const scroll = new THREE.Group(); scroll.position.copy(S0); scroll.rotation.y = Math.atan2(-SDIR.z, SDIR.x); scroll.add(strip); scene.add(scroll);
    const cutGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.16), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan) })); cutGlow.rotation.x = -Math.PI / 2; cutGlow.rotation.z = -0.9; cutGlow.position.set(SCUT, 0.035, 0); scroll.add(cutGlow);
    const cutHalo = halo(2.2, C.cyan); cutHalo.rotation.x = -Math.PI / 2; cutHalo.position.set(SCUT, 0.05, 0); scroll.add(cutHalo);
    const CUTW = S0.clone().addScaledVector(SDIR, SCUT);
    const sPos = strip.geometry.attributes.position;
    const layScroll = (u) => { const rem = LS - u; const r0 = 0.1 + 0.55 * Math.sqrt(rem / LS);
      for (let i = 0; i < sPos.count; i++) { const col = i % (SEG + 1), row = Math.floor(i / (SEG + 1)); const s = col / SEG * LS; const z = row === 0 ? -SW / 2 : SW / 2; let x, y;
        if (s <= u) { x = s; y = 0.025; } else { const a = s - u; const re = r0 * (1 - 0.55 * a / (rem + 1e-3)); const th = a / ((r0 + re) / 2); x = u + re * Math.sin(th); y = 0.025 + r0 - re * Math.cos(th); }
        sPos.setXYZ(i, x - LS / 2 + LS / 2, y, z); }
      sPos.needsUpdate = true; strip.geometry.computeVertexNormals(); return r0; };
    // geometry starts as XY plane; we rewrite to XZ via layScroll, local x from 0..LS
    const uAt = (t) => { const fw = LS * sineInOut(lin(T.shortcut - 0.05, T.later + 0.6, t)); const rw = smooth(T.sameLab + 0.1, T.plan - 0.2, t); return fw * (1 - rw); };

    // ---------- kitchen (dollhouse cut-away at the end of the scroll) ----------
    const house = new THREE.Group(); house.position.set(H.x, 0, H.z); scene.add(house);
    const kd = (x, y, z) => 0.1 + 0.07 * V3(H.x + x, y, H.z + z).distanceTo(WIN); // dawn delay by distance to the window
    const kFloor = bx(8.4, 0.3, 5.4, "#3a4a51", "#7a4f70", kd(0, 0, 0)); kFloor.position.set(0, 0.15, 0); house.add(kFloor);
    { const s = E.rectShape(8.4, 4.8, 0, 2.4 + 0.3); const hp = new THREE.Path(); const wx = WX, wy = 3.25 - 0.85, ww = 2.4, wh = 1.7; hp.moveTo(wx - ww / 2, wy); hp.lineTo(wx + ww / 2, wy); hp.lineTo(wx + ww / 2, wy + wh); hp.lineTo(wx - ww / 2, wy + wh); hp.closePath(); s.holes.push(hp);
      const bw = ex(s, "#4b5d64", "#c48a8c", 0.2, 0.05); bw.position.set(0, 0, -2.7); house.add(bw);
      const mull = bx(0.08, 1.7, 0.1, "#2f3d43", "#5e3c58", 0.05); mull.position.set(WX, 3.25, -2.55); house.add(mull);
      const sill = bx(2.7, 0.1, 0.35, "#2f3d43", "#5e3c58", 0.1); sill.position.set(WX, 2.35, -2.45); house.add(sill);
      const shelf = bx(2.0, 0.08, 0.4, "#2f3d43", "#5e3c58", 0.3); shelf.position.set(-2.4, 3.3, -2.3); house.add(shelf);
      [[-3.0, 0.42, 0.3], [-2.5, 0.3, 0.26], [-1.95, 0.5, 0.22]].forEach(([x, h, w], k) => { const j = bx(w, h, w, ["#7b8489", "#5f6b70", "#8a9296"][k], ["#e7a77f", "#c98e98", "#ffd2a8"][k], 0.3); j.position.set(x, 3.34 + h / 2, -2.3); house.add(j); });
      const frame = E.drawnCard({ w: 0.9, h: 0.7, px: 256, hex: "#cfd2cc", draw: (g, w, h) => { g.strokeStyle = "#3b3f3e"; g.lineWidth = 6; g.strokeRect(10, 10, w - 20, h - 20); g.beginPath(); g.moveTo(30, h - 40); g.lineTo(w * 0.4, h * 0.4); g.lineTo(w * 0.6, h * 0.65); g.lineTo(w * 0.75, h * 0.45); g.lineTo(w - 30, h - 40); g.stroke(); } });
      frame.position.set(-0.4, 3.5, -2.45); house.add(frame); tint(frame.material[4], "#c9ccc8", "#ffe6d0", 0.3);
      const pot = bx(0.3, 0.28, 0.25, "#5f6b70", "#c47a5a", 0.1); pot.position.set(WX + 0.9, 2.54, -2.4); house.add(pot);
      const leaf1 = E.extrude(E.polyShape([[0, 0], [0.12, 0.35], [0.02, 0.6], [-0.1, 0.3]]), "#3c4a44", 0.03); leaf1.position.set(WX + 0.9, 2.66, -2.4); house.add(leaf1); tint(leaf1.material[0], "#3c4a44", "#6a8a5a", 0.1); }
    { // left wall with the door (cards slide in under it)
      const s = new THREE.Shape(); s.moveTo(-2.7, 0.3); s.lineTo(-0.3, 0.3); s.lineTo(-0.3, 2.7); s.lineTo(0.9, 2.7); s.lineTo(0.9, 0.3); s.lineTo(2.7, 0.3); s.lineTo(2.7, 5.1); s.lineTo(-2.7, 5.1); s.closePath();
      const lw = ex(s, "#435459", "#b07a8c", 0.2, kd(-4, 2, 0)); lw.rotation.y = Math.PI / 2; lw.position.set(-4.2, 0, 0); house.add(lw);
      const door = bx(0.12, 2.28, 1.16, "#2f3d43", "#6a4566", kd(-4, 2, 0)); door.position.set(-4.12, 0.42 + 1.14, -0.3); house.add(door);
      const knob = bx(0.1, 0.1, 0.1, "#9aa5ab", "#e6b88a", 0.5); knob.position.set(-3.98, 1.5, -0.75); house.add(knob); }
    { const rw = bx(0.2, 4.8, 5.4, "#435459", "#a06e86", kd(4, 2, 0)); rw.position.set(4.2, 2.7, 0); house.add(rw); }
    { // roof gable seen from outside
      const gab = ex(E.polyShape([[-4.6, 0], [4.6, 0], [0, 2.6]]), "#2f3d43", "#5e3c58", 0.25, 0.3); gab.position.set(0, 5.1, 2.5); house.add(gab);
      const gab2 = gab.clone(); gab2.position.z = -2.9; house.add(gab2);
      [-1, 1].forEach((sd) => { const sl = bx(5.4, 0.18, 5.8, "#273338", "#4d3350", 0.3); sl.position.set(sd * 2.25, 6.4, -0.2); sl.rotation.z = -sd * 0.52; house.add(sl); }); }
    // table, chair, "you"
    const TB = { x: 0.6, y: 0.3 + 1.17 };
    const tTop = bx(2.8, 0.1, 1.5, "#2f3d43", "#6e4664", kd(0.6, 1.4, 0)); tTop.position.set(TB.x, TB.y, 0.2); house.add(tTop);
    [[-1.25, -0.6], [1.25, -0.6], [-1.25, 0.6], [1.25, 0.6]].forEach(([x, z]) => { const l = bx(0.09, 1.17, 0.09, "#273338", "#4d3350", kd(0.6, 0.6, 0)); l.position.set(TB.x + x, 0.3 + 0.585, 0.2 + z); house.add(l); });
    const you = E.figure({ pose: "sit", hair: "short", scale: 1.5, seed: 7 }); you.position.set(-1.75, 0.3, 0.25); house.add(you);
    const ych = chair.clone(); ych.position.set(-1.78, 0.3, 0.22); house.add(ych);
    const mug = bx(0.2, 0.24, 0.2, "#7b8489", "#ffd9a8", 0.3); mug.position.set(TB.x - 0.75, TB.y + 0.17, 0.35); house.add(mug);
    // pendant lamp (cold in the grey world)
    const cord = bx(0.03, 1.2, 0.03, "#1f292e", "#3a2740", 0.3); cord.position.set(TB.x, 4.5, 0.2); house.add(cord);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.4, 24, 1, true), new THREE.MeshStandardMaterial({ color: "#26343a", side: THREE.DoubleSide, roughness: 0.9 })); shade.position.set(TB.x, 3.75, 0.2); house.add(shade);
    const bulb = halo(0.7, "#bfe9f2"); bulb.position.set(TB.x, 3.5, 0.3); house.add(bulb);
    const pend = E.pointLight("#bfe0ea", 7, 9); pend.position.set(TB.x, 3.3, 0.6); house.add(pend);
    // window light (dawn): a warm beam and its glow
    const winGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.9), new THREE.MeshBasicMaterial({ color: new THREE.Color("#5d7480"), fog: false })); winGlow.position.set(WX, 3.25, -2.95); house.add(winGlow);
    const winA = new THREE.Color("#4f6670"), winB = new THREE.Color("#ffb98a");
    const miniSun = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color("#fff0c8").multiplyScalar(2.2), fog: false })); miniSun.position.set(WX + 0.55, 2.0, -2.85); house.add(miniSun);
    const miniHalo = halo(3.2, "#ffc070"); miniHalo.position.set(WX + 0.55, 2.0, -2.8); house.add(miniHalo);
    const hillsWin = new THREE.Mesh(new THREE.ShapeGeometry(E.polyShape([[-1.3, -1], [1.3, -1], [1.3, -0.45], [0.9, -0.3], [0.5, -0.5], [0.1, -0.2], [-0.5, -0.45], [-1.3, -0.25]])), new THREE.MeshBasicMaterial({ color: new THREE.Color("#2a353b"), fog: false })); hillsWin.position.set(WX, 3.25, -2.82); house.add(hillsWin);
    const hillA = new THREE.Color("#2a353b"), hillB = new THREE.Color("#6a3f62");
    const winSpot = new THREE.SpotLight("#ffc48a", 0, 22, 0.75, 0.6, 1.2); winSpot.position.set(WX, 3.6, -3.6); winSpot.target.position.set(0.4, 0.8, 2.2); house.add(winSpot, winSpot.target);
    const beams = [0, 1].map((k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 6.5), addMat("#ffcf96", spillTex)); m.material.opacity = 0; m.material.fog = true;
      const phi = 0.35 + k * 0.12; m.rotation.x = -Math.PI / 2 + phi; m.position.set(WX + (k ? 0.25 : -0.25), 3.2 - 3.25 * Math.sin(phi), -2.5 + 3.25 * Math.cos(phi)); house.add(m); return m; });
    // the page with the blank author line, and the pen
    const page = E.drawnCard({ w: 1.15, h: 1.45, px: 512, draw: (g, w, h) => { const r = E.rng(9); g.fillStyle = "#8f938f";
      for (let y = 70; y < h * 0.72; y += 30) { let x = 50; const end = w - 50 - (r() < 0.2 ? 120 : 0); while (x < end) { const ww = 20 + r() * 60; g.fillRect(x, y, Math.min(ww, end - x), 10); x += ww + 12; } }
      g.fillStyle = "#4a4e4c"; g.font = `400 ${h * 0.045}px "Inter"`; g.fillText("by", 52, h * 0.88); g.fillRect(100, h * 0.885, w * 0.62, 3); } });
    page.rotation.x = -Math.PI / 2; page.rotation.z = 0.08; page.position.set(TB.x + 0.05, TB.y + 0.07, 0.35); house.add(page);
    tint(page.material[4], "#d6dad6", "#fff0e0", 0.3);
    const pen = new THREE.Group(); house.add(pen);
    { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.78, 12), new THREE.MeshStandardMaterial({ color: "#1d2326", roughness: 0.5 })); b.rotation.x = Math.PI / 2; b.castShadow = true; pen.add(b);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.2, 12), new THREE.MeshStandardMaterial({ color: "#9aa5ab", roughness: 0.4, metalness: 0.3 })); cap.rotation.x = Math.PI / 2; cap.position.z = -0.3; pen.add(cap);
      const clip = bx(0.02, 0.02, 0.2, "#9aa5ab", "#e6b88a", 0.2); clip.position.set(0, 0.06, -0.3); pen.add(clip); }
    // pen state: p in [0,1]: 0..0.62 rolls to the edge, then falls and rolls a little on the floor
    const PEN0 = { x: TB.x + 0.75, y: TB.y + 0.1, z: 0.4 }, EDGE = TB.x + 1.4;
    const penAt = (p) => { const rr = 0.045; if (p <= 0.62) { const k = p / 0.62; const x = lerp(PEN0.x, EDGE + 0.04, k * k); return { x, y: PEN0.y, rot: -(x - PEN0.x) / rr, tip: 0 }; }
      const k = (p - 0.62) / 0.38; const fall = Math.min(1, k / 0.45); const x = EDGE + 0.04 + 0.35 * fall + (k > 0.45 ? 0.5 * expoOut((k - 0.45) / 0.55) : 0);
      const y = k < 0.45 ? lerp(PEN0.y, 0.35, fall * fall) : 0.35 + 0.08 * Math.sin(Math.PI * clamp((k - 0.45) / 0.2, 0, 1));
      return { x, y, rot: -(x - PEN0.x) / rr, tip: 0.5 * fall }; };
    // summary cards slide in under the door
    const icon = (g, w, h, m) => { g.strokeStyle = "#3b3f3e"; g.lineWidth = 6; g.lineJoin = "round"; const x = w * 0.2, y = h * 0.5, s = h * 0.22; g.beginPath();
      if (m === 0) { g.strokeRect(x - s, y - s * 0.6, s * 2, s * 1.4); g.strokeRect(x - s * 0.4, y - s, s * 0.8, s * 0.4); }
      else if (m === 1) { g.strokeRect(x - s, y - s, s * 2, s * 2); g.moveTo(x - s * 0.6, y - s * 0.4); g.lineTo(x + s * 0.6, y - s * 0.4); g.moveTo(x - s * 0.6, y + s * 0.1); g.lineTo(x + s * 0.6, y + s * 0.1); g.moveTo(x - s * 0.6, y + s * 0.55); g.lineTo(x + s * 0.2, y + s * 0.55); g.stroke(); }
      else { g.moveTo(x - s, y + s); g.lineTo(x - s, y - s * 0.2); g.lineTo(x, y - s); g.lineTo(x + s, y - s * 0.2); g.lineTo(x + s, y + s); g.closePath(); g.stroke(); g.beginPath(); g.moveTo(x, y - s); g.lineTo(x, y - s * 1.7); g.lineTo(x + s * 0.6, y - s * 1.5); g.lineTo(x, y - s * 1.3); }
      g.stroke(); g.fillStyle = "#9a9e9b"; for (let k = 0; k < 3; k++) g.fillRect(w * 0.42, h * (0.3 + k * 0.17), w * (0.48 - k * 0.1), 12); };
    const cards = [T.job, T.news, T.school].map((ta, i) => { const c = E.drawnCard({ w: 0.95, h: 0.62, px: 256, draw: (g, w, h) => icon(g, w, h, i) });
      c.rotation.x = -Math.PI / 2; house.add(c); tint(c.material[4], "#d6dad6", "#fff0e0", 0.3);
      return { c, ta: ta - 0.35, end: { x: -3.1 + i * 0.75, z: 0.6 + (i - 1) * 0.55, rz: [0.25, -0.15, 0.4][i] } }; });

    // ---------- the successor model and the inspectors (good ending) ----------
    const MD = { x: -8.5, z: -2.5 };
    const model = new THREE.Group(); model.position.set(MD.x, 0, MD.z); scene.add(model);
    const modelPop = new THREE.Group(); model.add(modelPop);
    const plinth = bx(4.6, 1.9, 2.0, "#7c6f86", "#c9a3a8", 0); plinth.position.set(0, 0.95, -0.15); modelPop.add(plinth);
    const panels = [-1.45, 0, 1.45].map((x, i) => { const gl = E.glowPlane(1.0, 1.05, C.cyan); gl.position.set(x, 0.95, 0.86); gl.userData.setGlow(0.9); modelPop.add(gl);
      const piv = new THREE.Group(); piv.position.set(x, 1.5, 0.9); modelPop.add(piv); const fl = bx(1.12, 1.15, 0.06, "#e8d2c4", "#f2dccc", 0); fl.position.set(0, -0.575, 0.03); piv.add(fl); return piv; });
    const ringsM = E.machineRings({ n: 4, r: 1.5, w: 0.18 }); ringsM.position.set(0, 3.7, 0); modelPop.add(ringsM);
    const ringStand = bx(0.3, 1.0, 0.3, "#5a4a62", "#8a6a80", 0); ringStand.position.set(0, 2.3, -0.2); modelPop.add(ringStand);
    const inspectors = [0, 1, 2, 3].map((i) => { const f = E.figure({ pose: "stand", hair: i % 2 ? "short" : "bun", scale: 1.05, seed: 20 + i }); scene.add(f);
      const lamp = halo(1.1, C.amber); lamp.position.set(0.36, -0.05, 0.05); f.userData.forearm.add(lamp);
      const core = new THREE.Mesh(new THREE.CircleGeometry(0.07, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffe2b0") })); core.position.set(0.38, -0.05, 0.06); f.userData.forearm.add(core);
      return f; });
    const insLight = E.pointLight(C.amber, 0, 12); scene.add(insLight);

    // ---------- the note, and the clock with its threads ----------
    const notes = [1, 2, 3, 4, 5].map((ti) => { const n = E.drawnCard({ w: 1.5, h: 1.0, px: 128, draw: (g, w, h) => { g.fillStyle = "#b8a99a"; for (let k = 0; k < 3; k++) g.fillRect(14, 16 + k * 22, w - 28 - k * 18, 7); } }); n.visible = false; scene.add(n); return { n, ti }; });
    const CLK = { x: 15, y: 35, z: -43, r: 7.5 };
    const clock = new THREE.Group(); clock.position.set(CLK.x, -12, CLK.z); scene.add(clock);
    { const face = ex(E.circleShape(CLK.r), "#efe6d2", "#fff1dc", 0.3, 0); face.material[0].emissive = new THREE.Color("#ffe6c4"); face.material[0].emissiveIntensity = 0.12; clock.add(face);
      const rim = ex(E.ringShape(CLK.r - 0.5, CLK.r + 0.2), "#c9a37a", "#ffb35c", 0.6, 0); clock.add(rim);
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const m = bx(i % 3 ? 0.18 : 0.32, i % 3 ? 0.9 : 1.5, 0.12, "#3b2c22", "#3b2c22", 0); m.position.set(Math.sin(a) * (CLK.r - 1.4), Math.cos(a) * (CLK.r - 1.4), 0.4); m.rotation.z = -a; clock.add(m); } }
    const hHand = new THREE.Group(), mHand = new THREE.Group(); hHand.position.z = 0.55; mHand.position.z = 0.65; clock.add(hHand, mHand);
    { const a = bx(0.42, 4.2, 0.1, "#3b2c22", "#3b2c22", 0); a.position.y = 1.8; hHand.add(a); const b = bx(0.28, 6.4, 0.1, "#3b2c22", "#3b2c22", 0); b.position.y = 2.9; mHand.add(b);
      const pin = E.extrude(E.circleShape(0.45), C.amber, 0.2); pin.position.z = 0.75; clock.add(pin); }
    const threads = towers.map((tw, i) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1, 0.07), new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffcf96") })); m.visible = false; scene.add(m); return m; });
    const clockBottom = (i) => { const a = Math.PI * (1.2 + 0.6 * i / (towers.length - 1)); return V3(CLK.x + Math.cos(a) * CLK.r * 0.95, 0, CLK.z + 0.2).setY(Math.sin(a) * CLK.r * 0.95); };

    // ---------- DOM carriers ----------
    const notesLand = { 1: T.days + 0.05, 2: T.otherLabs + 0.1, 3: T.learn + 0.05, 4: T.it, 5: T.it + 0.4 };
    const fillIn = E.fillDOM(E.layer, "#bff4ff"), fillOut = E.fillDOM(E.layer, "#ffd9a8");

    // ---------- camera ----------
    const K = [
      { t: T.from, p: [-0.9, 2.75, -12.6], l: [-0.7, 2.8, -24] },
      { t: T.from + 0.7, p: [-0.9, 2.8, -11.4], l: [-0.6, 2.85, -24], ease: "sine" },
      { t: T.yes - 0.15, p: [-2.6, 3.6, 2.5], l: [0.3, 4.4, -14], ease: "inOut", arc: 0.05 },
      { t: T.every - 0.1, p: [-3.0, 3.9, 1.6], l: [0.3, 4.6, -14], ease: "sine" },
      { t: T.nothing + 0.2, p: [5, 15.5, 42], l: [0, 8.5, -20], ease: "inOut", arc: -0.08 },
      { t: T.pages - 0.1, p: [4.6, 14.6, 39], l: [0, 8, -20], ease: "sine" },
      { t: T.faster + 0.7, p: [8.4, 4.9, 13.5], l: [9.4, 3.3, -6.5], ease: "inOut", arc: 0.15 },
      { t: T.shortcut + 0.1, p: [8.3, 4.7, 12.6], l: [9.6, 3.2, -6.5], ease: "sine" },
      { t: T.july + 1.0, p: [9.6, 5.6, 15.5], l: [11.6, 0.9, -0.5], ease: "inOut", arc: 0.05 },
    ];
    const KK = [ // kitchen and after
      { t: T.later + 0.6, p: [H.x + 1.0, 4.4, H.z + 13], l: [H.x - 0.6, 1.8, H.z], },
      { t: T.choices + 0.25, p: [H.x + 0.2, 3.4, H.z + 9.6], l: [H.x - 0.9, 1.5, H.z], ease: "inOut" },
      { t: T.summaries, p: [H.x - 0.2, 3.0, H.z + 8.0], l: [H.x - 1.1, 1.3, H.z + 0.2], ease: "sine" },
      { t: T.notA + 0.7, p: [H.x + 1.35, 3.0, H.z + 3.6], l: [H.x + 1.2, 1.45, H.z + 0.3], ease: "inOut", arc: 0.05 },
      { t: T.authors + 0.1, p: [H.x + 1.5, 2.85, H.z + 3.4], l: [H.x + 1.6, 1.25, H.z + 0.3], ease: "sine" },
      { t: T.second - 0.05, p: [turnCam.x, turnCam.y, turnCam.z], l: [H.x + 1.7, 2.3, H.z - 1.6], ease: "inOut", arc: 0.04 },
      { t: T.sameLab + 0.1, p: [turnCam.x - 0.1, turnCam.y + 0.05, turnCam.z - 0.5], l: [H.x + 1.75, 2.35, H.z - 1.6], ease: "sine" },
      { t: T.thursday + 0.5, p: [H.x - 3, 9.5, H.z + 15], l: [2, 3.5, -8], ease: "inOut", arc: 0.1 },
      { t: T.plan + 0.2, p: [5.0, 2.45, 1.2], l: [3.6, 1.85, -3.6], ease: "inOut", arc: 0.08 },
      { t: T.thisTime - 0.1, p: [4.8, 2.45, 0.6], l: [3.6, 1.9, -3.6], ease: "sine" },
      { t: T.outside - 0.2, p: [-4.6, 4.4, 10.5], l: [-8.2, 2.2, -2.5], ease: "inOut", arc: 0.1 },
      { t: T.aircraft + 0.4, p: [-5.4, 3.9, 8.6], l: [-8.4, 2.0, -2.5], ease: "sine" },
      { t: T.days - 0.2, p: [3, 13, 36], l: [0, 11, -24], ease: "inOut", arc: 0.12 },
      { t: T.labsIn, p: [2.6, 12.6, 34], l: [0, 11.5, -24], ease: "sine" },
      { t: T.clock + 0.2, p: [2, 8, 40], l: [4, 19, -40], ease: "inOut", arc: 0.08 },
      { t: T.book - 0.2, p: [1.6, 8.4, 37.5], l: [4, 19.5, -40], ease: "sine" },
      { t: T.turns + 0.3, p: [11.6, 4.1, 7.8], l: [11.0, 3.6, -7], ease: "inOut", arc: 0.1 },
      { t: T.read2, p: [11.2, 4.0, 6.8], l: [10.9, 3.6, -7], ease: "sine" },
      { t: T.lena + 0.5, p: [4.6, 2.55, -0.4], l: [3.3, 1.35, -3.4], ease: "inOut", arc: 0.06 },
      { t: T.three, p: [4.5, 2.5, -0.9], l: [3.3, 1.4, -3.4], ease: "sine" },
      { t: T.withH, p: [-0.3, 3.1, 0.6], l: [0, 2.9, -14], ease: "inOut", arc: 0.04 },
      { t: T.to, p: [0.05, 2.75, -13.25], l: [0, 2.7, -20], ease: "inOut", arc: 0 },
    ];
    // scroll follow (look = rolling front; camera alongside on the right)
    const NRM = V3(SDIR.z, 0, -SDIR.x); // right side of the scroll (towards +x)
    const scrollCam = (t) => { const u = uAt(t); const Rf = S0.clone().addScaledVector(SDIR, u);
      const p = Rf.clone().addScaledVector(NRM, 6.5).addScaledVector(SDIR, 5.5).add(V3(0, 5.2, 0)); const l = Rf.clone().addScaledVector(SDIR, -1.5).add(V3(0, 0.4, 0));
      const w = smooth(T.deeper + 0.6, T.finds + 0.15, t); const pc = CUTW.clone().addScaledVector(NRM, 3.0).addScaledVector(SDIR, 2.4).add(V3(0, 3.0, 0));
      p.lerp(pc, w); l.lerp(CUTW.clone().add(V3(0, 0.1, 0)), w);
      const w2 = smooth(T.finds + 0.5, T.later + 0.6, t); p.lerp(V3(H.x - 7.5, 6.5, H.z + 11), w2); l.lerp(V3(H.x - 1.5, 1.8, H.z - 1), w2);
      const d = p.distanceTo(l) * 0.01; p.x += d * Math.sin(t * 0.37) * 0.9; p.y += d * Math.sin(t * 0.51 + 0.7) * 0.6; return { p, l }; };
    const mix = (a, b, k) => ({ p: a.p.clone().lerp(b.p, k), l: a.l.clone().lerp(b.l, k) });
    const camAt = (t) => {
      if (t < T.july + 1.0) { const a = E.camPath(K, t, { arc: 0.1, push: 0.3 }); if (t < T.shortcut + 0.7) return a; return mix(a, scrollCam(t), sineInOut(lin(T.shortcut + 0.7, T.july + 1.0, t))); }
      if (t < T.later + 0.6) return scrollCam(t);
      const b = E.camPath(KK, t, { arc: 0.08, push: 0.25, seed: 2 }); if (t > T.later + 1.6) return b; return mix(scrollCam(Math.min(t, T.later + 0.6)), b, sineInOut(lin(T.later + 0.6, T.later + 1.6, t)));
    };

    const post = { bloom: 0.45, exposure: 1.1 };
    const GOLD = new THREE.Color("#ffd9a8");
    const tmp = V3(0, 0, 0);
    return {
      scene, camera, post,
      update(t) {
        const dk = dawnK(t, 0); // global dawn
        // palette
        REG.forEach((r) => r.m.color.lerpColors(r.a, r.b, dawnK(t, r.delay)));
        const sk = dawnK(t, -0.05); if (Math.abs(sk - skyK) > 0.002 || skyK < 0) { drawSky(sk); skyK = sk; }
        scene.fog.color.lerpColors(fogA, fogB, dawnK(t, 0.3)); scene.background.lerpColors(bgA, bgB, sk);
        L.hemi.color.lerpColors(hemiA[0], hemiB[0], dk); L.hemi.groundColor.lerpColors(hemiA[1], hemiB[1], dk); L.hemi.intensity = lerp(1.05, 0.95, dk);
        L.key.color.lerpColors(keyA, keyB, dk); L.key.intensity = lerp(2.0, 2.5, dk) * (1 + 0.02 * Math.sin(t * 1.7));
        st.update(t); city.update(t);

        // sun: a gold slit on "Second", then rises
        const sunUp = antic(lin(T.second - 0.05, T.second + 1.6, t), 0.05);
        sun.position.y = SUN.y - 9.5 + 9.5 * sunUp + 0.6 * smooth(T.second, T.to, t); sun.position.x = SUN.x + 0.1 * Math.sin(t * 0.2);
        sunHalo.position.set(sun.position.x, sun.position.y, -59.4); sunHalo.material.opacity = smooth(T.second - 0.1, T.second + 0.4, t) * (0.85 + 0.08 * Math.sin(t * 1.3)); sunHalo.visible = t > T.second - 0.2;
        sunHalo.scale.setScalar(0.8 + 0.4 * sunUp);

        // camera
        const cam = camAt(t); E.applyCam(camera, cam);
        // key light follows the look target (tight shadows in close-ups), and swings to the dawn side
        const focus = cam.l, dist = cam.p.distanceTo(cam.l);
        const kd2 = keyDirA.clone().lerp(keyDirB, dk).normalize();
        L.key.target.position.copy(focus); L.key.position.copy(focus).addScaledVector(kd2, 60);
        const bxs = clamp(dist * 0.75, 6, 48); Object.assign(L.key.shadow.camera, { left: -bxs, right: bxs, top: bxs, bottom: -bxs }); L.key.shadow.camera.updateProjectionMatrix();

        // ---- doors: Lena's ajar → wide on "yes"; others in sequence; rewind closes all; final open with amber ----
        const rwDoors = smooth(T.sameLab + 0.4, T.plan, t);
        const finalOpen = antic(lin(T.withH - 0.1, T.eyes + 0.5, t), 0.05);
        towers.forEach((tw, i) => {
          let o; if (i === 0) o = lerp(0.5, 1.0, antic(lin(T.yes - 0.25, T.yes + 0.75, t), 0.06)) * (1 - rwDoors) + finalOpen;
          else o = spring(lin(T.every + 0.1 + (i - 1) * 0.42, T.every + 1.0 + (i - 1) * 0.42, t)) * (1 - smooth(T.sameLab + 0.4 + i * 0.12, T.plan - 0.4 + i * 0.12, t));
          o = clamp(o, 0, 1.08);
          tw.piv.rotation.y = o * 1.85 + 0.01 * Math.sin(t * 0.9 + i);
          const flick = 1 + 0.04 * Math.sin(t * 9.1 + i * 2) * Math.sin(t * 3.3 + i);
          tw.dGlow.userData.setGlow((0.08 + 1.5 * Math.min(1, o)) * flick);
          tw.spill.material.opacity = 0.75 * Math.min(1, o) * (i ? 0.8 : 1) * flick; tw.spill.visible = o > 0.01;
          tw.dCore.material.opacity = i === 0 ? smooth(T.withH - 0.5, T.withH + 0.3, t) : 0;
          if (i === 0) { tw.dGlow.material.color.multiplyScalar(1 - 0.4 * smooth(T.withH - 0.3, T.eyes, t)).lerp(GOLD, 0.3 * smooth(T.withH - 0.3, T.eyes, t) + 0.6 * smooth(T.to - 0.9, T.to - 0.3, t)); } tw.dCore.visible = tw.dCore.material.opacity > 0.001;
          // window backing: cold dim in grey, warm in dawn
          tw.back.material.color.setRGB(lerp(0.09, 0.55, dk), lerp(0.13, 0.32, dk), lerp(0.15, 0.22, dk)).multiplyScalar(1 + 0.05 * Math.sin(t * 0.7 + i));
          if (tw.deskGlow) { const land = notesLand[i] ?? 1e9; const lit = smooth(land, land + 0.5, t); const pulse = 1 + 0.6 * Math.exp(-Math.max(0, t - land) * 3) * (t > land ? 1 : 0);
            tw.deskGlow.material.color.setRGB(lerp(0.25, 1.6, lit), lerp(0.45, 0.85, lit), lerp(0.5, 0.35, lit)).multiplyScalar((0.7 + 0.3 * dk) * pulse);
            tw.worker.userData.pose(t + i, { lookUp: 0.3 * lit, lean: 0.3 * (1 - lit) }); }
        });
        doorLight.intensity = 26 * clamp(towers[0].piv.rotation.y / 1.85, 0, 1) * (1 + 0.04 * Math.sin(t * 9.1));
        doorLight.color.set(t > T.withH ? "#ffd7a0" : C.cyan);

        // ---- Lena ----
        const pencilDown = smooth(T.pages, T.faster, t) * (1 - smooth(T.sameLab, T.plan, t));
        const tickK = lin(T.yes2 - 0.25, T.yes2 + 0.2, t);
        const reach = smooth(T.yes2 - 0.9, T.yes2 - 0.25, t) * (1 - smooth(T.yes2 + 0.6, T.three, t));
        lena.userData.pose(t, { lean: 0.3 * pencilDown - 0.2 * reach, reach: 0.15 + 0.6 * reach + 0.25 * (1 - pencilDown) * (t < T.second ? 0 : 1) * smooth(T.plan, T.screen, t), armDown: 1.5 * pencilDown, lookUp: 0.35 * smooth(T.withH, T.eyes, t) - 0.25 * pencilDown + 0.1 * smooth(T.near, T.reported, t) });
        if (t > T.yes2 - 0.3) { const k = Math.round(clamp(tickK, 0, 1) * 20) / 20; if (k !== qTick) { qCard.userData.redraw({ tick: k }); qTick = k; } } else if (qTick !== 0) { qCard.userData.redraw({}); qTick = 0; }
        calPages.forEach((p, i) => { if (i > 2) { p.rotation.x = 0; return; } const k = inOut(lin(T.three + i * 0.22, T.three + i * 0.22 + 0.4, t)); p.rotation.x = -k * 2.9; });
        lampLight.intensity = lerp(3, 4.5, dk) * (1 - 0.6 * pencilDown) * (1 + 0.03 * Math.sin(t * 5.3));
        lampBulb.material.opacity = lerp(0.35, 1, dk) * (1 - 0.5 * pencilDown);
        scrLight.intensity = 5 + 1.5 * Math.sin(t * 2.3);

        // ---- flipbook ----
        const v = speedAt(t), blur = clamp((v - 2) / 22, 0, 1), spread = 1 + 8 * blur;
        fan.material.opacity = 0.8 * blur * (0.9 + 0.1 * Math.sin(t * 23)); fan.visible = blur > 0.01; fan.rotation.y = 0.05 * Math.sin(t * 17);
        book.userData.update(t, { flip: flipAt(t), spread, open: 1 });
        book.position.y = BK.y + 0.02 * Math.sin(t * 0.8);

        // ---- scroll ----
        const u = uAt(t); const r0 = layScroll(u);
        const cutOn = u > SCUT + 0.15 ? 1 : 0; const findP = Math.exp(-Math.max(0, t - T.finds) * 2.2) * (t > T.finds - 0.05 ? 1 : 0);
        cutGlow.visible = cutHalo.visible = cutOn > 0 && t < T.sameLab + 1.5; cutGlow.material.color.set(C.cyan).multiplyScalar(1.2 + 2.2 * findP);
        cutHalo.material.opacity = 0.35 + 0.65 * findP; cutHalo.scale.setScalar(1 + 0.8 * findP);

        // ---- kitchen ----
        const penFwd = lin(T.just - 0.1, T.authorsE + 0.9, t); const penP = Math.pow(penFwd, 1.15) * (1 - inOut(lin(T.second + 0.25, T.sameLab - 0.1, t)));
        const ps = penAt(penP); pen.position.set(ps.x, ps.y, PEN0.z); pen.rotation.set(0, 0.04, ps.rot); pen.rotation.y = 0.04 + ps.tip;
        cards.forEach((c, i) => { const k = expoOut(lin(c.ta, c.ta + 1.1, t)) * (1 - inOut(lin(T.second + 0.4 + i * 0.1, T.sameLab + 0.2 + i * 0.1, t)));
          c.c.position.set(lerp(-4.7, c.end.x, k), 0.32 + i * 0.006, lerp(-0.3, c.end.z, k)); c.c.rotation.z = lerp(0, c.end.rz, k) + 0.01 * Math.sin(t + i); c.c.visible = k > 0.001; });
        you.userData.pose(t, { lean: 0.35 * (1 - dk) * smooth(T.job, T.summaries, t), lookUp: 0.5 * dawnK(t, 0.3) - 0.2 * smooth(T.job, T.school, t) * (1 - dk), reach: 0.2 });
        pend.intensity = lerp(6, 2.5, dk) * (1 + 0.04 * Math.sin(t * 13) * Math.sin(t * 2.1)); bulb.material.opacity = lerp(0.8, 0.35, dk);
        const wk = dawnK(t, -0.05); winGlow.material.color.lerpColors(winA, winB, wk).multiplyScalar(lerp(0.9, 1.6, wk) * (1 + 0.03 * Math.sin(t * 1.1)));
        hillsWin.material.color.lerpColors(hillA, hillB, wk);
        const ms = antic(lin(T.second - 0.08, T.second + 1.3, t), 0.06); miniSun.position.y = lerp(1.9, 2.75, ms) + 0.05 * smooth(T.second, T.thursday, t); miniHalo.position.y = miniSun.position.y;
        miniSun.visible = t > T.second - 0.1; miniHalo.visible = miniSun.visible; miniHalo.material.opacity = 0.9 * smooth(T.second - 0.05, T.second + 0.3, t);
        winSpot.intensity = 160 * dawnK(t, 0);
        beams.forEach((b, i) => { b.material.opacity = 0.32 * dawnK(t, 0.05) * (0.85 + 0.15 * Math.sin(t * 0.9 + i * 2)); b.visible = t > T.second; });

        // ---- successor model, inspectors ----
        const pop = spring(lin(T.before - 0.1, T.before + 1.0, t)); modelPop.rotation.x = -Math.PI / 2 * (1 - pop) + 0.006 * Math.sin(t * 0.6); model.visible = t > T.before - 0.15;
        modelPop.scale.setScalar(pop > 0 ? 1 : 0.001);
        ringsM.userData.update(t, { think: 0.15, glow: 0.12 + 0.25 * smooth(T.tests, T.inspectors, t) }); ringsM.rotation.y = 0.15 * Math.sin(t * 0.3);
        const panelOpen = [T.tests, T.inspectors, T.aircraft - 0.5];
        panels.forEach((pv, i) => { pv.rotation.x = -1.9 * spring(lin(panelOpen[i] - 0.1, panelOpen[i] + 0.7, t)); });
        const insIn = (i) => lin(T.outside - 0.6 + i * 0.2, T.tests + 0.1 + i * 0.2, t);
        let lx = 0, ly = 0, lz = 0;
        inspectors.forEach((f, i) => { const side = i % 2 ? 1 : -1; const k = sineInOut(insIn(i));
          const xs = MD.x + side * (6.5 + i * 0.5), xe = MD.x + [-1.6, 1.4, 3.3, -3.5][i] + 0.25 * Math.sin(t * 0.5 + i);
          const zz = MD.z + [1.5, 1.6, 1.2, 0.5][i];
          const walking = Math.max(insIn(i) > 0 && insIn(i) < 1 ? 1 : 0, 0.15 * Math.abs(Math.sin(t * 0.5 + i)));
          f.position.set(lerp(xs, xe, k), 0, zz); f.visible = t > T.outside - 0.6 && t < T.withH + 1;
          const facing = side > 0 ? 1 : 0; const reachP = i < 3 ? smooth(panelOpen[i] - 0.5, panelOpen[i], t) * (1 - smooth(panelOpen[i] + 0.6, panelOpen[i] + 1.4, t)) : 0;
          f.userData.pose(t + i * 1.3, { walk: walking, turn: facing, reach: 0.35 + 0.5 * reachP, lookUp: 0.15 + 0.2 * reachP });
          lx += f.position.x; ly += 1.5; lz += f.position.z; });
        insLight.position.set(lx / 4, 2.2, lz / 4 + 1.5); insLight.intensity = 22 * smooth(T.outside - 0.4, T.tests, t) * (1 + 0.05 * Math.sin(t * 6.1));

        // ---- note: leaves Lena's desk, splits to every tower, lands at a desk window ----
        notes.forEach((nn, k) => { const tw = towers[nn.ti]; const tLaunch = T.near - 0.1, tSplit = T.reported + 0.15, tLand = notesLand[nn.ti];
          const vis = t > tLaunch && t < tLand + 0.05; nn.n.visible = vis; if (!vis) return;
          const p0 = V3(DK.x - 0.05, 1.4, DK.z + 0.3), apex = V3(-2, 13, -12);
          const dw = V3(tw.o.x + tw.desk.x, tw.desk.y, tw.o.z + 0.6);
          let p; if (t < tSplit) { const k1 = sineInOut(lin(tLaunch, tSplit, t)); p = p0.clone().lerp(apex, k1); p.y += Math.sin(Math.PI * k1) * 2; p.x += (k - 2) * 0.05 * k1; }
          else { const k2 = sineInOut(lin(tSplit, tLand, t)); const mid = apex.clone().lerp(dw, 0.5).add(V3(0, 5, 0)); p = apex.clone().lerp(mid, k2).lerp(mid.clone().lerp(dw, k2), k2); }
          nn.n.position.copy(p); nn.n.rotation.set(0.6 * Math.sin(t * 5 + k), t * 2.2 + k, 0.4 * Math.sin(t * 3.7 + k)); });

        // ---- clock + threads ----
        const rise = inOut(lin(T.labsIn + 0.1, T.clock + 0.15, t)) ;
        clock.position.y = lerp(-6, CLK.y, rise) + 0.25 * Math.sin(t * 0.4); clock.rotation.z = 0.01 * Math.sin(t * 0.5); clock.visible = t > T.labsIn;
        const tick = antic(lin(T.check - 0.05, T.check + 0.35, t), 0.15);
        mHand.rotation.z = -(t - T.labsIn) * 0.02 - tick * Math.PI / 6; hHand.rotation.z = -1.1 - (t - T.labsIn) * 0.004;
        threads.forEach((m, i) => { const k = expoOut(lin(T.each - 0.25 + i * 0.07, T.check + 0.35 + i * 0.07, t)); m.visible = k > 0.001 && clock.visible;
          if (!m.visible) return; const a = towers[i].top, b = clockBottom(i).add(V3(0, clock.position.y, 0)); const e = a.clone().lerp(b, k);
          m.position.copy(a).add(e).multiplyScalar(0.5); m.scale.set(1, a.distanceTo(e), 1); tmp.copy(e).sub(a).normalize(); m.quaternion.setFromUnitVectors(V3(0, 1, 0), tmp);
          m.material.color.set("#ffcf96").multiplyScalar(1.1 + 0.4 * Math.exp(-Math.max(0, t - T.check) * 3)); });

        // ---- fills ----
        fillIn.update(1 - smooth(T.from + 0.05, T.from + 0.55, t));
        fillOut.update(smooth(T.to - 0.55, T.to - 0.04, t));
        post.bloom = 0.45 + 0.25 * smooth(T.withH, T.to, t) + 0.15 * (1 - smooth(T.from, T.from + 1.2, t));
        post.exposure = 1.1 + 0.15 * smooth(T.eyes, T.to, t);
      },
    };
  },
};
