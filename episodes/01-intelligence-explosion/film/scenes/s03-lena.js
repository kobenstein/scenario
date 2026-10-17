// s03 · Lena (constructed) — 2024 she writes code, 2026 she reads it; "instrumental in creating itself";
// the research-intern hall; REVEAL 1: "Her day is already real." (the "constructed" slip peels off and flutters away).
// Carrier in: the report page (16x9) at the PAGE framing, % figure in its margin; it tips back and Lena's office pops up on it.
// Carrier out: the hall folds up like an accordion into the CLOSED flipbook, centred, ~45 % frame width, y ≈ 46 % from top.
// Hero light: Lena's amber desk lamp; the screen's cyan grows against it; then the cyan hall; amber stays in front.
import { drawReport, pctPlane, REPORT } from "./s02-why.js";

export default {
  build(E, def) {
    const { THREE, C, PAL, V } = E;
    const { lin, smooth, clamp, lerp, expoOut, inOut, spring, sineInOut, wob } = E;
    const scene = new THREE.Scene();
    const camera = E.newCamera();
    const pal = PAL.night;
    const S = (p, n = 1) => E.at("scenario", p, n), SE = (p, n = 1) => E.end("scenario", p, n);
    const T0 = def.from, T1 = def.to;
    E.renderer.localClippingEnabled = true;

    // ---------------- word anchors ----------------
    const tLets = S("Let's follow"), tInvented = S("invented"), tLena = S("Lena"), tEngineer = S("engineer");
    const t2024 = S("twenty twenty-four"), tWrote = S("wrote code"), tCoffee = S("Coffee"), tBlank = S("blank file"), tHands = S("hands on the keys"), tKeysEnd = SE("on the keys");
    const t2026 = S("twenty twenty-six"), tReads = S("reads code"), tAIw = S("The AI writes"), tChecks = S("checks it");
    const tGuess = S("That's not a guess"), tFeb = S("February"), tOpenAI = S("OpenAI"), tInstr = S("instrumental"), tItself = S("creating itself") + 0.48;
    const tAnd = S("And that research"), tIntern = S("research intern"), tDays = SE("skilled person days");
    const tSoFar = S("So far"), tInv2 = S("invented", 2), tHerDay = S("Her day"), tAlready = S("already real"), tReal = SE("already real") - 0.32;

    // ---------------- stage ----------------
    const st = E.stage(scene, pal, { floor: true, stars: 170, clouds: true, seed: 33, skyZ: -235, skyY: 62 });
    // engine stage clouds: the first cloud (x -30, y 36) shades to NaN and blooms into a white blob; hide it
    scene.children.forEach((c) => { if (c.geometry && c.geometry.type === "ExtrudeGeometry") { c.geometry.computeBoundingSphere(); if (c.geometry.boundingSphere.radius > 30 || !isFinite(c.geometry.boundingSphere.radius) || (c.position.y === 36 && c.position.x === -30)) c.visible = false; } });
    st.floor.position.y = -0.14; st.floor.scale.set(1, 3, 1); st.floor.position.z = -70;
    st.sky.scale.set(2.2, 2.0, 1);
    scene.fog = new THREE.Fog(pal.fog, 60, 280);
    const far = new THREE.Group(); scene.add(far);
    const cityL = E.city(far, pal, { zs: [-215, -200, -186], holes: [0, 0.06, 0.12], heights: [[10, 20], [8, 16], [6, 12]], width: 150, seed: 41 });
    const L = E.lights(scene, pal, { key: [-22, 30, 30], target: [0, 0, -4], intensity: 0.7, hemi: 0.55, box: 22 });

    // ---------------- the hall root: segments that later fold like an accordion ----------------
    const SL = 16 / 1.4, WID = 16, TAU = 0.08, NSEG = 13;
    const segMats = (() => { const top = E.paperMat("#1b2742"), side = new THREE.MeshStandardMaterial({ color: new THREE.Color(C.cream).multiplyScalar(0.75), roughness: 0.9 });
      return [side, side, top, top, side, side]; })();
    const segGeo = new THREE.BoxGeometry(WID, TAU, SL); segGeo.translate(0, -TAU / 2, -SL / 2);
    const H = new THREE.Group(); scene.add(H);
    const SEG = []; // {hinge, content}
    { const s0 = new THREE.Group(); s0.position.set(0, 0, SL / 2); H.add(s0); const m = new THREE.Mesh(segGeo, segMats); m.receiveShadow = true; s0.add(m); SEG.push({ hinge: s0, content: s0, py: 0 }); }
    for (let k = 1; k < NSEG; k++) { const py = k === 1 ? 0.16 : k % 2 ? 0.05 : -(TAU + 0.05);
      const hinge = new THREE.Group(); hinge.position.set(0, py, -SL); SEG[k - 1].content.add(hinge);
      const content = new THREE.Group(); content.position.y = -py; hinge.add(content);
      const m = new THREE.Mesh(segGeo, segMats); m.receiveShadow = true; content.add(m); SEG.push({ hinge, content, py }); }
    const fold = (phi) => { for (let k = 1; k < NSEG; k++) SEG[k].hinge.rotation.x = (k % 2 ? 1 : -1) * phi; };
    const s0 = SEG[0].content; // seg0 local z: 0 (front edge, world z = SL/2) .. -SL
    const W2L = (x, y, z) => V(x, y, z - SL / 2); // world (H unfolded) -> seg0 local

    // ---------------- the report page (carrier in): stands at the front edge, tips back onto the floor ----------------
    const RPX = 2048, RPY = 1152;
    const rc = document.createElement("canvas"); rc.width = RPX; rc.height = RPY; drawReport(rc.getContext("2d"), RPX, RPY, E.rng);
    const rtex = new THREE.CanvasTexture(rc); rtex.colorSpace = THREE.SRGBColorSpace; rtex.anisotropy = 8;
    const repMat = new THREE.MeshStandardMaterial({ map: rtex, emissiveMap: rtex, emissive: 0xffffff, emissiveIntensity: REPORT.REP_EMI, roughness: 0.95, bumpMap: E.bumpTex, bumpScale: 0.15 });
    const repBack = new THREE.MeshStandardMaterial({ color: C.cream, map: E.paperTex, roughness: 0.95, side: THREE.BackSide });
    const PG = new THREE.Group(); PG.position.set(0, 0.012, 0); s0.add(PG);
    { const g = new THREE.PlaneGeometry(16, 9); g.translate(0, 4.5, 0); const f = new THREE.Mesh(g, repMat), b = new THREE.Mesh(g, repBack); f.receiveShadow = true; f.castShadow = true; PG.add(f, b); }
    const pct = pctPlane(THREE, E); pct.mesh.position.set(REPORT.PCT_X, 4.5 + REPORT.PCT_Y, 0.02); PG.add(pct.mesh);
    const tTick0 = E.at("why", "number");
    const PAGEC = V(0, 4.5, SL / 2 + 0.012 * 0); const PAGE_P = PAGEC.clone().add(V(0, 0, E.PAGE.dist));
    const pageLight = E.pointLight("#fff2dc", 22, 40); pageLight.position.set(2, 4.5 + 3, SL / 2 + 10); scene.add(pageLight);

    // ---------------- Lena's office (pops up from the page) ----------------
    const POPS = []; // {g, at, dur, i}
    const pop = (obj, at, dur = 0.9) => { const g = new THREE.Group(); g.position.copy(obj.position); obj.position.set(0, 0, 0); g.add(obj); s0.add(g); POPS.push({ g, at, dur, i: POPS.length }); return g; };
    const tPop = tLets + 0.75;
    const INKM = (hex) => E.paperMat(hex);
    // desk
    const desk = new THREE.Group(); desk.position.copy(W2L(0.6, 0, -0.6));
    { const top = E.box(4.6, 0.16, 2.2, "#2b3a5c"); top.position.y = 1.78; desk.add(top);
      [-2.1, 2.1].forEach((x) => { const l = E.box(0.14, 1.7, 2.0, "#1e2a45"); l.position.set(x, 0.85, 0); desk.add(l); });
      const back = E.box(4.2, 0.9, 0.08, "#1e2a45"); back.position.set(0, 1.25, -0.95); desk.add(back); }
    pop(desk, tPop + 0.0);
    const DESKY = 1.86;
    // chair
    const chair = new THREE.Group(); chair.position.copy(W2L(-2.7, 0, -0.3));
    { const seat = E.box(1.2, 0.12, 1.1, "#141c30"); seat.position.y = 1.18; chair.add(seat);
      const bk = E.extrude(E.roundRectShape(0.16, 1.7, 0.07), "#141c30", 1.0); bk.position.set(-0.62, 2.05, -0.5); chair.add(bk);
      const stem = E.box(0.12, 1.1, 0.12, "#10172a"); stem.position.y = 0.6; chair.add(stem);
      [0, 1].forEach((k) => { const f = E.box(1.3, 0.08, 0.12, "#10172a"); f.position.y = 0.06; f.rotation.y = k * Math.PI / 2 + 0.4; chair.add(f); }); }
    pop(chair, tPop + 0.12);
    // Lena
    const lena = E.figure({ pose: "sit", hair: "bun", scale: 2.2, seed: 7 }); lena.position.copy(W2L(-2.72, 0.06, -0.3));
    const lenaG = pop(lena, tPop + 0.3, 1.0); lena.position.set(0, 0, 0);
    // monitor (faces Lena and the camera)
    const MON = new THREE.Group(); MON.position.copy(W2L(1.55, DESKY, -1.05)); MON.rotation.y = -0.75;
    const housing = E.box(2.5, 1.62, 0.14, "#121a2e"); housing.position.y = 1.0; MON.add(housing);
    { const neck = E.box(0.16, 0.25, 0.1, "#121a2e"); neck.position.set(0, 0.12, -0.05); MON.add(neck); const base = E.box(0.8, 0.05, 0.5, "#121a2e"); base.position.y = 0.025; MON.add(base); }
    const scC = document.createElement("canvas"); scC.width = 512; scC.height = 320; const scG = scC.getContext("2d");
    const scTex = new THREE.CanvasTexture(scC); scTex.colorSpace = THREE.SRGBColorSpace;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.32, 1.44), new THREE.MeshBasicMaterial({ map: scTex, color: 0xffffff })); screen.position.set(0, 1.0, 0.075); MON.add(screen);
    pop(MON, tPop + 0.2);
    const monLight = E.pointLight(C.cyan, 0, 11); scene.add(monLight);
    // keyboard
    const kbC = document.createElement("canvas"); kbC.width = 256; kbC.height = 96; { const g = kbC.getContext("2d"); g.fillStyle = "#cfc5b0"; g.fillRect(0, 0, 256, 96); g.fillStyle = "#a59b88";
      for (let r = 0; r < 4; r++) for (let c = 0; c < 13; c++) g.fillRect(8 + c * 19 + r * 4, 8 + r * 21, 15, 16); g.fillRect(70, 8 + 4 * 21 - 2, 110, 8); }
    const kbT = new THREE.CanvasTexture(kbC); kbT.colorSpace = THREE.SRGBColorSpace;
    const kb = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.07, 0.52), [E.paperMat("#8f8776"), E.paperMat("#8f8776"), new THREE.MeshStandardMaterial({ map: kbT, roughness: 0.9 }), E.paperMat("#8f8776"), E.paperMat("#8f8776"), E.paperMat("#8f8776")]);
    kb.castShadow = true; kb.receiveShadow = true; kb.position.copy(W2L(-0.35, DESKY + 0.035, -0.25)); kb.rotation.y = -0.18; pop(kb, tPop + 0.25, 0.6);
    // coffee cup + steam
    const cup = new THREE.Group(); cup.position.copy(W2L(0.75, DESKY, 0.55));
    { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.16, 0.38, 24), E.paperMat("#e7dcc6")); c.position.y = 0.19; c.castShadow = true; cup.add(c);
      const h = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.03, 8, 16, Math.PI * 1.3), E.paperMat("#e7dcc6")); h.position.set(0.2, 0.2, 0); h.rotation.z = -Math.PI * 0.65; cup.add(h);
      const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.16, 20), E.paperMat("#3a2318")); coffee.rotation.x = -Math.PI / 2; coffee.position.y = 0.36; cup.add(coffee); }
    pop(cup, tPop + 0.35, 0.6);
    const steam = []; { const curl = () => { const s = new THREE.Shape(); s.moveTo(0, 0); s.bezierCurveTo(0.12, 0.18, -0.12, 0.34, 0.02, 0.55); s.lineTo(0.045, 0.55); s.bezierCurveTo(-0.09, 0.34, 0.15, 0.18, 0.03, 0); s.lineTo(0, 0); return s; };
      for (let i = 0; i < 3; i++) { const m = new THREE.Mesh(new THREE.ShapeGeometry(curl(), 12), new THREE.MeshBasicMaterial({ color: "#efe6d2", transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })); cup.add(m); steam.push(m); } }
    // lamp (amber hero)
    const LAMP = new THREE.Group(); LAMP.position.copy(W2L(-1.45, DESKY, -0.95));
    { const base = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.08, 24), E.paperMat("#1a1c2c")); base.position.y = 0.04; LAMP.add(base);
      const arm = (a, b) => { const v = b.clone().sub(a); const m = E.box(0.07, v.length(), 0.07, "#262a3f"); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), v.normalize()); LAMP.add(m); };
      arm(V(0, 0.05, 0), V(-0.15, 1.55, 0.05)); arm(V(-0.15, 1.55, 0.05), V(0.6, 1.95, 0.45)); }
    const shade = new THREE.Group(); shade.position.set(0.65, 1.9, 0.5); LAMP.add(shade);
    { const cone = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.6, 30, 1, true), new THREE.MeshStandardMaterial({ color: "#3a2a26", map: E.paperTex, roughness: 0.9, side: THREE.DoubleSide })); cone.castShadow = true; shade.add(cone);
      const inner = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.57, 30, 1, true), new THREE.MeshBasicMaterial({ color: "#ffcf8f", side: THREE.BackSide })); shade.add(inner); shade.userData.inner = inner;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 12), new THREE.MeshBasicMaterial({ color: "#fff1d6" })); bulb.position.y = -0.22; shade.add(bulb); shade.userData.bulb = bulb; }
    shade.rotation.set(0.0, 0, 0.75);
    pop(LAMP, tPop + 0.4, 0.8);
    const spot = new THREE.SpotLight(C.amber, 0, 14, 0.85, 0.6, 1.4); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -0.0015; spot.shadow.radius = 4; scene.add(spot, spot.target);
    const warm = E.pointLight(C.amber, 0, 9); scene.add(warm);
    // shelf + binders (left back) and a paper plant (right) for depth
    const shelf = new THREE.Group(); shelf.position.copy(W2L(5.4, 0, -4.4));
    { const fr = E.extrude(E.rectShape(3.0, 4.6, 0, 2.3), "#16203a", 0.5); fr.position.z = -0.5; shelf.add(fr);
      [1.2, 2.5, 3.8].forEach((y) => { const b = E.box(2.8, 0.08, 0.5, "#22304f"); b.position.set(0, y, -0.2); shelf.add(b); });
      const r = E.rng(14); for (let s = 0; s < 3; s++) for (let i = 0; i < 7; i++) { const h = 0.7 + r() * 0.35; const bd = E.box(0.26, h, 0.42, ["#2f4068", "#3a2f4a", "#26365a", "#4a3a3a"][Math.floor(r() * 4)]); bd.position.set(-1.15 + i * 0.36 + r() * 0.05, [0.2, 1.24, 2.54][s] + h / 2 + 0.04, -0.2); bd.rotation.z = (r() - 0.5) * 0.12; shelf.add(bd); } }
    pop(shelf, tPop - 0.1, 1.0);
    const plant = new THREE.Group(); plant.position.copy(W2L(-6.6, 0, -2.6));
    { const pot = E.box(0.9, 0.9, 0.9, "#2a2234"); pot.position.y = 0.45; plant.add(pot); const r = E.rng(8);
      for (let i = 0; i < 9; i++) { const s = new THREE.Shape(); s.moveTo(0, 0); s.quadraticCurveTo(0.45, 1.3, 0.05, 2.6 + r()); s.quadraticCurveTo(-0.3, 1.3, 0, 0); const m = E.extrude(s, i % 2 ? "#1d3a3a" : "#16302f", 0.04); m.position.set(0, 0.85, (r() - 0.5) * 0.4); m.rotation.z = -0.9 + i * 0.22 + (r() - 0.5) * 0.2; m.rotation.y = r() * 3; plant.add(m); } }
    pop(plant, tPop + 0.05, 1.0);

    // ---------------- the back wall (it falls back to reveal the hall) ----------------
    const WALLG = new THREE.Group(); WALLG.position.set(0, TAU + 0.01, 0); SEG[1].content.add(WALLG);
    { const m = new THREE.Mesh(segGeo, [segMats[0], segMats[1], E.paperMat("#1f2c4a"), E.paperMat("#1f2c4a"), segMats[4], segMats[5]]); m.castShadow = true; m.receiveShadow = true; WALLG.add(m); }
    const winG = new THREE.Group(); WALLG.add(winG); // window decal lying on the wall's inner face (local +y)
    const winC = document.createElement("canvas"); winC.width = 512; winC.height = 300;
    { const g = winC.getContext("2d"); const gr = g.createLinearGradient(0, 0, 0, 300); gr.addColorStop(0, "#0d1a36"); gr.addColorStop(0.7, "#2c4170"); gr.addColorStop(1, "#4a5f8f"); g.fillStyle = gr; g.fillRect(0, 0, 512, 300);
      const r = E.rng(3); g.fillStyle = "#d9d2bd"; for (let i = 0; i < 40; i++) g.fillRect(r() * 512, r() * 170, 2, 2);
      g.fillStyle = "#0b1426"; let x = 0; while (x < 512) { const w = 30 + r() * 50, h = 40 + r() * 90; g.fillRect(x, 300 - h, w, h); x += w; }
      g.fillStyle = "#0e1a30"; g.fillRect(300, 90, 46, 210); g.fillStyle = "#6fe3ff"; for (let y = 104; y < 290; y += 16) g.fillRect(308, y, 30, 5);
      g.fillStyle = "rgba(255,179,92,0.8)"; for (let i = 0; i < 14; i++) g.fillRect(r() * 512, 220 + r() * 70, 5, 6); }
    const winT = new THREE.CanvasTexture(winC); winT.colorSpace = THREE.SRGBColorSpace;
    { const glass = new THREE.Mesh(new THREE.PlaneGeometry(7.4, 4.3), new THREE.MeshBasicMaterial({ map: winT, color: new THREE.Color(0.85, 0.85, 0.85) })); glass.rotation.x = -Math.PI / 2; glass.position.set(-3.4, 0.012, -4.4); glass.scale.set(1, 1.45, 1); winG.add(glass);
      const fs = E.rectShape(8.0, 4.9); const h = new THREE.Path(); h.moveTo(-3.7, -2.15); h.lineTo(3.7, -2.15); h.lineTo(3.7, 2.15); h.lineTo(-3.7, 2.15); h.lineTo(-3.7, -2.15); fs.holes.push(h);
      const fr = E.extrude(fs, "#121a2e", 0.08); fr.rotation.x = -Math.PI / 2; fr.position.set(-3.4, 0.01, -4.4); fr.scale.set(1, 1.45, 1); winG.add(fr);
      const mull = E.box(0.12, 0.08, 4.3, "#121a2e"); mull.position.set(-3.4, 0.05, -4.4); mull.scale.set(1, 1, 1.45); winG.add(mull); }

    // ---------------- the hall: tiny cyan figures at tiny desks, row by row ----------------
    const figShape = (() => { const sc = 1.15; const P = (pts) => E.polyShape(pts.map(([x, y]) => [x * sc, y * sc]));
      const torso = P([[-0.13, 0.52], [0.12, 0.52], [0.15, 0.98], [0.02, 1.07], [-0.12, 1.0]]);
      const head = new THREE.Shape(); head.absarc(0.04 * sc, 1.2 * sc, 0.11 * sc, 0, Math.PI * 2, false);
      const legs = P([[-0.12, 0.6], [0.46, 0.58], [0.5, 0.05], [0.6, 0.02], [0.6, 0], [0.4, 0], [0.38, 0.46], [-0.12, 0.46]]);
      const arm = P([[0.0, 0.98], [0.5, 0.8], [0.52, 0.74], [0.02, 0.88]]);
      return new THREE.ShapeGeometry([torso, head, legs, arm], 6); })();
    const DESK_X = [-6, -3, 0, 3, 6], ROWZ = [-SL * 0.3, -SL * 0.74];
    const HALL = []; let rowIdx = 0;
    const deskGeo = new THREE.BoxGeometry(1.5, 0.82, 0.7); deskGeo.translate(0, 0.41, 0);
    const scrGeo = new THREE.PlaneGeometry(0.5, 0.34); const stripGeo = new THREE.BoxGeometry(14.5, 0.07, 0.14);
    const tRow0 = tIntern + 0.78, dRow = 0.19;
    for (let k = 1; k < NSEG; k++) { const host = k === 1 ? WALLG : SEG[k].content; const n = DESK_X.length * 2;
      const dm = new THREE.InstancedMesh(deskGeo, E.paperMat("#1d2945"), n); dm.castShadow = true; dm.receiveShadow = true;
      const fm = new THREE.InstancedMesh(figShape, new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }), n);
      const sm = new THREE.InstancedMesh(scrGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }), n);
      const lm = new THREE.InstancedMesh(stripGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }), 2);
      host.add(dm, fm, sm, lm); const items = [];
      ROWZ.forEach((z, ri) => { const tr = tRow0 + rowIdx * dRow; rowIdx++;
        DESK_X.forEach((x, di) => items.push({ x, z, tr: tr + di * 0.035 + (k * 7 + di * 3) % 5 * 0.01, ri })); });
      HALL.push({ k, dm, fm, sm, lm, items, tr: [tRow0 + (rowIdx - 2) * dRow, tRow0 + (rowIdx - 1) * dRow] }); }
    const _d = new THREE.Object3D(), _c = new THREE.Color();
    const hallLights = [-14, -45, -90].map((z) => { const l = E.pointLight(C.cyan, 0, 60); l.position.set(0, 7, z); scene.add(l); return { l, z }; });

    // ---------------- code pages (instanced): 2024 her stack, 2026 the stack from the screen, the model's own stack ----------------
    const pgC = document.createElement("canvas"); pgC.width = 128; pgC.height = 166; { const g = pgC.getContext("2d"); g.fillStyle = "#efe6d2"; g.fillRect(0, 0, 128, 166); const r = E.rng(12);
      for (let y = 14; y < 156; y += 9) { const ind = Math.floor(r() * 4) * 8; g.fillStyle = r() < 0.18 ? "rgba(10,111,140,0.7)" : "rgba(31,29,38,0.45)"; g.fillRect(10 + ind, y, 20 + r() * 70, 4); } }
    const pgT = new THREE.CanvasTexture(pgC); pgT.colorSpace = THREE.SRGBColorSpace;
    const pgSide = E.paperMat("#e8dfcc"); const pgTop = new THREE.MeshStandardMaterial({ map: pgT, roughness: 0.92 });
    const PAGES = []; const rr = E.rng(55);
    const deskW = (x, z) => W2L(x, DESKY, z);
    // A: 2024, she types: pages rise from the keyboard and stack at her left
    { const n = 13, a = tWrote + 0.35, b = t2026 - 0.25; for (let i = 0; i < n; i++) PAGES.push({ te: a + (b - a) * i / (n - 1), src: "kb", land: deskW(-1.25, 0.42).add(V(0, 0.012 + i * 0.022, 0)), yaw: (rr() - 0.5) * 0.25, tint: 1 }); }
    // B: 2026, the AI writes: pages fly out of the screen; the stack grows from the screen toward her
    { const n = 46, a = t2026 + 0.55, b = tAnd + 0.2; for (let i = 0; i < n; i++) { const u = i / (n - 1); PAGES.push({ te: a + (b - a) * Math.pow(u, 0.9), src: "scr", land: deskW(lerp(0.75, -0.75, u), lerp(-0.35, 0.18, u)).add(V(0, 0.012 + i * 0.018, 0)), yaw: -0.3 + (rr() - 0.5) * 0.3, tint: 0 }); } }
    // C: the model's own stack, right of the monitor (+ the page the hand brings)
    const OWN = deskW(2.62, -0.05);
    { const n = 7, a = tGuess + 0.2, b = tInstr - 0.5; for (let i = 0; i < n; i++) PAGES.push({ te: a + (b - a) * i / (n - 1), src: "side", land: OWN.clone().add(V(0, 0.012 + i * 0.022, 0)), yaw: 0.6 + (rr() - 0.5) * 0.2, tint: 0 }); }
    const OWN_TOP = OWN.clone().add(V(0, 0.012 + 7 * 0.022, 0));
    const pgGeo = new THREE.BoxGeometry(0.62, 0.012, 0.8);
    const pages = new THREE.InstancedMesh(pgGeo, [pgSide, pgSide, pgTop, pgSide, pgSide, pgSide], PAGES.length); pages.castShadow = true; pages.receiveShadow = true; s0.add(pages);
    PAGES.forEach((p, i) => pages.setColorAt(i, new THREE.Color(p.tint ? "#ffffff" : "#d4f2fa")));
    // pencil (red: Lena's only)
    const pencil = new THREE.Group(); s0.add(pencil);
    { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.52, 6), E.paperMat(C.red)); pencil.add(b); const tip = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.1, 6), E.paperMat("#e8d7b5")); tip.position.y = -0.31; pencil.add(tip); }
    // the paper hand that reaches out of the screen (cyan = machine)
    const handClip = new THREE.Plane(V(0, 0, 1), 0);
    const cyM = () => { const m = E.paperMats("#7fd9ef", { emissive: 0.25 }); m.forEach((x) => (x.clippingPlanes = [handClip])); return m; };
    const ARM = new THREE.Group(); MON.add(ARM);
    const seg1 = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.11, 0.95).translate(0, 0, 0.475), cyM()); ARM.add(seg1);
    const elbow = new THREE.Group(); elbow.position.z = 0.95; ARM.add(elbow);
    const seg2 = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.8).translate(0, 0, 0.4), cyM()); elbow.add(seg2);
    const wrist = new THREE.Group(); wrist.position.z = 0.8; wrist.scale.setScalar(1.6); elbow.add(wrist); seg1.scale.set(1.5, 1.5, 1); seg2.scale.set(1.5, 1.5, 1);
    { const s = new THREE.Shape(); s.moveTo(-0.13, 0); s.lineTo(0.13, 0); s.lineTo(0.15, 0.22);
      [[0.11, 0.42], [0.04, 0.46], [-0.03, 0.44], [-0.1, 0.38]].forEach(([x, y], i) => { const x0 = x + 0.03; s.lineTo(x0, 0.24); s.lineTo(x0, y); s.lineTo(x - 0.03, y); s.lineTo(x - 0.03, 0.25); });
      s.lineTo(-0.15, 0.22); s.lineTo(-0.22, 0.12); s.lineTo(-0.2, 0.08); s.lineTo(-0.13, 0.1); s.lineTo(-0.13, 0);
      const hm = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.04, bevelEnabled: false }), cyM()); hm.rotation.x = Math.PI / 2; hm.position.y = 0.02; wrist.add(hm); }
    const ownTop = new THREE.Mesh(pgGeo, [pgSide, pgSide, pgTop, pgSide, pgSide, pgSide]); ownTop.position.copy(OWN_TOP); ownTop.rotation.y = 0.65; ownTop.castShadow = true; s0.add(ownTop);
    const handPage = new THREE.Mesh(pgGeo, [pgSide, pgSide, pgTop, pgSide, pgSide, pgSide]); handPage.position.set(0, -0.06, 0.3); handPage.castShadow = true; wrist.add(handPage);

    // ---------------- DOM ----------------
    const stamp = E.stampDOM(E.layer, [{ t: t2024, year: "2024", label: "Frontier lab" }, { t: t2026, year: "2026", label: "Frontier lab" }], tSoFar - 0.35);
    const src = E.srcDOM(E.layer, { big: "OpenAI · February 2026", small: "“our first model that was instrumental in creating itself”", inAt: tOpenAI, outAt: tAnd - 0.15 });
    const tag = lenaTag(E, [[tInvented, t2024 - 0.6], [tSoFar, tReal + 1.0]], tHerDay + 0.05, tReal);

    // ---------------- the closed flipbook (carrier out) ----------------
    // matches s04's opening book exactly: cover 4.36 wide, camera 8.67 in front, centre 0.2174 above the camera axis
    const BW = 4.2, BH = 3, COVER = "#2c3f63", SIG = (BW + 0.16) / WID;
    const BC = V(0.2, 3.3, 4.2); // book group origin + (BW/2, 0, 0) = cover centre
    const CAM_END = V(BC.x, BC.y - 0.2174, BC.z + 8.67), LOOK_END = V(BC.x, BC.y - 0.2174, BC.z);
    const book = new THREE.Group(); book.position.set(BC.x - BW / 2, BC.y, BC.z); book.visible = false; scene.add(book);
    { const back = E.box(BW + 0.16, BH + 0.16, 0.05, COVER); back.position.set(BW / 2 + 0.02, 0, -0.33); book.add(back);
      const blk = E.box(BW - 0.05, BH - 0.06, 0.2, "#ddd2bb"); blk.position.set(BW / 2, 0, -0.2); book.add(blk);
      const spine = E.box(0.12, BH + 0.16, 0.36, COVER); spine.position.set(-0.02, 0, -0.17); book.add(spine);
      const cv = E.extrude(E.roundRectShape(BW + 0.16, BH + 0.16, 0.08), COVER, 0.05); cv.position.set(BW / 2 + 0.02, 0, 0.01); book.add(cv);
      const emb = E.extrude(E.ringShape(0.36, 0.42), "#3a5078", 0.02); emb.position.set(BW / 2 + 0.02, 0.05, 0.065); book.add(emb);
      const dot = E.extrude(E.circleShape(0.14), "#3a5078", 0.02); dot.position.set(BW / 2 + 0.02, 0.05, 0.065); book.add(dot); }
    // the stack's top face gets the cover look while it stands up
    const coverTop = E.extrude(E.roundRectShape(WID, SL, 0.3), COVER, 0.02); coverTop.rotation.x = -Math.PI / 2; coverTop.visible = false;
    // measure the folded stack once (for an exact hand-over to the book)
    fold(Math.PI); POPS.forEach((p) => p.g.scale.set(1, 0.02, 1)); HALL.forEach((h) => { h.dm.visible = h.fm.visible = h.sm.visible = h.lm.visible = false; }); WALLG.rotation.x = 0; PG.rotation.x = -Math.PI / 2;
    H.updateMatrixWorld(true); let topY = 0; { const bb = new THREE.Box3(); SEG.forEach((s) => s.content.children.filter((c) => c.geometry === segGeo).forEach((m) => { bb.setFromObject(m); topY = Math.max(topY, bb.max.y); })); }
    { const last = SEG[NSEG - 1].content; coverTop.position.set(0, 0.012, -SL / 2); last.add(coverTop); }
    fold(0); HALL.forEach((h) => { h.dm.visible = h.fm.visible = h.sm.visible = h.lm.visible = true; });

    const tFold0 = tReal + 0.82;
    // ---------------- camera ----------------
    const camKeys = [
      { t: T0, p: PAGE_P.toArray(), l: PAGEC.toArray() },
      { t: tLets + 0.5, p: [0, 4.6, PAGE_P.z - 0.8], l: PAGEC.toArray(), ease: "smooth" },
      { t: tInvented + 0.9, p: [7.2, 9.4, 19.5], l: [-0.6, 2.2, -1.2], arc: 0.25 },
      { t: tLena - 0.2, p: [5.8, 7.6, 15.2], l: [-0.9, 2.5, -1.0], ease: "sine" },
      { t: t2024 - 0.3, p: [3.6, 5.2, 11.4], l: [-0.8, 2.7, -0.8], ease: "sine" },
      { t: tCoffee - 0.2, p: [1.9, 4.1, 6.9], l: [-0.5, 2.25, -0.5], ease: "sine" },
      { t: t2026 - 0.2, p: [0.9, 3.85, 6.1], l: [-0.6, 2.2, -0.6], ease: "sine" },
      { t: tReads + 0.6, p: [4.7, 4.9, 9.6], l: [-0.3, 2.65, -0.7] },
      { t: tGuess + 0.2, p: [3.9, 4.7, 8.8], l: [-0.2, 2.7, -0.8], ease: "sine" },
      { t: tInstr - 1.3, p: [-3.6, 4.9, 7.0], l: [1.6, 2.75, -0.7], arc: 0.3 },
      { t: tAnd - 0.1, p: [-3.0, 4.6, 6.2], l: [1.8, 2.7, -0.8], ease: "sine" },
      { t: tIntern + 1.4, p: [8.5, 12.5, 19.5], l: [0, 1.5, -26], arc: 0.2 },
      { t: tDays + 0.4, p: [6.2, 14.5, 23], l: [0, 0.5, -46], ease: "sine" },
      { t: tSoFar + 1.6, p: [6.4, 6.2, 13.6], l: [-0.8, 2.9, -4.5], arc: 0.25 },
      { t: tFold0, p: [5.4, 5.8, 12.6], l: [-0.6, 2.9, -4.0], ease: "sine" },
      { t: T1, p: CAM_END.toArray(), l: LOOK_END.toArray(), ease: "inOut" },
    ];

    // sanitize normals: degenerate edges (duplicate outline points) give NaN normals, which bloom into a white blob
    scene.traverse((o) => { const n = o.geometry && o.geometry.attributes.normal; if (!n) return; const a = n.array; for (let i = 0; i < a.length; i += 3) if (!(isFinite(a[i]) && isFinite(a[i + 1]) && isFinite(a[i + 2]))) { a[i] = 0; a[i + 1] = 0; a[i + 2] = 1; } });
    const post = { bloom: 0.4, exposure: 1.15 };
    const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), q1 = new THREE.Quaternion();

    return {
      scene, camera, post,
      update(t) {
        st.update(t); cityL.update(t); far.position.x = 0.4 * Math.sin(t * 0.13);

        // --- page tips back, office pops up on it ---
        const tip = lin(tLets + 0.25, tLets + 1.25, t); const tipE = tip < 1 ? tip * tip * (3 - 2 * tip) : 1;
        const land = tip >= 1 ? 0.03 * Math.exp(-7 * (t - tLets - 1.25)) * Math.sin(16 * (t - tLets - 1.25)) : 0;
        PG.rotation.x = -Math.PI / 2 * Math.min(1, tipE * tipE * 1.0 + 0.0) + land;
        pct.draw(Math.min(t, tLets + 0.6), tTick0); const pdim = lerp(REPORT.REP_EMI, 0.07, smooth(tLets + 1.1, tLets + 2.6, t)); repMat.emissiveIntensity = pdim; pct.mesh.material.emissiveIntensity = pdim;
        const fdown = (i) => inOut(lin(tFold0 - 0.25 + i * 0.012, tFold0 + 0.12 + i * 0.012, t));
        POPS.forEach((p, i) => { const up = spring(lin(p.at, p.at + p.dur, t)); const dn = fdown(i); p.g.visible = t >= p.at - 0.02;
          p.g.scale.set(1, Math.max(0.02, up * (1 - dn)), 1); p.g.rotation.z = 0.004 * Math.sin(t * (0.6 + i * 0.1) + i) * up; });

        // --- the wall falls back on "research intern" (antic: it leans in first) ---
        const wA = smooth(tAnd + 0.1, tIntern, t) * (1 - smooth(tIntern, tIntern + 0.15, t)) * 0.05;
        const fall = lin(tIntern + 0.05, tIntern + 0.75, t); const fallE = fall * fall;
        const bounce = fall >= 1 ? 0.06 * Math.exp(-6 * (t - tIntern - 0.75)) * Math.abs(Math.sin(12 * (t - tIntern - 0.75))) : 0;
        WALLG.rotation.x = Math.PI / 2 * (1 - fallE) + wA + bounce;
        winG.scale.z = 1; winG.visible = fall < 0.98;

        // --- hall rows: lights switch on row by row, figures pop up ---
        let litFront = 0;
        HALL.forEach((h) => { let dirty = false;
          h.items.forEach((it, i) => { const up = spring(lin(it.tr, it.tr + 0.55, t)); const dn = inOut(lin(tFold0 - 0.3 + (12 - h.k) * 0.01, tFold0 + 0.05 + (12 - h.k) * 0.01, t)); const s = Math.max(0.001, up * (1 - dn));
            const on = smooth(it.tr - 0.05, it.tr + 0.12, t);
            _d.position.set(it.x + 0.25, 0, it.z); _d.rotation.set(0, 0, 0); _d.scale.set(1, s, 1); _d.updateMatrix(); h.dm.setMatrixAt(i, _d.matrix);
            _d.position.set(it.x - 0.95, 0, it.z + 0.05 * Math.sin(t * 2 + i)); _d.scale.set(1, s, 1); _d.rotation.set(0, 0, 0.02 * Math.sin(t * 1.7 + i * 1.3)); _d.updateMatrix(); h.fm.setMatrixAt(i, _d.matrix);
            _c.set(C.cyan).multiplyScalar((0.25 + 0.75 * on) * (1 - 0.7 * dn)); h.fm.setColorAt(i, _c);
            _d.position.set(it.x + 0.3, 0.82 * s + 0.2 * s, it.z - 0.12); _d.rotation.set(0, -0.6, 0); _d.scale.set(1, s, 1); _d.updateMatrix(); h.sm.setMatrixAt(i, _d.matrix);
            _c.set(C.cyanPale).multiplyScalar(0.05 + 1.2 * on * (0.9 + 0.1 * Math.sin(t * 7 + i))); h.sm.setColorAt(i, _c); });
          h.tr.forEach((tr, j) => { const on = smooth(tr - 0.06, tr + 0.06, t); const flick = tr < t && t < tr + 0.18 ? (Math.sin((t - tr) * 90) > 0 ? 1 : 0.3) : 1; const dn = inOut(lin(tFold0 - 0.3, tFold0 + 0.05, t));
            _d.position.set(0, 3.1 * (1 - dn) + 0.05, ROWZ[j] + 0.1); _d.rotation.set(0, 0, 0); _d.scale.set(1, 1, 1); _d.updateMatrix(); h.lm.setMatrixAt(j, _d.matrix);
            _c.set(C.cyan).multiplyScalar((0.03 + 1.05 * on * flick) * (1 - 0.85 * dn)); h.lm.setColorAt(j, _c); if (on > 0.5) litFront = Math.max(litFront, h.k); });
          [h.dm, h.fm, h.sm, h.lm].forEach((m) => { m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true; });
          const any = t > h.tr[0] - 0.1 && t < tFold0 + 0.12; h.fm.visible = h.sm.visible = h.dm.visible = any; h.lm.visible = t < tFold0 + 0.12; });
        hallLights.forEach((hl, i) => { const reach = smooth(tRow0 + i * 1.6, tRow0 + i * 1.6 + 1.2, t) * (1 - smooth(tFold0 - 0.2, tFold0 + 0.3, t)); hl.l.intensity = 40 * reach * (1 + 0.04 * Math.sin(t * 3 + i)); });

        // --- Lena ---
        const typing = smooth(tWrote - 0.2, tWrote + 0.3, t) * (1 - smooth(t2026 - 0.1, t2026 + 0.5, t));
        const reading = smooth(t2026, tReads + 0.4, t);
        const tap = Math.max(0, Math.sin(Math.PI * clamp((t - tChecks) / 0.22, 0, 1))) + Math.max(0, Math.sin(Math.PI * clamp((t - tChecks - 0.3) / 0.22, 0, 1)));
        const startle = smooth(tInstr - 0.2, tInstr + 0.6, t) * (1 - smooth(tAnd + 0.4, tAnd + 1.4, t));
        lena.userData.pose(t, {
          lean: 0.25 * smooth(tLena - 0.3, tLena + 0.6, t) - 0.35 * reading - 0.25 * startle + 0.12 * typing,
          reach: 0.35 + 0.42 * typing + 0.05 * typing * Math.sin(t * 19) * Math.sin(t * 5.3) + 0.15 * reading - 0.12 * tap,
          lookUp: -0.12 + 0.3 * smooth(tLena - 0.2, tLena + 0.5, t) - 0.25 * typing - 0.2 * reading * (1 - startle) + 0.25 * startle - 0.2 * smooth(tHerDay, tReal, t),
        });
        // pencil: lies on the desk (planted in 2024), picked up as she starts to read
        lena.updateMatrixWorld(true); const hand = lena.userData.hand; hand.getWorldPosition(v1); s0.worldToLocal(v1);
        const deskP = deskW(0.1, 0.7).add(V(0, 0.035, 0)); const pk = inOut(lin(tReads - 0.45, tReads + 0.05, t));
        pencil.position.copy(deskP).lerp(v1, pk); pencil.position.y += 0.18 * Math.sin(Math.PI * pk);
        pencil.rotation.set(Math.PI / 2 * (1 - pk), 0.3 * (1 - pk), lerp(Math.PI / 2, -0.5, pk) + 0.15 * tap * pk);
        pencil.visible = POPS[0].g.scale.y > 0.3;

        // --- screen ---
        drawScreen(scG, t, { tLena, t2024, tBlank, tHands, t2026, tAIw, tInstr });
        scTex.needsUpdate = true;
        const pw = t < tLena - 0.25 ? 0.35 : t < tLena + 0.2 ? (Math.sin((t - tLena) * 70) > 0 ? 1 : 0.3) : 1;
        const scK = (0.55 + 0.35 * smooth(t2026 - 0.2, t2026 + 0.6, t)) * pw;
        screen.material.color.setScalar(scK * POPS[3]?.g.scale.y);
        screen.getWorldPosition(v1); MON.getWorldDirection(v2); monLight.position.copy(v1).addScaledVector(v2, 1.0);
        monLight.intensity = (2.5 + 5 * smooth(t2026 - 0.2, t2026 + 0.8, t)) * scK * (1 + 0.05 * Math.sin(t * 11)) * (POPS[3]?.g.scale.y || 0);
        // lamp
        LAMP.updateMatrixWorld(true); shade.getWorldPosition(v1); spot.position.copy(v1); kb.getWorldPosition(v2); spot.target.position.copy(v2).add(V(-0.3, 0, 0.2));
        const lampOn = smooth(tPop + 0.5, tPop + 0.8, t) * (1 - smooth(tFold0 - 0.1, tFold0 + 0.3, t));
        const fl = 1 + 0.025 * Math.sin(t * 12.7) * Math.sin(t * 4.1);
        spot.intensity = 11 * lampOn * fl * (1 - 0.25 * smooth(t2026, t2026 + 1, t)); warm.position.copy(v1).add(V(0.3, -0.4, 0.5)); warm.intensity = 1.0 * lampOn * fl;
        shade.userData.bulb.material.color.set("#fff1d6").multiplyScalar(0.12 + 0.88 * lampOn); shade.userData.inner.material.color.set("#ffcf8f").multiplyScalar(0.1 + 0.9 * lampOn);
        pageLight.intensity = 22 * (1 - smooth(tLets + 0.3, tLets + 1.4, t));
        // steam
        steam.forEach((m, i) => { const ph = ((t * 0.45 + i / 3) % 1); const k = smooth(tPop + 1, tCoffee, t) * 0.35 + smooth(tCoffee - 0.2, tCoffee + 0.4, t) * 0.4 * (1 - smooth(t2026, t2026 + 2, t));
          m.position.set(0.02 * Math.sin(t * 2 + i), 0.4 + ph * 0.5, -0.04 + i * 0.04); m.scale.set(1 + ph * 0.6, 0.6 + ph * 0.7, 1); m.rotation.y = i * 1.1 + t * 0.4; m.material.opacity = k * Math.sin(Math.PI * ph); });

        // --- pages ---
        const mon = new THREE.Vector3(); screen.getWorldPosition(mon); s0.worldToLocal(mon);
        const kbL = new THREE.Vector3(); kb.getWorldPosition(kbL); s0.worldToLocal(kbL);
        PAGES.forEach((p, i) => { const k = lin(p.te, p.te + 0.55, t); const dn = fdown(2);
          if (t < p.te) { _d.scale.setScalar(0); }
          else { const from = p.src === "kb" ? kbL.clone().add(V(0.0, 0.06, -0.1)) : mon.clone().add(V(-0.25, -0.2, 0.25)); const e = sineInOut(k);
            _d.position.copy(from).lerp(p.land, e); _d.position.y += (p.src === "kb" ? 0.55 : 0.4) * Math.sin(Math.PI * e);
            _d.rotation.set(0.5 * (1 - e) * (p.src === "kb" ? -1 : 1), p.yaw * e + (1 - e) * 0.8, 0.3 * Math.sin(Math.PI * e)); _d.scale.set(1, Math.max(0.02, 1 - dn), 1); }
          _d.updateMatrix(); pages.setMatrixAt(i, _d.matrix); });
        pages.instanceMatrix.needsUpdate = true;
        pages.visible = POPS[0].g.scale.y > 0.05;

        // --- the hand out of the screen ---
        { MON.updateMatrixWorld(true); screen.getWorldPosition(v1); MON.getWorldDirection(v2); handClip.setFromNormalAndCoplanarPoint(v2, v1.clone().addScaledVector(v2, 0.0));
          const out = smooth(tInstr - 0.4, tInstr + 0.5, t) * (1 - smooth(tItself + 0.45, tItself + 1.15, t));
          const reachK = smooth(tInstr + 0.2, tItself - 0.15, t) * (1 - smooth(tItself + 0.3, tItself + 0.9, t));
          ARM.visible = out > 0.001; ARM.position.set(0.15, 0.9, lerp(-1.9, 0.08, out));
          ARM.rotation.set(0.12 + 0.35 * reachK, 0.35 + 0.55 * reachK, 0);
          elbow.rotation.set(0.25 + 0.6 * reachK, 0.35 + 0.55 * reachK, 0);
          wrist.rotation.set(-0.45 * reachK - 0.1, 0.0, 0.08 * Math.sin(t * 3));
          const rel = t > tItself; handPage.visible = !rel && ARM.visible; }
        // released page joins its own stack
        ownTop.visible = t > tItself - 0.02 && POPS[0].g.scale.y > 0.3; ownTop.scale.y = Math.max(0.02, 1 - fdown(2));

        // --- fold the hall into the flipbook ---
        const gS = inOut(lin(tFold0 - 0.1, tFold0 + 0.55, t)); // shrink the whole set into a paper model
        const phi = inOut(lin(tFold0 + 0.25, tFold0 + 0.85, t)); fold(Math.PI * phi);
        const gR = inOut(lin(tFold0 + 0.7, T1 - 0.06, t)); // the folded stack stands up: its top becomes the cover
        const Pm = V(BC.x + BW / 2 - BW / 2, BC.y - 1.7, BC.z - 1.2), Pf = V(BC.x, BC.y, BC.z + 0.06 - topY * SIG);
        H.scale.setScalar(lerp(1, SIG, gS)); H.rotation.x = Math.PI / 2 * gR;
        H.position.set(0, 0, 0).lerp(Pm, gS).lerp(Pf, gR);
        coverTop.visible = phi > 0.9; coverTop.material[0].opacity = 1;
        const swap = t >= T1 - 0.05; H.visible = !swap; book.visible = swap; book.rotation.z = 0.003 * Math.sin(t * 0.7);

        // --- camera ---
        const cam = E.camPath(camKeys, t, { arc: 0.1, drift: 0.8, push: 0.4, seed: 5 });
        const kSt = 1 - smooth(T0, T0 + 1.3, t); if (kSt > 0) { cam.p.lerp(PAGE_P.clone().add(V(0, 0, -0.3 * (t - T0))), kSt); cam.l.lerp(PAGEC, kSt); }
        const kEnd = smooth(T1 - 0.9, T1, t); cam.p.lerp(CAM_END, kEnd); cam.l.lerp(LOOK_END, kEnd);
        E.applyCam(camera, cam, 0.008 * Math.sin(t * 0.29) * (1 - kEnd) * (1 - kSt));
        post.bloom = 0.42 + 0.25 * smooth(tRow0, tDays, t) * (1 - smooth(tFold0, tFold0 + 0.6, t));

        // --- DOM ---
        stamp.update(t); src.update(t);
        lena.updateMatrixWorld(true); lena.userData.headG.getWorldPosition(v1); const pr = E.project(v1, camera); tag.update(t, pr.x + 120, pr.y - 70);
      },
    };
  },
};

// screen: 2024 blank file → her typing (cream); 2026 machine code streaming (cyan)
function drawScreen(g, t, T) {
  const w = 512, h = 320; g.fillStyle = "#0a1424"; g.fillRect(0, 0, w, h);
  g.fillStyle = "#0e1c33"; g.fillRect(0, 0, w, 22); g.fillStyle = "rgba(111,227,255,0.5)"; g.fillRect(10, 8, 30, 6);
  const lineH = 16, rnd = (i) => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };
  if (t < T.t2024) { for (let i = 0; i < 16; i++) { g.fillStyle = `rgba(111,227,255,${0.25 + 0.2 * rnd(i)})`; g.fillRect(40 + Math.floor(rnd(i + 9) * 4) * 14, 34 + i * lineH, 60 + rnd(i + 3) * 220, 6); } return; }
  if (t < T.t2026) { // 2024: a blank file, then her lines (amber caret = human)
    const blank = t > T.tBlank - 0.1; g.fillStyle = "rgba(216,247,255,0.18)"; for (let i = 0; i < 17; i++) g.fillRect(12, 34 + i * lineH, 14, 6);
    const n = blank ? Math.floor(Math.max(0, t - T.tHands + 0.6) * 2.4) : 14;
    for (let i = 0; i < Math.min(n, 17); i++) { g.fillStyle = blank ? "rgba(243,239,226,0.8)" : "rgba(111,227,255,0.35)"; g.fillRect(40 + Math.floor(rnd(i + 20) * 3) * 14, 34 + i * lineH, 40 + rnd(i + 30) * 200, 6); }
    const cy = 34 + Math.min(n, 16) * lineH; if (Math.sin(t * 9) > -0.2) { g.fillStyle = "#ffb35c"; g.fillRect(40 + (n ? 0 : 0), cy - 3, 4, 12); }
    return; }
  // 2026: code streams upward, written by the machine (cyan caret racing)
  const sp = 9 + 6 * Math.min(1, Math.max(0, t - T.tAIw)); const off = (t - T.t2026) * sp * lineH;
  const first = Math.floor(off / lineH);
  for (let i = 0; i < 19; i++) { const idx = first + i; const y = 34 + i * lineH - (off % lineH);
    g.fillStyle = idx % 7 === 3 ? "rgba(255,255,255,0.75)" : `rgba(111,227,255,${0.55 + 0.35 * rnd(idx)})`; g.fillRect(40 + Math.floor(rnd(idx + 5) * 4) * 14, y, 40 + rnd(idx + 1) * 260, 6); }
  g.fillStyle = "#d8f7ff"; g.fillRect(40 + (t * 400) % 300, 34 + 17 * lineH - 3, 6, 12);
}

// "Lena" tag with a cream slip "constructed" that peels off and flutters away (DOM, paper-like)
function lenaTag(E, wins, peelAt, detachAt) {
  const d = document.createElement("div"); d.style.cssText = "position:absolute;left:0;top:0;font-family:Inter,sans-serif;white-space:nowrap;perspective:900px";
  d.innerHTML = `<div class="rule" style="position:absolute;left:-132px;top:15px;width:116px;height:1px;background:${E.C.amber};transform-origin:100% 50%"></div>
    <span style="display:block;overflow:hidden"><span class="tt" style="display:inline-block;color:${E.C.amberSoft};font-size:26px;letter-spacing:0.04em">Lena</span></span>
    <span style="display:block;overflow:hidden;padding:4px 30px 30px 0;margin:-4px -30px -30px 0"><span class="sl" style="display:inline-block;margin-top:8px;background:#efe6d2;color:#1f1d26;font-size:15px;letter-spacing:0.24em;text-transform:uppercase;padding:5px 10px 5px 12px;transform-origin:0% 50%;backface-visibility:visible">Constructed</span></span>`;
  E.layer.appendChild(d); const rule = d.querySelector(".rule"), tt = d.querySelector(".tt"), sl = d.querySelector(".sl"), slWrap = sl.parentElement;
  return { update(t, x, y) {
    let k = 0, o = 0, inA = -1; for (const [a, b] of wins) { if (t >= a - 0.05 && t < b + 0.7) { inA = a; k = E.expoOut(E.lin(a, a + 0.8, t)); o = E.smooth(b, b + 0.5, t); } }
    d.style.visibility = inA < 0 ? "hidden" : "visible"; d.style.left = `${x}px`; d.style.top = `${y}px`;
    rule.style.transform = `scaleX(${k * (1 - o)})`;
    const k1 = E.expoOut(E.lin(inA + 0.12, inA + 0.9, t)), k2 = E.expoOut(E.lin(inA + 0.3, inA + 1.1, t));
    tt.style.transform = `translateY(${(1 - k1) * 110 - o * 110}%)`;
    if (t < peelAt || inA < peelAt - 10) { slWrap.style.overflow = "hidden"; sl.style.transform = `translateY(${(1 - k2) * 130 - o * 130}%)`; return; }
    // peel: the slip's free corner lifts, then it detaches on "real" and flutters up and away
    slWrap.style.overflow = "visible";
    const lift = E.smooth(peelAt, detachAt, t); const u = Math.max(0, t - detachAt);
    const tx = 240 * u + 26 * Math.sin(u * 5.2) * Math.min(1, u * 3), ty = -40 * lift - 190 * u - 120 * u * u + 18 * Math.sin(u * 7.1);
    const rz = -6 * lift + 55 * u + 22 * Math.sin(u * 4.3), rx = 28 * lift + 160 * u * (0.6 + 0.4 * Math.sin(u * 3.1)), ry = 70 * Math.sin(u * 2.6);
    sl.style.transform = `translate(${tx}px, ${ty}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${1 - 0.15 * Math.min(1, u)})`;
  } };
}
