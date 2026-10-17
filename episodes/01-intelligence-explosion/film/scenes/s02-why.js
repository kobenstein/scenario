// s02 · Why believe this? (I. J. Good, 1965 → the loop → "a switch flips" → a number in a report)
// Carrier in: full-frame cream PAGE = the typewriter page; camera pulls back to the 1965 desk.
// Carrier out: the printed report page (16x9) centred at the PAGE framing, % figure ticking in its margin.
// Hero lights: amber desk lamp (1965) → cyan cutting spark (the loop) → the eye (wow) → the report page.
// Wow moment: "A switch flips. A machine wakes up." — the lamp dies with the lever, the gear-eye opens.
export default {
  build(E, def) {
    const { THREE, C, PAL, V } = E;
    const { lin, smooth, clamp, lerp, expoOut, inOut, spring, antic, sineInOut, wob } = E;
    const scene = new THREE.Scene();
    const camera = E.newCamera();
    const pal = PAL.night;
    const W = (p, n = 1) => E.at("why", p, n);
    const T0 = def.from, T1 = def.to;
    E.renderer.localClippingEnabled = true;

    // ---------------- word anchors ----------------
    const tYear = W("nineteen"), tGood = W("IJ"), tBroken = W("broken"), tImag = W("imagined");
    const tHis = W("His idea"), tLoop = W("loop"), tEach = W("each machine"), tBuilds = W("builds"), tBetter = W("better one");
    const tMost = W("Most people"), tPicture = W("picture"), tBang = W("bang");
    const tSwitch = W("switch"), tWakes = W("wakes"), tIf = W("If it comes"), tWont = W("won't"), tThatEnd = E.end("why", "like that");
    const tLooks = W("It looks like"), tNumber = W("number"), tReportEnd = E.end("why", "company report");
    const tDocile = W("docile"), tControlEnd = E.end("why", "under control");

    // ---------------- stage ----------------
    const st = E.stage(scene, pal, { floor: false, stars: 150, clouds: true, seed: 21 });
    // engine stage clouds: one cloud shape can come out degenerate (a huge sheet); hide any oversized cloud
    scene.children.forEach((c) => { if (c.geometry && c.geometry.type === "ExtrudeGeometry") { c.geometry.computeBoundingSphere(); if (c.geometry.boundingSphere.radius > 30 || !isFinite(c.geometry.boundingSphere.radius)) c.visible = false; } });
    scene.fog = new THREE.Fog(pal.fog, 60, 190);
    const desk = new THREE.Mesh(new THREE.PlaneGeometry(160, 90), E.paperMat("#2a2333"));
    desk.rotation.x = -Math.PI / 2; desk.position.set(0, 0, -10); desk.receiveShadow = true; scene.add(desk);
    const L = E.lights(scene, pal, { key: [-26, 30, 26], target: [0, 4, -8], intensity: 0.75, hemi: 0.55, box: 36 });

    // far layers: Bletchley-ish mansion + huts, low hills (paper sheets, breathing)
    const back = [];
    const mansion = (() => { const s = new THREE.Shape(); s.moveTo(-90, -0.5); let x = -90;
      const hill = (x) => 6 + Math.sin(x * 0.06) * 1.6 + Math.sin(x * 0.17 + 1) * 0.6;
      for (; x < -16; x += 3) s.lineTo(x, hill(x));
      // mansion: gables, a turret, chimneys
      s.lineTo(-16, 9); s.lineTo(-14, 11.5); s.lineTo(-12, 9); s.lineTo(-12, 12); s.lineTo(-11.4, 12); s.lineTo(-11.4, 9.8); s.lineTo(-8, 9.8);
      s.lineTo(-8, 13); s.lineTo(-7.2, 14.6); s.lineTo(-6.4, 13); s.lineTo(-6.4, 9.8); s.lineTo(-2, 9.8); s.lineTo(0, 12.2); s.lineTo(2, 9.8);
      s.lineTo(4, 9.8); s.lineTo(4, 11.2); s.lineTo(4.6, 11.2); s.lineTo(4.6, 9.8); s.lineTo(8, 9.8); s.lineTo(8, 8);
      for (x = 8; x < 90; x += 3) s.lineTo(x, hill(x) + (x > 14 && x < 34 ? 1.4 : 0)); s.lineTo(90, -0.5); s.lineTo(-90, -0.5); return s; })();
    { const m = E.extrude(mansion, pal.layers[1], 0.3); m.position.set(-6, 0, -36); scene.add(m); back.push(m);
      const huts = E.skylineShape(-70, 70, (x, r) => ({ w: 5 + r() * 6, h: 2.2 + r() * 2.2, roof: r() < 0.6 ? "pitch" : "flat" }), 0.12, E.rng(5));
      const m2 = E.extrude(huts, pal.layers[3], 0.25); m2.position.set(0, 0, -24); scene.add(m2); back.push(m2);
      // a few warm hut windows (codebreakers working through the night)
      const wins = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.55, 0.8), new THREE.MeshBasicMaterial({ color: "#ffb35c" }), 7);
      const r = E.rng(9), d = new THREE.Object3D();
      for (let i = 0; i < 7; i++) { d.position.set(-40 + i * 12 + r() * 6, 1.6, -24.2); d.updateMatrix(); wins.setMatrixAt(i, d.matrix); wins.setColorAt(i, new THREE.Color("#ffb35c").multiplyScalar(0.25 + r() * 0.35)); }
      scene.add(wins); back.push(wins); }

    // ---------------- bombes (codebreaking machines as paper silhouettes) ----------------
    const BZ = -9.6, DR = 0.33;
    const drumTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 128; const g = c.getContext("2d");
      g.fillStyle = "#1a2236"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "#d9cdb4"; g.lineWidth = 7; g.beginPath(); g.arc(64, 64, 52, 0, Math.PI * 2); g.stroke();
      g.lineWidth = 9; g.beginPath(); g.moveTo(64, 64); g.lineTo(64, 14); g.stroke(); g.fillStyle = "#d9cdb4"; g.beginPath(); g.arc(64, 64, 9, 0, Math.PI * 2); g.fill();
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
    const drumGeo = new THREE.CylinderGeometry(DR, DR, 0.25, 28);
    const drumMats = [E.paperMat("#202a42"), new THREE.MeshStandardMaterial({ map: drumTex, roughness: 0.9 }), E.paperMat("#202a42")];
    const drums = new THREE.InstancedMesh(drumGeo, drumMats, 54); drums.castShadow = true; scene.add(drums);
    const drumPos = []; const dr = E.rng(31);
    [-7.2, 0, 7.2].forEach((bx, b) => {
      const cab = E.box(5.8, 5.2, 1.4, "#1b2640"); cab.position.set(bx, 2.6, BZ); scene.add(cab);
      const panel = E.box(5.3, 3.5, 0.08, "#25355a"); panel.position.set(bx, 2.95, BZ + 0.72); scene.add(panel);
      const cap = E.box(6.1, 0.3, 1.6, "#141d33"); cap.position.set(bx, 5.35, BZ); scene.add(cap);
      const plinth = E.box(6.0, 0.5, 1.5, "#141d33"); plinth.position.set(bx, 0.25, BZ); scene.add(plinth);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++)
        drumPos.push({ x: bx + (c - 2.5) * 0.85, y: 1.95 + r * 1.05, z: BZ + 0.84, sp: (dr() < 0.5 ? -1 : 1) * (0.35 + dr() * 0.9), ph: dr() * 6.28, b, r, c }); });
    const G0I = drumPos.findIndex((d) => d.b === 2 && d.r === 2 && d.c === 3); // this drum becomes the first gear
    const integ = (t, a, b) => (t < a ? 0 : t < b ? (t - a) * (t - a) / (2 * (b - a)) : (b - a) / 2 + (t - b));
    const _o = new THREE.Object3D(), qx = new THREE.Quaternion().setFromAxisAngle(V(1, 0, 0), Math.PI / 2), qz = new THREE.Quaternion();
    const updDrums = (t) => { const boost = integ(t, tBroken, tBroken + 0.7) - integ(t, tImag + 0.6, tImag + 1.8);
      drumPos.forEach((d, i) => { const a = d.ph + d.sp * (t - T0) + d.sp * 2.6 * boost;
        qz.setFromAxisAngle(V(0, 0, 1), a); _o.quaternion.copy(qz).multiply(qx); _o.position.set(d.x, d.y, d.z); _o.scale.setScalar(i === G0I ? 0 : 1); _o.updateMatrix(); drums.setMatrixAt(i, _o.matrix); });
      drums.instanceMatrix.needsUpdate = true; };

    // ---------------- the typewriter (1965) ----------------
    const TW = new THREE.Group(); scene.add(TW);
    const BODY = "#1c2236", INKC = "#11141f";
    { // side-profile body extruded across x
      const s = E.polyShape([[2.3, 0], [2.3, 0.38], [0.2, 1.42], [-1.55, 1.52], [-1.95, 1.15], [-1.95, 0]]);
      const g = new THREE.ExtrudeGeometry(s, { depth: 5.2, bevelEnabled: false }); const m = new THREE.Mesh(g, E.paperMats(BODY));
      m.rotation.y = -Math.PI / 2; m.position.x = 2.6; m.castShadow = m.receiveShadow = true; TW.add(m);
      const lip = E.box(5.4, 0.12, 0.3, "#2a3150"); lip.position.set(0, 0.42, 2.2); TW.add(lip); }
    const KEYS = []; const keys = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.18, 0.14, 18), E.paperMat("#e6d9bf"), 41); keys.castShadow = true; TW.add(keys);
    [11, 11, 10, 9].forEach((n, r) => { for (let i = 0; i < n; i++) KEYS.push({ x: (i - (n - 1) / 2) * 0.42 + r * 0.06, y: 0.55 + r * 0.24, z: 1.95 - r * 0.42 }); });
    const space = E.box(2.4, 0.1, 0.28, "#e6d9bf"); space.position.set(0, 0.47, 2.32); TW.add(space);
    // typebar basket (fan) + the striking bar
    { const fan = new THREE.InstancedMesh(new THREE.BoxGeometry(0.035, 0.03, 0.8), E.paperMat("#8f8a80", { rough: 0.6 }), 29); const d = new THREE.Object3D();
      for (let i = 0; i < 29; i++) { const a = -1.25 + i * (2.5 / 28); d.position.set(Math.sin(a) * 0.95, 1.36, 0.35 + Math.cos(a) * 0.55); d.rotation.set(0, a, 0); d.updateMatrix(); fan.setMatrixAt(i, d.matrix); }
      TW.add(fan); }
    const TP = V(0, 2.13, -0.42); // type point (where the strike lands)
    const barPivot = new THREE.Group(); barPivot.position.set(0, 1.34, 0.62); TW.add(barPivot);
    const barLen = TP.clone().sub(barPivot.position).length();
    { const g = new THREE.BoxGeometry(0.06, 0.05, barLen); g.translate(0, 0, barLen / 2); const m = new THREE.Mesh(g, E.paperMat("#b9b2a2", { rough: 0.5 })); m.castShadow = true; barPivot.add(m); }
    const dirTP = TP.clone().sub(barPivot.position).normalize(); const strikeAng = Math.atan2(-dirTP.y, dirTP.z); // rotation.x that aims +z at TP
    // ribbon spools
    const spools = [-1.7, 1.7].map((x) => { const sp = new THREE.Group(); sp.position.set(x, 1.55, -1.2); TW.add(sp);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.16, 26), [E.paperMat("#2b2f45"), E.paperMat("#3a3550"), E.paperMat("#2b2f45")]); m.castShadow = true; sp.add(m);
      const spoke = E.box(0.9, 0.04, 0.12, "#d9cdb4"); spoke.position.y = 0.1; sp.add(spoke); return sp; });
    // carriage: platen, knobs, bail, return lever, the paper
    const CG = new THREE.Group(); TW.add(CG);
    { const platen = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 6.3, 32), E.paperMat(INKC)); platen.rotation.z = Math.PI / 2; platen.position.set(0, 1.85, -0.75); platen.castShadow = true; CG.add(platen);
      [-3.3, 3.3].forEach((x) => { const k = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.34, 24), E.paperMat("#2f3550")); k.rotation.z = Math.PI / 2; k.position.set(x, 1.85, -0.75); k.castShadow = true; CG.add(k); });
      const guide = E.box(1.6, 0.05, 0.05, "#c9c1ad"); guide.position.set(0, 2.08, -0.34); TW.add(guide);
      const rail = E.box(6.6, 0.16, 0.5, "#232a42"); rail.position.set(0, 1.42, -1.25); CG.add(rail); }
    const retLever = new THREE.Group(); retLever.position.set(-3.45, 2.05, -0.55); CG.add(retLever);
    { const m = E.box(0.08, 0.08, 1.1, "#c9c1ad"); m.position.z = 0.5; retLever.add(m); }
    // the paper: canvas page with clipping at the platen (paper wraps around it)
    const PW = 5.2, PH = 6.76, PX = 1024, PY = 1331, CHAR = 26, X0 = 92, LINE0 = 700, LH = 64;
    const pc = document.createElement("canvas"); pc.width = PX; pc.height = PY; const pg = pc.getContext("2d");
    const ptex = new THREE.CanvasTexture(pc); ptex.colorSpace = THREE.SRGBColorSpace; ptex.anisotropy = 8;
    const paperClip = new THREE.Plane(V(0, 1, 0), 0);
    const paperMatF = new THREE.MeshStandardMaterial({ map: ptex, emissiveMap: ptex, emissive: 0xffffff, emissiveIntensity: 0.55, roughness: 0.95, bumpMap: E.bumpTex, bumpScale: 0.2, clippingPlanes: [paperClip] });
    const paperMatB = new THREE.MeshStandardMaterial({ color: C.cream, map: E.paperTex, roughness: 0.95, side: THREE.BackSide, clippingPlanes: [paperClip] });
    const BETA = 0.3; const paperPivot = new THREE.Group(); paperPivot.position.copy(TP); paperPivot.rotation.x = -BETA; CG.add(paperPivot);
    const paperG = new THREE.PlaneGeometry(PW, PH); const paper = new THREE.Group(); paperPivot.add(paper);
    { const f = new THREE.Mesh(paperG, paperMatF), b = new THREE.Mesh(paperG, paperMatB); f.castShadow = true; f.receiveShadow = true; paper.add(f, b); }
    const Lx = (c) => ((X0 + c * CHAR) / PX - 0.5) * PW, Ly = (cy) => (0.5 - cy / PY) * PH;
    const U = V(0, Math.cos(BETA), -Math.sin(BETA)), N = V(0, Math.sin(BETA), Math.cos(BETA)); // paper up + normal (world, TW at origin)

    // ---------------- the quote, typed in sync with the VO ----------------
    const LINES = ["Thus the first ultraintelligent", "machine is the last invention", "that man need ever make, provided", "that the machine is docile enough", "to tell us how to keep it under", "control."];
    const anchors = [null, null, null, null, null, null, "the last", "last", "invention", "that man", "man need", "need ever", "ever make", "make", "provided", "that the machine", "the machine", "machine is",
      "is docile", "docile", "enough", "to tell", "tell", "us how", "how to", "to keep", "keep", "it under", "under", "control"];
    const CH = []; { // char schedule: {ch, line, col, t}
      const words = []; LINES.forEach((ln, li) => { let col = 0; ln.split(" ").forEach((w) => { words.push({ w, li, col }); col += w.length + 1; }); });
      const tA = W("The first"), tB = E.end("why", "would be");
      const n0 = words.slice(0, 6).reduce((a, w) => a + w.w.length + 1, 0); let k = 0;
      words.forEach((w, i) => { let s, d;
        if (i < 6) { s = tA + (tB - tA) * (k / n0); d = (tB - tA) * (w.w.length / n0); k += w.w.length + 1; }
        else { s = W(anchors[i]); const nx = i + 1 < words.length ? W(anchors[i + 1]) : s + 0.6; d = Math.min(nx - s - 0.03, w.w.length * 0.07 + 0.05); }
        for (let j = 0; j < w.w.length; j++) CH.push({ ch: w.w[j], line: w.li, col: w.col + j, t: s + d * (j / w.w.length), word: i }); }); }
    const DOC = CH.filter((c) => c.word === 19);
    const jr = E.rng(65); CH.forEach((c) => { c.dy = (jr() - 0.5) * 3; c.a = 0.72 + jr() * 0.28; c.key = Math.floor(jr() * KEYS.length); });
    let lastDraw = "";
    const drawPaper = (n, dim, glowDoc) => { const key = n + "|" + dim.toFixed(2); if (key === lastDraw) return; lastDraw = key;
      const g = pg; g.fillStyle = C.cream; g.fillRect(0, 0, PX, PY);
      if (dim > 0) { g.fillStyle = `rgba(14,16,30,${0.72 * dim})`; g.fillRect(0, 0, PX, PY);
        const d0 = DOC[0], d1 = DOC[DOC.length - 1]; const cx = (X0 + (d0.col + d1.col) / 2 * CHAR), cy = LINE0 + d0.line * LH - 14;
        const gr = g.createRadialGradient(cx, cy, 10, cx, cy, 190); gr.addColorStop(0, `rgba(255,222,170,${0.95 * dim})`); gr.addColorStop(0.55, `rgba(255,214,160,${0.55 * dim})`); gr.addColorStop(1, "rgba(255,214,160,0)");
        g.fillStyle = gr; g.fillRect(cx - 200, cy - 200, 400, 400); }
      g.font = '46px "Instrument Serif"'; g.textAlign = "center"; g.textBaseline = "alphabetic";
      for (let i = 0; i < n; i++) { const c = CH[i]; const isDoc = c.word === 19;
        g.fillStyle = `rgba(24,20,30,${c.a * (isDoc ? 1 : 1 - 0.8 * dim)})`; g.fillText(c.ch, X0 + c.col * CHAR, LINE0 + c.line * LH + c.dy); }
      ptex.needsUpdate = true; };
    const typedAt = (t) => { let n = 0; while (n < CH.length && CH[n].t <= t) n++; return n; };
    // carriage state (pure function of t): column + line, with a quick carriage return
    const carriage = (t) => { const n = typedAt(t);
      if (n === 0) return { col: 0, line: 0 };
      const last = CH[n - 1], next = CH[n];
      let col = last.col + 1, line = last.line;
      if (next && next.line !== last.line) { const tr = last.t + 0.05, d = Math.max(0.06, Math.min(0.26, next.t - tr - 0.01)); const k = inOut(lin(tr, tr + d, t)); col = lerp(col, 0, k); line = lerp(line, next.line, k); }
      return { col, line }; };

    // ---------------- the lamp (amber hero light, 1965) ----------------
    const LAMP = new THREE.Group(); LAMP.position.set(-5.6, 0, -2.3); scene.add(LAMP);
    { const base = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.18, 32), E.paperMat("#1a1c2c")); base.position.y = 0.09; base.castShadow = true; LAMP.add(base);
      const arm = (a, b) => { const v = b.clone().sub(a); const m = E.box(0.12, v.length(), 0.12, "#262a3f"); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(V(0, 1, 0), v.normalize()); LAMP.add(m); };
      arm(V(0, 0.15, 0), V(-0.4, 3.8, -0.3)); arm(V(-0.4, 3.8, -0.3), V(2.0, 5.0, 0.9)); }
    const shade = new THREE.Group(); shade.position.set(2.1, 4.95, 0.95); LAMP.add(shade);
    const aimAt = V(0.6, 2.6, -0.2); // world
    { const cone = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.25, 36, 1, true), [new THREE.MeshStandardMaterial({ color: "#3a2a26", map: E.paperTex, roughness: 0.9, side: THREE.DoubleSide })][0]);
      cone.castShadow = true; shade.add(cone);
      const inner = new THREE.Mesh(new THREE.ConeGeometry(0.82, 1.2, 36, 1, true), new THREE.MeshBasicMaterial({ color: "#ffcf8f", side: THREE.BackSide })); inner.position.y = -0.02; shade.add(inner); shade.userData.inner = inner;
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), new THREE.MeshBasicMaterial({ color: "#fff1d6" })); bulb.position.y = -0.45; shade.add(bulb); shade.userData.bulb = bulb; }
    { const wp = new THREE.Vector3(); LAMP.updateMatrixWorld(true); shade.getWorldPosition(wp); const m = new THREE.Matrix4().lookAt(wp, aimAt, V(0, 1, 0)); shade.quaternion.setFromRotationMatrix(m); shade.rotateX(Math.PI / 2); }
    const spot = new THREE.SpotLight(C.amber, 70, 40, 0.62, 0.55, 1.6); spot.castShadow = true; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -0.0015; spot.shadow.radius = 4;
    spot.position.set(-3.5, 4.7, -1.35); spot.target.position.copy(aimAt); scene.add(spot, spot.target);
    const lampGlow = E.pointLight(C.amber, 6, 14); lampGlow.position.set(-3.4, 4.3, -1.0); scene.add(lampGlow);

    // ---------------- the loop: gears cutting bigger gears ----------------
    const gearShape = (r, T, d, hole = 0.22) => { const s = new THREE.Shape(); const n = T * 10;
      for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2; const tooth = clamp((Math.cos(T * a) + 0.15) * 2.2, 0, 1); const rr = r - d + d * tooth;
        const x = Math.cos(a) * rr, y = Math.sin(a) * rr; i ? s.lineTo(x, y) : s.moveTo(x, y); }
      const h = new THREE.Path(); h.absarc(0, 0, r * hole, 0, Math.PI * 2, true); s.holes.push(h);
      if (r > 0.6) for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + 0.3, hp = new THREE.Path(); hp.absarc(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.15, 0, Math.PI * 2, true); s.holes.push(hp); }
      return s; };
    const d0 = drumPos[G0I];
    const GR = [DR + 0.03, 0.72, 1.55, 3.3, 8.6], ANG = [55, 105, 40];
    const GC = [V(d0.x, d0.y, 0)];
    for (let i = 1; i < 4; i++) { const a = ANG[i - 1] * Math.PI / 180, dd = GR[i - 1] + GR[i]; GC.push(V(GC[i - 1].x + Math.cos(a) * dd, GC[i - 1].y + Math.sin(a) * dd, 0)); }
    { const dd = GR[3] + GR[4], a = Math.PI - Math.asin(clamp((15.5 - GC[3].y) / dd, -1, 1)); GC.push(V(GC[3].x + Math.cos(a) * dd, GC[3].y + Math.sin(a) * dd, 0)); }
    const GZ = BZ + 1.05;
    const CUT = [[tLoop - 0.05, 0.62], [tEach, 0.66], [tBuilds - 0.05, 0.8], [tBetter - 0.08, 1.15]]; // gear 1..4: [start, duration]
    const GEARS = [];
    const mkClip = () => [new THREE.Plane(V(0, 1, 0), 0), new THREE.Plane(V(0, 1, 0), 0)];
    const gearCol = ["#34496f", "#2f4268", "#2a3c5e", "#2c3f63"];
    { // gear 0: the drum grows teeth
      const m = E.extrude(gearShape(GR[0], 9, 0.08, 0.2), "#2a3656", 0.27);
      const g = new THREE.Group(); g.position.set(d0.x, d0.y, d0.z - 0.12); g.add(m); scene.add(g);
      const tick = E.box(0.06, GR[0] * 0.8, 0.05, "#d9cdb4"); tick.position.set(0, GR[0] * 0.4, 0.29); g.add(tick);
      GEARS.push({ g, r: GR[0], c: GC[0] }); }
    for (let i = 1; i < 4; i++) { const T = Math.round(GR[i] * 11); const m = E.extrude(gearShape(GR[i], T, Math.min(0.22, GR[i] * 0.12)), gearCol[i - 1], 0.22);
      const clip = mkClip(); m.material.forEach((mt) => { mt.clippingPlanes = clip; mt.clipShadows = true; });
      const g = new THREE.Group(); g.position.set(GC[i].x, GC[i].y, GZ); g.add(m);
      const hub = E.extrude(E.circleShape(GR[i] * 0.26), "#d9cdb4", 0.3); hub.material.forEach((mt) => (mt.clippingPlanes = clip)); hub.position.z = -0.04; g.add(hub);
      scene.add(g); GEARS.push({ g, r: GR[i], c: GC[i], clip, mats: [...m.material, ...hub.material] }); }
    // gear 4 = the eye. Its body is the eye's mask; a tooth ring sits around it.
    const ER = GR[4] - 0.55;
    const eye = E.machineEye({ R: ER, A: ER * 0.77, B: ER * 0.4, mask: "#17223b", lidHex: "#1b2843" });
    const EG = new THREE.Group(); EG.position.set(GC[4].x, GC[4].y, GZ - 0.25); scene.add(EG); EG.add(eye);
    const teethG = new THREE.Group(); EG.add(teethG);
    const ringS = gearShape(GR[4], 66, 0.7, 0); ringS.holes = []; { const h = new THREE.Path(); h.absarc(0, 0, ER - 0.25, 0, Math.PI * 2, true); ringS.holes.push(h); }
    const ring = E.extrude(ringS, "#1b2843", 0.3); ring.position.z = 0.05; teethG.add(ring);
    { const clip = mkClip(); const mats = []; EG.traverse((o) => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((mt) => { mt.clippingPlanes = clip; mats.push(mt); }); });
      GEARS.push({ g: EG, r: GR[4], c: GC[4], clip, mats }); }
    // cutting spark (cyan): a small glow + light that runs around the rim while a gear is cut
    const spark = new THREE.Group(); scene.add(spark);
    const sparkGlow = new THREE.Mesh(new THREE.CircleGeometry(0.16, 20), new THREE.MeshBasicMaterial({ color: C.cyanPale })); spark.add(sparkGlow);
    const sparkHalo = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.34, 24), new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.6 })); spark.add(sparkHalo);
    const sparkLight = E.pointLight(C.cyan, 0, 12); spark.add(sparkLight);
    // master gear phase: all gears mesh; the train slows to a stop (eye level) during "bang"
    const tStopA = tMost + 0.4, tStopB = tBang + 0.3, WD = 1.5;
    const phase = (t) => { const D = tStopB - tStopA; if (t >= tStopB) return 0; if (t >= tStopA) { const x = (t - tStopA) / D; return -D * Math.pow(1 - x, 3) / 3; } return -((tStopA - t) + D / 3); };
    const gearSign = [1, -1, 1, -1, 1];
    const setClip = (G, a0, phi, t) => { // reveal the sector [a0, a0+phi] around world centre
      const c = G.g.position; const p0 = G.clip[0], p1 = G.clip[1];
      if (phi >= Math.PI * 2 - 1e-3) { p0.set(V(0, 0, 1), 1e4); p1.set(V(0, 0, 1), 1e4); G.mats.forEach((m) => (m.clipIntersection = false)); return; }
      const n0 = V(-Math.sin(a0), Math.cos(a0), 0), a1 = a0 + phi, n1 = V(Math.sin(a1), -Math.cos(a1), 0);
      p0.set(n0, -n0.dot(c)); p1.set(n1, -n1.dot(c)); const uni = phi > Math.PI; G.mats.forEach((m) => (m.clipIntersection = uni)); };

    // ---------------- the switch + a tiny human (wow) ----------------
    const SWH = new THREE.Group(); SWH.position.set(6.6, 0, 4.2); scene.add(SWH);
    const SW = new THREE.Group(); SWH.add(SW); SW.rotation.y = -0.18; SW.scale.setScalar(1.2);
    { const plate = E.extrude(E.roundRectShape(4.4, 6.8, 0.4), "#d6ccb6", 0.32); plate.position.set(0, 3.4, 0); SW.add(plate);
      const slot = E.extrude(E.roundRectShape(0.9, 2.2, 0.3), "#0b0d16", 0.06); slot.position.set(0, 3.4, 0.31); SW.add(slot);
      [5.95, 0.85].forEach((y) => { const sc = E.extrude(E.circleShape(0.2), "#9c937f", 0.08); sc.position.set(0, y, 0.31); SW.add(sc); const sl = E.box(0.3, 0.05, 0.06, "#3a3630"); sl.position.set(0, y, 0.4); sl.rotation.z = 0.6; SW.add(sl); }); }
    const lever = new THREE.Group(); lever.position.set(0, 3.4, 0.36); SW.add(lever);
    { const s = E.roundRectShape(0.5, 2.5, 0.22); const m = E.extrude(s, "#efe6d2", 0.5); m.position.set(0, 1.25, -0.25); lever.add(m);
      const tip = E.extrude(E.roundRectShape(0.62, 0.42, 0.18), "#efe6d2", 0.6); tip.position.set(0, 2.5, -0.3); lever.add(tip); }
    const human = E.figure({ pose: "stand", hair: "short", scale: 1.3, seed: 3 }); human.position.set(5.0, 0, 6.9); scene.add(human);
    const spill = E.pointLight(C.amber, 0, 24); spill.position.set(1.0, 5.5, 11); scene.add(spill);
    const LEV_DOWN = Math.PI - 0.62, LEV_UP = 0.62;

    // eye light (shadowed) for the wake
    const eyeSpot = new THREE.SpotLight(C.cyan, 0, 120, 0.75, 0.7, 1.1); eyeSpot.castShadow = true; eyeSpot.shadow.mapSize.set(1024, 1024); eyeSpot.shadow.bias = -0.002; eyeSpot.shadow.radius = 5;
    eyeSpot.position.set(GC[4].x, GC[4].y, GZ + 2); eyeSpot.target.position.set(3, 0, 22); scene.add(eyeSpot, eyeSpot.target);
    const eyeFill = E.pointLight(C.cyan, 0, 60); eyeFill.position.set(GC[4].x, GC[4].y - 4, GZ + 8); scene.add(eyeFill);

    // ---------------- the report page (unfolds out of the closed eye's slit) ----------------
    const RPX = 2048, RPY = 1152;
    const rc = document.createElement("canvas"); rc.width = RPX; rc.height = RPY; drawReport(rc.getContext("2d"), RPX, RPY, E.rng);
    const rtex = new THREE.CanvasTexture(rc); rtex.colorSpace = THREE.SRGBColorSpace; rtex.anisotropy = 8;
    const repMat = new THREE.MeshStandardMaterial({ map: rtex, emissiveMap: rtex, emissive: 0xffffff, emissiveIntensity: REP_EMI, roughness: 0.95, bumpMap: E.bumpTex, bumpScale: 0.15 });
    const repBack = new THREE.MeshStandardMaterial({ color: C.cream, map: E.paperTex, roughness: 0.95, side: THREE.BackSide });
    const half = (top) => { const g = new THREE.PlaneGeometry(16, 4.5); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) * 0.5 + (top ? 0.5 : 0)); g.translate(0, top ? 2.25 : -2.25, 0);
      const pv = new THREE.Group(); const f = new THREE.Mesh(g, repMat), b = new THREE.Mesh(g, repBack); f.castShadow = true; pv.add(f, b); return pv; };
    const PAGEC = V(GC[4].x, GC[4].y, GZ + 0.75);
    const REP = new THREE.Group(); REP.position.copy(PAGEC); scene.add(REP);
    const hTop = half(true), hBot = half(false); REP.add(hTop, hBot);
    const pct = pctPlane(THREE, E); pct.mesh.position.set(PCT_X, PCT_Y, 0.02); hTop.add(pct.mesh);
    const pageLight = E.pointLight("#fff2dc", 0, 40); pageLight.position.set(PAGEC.x + 2, PAGEC.y + 3, PAGEC.z + 10); scene.add(pageLight);
    const tTick0 = tNumber;

    // ---------------- DOM ----------------
    const stamp = E.stampDOM(E.layer, [{ t: tYear, year: "1965", label: "England" }], tMost - 0.2);
    const src = E.srcDOM(E.layer, { big: "I. J. Good", small: "“Speculations Concerning the First Ultraintelligent Machine” (1965)", inAt: tGood + 0.1, outAt: tHis - 0.1 });

    // ---------------- camera ----------------
    const tw = (t) => { const s = carriage(t); return -Lx(s.col); };
    const PC0 = TP.clone().addScaledVector(U, 1.75); PC0.x = tw(T0) + 0.0; // visible paper centre at the start
    const tc1 = { x: tw(tDocile) + Lx(16) }, tc2 = { x: tw(tControlEnd + 0.3) + Lx(16) };
    const ey = GC[4];
    const PAGE_P = PAGEC.clone().add(V(0, 0, E.PAGE.dist));
    const camKeys = [
      { t: T0, p: PC0.clone().addScaledVector(N, 4.1).toArray(), l: PC0.toArray() },
      { t: T0 + 1.1, p: PC0.clone().addScaledVector(N, 4.9).toArray(), l: PC0.toArray(), ease: "smooth" },
      { t: tTuringEnd(E) + 0.2, p: [7.8, 5.8, 13.5], l: [-0.6, 2.7, -3.2] },
      { t: tImag + 1.6, p: [5.4, 4.5, 10.2], l: [0.2, 2.9, -2.6], ease: "sine" },
      { t: tDocile - 2.6, p: [tc1.x + 1.6, TP.y + 1.7, 6.6], l: [tc1.x - 0.2, TP.y + 0.75, -0.6], arc: 0.4 },
      { t: tControlEnd + 0.4, p: [tc2.x + 0.6, TP.y + 1.9, 6.4], l: [tc2.x, TP.y + 0.85, -0.6], ease: "sine" },
      { t: tHis + 0.3, p: [tc2.x + 0.5, TP.y + 1.95, 6.0], l: [tc2.x, TP.y + 0.9, -0.6], ease: "sine" },
      { t: tLoop + 0.3, p: [9.6, 8.2, 2.5], l: [GC[1].x, GC[1].y, BZ], arc: 0.3 },
      { t: tBuilds + 0.2, p: [12.5, 10.5, 5.5], l: [GC[2].x + 0.5, GC[2].y + 0.8, BZ], arc: 0.5 },
      { t: tBetter + 1.0, p: [8.5, 11, 18], l: [GC[3].x - 3, GC[3].y + 1.5, BZ], arc: 0.4 },
      { t: tSwitch - 0.4, p: [5.6, 2.1, 26.5], l: [2.8, 10.9, -5], ease: "sine" },
      { t: tIf, p: [5.2, 2.3, 24.5], l: [2.7, 11.2, -5], ease: "sine" },
      { t: tThatEnd + 0.3, p: [ey.x - 0.6, ey.y - 2.5, 14], l: [ey.x, ey.y - 0.4, GZ], ease: "sine" },
      { t: tReportEnd - 0.6, p: [PAGE_P.x + 0.3, PAGE_P.y + 0.15, PAGE_P.z + 1.4], l: PAGEC.toArray(), ease: "sine" },
      { t: T1, p: PAGE_P.toArray(), l: PAGEC.toArray(), ease: "smooth" },
    ];
    function tTuringEnd(E) { return E.end("why", "Turing"); }

    const post = { bloom: 0.4, exposure: 1.15 };
    let _wp = new THREE.Vector3();

    return {
      scene, camera, post,
      update(t) {
        st.update(t);
        back.forEach((m, i) => { m.position.x = (i === 0 ? -6 : 0) + 0.25 * Math.sin(t * (0.17 + i * 0.05) + i); });
        updDrums(t);

        // --- typing ---
        const n = typedAt(t); const dim = smooth(tControlEnd + 0.05, tControlEnd + 0.75, t) * (1 - smooth(tLoop, tEach, t) * 0.0);
        drawPaper(n, dim); paperMatF.emissiveIntensity = lerp(1.0, 0.55, smooth(T0 + 0.6, T0 + 4.5, t)) * (1 - 0.88 * smooth(tEach, tBetter + 1.2, t));
        const cs = carriage(t);
        CG.position.x = -Lx(cs.col);
        paper.position.y = -Ly(LINE0 + cs.line * LH + 12) - 7.2 * inOut(lin(tBetter + 0.6, tMost + 1.2, t)); // the typewriter swallows the page
        // clip below the platen (world plane through TP, normal = paper up)
        paperClip.setFromNormalAndCoplanarPoint(U, TP.clone().addScaledVector(U, -0.02));
        let strike = 0; for (let k = Math.max(0, n - 1); k <= Math.min(CH.length - 1, n); k++) { const dt = t - CH[k].t; const s = dt < -0.04 ? 0 : dt < 0 ? 1 + dt / 0.04 : dt < 0.07 ? 1 - dt / 0.07 : 0; strike = Math.max(strike, s); }
        barPivot.rotation.x = lerp(0.12, strikeAng, Math.pow(strike, 0.7));
        const kd = new THREE.Object3D();
        KEYS.forEach((k, i) => { let press = 0; for (let j = Math.max(0, n - 2); j < Math.min(CH.length, n + 1); j++) if (CH[j].key === i) { const dt = t - CH[j].t; press = Math.max(press, dt > -0.04 && dt < 0.09 ? 1 - Math.abs(dt - 0.01) / 0.09 : 0); }
          kd.position.set(k.x, k.y - 0.07 * press, k.z); kd.rotation.x = 0.5; kd.updateMatrix(); keys.setMatrixAt(i, kd.matrix); }); keys.instanceMatrix.needsUpdate = true;
        retLever.rotation.y = -0.5 * Math.max(0, Math.sin(Math.PI * clamp(cs.col < 1 && n > 0 && n < CH.length && CH[n].col === 0 ? 1 - cs.col : 0, 0, 1)));
        spools.forEach((s, i) => (s.rotation.y = (i ? -1 : 1) * (0.05 * t + n * 0.04)));

        // --- lamp: steady with a breath, dims for "bang", dies on the switch ---
        const flick = 1 + 0.03 * Math.sin(t * 13.1) * Math.sin(t * 3.7) + 0.02 * wob(t, 2, 3);
        const lampK = (1 - 0.35 * smooth(tPicture, tBang, t)) * (t < tSwitch + 0.02 ? 1 : t < tSwitch + 0.09 ? 0.35 : 0) * (1 - smooth(tControlEnd + 0.1, tControlEnd + 0.7, t) * 0.25 + smooth(tHis, tLoop, t) * 0.25);
        spot.intensity = 70 * lampK * flick; spill.intensity = 14 * lampK * flick * smooth(tLoop, tBetter + 1, t); lampGlow.intensity = 6 * lampK * flick;
        shade.userData.bulb.material.color.set("#fff1d6").multiplyScalar(0.15 + 0.85 * lampK); shade.userData.inner.material.color.set("#ffcf8f").multiplyScalar(0.12 + 0.88 * lampK);
        spot.angle = 0.62 - 0.22 * smooth(tControlEnd + 0.05, tControlEnd + 0.8, t) * (1 - smooth(tHis, tLoop, t));

        // --- gears ---
        const P = phase(t);
        const w0 = 2.2; let ang = P * w0 * 0;
        GEARS.forEach((G, i) => { const ratio = GR[0] / G.r; const a = gearSign[i] * P * w0 * ratio * 1.0;
          if (i === 4) { G.g.rotation.z = a + 0.004 * Math.sin(t * 0.9); } else G.g.rotation.z = a + (i === 0 ? d0.ph : 0); });
        // gear 0 teeth come in on "loop"
        GEARS[0].g.scale.setScalar(lerp(0.92, 1, expoOut(lin(tLoop - 0.3, tLoop + 0.2, t)))); GEARS[0].g.visible = true;
        let sk = 0; spark.visible = false;
        for (let i = 1; i < 5; i++) { const G = GEARS[i]; const [ts, du] = CUT[i - 1]; const k = lin(ts, ts + du, t);
          G.g.visible = t >= ts;
          const a0 = Math.atan2(GC[i - 1].y - GC[i].y, GC[i - 1].x - GC[i].x); const phi = Math.PI * 2 * sineInOut(k);
          if (G.g.visible) setClip(G, a0, Math.max(0.001, phi), t);
          if (k > 0 && k < 1) { spark.visible = true; sk = 1; const a = a0 + phi; spark.position.set(GC[i].x + Math.cos(a) * G.r, GC[i].y + Math.sin(a) * G.r, GZ + 0.5);
            sparkLight.intensity = 9 + 4 * Math.sin(t * 40); sparkHalo.scale.setScalar(0.8 + 0.4 * Math.sin(t * 31)); } }
        // fresh gears glow cyan at their edges, cooling as the next is cut
        GEARS.slice(1, 4).forEach((G, j) => { const ts = CUT[j][0]; const glow = smooth(ts, ts + 0.3, t) * (1 - smooth(ts + 0.9, ts + 2.4, t)); G.mats[0].emissive = G.mats[0].emissive || new THREE.Color(); G.mats[0].emissive.set(C.cyan); G.mats[0].emissiveIntensity = 0.1 * glow; G.mats[1].emissive.set(C.cyan); G.mats[1].emissiveIntensity = 0.9 * glow; });
        // gear 4 (the eye): teeth fold away during "bang"; the disc becomes the eye
        const tf = inOut(lin(tBang - 0.2, tBang + 0.7, t)); teethG.scale.setScalar(lerp(1, (ER - 0.3) / GR[4], tf)); teethG.visible = tf < 0.99;
        // eye: slit leak on the flip, lids open on "wakes", close on "won't"
        const leak = smooth(tSwitch + 0.08, tSwitch + 0.5, t) * (1 - smooth(tLooks + 0.2, tLooks + 0.9, t));
        const open = expoOut(lin(tWakes - 0.05, tWakes + 0.75, t)) * (1 - inOut(lin(tWont, tThatEnd + 0.15, t)));
        const glow = open * (0.85 + 0.15 * Math.sin(t * 2.3));
        eye.userData.update(t, { open, glow, leak: leak * (0.85 + 0.15 * Math.sin(t * 9)) });
        eye.scale.setScalar(1 + 0.012 * open * Math.sin(t * 1.7));
        eyeSpot.intensity = 260 * open + 30 * leak * (1 - open); eyeFill.intensity = 30 * open + 14 * leak;
        post.bloom = 0.4 + 0.55 * open + 0.15 * leak * (1 - open);

        // --- switch + human ---
        const pop = spring(lin(tPicture - 0.1, tPicture + 1.0, t)); SWH.visible = t > tPicture - 0.12; SWH.rotation.x = -Math.PI / 2 * (1 - pop) + 0.006 * Math.sin(t * 0.7) * pop;
        const hp = spring(lin(tPicture + 0.15, tPicture + 1.15, t)); human.visible = t > tPicture + 0.12; human.rotation.x = -Math.PI / 2 * (1 - hp);
        const ft = t - tSwitch; let la;
        if (ft < -0.25) la = LEV_DOWN; else if (ft < 0) la = LEV_DOWN + 0.1 * Math.sin(Math.PI * (ft + 0.25) / 0.25); else la = lerp(LEV_DOWN, LEV_UP, Math.min(1.06, E.backOut(lin(0, 0.1, ft), 1.6)));
        lever.rotation.x = la + 0.004 * Math.sin(t * 1.3);
        human.userData.pose(t, { lookUp: 0.15 + 0.45 * smooth(tSwitch, tWakes + 0.5, t), lean: -0.6 * smooth(tWakes, tWakes + 0.8, t) + 0.25 * smooth(tPicture, tBang, t), armDown: 0.2 });
        human.position.x = 5.0 - 0.45 * inOut(lin(tWakes, tWakes + 0.9, t));

        // --- report page: unfolds from the slit ---
        const u = lin(tLooks + 0.05, tLooks + 1.25, t); const ue = 1 - Math.pow(1 - u, 3) + 0.04 * Math.sin(Math.PI * u) * (1 - u);
        REP.visible = t >= tLooks + 0.04;
        hTop.rotation.x = Math.PI / 2 * (1 - ue); hBot.rotation.x = -Math.PI / 2 * (1 - ue);
        REP.position.z = PAGEC.z + 0.4 * Math.sin(Math.PI * u);
        pct.draw(t, tTick0);
        pageLight.intensity = 22 * smooth(tLooks, tLooks + 1.2, t);

        // --- camera ---
        const cam = E.camPath(camKeys, t, { arc: 0.1, drift: 0.8, push: 0.4, seed: 2 });
        // land exactly on the PAGE framing for the cut (carrier contract)
        const kEnd = smooth(T1 - 1.4, T1, t); cam.p.lerp(PAGE_P, kEnd); cam.l.lerp(PAGEC, kEnd);
        // the very start sits on the page full-frame
        const kSt = 1 - smooth(T0, T0 + 0.5, t); if (kSt > 0) { const p0 = PC0.clone().addScaledVector(N, 4.1 - 0.15 * (t - T0)); cam.p.lerp(p0, kSt); cam.l.lerp(PC0, kSt); }
        E.applyCam(camera, cam, 0.01 * Math.sin(t * 0.31) * (1 - kEnd));

        stamp.update(t); src.update(t);
      },
    };
  },
};

// ---------- shared with s03 (keep identical): report page + its % figure ----------
const REP_EMI = 0.5, PCT_X = 5.75, PCT_Y = 1.25;
export function drawReport(g, w, h, rngF) {
  const r = rngF(77); g.fillStyle = "#efe6d2"; g.fillRect(0, 0, w, h);
  const ink = "#1f1d26", grey = "rgba(31,29,38,0.30)", M = 150, colW = 620, gap = 80, x1 = M, x2 = M + colW + gap, marg = w - M - 330;
  g.fillStyle = ink; g.font = '72px "Instrument Serif"'; g.textBaseline = "alphabetic"; g.fillText("2026", M, 178);
  g.fillStyle = grey; g.fillRect(M + 190, 146, 360, 20); g.fillRect(M + 190, 178, 220, 12);
  g.fillStyle = ink; g.fillRect(M, 215, marg - M - 60, 4);
  const para = (x, y0, y1) => { let y = y0, k = 0; while (y < y1) { const last = k % 6 === 5; g.fillStyle = grey; g.fillRect(x, y, colW * (last ? 0.35 + r() * 0.3 : 0.82 + r() * 0.18), 13); y += last ? 70 : 38; k++; } };
  para(x1, 280, h - 150);
  para(x2, 280, 560);
  // small chart: bars + a rising line (deep cyan = machine share)
  const cx = x2, cy = 960, cw = colW, ch = 330;
  g.strokeStyle = ink; g.lineWidth = 3; g.beginPath(); g.moveTo(cx, cy - ch); g.lineTo(cx, cy); g.lineTo(cx + cw, cy); g.stroke();
  for (let i = 0; i < 9; i++) { const v = 0.12 + i * i * 0.0105 + r() * 0.03; g.fillStyle = "rgba(31,29,38,0.22)"; g.fillRect(cx + 26 + i * 66, cy - ch * v, 40, ch * v); }
  g.strokeStyle = "#0a6f8c"; g.lineWidth = 6; g.beginPath(); for (let i = 0; i <= 40; i++) { const x = i / 40; const y = 0.08 + 0.78 * Math.pow(x, 2.2); i ? g.lineTo(cx + 20 + x * (cw - 40), cy - ch * y) : g.moveTo(cx + 20, cy - ch * y); } g.stroke();
  g.fillStyle = "#0a6f8c"; g.beginPath(); g.arc(cx + cw - 20, cy - ch * 0.86, 10, 0, Math.PI * 2); g.fill();
  // margin column: hairline + bracket pointing at a paragraph line
  g.fillStyle = "rgba(31,29,38,0.5)"; g.fillRect(marg, 250, 2, h - 400);
  g.strokeStyle = "#0a6f8c"; g.lineWidth = 3; g.beginPath(); g.moveTo(marg - 40, 352); g.lineTo(marg - 14, 352); g.lineTo(marg - 14, 470); g.lineTo(marg - 40, 470); g.stroke();
  g.fillStyle = "rgba(31,29,38,0.3)"; g.fillRect(marg + 40, 690, 220, 11); g.fillRect(marg + 40, 720, 160, 11);
  g.fillStyle = "rgba(31,29,38,0.55)"; g.font = '40px "Instrument Serif"'; g.fillText("14", w / 2 - 20, h - 70);
}
export function pctValue(t, t0) { return t < t0 ? 38 : Math.min(60, 38 + Math.floor((t - t0) / 0.42)); }
export function pctPlane(THREE, E) {
  const c = document.createElement("canvas"); c.width = 512; c.height = 256; const g = c.getContext("2d");
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshStandardMaterial({ map: tex, emissiveMap: tex, emissive: 0xffffff, emissiveIntensity: REP_EMI, roughness: 0.95, transparent: true });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), mat);
  let last = "";
  const draw = (t, t0) => { const v = pctValue(t, t0); const tk = t0 + (v - 38) * 0.42; const k = t < t0 ? 1 : E.expoOut(E.clamp((t - tk) / 0.22, 0, 1));
    const key = v + "|" + k.toFixed(3); if (key === last) return; last = key;
    g.clearRect(0, 0, 512, 256); g.fillStyle = "#efe6d2"; g.fillRect(0, 0, 512, 256);
    g.save(); g.beginPath(); g.rect(0, 20, 512, 216); g.clip();
    g.fillStyle = "#0a6f8c"; g.font = '190px "Instrument Serif"'; g.textBaseline = "alphabetic"; g.textAlign = "left";
    const y = 200; if (k < 1 && v > 38) g.fillText((v - 1) + "%", 110, y - k * 200); g.fillText(v + "%", 110, y + (1 - k) * 200); g.restore();
    g.beginPath(); g.moveTo(40, 150); g.lineTo(80, 150); g.lineTo(60, 112); g.closePath(); g.fill();
    tex.needsUpdate = true; };
  return { mesh, draw };
}
export const REPORT = { REP_EMI, PCT_X, PCT_Y };
