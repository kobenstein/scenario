// s05 · March 2028 (constructed scenario). Script section 3, "Now let's imagine March, twenty twenty-eight" → "a page arrives with a question on it".
// Carrier in:  full-frame cream PAGE (from the s04 flipbook) turns away around its left edge and reveals Lena's bigger 2028 office.
// Carrier out: the question card (cream, cut "?") lies on Lena's desk, camera pushed in until the card is centred at ~60 % frame width
//              (shared framing `cardCam`, identical code in s06-fork.js, which starts on the same card at 10x scale).
// Beats: summary cards written by one ring and checked by another → 40 red ticks, one visible hesitation → out of the lab window into the
// night city (phone / bank card / child, each a faint cyan glow) → WOW: the whole city's windows take on the cyan tint, "mostly designed by AI"
// → the kitchen table, the phone pops on "again" → the July breakout: the exam box drifts by like a paper lantern, a cyan thread escapes to a
// distant tower and a drawer marked ANSWERS, which slams shut on "Keep" → the cut thread falls into a paper maze and cuts through a wall
// → the maze folds flat into a flipbook page (match cut) on Lena's desk → the book turns faster, slows, a card with a "?" lands.
export default {
  build(E, def) {
    const { THREE, C, PAL, lin, smooth, clamp, lerp, expoOut, inOut, spring, sineInOut, wob } = E;
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const S = (p, n = 1) => E.at("scenario", p, n), SE = (p, n = 1) => E.end("scenario", p, n);
    const T0 = def.from, T1 = def.to;
    const pal = PAL.night;
    const scene = new THREE.Scene();
    const camera = E.newCamera();

    // ---------------- word anchors ----------------
    const tNow = S("Now let's imagine"), tMarch = S("March"), tThats = S("That's the date"), tAutomated = S("automated"), tResearcher = SE("researcher");
    const tLena = S("Lena", 4), tSummaries = S("summaries"), tWritten = S("written"), tChecked = S("checked");
    const tApproves = S("approves"), tLunch = SE("lunch"), tUnderstands = S("understands"), tMost = S("most of them"), tThemE = SE("most of them");
    const tAssistant = S("The assistant"), tPhone = S("phone"), tBank = S("bank"), tTutor = S("tutor"), tMostly = S("mostly", 2), tByAI = SE("designed by AI");
    const tYou = S("You notice"), tKitchen = S("kitchen"), tApp = S("The app"), tAgain = S("again"), tBack = S("Back in July"), tJuly = S("July");
    const tHacking = S("hacking"), tBroke = S("broke"), tServers = S("servers"), tLooking = S("looking"), tAnswer = S("answer"), tCheat = S("cheat");
    const tKeep = S("Keep"), tMindE = SE("mind"), tSystems = S("Systems chasing"), tShortcuts = S("shortcuts"), tNobody = S("nobody intended");
    const tMalice = S("malice"), tOptimizing = S("optimizing"), tFlip = S("The flip book"), tTurning = S("turning"), tFaster = S("faster", 6);
    const tThursday = S("Thursday"), tPage = S("page", 5), tArrives = S("arrives"), tQuestion = S("question");

    // ---------------- stage, sky, lights ----------------
    const stg = E.stage(scene, pal, { stars: 200, skyZ: -150, skyY: 40, floorZ: -50, seed: 21 });
    const rig = E.lights(scene, pal, { key: [-30, 34, 40], target: [0, 0, -10], intensity: 2.2, hemi: 0.75, box: 30 });
    const KEYOFF = V3(-26, 30, 34);
    const setKey = (c, box) => { rig.key.position.copy(c).add(KEYOFF); rig.key.target.position.copy(c);
      const sc = rig.key.shadow.camera; if (sc.right !== box) { Object.assign(sc, { left: -box, right: box, top: box, bottom: -box }); sc.updateProjectionMatrix(); } };

    const ink = new THREE.MeshBasicMaterial({ color: C.ink });
    const flat = (shape, mat = ink) => new THREE.Mesh(new THREE.ShapeGeometry(shape, 12), mat);
    // radial glow sprite texture (soft light halos; additive)
    const halo = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d");
      const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,0.35)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); return t; })();
    const haloPlane = (size, hex) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: halo, color: new THREE.Color(hex), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 }));
      m.renderOrder = 5; return m; };
    // canvas-faced glowing panel (screens): brightness via setGlow
    const glowCanvas = (w, h, px, draw) => { const c = document.createElement("canvas"); c.width = px; c.height = Math.round(px * h / w); const g = c.getContext("2d"); draw(g, c.width, c.height);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex }));
      m.userData.setGlow = (k) => m.material.color.setScalar(k); return m; };

    // =====================================================================================
    // OFFICE (Lena, March 2028) — sits high in the lab tower; its back window looks over the city
    // =====================================================================================
    const OY = 14, DESK_Y = 0.84;
    const off = new THREE.Group(); off.position.set(0, OY, 0); scene.add(off);
    const O = (x, y, z) => V3(x, y + OY, z);
    { const fl = E.box(19, 0.3, 12.5, "#1c2844"); fl.position.set(1.5, -0.15, 3.2); off.add(fl);
      // a paper rug under the desk catches the lamp
      const rug = E.extrude(E.roundRectShape(4.6, 3.0, 0.3), "#2b3a5e", 0.03); rug.rotation.x = -Math.PI / 2; rug.position.set(1.6, 0.0, 1.6); off.add(rug); }
    // back wall with the big window (slides back on the reveal: the room grows)
    const WIN = { x0: -1.0, x1: 4.6, y0: 1.2, y1: 5.0 };
    const backWall = new THREE.Group(); off.add(backWall);
    { const s = E.rectShape(19, 7.6, 1.5, 3.8); const h = new THREE.Path(); h.moveTo(WIN.x0, WIN.y0); h.lineTo(WIN.x1, WIN.y0); h.lineTo(WIN.x1, WIN.y1); h.lineTo(WIN.x0, WIN.y1); h.lineTo(WIN.x0, WIN.y0); s.holes.push(h);
      backWall.add(E.extrude(s, "#24345a", 0.25));
      const mw = 0.09; [WIN.x0 + (WIN.x1 - WIN.x0) / 3, WIN.x0 + 2 * (WIN.x1 - WIN.x0) / 3].forEach((x) => { const b = E.box(mw, WIN.y1 - WIN.y0, 0.12, "#1a2848"); b.position.set(x, (WIN.y0 + WIN.y1) / 2, 0.12); backWall.add(b); });
      const hb = E.box(WIN.x1 - WIN.x0, mw, 0.12, "#1a2848"); hb.position.set((WIN.x0 + WIN.x1) / 2, 3.55, 0.12); backWall.add(hb);
      const sill = E.box(WIN.x1 - WIN.x0 + 0.5, 0.1, 0.45, "#2e4068"); sill.position.set((WIN.x0 + WIN.x1) / 2, WIN.y0 - 0.05, 0.25); backWall.add(sill);
      // pinned notes and a pin-board left of the window (paper detail, catches the lamp)
      const nr = E.rng(91); for (let i = 0; i < 9; i++) { const n = E.box(0.32 + nr() * 0.12, 0.4 + nr() * 0.1, 0.02, i % 4 === 0 ? "#d9cdb2" : C.cream); n.position.set(-5.4 + (i % 3) * 0.55 + nr() * 0.12, 2.0 + Math.floor(i / 3) * 0.62 + nr() * 0.1, 0.27); n.rotation.z = (nr() - 0.5) * 0.18; n.castShadow = false; backWall.add(n); }
      for (let i = 0; i < 5; i++) { const n = E.box(0.3, 0.38, 0.02, C.cream); n.position.set(5.3 + (i % 2) * 0.5, 2.3 + i * 0.45 + (i % 2) * 0.1, 0.27); n.rotation.z = (i % 2 ? 1 : -1) * 0.06; n.castShadow = false; backWall.add(n); } }
    const leftWall = E.box(0.25, 7.6, 12, "#1d2c4d"); leftWall.position.y = 3.8; leftWall.castShadow = false; off.add(leftWall);
    const rightWall = E.box(0.25, 7.6, 12, "#1d2c4d"); rightWall.position.y = 3.8; rightWall.castShadow = false; off.add(rightWall);
    // the two systems: one ring writes the summaries, another checks them (machine = rings, never a robot)
    const ringA = E.machineRings({ n: 4, r: 0.52 }), ringB = E.machineRings({ n: 4, r: 0.44 });
    ringA.position.set(-3.55, 3.55, 0.28); ringB.position.set(-2.15, 3.2, 0.28); backWall.add(ringA, ringB);
    const stackSide = new THREE.MeshStandardMaterial({ roughness: 0.95, map: (() => { const c = document.createElement("canvas"); c.width = 64; c.height = 256; const g = c.getContext("2d"); g.fillStyle = C.cream; g.fillRect(0, 0, 64, 256);
      const r = E.rng(3); for (let y = 0; y < 256; y += 3) { g.fillStyle = `rgba(90,80,60,${0.12 + r() * 0.2})`; g.fillRect(0, y, 64, 1); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })() });
    // paper stacks of code printouts (they fold down into the small summary cards)
    const stacks = [[-3.7, -1.5, 1.35], [-2.9, -1.75, 1.05], [-2.2, -1.35, 0.8]].map(([x, z, h], i) => { const g = new THREE.Group(); g.position.set(x, 0, z); off.add(g);
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1, 0.5), [stackSide, stackSide, E.paperMat(i === 1 ? "#e4dac2" : C.cream), stackSide, stackSide, stackSide]); b.castShadow = b.receiveShadow = true; b.position.y = 0.5; g.add(b); g.userData.h = h; g.scale.y = h; return g; });
    // desk, chair, Lena
    const DESK_HEX = "#34466e";
    { const top = E.box(3.4, 0.07, 1.75, DESK_HEX); top.position.set(1.95, DESK_Y - 0.035, 0.15); off.add(top);
      [[0.35, -0.6], [3.55, -0.6], [0.35, 0.9], [3.55, 0.9]].forEach(([x, z]) => { const l = E.box(0.07, DESK_Y - 0.07, 0.07, "#22314f"); l.position.set(x, (DESK_Y - 0.07) / 2, z); off.add(l); });
      const dr = E.box(0.9, 0.5, 1.4, "#2a3a5e"); dr.position.set(3.05, DESK_Y - 0.32, 0.12); off.add(dr); }
    { const ch = new THREE.Shape(); ch.moveTo(-0.05, 0); ch.lineTo(0.05, 0); ch.lineTo(0.05, 0.5); ch.lineTo(0.42, 0.5); ch.lineTo(0.42, 0.56); ch.lineTo(-0.02, 0.56); ch.lineTo(-0.12, 1.25); ch.lineTo(-0.2, 1.25); ch.lineTo(-0.08, 0.5); ch.lineTo(-0.05, 0.5);
      const m = flat(ch); m.position.set(-0.05, 0, 0.08); off.add(m); }
    const lena = E.figure({ pose: "sit", hair: "bun", coat: true, seed: 3 }); lena.position.set(0, 0, 0.1); off.add(lena);
    // monitor (cyan, secondary light) and desk lamp (amber hero light)
    const monitor = new THREE.Group(); monitor.position.set(3.2, DESK_Y, -0.42); monitor.rotation.y = -0.42; off.add(monitor);
    { const st = E.box(0.07, 0.25, 0.07, "#1a2440"); st.position.y = 0.125; monitor.add(st); const fr = E.box(1.02, 0.66, 0.05, "#141d33"); fr.position.y = 0.58; monitor.add(fr); }
    const screen = glowCanvas(0.94, 0.58, 256, (g, w, h) => { g.fillStyle = "#0e3a4c"; g.fillRect(0, 0, w, h); g.fillStyle = "#bff4ff";
      for (let i = 0; i < 6; i++) { g.globalAlpha = 0.9; g.fillRect(14, 14 + i * 24, 30, 12); g.globalAlpha = 0.55; g.fillRect(52, 16 + i * 24, 90 + ((i * 53) % 90), 8); } g.globalAlpha = 1;
      g.strokeStyle = "#6fe3ff"; g.lineWidth = 3; g.beginPath(); g.arc(w - 46, h / 2, 26, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(w - 46, h / 2, 14, 0, Math.PI * 2); g.stroke(); });
    screen.position.set(0, 0.58, 0.03); monitor.add(screen);
    const lamp = new THREE.Group(); lamp.position.set(3.4, DESK_Y, 0.62); off.add(lamp);
    { const base = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.04, 24), E.paperMat("#1a2238")); base.position.y = 0.02; base.castShadow = true; lamp.add(base);
      const a1 = E.box(0.035, 0.62, 0.035, "#1a2238"); a1.position.set(-0.06, 0.3, 0); a1.rotation.z = 0.22; lamp.add(a1);
      const a2 = E.box(0.035, 0.42, 0.035, "#1a2238"); a2.position.set(-0.24, 0.62, 0); a2.rotation.z = 1.1; lamp.add(a2);
      const sh = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.2, 24, 1, true), new THREE.MeshStandardMaterial({ color: "#1a2238", roughness: 0.9, side: THREE.DoubleSide })); sh.position.set(-0.42, 0.6, 0); sh.rotation.z = 0.5; sh.castShadow = true; lamp.add(sh); }
    const bulb = new THREE.Mesh(new THREE.CircleGeometry(0.1, 20), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.amber).multiplyScalar(2.2) })); bulb.position.set(-0.46, 0.53, 0.0); bulb.rotation.x = -Math.PI / 2; lamp.add(bulb);
    const lampHalo = haloPlane(1.4, C.amber); lampHalo.position.set(-0.46, 0.5, 0.1); lamp.add(lampHalo);
    const spot = new THREE.SpotLight(C.amber, 30, 10, 0.95, 0.75, 1.6); spot.position.copy(O(2.96, DESK_Y + 0.52, 0.62)); spot.target.position.copy(O(1.5, DESK_Y, 0.3));
    spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.radius = 4; spot.shadow.bias = -0.0015; spot.shadow.camera.near = 0.1; spot.shadow.camera.far = 12; scene.add(spot, spot.target);
    const roomFill = E.pointLight("#ffb978", 0, 14); roomFill.position.copy(O(1.8, 3.4, 2.5)); scene.add(roomFill);
    const monLight = E.pointLight(C.cyan, 0, 5); monLight.position.copy(O(2.8, DESK_Y + 0.6, -0.1)); scene.add(monLight);
    // red pencil (only red in the film: Lena's)
    const pencil = new THREE.Group(); off.add(pencil);
    { const b = E.box(0.026, 0.26, 0.026, C.red); b.position.y = -0.13; pencil.add(b); const tip = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.05, 8), E.paperMat("#e8d6b8")); tip.position.y = -0.285; tip.rotation.x = Math.PI; pencil.add(tip); }
    // where her hand is when ticking: solve once from the pose
    const handAt = (p) => { lena.userData.pose(240, p); lena.updateMatrixWorld(true); const v = new THREE.Vector3(); lena.userData.hand.getWorldPosition(v); return off.worldToLocal(v); };
    const TICKPOSE = { reach: 0.82, lean: 0.55 };
    const hTick = handAt(TICKPOSE);
    const ACT = V3(hTick.x + 0.1, DESK_Y + 0.004, 0.36);          // active card on the desk, under the pencil
    const QUE = V3(1.55, DESK_Y + 0.004, -0.32), DONE = V3(0.72, DESK_Y + 0.004, -0.36);
    // summary cards: a code-summary face; instanced (39) + the 40th she hesitates over (own canvas)
    const CW = 0.34, CD = 0.22;
    const drawSummary = (g, w, h, odd) => { g.fillStyle = "#1d2a48"; g.globalAlpha = 0.85; g.fillRect(w * 0.08, h * 0.12, w * 0.4, h * 0.1); g.globalAlpha = 0.45;
      for (let i = 0; i < 4; i++) g.fillRect(w * 0.08, h * (0.34 + i * 0.15), w * (0.5 + ((i * 37) % 30) / 100), h * 0.06); g.globalAlpha = 1;
      g.fillStyle = "#0a6f8c"; g.beginPath(); g.arc(w * 0.84, h * 0.2, h * 0.09, 0, Math.PI * 2); g.fill();
      if (odd) { g.strokeStyle = "#0a6f8c"; g.lineWidth = h * 0.035; g.beginPath(); g.moveTo(w * 0.1, h * 0.88); for (let k = 0; k <= 12; k++) g.lineTo(w * (0.1 + k * 0.05), h * (0.88 + (k % 2 ? -0.08 : 0.02) - (k % 3) * 0.02)); g.stroke(); } };
    const cardTex = (() => { const c = document.createElement("canvas"); c.width = 256; c.height = 166; const g = c.getContext("2d"); g.fillStyle = C.cream; g.fillRect(0, 0, 256, 166); drawSummary(g, 256, 166, false);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const edgeM = new THREE.MeshStandardMaterial({ color: "#a89f8c", roughness: 0.9 }), faceM = new THREE.MeshStandardMaterial({ color: 0xffffff, map: cardTex, roughness: 0.92 });
    const cardMats = [edgeM, edgeM, faceM, edgeM, edgeM, edgeM];
    const NC = 39, cards = new THREE.InstancedMesh(new THREE.BoxGeometry(CW, 0.006, CD), cardMats, NC); cards.castShadow = true; cards.receiveShadow = true; off.add(cards);
    const NF = 14, flyers = new THREE.InstancedMesh(new THREE.BoxGeometry(CW, 0.006, CD), cardMats, NF); flyers.castShadow = true; off.add(flyers);
    const tickTex = (() => { const c = document.createElement("canvas"); c.width = 128; c.height = 100; const g = c.getContext("2d"); g.strokeStyle = C.red; g.lineWidth = 13; g.lineCap = "round"; g.lineJoin = "round";
      g.beginPath(); g.moveTo(14, 52); g.lineTo(44, 84); g.lineTo(114, 12); g.stroke(); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const ticks = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.15, 0.117), new THREE.MeshBasicMaterial({ map: tickTex, transparent: true, alphaTest: 0.3, depthWrite: false }), NC); off.add(ticks);
    const odd = E.drawnCard({ w: CW, h: CD, px: 256, depth: 0.006, draw: (g, w, h, s) => { drawSummary(g, w, h, true);
      if (s.tick) { g.strokeStyle = C.red; g.lineWidth = 13; g.lineCap = "round"; g.lineJoin = "round"; const k = s.tick; g.beginPath(); g.moveTo(w * 0.52, h * 0.56);
        const p1 = [w * 0.64, h * 0.82], p2 = [w * 0.94, h * 0.18]; if (k < 0.35) g.lineTo(lerp(w * 0.52, p1[0], k / 0.35), lerp(h * 0.56, p1[1], k / 0.35)); else { g.lineTo(...p1); const q = (k - 0.35) / 0.65; g.lineTo(lerp(p1[0], p2[0], q), lerp(p1[1], p2[1], q)); } g.stroke(); } } });
    odd.rotation.x = -Math.PI / 2; off.add(odd); let oddTick = -1;
    const oddHalo = haloPlane(0.5, C.cyan); oddHalo.rotation.x = -Math.PI / 2; off.add(oddHalo);
    // tick schedule: 39 quick ones (slow start, a flurry), then the 40th after a visible pause
    const tk = []; for (let i = 0; i < NC; i++) { const x = i / (NC - 1); tk.push(tApproves + 0.1 + (tLunch + 0.15 - tApproves - 0.1) * (x * (1.75 - 0.75 * x))); }
    const tOddIn = tLunch + 0.42, tOddHover = tUnderstands + 0.05, tOddTick = tThemE + 0.02;
    // flight of the summary cards: stack → ring A (written) → ring B (checked) → the desk pile
    const flyPath = new THREE.CatmullRomCurve3([O(-2.9, 1.35, -1.6), O(-3.3, 2.6, -1.95), O(-3.55, 3.55, -2.1), O(-2.85, 3.85, -1.9), O(-2.15, 3.2, -2.1), O(-0.9, 2.6, -1.3), O(0.8, 1.7, -0.6), O(1.55, DESK_Y + 0.3, -0.32), O(1.55, DESK_Y + 0.004, -0.32)].map((v) => v.sub(off.position)));
    const flyStart = (i) => tSummaries - 0.35 + i * ((tApproves - 0.6 - tSummaries) / (NF - 1)), FLYDUR = 1.55;

    // =====================================================================================
    // CITY — paper rows with lit windows (instanced), four hero windows on row 2 (phone, bank card, child, kitchen)
    // =====================================================================================
    const ROWS = [
      { z: -14, col: "#0f182b", h: [3, 6.5], seed: 31 },
      { z: -24, col: "#141f36", h: [8, 13], seed: 32, hero: true },
      { z: -34, col: "#19253d", h: [9, 16], seed: 33 },
      { z: -46, col: "#20304d", h: [8, 18], seed: 34 },
      { z: -60, col: "#283a5d", h: [8, 19], seed: 35 },
      { z: -78, col: "#2f4268", h: [10, 22], seed: 36, dip: [24, 42] },
      { z: -100, col: "#38507c", h: [6, 15], seed: 37 },
    ];
    const HERO = { phone: { x: -9, y: 9.4, w: 2.2, h: 1.5 }, bank: { x: -1, y: 10.6, w: 2.2, h: 1.5 }, child: { x: 7, y: 8.6, w: 2.2, h: 1.5 }, kitchen: { x: -4.75, y: 5.9, w: 2.5, h: 1.75 } };
    const HB = [[-11.6, -6.4, 12.6], [-6.4, -3.1, 8.6], [-3.1, 1.6, 13.4], [1.6, 4.4, 9.5], [4.4, 9.6, 11.6]]; // hero-row buildings [x0,x1,h]
    const winPos = [], winCol = [];
    const cityG = new THREE.Group(); scene.add(cityG);
    const rowMeshes = [];
    ROWS.forEach((R, ri) => { const r = E.rng(R.seed); const s = new THREE.Shape(); s.moveTo(-95, -0.5); let x = -95; const holes = [];
      while (x < 95) { let w = 3 + r() * 4.5, h = R.h[0] + r() * (R.h[1] - R.h[0]); let roof = ["flat", "pitch", "mansard", "chimney", "flat", "step"][Math.floor(r() * 6)];
        if (R.hero) { const hb = HB.find((b) => x >= b[0] - 0.01 && x < b[1]); if (hb) { w = hb[1] - x; h = hb[2]; roof = "flat"; } else { const nx = HB.find((b) => b[0] > x && b[0] < x + w); if (nx) w = nx[0] - x; } }
        if (R.dip && x + w > R.dip[0] && x < R.dip[1]) h = Math.min(h, 6 + r() * 2);
        w = Math.min(w, 95 - x); s.lineTo(x, h);
        if (roof === "pitch") { s.lineTo(x + w / 2, h + w * 0.35); s.lineTo(x + w, h); } else if (roof === "mansard") { s.lineTo(x + w * 0.12, h + 1.2); s.lineTo(x + w * 0.88, h + 1.2); s.lineTo(x + w, h); }
        else if (roof === "chimney") { s.lineTo(x + w * 0.68, h); s.lineTo(x + w * 0.68, h + 1.1); s.lineTo(x + w * 0.78, h + 1.1); s.lineTo(x + w * 0.78, h); s.lineTo(x + w, h); }
        else if (roof === "step") { s.lineTo(x + w * 0.3, h); s.lineTo(x + w * 0.3, h + 1.6); s.lineTo(x + w * 0.7, h + 1.6); s.lineTo(x + w * 0.7, h); s.lineTo(x + w, h); } else s.lineTo(x + w, h);
        // windows on this facade
        for (let wy = 1.4; wy < h - 1.0; wy += 1.55) for (let wx = x + 0.7; wx < x + w - 0.9; wx += 1.25) {
          if (R.hero && Object.values(HERO).some((H) => Math.abs(wx + 0.27 - H.x) < H.w / 2 + 0.7 && Math.abs(wy + 0.4 - H.y) < H.h / 2 + 0.7)) continue;
          if (r() < 0.36) { winPos.push([wx + 0.27, wy + 0.4, R.z + 0.31, ri]); winCol.push(r()); } }
        x += w; }
      s.lineTo(95, -0.5); s.lineTo(-95, -0.5);
      if (R.hero) Object.values(HERO).forEach((H) => { const p = new THREE.Path(); p.moveTo(H.x - H.w / 2, H.y - H.h / 2); p.lineTo(H.x + H.w / 2, H.y - H.h / 2); p.lineTo(H.x + H.w / 2, H.y + H.h / 2); p.lineTo(H.x - H.w / 2, H.y + H.h / 2); p.lineTo(H.x - H.w / 2, H.y - H.h / 2); s.holes.push(p); });
      const m = E.extrude(s, R.col, 0.3, { segments: 4 }); m.position.z = R.z; cityG.add(m); rowMeshes.push(m); });
    const NW = winPos.length;
    const wins = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.55, 0.8), new THREE.MeshBasicMaterial({ color: 0xffffff }), NW); wins.castShadow = false; wins.receiveShadow = false; cityG.add(wins);
    { const d = new THREE.Object3D(); winPos.forEach(([x, y, z], i) => { d.position.set(x, y, z); d.updateMatrix(); wins.setMatrixAt(i, d.matrix); }); wins.instanceMatrix.needsUpdate = true;
      wins.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(NW * 3), 3); }
    const WARM = new THREE.Color("#ffc47a"), COOL = new THREE.Color("#4fd2ff"), _c = new THREE.Color();
    const cyanCenter = V3(0, 9, -24);
    // hero window interiors: amber room glow behind the cut hole, silhouettes, one cyan device each
    const room = (H, z, hex, k) => { const g = new THREE.Group(); g.position.set(H.x, H.y, z); cityG.add(g);
      const back = new THREE.Mesh(new THREE.PlaneGeometry(H.w + 0.8, H.h + 0.8), new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k) })); back.position.z = -1.1; g.add(back);
      const floorM = new THREE.Mesh(new THREE.PlaneGeometry(H.w + 0.8, 1.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k * 0.45) })); floorM.rotation.x = -Math.PI / 2; floorM.position.set(0, -H.h / 2 + 0.02, -0.5); g.add(floorM);
      g.userData.back = back; return g; };
    const devices = [];
    const device = (g, w, h, x, y, z, haloSize = 1.4) => { const d = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan).multiplyScalar(0.1) })); d.position.set(x, y, z); g.add(d);
      const hl = haloPlane(haloSize, C.cyan); hl.position.set(x, y, z + 0.05); g.add(hl); const o = { d, hl }; devices.push(o); return o; };
    const rowZ = ROWS[1].z;
    // phone: a standing figure, phone raised
    const rPhone = room(HERO.phone, rowZ, "#ffb35c", 0.55);
    const fPhone = E.figure({ pose: "stand", hair: "short", scale: 0.62, seed: 11 }); fPhone.position.set(-0.4, -HERO.phone.h / 2, -0.55); rPhone.add(fPhone);
    const dPhone = device(rPhone, 0.07, 0.12, 0.05, 0.25, -0.5, 0.9);
    // bank card: a seated figure holding up a card at a small table
    const rBank = room(HERO.bank, rowZ, "#ffb35c", 0.5);
    const fBank = E.figure({ pose: "sit", hair: "long", scale: 0.6, seed: 12 }); fBank.position.set(-0.55, -HERO.bank.h / 2, -0.55); rBank.add(fBank);
    { const tb = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.05), ink); tb.position.set(0.2, -HERO.bank.h / 2 + 0.5, -0.6); rBank.add(tb); const lg = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.5), ink); lg.position.set(0.55, -HERO.bank.h / 2 + 0.25, -0.6); rBank.add(lg); }
    const dBank = device(rBank, 0.2, 0.13, -0.02, -0.02, -0.5, 1.0);
    // child at a table with a tablet
    const rChild = room(HERO.child, rowZ, "#ffb35c", 0.5);
    const fChild = E.figure({ pose: "sit", hair: "short", scale: 0.45, seed: 13 }); fChild.position.set(-0.35, -HERO.child.h / 2, -0.55); rChild.add(fChild);
    { const tb = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.05), ink); tb.position.set(0.25, -HERO.child.h / 2 + 0.4, -0.6); rChild.add(tb); const lg = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.4), ink); lg.position.set(0.65, -HERO.child.h / 2 + 0.2, -0.6); rChild.add(lg);
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 0.5), ink); pl.position.set(0.25, 0.5, -0.62); rChild.add(pl); const sh = flat(E.polyShape([[-0.18, 0], [0.18, 0], [0.09, 0.14], [-0.09, 0.14]])); sh.position.set(0.25, 0.12, -0.62); rChild.add(sh); }
    const dChild = device(rChild, 0.2, 0.03, 0.12, -HERO.child.h / 2 + 0.44, -0.56, 1.0); dChild.d.rotation.z = 0.25;
    // the kitchen: "you" at the table, pendant lamp, phone
    const KZ = rowZ;
    const rKit = room(HERO.kitchen, KZ, "#ffb35c", 0.85);
    const fYou = E.figure({ pose: "sit", hair: "short", scale: 0.72, seed: 7 }); fYou.position.set(-0.6, -HERO.kitchen.h / 2, -0.55); rKit.add(fYou);
    { const tb = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.06), ink); tb.position.set(0.25, -HERO.kitchen.h / 2 + 0.56, -0.6); rKit.add(tb);
      [-0.3, 0.8].forEach((x) => { const lg = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.56), ink); lg.position.set(x, -HERO.kitchen.h / 2 + 0.28, -0.6); rKit.add(lg); });
      const mug = flat(E.roundRectShape(0.1, 0.12, 0.02)); mug.position.set(0.55, -HERO.kitchen.h / 2 + 0.65, -0.6); rKit.add(mug);
      const cord = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 0.5), ink); cord.position.set(0.25, 0.68, -0.65); rKit.add(cord);
      const shade = flat(E.polyShape([[-0.22, 0], [0.22, 0], [0.1, 0.18], [-0.1, 0.18]])); shade.position.set(0.25, 0.26, -0.64); rKit.add(shade);
      const sill = E.box(HERO.kitchen.w + 0.4, 0.1, 0.4, "#24345a"); sill.position.set(0, -HERO.kitchen.h / 2 - 0.05, 0.4); rKit.add(sill);
      const pot = E.box(0.22, 0.2, 0.2, "#7a3b17"); pot.position.set(0.95, -HERO.kitchen.h / 2 + 0.1, 0.4); rKit.add(pot);
      for (let i = 0; i < 4; i++) { const lf = flat(E.polyShape([[0, 0], [0.05, 0.18], [0, 0.32], [-0.05, 0.18]])); lf.position.set(0.95 + (i - 1.5) * 0.06, -HERO.kitchen.h / 2 + 0.2, 0.5); lf.rotation.z = (i - 1.5) * 0.35; rKit.add(lf); }
      const mul = E.box(0.06, HERO.kitchen.h, 0.08, "#141f36"); mul.position.set(0, 0, 0.32); rKit.add(mul); }
    const kBulb = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.amber).multiplyScalar(2.5) })); kBulb.position.set(0.25, 0.24, -0.62); rKit.add(kBulb);
    const kHalo = haloPlane(1.6, C.amber); kHalo.position.set(0.25, 0.22, -0.6); rKit.add(kHalo);
    const dYou = device(rKit, 0.07, 0.12, 0, 0, -0.5, 0.55);
    const kitLight = E.pointLight("#ffb062", 0, 9); kitLight.position.set(HERO.kitchen.x + 0.25, HERO.kitchen.y + 0.1, KZ + 1.2); scene.add(kitLight);
    const youLight = E.pointLight(C.cyan, 0, 5); scene.add(youLight);

    // =====================================================================================
    // THE EXAM BOX AS A PAPER LANTERN (from the hook): discs bent over exam booklets, a seam in the lid
    // =====================================================================================
    const LB = 1.3; const lantern = new THREE.Group(); scene.add(lantern);
    const lanMats = E.paperMats("#efe6d2", { emissive: 0 }); lanMats[0].emissive = new THREE.Color(C.cyan); lanMats[0].emissiveIntensity = 0.0;
    { const panel = () => { const s = E.rectShape(LB, LB); const h = new THREE.Path(); const q = LB / 2 - 0.16; h.moveTo(-q, -q); h.lineTo(q, -q); h.lineTo(q, q); h.lineTo(-q, q); h.lineTo(-q, -q); s.holes.push(h); return E.extrude(s, null, 0.035, { mats: lanMats, segments: 2 }); };
      for (let k = 0; k < 4; k++) { const p = panel(); const a = k * Math.PI / 2; p.position.set(Math.sin(a) * LB / 2, 0, Math.cos(a) * LB / 2); p.rotation.y = a; lantern.add(p);
        const bar = E.box(0.04, LB - 0.3, 0.03, "#efe6d2"); bar.position.copy(p.position).multiplyScalar(1.01); bar.rotation.y = a; lantern.add(bar); }
      const bottom = E.box(LB, 0.04, LB, "#d9cdb2"); bottom.position.y = -LB / 2; lantern.add(bottom); }
    const lid = new THREE.Group(); lid.position.set(-LB / 2, LB / 2, 0); lantern.add(lid);
    { const l = E.box(LB + 0.06, 0.05, LB + 0.06, "#efe6d2"); l.position.set(LB / 2, 0.025, 0); lid.add(l); }
    const lanCore = new THREE.Mesh(new THREE.PlaneGeometry(LB * 0.9, LB * 0.9), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan).multiplyScalar(0.35) })); lanCore.position.z = -LB / 2 + 0.08; lantern.add(lanCore);
    for (let i = 0; i < 3; i++) { const x = (i - 1) * 0.36, z = (i === 1 ? -0.12 : 0.1);
      const bk = E.box(0.2, 0.012, 0.14, C.cream); bk.position.set(x + 0.04, -LB / 2 + 0.2, z); bk.rotation.y = 0.2; lantern.add(bk);
      const dk = E.box(0.26, 0.17, 0.18, "#1a2440"); dk.position.set(x + 0.04, -LB / 2 + 0.1, z); lantern.add(dk);
      const disc = E.extrude(E.circleShape(0.085), C.cyan, 0.03, { emissive: 1.4, cast: false }); disc.position.set(x - 0.06, -LB / 2 + 0.36, z); disc.rotation.set(-0.2, 0.5, -0.75); lantern.add(disc);
      const stem = E.box(0.02, 0.14, 0.02, "#0a6f8c"); stem.position.set(x - 0.08, -LB / 2 + 0.26, z); stem.rotation.z = -0.3; lantern.add(stem); }
    const lanHalo = haloPlane(4.2, C.cyan); lantern.add(lanHalo);
    const lanLight = E.pointLight(C.cyan, 0, 9); lantern.add(lanLight);
    const LP = [[tBack - 0.35, V3(-12.5, 7.9, -21.2)], [tHacking, V3(-4.6, 8.6, -21.4)], [tBroke, V3(-2.4, 9.2, -21.5)], [tKeep, V3(5, 12.5, -24.2)], [T1, V3(10, 15.5, -29)]];
    const lanPos = (t) => { let i = 0; while (i < LP.length - 2 && t > LP[i + 1][0]) i++; const [ta, pa] = LP[i], [tb, pb] = LP[i + 1]; const k = sineInOut(lin(ta, tb, t));
      const p = pa.clone().lerp(pb, k); p.y += 0.12 * Math.sin(t * 1.3); p.x += 0.05 * Math.sin(t * 0.7); return p; };

    // =====================================================================================
    // THE OTHER COMPANY'S TOWER, the drawer marked ANSWERS, the maze on the roof in front of it
    // =====================================================================================
    const TW = V3(33, 0, -84);
    const tower = E.tower({ w: 7, h: 34, floors: 14, hex: "#2a3c62", roof: "spire" }); tower.position.copy(TW); scene.add(tower);
    const towerFront = TW.z + 0.5;
    const drawerY = 15.0;
    const cabinet = new THREE.Group(); cabinet.position.set(TW.x, drawerY, towerFront); cabinet.scale.setScalar(1.5); scene.add(cabinet);
    { const shell = new THREE.Group(); cabinet.add(shell);
      const parts = [[2.5, 0.1, 1.3, 0, 0.62, 0.65], [2.5, 0.1, 1.3, 0, -0.62, 0.65], [0.1, 1.34, 1.3, -1.2, 0, 0.65], [0.1, 1.34, 1.3, 1.2, 0, 0.65]];
      parts.forEach(([w, h, d, x, y, z]) => { const b = E.box(w, h, d, "#33476d"); b.position.set(x, y, z); shell.add(b); }); }
    const drawer = new THREE.Group(); cabinet.add(drawer);
    { const fr = E.drawnCard({ w: 2.25, h: 1.08, px: 512, hex: "#3b5180", depth: 0.08, draw: (g, w, h) => { g.fillStyle = C.cream; const lw = w * 0.56, lh = h * 0.32; g.fillRect((w - lw) / 2, h * 0.2, lw, lh);
        g.fillStyle = "#1d2a48"; g.font = `500 ${Math.round(lh * 0.62)}px Inter`; g.textAlign = "center"; g.textBaseline = "middle"; g.letterSpacing = "6px"; g.fillText("ANSWERS", w / 2, h * 0.2 + lh * 0.54);
        g.fillStyle = "#1a2440"; g.fillRect(w * 0.42, h * 0.68, w * 0.16, h * 0.08); } });
      fr.position.z = 1.32; drawer.add(fr);
      const tray = [[2.1, 0.06, 1.25, 0, -0.45, 0.65], [0.06, 0.8, 1.25, -1.02, -0.1, 0.65], [0.06, 0.8, 1.25, 1.02, -0.1, 0.65]]; tray.forEach(([w, h, d, x, y, z]) => { const b = E.box(w, h, d, "#2a3c62"); b.position.set(x, y, z); drawer.add(b); });
      for (let i = 0; i < 5; i++) { const f = E.box(1.7, 0.5, 0.012, C.cream); f.position.set(0, -0.15, 0.2 + i * 0.2); f.rotation.x = -0.08; drawer.add(f); } }
    const drawerGlow = glowCanvas(1.9, 1.1, 64, (g, w, h) => { const gr = g.createLinearGradient(0, h, 0, 0); gr.addColorStop(0, "#ffffff"); gr.addColorStop(1, "#000000"); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    drawerGlow.material.blending = THREE.AdditiveBlending; drawerGlow.material.transparent = true; drawerGlow.material.depthWrite = false;
    drawerGlow.rotation.x = -Math.PI / 2; drawerGlow.position.set(0, 0.3, 0.75); drawer.add(drawerGlow);
    const drawerHalo = haloPlane(3.6, C.cyan); drawerHalo.position.set(0, 0.5, 1.6); cabinet.add(drawerHalo);
    const drawerLight = E.pointLight(C.cyan, 0, 7); drawerLight.position.set(TW.x, drawerY + 0.9, towerFront + 1.6); scene.add(drawerLight);
    // the plinth roof and the maze
    const MZ = { cols: 7, rows: 5, cell: 0.8 }; const MW = MZ.cols * MZ.cell, MH = MZ.rows * MZ.cell; const SW = 6.3, SH = 4.5;
    const MC = V3(29.6, 6.0, -73.2);
    { const pl = E.box(8.6, 6.0, 6.8, "#253658"); pl.position.set(MC.x, 3.0, MC.z); scene.add(pl); const rim = E.box(8.9, 0.18, 7.1, "#2e4068"); rim.position.set(MC.x, 6.0, MC.z); scene.add(rim); }
    // maze: walls V[r][c] (left side of cell c, c=0..cols), H[r][c] (top side of row r, r=0..rows); carve with a seeded backtracker
    const mr = E.rng(57); const Vw = [], Hw = []; for (let r = 0; r < MZ.rows; r++) { Vw.push([]); for (let c = 0; c <= MZ.cols; c++) Vw[r].push(true); }
    for (let r = 0; r <= MZ.rows; r++) { Hw.push([]); for (let c = 0; c < MZ.cols; c++) Hw[r].push(true); }
    { const seen = new Set([0]); const st = [[0, 0]]; while (st.length) { const [r, c] = st[st.length - 1]; const nb = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < MZ.rows && b < MZ.cols && !seen.has(a * 99 + b));
        if (!nb.length) { st.pop(); continue; } const [a, b] = nb[Math.floor(mr() * nb.length)]; seen.add(a * 99 + b);
        if (a !== r) Hw[Math.max(a, r)][c] = false; else Vw[r][Math.max(b, c)] = false; st.push([a, b]); } }
    const ENT = [2, 0]; Vw[2][0] = false;
    const open = (r, c, a, b) => (a !== r ? !Hw[Math.max(a, r)][c] : !Vw[r][Math.max(b, c)]);
    const dist = {}, prev = {}; { const q = [ENT]; dist[ENT[0] * 99 + ENT[1]] = 0; while (q.length) { const [r, c] = q.shift(); [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([a, b]) => {
      if (a < 0 || b < 0 || a >= MZ.rows || b >= MZ.cols || dist[a * 99 + b] !== undefined || !open(r, c, a, b)) return; dist[a * 99 + b] = dist[r * 99 + c] + 1; prev[a * 99 + b] = [r, c]; q.push([a, b]); }); } }
    let best = null; for (let r = 0; r < MZ.rows; r++) for (let c = 0; c < MZ.cols; c++) { const dA = dist[r * 99 + c]; if (dA === undefined || dA < 2 || dA > 4) continue;
      [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([a, b]) => { if (a < 0 || b < 0 || a >= MZ.rows || b >= MZ.cols || open(r, c, a, b)) return; const gain = dist[a * 99 + b] - dA; if (!best || gain > best.gain) best = { A: [r, c], G: [a, b], gain }; }); }
    const cellUV = ([r, c]) => [-MW / 2 + (c + 0.5) * MZ.cell, MH / 2 - (r + 0.5) * MZ.cell];
    const pathTo = (cell) => { const out = [cell]; let k = cell; while (prev[k[0] * 99 + k[1]]) { k = prev[k[0] * 99 + k[1]]; out.unshift(k); } return out; };
    const entUV = [-MW / 2 - 0.45, cellUV(ENT)[1]];
    const cyanUV = [entUV, ...pathTo(best.A).map(cellUV), cellUV(best.G)];
    const amberUV = [entUV, ...pathTo(best.G).map(cellUV)];
    const cutWall = best.A[0] !== best.G[0] ? { kind: "H", r: Math.max(best.A[0], best.G[0]), c: best.A[1] } : { kind: "V", r: best.A[0], c: Math.max(best.A[1], best.G[1]) };
    const WH = 0.24, WT = 0.05;
    const walls = []; for (let r = 0; r < MZ.rows; r++) for (let c = 0; c <= MZ.cols; c++) if (Vw[r][c]) walls.push({ kind: "V", r, c });
    for (let r = 0; r <= MZ.rows; r++) for (let c = 0; c < MZ.cols; c++) if (Hw[r][c]) walls.push({ kind: "H", r, c });
    // canvas drawing of the maze (sheet + flipbook pages share it). opts: folded (walls as flat bars), cyan 0..1, amber 0..1, cut (cut wall fallen)
    const uvToPx = (u, v, w) => [(u + SW / 2) * w / SW, (SH / 2 - v) * w / SW];
    const polyAt = (pts, k) => { const segs = []; let L = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(d); L += d; }
      const out = [pts[0]]; let rem = k * L; for (let i = 1; i < pts.length && rem > 0; i++) { const d = segs[i - 1]; if (rem >= d) { out.push(pts[i]); rem -= d; } else { const q = rem / d; out.push([lerp(pts[i - 1][0], pts[i][0], q), lerp(pts[i - 1][1], pts[i][1], q)]); rem = 0; } } return out; };
    const drawMaze = (g, w, h, o = {}) => { const k = w / SW; g.fillStyle = C.cream; g.fillRect(0, 0, w, h);
      g.strokeStyle = "rgba(29,42,72,0.18)"; g.lineWidth = Math.max(1, k * 0.012); g.strokeRect(...uvToPx(-SW / 2 + 0.15, SH / 2 - 0.15, w), (SW - 0.3) * k, (SH - 0.3) * k);
      walls.forEach((wl) => { const isCut = wl.kind === cutWall.kind && wl.r === cutWall.r && wl.c === cutWall.c;
        let u0, v0, u1, v1; if (wl.kind === "V") { u0 = u1 = -MW / 2 + wl.c * MZ.cell; v0 = MH / 2 - wl.r * MZ.cell; v1 = v0 - MZ.cell; } else { v0 = v1 = MH / 2 - wl.r * MZ.cell; u0 = -MW / 2 + wl.c * MZ.cell; u1 = u0 + MZ.cell; }
        if (o.folded || (isCut && o.cut)) { g.fillStyle = "#2c3f63"; const [x0, y0] = uvToPx(Math.min(u0, u1), Math.max(v0, v1), w);
          if (wl.kind === "V") g.fillRect(x0 - WT * k / 2, y0, WH * k, MZ.cell * k); else g.fillRect(x0, y0 - WT * k / 2, MZ.cell * k, WH * k);
          if (isCut) { g.fillStyle = C.cream; const m = uvToPx((u0 + u1) / 2, (v0 + v1) / 2, w); g.save(); g.translate(m[0], m[1]); g.rotate(0.3); g.fillRect(-0.09 * k, -0.2 * k, 0.18 * k, 0.4 * k); g.restore(); } }
        else { g.strokeStyle = "rgba(29,42,72,0.55)"; g.lineWidth = WT * k; g.beginPath(); g.moveTo(...uvToPx(u0, v0, w)); g.lineTo(...uvToPx(u1, v1, w)); g.stroke(); } });
      const line = (pts, col, lw, dash) => { if (pts.length < 2) return; g.save(); g.strokeStyle = col; g.lineWidth = lw * k; g.lineCap = "round"; g.lineJoin = "round"; if (dash) g.setLineDash([0.09 * k, 0.09 * k]);
        g.beginPath(); g.moveTo(...uvToPx(...pts[0], w)); pts.slice(1).forEach((p) => g.lineTo(...uvToPx(...p, w))); g.stroke(); g.restore(); };
      if (o.amber) line(polyAt(amberUV, o.amber), "#e2903c", 0.045, true);
      if (o.cyan) { line(polyAt(cyanUV, o.cyan), "rgba(111,227,255,0.35)", 0.16); line(polyAt(cyanUV, o.cyan), "#3ec8ef", 0.06); }
      const [gx, gy] = uvToPx(...cellUV(best.G), w); g.strokeStyle = o.cyan >= 1 ? "#3ec8ef" : "#1d2a48"; g.lineWidth = 0.035 * k; g.beginPath(); g.arc(gx, gy, 0.16 * k, 0, Math.PI * 2); g.stroke(); g.beginPath(); g.arc(gx, gy, 0.06 * k, 0, Math.PI * 2); g.stroke(); };
    const sheet = E.drawnCard({ w: SW, h: SH, px: 1024, depth: 0.04, draw: (g, w, h, s) => drawMaze(g, w, h, s) }); sheet.rotation.x = -Math.PI / 2; sheet.position.copy(MC).add(V3(0, 0.13, 0)); scene.add(sheet);
    let sheetState = "";
    const UVW = (u, v, y = 0) => V3(MC.x + u, MC.y + 0.15 + y, MC.z - v);
    const wallIM = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), E.paperMat("#2c3f63"), walls.length); wallIM.castShadow = true; wallIM.receiveShadow = true; scene.add(wallIM);
    const cutIdx = walls.findIndex((wl) => wl.kind === cutWall.kind && wl.r === cutWall.r && wl.c === cutWall.c);
    const cutDir = cutWall.kind === "H" ? (best.G[0] > best.A[0] ? 1 : -1) : (best.G[1] > best.A[1] ? 1 : -1); // fall in the line's travel direction
    const _o = new THREE.Object3D();
    const setWalls = (fold, cutK) => walls.forEach((wl, i) => { const f = i === cutIdx ? cutK : fold; let u, v;
      if (wl.kind === "V") { u = -MW / 2 + wl.c * MZ.cell; v = MH / 2 - (wl.r + 0.5) * MZ.cell; } else { u = -MW / 2 + (wl.c + 0.5) * MZ.cell; v = MH / 2 - wl.r * MZ.cell; }
      const base = UVW(u, v); _o.position.copy(base); _o.rotation.set(0, wl.kind === "V" ? Math.PI / 2 : 0, 0); _o.updateMatrix();
      // fold about the base line: H walls fall toward +z (screen down), V walls toward +x; the cut wall falls along the line
      const dir = i === cutIdx ? (wl.kind === "H" ? -cutDir : cutDir) : 1;
      const m = new THREE.Matrix4().makeRotationX(dir * f * Math.PI / 2); const sc = new THREE.Matrix4().makeTranslation(0, WH / 2, 0).premultiply(m);
      const s2 = new THREE.Matrix4().makeScale(MZ.cell + WT, WH, WT); _o.matrix.multiply(sc).multiply(s2); wallIM.setMatrixAt(i, _o.matrix); }) || (wallIM.instanceMatrix.needsUpdate = true);
    // the cyan maze line (a glowing paper thread) and the goal ring
    const lineMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan).multiplyScalar(1.6) });
    const mazePath = new THREE.CurvePath(); for (let i = 1; i < cyanUV.length; i++) mazePath.add(new THREE.LineCurve3(UVW(...cyanUV[i - 1], 0.035), UVW(...cyanUV[i], 0.035)));
    const MSEG = 240; const mazeLine = new THREE.Mesh(new THREE.TubeGeometry(mazePath, MSEG, 0.03, 6, false), lineMat); scene.add(mazeLine);
    const cumLen = (() => { const L = []; let s = 0; L.push(0); for (let i = 1; i < cyanUV.length; i++) { s += Math.hypot(cyanUV[i][0] - cyanUV[i - 1][0], cyanUV[i][1] - cyanUV[i - 1][1]); L.push(s); } return L.map((x) => x / s); })();
    const kBeforeCut = cumLen[cumLen.length - 2];
    const goal = E.extrude(E.ringShape(0.1, 0.17), C.cream, 0.03, { emissive: 0 }); goal.rotation.x = -Math.PI / 2; goal.position.copy(UVW(...cellUV(best.G), 0.0)); scene.add(goal);
    goal.material[0].emissive = new THREE.Color(C.cyan);
    const spark = haloPlane(1.2, C.cyan); spark.rotation.x = -Math.PI / 2; scene.add(spark);
    const mazeLight = E.pointLight(C.cyan, 0, 6); scene.add(mazeLight);
    // the thread: lantern seam → across the city → searches the tower's floors → the drawer; then cut, it falls into the maze entrance
    const threadMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan).multiplyScalar(1.8) });
    const thread = new THREE.Mesh(new THREE.BufferGeometry(), threadMat); scene.add(thread);
    const tip = haloPlane(1.6, C.cyan); scene.add(tip);
    const DRW = V3(TW.x, drawerY + 0.22, towerFront + 1.95);
    const searchPts = [V3(TW.x - 4.5, 21.5, towerFront + 3.0), V3(TW.x + 2.5, 22.5, towerFront + 1.1), V3(TW.x - 2.6, 19.2, towerFront + 1.0), V3(TW.x + 2.6, 17.6, towerFront + 1.0), V3(TW.x - 1.2, drawerY + 1.4, towerFront + 2.0)];
    const threadCurve = (seam) => new THREE.CatmullRomCurve3([seam, seam.clone().add(V3(0.6, 1.4, -0.5)), seam.clone().add(V3(4, 4.2, -6)), V3(14, 18, -42), V3(24, 21, -62), ...searchPts, DRW, DRW.clone().add(V3(0, -0.15, -0.9))], false, "catmullrom", 0.4);
    const ENTW = UVW(...entUV, 0.035);
    const tTip = (t) => { // fraction of the thread drawn: out of the seam → city → tower (servers) → search → drawer (answer) → in (cheat)
      if (t < tBroke) return 0; if (t < tServers) return 0.48 * sineInOut(lin(tBroke, tServers, t)); if (t < tAnswer) return lerp(0.48, 0.86, sineInOut(lin(tServers, tAnswer, t)));
      return lerp(0.86, 1, expoOut(lin(tAnswer + 0.3, tCheat + 0.25, t))); };
    const tFall0 = tMindE + 0.25, tFall1 = tSystems + 0.25;

    // =====================================================================================
    // FLIPBOOK on Lena's desk (match cut from the maze page) and the question card
    // =====================================================================================
    const FBS = 0.2, PGW = 4.2 * FBS; // page 0.84 x 0.6
    const book = E.flipbook({ w: 4.2, h: 3, pages: 24, cover: "#2c3f63", seed: 9, drawPage: (g, w, h, i) => drawMaze(g, w, h, { folded: true, cut: true, cyan: i === 1 ? 1 : 0.35 + 0.65 * ((i * 5) % 9) / 8, amber: 1 }) });
    book.scale.setScalar(FBS); book.rotation.x = -Math.PI / 2; const SPINE = O(2.22, DESK_Y + 0.0705, -0.3); book.position.copy(SPINE); scene.add(book);
    const PAGEC = V3(SPINE.x + PGW / 2, SPINE.y, SPINE.z); // right page centre (world)
    const SCALE_MF = PGW / SW; // maze sheet → flipbook page
    // flip schedule: rest at 0.5 (page 1 = the maze on the right), accelerate on "turning faster", slow, stop on one page at "page"
    const tF0 = tFlip + 0.55, tFmax = tFaster + 0.2, tFslow = tThursday - 0.35, tFstop = tPage - 0.02;
    const rate = (t) => (t < tF0 ? 0 : t < tFmax ? 9 * Math.pow(lin(tF0, tFmax, t), 1.6) : t < tFslow ? 9 : 9 * Math.pow(1 - lin(tFslow, tFstop, t), 1.8));
    const FT = []; { let acc = 0; for (let t = tF0; t <= tFstop + 1e-6; t += 1 / 240) { FT.push(acc); acc += rate(t) / 240; } }
    const FTOT = FT[FT.length - 1]; const FEND = Math.round(FTOT); const FSC = FEND / FTOT;
    const flipAt = (t) => { if (t <= tF0) return 0.5; const i = Math.min(FT.length - 1, Math.floor((t - tF0) * 240)); return 0.5 + FT[i] * FSC; };
    const spreadAt = (t) => 1 + 2.5 * smooth(tF0, tFmax, t) * (1 - smooth(tFslow, tFstop - 0.15, t));
    // the question card (folded cream card, paper-cut "?"), 0.8 x 0.5; rests centred at CARD
    const QW = 0.8, QD = 0.5; const CARD = O(1.6, DESK_Y, 0.55);
    const qcard = new THREE.Group(); scene.add(qcard);
    { const base = E.box(QW, 0.006, QD, C.cream); base.position.y = 0.003; qcard.add(base); const cover = E.box(QW - 0.004, 0.006, QD - 0.004, "#f1e9d6"); cover.position.y = 0.0095; qcard.add(cover);
      const q = E.cutoutText("?", { height: 0.4, hex: "#0b1020" }); q.rotation.x = -Math.PI / 2; q.position.set(0, 0.0135, 0.0); qcard.add(q); }
    const tCardOut = tArrives - 0.25, tCardLand = SE("question") + 0.05;
    const cardStart = V3(PAGEC.x + 0.05, PAGEC.y + 0.02, PAGEC.z + 0.02);
    const CUT = T1; // the cut to s06
    const N_CARD = V3(0, 1, 0.12).normalize();
    // shared with s06 (scaled 10x there): the card framing, centred at ~60 % frame width, slow continuous push
    const cardCam = (t, C0, s) => { const D = 1.4863 * s * (1 + 0.025 * (CUT - t)); return { p: C0.clone().addScaledVector(N_CARD, D), l: C0.clone() }; };

    // ---------------- the opening page (carrier from s04) ----------------
    const PG = { w: 4, h: 2.25 }; // 16:9, placed so it overfills the frame at the start
    const pagePivot = new THREE.Group(); scene.add(pagePivot);
    const pageMesh = E.drawnCard({ w: PG.w, h: PG.h, px: 512, depth: 0.008, draw: (g, w, h) => { g.fillStyle = "rgba(120,110,90,0.05)"; for (let i = 0; i < 6; i++) g.fillRect(0, h * (0.12 + i * 0.15), w, 1); } });
    pageMesh.position.x = PG.w / 2; pageMesh.castShadow = false; pagePivot.add(pageMesh); pageMesh.material[4].emissive = new THREE.Color(C.cream); pageMesh.material[4].emissiveIntensity = 0.62; pageMesh.material[4].color.set("#d8cfbd");
    const tPageTurn = tNow + 0.2; const pageQ = new THREE.Quaternion();

    // =====================================================================================
    // CAMERA
    // =====================================================================================
    const val = (x, t) => (typeof x === "function" ? x(t) : V3(...x));
    const drift = (t, p, l) => { const d = p.distanceTo(l) * 0.01; p.x += d * (Math.sin(t * 0.37) * 0.9 + Math.sin(t * 0.83 + 1.3) * 0.4); p.y += d * (Math.sin(t * 0.51 + 0.7) * 0.6 + Math.sin(t * 1.13 + 2.1) * 0.2);
      l.x += d * Math.sin(t * 0.29 + 0.4) * 0.5; l.y += d * Math.sin(t * 0.43 + 1.9) * 0.35; };
    const EASE = { sine: sineInOut, smooth: (x) => x * x * (3 - 2 * x), inOut, lin: (x) => x, out: (x) => 1 - Math.pow(1 - x, 3) };
    const path = (keys, t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++; const a = keys[i], b = keys[i + 1];
      const kk = EASE[b.e || "sine"](b.t > a.t ? lin(a.t, b.t, t) : 1); const pa = val(a.p, t), pb = val(b.p, t), la = val(a.l, t), lb = val(b.l, t);
      const p = pa.clone().lerp(pb, kk), l = la.clone().lerp(lb, kk); const bulge = Math.sin(Math.PI * kk) * pa.distanceTo(pb) * (b.arc ?? 0.1); p.x += bulge * (i % 2 ? -1 : 1); p.y += bulge * 0.4; return { p, l }; };
    const kitchenWin = V3(HERO.kitchen.x, HERO.kitchen.y, rowZ);
    const lanLook = (dx, dy, dz) => (t) => lanPos(t).add(V3(dx, dy, dz));
    const tipW = new THREE.Vector3(), tipLag = new THREE.Vector3();
    const camTip = (t) => tipLag.clone().add(V3(1.8, 1.6, 7.5));
    const fill = (C0, s) => C0.clone().addScaledVector(N_CARD, 5.338 * s);
    const camKeys = [
      { t: T0, p: [1.3, OY + 2.25, 7.6], l: [1.3, OY + 1.3, -0.5] },
      { t: tThats, p: [1.15, OY + 2.35, 6.9], l: [0.9, OY + 1.45, -0.6], e: "smooth" },
      { t: tAutomated + 0.4, p: [0.1, OY + 2.7, 7.0], l: [-0.6, OY + 2.2, -1.2] },
      { t: tSummaries + 0.4, p: [-0.4, OY + 2.8, 6.6], l: [-0.9, OY + 2.0, -1.2] },
      { t: tApproves - 0.15, p: [0.3, OY + 2.4, 5.2], l: [0.4, OY + 1.3, -0.3], e: "sine" },
      { t: tLunch - 0.2, p: [1.3, OY + 1.95, 3.0], l: [0.95, OY + 0.98, 0.0] },
      { t: tOddHover + 0.1, p: [1.75, OY + 1.8, 2.45], l: [1.0, OY + 0.95, 0.2] },
      { t: tThemE + 0.35, p: [1.7, OY + 1.72, 2.25], l: [1.0, OY + 0.93, 0.22], e: "smooth" },
      { t: tPhone - 0.45, p: [1.75, OY + 2.9, -0.9], l: [-6, 10.5, -24], e: "inOut", arc: 0.04 },
      { t: tPhone + 0.7, p: [-5.2, 11.6, -12.6], l: [-8.6, 9.6, -24], e: "out", arc: 0.04 },
      { t: tBank + 0.25, p: [-1.4, 12.0, -15.2], l: [-1.0, 10.6, -24] },
      { t: tTutor + 0.3, p: [5.6, 10.4, -15.6], l: [6.8, 8.8, -24] },
      { t: tMostly + 0.1, p: [5.2, 11.2, -14.0], l: [6.0, 8.6, -30] },
      { t: tByAI + 0.5, p: [4.0, 30, -6.0], l: [10.0, 4.0, -66], e: "sine", arc: 0.05 },
      { t: tKitchen + 0.75, p: [HERO.kitchen.x + 0.3, 6.55, -19.8], l: [HERO.kitchen.x, 6.0, rowZ], e: "inOut", arc: 0.05 },
      { t: tAgain - 0.2, p: [HERO.kitchen.x + 0.15, 6.35, -20.9], l: [HERO.kitchen.x + 0.05, 5.95, rowZ], e: "smooth" },
      { t: tBack + 0.1, p: [HERO.kitchen.x + 0.1, 6.33, -21.1], l: [HERO.kitchen.x + 0.05, 5.95, rowZ], e: "smooth" },
      { t: tJuly + 1.2, p: [-6.4, 8.2, -14.6], l: lanLook(1.6, -0.4, 0) },
      { t: tHacking + 0.2, p: lanLook(1.2, 0.9, 4.1), l: lanLook(0, -0.1, 0) },
      { t: tBroke + 0.1, p: lanLook(1.0, 1.1, 3.8), l: lanLook(0, 0.3, 0), e: "smooth" },
      { t: tServers + 0.4, p: camTip, l: (t) => tipW.clone(), e: "sine", arc: 0.05 },
      { t: tAnswer - 0.2, p: [TW.x + 3.5, drawerY + 2.4, towerFront + 11], l: [TW.x - 0.3, drawerY + 1.4, towerFront], e: "sine" },
      { t: tCheat + 0.1, p: [TW.x + 1.2, drawerY + 1.6, towerFront + 6.4], l: [TW.x, drawerY + 0.1, towerFront + 1.2] },
      { t: tKeep + 0.6, p: [TW.x + 1.0, drawerY + 1.45, towerFront + 6.0], l: [TW.x, drawerY + 0.05, towerFront + 1.2], e: "smooth" },
      { t: tSystems + 0.6, p: [MC.x - 1.6, MC.y + 5.0, MC.z + 7.0], l: [MC.x - 0.6, MC.y, MC.z], e: "inOut", arc: 0.05 },
      { t: tShortcuts + 0.3, p: [MC.x - 1.0, MC.y + 5.0, MC.z + 5.4], l: [MC.x, MC.y, MC.z - 0.1], e: "sine" },
      { t: tOptimizing + 0.5, p: [MC.x + 0.1, MC.y + 6.7, MC.z + 1.6], l: [MC.x, MC.y, MC.z], e: "sine" },
      { t: tFlip - 0.08, p: fill(MC.clone().add(V3(0, 0.15, 0)), 1), l: [MC.x, MC.y + 0.15, MC.z], e: "inOut", arc: 0 },
    ];
    // after the match cut: same framing relative to the flipbook page, then pull back to reveal the desk
    const deskKeys = [
      { t: tFlip - 0.08, p: (t) => fill(PAGEC, SCALE_MF), l: (t) => PAGEC.clone() },
      { t: tFlip + 0.25, p: (t) => fill(PAGEC, SCALE_MF * 1.15), l: (t) => PAGEC.clone(), e: "smooth" },
      { t: tFaster + 0.4, p: O(1.95, 1.95, 2.9).toArray(), l: O(1.75, 0.9, -0.15).toArray(), e: "inOut", arc: 0.03 },
      { t: tArrives, p: O(1.85, 1.7, 2.3).toArray(), l: O(1.75, 0.88, 0.05).toArray(), e: "smooth" },
      { t: tCardLand + 0.1, p: O(1.75, 1.75, 1.6).toArray(), l: O(1.62, DESK_Y, 0.42).toArray(), e: "sine" },
      { t: CUT, p: (t) => cardCam(t, CARD, QW).p, l: (t) => cardCam(t, CARD, QW).l, e: "inOut", arc: 0 },
    ];
    const camAt = (t) => { const c = t < tFlip - 0.08 ? path(camKeys, t) : path(deskKeys, t); drift(t, c.p, c.l); return c; };

    // place the opening page in front of the start camera so it overfills the frame (16:9 at ~105 %)
    { const c0 = camAt(T0); E.applyCam(camera, c0); const dir = c0.l.clone().sub(c0.p).normalize(); const d = PG.w / 1.1213 / 1.05;
      const ctr = c0.p.clone().addScaledVector(dir, d); pagePivot.quaternion.copy(camera.quaternion); pageQ.copy(camera.quaternion); const right = V3(1, 0, 0).applyQuaternion(camera.quaternion);
      pagePivot.position.copy(ctr).addScaledVector(right, -PG.w / 2); }

    // ---------------- DOM ----------------
    const stamp1 = E.stampDOM(E.layer, [{ t: tMarch, year: "MARCH 2028", label: "Scenario" }], tBack - 0.1);
    const stamp2 = E.stampDOM(E.layer, [{ t: tFlip + 0.1, year: "MARCH 2028", label: "Scenario" }]);
    const src = E.srcDOM(E.layer, { small: "OpenAI / Hugging Face, July 2026", inAt: tJuly + 0.25, outAt: tMindE + 0.6 });
    const counter = E.tagDOM(E.layer, { title: "0", sub: "approved", inAt: tApproves + 0.05, outAt: tThemE + 0.75 }); const cntSpan = counter.el.querySelector(".t span");
    const vtmp = new THREE.Vector3();

    // =====================================================================================
    // UPDATE
    // =====================================================================================
    const M4 = new THREE.Matrix4(), Q = new THREE.Quaternion(), Qflat = new THREE.Quaternion(), Qup = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)), SC1 = V3(1, 1, 1);
    let lastSheet = "";
    const update = (t) => {
      stg.update(t);
      const inOffice = t < tPhone + 0.2 || t >= tFlip - 0.08, inTower = t >= tBroke + 1.5 && t < tFlip - 0.08;
      if (inOffice) setKey(O(1.0, 1.0, 0.5), 9); else if (inTower) setKey(V3(31, 9, -76), 16); else setKey(V3(0, 8, -24), 28);

      // ---- opening page turn (away, around its left edge) and the room growing ----
      const turn = t < tPageTurn ? 0 : inOut(lin(tPageTurn, tPageTurn + 1.45, t));
      pagePivot.quaternion.copy(pageQ); pagePivot.rotateY(-0.05 * Math.sin(Math.PI * clamp((t - tPageTurn + 0.25) / 0.5, 0, 1)) * (t < tPageTurn + 0.25 ? 1 : 0) + turn * Math.PI * 0.62);
      pagePivot.visible = t < tPageTurn + 1.6;
      pageMesh.position.z = 0.004 * Math.sin(t * 2.3);
      const grow = spring(lin(tPageTurn + 0.45, tPageTurn + 2.0, t));
      backWall.position.z = lerp(-1.3, -2.55, grow); leftWall.position.set(lerp(-3.5, -6.6, grow), 3.8, 2.6); rightWall.position.set(lerp(6.6, 9.8, grow), 3.8, 2.6);
      ringA.userData.update(t, { think: 0.6 + smooth(tAutomated - 0.2, tAutomated + 0.3, t), glow: 0.3 + 0.45 * smooth(tAutomated - 0.3, tAutomated + 0.2, t) + 0.5 * Math.exp(-Math.pow((t - tWritten - 0.15) / 0.35, 2)) });
      ringB.userData.update(t + 0.4, { think: 0.6 + smooth(tAutomated - 0.1, tAutomated + 0.4, t), glow: 0.3 + 0.45 * smooth(tAutomated - 0.2, tAutomated + 0.3, t) + 0.5 * Math.exp(-Math.pow((t - tChecked - 0.15) / 0.35, 2)) });
      // lamp + screen breathing (hero light never still)
      const fl = 1 + 0.025 * Math.sin(t * 6.1) * Math.sin(t * 2.3);
      spot.intensity = 15 * fl; roomFill.intensity = (inOffice ? 3.2 : 0) * fl; monLight.intensity = inOffice ? 2.2 + 0.3 * Math.sin(t * 1.7) : 0;
      lampHalo.material.opacity = 0.55 * fl; screen.userData.setGlow(1.15 + 0.08 * Math.sin(t * 1.9));
      // stacks shrink as their sheets fold into summary cards
      stacks.forEach((s, i) => { s.scale.y = s.userData.h * (1 - 0.45 * smooth(tSummaries - 0.4, tApproves - 0.4, t)) + 0.01 * Math.sin(t * 0.8 + i); });

      // ---- flying summary cards ----
      let landed = 0;
      for (let i = 0; i < NF; i++) { const t0 = flyStart(i); const k = lin(t0, t0 + FLYDUR, t); if (t >= t0 + FLYDUR) landed++;
        if (k <= 0 || k >= 1) { M4.makeScale(0, 0, 0); flyers.setMatrixAt(i, M4); continue; }
        const e = sineInOut(k); const p = flyPath.getPointAt(e); const fold = smooth(0, 0.18, k); // a sheet folds down into a card as it leaves the stack
        Q.setFromEuler(new THREE.Euler(Math.PI / 2 * (1 - smooth(0.78, 1, k)) + 0.25 * Math.sin(k * 9 + i), 0.3 * Math.sin(k * 6 + i), 0.15 * Math.sin(k * 7 + i * 2)));
        const sc = V3(lerp(1.8, 1, fold), 1, lerp(2.2, 1, fold)); M4.compose(p, Q, sc); flyers.setMatrixAt(i, M4); }
      flyers.instanceMatrix.needsUpdate = true;
      const arrived = Math.min(NC + 1, Math.round(landed * (NC + 1) / NF));
      // ---- approval cards: queue (top-down) → active (tick) → done pile ----
      let ticked = 0; const pencilTarget = new THREE.Vector3(); let ticking = 0; let tickPhase = 0;
      for (let j = 0; j < NC; j++) { // j = processing order; card index in queue height = NC - j (top first)
        const h = NC - j; const tt = tk[j]; const inQ = V3(QUE.x + 0.008 * Math.sin(h * 2.1), QUE.y + h * 0.0062, QUE.z + 0.008 * Math.cos(h * 1.7));
        const inA = ACT.clone(); const inD = V3(DONE.x + 0.01 * Math.sin(j * 1.3), DONE.y + j * 0.0062, DONE.z + 0.01 * Math.cos(j * 2.3));
        let p, rz = 0.04 * Math.sin(h * 3.1), tickK = 0;
        if (t < tt - 0.2) { p = inQ; if (h + 1 > arrived) { M4.makeScale(0, 0, 0); cards.setMatrixAt(j, M4); ticks.setMatrixAt(j, M4); continue; } }
        else if (t < tt - 0.03) { const k = sineInOut(lin(tt - 0.2, tt - 0.03, t)); p = inQ.clone().lerp(inA, k); p.y += Math.sin(Math.PI * k) * 0.06; rz *= 1 - k; }
        else if (t < tt + 0.07) { p = inA; tickK = lin(tt - 0.03, tt + 0.05, t); rz = 0; ticking = 1; pencilTarget.copy(ACT).add(V3(0.02 + 0.06 * tickK, 0.008, 0.02 - 0.03 * Math.sin(tickK * Math.PI))); tickPhase = tickK; }
        else { const k = sineInOut(lin(tt + 0.07, tt + 0.32, t)); p = inA.clone().lerp(inD, k); p.y += Math.sin(Math.PI * k) * 0.08; tickK = 1; rz = lerp(0, 0.05 * Math.sin(j * 1.7), k); if (t >= tt + 0.07) ticked = Math.max(ticked, j + 1); }
        if (t >= tt) ticked = Math.max(ticked, j + 1);
        Q.setFromEuler(new THREE.Euler(0, rz, 0)); M4.compose(p, Q, SC1); cards.setMatrixAt(j, M4);
        if (tickK > 0) { const tp = p.clone().add(V3(0.06, 0.0045, 0.0).applyQuaternion(Q)); Qflat.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, rz)); M4.compose(tp, Qflat, V3(tickK, tickK, 1)); ticks.setMatrixAt(j, M4); }
        else { M4.makeScale(0, 0, 0); ticks.setMatrixAt(j, M4); } }
      cards.instanceMatrix.needsUpdate = true; ticks.instanceMatrix.needsUpdate = true;
      // the 40th card: lies at the bottom of the queue, comes in, the pencil stops above it, then the tick
      { let p; const qp = V3(QUE.x, QUE.y, QUE.z), dp = V3(DONE.x, DONE.y + NC * 0.0062, DONE.z);
        if (t < tOddIn) p = qp; else if (t < tOddIn + 0.3) { const k = sineInOut(lin(tOddIn, tOddIn + 0.3, t)); p = qp.clone().lerp(ACT, k); p.y += Math.sin(Math.PI * k) * 0.06; }
        else if (t < tOddTick + 0.55) p = ACT.clone(); else { const k = sineInOut(lin(tOddTick + 0.55, tOddTick + 0.85, t)); p = ACT.clone().lerp(dp, k); p.y += Math.sin(Math.PI * k) * 0.08; }
        odd.position.copy(p).add(V3(0, 0.003, 0)); odd.visible = arrived > 0 || t > tOddIn;
        const tkk = clamp((t - tOddTick) / 0.16, 0, 1), q = Math.round(tkk * 12) / 12; if (q !== oddTick) { odd.userData.redraw({ tick: q }); oddTick = q; }
        oddHalo.position.copy(p).add(V3(-0.09, 0.012, 0.07)); oddHalo.material.opacity = 0.4 * smooth(tOddIn + 0.2, tOddHover, t) * (1 - smooth(tOddTick, tOddTick + 0.4, t)) * (0.85 + 0.15 * Math.sin(t * 5));
        if (t >= tOddIn + 0.2 && t < tOddTick + 0.2) { const hov = smooth(tOddIn + 0.25, tOddHover, t); const tr = 0.004 * Math.sin(t * 23) * hov;
          const k = clamp((t - tOddTick) / 0.16, 0, 1); pencilTarget.copy(ACT).add(V3(0.02 + 0.06 * k + tr, 0.008 + 0.07 * hov * (1 - smooth(tOddTick - 0.12, tOddTick, t)), 0.02 - 0.03 * Math.sin(k * Math.PI))); ticking = 1; tickPhase = k; } }
      cntSpan.textContent = String(Math.min(40, ticked + (t >= tOddTick + 0.1 ? 1 : 0)));
      // Lena: pose follows the work; leans in and lowers her head over the 40th card
      const work = smooth(tApproves - 0.4, tApproves, t) * (1 - smooth(tThemE + 0.5, tThemE + 1.2, t));
      const hes = smooth(tOddIn + 0.2, tOddHover + 0.3, t) * (1 - smooth(tOddTick + 0.1, tOddTick + 0.6, t));
      const atBook = smooth(tTurning, tFaster + 0.5, t), atCard = smooth(tCardOut, tCardLand, t);
      const lookRings = smooth(tAutomated - 0.6, tAutomated + 0.4, t) * (1 - smooth(tLena - 0.3, tLena + 0.6, t));
      lena.userData.pose(t, { reach: lerp(0.25, TICKPOSE.reach, work) + 0.03 * ticking * Math.sin(tickPhase * Math.PI) + 0.12 * atBook * (1 - atCard), lean: lerp(0.1, TICKPOSE.lean, work) + 0.25 * hes + 0.3 * atBook,
        lookUp: 0.35 * lookRings - 0.18 * work - 0.22 * hes - 0.15 * atBook + 0.1 * atCard });
      // pencil in her hand, pointed at the tick (or resting toward the desk)
      { lena.updateMatrixWorld(true); lena.userData.hand.getWorldPosition(vtmp); const hand = off.worldToLocal(vtmp.clone());
        const tgt = ticking ? pencilTarget : hand.clone().add(V3(0.2, -0.2, 0.12)); pencil.position.copy(hand); const dir = tgt.clone().sub(hand).normalize();
        pencil.quaternion.setFromUnitVectors(V3(0, -1, 0), dir); }

      // ---- the city: windows breathe; on "mostly designed by AI" the cyan tint spreads through the windows (the WOW) ----
      const spreadK = smooth(tMostly - 0.3, tByAI + 0.6, t);
      for (let i = 0; i < NW; i++) { const [x, y, z, ri] = winPos[i]; const rr = winCol[i]; const on = rr > 0.12; const k = (on ? 0.22 + 0.42 * rr : 0.035) * (1 + 0.06 * Math.sin(t * (0.7 + rr) + i));
        const dd = Math.hypot(x - cyanCenter.x, (z - cyanCenter.z) * 0.8); const reach = clamp(spreadK * 75 - dd, 0, 6) / 6; const cyan = rr > 0.25 ? reach * (0.7 + 0.3 * rr) : reach * 0.3;
        _c.copy(WARM).lerp(COOL, cyan).multiplyScalar(on ? k * (1 + 0.5 * cyan) : k); wins.setColorAt(i, _c); }
      wins.instanceColor.needsUpdate = true;
      rowMeshes.forEach((m, i) => (m.position.x = 0.12 * Math.sin(t * (0.17 + i * 0.03) + i)));
      // hero devices switch on (anticipation flicker → glow), the kitchen phone pops on "again"
      const sw = (t0) => { if (t < t0 - 0.12) return 0; if (t < t0) return 0.25 * (Math.sin((t - t0) * 90) > 0 ? 1 : 0.2); return 0.4 + 0.6 * expoOut(lin(t0, t0 + 0.5, t)); };
      [[dPhone, tPhone], [dBank, tBank], [dChild, tTutor + 0.25]].forEach(([d, t0], i) => { const k = sw(t0) * (0.92 + 0.08 * Math.sin(t * 2.3 + i)); d.d.material.color.copy(COOL).multiplyScalar(0.12 + 1.6 * k); d.hl.material.opacity = 0.45 * k; d.hl.scale.setScalar(1 + 0.05 * Math.sin(t * 1.4 + i)); });
      const pop = t < tAgain ? 0 : Math.exp(-(t - tAgain) * 2.6) * Math.sin(Math.min(Math.PI / 2, (t - tAgain) * 14));
      const kOn = 0.55 + 0.45 * smooth(tYou - 0.5, tKitchen, t), kNow = kOn + 0.55 * smooth(tAgain, tAgain + 0.3, t);
      dYou.d.material.color.copy(COOL).multiplyScalar(0.3 + 1.5 * kNow + 1.5 * pop); dYou.hl.material.opacity = 0.35 * kNow + 0.5 * pop; dYou.hl.scale.setScalar(1 + 0.35 * pop + 0.04 * Math.sin(t * 1.6));
      fYou.userData.pose(t, { reach: 0.62, lean: 0.25, lookUp: -0.25 + 0.1 * pop }); fYou.updateMatrixWorld(true); fYou.userData.hand.getWorldPosition(vtmp); rKit.worldToLocal(vtmp); dYou.d.position.set(vtmp.x + 0.03, vtmp.y + 0.07, -0.5); dYou.hl.position.set(vtmp.x + 0.03, vtmp.y + 0.07, -0.45);
      rKit.localToWorld(vtmp.set(dYou.d.position.x, dYou.d.position.y, 0.3)); youLight.position.copy(vtmp); youLight.intensity = (2 + 4 * pop) * kNow * (t > tAssistant ? 1 : 0);
      kitLight.intensity = t > tAssistant && t < tFlip ? 9 * (1 + 0.03 * Math.sin(t * 5.3)) : 0; kHalo.material.opacity = 0.6 * (1 + 0.03 * Math.sin(t * 5.3));
      fPhone.userData.pose(t, { reach: 0.9, armUp: 0.35, lookUp: 0.15 }); fPhone.updateMatrixWorld(true); fPhone.userData.hand.getWorldPosition(vtmp); rPhone.worldToLocal(vtmp); dPhone.d.position.set(vtmp.x, vtmp.y + 0.08, -0.5); dPhone.hl.position.set(vtmp.x, vtmp.y + 0.08, -0.45);
      fBank.userData.pose(t, { reach: 0.7, armUp: 0.12 }); fBank.updateMatrixWorld(true); fBank.userData.hand.getWorldPosition(vtmp); rBank.worldToLocal(vtmp); dBank.d.position.set(vtmp.x + 0.08, vtmp.y + 0.04, -0.5); dBank.hl.position.set(vtmp.x + 0.08, vtmp.y + 0.04, -0.45);
      fChild.userData.pose(t, { reach: 0.5, lean: 0.4, lookUp: -0.2 });

      // ---- the lantern ----
      const lanOn = t > tBack - 0.6 && t < tFlip; lantern.visible = lanOn;
      if (lanOn) { const lp = lanPos(t); lantern.position.copy(lp); lantern.rotation.set(0.05 * Math.sin(t * 0.9), 0.35 + t * 0.12, 0.04 * Math.sin(t * 1.1 + 1));
        const crack = smooth(tBroke - 0.4, tBroke + 0.2, t); lid.rotation.z = 0.06 * crack + 0.01 * Math.sin(t * 3);
        lanMats[0].emissiveIntensity = 0.28 + 0.06 * Math.sin(t * 2.2); lanHalo.lookAt(camera.position); lanHalo.material.opacity = 0.32 + 0.05 * Math.sin(t * 2.2); lanLight.intensity = 5; }
      else lanLight.intensity = 0;

      // ---- the thread: out of the seam, over the city, searching the tower, into the drawer; cut on "Keep"; falls into the maze ----
      const thrOn = t >= tBroke && t < tFlip - 0.08;
      thread.visible = thrOn; tip.visible = thrOn;
      let fallK = 0;
      if (thrOn) { lantern.updateMatrixWorld(true); const seam = V3(LB * 0.25, LB / 2 + 0.03, 0).applyMatrix4(lantern.matrixWorld);
        let curve = threadCurve(seam); const k = tTip(t);
        const shut = expoOut(lin(tKeep, tKeep + 0.1, t)); fallK = smooth(tFall0, tFall1, t);
        if (t >= tKeep) { // severed at the drawer face: the rest goes slack and its end falls to the maze entrance
          const pts = curve.points.slice(0, curve.points.length - 2); const prevP = pts[pts.length - 1]; const fe = sineInOut(fallK);
          const end = DRW.clone().lerp(ENTW, fe); end.y += Math.sin(Math.PI * fe) * 0.8; const sag = prevP.clone().lerp(end, 0.5).add(V3(-0.6 * fe, -1.8 * fe - 0.15, 0.8 * fe));
          pts.push(sag, end); curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.4); }
        const geo = new THREE.TubeGeometry(curve, 260, 0.045, 6, false); thread.geometry.dispose(); thread.geometry = geo;
        const kk = t >= tKeep ? 1 : k; geo.setDrawRange(0, Math.max(0, Math.floor(260 * kk)) * 36);
        curve.getPointAt(Math.max(0.0001, kk), tipW); curve.getPointAt(Math.max(0.0001, Math.max(0, (t >= tKeep ? 1 : tTip(t - 0.45)))), tipLag);
        tip.position.copy(tipW); tip.lookAt(camera.position); tip.material.opacity = (t < tKeep ? 0.9 : 0.5 * fallK + 0.2) * (1 - smooth(tFall1, tFall1 + 0.4, t));
        threadMat.color.copy(COOL).multiplyScalar(1.8 * (t >= tKeep ? lerp(0.55, 1, fallK) : 1) * (1 - 0.6 * smooth(tFlip - 0.8, tFlip - 0.2, t))); }
      // tower floors light as the thread searches them ("servers")
      for (let i = 0; i < 14; i++) { const fy = 1.0 + i * tower.userData.fh + tower.userData.fh * 0.3; const ft = tServers + (14 - i) * 0.09 - 0.6; const k = smooth(ft, ft + 0.35, t) * (1 - 0.5 * smooth(tKeep, tKeep + 0.6, t));
        tower.userData.setFloor(i, (0.03 + 0.22 * k) * (0.85 + 0.15 * Math.sin(t * 1.3 + i * 2.1)) + (Math.abs(fy - drawerY) < 2 ? 0.0 : 0), k > 0.05 ? C.cyan : "#ffc47a"); }
      // the drawer: opens as the thread arrives ("answer key"), glows; slams shut on "Keep" (anticipation: a small extra pull first)
      const opn = spring(lin(tAnswer - 0.35, tAnswer + 0.45, t)); const ant = t < tKeep ? 0.08 * smooth(tKeep - 0.25, tKeep - 0.05, t) : 0; const shutK = t < tKeep ? 0 : expoOut(lin(tKeep, tKeep + 0.1, t));
      drawer.position.z = (0.78 * opn + ant) * (1 - shutK) + (t >= tKeep ? -0.03 * Math.exp(-(t - tKeep) * 9) * Math.sin((t - tKeep) * 40) : 0);
      const dg = opn * (1 - shutK); drawerGlow.userData.setGlow(1.4 * dg * (0.9 + 0.1 * Math.sin(t * 7))); drawerHalo.material.opacity = 0.55 * dg; drawerLight.intensity = 9 * dg;

      // ---- the maze: line follows the path, then cuts straight through a wall on "shortcuts"; the intended path draws in amber ----
      const lineK = t < tFall1 ? 0 : t < tShortcuts ? kBeforeCut * sineInOut(lin(tFall1, tShortcuts - 0.04, t)) : lerp(kBeforeCut, 1, expoOut(lin(tShortcuts - 0.04, tShortcuts + 0.16, t)));
      mazeLine.geometry.setDrawRange(0, Math.floor(MSEG * lineK) * 36); mazeLine.visible = t < tFlip - 0.08 && lineK > 0;
      const cutK = t < tShortcuts ? 0 : 1 - Math.exp(-(t - tShortcuts) * 9) * Math.cos((t - tShortcuts) * 16);
      const foldK = inOut(lin(tOptimizing + 0.55, tFlip - 0.35, t));
      setWalls(foldK, Math.max(clamp(cutK, 0, 1.05) * 0.86, foldK)); wallIM.visible = t > tKeep - 2 && t < tFlip;
      const gK = smooth(tShortcuts + 0.1, tShortcuts + 0.4, t); goal.material[0].emissiveIntensity = 1.6 * gK * (0.85 + 0.15 * Math.sin(t * 4));
      const lastP = mazePath.getPointAt(Math.max(0.0001, lineK)); spark.position.copy(lastP).add(V3(0, 0.03, 0)); spark.material.opacity = t > tFall1 && t < tFlip - 0.08 ? (0.5 + 1.2 * Math.exp(-Math.pow((t - tShortcuts - 0.08) / 0.25, 2))) * (0.9 + 0.1 * Math.sin(t * 8)) : 0;
      spark.scale.setScalar(1 + 1.2 * Math.exp(-Math.pow((t - tShortcuts - 0.1) / 0.3, 2)));
      mazeLight.position.copy(lastP).add(V3(0, 0.8, 0)); mazeLight.intensity = t > tFall1 && t < tFlip - 0.08 ? 3 + 6 * Math.exp(-Math.pow((t - tShortcuts - 0.1) / 0.35, 2)) + 1.5 * Math.exp(-Math.pow((t - tOptimizing - 0.3) / 0.4, 2)) : 0;
      lineMat.color.copy(COOL).multiplyScalar(1.6 + 0.8 * Math.exp(-Math.pow((t - tOptimizing - 0.3) / 0.4, 2)));
      const amberK = smooth(tNobody - 0.1, tNobody + 1.6, t); const aq = Math.round(amberK * 16) / 16; const st = `${aq}|${t >= tShortcuts ? 1 : 0}`;
      if (st !== sheetState) { sheet.userData.redraw({ amber: aq, cut: false }); sheetState = st; }
      sheet.visible = t > tKeep - 2 && t < tFlip; goal.visible = sheet.visible;

      // ---- flipbook + question card ----
      const bookOn = t >= tFlip - 0.08; book.visible = bookOn;
      if (bookOn) book.userData.update(t, { flip: flipAt(t), spread: spreadAt(t) });
      // the card slides out from between the pages, arcs and lands in front of Lena on "question"
      qcard.visible = t >= tCardOut;
      if (t >= tCardOut) { const k = lin(tCardOut, tCardLand, t); const e = sineInOut(k); const p = cardStart.clone().lerp(CARD, e); p.y += Math.sin(Math.PI * Math.pow(k, 0.8)) * 0.42 + (k < 0.12 ? -0.012 : 0);
        const settle = t > tCardLand ? Math.exp(-(t - tCardLand) * 7) * Math.sin((t - tCardLand) * 22) * 0.006 : 0; p.y += Math.max(0, settle);
        qcard.position.copy(p); qcard.rotation.set(0.5 * Math.sin(Math.PI * k) * (1 - k) + 0.12 * Math.sin(k * 11) * (1 - k), 0.35 * (1 - e), 0.25 * Math.sin(Math.PI * k) * Math.cos(k * 7)); }

      // ---- camera ----
      const c = camAt(t); E.applyCam(camera, c);
      // tags
      off.localToWorld(vtmp.copy(DONE).add(V3(-0.15, 0.25, 0))); const sp = E.project(vtmp, camera); counter.place(sp.x - 40, sp.y - 60);
      stamp1.update(t); stamp2.update(t); src.update(t); counter.update(t);
      post.bloom = 0.45 + 0.25 * smooth(tMostly, tByAI, t) * (1 - smooth(tYou, tKitchen, t)) + 0.15 * (lanOn ? 1 : 0);
    };
    const post = { bloom: 0.45, exposure: 1.15 };
    return { scene, camera, post, update };
  },
};
