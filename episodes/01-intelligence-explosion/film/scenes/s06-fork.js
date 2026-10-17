// s06 · The fork. Script section 4, "The system Lena oversees proposes a plan" → "What would you do?" + ~3.2 s of silence.
// Carrier in:  the question card from s05, lying on Lena's desk, centred at ~60 % frame width (same `cardCam` code as s05, 10x scale here:
//              we are now the size of a paper figure on her desk). It unfolds into a pop-up: two doors, cyan + open vs amber + closed, tiny Lena between.
// Carrier out: the camera pushes into the open CYAN door until cyan light floods the frame (FILL #bff4ff, completes in the last ~0.4 s).
// Beats: the machine rings above the cyan door grow a larger successor ring · "3 weeks" / "6 months" · case for yes: two rival towers rise out of
// the printed horizon and light up, closer than we thought; through the cyan door a dawn ward, solar fields, paper stars · case for no: behind the
// amber door a maze, the line cuts a wall, the maze folds into a flipbook and the cut glows again on every page · Kaplan: a paper "2030" rises
// over both doors · "Pause here": WOW by stillness — the camera slowly circles Lena and the breathing doors; then into the cyan light.
export default {
  build(E, def) {
    const { THREE, C, PAL, lin, smooth, clamp, lerp, expoOut, inOut, spring, sineInOut } = E;
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const F = (p, n = 1) => E.at("fork", p, n), FE = (p, n = 1) => E.end("fork", p, n);
    const T0 = def.from, T1 = def.to, CUT = T0;
    const pal = PAL.night;
    const scene = new THREE.Scene(); const camera = E.newCamera();

    // ---------------- word anchors ----------------
    const tSystem = F("The system"), tProposes = F("proposes"), tPlan = FE("a plan"), tLet = F("Let it design"), tSuccessor = F("successor"), tE2E = F("end-to-end");
    const tThree = F("Three"), tSix = F("six"), tCaseYes = F("The case for yes"), tRival = F("rival"), tLabs = F("labs"), tBehind = F("behind"), tStop = F("stop"), tWont = F("won't");
    const tEvery = F("every month"), tCures = F("cures"), tEnergy = F("energy"), tDisc = F("discoveries"), tSooner = FE("sooner");
    const tCaseNo = F("The case for no"), tNobody = F("nobody"), tLine = F("line by line"), tShortcut = F("shortcut"), tInherited = F("inherited"), tAfter = FE("after it");
    const tAnth = F("And Anthropic's"), tJared = F("Jared"), tTT = F("twenty-thirty"), tImprove = F("improve"), tItself = FE("itself");
    const tPause = F("Pause here"), tWhat = F("What would you do"), tDo = FE("What would you do");

    // ---------------- stage + lights (same rig/direction as the s05 office, scaled 10x) ----------------
    scene.background = new THREE.Color(pal.clear); scene.fog = new THREE.Fog(pal.fog, 90, 220);
    const rig = E.lights(scene, pal, { key: [-26, 30, 34], target: [0, 0, 0], intensity: 2.2, hemi: 0.75, box: 9 });
    { const sc = rig.key.shadow.camera; Object.assign(sc, { left: -9, right: 9, top: 9, bottom: -9 }); sc.updateProjectionMatrix(); }
    const SC = 39.81; // 10^1.6: light intensity scale for 10x distances with decay 1.6
    const spot = new THREE.SpotLight(C.amber, 26 * SC, 100, 0.95, 0.75, 1.6); spot.position.set(13.6, 5.2, 0.7); spot.target.position.set(-1, 0, -2.5);
    spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.radius = 4; spot.shadow.bias = -0.0015; spot.shadow.camera.near = 1; spot.shadow.camera.far = 120; scene.add(spot, spot.target);
    const roomFill = E.pointLight("#ffb978", 3.2 * SC, 140); roomFill.position.set(2, 25.6, 19.5); scene.add(roomFill);
    const monLight = E.pointLight(C.cyan, 2.2 * SC, 50); monLight.position.set(12, 6, -6.5); scene.add(monLight);
    const ink = new THREE.MeshBasicMaterial({ color: C.ink });
    const flat = (shape, mat = ink) => new THREE.Mesh(new THREE.ShapeGeometry(shape, 12), mat);
    const halo = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d");
      const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.35, "rgba(255,255,255,0.35)"); gr.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
    const haloPlane = (w, hex, h = w) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: halo, color: new THREE.Color(hex), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 })); m.renderOrder = 5; return m; };
    const canvasTex = (pw, ph, draw) => { const c = document.createElement("canvas"); c.width = pw; c.height = ph; const g = c.getContext("2d"); draw(g, pw, ph); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };

    // ---------------- Lena's desk at 10x (continuity with the s05 end frame) ----------------
    const DESK_HEX = "#34466e";
    { const top = E.box(34, 0.7, 17.5, DESK_HEX); top.position.set(3.5, -0.35, -4); scene.add(top);
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(400, 300), E.paperMat("#1c2844")); fl.rotation.x = -Math.PI / 2; fl.position.y = -8.4; fl.receiveShadow = true; scene.add(fl);
      // the far office wall with its big window (s05 back wall, 10x): night sky + city lights, cyan-tinted since "mostly designed by AI"
      const ws = E.rectShape(260, 90, 0, 30); const h = new THREE.Path(); h.moveTo(-26, 3.6); h.lineTo(30, 3.6); h.lineTo(30, 41.6); h.lineTo(-26, 41.6); h.lineTo(-26, 3.6); ws.holes.push(h);
      const wall = E.extrude(ws, "#24345a", 1.0, { segments: 2 }); wall.position.z = -32; wall.receiveShadow = false; wall.castShadow = false; scene.add(wall);
      [-7.3, 11.3].forEach((x) => { const b = E.box(0.9, 38, 1.2, "#1a2848"); b.position.set(x, 22.6, -30.9); b.castShadow = false; scene.add(b); });
      const sky = new THREE.Mesh(new THREE.PlaneGeometry(320, 140), new THREE.MeshBasicMaterial({ fog: false, map: canvasTex(8, 256, (g, w, hh) => { const gr = g.createLinearGradient(0, 0, 0, hh); gr.addColorStop(0, "#070b16"); gr.addColorStop(0.6, "#16223c"); gr.addColorStop(1, "#33476f"); g.fillStyle = gr; g.fillRect(0, 0, w, hh); }) }));
      sky.position.set(0, 30, -140); scene.add(sky);
      const r = E.rng(77); const sk = new THREE.Shape(); sk.moveTo(-160, -20); let x = -160; while (x < 160) { const w = 6 + r() * 10, hh = 6 + r() * 22; sk.lineTo(x, hh); sk.lineTo(x + w, hh); x += w; } sk.lineTo(160, -20);
      const city = new THREE.Mesh(new THREE.ShapeGeometry(sk, 2), new THREE.MeshBasicMaterial({ color: "#121c33" })); city.position.set(0, -2, -110); scene.add(city);
      const N = 260; const lights = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.0, 1.4), new THREE.MeshBasicMaterial({ color: 0xffffff }), N); const d = new THREE.Object3D();
      lights.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3); const cc = new THREE.Color();
      for (let i = 0; i < N; i++) { d.position.set(-150 + r() * 300, -1 + r() * 20, -109.5); d.updateMatrix(); lights.setMatrixAt(i, d.matrix); cc.set(r() < 0.55 ? "#8fe6ff" : "#ffc47a").multiplyScalar(0.25 + r() * 0.4); lights.setColorAt(i, cc); } scene.add(lights);
      const stars = new THREE.InstancedMesh(new THREE.CircleGeometry(0.5, 8), new THREE.MeshBasicMaterial({ color: "#d9d2bd", fog: false }), 90);
      for (let i = 0; i < 90; i++) { d.position.set(-150 + r() * 300, 25 + r() * 70, -139); d.scale.setScalar(0.5 + r()); d.updateMatrix(); stars.setMatrixAt(i, d.matrix); } scene.add(stars);
      // giant desk things (s05 at 10x): the flipbook, the approved pile, the monitor glow, the lamp
      const mon = new THREE.Group(); mon.position.set(16, 0, -9.7); mon.rotation.y = -0.42; scene.add(mon);
      const fr = E.box(10.2, 6.6, 0.5, "#141d33"); fr.position.y = 5.8; mon.add(fr); const scr = new THREE.Mesh(new THREE.PlaneGeometry(9.4, 5.8), new THREE.MeshBasicMaterial({ color: new THREE.Color("#2a8fb0").multiplyScalar(0.4) })); scr.position.set(0, 5.8, 0.3); mon.add(scr);
      const lampG = new THREE.Group(); lampG.position.set(18, 0, 0.7); scene.add(lampG);
      const a1 = E.box(0.35, 6.2, 0.35, "#1a2238"); a1.position.set(-0.6, 3, 0); a1.rotation.z = 0.22; lampG.add(a1); const a2 = E.box(0.35, 4.2, 0.35, "#1a2238"); a2.position.set(-2.4, 6.2, 0); a2.rotation.z = 1.1; lampG.add(a2);
      const lh = haloPlane(14, C.amber); lh.position.set(-4.6, 5.0, 1); lh.material.opacity = 0.25; lampG.add(lh); }

    // ---------------- the card (closed: cover with the cut "?") ----------------
    const QW = 8, QD = 5;
    const basePrint = canvasTex(1024, 640, (g, w, h) => { g.fillStyle = "#1b2744"; g.fillRect(0, 0, w, h);
      const P = (x, z) => [(x + QW / 2) / QW * w, (z + QD / 2) / QD * h];
      const path = (x1, col) => { g.strokeStyle = col; g.lineWidth = 34; g.lineCap = "round"; g.beginPath(); g.moveTo(...P(0, 2.2)); g.bezierCurveTo(...P(0, 0.9), ...P(x1, 0.8), ...P(x1, -0.5)); g.stroke(); };
      path(-1.9, "rgba(111,227,255,0.16)"); path(1.9, "rgba(255,179,92,0.16)");
      g.strokeStyle = "rgba(239,230,210,0.05)"; g.lineWidth = 2; for (let i = 0; i < 16; i++) { g.beginPath(); g.moveTo(0, i * h / 16); g.lineTo(w, i * h / 16); g.stroke(); } });
    const base = new THREE.Mesh(new THREE.BoxGeometry(QW, 0.06, QD), [0, 1, 2, 3, 4, 5].map((i) => i === 2 ? new THREE.MeshStandardMaterial({ map: basePrint, roughness: 0.92 }) : E.paperMat(C.cream)));
    base.position.y = 0.03; base.castShadow = true; base.receiveShadow = true; scene.add(base);
    const coverPivot = new THREE.Group(); coverPivot.position.set(0, 0.095, -QD / 2 + 0.02); scene.add(coverPivot);
    const cover = E.box(QW - 0.04, 0.06, QD - 0.04, "#f1e9d6"); cover.position.set(0, 0, QD / 2 - 0.02); coverPivot.add(cover);
    const qMark = E.cutoutText("?", { height: 4, hex: "#1d2a48" }); qMark.rotation.x = -Math.PI / 2; qMark.position.set(0, 0.04, QD / 2 - 0.02); coverPivot.add(qMark);
    // inside of the cover = the back panel of the pop-up: night sky, far horizon with two small lit towers (the rival labs, printed)
    const TX = [-3.45, 3.45];
    const skyPrint = canvasTex(1024, 640, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#0a1020"); gr.addColorStop(0.6, "#1a2848"); gr.addColorStop(1, "#3a5078"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      const r = E.rng(5); g.fillStyle = "#e9dfc6"; for (let i = 0; i < 70; i++) { g.globalAlpha = 0.4 + r() * 0.6; g.beginPath(); g.arc(r() * w, r() * h * 0.6, 1 + r() * 2.2, 0, Math.PI * 2); g.fill(); } g.globalAlpha = 1;
      g.fillStyle = "#e9dfc6"; g.beginPath(); g.arc(w * 0.82, h * 0.18, 26, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#22324f"; g.beginPath(); g.moveTo(0, h); let x = 0; while (x < w) { const bw = 20 + r() * 40, bh = 40 + r() * 70; g.lineTo(x, h - bh); g.lineTo(x + bw, h - bh); x += bw; } g.lineTo(w, h); g.fill();
      TX.forEach((tx) => { const cx = (tx + QW / 2) / QW * w; g.fillStyle = "#2c3f63"; g.fillRect(cx - 14, h - 200, 28, 200); g.beginPath(); g.moveTo(cx - 14, h - 200); g.lineTo(cx, h - 236); g.lineTo(cx + 14, h - 200); g.fill();
        g.fillStyle = "rgba(143,230,255,0.55)"; for (let k = 0; k < 7; k++) g.fillRect(cx - 9, h - 190 + k * 26, 18, 6); }); });
    const inner = new THREE.Mesh(new THREE.PlaneGeometry(QW - 0.1, QD - 0.1), new THREE.MeshStandardMaterial({ map: skyPrint, roughness: 0.95, emissive: new THREE.Color("#ffffff"), emissiveMap: skyPrint, emissiveIntensity: 0.35 }));
    inner.rotation.x = Math.PI / 2; inner.position.set(0, -0.032, QD / 2 - 0.02); inner.receiveShadow = true; coverPivot.add(inner);
    const CARD0 = V3(0, 0, 0);

    // ---------------- pop-up pieces (stand up from the base as the card opens) ----------------
    const pops = [];
    const pop = (g, x, z, delay, i) => { const hinge = new THREE.Group(); hinge.position.set(x, 0.06, z); hinge.add(g); scene.add(hinge); pops.push({ hinge, delay, i }); return hinge; };
    const DOOR = { w: 1.1, h: 2.1 }, WALL = { w: 2.6, h: 3.2 }, WZ = -0.62, DX = 1.9;
    const wallShape = () => { const s = E.rectShape(WALL.w, WALL.h, 0, WALL.h / 2); const h = new THREE.Path(); const x0 = -DOOR.w / 2, x1 = DOOR.w / 2, y0 = 0.07, y1 = DOOR.h; h.moveTo(x0, y0); h.lineTo(x1, y0); h.lineTo(x1, y1); h.lineTo(x0, y1); h.lineTo(x0, y0); s.holes.push(h); return s; };
    const trim = (g, hex, k) => { const m = [[0.07, DOOR.h + 0.07, -DOOR.w / 2 - 0.035, DOOR.h / 2], [0.07, DOOR.h + 0.07, DOOR.w / 2 + 0.035, DOOR.h / 2], [DOOR.w + 0.14, 0.07, 0, DOOR.h + 0.035]].map(([w, h, x, y]) => {
      const b = E.box(w, h, 0.14, hex, { emissive: k }); b.position.set(x, y, 0.08); g.add(b); return b; }); return m; };
    // cyan wall + open door
    const cyanWall = new THREE.Group(); cyanWall.add(E.extrude(wallShape(), "#22324f", 0.12)); const cyTrim = trim(cyanWall, C.cyanPale, 0.6);
    const cyDoor = new THREE.Group(); cyDoor.position.set(-DOOR.w / 2, 0.07, 0.1); cyanWall.add(cyDoor);
    { const lf = E.box(DOOR.w - 0.04, DOOR.h - 0.05, 0.05, "#bfe9f5", { emissive: 0.15 }); lf.position.set(DOOR.w / 2, DOOR.h / 2 - 0.02, 0); cyDoor.add(lf); const kn = E.box(0.06, 0.06, 0.08, "#0a6f8c"); kn.position.set(DOOR.w - 0.15, DOOR.h * 0.48, 0.05); cyDoor.add(kn); }
    const cyHaze = new THREE.Mesh(new THREE.PlaneGeometry(DOOR.w, DOOR.h - 0.07), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan), transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, depthWrite: false }));
    cyHaze.position.set(0, 0.07 + (DOOR.h - 0.07) / 2, 0.02); cyanWall.add(cyHaze);
    const cyGlow = haloPlane(3.2, C.cyan); cyGlow.position.set(0, 1.1, 0.25); cyanWall.add(cyGlow);
    // the machine above the cyan door: rings, and the larger successor ring that grows out of it
    const rings = E.machineRings({ n: 4, r: 0.42 }); rings.position.set(0, WALL.h + 0.62, 0.0); cyanWall.add(rings);
    const succ = E.machineRings({ n: 5, r: 0.78, w: 0.09 }); succ.position.set(0, WALL.h + 0.62, -0.25); cyanWall.add(succ);
    const ringStem = E.box(0.05, 0.4, 0.05, "#22324f"); ringStem.position.set(0, WALL.h + 0.15, 0); cyanWall.add(ringStem);
    pop(cyanWall, -DX, WZ, 0.5, 1);
    // amber wall + closed door, warm light leaking around it
    const amberWall = new THREE.Group(); amberWall.add(E.extrude(wallShape(), "#22324f", 0.12)); trim(amberWall, "#ffd9a8", 0.25);
    { const lf = E.box(DOOR.w - 0.06, DOOR.h - 0.08, 0.06, "#8a4a22"); lf.position.set(0, 0.07 + (DOOR.h - 0.08) / 2, 0.07); amberWall.add(lf); const kn = E.box(0.07, 0.07, 0.08, "#ffb35c", { emissive: 0.6 }); kn.position.set(-DOOR.w / 2 + 0.17, DOOR.h * 0.48, 0.12); amberWall.add(kn);
      for (let i = 0; i < 4; i++) { const pnl = E.box(0.36, 0.7, 0.02, "#7a3b17"); pnl.position.set(i % 2 ? 0.2 : -0.2, 0.55 + Math.floor(i / 2) * 0.9, 0.105); amberWall.add(pnl); } }
    const leak = new THREE.Mesh(new THREE.PlaneGeometry(DOOR.w + 0.06, DOOR.h + 0.02), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.amber).multiplyScalar(2.2) })); leak.position.set(0, 0.07 + DOOR.h / 2, 0.035); amberWall.add(leak);
    const amGlow = haloPlane(2.6, C.amber); amGlow.position.set(0, 0.6, 0.3); amberWall.add(amGlow);
    pop(amberWall, DX, WZ, 0.56, 2);
    // Lena, tiny, between them
    const lena = E.figure({ pose: "stand", hair: "bun", coat: true, scale: 0.55, seed: 3 }); const lenaG = new THREE.Group(); lenaG.add(lena); lena.position.set(-0.2, 0, 0);
    const lenaShadowCatch = 0; pop(lenaG, 0, 0.75, 0.64, 3);
    // the rival labs: two towers rising out of the printed horizon
    const towers = TX.map((x, i) => { const tw = E.tower({ w: 4.6, h: 18, floors: 8, hex: "#2c3f63", roof: "spire" }); tw.scale.setScalar(0.22); const g = new THREE.Group(); g.add(tw); g.position.set(x, 0.06, -2.3); scene.add(g); return g; });
    const towerHalo = TX.map((x) => { const h = haloPlane(3, C.cyan); h.position.set(x, 2.6, -2.15); scene.add(h); return h; });

    // ---------------- behind the cyan door: a dawn box (ward, solar fields, paper stars) ----------------
    const dawn = new THREE.Group(); dawn.position.set(-DX, 0.06, 0); scene.add(dawn);
    const BX = 2.0, BZ0 = WZ - 0.02, BZ1 = -2.38, BH = 3.0; const dz = BZ0 - BZ1;
    { const side = (x) => { const b = E.box(0.04, BH, dz, "#e7c2b4"); b.position.set(x, BH / 2, (BZ0 + BZ1) / 2); dawn.add(b); }; side(-BX / 2); side(BX / 2);
      const top = E.box(BX, 0.04, dz, "#e7c2b4"); top.position.set(0, BH, (BZ0 + BZ1) / 2); dawn.add(top);
      const fl = E.box(BX, 0.02, dz, "#7a4f70"); fl.position.set(0, 0.01, (BZ0 + BZ1) / 2); dawn.add(fl); }
    const dawnSky = new THREE.Mesh(new THREE.PlaneGeometry(BX, BH), new THREE.MeshBasicMaterial({ map: canvasTex(256, 384, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#2b2350"); gr.addColorStop(0.5, "#8a5a86"); gr.addColorStop(0.85, "#f2a679"); gr.addColorStop(1, "#ffd2a0"); g.fillStyle = gr; g.fillRect(0, 0, w, h);
      g.fillStyle = "#ffe3b8"; g.beginPath(); g.arc(w * 0.6, h * 0.8, 40, 0, Math.PI * 2); g.fill(); }) }));
    dawnSky.position.set(0, BH / 2, BZ1 + 0.01); dawn.add(dawnSky);
    const dawnPop = []; const dpop = (mesh, z, at, i) => { const hg = new THREE.Group(); hg.position.set(0, 0.02, z); hg.add(mesh); dawn.add(hg); dawnPop.push({ hg, at, i }); return hg; };
    // far hills with the solar field
    { const s = new THREE.Shape(); s.moveTo(-BX / 2, -0.1); for (let x = -BX / 2; x <= BX / 2 + 0.01; x += 0.1) s.lineTo(x, 0.55 + 0.18 * Math.sin(x * 3.1 + 1) + 0.08 * Math.sin(x * 9)); s.lineTo(BX / 2, -0.1);
      const hill = E.extrude(s, "#94627e", 0.03); const g = new THREE.Group(); g.add(hill);
      const N = 18; const pan = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.08, 0.01), new THREE.MeshStandardMaterial({ color: "#2d3c6e", roughness: 0.4, metalness: 0.2, emissive: new THREE.Color("#ffd9a8"), emissiveIntensity: 0.0 }), N);
      const d = new THREE.Object3D(); for (let i = 0; i < N; i++) { const x = -0.85 + (i % 9) * 0.21, y = 0.28 + Math.floor(i / 9) * 0.16 + 0.05 * Math.sin(x * 3); d.position.set(x, y, 0.06); d.rotation.set(-0.5, 0, 0); d.updateMatrix(); pan.setMatrixAt(i, d.matrix); }
      g.add(pan); g.userData.pan = pan; dpop(g, -2.05, tEnergy - 0.1, 0); }
    const solar = dawnPop[0].hg.children[0].userData.pan;
    // the ward: beds, two patients sitting up, a nurse, a tall window of dawn light
    { const g = new THREE.Group(); const plum = new THREE.MeshBasicMaterial({ color: "#3a2740" });
      [-0.5, 0.42].forEach((x, i) => { const bed = flat(E.polyShape([[x - 0.32, 0.18], [x + 0.32, 0.18], [x + 0.32, 0.26], [x - 0.32, 0.26]]), plum); g.add(bed);
        [x - 0.3, x + 0.3].forEach((lx) => { const l = flat(E.rectShape(0.03, 0.18, lx, 0.09), plum); g.add(l); });
        const hb = flat(E.rectShape(0.04, 0.24, x - 0.32, 0.3), plum); g.add(hb);
        const sheet = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.05), new THREE.MeshBasicMaterial({ color: "#f3e3cf" })); sheet.position.set(x + 0.05, 0.285, 0.005); g.add(sheet);
        const p = E.figure({ pose: "sit", hair: i ? "long" : "short", scale: 0.26, hex: "#3a2740", seed: 20 + i }); p.position.set(x - 0.22, 0.12, 0.01); p.userData.pose(0, { lean: -0.2 }); g.add(p); g.userData["p" + i] = p; });
      const nurse = E.figure({ pose: "stand", hair: "bun", scale: 0.3, hex: "#3a2740", seed: 22 }); nurse.position.set(0.0, 0, 0.02); g.add(nurse); g.userData.nurse = nurse;
      const iv = flat(E.rectShape(0.02, 0.5, -0.08, 0.25), plum); g.add(iv);
      dpop(g, -1.25, tCures - 0.12, 1); }
    const ward = dawnPop[1].hg.children[0];
    // paper stars on the dawn sky
    const starShape = (r0, r1) => { const p = []; for (let i = 0; i < 10; i++) { const a = Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? r1 : r0; p.push([Math.cos(a) * r, Math.sin(a) * r]); } return E.polyShape(p); };
    const pstars = []; { const r = E.rng(14); for (let i = 0; i < 7; i++) { const s = E.extrude(starShape(0.07 + r() * 0.04, 0.03), "#fff1d6", 0.015, { emissive: 0.6, cast: false }); s.position.set(-0.8 + r() * 1.6, 1.7 + r() * 1.1, BZ1 + 0.05); dawn.add(s); pstars.push({ s, at: tDisc + i * 0.07 }); } }
    const dawnLight = E.pointLight("#ffd2b0", 0, 4); dawnLight.position.set(-DX, 2.2, -1.5); scene.add(dawnLight);
    const cyLight = E.pointLight(C.cyan, 0, 7); cyLight.position.set(-DX, 1.2, 0.2); scene.add(cyLight);
    const amLight = E.pointLight(C.amber, 0, 4.5); amLight.position.set(DX, 0.9, -0.15); scene.add(amLight);

    // ---------------- behind the amber door: the maze, which folds into a flipbook; the cut reappears on every page ----------------
    const MZ = { cols: 7, rows: 5, cell: 0.8 }; const MW = MZ.cols * MZ.cell, MH = MZ.rows * MZ.cell; const SW = 6.3, SH = 4.5; // maze in sheet units (same maze as s05)
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
    // flipbook behind the amber wall: spine along z at x = BKX, pages extend to +x; page 1 is the maze
    const PGW = 1.6, BS = PGW / 4.2, BKX = 2.3, BKZ = -1.52, NP = 14;
    const book = E.flipbook({ w: 4.2, h: 3, pages: NP, cover: "#2c3f63", seed: 9, drawPage: (g, w, h, i) => drawMaze(g, w, h, { folded: true, cut: true, cyan: 1, amber: i === 1 ? 1 : 0.6 }) });
    book.scale.setScalar(BS); book.rotation.x = -Math.PI / 2; book.position.set(BKX, 0.06 + (0.06 + NP * 0.012) * BS + 0.002, BKZ); scene.add(book);
    const PC = V3(BKX + PGW / 2, book.position.y, BKZ); const MS = PGW / SW; // sheet units → world
    const UVW = (u, v, y = 0) => V3(PC.x + u * MS, PC.y + 0.004 + y * MS, PC.z - v * MS);
    // 3D maze walls standing on page 1 (they fold flat into the print), the live cyan line, the cut wall
    const wallIM = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), E.paperMat("#2c3f63"), walls.length); wallIM.castShadow = true; wallIM.receiveShadow = true; scene.add(wallIM);
    const cutIdx = walls.findIndex((wl) => wl.kind === cutWall.kind && wl.r === cutWall.r && wl.c === cutWall.c);
    const cutDir = cutWall.kind === "H" ? (best.G[0] > best.A[0] ? 1 : -1) : (best.G[1] > best.A[1] ? 1 : -1);
    const _o = new THREE.Object3D(), M1 = new THREE.Matrix4(), M2 = new THREE.Matrix4(), M3 = new THREE.Matrix4();
    const setWalls = (fold, cutK) => { walls.forEach((wl, i) => { const f = i === cutIdx ? cutK : fold; let u, v;
      if (wl.kind === "V") { u = -MW / 2 + wl.c * MZ.cell; v = MH / 2 - (wl.r + 0.5) * MZ.cell; } else { u = -MW / 2 + (wl.c + 0.5) * MZ.cell; v = MH / 2 - wl.r * MZ.cell; }
      _o.position.copy(UVW(u, v)); _o.rotation.set(0, wl.kind === "V" ? Math.PI / 2 : 0, 0); _o.updateMatrix();
      const dir = i === cutIdx ? (wl.kind === "H" ? -cutDir : cutDir) : 1;
      M1.makeRotationX(dir * f * Math.PI / 2); M2.makeTranslation(0, WH * MS / 2, 0).premultiply(M1); M3.makeScale((MZ.cell + WT) * MS, WH * MS, WT * MS);
      _o.matrix.multiply(M2).multiply(M3); wallIM.setMatrixAt(i, _o.matrix); }); wallIM.instanceMatrix.needsUpdate = true; };
    const lineMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan).multiplyScalar(1.6) });
    const mazePath = new THREE.CurvePath(); for (let i = 1; i < cyanUV.length; i++) mazePath.add(new THREE.LineCurve3(UVW(...cyanUV[i - 1], 0.035), UVW(...cyanUV[i], 0.035)));
    const MSEG = 200; const mazeLine = new THREE.Mesh(new THREE.TubeGeometry(mazePath, MSEG, 0.03 * MS, 6, false), lineMat); scene.add(mazeLine);
    const cumLen = (() => { const L = [0]; let s = 0; for (let i = 1; i < cyanUV.length; i++) { s += Math.hypot(cyanUV[i][0] - cyanUV[i - 1][0], cyanUV[i][1] - cyanUV[i - 1][1]); L.push(s); } return L.map((x) => x / s); })();
    const kBeforeCut = cumLen[cumLen.length - 2];
    const cutUV = (() => { const a = cellUV(best.A), g = cellUV(best.G); return [(a[0] + g[0]) / 2, (a[1] + g[1]) / 2]; })();
    const cutGlow = haloPlane(0.9, C.cyan); cutGlow.rotation.x = -Math.PI / 2; scene.add(cutGlow);
    const mazeLight = E.pointLight(C.cyan, 0, 2.5); scene.add(mazeLight);
    // page flips on "inherited by every system after it": one page per beat, each landing shows the same cut, glowing
    const tFl0 = tInherited - 0.25, tFl1 = tAfter + 0.1, NFL = 7;
    const flipAt = (t) => { if (t < tFl0) return 0.5; const x = lin(tFl0, tFl1, t) * NFL; const n = Math.floor(x), f = x - n; return 0.5 + n + sineInOut(Math.min(1, f * 1.4)); };

    // ---------------- 2030 over both doors ----------------
    const y2030 = E.cutoutText("2030", { height: 1.05, hex: C.cream }); scene.add(y2030);
    const y2030glow = haloPlane(3.4, "#ffe9c4", 1.6); scene.add(y2030glow);

    // ---------------- DOM ----------------
    const stamp = E.stampDOM(E.layer, [{ t: CUT - 2, year: "MARCH 2028", label: "Scenario" }], tTT - 0.2);
    const src = E.srcDOM(E.layer, { small: "Jared Kaplan, Anthropic (The Guardian, Dec 2025)", inAt: tJared, outAt: tPause - 0.4 });
    const tag3 = E.tagDOM(E.layer, { title: "3 weeks", inAt: tThree, outAt: tCaseYes + 0.2, cyan: true });
    const tag6 = E.tagDOM(E.layer, { title: "6 months", inAt: tSix, outAt: tCaseYes + 0.3 });
    const fillD = E.fillDOM(E.layer, "#bff4ff");
    const vt = new THREE.Vector3();

    // ---------------- camera (same path/drift code as s05) ----------------
    const N_CARD = V3(0, 1, 0.12).normalize();
    const cardCam = (t, C0, s) => { const D = 1.4863 * s * (1 + 0.025 * (CUT - t)); return { p: C0.clone().addScaledVector(N_CARD, D), l: C0.clone() }; };
    const val = (x, t) => (typeof x === "function" ? x(t) : V3(...x));
    const drift = (t, p, l) => { const d = p.distanceTo(l) * 0.01; p.x += d * (Math.sin(t * 0.37) * 0.9 + Math.sin(t * 0.83 + 1.3) * 0.4); p.y += d * (Math.sin(t * 0.51 + 0.7) * 0.6 + Math.sin(t * 1.13 + 2.1) * 0.2);
      l.x += d * Math.sin(t * 0.29 + 0.4) * 0.5; l.y += d * Math.sin(t * 0.43 + 1.9) * 0.35; };
    const EASE = { sine: sineInOut, smooth: (x) => x * x * (3 - 2 * x), inOut, lin: (x) => x, out: (x) => 1 - Math.pow(1 - x, 3), in: (x) => x * x * x };
    const path = (keys, t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++; const a = keys[i], b = keys[i + 1];
      const kk = EASE[b.e || "sine"](b.t > a.t ? lin(a.t, b.t, t) : 1); const pa = val(a.p, t), pb = val(b.p, t), la = val(a.l, t), lb = val(b.l, t);
      const p = pa.clone().lerp(pb, kk), l = la.clone().lerp(lb, kk); const bulge = Math.sin(Math.PI * kk) * pa.distanceTo(pb) * (b.arc ?? 0.1); p.x += bulge * (i % 2 ? -1 : 1); p.y += bulge * 0.4; return { p, l }; };
    const tOrb1 = T1 - 1.85;
    const ORB = V3(0, 1.3, -0.3);
    const orbP = (t) => { const k = sineInOut(lin(tPause - 0.3, tOrb1, t)); const th = lerp(0.22, -0.42, k); const R = lerp(10.2, 8.4, k); return V3(ORB.x + R * Math.sin(th), lerp(3.1, 2.3, k), ORB.z + R * Math.cos(th)); };
    const orbL = (t) => { const k = sineInOut(lin(tPause - 0.3, tOrb1, t)); return V3(lerp(0, -0.7, k), lerp(2.2, 1.5, k), -0.6); };
    const DOORC = V3(-DX, 0.07 + DOOR.h * 0.5, WZ);
    const keys = [
      { t: CUT, p: (t) => cardCam(t, CARD0, QW).p, l: (t) => cardCam(t, CARD0, QW).l },
      { t: CUT + 0.55, p: (t) => cardCam(t, CARD0, QW).p, l: (t) => cardCam(t, CARD0, QW).l, e: "lin", arc: 0 },
      { t: tPlan + 0.3, p: [0.3, 6.6, 9.6], l: [0, 1.5, -1.0], e: "inOut", arc: 0.03 },
      { t: tSuccessor + 0.5, p: [-0.8, 3.6, 8.2], l: [-1.1, 2.4, -1.0] },
      { t: tSix + 0.7, p: [0.1, 3.1, 8.6], l: [0.0, 2.0, -1.0] },
      { t: tBehind + 0.3, p: [0, 3.5, 10.4], l: [0, 2.7, -2.0] },
      { t: tWont + 0.3, p: [0.35, 3.2, 9.4], l: [0, 2.55, -2.0], e: "smooth" },
      { t: tCures - 0.1, p: [-1.82, 1.4, 1.5], l: [-1.9, 1.22, -2.0], e: "inOut", arc: 0.05 },
      { t: tSooner + 0.35, p: [-1.86, 1.36, 1.05], l: [-1.9, 1.22, -2.0], e: "smooth" },
      { t: tNobody - 0.05, p: [2.95, 5.7, -0.5], l: [3.05, 0.2, -1.55], e: "inOut", arc: 0.06 },
      { t: tShortcut + 0.4, p: [3.0, 4.9, -0.75], l: [3.05, 0.15, -1.55], e: "sine" },
      { t: tAfter + 0.1, p: [2.45, 5.6, -0.6], l: [2.4, 0.15, -1.52], e: "smooth" },
      { t: tJared + 0.3, p: [0, 3.3, 11.4], l: [0, 2.4, -1.0], e: "inOut", arc: 0.05 },
      { t: tTT + 0.6, p: [0, 3.5, 10.6], l: [0, 2.85, -1.0], e: "sine" },
      { t: tPause - 0.3, p: orbP, l: orbL, e: "sine" },
      { t: tOrb1, p: orbP, l: orbL, e: "lin", arc: 0 },
      { t: T1, p: [-DX, DOORC.y, WZ + 0.05], l: [-DX, DOORC.y - 0.05, -2.4], e: "in", arc: 0 },
    ];
    const camAt = (t) => { const c = path(keys, t); drift(t, c.p, c.l); return c; };

    // ---------------- UPDATE ----------------
    const tOpen0 = CUT + 0.45, tOpen1 = tPlan - 0.2;
    const update = (t) => {
      const fl = 1 + 0.025 * Math.sin(t * 6.1) * Math.sin(t * 2.3);
      spot.intensity = 15 * SC * fl * (1 - 0.35 * smooth(CUT + 0.5, tPlan, t)); roomFill.intensity = 3.2 * SC * fl * (1 - 0.6 * smooth(CUT + 0.5, tPlan, t)); monLight.intensity = (2.2 + 0.3 * Math.sin(t * 1.7)) * SC;
      // the card opens: cover rises to become the back panel; the pieces stand up just behind it (pop-up spring)
      const op = inOut(lin(tOpen0, tOpen1, t)); coverPivot.rotation.x = -Math.PI / 2 * op + 0.004 * Math.sin(t * 0.9) * op;
      pops.forEach(({ hinge, delay, i }) => { const k = clamp((op - delay) / (1 - delay), 0, 1); const up = spring(k);
        hinge.visible = op > delay - 0.02; hinge.rotation.x = Math.PI / 2 * (1 - up) + 0.006 * Math.sin(t * (0.55 + i * 0.13) + i * 1.7) * up; hinge.position.x = [0, -DX, DX, 0][i] + 0.01 * Math.sin(t * (0.21 + i * 0.04) + i); });
      dawn.visible = op > 0.55; dawn.scale.y = Math.max(0.001, smooth(0.55, 1, op));
      // doors breathe
      const br = Math.sin(t * 1.15), br2 = Math.sin(t * 1.15 + 1.9);
      cyanWall.scale.set(1 + 0.004 * br, 1 + 0.008 * br, 1); amberWall.scale.set(1 + 0.004 * br2, 1 + 0.008 * br2, 1);
      const yesK = smooth(tCaseYes, tCaseYes + 1, t) * (1 - smooth(tCaseNo - 0.3, tCaseNo + 0.6, t)); const noK = smooth(tCaseNo, tCaseNo + 1, t) * (1 - smooth(tAnth, tAnth + 1, t));
      const fillK = smooth(T1 - 0.42, T1 - 0.03, t), pushK = smooth(tOrb1, T1, t);
      const nearK = smooth(tEvery - 0.4, tCures - 0.3, t) * (1 - smooth(tSooner, tNobody - 0.3, t));
      cyDoor.rotation.y = -lerp(0.0, 1.95, spring(lin(tOpen1 - 0.4, tOpen1 + 0.6, t))) - 0.03 * br;
      cyHaze.material.opacity = (0.08 + 0.03 * br + 0.06 * yesK) * (1 - 0.8 * nearK) + 0.9 * pushK * pushK;
       cyGlow.material.opacity = (0.22 + 0.05 * br + 0.1 * yesK) * op * (1 - nearK) + 0.6 * pushK; cyGlow.scale.setScalar(1 + 0.04 * br + 1.5 * pushK);
      cyTrim.forEach((b) => (b.material.emissiveIntensity = 0.3 + 0.08 * br + 0.2 * yesK + 3 * pushK));
      cyLight.intensity = (2.2 + 0.3 * br + 1.2 * yesK) * op * (1 - 0.7 * nearK) + 14 * pushK;
      leak.material.color.set(C.amber).multiplyScalar((1.6 + 0.25 * br2 + 0.8 * noK) * op); amGlow.material.opacity = (0.3 + 0.06 * br2 + 0.2 * noK) * op; amLight.intensity = (2.0 + 0.3 * br2 + 1.2 * noK) * op;
      // the machine and its successor
      const sK = spring(lin(tSuccessor - 0.15, tSuccessor + 0.9, t)); const imp = smooth(tImprove - 0.2, tItself, t);
      rings.userData.update(t, { think: 1 + 1.5 * imp, glow: 0.8 + 0.6 * imp + 0.6 * Math.exp(-Math.pow((t - tSystem - 0.3) / 0.5, 2)) });
      succ.visible = t > tSuccessor - 0.2; succ.scale.setScalar(Math.max(0.001, sK * (1 + 0.15 * imp))); succ.userData.update(t + 0.7, { think: 0.8 + imp, glow: (0.6 + 0.8 * imp) * sK });
      // Lena: looks at the cyan door for "yes", at the amber door for "no", then up at 2030; breathing in the silence
      const lookYes = smooth(tCaseYes - 0.3, tCaseYes + 0.5, t) * (1 - smooth(tCaseNo - 0.4, tCaseNo + 0.4, t));
      const tt30 = smooth(tTT - 0.2, tTT + 0.6, t);
      lena.rotation.y = 0; lena.userData.pose(t, { turn: lookYes > 0.5 ? 1 : 0, lookUp: 0.25 * tt30 + 0.05 * Math.sin(t * 0.5) * smooth(tPause, tPause + 1, t), lean: -0.1 * tt30 });
      lena.position.x = lookYes > 0.5 ? 0.2 : -0.2;
      // the rival labs rise out of the printed horizon, light up, and come closer ("weeks behind" / "they won't")
      towers.forEach((g, i) => { const rise = spring(lin(tRival - 0.05 + i * 0.12, tRival + 1.0 + i * 0.12, t)); const close = smooth(tBehind - 0.2, tBehind + 1.2, t), wont = smooth(tWont - 0.3, tWont + 0.4, t);
        g.visible = rise > 0.001; g.scale.set(1, Math.max(0.001, rise), 1).multiplyScalar(lerp(0.78, 1.0, close)); g.position.z = lerp(-2.32, -2.12, close) + 0.004 * Math.sin(t + i); g.position.x = TX[i] * lerp(1, 0.97, close);
        const tw = g.children[0]; for (let f = 0; f < 8; f++) { const on = smooth(tLabs + f * 0.06 + i * 0.1, tLabs + 0.3 + f * 0.06 + i * 0.1, t); tw.userData.setFloor(f, on * (0.55 + 0.35 * wont + 0.06 * Math.sin(t * 2 + f + i)), C.cyan); }
        towerHalo[i].material.opacity = rise * (0.08 + 0.1 * close + 0.12 * wont) * (1 - 0.7 * noK); towerHalo[i].position.y = 2.2 * rise; });
      // inside the dawn box: ward on "cures", solar on "energy", paper stars on "discoveries"
      dawnPop.forEach(({ hg, at, i }) => { const up = spring(lin(at, at + 0.8, t)); hg.visible = t > at - 0.03; hg.rotation.x = -Math.PI / 2 * (1 - up) + 0.008 * Math.sin(t * 0.8 + i) * up; });
      solar.material.emissiveIntensity = 0.5 * smooth(tEnergy, tEnergy + 0.6, t) * (0.7 + 0.3 * Math.sin(t * 3.1));
      pstars.forEach(({ s, at }, i) => { const k = spring(lin(at, at + 0.6, t)); s.visible = k > 0.001; s.scale.setScalar(Math.max(0.001, k)); s.rotation.z = 0.2 * Math.sin(t * 0.7 + i); s.material[0].emissiveIntensity = 0.6 + 0.3 * Math.sin(t * 2 + i * 1.3); });
      ward.userData.nurse.userData.pose(t, { reach: 0.4 + 0.2 * Math.sin(t * 0.8), walk: 0 }); ward.userData.p0.userData.pose(t, { lean: -0.2, lookUp: 0.2 }); ward.userData.p1.userData.pose(t + 2, { lean: -0.25, reach: 0.3 });
      dawnLight.intensity = op * (1.5 + 2.5 * smooth(tEvery - 0.3, tCures, t));
      // behind the amber door: line along the path → cuts the wall on "shortcut" → walls fold flat → pages turn, the cut glows on every page
      const lineK = t < tNobody + 0.2 ? 0 : t < tShortcut ? kBeforeCut * sineInOut(lin(tNobody + 0.2, tShortcut - 0.05, t)) : lerp(kBeforeCut, 1, expoOut(lin(tShortcut - 0.05, tShortcut + 0.15, t)));
      const flipping = t >= tFl0; const flip = flipAt(t);
      mazeLine.visible = lineK > 0 && !flipping; mazeLine.geometry.setDrawRange(0, Math.floor(MSEG * lineK) * 36);
      const cutK = t < tShortcut ? 0 : 1 - Math.exp(-(t - tShortcut) * 9) * Math.cos((t - tShortcut) * 16); const foldK = inOut(lin(tShortcut + 0.55, tInherited - 0.35, t));
      setWalls(foldK, Math.max(clamp(cutK, 0, 1.05) * 0.86, foldK)); wallIM.visible = !flipping && op > 0.6;
      book.visible = op > 0.6; book.userData.update(t, { flip, spread: 1 });
      const land = flipping ? (flip - 0.5) % 1 : 1; const nLand = Math.floor(flip - 0.5);
      const pulse = flipping ? (land < 0.02 ? 1 : Math.exp(-(land < 1 ? (land * (tFl1 - tFl0) / NFL) : 9) * 3)) : 0;
      cutGlow.position.copy(UVW(...cutUV, 0.05)); const cg = (t >= tShortcut ? 0.6 * Math.exp(-(t - tShortcut) * 1.5) + 0.25 : 0) * (1 - smooth(tAnth, tAnth + 1.2, t)) + (flipping && nLand >= 0 ? 0.0 : 0);
      const pageLanded = flipping ? Math.exp(-((flip - 0.5) - Math.floor(flip - 0.5)) * 0) : 0;
      const cycleK = flipping ? (flip - 0.5) - Math.floor(flip - 0.5) : 0; const glowPulse = flipping && t < tAnth + 1 ? Math.max(0, 1 - Math.abs(cycleK - 0.75) * 3.5) : 0;
      cutGlow.material.opacity = cg + 0.9 * glowPulse * (1 - smooth(tAnth, tAnth + 1, t)); cutGlow.scale.setScalar(1 + 0.6 * glowPulse);
      mazeLight.position.copy(UVW(...cutUV, 1.2)); mazeLight.intensity = 3 * cutGlow.material.opacity;
      // 2030 rises from behind the back panel and hovers over both doors
      const r30 = spring(lin(tTT - 0.1, tTT + 0.9, t)); y2030.visible = t > tTT - 0.12; y2030.position.set(0.45, lerp(3.7, 4.55, r30) + 0.05 * Math.sin(t * 1.3), lerp(-2.75, -0.9, smooth(tTT - 0.1, tTT + 0.7, t)));
      y2030.rotation.set(-0.12 + 0.03 * Math.sin(t * 0.9), 0.05 * Math.sin(t * 0.6), 0.02 * Math.sin(t * 0.8)); y2030glow.position.copy(y2030.position).add(V3(0, 0, -0.3)); y2030glow.material.opacity = 0.12 * r30 * (1 - 0.6 * pushK);
      // camera, overlays
      const c = camAt(t); E.applyCam(camera, c);
      cyanWall.updateMatrixWorld(true); vt.set(DOOR.w / 2 + 0.25, DOOR.h + 0.25, 0.1); cyanWall.localToWorld(vt); let sp = E.project(vt, camera); tag3.place(sp.x + 150, sp.y - 20);
      amberWall.updateMatrixWorld(true); vt.set(DOOR.w / 2 + 0.25, DOOR.h + 0.25, 0.1); amberWall.localToWorld(vt); sp = E.project(vt, camera); tag6.place(sp.x + 150, sp.y - 20);
      stamp.update(t); src.update(t); tag3.update(t); tag6.update(t); fillD.update(fillK);
      post.bloom = 0.45 + 0.15 * yesK + 0.9 * pushK; post.exposure = 1.15 + 0.35 * pushK * pushK;
    };
    const post = { bloom: 0.45, exposure: 1.15 };
    return { scene, camera, post, update };
  },
};
