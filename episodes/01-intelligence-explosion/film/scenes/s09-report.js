// s09 · REPORT (solution 1: report near misses like aviation does). Dawn palette.
// Carrier in: runway horizon at 60 % frame height under the dawn sky (matches s08's bench edge).
// Beats: two paper planes on one path toward a dark ridge (TWA fades into the shadow, United pulls up) ->
// the United pilot's note stays in the cockpit -> 1976: a mailbox fed by many tiny cockpits ->
// WOW: the mailbox grows into a paper archive under calm arcs of planes -> push into its drawers, which become
// the drawers of a lab tower where amber figures catalogue them (one cyan drawer comes forward) ->
// a card flies to a calendar that tears off 15 pages -> the pages blow on to a paper sieve: small notes fall
// through, one big note is caught. Carrier out: the caught cream note fills ~60 % of the frame width, centred.
export default {
  build(E, def) {
    const { THREE, C, PAL, rng, clamp, lin, smooth, lerp, expoOut, inOut, sineInOut, spring, wob } = E;
    const pal = PAL.dawn;
    const at = (p, n) => E.at("solutions", p, n), en = (p, n) => E.end("solutions", p, n);
    const T = {
      first: at("First"), y74: at("1974"), twa: at("TWA"), mountain: at("mountain"), six: at("Six weeks"), pulled: at("pulled up"),
      nobody: at("Nobody"), heard: at("heard"), itEnd: en("about it"), y76: at("1976"), america: at("America"), report: at("report"),
      two: at("two million"), since: en("since"), ai: at("AI has taken"), hugging: at("Hugging"), july: at("July"), forward: at("forward"),
      california: at("California"), fifteen: at("fifteen"), days: en("fifteen days"), limits: at("The limits"), narrow: at("narrow"),
      many: at("Many near"), outsiders: at("outsiders"), full: at("full logs"), july2: at("July", 2),
    };
    const tSwap = T.hugging - 0.32; // camera is inside the drawer wall: airport -> lab

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(pal.clear);
    scene.fog = new THREE.Fog("#c4808a", 45, 210);
    const camera = E.newCamera();
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

    // ---------- sky, sun, floor ----------
    // sky dome (follows the camera): equator = horizon (peach), zenith = dawn violet
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
    sunDisc.renderOrder = halo.renderOrder = -1;
    const floorTex = E.paperTex.clone(); floorTex.repeat.set(90, 80); floorTex.needsUpdate = true;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(1200, 900), new THREE.MeshStandardMaterial({ color: "#5e4160", map: floorTex, roughness: 0.96 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(20, 0, -250); floor.receiveShadow = true; scene.add(floor);

    // ---------- lights ----------
    const hemi = new THREE.HemisphereLight("#ffd2b8", "#3a2840", 1.05); scene.add(hemi);
    const key = new THREE.DirectionalLight("#ffd6a4", 2.7); key.castShadow = true; key.shadow.mapSize.set(2048, 2048); key.shadow.radius = 5; key.shadow.bias = -0.0005; key.shadow.normalBias = 0.04;
    Object.assign(key.shadow.camera, { left: -34, right: 34, top: 30, bottom: -24, near: 1, far: 160 }); scene.add(key, key.target);
    const fill = new THREE.DirectionalLight("#c9a6d8", 0.55); scene.add(fill, fill.target);
    const cockpitLight = E.pointLight("#ffb35c", 0, 3.5); scene.add(cockpitLight);
    const slotLight = E.pointLight("#ffb35c", 0, 9); scene.add(slotLight);
    const cyanLight = E.pointLight(C.cyan, 0, 7); scene.add(cyanLight);

    // ---------- airport set (visible until the drawer swap) ----------
    const air = new THREE.Group(); scene.add(air);
    const pm = (hex, o) => E.paperMat(hex, o);
    const runway = new THREE.Mesh(new THREE.BoxGeometry(6, 0.05, 130), pm("#44304a")); runway.position.set(0, 0.025, -55); runway.receiveShadow = true; air.add(runway);
    { const d = new THREE.Object3D(); const im = new THREE.InstancedMesh(new THREE.BoxGeometry(0.28, 0.06, 2.4), pm("#efe6d2"), 24);
      for (let k = 0; k < 24; k++) { d.position.set(0, 0.04, 6 - k * 5.4); d.updateMatrix(); im.setMatrixAt(k, d.matrix); } im.receiveShadow = true; air.add(im);
      const th = new THREE.InstancedMesh(new THREE.BoxGeometry(0.34, 0.06, 1.8), pm("#efe6d2"), 8);
      for (let k = 0; k < 8; k++) { d.position.set(-2.4 + k * 0.68 + (k > 3 ? 0.4 : 0) - 0.2, 0.04, 9.2); d.updateMatrix(); th.setMatrixAt(k, d.matrix); } air.add(th); }
    // runway edge lights: amber, chasing toward the horizon
    const NL = 30; const rLights = new THREE.InstancedMesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({ color: "#ffffff" }), NL * 2);
    { const d = new THREE.Object3D(); for (let k = 0; k < NL; k++) for (let s = 0; s < 2; s++) { d.position.set(s ? 3.4 : -3.4, 0.12, 10 - k * 4.4); d.updateMatrix(); rLights.setMatrixAt(k * 2 + s, d.matrix); rLights.setColorAt(k * 2 + s, new THREE.Color("#ffb35c")); } air.add(rLights); }
    // control tower
    const ctower = new THREE.Group(); ctower.position.set(-9.5, 0, -12); air.add(ctower);
    { const shaft = E.extrude(E.polyShape([[-0.75, 0], [0.75, 0], [0.55, 7], [-0.55, 7]]), "#7a4f70", 1.2); shaft.position.z = -0.6; ctower.add(shaft);
      const cab = E.extrude(E.polyShape([[-1.6, 0], [1.6, 0], [1.9, 1.5], [-1.9, 1.5]]), "#603f5f", 2.4); cab.position.set(0, 7, -1.2); ctower.add(cab);
      const win = E.glowPlane(3.1, 0.62, "#ffb35c"); win.position.set(0, 7.85, 1.22); win.userData.setGlow(1.25); ctower.add(win); ctower.userData.win = win;
      const roof = E.extrude(E.polyShape([[-2.1, 0], [2.1, 0], [1.4, 0.45], [-1.4, 0.45]]), "#4d3350", 2.8); roof.position.set(0, 8.5, -1.4); ctower.add(roof);
      const ant = E.box(0.08, 1.6, 0.08, "#3a2740"); ant.position.set(0.6, 9.7, 0); ctower.add(ant);
      const bcn = E.glowPlane(0.22, 0.22, "#ffb35c"); bcn.position.set(0.6, 10.55, 0.06); ctower.add(bcn); ctower.userData.bcn = bcn; }
    // hangars (arched paper sheds) with warm door slits
    const hangar = (x, z, w, h, hex) => { const g = new THREE.Group(); g.position.set(x, 0, z); air.add(g);
      const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(-w / 2, h * 0.55); s.quadraticCurveTo(0, h * 1.35, w / 2, h * 0.55); s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0);
      const m = E.extrude(s, hex, 5); m.position.z = -5; g.add(m);
      const door = E.glowPlane(w * 0.56, h * 0.5, "#ffb35c"); door.position.set(0, h * 0.25, 0.02); door.userData.setGlow(0.55); g.add(door); g.userData.door = door; return g; };
    const hg1 = hangar(16, -24, 7, 4.2, "#7a4f70"), hg2 = hangar(23.5, -30, 8, 4.8, "#94627e");
    // hills (horizon) and the dark ridge
    const hills = (z, y0, y1, hex, seed, x0 = -260, x1 = 300) => { const r = rng(seed); const s = new THREE.Shape(); s.moveTo(x0, -1); let x = x0;
      while (x < x1) { const w = 8 + r() * 18; s.quadraticCurveTo(x + w * 0.5, y0 + r() * (y1 - y0) * 2, x + w, y0 + r() * (y1 - y0)); x += w; } s.lineTo(x1, -1); s.lineTo(x0, -1);
      const m = E.extrude(s, hex, 0.5, { segments: 8 }); m.position.z = z; m.castShadow = false; air.add(m); return m; };
    hills(-120, 1.2, 4.2, "#b9798a", 21); hills(-96, 0.6, 2.8, "#9c6683", 22); hills(-78, 0.3, 1.6, "#835574", 23);
    const ridge = E.extrude(E.polyShape([[6, -0.5], [11, 2.6], [15, 4.2], [18.5, 7.4], [22, 9.6], [25.5, 11.2], [28, 10.2], [31, 11.6], [34.5, 8.8], [38, 7.2], [42, 4.4], [47, 2.2], [53, -0.5]]), "#3e2a45", 1.6, { segments: 4 });
    ridge.position.z = -39.6; ridge.castShadow = false; air.add(ridge);
    const ridgeBack = E.extrude(E.polyShape([[18, -0.5], [26, 7], [33, 13.8], [38, 12.4], [44, 15.2], [52, 9], [60, -0.5]]), "#5a3c5c", 1.2, { segments: 4 }); ridgeBack.position.z = -50; ridgeBack.castShadow = false; air.add(ridgeBack);
    // ground crew figure by the tower (waves the planes off)
    const crew = E.figure({ pose: "stand", hair: "short", hex: "#3a2232", seed: 3 }); crew.scale.setScalar(0.9); crew.position.set(-5.2, 0, -6); air.add(crew);

    // ---------- paper planes ----------
    const fuseShape = (hole) => { const s = new THREE.Shape(); s.moveTo(2.0, 0.02); s.quadraticCurveTo(1.98, 0.3, 1.45, 0.32); s.lineTo(-1.25, 0.32); s.lineTo(-1.8, 1.05); s.lineTo(-2.12, 1.05);
      s.lineTo(-1.98, 0.22); s.quadraticCurveTo(-1.6, -0.12, -0.9, -0.24); s.lineTo(1.35, -0.26); s.quadraticCurveTo(1.98, -0.22, 2.0, 0.02);
      if (hole) { const h = new THREE.Path(); h.moveTo(1.08, -0.04); h.lineTo(1.08, 0.26); h.lineTo(1.56, 0.26); h.lineTo(1.8, -0.04); h.lineTo(1.08, -0.04); s.holes.push(h); } return s; };
    const exG = (s, d) => { const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: 10 }); return g; };
    const fuseGeo = exG(fuseShape(false), 0.44); fuseGeo.translate(0, 0, -0.22);
    const fuseGeoH = exG(fuseShape(true), 0.44); fuseGeoH.translate(0, 0, -0.22);
    const wingGeo = exG(E.polyShape([[0.35, 0], [-0.55, 2.0], [-0.9, 2.0], [-0.55, 0], [-0.9, -2.0], [-0.55, -2.0]]), 0.05); wingGeo.rotateX(-Math.PI / 2); wingGeo.translate(0, -0.1, 0);
    const tailGeo = exG(E.polyShape([[-1.7, 0], [-2.05, 0.75], [-2.2, 0.75], [-2.05, 0], [-2.2, -0.75], [-2.05, -0.75]]), 0.04); tailGeo.rotateX(-Math.PI / 2); tailGeo.translate(0, 0.3, 0);
    const mkPlane = ({ hole = false, stripe = "#4d3350", body = "#efe6d2", scale = 0.8 }) => {
      const g = new THREE.Group(); const inner = new THREE.Group(); inner.scale.setScalar(scale); g.add(inner);
      const mats = E.paperMats(body); const sm = E.paperMat(stripe);
      [new THREE.Mesh(hole ? fuseGeoH : fuseGeo, mats), new THREE.Mesh(wingGeo, mats), new THREE.Mesh(tailGeo, mats)].forEach((m) => { m.castShadow = true; m.receiveShadow = true; inner.add(m); });
      const st = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.07, 0.452), sm); st.position.set(-0.42, -0.08, 0); inner.add(st);
      const tailS = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.32, 0.452), sm); tailS.position.set(-1.95, 0.72, 0); inner.add(tailS);
      return { g, inner, mats: [...mats, sm] };
    };
    const twa = mkPlane({ stripe: "#5a3c5c" }); air.add(twa.g);
    twa.mats.forEach((m) => { m.transparent = true; m.userData.c0 = m.color.clone(); });
    const uni = mkPlane({ hole: true, stripe: "#3a2a55" }); scene.add(uni.g);
    // cockpit: amber glow + seated pilot holding a paper note (seen through the window hole)
    const ckMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffb35c").multiplyScalar(1.1) });
    const ckGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45), ckMat); ckGlow.position.set(1.42, 0.11, -0.15); uni.inner.add(ckGlow);
    const ckGlow2 = ckGlow.clone(); ckGlow2.position.z = 0.15; ckGlow2.rotation.y = Math.PI; uni.inner.add(ckGlow2);
    const pilot = E.figure({ pose: "sit", hair: "short", hex: "#2a1622", seed: 9 }); pilot.userData.mat.side = THREE.DoubleSide; pilot.scale.setScalar(0.15); pilot.position.set(1.12, -0.16, 0.0); uni.inner.add(pilot);
    const pNote = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.55), new THREE.MeshBasicMaterial({ color: "#fff8ec", side: THREE.DoubleSide })); pNote.position.set(0.16, 0.14, 0.03); pNote.rotation.z = 0.3; pilot.userData.hand.add(pNote);
    // flight path trail (the shared path): dashes laid along the TWA curve
    const pathPts = [V3(0, 0.5, -6), V3(0, 0.5, -12), V3(0, 0.56, -18), V3(1.2, 1.9, -24), V3(5.5, 3.9, -29.5), V3(12, 5.1, -34), V3(17.6, 5.6, -36.5), V3(19.6, 5.7, -37.4)];
    const curveA = new THREE.CatmullRomCurve3(pathPts, false, "centripetal");
    const ND = 54; const trail = new THREE.InstancedMesh(new THREE.BoxGeometry(0.34, 0.05, 0.05), new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.9, fog: true }), ND);
    trail.frustumCulled = false; air.add(trail);
    const uniPts = [[T.six + 0.25, 0, 0.5, -6], [T.six + 1.15, 0, 0.5, -12], [T.six + 1.9, 0, 0.56, -18], [T.six + 2.5, 1.2, 1.9, -24], [T.six + 3.05, 5.5, 3.9, -29.5], [T.six + 3.5, 12, 5.1, -34],
      [T.pulled - 0.02, 17.0, 5.7, -36.0], [T.pulled + 0.42, 20.6, 9.6, -36.6], [T.pulled + 0.95, 25.5, 13.4, -33.2], [T.pulled + 1.5, 28.6, 13.6, -24.5], [T.pulled + 2.05, 25.8, 11.4, -14.5],
      [T.nobody + 0.15, 21.2, 9.6, -6.8], [T.nobody + 1.25, 18.6, 9.1, -2.6], [T.y76, 16.2, 8.9, 0.6], [T.y76 + 1.0, 11.5, 9.6, 4.2], [T.y76 + 2.2, 1, 11.8, 4.6], [T.y76 + 3.6, -14, 14.5, 0], [T.y76 + 5, -30, 17, -8]];
    const curveU = new THREE.CatmullRomCurve3(uniPts.map((q) => V3(q[1], q[2], q[3])), false, "centripetal");
    const uParam = (t) => { const n = uniPts.length; if (t <= uniPts[0][0]) return 0; for (let i = 0; i < n - 1; i++) if (t < uniPts[i + 1][0]) return (i + lin(uniPts[i][0], uniPts[i + 1][0], t)) / (n - 1); return 1; };
    const orient = (obj, dir, roll = 0) => { const h = Math.hypot(dir.x, dir.z); obj.rotation.set(roll, Math.atan2(-dir.z, dir.x), Math.atan2(dir.y, h), "YZX"); };
    const yawOf = (d) => Math.atan2(-d.z, d.x);

    // tiny planes of the reporting system (instanced), each on a calm orbit around the mailbox
    const MB = V3(12, 0, -2);
    const NP = 16; const tpF = new THREE.InstancedMesh(fuseGeo, pm("#f1e7d4"), NP), tpW = new THREE.InstancedMesh(wingGeo, pm("#f1e7d4"), NP), tpT = new THREE.InstancedMesh(tailGeo, pm("#f1e7d4"), NP);
    [tpF, tpW, tpT].forEach((m) => { m.castShadow = true; m.frustumCulled = false; scene.add(m); });
    const tpr = rng(77); const TP = [...Array(NP)].map((_, i) => ({ R: 9 + tpr() * 16, h: 9 + tpr() * 12, w: (0.11 + tpr() * 0.1) * (i % 3 ? 1 : -1), ph: tpr() * Math.PI * 2, ez: 0.45 + tpr() * 0.3, cz: -4 - tpr() * 8, arrive: T.y76 + 0.1 + tpr() * 2.6, s: 0.38 + tpr() * 0.14 }));
    const tpPos = (i, t, out) => { const p = TP[i]; const k = expoOut(lin(p.arrive, p.arrive + 3.2, t)); const R = p.R + (1 - k) * 70; const a = p.ph + p.w * (t - 455) - (1 - k) * 0.9 * Math.sign(p.w);
      out.set(MB.x + Math.cos(a) * R, p.h + (1 - k) * 10 + 0.6 * Math.sin(t * 0.7 + i), MB.z + p.cz + Math.sin(a) * R * p.ez); return out; };

    // ---------- the mailbox that grows into the archive ----------
    const arc = new THREE.Group(); arc.position.copy(MB); scene.add(arc);
    const body = new THREE.Group(); arc.add(body);
    { const bs = new THREE.Shape(); bs.moveTo(-6, 0); bs.lineTo(6, 0); bs.lineTo(6, 13); bs.absarc(0, 13, 6, 0, Math.PI, false); bs.lineTo(-6, 0);
      const m = E.extrude(bs, "#9a6680", 3, { segments: 40 }); m.position.z = -1.5; body.add(m);
      const plinth = E.box(12.8, 0.6, 3.6, "#603f5f"); plinth.position.y = 0.3; body.add(plinth);
      const ar = new THREE.Shape(); ar.absarc(0, 0, 5.5, 0, Math.PI, false); ar.lineTo(-5.0, 0); ar.absarc(0, 0, 5.0, Math.PI, 0, true); ar.lineTo(5.5, 0);
      const archRim = E.extrude(ar, "#b4808f", 0.2); archRim.position.set(0, 13, 1.5); body.add(archRim); }
    const slot = E.glowPlane(3.6, 0.7, "#ffb35c"); slot.position.set(0, 15.4, 1.52); body.add(slot);
    const slotLip = E.box(4.2, 0.22, 0.3, "#603f5f"); slotLip.position.set(0, 14.95, 1.6); body.add(slotLip);
    const DC = 9, DR = 10, ND2 = DC * DR;
    const drw = new THREE.InstancedMesh(new THREE.BoxGeometry(1.06, 1.0, 0.3), pm("#ead6bd"), ND2), knob = new THREE.InstancedMesh(new THREE.BoxGeometry(0.26, 0.09, 0.1), pm("#4d3350"), ND2);
    drw.castShadow = drw.receiveShadow = true; drw.frustumCulled = knob.frustumCulled = false; body.add(drw, knob);
    const dX = (c) => -4.8 + 1.2 * c, dY = (r) => 0.95 + 1.2 * r;
    const CYC = 5, CYR = 6, CYI = CYR * DC + CYC; // the drawer that "comes forward"
    const cyDrawer = new THREE.Mesh(new THREE.BoxGeometry(1.06, 1.0, 0.3), E.paperMat("#ead6bd")); cyDrawer.castShadow = true; body.add(cyDrawer);
    const cyGlow = E.glowPlane(0.96, 0.9, C.cyan); body.add(cyGlow); cyGlow.userData.setGlow(0);
    const cyBox = E.box(1.0, 0.94, 1.6, "#d9c6ad"); body.add(cyBox); // drawer body revealed when pulled out
    // mailbox-only bits: post and flag
    const post = E.box(0.24, 1.3, 0.24, "#4d3350"); arc.add(post);
    const flagP = new THREE.Group(); body.add(flagP); flagP.position.set(6.12, 7.0, 0.8);
    { const arm = E.box(0.2, 5.0, 0.5, "#ffb35c"); arm.position.y = 2.5; flagP.add(arm); const plate = E.box(0.2, 1.6, 2.4, "#ffb35c"); plate.position.set(0, 4.6, 0.9); flagP.add(plate); }
    // paper notes flying into the slot (instanced)
    const NN = 74; const notes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.36, 0.014), new THREE.MeshStandardMaterial({ color: "#fbf1de", roughness: 0.9, emissive: "#ffe2b8", emissiveIntensity: 0.35 }), NN);
    notes.frustumCulled = false; scene.add(notes);
    const nr = rng(91); const NOTE = [...Array(NN)].map((_, j) => ({ t0: T.report - 0.1 + j * 0.19 + nr() * 0.08, p: j % NP, dur: 1.5 + nr() * 0.5, spin: (nr() - 0.5) * 9, arcH: 1 + nr() * 2.5 }));

    // ---------- lab set (revealed when the camera pulls out of the drawer wall) ----------
    const lab = new THREE.Group(); scene.add(lab); lab.visible = false;
    const lt1 = E.tower({ w: 17, h: 31, floors: 12, hex: "#6a4566" }); lt1.position.set(12, 0, -12.5); lab.add(lt1);
    const lt2 = E.tower({ w: 7, h: 21, floors: 8, hex: "#7a4f70" }); lt2.position.set(-6, 0, -24); lab.add(lt2);
    const lt3 = E.tower({ w: 8, h: 25, floors: 9, hex: "#7a4f70", roof: "spire" }); lt3.position.set(31, 0, -26); lab.add(lt3);
    { const s1 = E.extrude(E.skylineShape(-90, 130, E.randomPick(5, 12, 4, 9), 0, rng(31)), "#875878", 0.4); s1.position.z = -46; lab.add(s1);
      const s2 = E.extrude(E.skylineShape(-120, 160, E.randomPick(9, 18, 5, 10), 0, rng(32)), "#a8708a", 0.4); s2.position.z = -70; s2.castShadow = false; lab.add(s2); }
    // ledges + amber figures cataloguing drawers
    [3.95, 7.55].forEach((y) => { const l = E.box(11.6, 0.16, 0.9, "#603f5f"); l.position.set(0, y, 1.95); lab.add(l); l.parent.remove(l); arc.add(l); l.userData.lab = true; });
    const AMB = "#e8953f";
    const figs = [[-3.6, 0, 2.3, 0.0, 1], [3.0, 0, 2.6, 0.25, 2], [-1.6, 4.03, 2.0, 0.0, 3], [3.3, 4.03, 2.0, 1.0, 4], [-0.2, 7.63, 2.0, 0.0, 5], [-4.3, 7.63, 2.0, 0.0, 6]].map(([x, y, z, turn, sd]) => {
      const f = E.figure({ pose: "stand", hair: ["bun", "short", "long"][sd % 3], coat: sd % 2 === 0, hex: AMB, seed: sd }); f.scale.setScalar(0.88); f.position.set(x, y, z); f.userData.mat.side = THREE.DoubleSide;
      const card = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.3), new THREE.MeshBasicMaterial({ color: "#fbf1de", side: THREE.DoubleSide })); card.position.set(0.12, 0.06, 0.02); f.userData.hand.add(card);
      arc.add(f); f.userData.turn0 = turn; f.userData.lab = true; return f; });
    const labOnly = [...figs, ...arc.children.filter((c) => c.userData.lab)];

    // the card that leaves the cyan drawer and flies to the calendar
    const flyCard = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.44, 0.012), new THREE.MeshStandardMaterial({ color: "#fbf1de", roughness: 0.9, emissive: "#2a3a40", emissiveIntensity: 0.2 })); flyCard.castShadow = true; scene.add(flyCard);

    // ---------- calendar (tears off 15 pages) ----------
    const CAL = V3(25, 0, -3); const cal = new THREE.Group(); cal.position.copy(CAL); scene.add(cal);
    { const legL = E.box(0.16, 5.6, 0.16, "#4d3350"); legL.position.set(-1.4, 2.7, -0.5); legL.rotation.x = 0.12; cal.add(legL);
      const legR = legL.clone(); legR.position.x = 1.4; cal.add(legR); const legB = E.box(0.16, 5.4, 0.16, "#4d3350"); legB.position.set(0, 2.5, -1.4); legB.rotation.x = -0.32; cal.add(legB);
      const board = E.box(3.7, 4.4, 0.14, "#603f5f"); board.position.set(0, 3.15, -0.12); board.rotation.x = -0.06; cal.add(board); }
    const NPG = 16; const pages = [];
    const drawPage = (k) => (g, w, h) => {
      g.fillStyle = "#4d3350"; g.fillRect(0, 0, w, h * 0.16); g.fillStyle = "#efe6d2"; [0.3, 0.7].forEach((x) => { g.beginPath(); g.arc(w * x, h * 0.08, h * 0.03, 0, 7); g.fill(); });
      g.textAlign = "center"; g.textBaseline = "middle";
      if (k === 0) { g.fillStyle = "#3a2740"; g.font = `400 ${h * 0.3}px "Instrument Serif"`; g.fillText("SB 53", w / 2, h * 0.56); g.font = `400 ${h * 0.05}px Inter`; g.fillStyle = "#7a4f70"; g.fillText("CALIFORNIA", w / 2, h * 0.8); return; }
      g.fillStyle = "#3a2740"; g.font = `400 ${h * 0.5}px "Instrument Serif"`; g.fillText(String(k), w / 2, h * 0.6);
      if (k === 15) { g.strokeStyle = "#e8953f"; g.lineWidth = h * 0.022; g.beginPath(); g.ellipse(w / 2, h * 0.58, w * 0.33, h * 0.28, -0.08, 0.2, Math.PI * 2.05); g.stroke(); }
      g.strokeStyle = "rgba(58,39,64,0.25)"; g.lineWidth = 2; g.beginPath(); g.moveTo(w * 0.12, h * 0.9); g.lineTo(w * 0.88, h * 0.9); g.stroke(); };
    for (let k = 0; k < NPG; k++) { const piv = new THREE.Group(); piv.position.set(0, 5.25, 0.06 + (NPG - k) * 0.012); cal.add(piv);
      const pg = E.drawnCard({ w: 3.2, h: 3.8, px: 384, draw: drawPage(k) }); pg.position.y = -1.9; pg.castShadow = k < 2 || k > NPG - 3; piv.add(pg); pages.push({ piv, pg, home: piv.position.clone(), r: rng(300 + k) }); }
    const clip = E.box(1.6, 0.34, 0.3, "#3a2740"); clip.position.set(0, 5.25, 0.35); cal.add(clip);

    // ---------- the sieve ----------
    const SV = V3(37, 0, -3); const sieve = new THREE.Group(); sieve.position.copy(SV); scene.add(sieve);
    const holes = []; const SR = 3.62, MESHY = 3.0;
    { const s = E.circleShape(SR); const P = 0.44, hs = 0.15;
      for (let i = -9; i <= 9; i++) for (let j = -9; j <= 9; j++) { const x = i * P, y = j * P; if (Math.hypot(x, y) > SR - 0.32) continue; holes.push([x, -y]);
        const h = new THREE.Path(); h.moveTo(x - hs, y - hs); h.lineTo(x - hs, y + hs); h.lineTo(x + hs, y + hs); h.lineTo(x + hs, y - hs); h.lineTo(x - hs, y - hs); s.holes.push(h); }
      const mesh = E.extrude(s, "#c58f8f", 0.05, { segments: 64 }); mesh.rotation.x = -Math.PI / 2; mesh.position.y = MESHY; sieve.add(mesh);
      const rim = E.extrude(E.ringShape(SR - 0.02, SR + 0.36), "#5a3c5c", 0.5, { segments: 64 }); rim.rotation.x = -Math.PI / 2; rim.position.y = MESHY - 0.22; sieve.add(rim);
      [0, 2.1, 4.2].forEach((a) => { const lg = E.box(0.2, 2.9, 0.2, "#4d3350"); lg.position.set(Math.cos(a) * (SR + 0.1), 1.4, Math.sin(a) * (SR + 0.1)); lg.rotation.z = Math.cos(a) * 0.08; lg.rotation.x = -Math.sin(a) * 0.08; sieve.add(lg); }); }
    // small notes: fall through the holes and settle on the ground
    const NR = 64; const rain = new THREE.InstancedMesh(new THREE.BoxGeometry(0.27, 0.012, 0.2), new THREE.MeshStandardMaterial({ color: "#f6ead5", roughness: 0.9 }), NR); rain.castShadow = true; rain.receiveShadow = true; rain.frustumCulled = false; sieve.add(rain);
    const rr = rng(55); const RAIN = [...Array(NR)].map((_, j) => { const h = holes[Math.floor(rr() * holes.length)]; return { x: h[0], z: h[1], t0: T.many - 0.55 + rr() * 2.3, y0: 13 + rr() * 4, gx: h[0] + (rr() - 0.5) * 0.6, gz: h[1] + (rr() - 0.5) * 0.6, ry: rr() * 6.3, sp: (rr() - 0.5) * 14 }; });
    // the big note that gets caught (it is the exam booklet cover in s10)
    const drawNote = (g, w, h) => { g.strokeStyle = "rgba(77,51,80,0.55)"; g.lineWidth = w * 0.006; g.strokeRect(w * 0.05, h * 0.065, w * 0.9, h * 0.87);
      g.fillStyle = "rgba(77,51,80,0.75)"; g.beginPath(); g.arc(w * 0.15, h * 0.2, h * 0.06, 0, 7); g.fill(); g.fillStyle = "#fbf3e3"; g.beginPath(); g.arc(w * 0.15, h * 0.2, h * 0.032, 0, 7); g.fill();
      g.fillStyle = "rgba(77,51,80,0.42)"; [0.18, 0.25].forEach((y, i) => g.fillRect(w * 0.25, h * y, w * (i ? 0.26 : 0.4), h * 0.022));
      g.fillStyle = "rgba(77,51,80,0.2)"; for (let i = 0; i < 6; i++) g.fillRect(w * 0.1, h * (0.42 + i * 0.075), w * (i === 5 ? 0.42 : 0.58), h * 0.012);
      g.strokeStyle = "rgba(77,51,80,0.6)"; g.lineWidth = w * 0.005; g.strokeRect(w * 0.73, h * 0.42, w * 0.17, h * 0.3);
      g.fillStyle = "rgba(77,51,80,0.08)"; g.beginPath(); g.moveTo(w * 0.86, h * 0.935); g.lineTo(w * 0.95, h * 0.935); g.lineTo(w * 0.95, h * 0.82); g.fill(); };
    const bigNote = E.drawnCard({ w: 4, h: 3, px: 1024, hex: "#f3e9d5", depth: 0.04, draw: drawNote }); sieve.add(bigNote);
    const NOTE_Y = MESHY + 0.05 + 0.02;

    // ---------- DOM ----------
    const L = E.layer;
    const chapter = E.chapterDOM(L, { text: "REPORT", inAt: T.first, outAt: T.y74 + 2.6 });
    const stamp = E.stampDOM(L, [{ t: T.y74, year: "1974", label: "Near Washington" }, { t: T.y76, year: "1976", label: "United States" }, { t: T.ai, year: "2026", label: "July" }, { t: T.california, year: "2026", label: "California" }], T.limits + 0.4);
    const srcA = E.srcDOM(L, { big: "NASA Aviation Safety Reporting System", small: "since 1976 · 2 million+ reports", inAt: T.america, outAt: T.ai - 0.4 });
    const srcB = E.srcDOM(L, { big: "Hugging Face disclosed, OpenAI came forward", small: "July 2026", inAt: T.hugging + 0.3, outAt: T.california - 0.3 });
    const srcC = E.srcDOM(L, { big: "California SB 53", small: "report critical incidents within 15 days", inAt: T.california + 0.35, outAt: T.limits });
    const doms = [chapter, stamp, srcA, srcB, srcC];

    // ---------- camera ----------
    const K = (t, p, l, e, arc) => ({ t, p: V3(...p), l: V3(...l), e, arc });
    const NOTE_W = V3(SV.x, NOTE_Y, SV.z);
    const FD = 4 / (0.6 * 2 * Math.tan((17.5 * Math.PI) / 180) * (16 / 9)), FA = (10 * Math.PI) / 180;
    const FINAL = V3(NOTE_W.x, NOTE_W.y + FD * Math.cos(FA), NOTE_W.z + FD * Math.sin(FA));
    const keys = [
      K(def.from, [0, 1.75, 14], [0.3, 6.0, -86]),
      K(T.y74 - 0.3, [0.4, 2.3, 13], [0.8, 5.9, -86], sineInOut),
      K(T.twa - 0.1, [-2.0, 5.6, 7], [11, 4.2, -26], inOut, 0.05),
      K(T.six, [-1.4, 5.9, 6], [11.5, 4.5, -26], sineInOut),
      K(T.pulled + 0.3, [-0.6, 6.3, 5], [12.5, 5.2, -26], sineInOut),
      K(T.pulled + 2.4, [15, 9, 6], [19, 8.5, -4], inOut, 0.02), // (the cockpit follow takes over here)
      K(T.y76 + 1.4, [15.4, 3.6, 12.2], [12, 2.3, -2], inOut, 0.03),
      K(T.report, [14.6, 3.9, 11.2], [12, 2.9, -2], sineInOut),
      K(T.two - 0.1, [14.4, 5.4, 15], [12, 5.0, -2], sineInOut),
      K(T.since + 0.5, [7.2, 2.4, 38], [12, 10.4, -2], inOut, 0.08),
      K(T.ai, [5.6, 2.6, 36], [12, 10.8, -2], sineInOut),
      K(tSwap + 0.05, [12.6, 7.4, 2.75], [12.6, 7.4, -0.6], inOut, 0.03),
      K(T.july + 1.2, [5.2, 8.6, 28], [12, 11.2, -2], inOut, 0.05),
      K(T.forward + 0.9, [10.0, 8.9, 11.4], [13.2, 8.1, 0], inOut, 0.04),
      K(T.california + 1.6, [24.2, 3.7, 10.5], [25.8, 3.0, -3], inOut, 0.06),
      K(T.days + 0.7, [25.4, 3.7, 9.2], [26.8, 3.0, -3], sineInOut),
      K(T.narrow + 0.4, [35.4, 8.6, 8.4], [37, 2.6, -3], inOut, 0.05),
      K(T.outsiders + 0.4, [37.1, 11.0, 4.4], [37, 3.0, -3], sineInOut),
      { t: def.to, p: FINAL.clone(), l: NOTE_W.clone(), e: inOut, arc: 0 },
    ];
    const camKeys = (t) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++; const a = keys[i], b = keys[i + 1]; const raw = lin(a.t, b.t, t); const k = (b.e || inOut)(raw);
      const p = a.p.clone().lerp(b.p, k), l = a.l.clone().lerp(b.l, k); const bul = Math.sin(Math.PI * k) * a.p.distanceTo(b.p) * (b.arc ?? 0.0); p.x += bul * (i % 2 ? -1 : 1); p.y += bul * 0.4; return { p, l }; };
    const drift = (t, p, l, a = 1) => { const d = p.distanceTo(l) * 0.01 * a; p.x += d * (Math.sin(t * 0.37) * 0.9 + Math.sin(t * 0.83 + 1.3) * 0.4); p.y += d * (Math.sin(t * 0.51 + 0.7) * 0.6 + Math.sin(t * 1.13 + 2.1) * 0.2);
      l.x += d * Math.sin(t * 0.29 + 0.4) * 0.5; l.y += d * Math.sin(t * 0.43 + 1.9) * 0.35; };

    // ---------- helpers for update ----------
    const dummy = new THREE.Object3D(); const tmp = V3(0, 0, 0), tmp2 = V3(0, 0, 0), tmp3 = V3(0, 0, 0);
    const ckLocal = V3(1.35, 0.1, 0); // cockpit in plane-inner units
    const growK = (t) => spring(lin(T.two, T.two + 2.0, t));
    const slotWorld = (t, out) => { const s = lerp(0.12, 1, growK(t)), sz = lerp(0.5, 1, growK(t)); return out.set(MB.x, body.position.y + 15.4 * s, MB.z + 1.55 * sz); };
    const ridgeC0 = new THREE.Color("#3e2a45");
    const cyanCol = new THREE.Color(C.cyan);
    let lastSwap = null;

    const update = (t) => {
      const labMode = t >= tSwap;
      if (lastSwap !== labMode) { lastSwap = labMode; air.visible = !labMode; [tpF, tpW, tpT].forEach((m) => (m.visible = !labMode)); lab.visible = labMode; labOnly.forEach((o) => (o.visible = labMode));
        cal.visible = labMode; sieve.visible = labMode; post.visible = !labMode; }

      // --- planes ---
      // TWA rolls at T.twa, climbs, glides into the ridge's shadow on "mountain" and fades away
      const tw0 = T.y74 + 0.25, tw1 = T.mountain + 0.9; const x = lin(tw0, tw1, t); const ua = clamp(Math.pow(x, 1.35) * 0.62 + sineInOut(x) * 0.38, 0, 1) * 0.985;
      curveA.getPointAt(ua, tmp); twa.g.position.copy(tmp); curveA.getTangentAt(Math.min(ua + 0.002, 1), tmp2); orient(twa.g, tmp2, -0.25 * smooth(0.35, 0.8, ua));
      const shade = smooth(T.mountain - 0.25, T.mountain + 0.75, t), gone = smooth(T.mountain + 0.15, T.mountain + 1.6, t);
      twa.mats.forEach((m) => { m.color.copy(m.userData.c0).lerp(ridgeC0, shade); m.opacity = 1 - gone; m.depthWrite = gone < 0.5; });
      twa.g.visible = gone < 0.999 && !labMode;
      // trail: dashes appear behind the TWA plane, glow again (rewind) on "Six weeks earlier", then fade as United climbs out
      const uTrail = Math.max(ua, 0); const rewind = lin(T.six, T.six + 1.4, t);
      for (let k = 0; k < ND; k++) { const uk = (k + 0.5) / ND; curveA.getPointAt(uk, tmp); curveA.getTangentAt(uk, tmp2);
        const on = uk < uTrail ? 1 : 0; const front = Math.exp(-Math.pow((uk - rewind) * 9, 2));
        dummy.position.copy(tmp); dummy.position.y -= 0.05; dummy.scale.setScalar(on ? 1 + 0.7 * front * (rewind > 0 && rewind < 1 ? 1 : 0) : 0.0001); orient(dummy, tmp2); dummy.updateMatrix(); trail.setMatrixAt(k, dummy.matrix);
        const fade = 1 - smooth(T.pulled + 0.6, T.nobody + 1.5, t); trail.setColorAt(k, tmp3.set(1, 0.93, 0.82).multiplyScalar((0.55 + 1.4 * front * (rewind > 0 && rewind < 1 ? 1 : 0)) * fade + 0.0001)); }
      trail.instanceMatrix.needsUpdate = true; trail.instanceColor.needsUpdate = true;
      // United: same path; pulls up at the ridge, swings back over the field
      const up = uParam(t); curveU.getPoint(up, tmp); uni.g.position.copy(tmp);
      const dA = curveU.getPoint(Math.min(up + 0.004, 1), V3(0, 0, 0)).sub(curveU.getPoint(Math.max(up - 0.004, 0), V3(0, 0, 0)));
      const dB = curveU.getPoint(Math.min(up + 0.012, 1), V3(0, 0, 0)).sub(curveU.getPoint(Math.max(up + 0.004, 0), V3(0, 0, 0)));
      let dy = yawOf(dB) - yawOf(dA); dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      uni.g.userData.roll = lerp(uni.g.userData.roll ?? 0, 0, 0) ; orient(uni.g, dA.lengthSq() > 1e-8 ? dA : V3(0, 0, -1), clamp(-dy * 6, -0.55, 0.55) + 0.03 * Math.sin(t * 2.3));
      uni.g.visible = t > T.six + 0.15 && t < T.y76 + 5 && !labMode;
      // cockpit + pilot: lifts the note to the window ("Nobody else ever heard"), then lowers it into the lap
      const lift = smooth(T.nobody + 0.1, T.nobody + 0.7, t) * (1 - smooth(T.heard + 0.15, T.itEnd + 0.3, t));
      pilot.userData.pose(t, { reach: 0.25 + 0.6 * lift, lookUp: 0.15 * lift - 0.1 * smooth(T.heard, T.itEnd + 0.4, t), lean: 0.1 * lift });
      pNote.rotation.z = 0.3 + 0.25 * Math.sin(t * 7) * lift; pNote.material.color.setScalar(1).multiply(new THREE.Color("#fff4e2")).multiplyScalar(1 - 0.35 * smooth(T.itEnd - 0.2, T.itEnd + 0.6, t));
      ckMat.color.set("#ff9f45").multiplyScalar(1.0 + 0.08 * Math.sin(t * 5.1) + 0.05 * Math.sin(t * 13.7));
      uni.inner.localToWorld(tmp2.copy(ckLocal)); cockpitLight.position.copy(tmp2); cockpitLight.intensity = 3.2 * smooth(T.pulled + 1.5, T.nobody, t) * (1 - smooth(T.y76, T.y76 + 1.5, t));

      // --- tiny planes + notes ---
      if (!labMode) for (let i = 0; i < NP; i++) { tpPos(i, t, tmp); tpPos(i, t + 0.05, tmp2); tmp2.sub(tmp); const p = TP[i];
        const vis = t > p.arrive - 0.2; dummy.position.copy(tmp); dummy.scale.setScalar(vis ? p.s : 0.0001); orient(dummy, tmp2, -Math.sign(p.w) * 0.35); dummy.updateMatrix();
        tpF.setMatrixAt(i, dummy.matrix); tpW.setMatrixAt(i, dummy.matrix); tpT.setMatrixAt(i, dummy.matrix); }
      [tpF, tpW, tpT].forEach((m) => (m.instanceMatrix.needsUpdate = true));
      for (let j = 0; j < NN; j++) { const n = NOTE[j]; const q = lin(n.t0, n.t0 + n.dur, t); const live = q > 0 && q < 1 && !labMode;
        if (live) { tpPos(n.p, n.t0, tmp); slotWorld(t, tmp2); const e = sineInOut(q); dummy.position.copy(tmp).lerp(tmp2, e); dummy.position.y += Math.sin(Math.PI * e) * n.arcH;
          dummy.rotation.set(Math.sin(t * 3 + j) * 0.6 * (1 - e), n.spin * q, Math.cos(t * 2.4 + j) * 0.5 * (1 - e)); dummy.scale.setScalar(lerp(0.8, 1.6, growK(t)) * (q < 0.06 ? q / 0.06 : 1) * (q > 0.93 ? (1 - q) / 0.07 : 1)); }
        else dummy.scale.setScalar(0.0001);
        dummy.updateMatrix(); notes.setMatrixAt(j, dummy.matrix); }
      notes.instanceMatrix.needsUpdate = true;

      // --- mailbox -> archive ---
      const g = growK(t), s = lerp(0.12, 1, g), sz = lerp(0.5, 1, g);
      body.scale.set(s * (1 + 0.012 * Math.sin(t * 1.3) * (1 - g)), s, sz); body.position.y = lerp(1.25, 0, smooth(T.two - 0.1, T.two + 0.9, t));
      post.scale.y = Math.max(0.001, body.position.y / 1.25); post.position.y = body.position.y / 2;
      flagP.rotation.x = Math.PI / 2 * (1 - expoOut(lin(T.report - 0.1, T.report + 0.5, t))) + 0.06 * Math.sin(t * 3.1); flagP.scale.setScalar(1 - smooth(T.two, T.two + 0.6, t)) ; flagP.visible = g < 0.5;
      slot.userData.setGlow(1.2 + 0.25 * Math.sin(t * 2.2) + 0.6 * Math.exp(-Math.pow(((t - T.report) % 0.19) * 10, 2)) * (t > T.report && t < T.ai ? 1 : 0));
      slotWorld(t, slotLight.position); slotLight.position.z += 1.2; slotLight.intensity = labMode ? 0 : 6 * s; slotLight.distance = 5 + 10 * s;
      for (let r = 0; r < DR; r++) for (let c = 0; c < DC; c++) { const i = r * DC + c; const tp = T.two + 0.35 + r * 0.075 + Math.abs(c - 4) * 0.05; const k = spring(lin(tp, tp + 0.55, t));
        let out = 0; if (labMode) { const w2 = Math.sin(t * 0.9 + i * 1.7); out = (i % 7 === 3 || i % 11 === 5) ? 0.35 + 0.35 * Math.max(0, w2) : 0.03 * w2; }
        dummy.position.set(dX(c), dY(r), lerp(1.34, 1.62, k) + out); dummy.rotation.set(0, 0, 0); dummy.scale.set(1, 1, 1); if (i === CYI || t < tp) dummy.scale.setScalar(0.0001); dummy.updateMatrix(); drw.setMatrixAt(i, dummy.matrix);
        dummy.position.z += 0.17; dummy.updateMatrix(); knob.setMatrixAt(i, dummy.matrix);
        const fl = 1.25 * Math.exp(-Math.pow((t - tp - 0.3) * 4, 2)) + 0.45 * Math.pow(Math.max(0, Math.sin(t * 1.7 + i * 2.39)), 24) * (t > T.since ? 1 : 0); drw.setColorAt(i, tmp3.setRGB(1 + fl, 1 + fl * 0.75, 1 + fl * 0.4)); }
      drw.instanceMatrix.needsUpdate = knob.instanceMatrix.needsUpdate = true; drw.instanceColor.needsUpdate = true;
      // the cyan drawer: glows on "July", slides far forward on "came forward"
      const kc = spring(lin(T.two + 0.35 + CYR * 0.075 + 0.05, T.two + 0.95 + CYR * 0.075, t)); const fw = expoOut(lin(T.forward - 0.12, T.forward + 0.9, t)) * 1.7 - 0.06 * Math.sin(Math.PI * lin(T.forward - 0.35, T.forward - 0.12, t));
      cyDrawer.position.set(dX(CYC), dY(CYR), lerp(1.34, 1.62, kc) + fw); cyDrawer.visible = kc > 0.001; cyBox.position.set(dX(CYC), dY(CYR), cyDrawer.position.z - 0.95); cyBox.visible = fw > 0.05;
      const glowK = labMode ? smooth(T.july - 0.1, T.july + 0.4, t) * (0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 3.3)) : 0;
      cyGlow.position.set(dX(CYC), dY(CYR), cyDrawer.position.z - 0.12); cyGlow.userData.setGlow(0.9 * glowK); cyDrawer.material.emissive = cyanCol; cyDrawer.material.emissiveIntensity = 0.12 * glowK;
      body.localToWorld(cyanLight.position.copy(cyDrawer.position)); cyanLight.position.z += 0.8; cyanLight.intensity = 3.5 * glowK;
      // fly card: rises out of the cyan drawer, then flutters across to the calendar clip
      { const c0 = body.localToWorld(V3(dX(CYC), dY(CYR) + 0.35, cyDrawer.position.z)); const rise = expoOut(lin(T.forward + 0.5, T.forward + 1.3, t));
        const c1 = c0.clone().add(V3(0.2, 0.9 * rise, 0.15)); const fl = lin(T.california - 0.05, T.california + 1.35, t); const e = inOut(fl);
        const dest = V3(CAL.x - 0.05, 5.4, CAL.z + 0.35); flyCard.position.copy(c1).lerp(dest, e); flyCard.position.y += Math.sin(Math.PI * e) * 2.2;
        flyCard.rotation.set(-0.5 * (1 - e) + Math.sin(t * 5.3) * 0.35 * Math.sin(Math.PI * e), Math.sin(t * 3.1) * 0.5 * (1 - e), Math.sin(t * 4.1) * 0.6 * Math.sin(Math.PI * e));
        const tuck = smooth(T.california + 1.25, T.california + 1.75, t); flyCard.position.y -= tuck * 0.5; flyCard.position.z -= tuck * 0.3; flyCard.visible = labMode && rise > 0.001 && tuck < 0.98; }
      // figures cataloguing
      figs.forEach((f, i) => { const ph = i * 1.3; const reach = 0.5 + 0.45 * Math.sin(t * (0.9 + i * 0.13) + ph); f.userData.pose(t, { reach: i === 4 ? 0.6 + 0.4 * smooth(T.forward - 0.3, T.forward + 0.5, t) : reach, lookUp: i === 4 ? 0.25 : 0.12 * Math.sin(t * 0.7 + ph), lean: 0.12 * Math.sin(t * 0.8 + ph), walk: i === 1 ? 0.6 : 0, turn: f.userData.turn0 });
        if (i === 1) f.position.x = 3.0 + 1.1 * Math.sin(t * 0.35); });
      // lab tower floors flicker cyan (the machine side of the drawer wall)
      if (labMode) for (let i = 0; i < 12; i++) { lt1.userData.setFloor(i, (i > 5 ? 0.55 : 0.25) + 0.1 * Math.sin(t * 1.7 + i * 2.1), C.cyan); if (i < 8) lt2.userData.setFloor(i, 0.3 + 0.08 * Math.sin(t * 1.3 + i), i % 3 ? C.cyan : C.amber); if (i < 9) lt3.userData.setFloor(i, 0.35 + 0.08 * Math.sin(t * 1.1 + i * 1.4), C.cyan); }

      // --- calendar: 15 pages tear off in a flutter on "fifteen days" ---
      pages.forEach((P, k) => { if (k >= 15) { P.piv.rotation.set(0.01 * Math.sin(t * 1.4), 0, 0); return; } const tk = T.fifteen - 0.06 + k * 0.064; const u = t - tk;
        if (u <= 0) { P.piv.position.copy(P.home); P.piv.rotation.set(0.012 * Math.sin(t * 1.4 + k), 0, 0); P.piv.visible = true; return; }
        const fly = Math.max(0, u - 0.1), u1 = Math.min(u / 0.1, 1);
        P.piv.position.set(P.home.x + fly * (3.6 + k * 0.16) + fly * fly * 2.6, P.home.y + fly * (2.6 + (k % 4) * 0.3) - fly * fly * 0.8 + Math.sin(u * 6 + k) * 0.2 * Math.min(1, fly * 3), P.home.z + fly * (0.6 + (k % 3) * 0.45));
        P.piv.rotation.set(-0.25 * u1 - fly * (1.1 + (k % 4) * 0.5), fly * (1.6 + (k % 5) * 0.4), 0.45 * u1 + fly * (1.6 + (k % 3) * 0.7));
        P.piv.visible = fly < 4.5; });

      // --- sieve: rain of small notes, one big note caught ---
      for (let j = 0; j < NR; j++) { const R = RAIN[j]; const u = t - R.t0; const fallT = Math.sqrt((2 * R.y0) / 9.0);
        if (u <= 0 || !labMode) dummy.scale.setScalar(0.0001);
        else { dummy.scale.setScalar(1); const y = Math.max(0.02 + (j % 5) * 0.004, R.y0 - 0.5 * 9.0 * u * u); const land = u >= fallT; const k2 = lin(R.y0, 0, y);
          dummy.position.set(lerp(R.x, R.gx, smooth(0.75, 1, k2)), y, lerp(R.z, R.gz, smooth(0.75, 1, k2)));
          dummy.rotation.set(land ? 0 : Math.sin(u * R.sp) * 0.9, R.ry + (land ? 0 : u * 2), land ? 0 : Math.cos(u * R.sp * 0.7) * 0.7); }
        dummy.updateMatrix(); rain.setMatrixAt(j, dummy.matrix); }
      rain.instanceMatrix.needsUpdate = true;
      { const tLand = T.full; const tDrop = tLand - 1.15; const u = t - tDrop; const yTop = 15;
        let y = yTop, rx = 0, rz = 0; if (u > 0) { const q = clamp(u / 1.15, 0, 1); y = lerp(yTop, NOTE_Y, q * q); rx = Math.sin(u * 4.2) * 0.45 * (1 - q); rz = Math.sin(u * 3.1 + 1) * 0.3 * (1 - q); }
        const b = t > tLand ? Math.exp(-(t - tLand) * 6) * Math.sin((t - tLand) * 22) * 0.06 : 0;
        bigNote.position.set(0.02 * Math.sin(t * 0.6), y + Math.abs(b), 0); bigNote.rotation.set(-Math.PI / 2 + rx + b * 0.4 + 0.004 * Math.sin(t * 1.2), 0.002 * Math.sin(t * 0.9), rz);
        bigNote.visible = labMode && u > 0; }

      // --- sun, sky, lights ---
      const sunEl = lerp(0.03, 0.075, lin(def.from, def.to, t)); const sd = V3(0.12, sunEl, -1).normalize();
      // camera
      let { p, l } = camKeys(t);
      // follow the United cockpit through "Nobody else ever heard about it"
      const fIn = smooth(T.pulled + 0.7, T.nobody + 0.15, t), fOut = smooth(T.y76 - 0.1, T.y76 + 1.4, t), fw2 = fIn * (1 - fOut);
      if (fw2 > 0) { uni.inner.localToWorld(tmp.copy(ckLocal)); const head = dA.clone().setY(0).normalize(); const side = V3(head.z, 0, -head.x); if (side.z < 0) side.multiplyScalar(-1);
        const fp = tmp.clone().addScaledVector(side, 1.45).addScaledVector(head, 0.1).add(V3(0, 0.16, 0)); const fl = tmp.clone().addScaledVector(head, -0.18).add(V3(0, 0.02, 0));
        p.lerp(fp, fw2); l.lerp(fl, fw2); }
      drift(t, p, l, 1 - 0.75 * smooth(T.outsiders, def.to, t)); E.applyCam(camera, { p, l });
      sky.position.copy(camera.position);
      sun.position.copy(camera.position).addScaledVector(sd, 300); sun.lookAt(camera.position); halo.scale.setScalar(1 + 0.03 * Math.sin(t * 0.8));
      const look = l.clone(); key.target.position.copy(look); fill.target.position.copy(look);
      const kOff = labMode ? (t > T.limits - 0.5 ? V3(-12, 30, 10) : V3(-20, 26, 22)) : V3(-22, 24, 20);
      key.position.copy(look).add(kOff); fill.position.copy(camera.position).add(V3(-6, 4, 0));
      key.intensity = 2.7; hemi.intensity = labMode ? 1.15 : 1.05;
      // airport life
      for (let k = 0; k < NL; k++) { const chase = Math.exp(-Math.pow(((k * 0.09 - t * 0.9) % 2.7 + 2.7) % 2.7 - 0.2, 2) * 18); const f = 0.85 + 0.15 * Math.sin(t * 7 + k * 2.3) + 1.4 * chase;
        rLights.setColorAt(k * 2, tmp3.set(1, 0.52, 0.16).multiplyScalar(f)); rLights.setColorAt(k * 2 + 1, tmp3.set(1, 0.52, 0.16).multiplyScalar(f)); }
      rLights.instanceColor.needsUpdate = true;
      ctower.userData.win.userData.setGlow(1.15 + 0.08 * Math.sin(t * 2.7)); ctower.userData.bcn.userData.setGlow(Math.sin(t * 4) > 0.2 ? 2 : 0.3);
      hg1.userData.door.userData.setGlow(0.5 + 0.05 * Math.sin(t * 1.9)); hg2.userData.door.userData.setGlow(0.45 + 0.05 * Math.sin(t * 2.3 + 1));
      crew.userData.pose(t, { armUp: 0.55 + 0.3 * Math.sin(t * 3.2) * smooth(T.twa - 1, T.twa, t), lookUp: 0.2 });
      doms.forEach((d) => d.update(t));
    };
    update(def.from);
    return { scene, camera, post: { bloom: 0.42, exposure: 1.08 }, update };
  },
};
