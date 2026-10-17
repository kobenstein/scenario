// s08 · The builders want the brake (endings section, "Here's what surprised me" → end of section 5).
// Dawn paper city. Starts inside a gold window light (carrier from s07), cranes up above the towers.
// REVEAL 2 (wow): roof hatches open on every tower and tiny amber figures step out holding paper sheets;
// the sheets fold into paper planes and glide to a domed building at the horizon, whose windows light up.
// The camera dives into one tower window: a giant paper flywheel slows and stops, dust motes hang in the sunbeam.
// It pans to the workbench by the back window: a half-built paper brake lever. Ends at eye level with the bench edge
// as a horizon line at 60 % frame height, dawn sky above (carrier to s09).
export default {
  build(E, def) {
    const { THREE, C, PAL, lin, smooth, lerp, clamp, expoOut, inOut, sineInOut, spring, antic } = E;
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const scene = new THREE.Scene();
    const camera = E.newCamera();
    const A = (p, n = 1) => E.at("endings", p, n);
    const T = {
      from: def.from, to: def.to,
      heres: A("Here's what"), surprised: A("surprised"), loudest: A("loudest"), outsiders: A("outsiders"),
      inJuly: A("In July", 2), thousand: A("thousand"), people: A("people who"), labs: A("biggest AI labs"), wrote: A("wrote"), gov: A("government"),
      asked: A("They asked"), back: A("back an"), international: A("international"), effort: A("effort"), build: A("build exactly"), tools: A("tools"),
      deliberately: A("deliberately"), pace: A("pace AI"), builds: A("builds AI"),
      and: A("And OpenAI's"), training: A("training pauses"), pauses: A("pauses"), august: A("August"), september: A("September"),
      labsAlmost: A("Labs almost"), never: A("never"), so: A("So the"), brake: A("break"), fantasy: A("fantasy"), it: A("It just"), built: A("built"), yet: A("yet"),
    };
    const P = PAL.dawn;
    const R = E.rng(808);

    // ---------- stage ----------
    const st = E.stage(scene, P, { stars: 0, clouds: true, seed: 23, skyZ: -122, skyY: 42, orb: { r: 6.5, x: 40, y: 12, hex: "#ffd28a", glow: 1.3 } });
    const canvasTex = (w, h, draw) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d"); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
    const haloTex = canvasTex(256, 256, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.25, "rgba(255,255,255,0.5)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    haloTex.colorSpace = THREE.NoColorSpace;
    const beamTex = canvasTex(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "rgba(255,255,255,0.9)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    beamTex.colorSpace = THREE.NoColorSpace;
    const addMat = (hex, tex, fog = false) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex), map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog });
    const halo = (size, hex) => new THREE.Mesh(new THREE.PlaneGeometry(size, size), addMat(hex, haloTex));
    const sunHalo = halo(46, "#ffb070"); sunHalo.position.set(40, 12, -117); sunHalo.material.opacity = 0.8; scene.add(sunHalo);
    const city = E.city(scene, P, { zs: [-104, -96, -90], holes: [0, 0.03, 0.05], heights: [[6, 12], [5, 10], [4, 8]], width: 140, seed: 41, popAt: -1000 });
    const bx = (w, h, d, hex) => E.box(w, h, d, hex);

    // ---------- lights ----------
    const L = E.lights(scene, P, { key: [35, 30, 45], target: [0, 8, -20], intensity: 2.5, hemi: 1.0, box: 40 });
    L.hemi.groundColor.set("#4a3050");
    const keyOut = V3(35, 30, 45).normalize();
    const SUNP = V3(40, 12, -118);

    // ---------- towers (paper boxes with lit windows and a roof hatch) ----------
    const SPEC = [
      [-14, -4, 9, 20], [24, -4, 9, 22], [-26, -20, 9, 28], [-6, -22, 10, 30], [16, -24, 9, 27], [34, -22, 9, 32],
      [-38, -38, 9, 24], [-17, -40, 9, 33], [4, -42, 10, 26], [24, -42, 9, 30], [43, -40, 9, 25],
    ];
    const towers = SPEC.map(([x, z, w, h], i) => {
      const d = 7, g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g); const r = E.rng(300 + i);
      const li = Math.min(5, 1 + Math.floor((-z) / 14)); const hex = P.layers[li];
      const s = E.rectShape(w, h, 0, h / 2); const startWin = i === 1 ? { x: 0, y: 6.2, w: 2.4, h: 1.8 } : null;
      for (let y = 1.6; y < h - 1.6; y += 1.9) for (let xx = -w / 2 + 0.9; xx < w / 2 - 1.3; xx += 1.35) {
        if (startWin && Math.abs(xx + 0.3 - startWin.x) < 2.0 && Math.abs(y + 0.5 - startWin.y) < 1.8) continue;
        if (r() < 0.6) { const hp = new THREE.Path(); hp.moveTo(xx, y); hp.lineTo(xx + 0.6, y); hp.lineTo(xx + 0.6, y + 0.95); hp.lineTo(xx, y + 0.95); hp.closePath(); s.holes.push(hp); } }
      if (startWin) { const hp = new THREE.Path(), q = startWin; hp.moveTo(q.x - q.w / 2, q.y - q.h / 2); hp.lineTo(q.x + q.w / 2, q.y - q.h / 2); hp.lineTo(q.x + q.w / 2, q.y + q.h / 2); hp.lineTo(q.x - q.w / 2, q.y + q.h / 2); hp.closePath(); s.holes.push(hp); }
      const front = E.extrude(s, hex, 0.3); front.position.z = d / 2 - 0.3; g.add(front);
      const body = bx(w - 0.1, h, d - 0.8, hex); body.position.set(0, h / 2, -0.4); g.add(body);
      const back = E.glowPlane(w - 0.6, h - 1.2, "#ffffff"); back.position.set(0, h / 2, d / 2 - 0.45); g.add(back);
      back.material.color.set("#ffb87a").multiplyScalar(0.55 + 0.25 * r());
      let sw = null; if (startWin) { sw = E.glowPlane(startWin.w + 0.4, startWin.h + 0.4, "#ffd9a8"); sw.position.set(startWin.x, startWin.y, d / 2 - 0.4); sw.userData.setGlow(1.25); g.add(sw); }
      // roof hatch with a door that opens
      const hx = -w / 2 + 1.5, hz = -d / 2 + 1.6;
      const hut = bx(1.8, 2.0, 1.8, P.layers[Math.max(0, li - 1)]); hut.position.set(hx, h + 1.0, hz); g.add(hut);
      const hutIn = E.glowPlane(0.8, 1.4, "#ffc58a"); hutIn.position.set(hx + 0.2, h + 0.75, hz + 0.91); hutIn.userData.setGlow(0.05); g.add(hutIn);
      const piv = new THREE.Group(); piv.position.set(hx - 0.2, h, hz + 0.92); g.add(piv);
      const leaf = bx(0.82, 1.42, 0.06, P.layers[Math.max(0, li - 2)]); leaf.position.set(0.41, 0.71, 0.03); piv.add(leaf);
      return { x, z, w, h, d, g, back, sw, hutIn, piv, hx, hz, open: T.inJuly + 0.2 + R() * 1.6 + Math.max(0, -z - 4) * 0.02 };
    });

    // ---------- hero tower: hollow, a room with the flywheel and the workbench ----------
    const HT = { x: 6, z: -6, w: 12, d: 10, h: 24, floor: 10, ceil: 15.6 };
    const hero = new THREE.Group(); hero.position.set(HT.x, 0, HT.z); scene.add(hero);
    const HEX = P.layers[1], HEXD = P.layers[3];
    const RW = { x: 2.5, y: 12.6, w: 3.4, h: 2.4 }; // room window on the front
    {
      const s = E.rectShape(HT.w, HT.h, 0, HT.h / 2); const r = E.rng(77);
      for (let y = 1.6; y < HT.h - 1.6; y += 1.9) for (let xx = -HT.w / 2 + 0.9; xx < HT.w / 2 - 1.3; xx += 1.35) {
        if (y + 0.95 > HT.floor - 0.2 && y < HT.ceil + 0.2) continue;
        if (r() < 0.6) { const hp = new THREE.Path(); hp.moveTo(xx, y); hp.lineTo(xx + 0.6, y); hp.lineTo(xx + 0.6, y + 0.95); hp.lineTo(xx, y + 0.95); hp.closePath(); s.holes.push(hp); } }
      const hole = (q) => { const hp = new THREE.Path(); hp.moveTo(q.x - q.w / 2, q.y - q.h / 2); hp.lineTo(q.x + q.w / 2, q.y - q.h / 2); hp.lineTo(q.x + q.w / 2, q.y + q.h / 2); hp.lineTo(q.x - q.w / 2, q.y + q.h / 2); hp.closePath(); return hp; };
      s.holes.push(hole(RW)); [-3.4, -1.0].forEach((xx) => s.holes.push(hole({ x: xx, y: 12.6, w: 1.4, h: 2.0 })));
      const fr = E.extrude(s, HEX, 0.3); fr.position.z = HT.d / 2 - 0.3; hero.add(fr);
      [[HT.floor - 0.6, 1.0, HT.floor - 0.4], [HT.h - 0.6, HT.ceil + 0.2, HT.h - 0.4]].forEach(([top, bot]) => { const gp = E.glowPlane(HT.w - 0.6, top - bot, "#ffffff"); gp.position.set(0, (top + bot) / 2, HT.d / 2 - 0.45); gp.material.color.set("#ffb87a").multiplyScalar(0.6); hero.add(gp);
        const blk = bx(HT.w - 0.4, top - bot, 0.2, HEXD); blk.position.set(0, (top + bot) / 2, HT.d / 2 - 0.65); hero.add(blk); });
      // sides, back (with the big bench window), roof, room floor & ceiling
      [-1, 1].forEach((sd) => { const w = bx(0.3, HT.h, HT.d, HEX); w.position.set(sd * (HT.w / 2 - 0.15), HT.h / 2, 0); hero.add(w); });
      const bs = E.rectShape(HT.w, HT.h, 0, HT.h / 2); bs.holes.push(hole({ x: 3.0, y: 13.0, w: 5.0, h: 3.6 }));
      const bk = E.extrude(bs, HEXD, 0.3); bk.position.z = -HT.d / 2; hero.add(bk);
      const mull = bx(0.12, 3.6, 0.2, HEXD); mull.position.set(3.0, 13.0, -HT.d / 2 + 0.15); hero.add(mull);
      const roof = bx(HT.w, 0.3, HT.d, HEXD); roof.position.set(0, HT.h, 0); hero.add(roof);
      const fl = bx(HT.w - 0.6, 0.3, HT.d - 0.6, "#7a4f70"); fl.position.set(0, HT.floor - 0.15, 0); hero.add(fl);
      const ce = bx(HT.w - 0.6, 0.3, HT.d - 0.6, "#4d3350"); ce.position.set(0, HT.ceil + 0.15, 0); hero.add(ce);
      // lower/upper interior fills so nothing reads as empty through the side windows
      const bwIn = bx(HT.w - 0.6, HT.ceil - HT.floor, 0.1, "#94627e"); bwIn.position.set(-2.5, (HT.floor + HT.ceil) / 2, -HT.d / 2 + 0.35); bwIn.scale.x = 0.45; hero.add(bwIn);
    }
    const heroHut = (() => { const h = bx(1.8, 2.0, 1.8, P.layers[0]); h.position.set(-HT.w / 2 + 1.5, HT.h + 1.0, -HT.d / 2 + 1.6); hero.add(h);
      const inn = E.glowPlane(0.8, 1.4, "#ffc58a"); inn.position.set(-HT.w / 2 + 1.7, HT.h + 0.75, -HT.d / 2 + 2.51); hero.add(inn);
      const piv = new THREE.Group(); piv.position.set(-HT.w / 2 + 1.3, HT.h, -HT.d / 2 + 2.52); hero.add(piv); const lf = bx(0.82, 1.42, 0.06, P.layers[1]); lf.position.set(0.41, 0.71, 0.03); piv.add(lf);
      return { inn, piv }; })();

    // the flywheel (training run) inside
    const FW = V3(HT.x - 3.2, 12.75, HT.z - 2.0);
    const wheel = new THREE.Group(); wheel.position.copy(FW); scene.add(wheel);
    const wheelMats = [];
    { const rim = E.extrude(E.ringShape(2.05, 2.45), "#e8d2c4", 0.35); wheel.add(rim); wheelMats.push(rim.material[1]);
      rim.material[1] = new THREE.MeshStandardMaterial({ color: "#2a6f80", emissive: new THREE.Color(C.cyan), emissiveIntensity: 0.6, roughness: 0.8 }); wheelMats.push(rim.material[1]);
      for (let k = 0; k < 8; k++) { const sp = bx(0.22, 4.1, 0.2, "#d9bfb0"); sp.rotation.z = k / 8 * Math.PI; sp.position.z = 0.1; wheel.add(sp); }
      const hub = E.extrude(E.circleShape(0.55), "#7a4f70", 0.5); hub.position.z = -0.05; wheel.add(hub);
      const cap = E.extrude(E.circleShape(0.22), C.cyan, 0.2, { emissive: 0.6 }); cap.position.z = 0.45; wheel.add(cap); wheelMats.push(cap.material[0]); }
    const axle = bx(0.3, 0.3, 1.4, "#4d3350"); axle.position.set(FW.x, FW.y, FW.z - 0.7); scene.add(axle);
    const stand = E.extrude(E.polyShape([[-1.6, 0], [1.6, 0], [0.35, 2.75], [-0.35, 2.75]]), "#603f5f", 0.3); stand.position.set(FW.x, HT.floor, FW.z - 0.9); scene.add(stand);
    const wheelLight = E.pointLight(C.cyan, 0, 9); wheelLight.position.set(FW.x + 1, FW.y, FW.z + 2.5); scene.add(wheelLight);
    // the workbench by the back window, with the half-built brake lever
    const BN = { x: HT.x + 3.0, y: HT.floor + 1.3, z: HT.z - 3.9 };
    const benchTop = 0.12;
    const bench = new THREE.Group(); bench.position.set(BN.x, 0, BN.z); scene.add(bench);
    { const top = bx(4.6, benchTop, 1.4, "#a87660"); top.position.set(0, BN.y - benchTop / 2, 0); bench.add(top);
      const front = bx(4.6, 0.5, 0.08, "#6e4664"); front.position.set(0, BN.y - 0.37, 0.66); bench.add(front);
      [[-2.1, 0.55], [2.1, 0.55], [-2.1, -0.55], [2.1, -0.55]].forEach(([x, z]) => { const l = bx(0.14, 1.3, 0.14, "#4d3350"); l.position.set(x, HT.floor + 0.65, z); bench.add(l); });
      const shelf = bx(4.2, 0.08, 1.1, "#6e4664"); shelf.position.set(0, HT.floor + 0.35, 0); bench.add(shelf); }
    const Y0 = BN.y;
    const lever = new THREE.Group(); lever.position.set(-0.6, Y0, -0.1); bench.add(lever);
    { const base = bx(1.5, 0.12, 0.7, "#c9a3a8"); base.position.set(0, 0.06, 0); lever.add(base);
      [-0.18, 0.18].forEach((zz) => { const br = E.extrude(E.polyShape([[-0.35, 0], [0.35, 0], [0.12, 0.7], [-0.12, 0.7]]), "#efe6d2", 0.06); br.position.set(0.2, 0.12, zz - 0.03); lever.add(br); });
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 12), new THREE.MeshStandardMaterial({ color: "#3b2c22", roughness: 0.5 })); pin.rotation.x = Math.PI / 2; pin.position.set(0.2, 0.7, 0); lever.add(pin);
      const armG = new THREE.Group(); armG.position.set(0.2, 0.7, 0); armG.rotation.z = 0.45; lever.add(armG);
      const arm = E.extrude(E.roundRectShape(2.6, 0.2, 0.08), "#efe6d2", 0.1); arm.position.set(1.2, 0, -0.05); armG.add(arm);
      const grip = E.extrude(E.roundRectShape(0.7, 0.3, 0.12), C.amber, 0.16, { emissive: 0.35 }); grip.position.set(2.35, 0, -0.08); armG.add(grip);
      lever.userData.arm = armG; }
    // loose parts: brake shoe, bolts, a template sheet with dashed outline
    const shoe = E.extrude((() => { const s = new THREE.Shape(); s.absarc(0, 0, 0.6, 0.2, Math.PI - 0.2, false); s.absarc(0, 0, 0.42, Math.PI - 0.2, 0.2, true); return s; })(), "#c47a5a", 0.18);
    shoe.position.set(1.2, Y0 + 0.01, 0.2); shoe.rotation.set(0, 0, 0); bench.add(shoe);
    const bolts = [0, 1, 2].map((k) => { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.24, 10), new THREE.MeshStandardMaterial({ color: "#3b2c22", roughness: 0.5 })); b.rotation.z = Math.PI / 2; b.position.set(1.7 + k * 0.22, Y0 + 0.06, -0.25 + k * 0.08); bench.add(b); return b; });
    const tmpl = E.drawnCard({ w: 1.6, h: 1.1, px: 256, hex: "#f3e6d4", draw: (g, w, h) => { g.strokeStyle = "#8a5a4a"; g.lineWidth = 4; g.setLineDash([10, 8]); g.beginPath(); g.moveTo(30, h - 40); g.lineTo(w - 40, 40); g.stroke(); g.beginPath(); g.arc(70, h - 60, 30, 0, Math.PI * 2); g.stroke(); } });
    tmpl.rotation.x = -Math.PI / 2; tmpl.rotation.z = 0.15; tmpl.position.set(-1.4, Y0 + 0.02, 0.15); bench.add(tmpl);
    const benchLamp = E.pointLight(C.amber, 6, 7); benchLamp.position.set(BN.x - 1, BN.y + 1.6, BN.z + 1.5); scene.add(benchLamp);
    // sunbeam through the back window, dust motes hanging in it
    const beams = [0, 1, 2].map((k) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(4.6 - k * 0.8, 9), addMat("#ffcf96", beamTex, true)); m.rotation.x = -Math.PI / 2 + 0.12 + k * 0.1; m.rotation.y = 0.08;
      m.position.set(HT.x + 3.0, 13.4 - k * 0.5 - 4.5 * Math.sin(0.12 + k * 0.1), HT.z - HT.d / 2 + 4.5); m.material.opacity = 0.18; scene.add(m); return m; });
    const NM = 90; const motes = new THREE.InstancedMesh(new THREE.CircleGeometry(0.028, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color("#fff0d0").multiplyScalar(1.6), transparent: true, opacity: 0.9, depthWrite: false }), NM);
    const moteS = []; for (let i = 0; i < NM; i++) moteS.push({ x: HT.x - 4.5 + R() * 9, y: HT.floor + 0.6 + R() * 4.6, z: HT.z - 4.4 + R() * 7.5, p: R() * 6.28, s: 0.4 + R() * 0.8 });
    scene.add(motes); motes.frustumCulled = false;

    // ---------- the dome at the horizon ----------
    const DM = { x: -2, z: -84 };
    const dome = new THREE.Group(); dome.position.set(DM.x, 9, DM.z); dome.scale.setScalar(1.45); scene.add(dome);
    const domeWins = [];
    { const hill = E.extrude((() => { const s = new THREE.Shape(); s.moveTo(-60, -8); for (let x = -60; x <= 60; x += 4) s.lineTo(x, 3.2 * Math.cos(x / 60 * Math.PI / 2) + 0.4 * Math.sin(x * 0.3) - 1.5 + 1.5 * Math.cos(x / 60 * Math.PI)); s.lineTo(60, -8); return s; })(), "#94627e", 0.3); hill.position.z = 1.5; dome.add(hill);
      const base = E.rectShape(30, 7, 0, 3.5 + 3); for (let k = -6; k <= 6; k++) { const hp = new THREE.Path(); hp.moveTo(k * 2.1 - 0.4, 4.2); hp.lineTo(k * 2.1 + 0.4, 4.2); hp.lineTo(k * 2.1 + 0.4, 8.6); hp.lineTo(k * 2.1 - 0.4, 8.6); hp.closePath(); base.holes.push(hp); }
      const bm = E.extrude(base, "#b07a8c", 0.5); dome.add(bm);
      const drum = E.rectShape(13, 3.6, 0, 10 + 1.8); for (let k = -2; k <= 2; k++) { const hp = new THREE.Path(); hp.moveTo(k * 2.4 - 0.35, 10.7); hp.lineTo(k * 2.4 + 0.35, 10.7); hp.lineTo(k * 2.4 + 0.35, 12.9); hp.lineTo(k * 2.4 - 0.35, 12.9); hp.closePath(); drum.holes.push(hp); }
      const dr = E.extrude(drum, "#b07a8c", 0.5); dr.position.z = -0.6; dome.add(dr);
      const dsh = new THREE.Shape(); dsh.moveTo(-6.2, 13.6); dsh.absarc(0, 13.6, 6.2, Math.PI, 0, true); dsh.lineTo(-6.2, 13.6);
      const dd = E.extrude(dsh, "#c48a96", 0.5); dd.position.z = -1.0; dome.add(dd);
      const lan = E.extrude(E.rectShape(1.6, 2.6, 0, 19.8 + 1.3), "#b07a8c", 0.4); lan.position.z = -0.9; dome.add(lan);
      const lc = E.extrude(E.circleShape(0.9, 0, 22.4), "#c48a96", 0.4); lc.position.z = -0.9; dome.add(lc);
      const ped = E.extrude(E.polyShape([[-16, 10], [16, 10], [0, 12.6]]), "#94627e", 0.4); ped.position.z = 0.2; dome.add(ped);
      [[0, 6.4, 0.05, 28, 4.4], [0, 11.8, -0.65, 12, 2.2]].forEach(([x, y, z, w, h]) => { const gp = E.glowPlane(w, h, "#ffc58a"); gp.position.set(x, y, z); gp.userData.setGlow(0.2); dome.add(gp); domeWins.push(gp); }); }
    const DOMEP = V3(DM.x, 22, DM.z + 0.8);

    // ---------- roof figures (instanced amber silhouettes) and sheets → paper planes ----------
    const figShape = (() => { const sh = [];
      const b = new THREE.Shape(); b.moveTo(-0.16, 0.98); b.lineTo(0.2, 0.98); b.quadraticCurveTo(0.3, 1.4, 0.26, 1.7); b.quadraticCurveTo(0.2, 1.82, 0.04, 1.84); b.quadraticCurveTo(-0.18, 1.82, -0.22, 1.66); b.quadraticCurveTo(-0.3, 1.3, -0.16, 0.98); sh.push(b);
      sh.push(E.circleShape(0.15, 0.06, 2.05)); sh.push(E.rectShape(0.08, 0.14, 0.06, 1.88));
      sh.push(E.polyShape([[-0.15, 1.0], [-0.0, 1.0], [-0.04, 0.04], [-0.16, 0.0], [-0.17, 0.04]])); sh.push(E.polyShape([[0.0, 1.0], [0.17, 1.0], [0.16, 0.04], [0.26, 0.0], [0.04, 0.0]]));
      sh.push(E.polyShape([[0.14, 1.72], [0.28, 1.66], [0.42, 2.3], [0.3, 2.34]])); sh.push(E.polyShape([[-0.16, 1.72], [-0.04, 1.7], [0.2, 2.32], [0.08, 2.36]]));
      return new THREE.ShapeGeometry(sh, 8); })();
    const figMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#c06a2e") });
    const FIG = [];
    towers.forEach((tw, ti) => { const n = 4 + (ti % 2); for (let k = 0; k < n; k++) FIG.push({ tw, x0: tw.x + tw.hx + 0.2, z0: tw.z + tw.hz + 1.0, x1: tw.x - tw.w / 2 + 1.0 + (k + 0.5) * (tw.w - 2) / n + (R() - 0.5) * 0.4, z1: tw.z + tw.d / 2 - 0.7 - R() * 1.6, y: tw.h, t0: tw.open + 0.35 + k * 0.38, ph: R() * 6 }); });
    const NF = FIG.length;
    const figs = new THREE.InstancedMesh(figShape, figMat, NF); figs.frustumCulled = false; scene.add(figs);
    // hero-roof figures with gestures
    const heroFigs = [0, 1, 2, 3].map((k) => { const f = E.figure({ pose: "stand", hair: ["bun", "short", "long", "short"][k], coat: k === 0, hex: "#c06a2e", scale: 1.0, seed: 40 + k }); scene.add(f);
      return { f, x0: HT.x - HT.w / 2 + 1.7, z0: HT.z - HT.d / 2 + 2.7, x1: HT.x - 3.6 + k * 2.4, z1: HT.z + HT.d / 2 - 0.8 - (k % 2) * 1.2, y: HT.h + 0.15, t0: T.inJuly + 0.9 + k * 0.4 }; });
    const NS = NF + heroFigs.length;
    // sheet ↔ plane geometry (CPU morph): A B C D M1 M2
    const SHEET = [[-0.5, 0.35, 0], [0.5, 0.35, 0], [0.5, -0.35, 0], [-0.5, -0.35, 0], [-0.5, 0, 0], [0.5, 0, 0]];
    const PLANE = [[-0.5, 0.06, 0.42], [0.52, 0.0, 0.03], [0.52, 0.0, -0.03], [-0.5, 0.06, -0.42], [-0.5, -0.12, 0], [0.56, -0.02, 0]];
    const pg = new THREE.BufferGeometry(); const pPos = new Float32Array(6 * 3); pg.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pg.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 1, 1, 1, 1, 0, 0, 0, 0, 0.5, 1, 0.5]), 2)); pg.setIndex([0, 4, 5, 0, 5, 1, 4, 3, 2, 4, 2, 5]);
    const setFold = (k) => { for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) pPos[i * 3 + j] = lerp(SHEET[i][j], PLANE[i][j], k); pg.attributes.position.needsUpdate = true; pg.computeVertexNormals(); };
    const sheetMat = new THREE.MeshStandardMaterial({ color: "#fff3e2", map: E.paperTex, side: THREE.DoubleSide, roughness: 0.9, emissive: new THREE.Color("#ffd9a8"), emissiveIntensity: 0.35 });
    const sheets = new THREE.InstancedMesh(pg, sheetMat, NS); sheets.frustumCulled = false; sheets.castShadow = true; scene.add(sheets);
    const SH = []; for (let i = 0; i < NS; i++) { const a = R(), b = R(), c = R(); SH.push({ launch: T.effort - 0.1 + a * 1.4, dur: 3.4 + b * 1.4, side: (c - 0.5) * 14, lift: 12 + a * 10, tgt: V3(DM.x + (b - 0.5) * 30, 15 + c * 11, DM.z + 1.5) }); }
    const FOLD0 = T.back - 0.05, FOLD1 = T.international + 0.35;
    const dObj = new THREE.Object3D(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), mtx = new THREE.Matrix4(), up = V3(0, 1, 0);

    // ---------- DOM ----------
    const fill = E.fillDOM(E.layer, "#ffd9a8");
    const src1 = E.srcDOM(E.layer, { big: "“Pacing the Frontier” letter, July 2026", small: "1,000+ lab employees", inAt: T.inJuly + 0.2, outAt: T.and - 0.6 });
    const src2 = E.srcDOM(E.layer, { big: "OpenAI training pauses", small: "Aug & Sept 2026", inAt: T.training, outAt: T.so - 0.2 });

    // ---------- camera ----------
    const SW = towers[1]; const swP = V3(SW.x, 6.2, SW.z + SW.d / 2);
    const HORIZ = 0.06; // tan(3.6°): bench edge sits at 60 % frame height
    const endP = V3(BN.x + 0.1, BN.y, BN.z + 5.4), endL = V3(BN.x + 0.1, BN.y + HORIZ * 6.0, BN.z - 0.6);
    const K = [
      { t: T.from, p: [swP.x, swP.y, swP.z + 0.7], l: [swP.x, swP.y, swP.z - 6] },
      { t: T.from + 0.9, p: [swP.x + 0.2, swP.y + 0.4, swP.z + 3.0], l: [swP.x, swP.y + 1.5, swP.z - 6], ease: "sine" },
      { t: T.outsiders, p: [17, 33, 44], l: [4, 20, -30], ease: "inOut", arc: 0.15 },
      { t: T.inJuly + 0.4, p: [15.5, 31.5, 38], l: [3, 21, -26], ease: "sine" },
      { t: T.gov, p: [12, 30, 25], l: [1, 22.5, -22], ease: "inOut", arc: 0.08 },
      { t: T.back + 0.3, p: [11, 29.4, 22.5], l: [1, 22.5, -22], ease: "sine" },
      { t: T.deliberately + 0.3, p: [2, 50, 30], l: [-1.5, 17, -84], ease: "inOut", arc: 0.1 },
      { t: T.and + 0.1, p: [1.8, 48.5, 26], l: [-1.5, 17.5, -84], ease: "sine" },
      { t: T.pauses + 0.3, p: [HT.x + RW.x, 13.0, HT.z + 9], l: [HT.x + RW.x - 0.5, 12.7, HT.z - 4], ease: "inOut", arc: 0.06 },
      { t: T.august + 0.5, p: [HT.x + 2.0, 12.9, HT.z + 3.3], l: [FW.x, FW.y - 0.1, FW.z], ease: "inOut", arc: 0.03 },
      { t: T.so - 0.1, p: [HT.x + 1.4, 12.85, HT.z + 2.6], l: [FW.x, FW.y - 0.1, FW.z], ease: "sine" },
      { t: T.fantasy + 0.6, p: [endP.x + 0.3, endP.y + 0.35, endP.z + 0.3], l: [endL.x - 0.2, endL.y + 0.1, endL.z], ease: "inOut", arc: 0.05 },
      { t: T.to, p: [endP.x, endP.y, endP.z], l: [endL.x, endL.y, endL.z], ease: "sine", arc: 0 },
    ];

    const post = { bloom: 0.5, exposure: 1.1 };
    const tmp = V3(0, 0, 0), tmp2 = V3(0, 0, 0);
    // flywheel angle: w0 until training, eases to 0 at "never"
    const W0 = 5.2, WA = T.training, WB = T.never + 0.1;
    const wheelAng = (t) => { if (t <= WA) return W0 * (t - WA); const x = clamp((t - WA) / (WB - WA), 0, 1); return W0 * (WB - WA) * (x - (x * x * x - x * x * x * x / 2)); };
    return {
      scene, camera, post,
      update(t) {
        st.update(t); city.update(t);
        const cam = E.camPath(K, t, { arc: 0.08, push: 0.25, seed: 3 }); E.applyCam(camera, cam);
        // key light: from the front-right outside, through the back window once we're inside
        const inside = smooth(T.pauses - 0.4, T.august, t);
        const sunDir = SUNP.clone().sub(V3(BN.x, BN.y + 2, BN.z)).normalize();
        const kd = keyOut.clone().lerp(sunDir, inside).normalize();
        const dist = cam.p.distanceTo(cam.l); L.key.target.position.copy(cam.l); L.key.position.copy(cam.l).addScaledVector(kd, 70);
        const bs = clamp(dist * 0.8, 9, 46); Object.assign(L.key.shadow.camera, { left: -bs, right: bs, top: bs, bottom: -bs, far: 160 }); L.key.shadow.camera.updateProjectionMatrix();
        L.key.intensity = lerp(2.5, 3.2, inside) * (1 + 0.015 * Math.sin(t * 1.3)); L.hemi.intensity = lerp(1.0, 0.75, inside);
        sunHalo.material.opacity = 0.75 + 0.06 * Math.sin(t * 0.9);

        // start window light (carrier) and window breathing
        if (SW.sw) SW.sw.userData.setGlow(1.25 + 0.05 * Math.sin(t * 2.3));
        towers.forEach((tw, i) => { const k = expoOut(lin(tw.open, tw.open + 0.7, t)); tw.piv.rotation.y = -k * 1.7 - 0.01 * Math.sin(t + i);
          tw.hutIn.userData.setGlow(0.05 + 1.2 * k); });
        { const k = expoOut(lin(T.inJuly + 0.6, T.inJuly + 1.3, t)); heroHut.piv.rotation.y = -k * 1.7; heroHut.inn.userData.setGlow(0.05 + 1.2 * k); }

        // roof figures step out, walk to the edge, hold the sheets up on "wrote"
        const raise = smooth(T.wrote - 0.2, T.wrote + 0.5, t);
        const folding = smooth(FOLD0, FOLD1, t);
        setFold(folding);
        FIG.forEach((f, i) => { const k = sineInOut(lin(f.t0, f.t0 + 1.6, t)); const vis = t > f.t0 - 0.05;
          const walking = k > 0 && k < 1 ? 1 : 0; const bob = walking * 0.04 * Math.abs(Math.sin(t * 7 + f.ph));
          const x = lerp(f.x0, f.x1, k), z = lerp(f.z0, f.z1, k), y = f.y + 0.15 + bob;
          dObj.position.set(x, vis ? y : -50, z); dObj.rotation.set(0, 0, 0.02 * Math.sin(t * 1.3 + f.ph)); dObj.scale.set(f.x1 < f.x0 && walking ? -1 : 1, 1, 1); dObj.updateMatrix(); figs.setMatrixAt(i, dObj.matrix);
          f.hand = V3(x + 0.3, y + 2.4 + 0.35 * raise + 0.05 * Math.sin(t * 2 + f.ph), z + 0.05); f.vis = vis; });
        figs.instanceMatrix.needsUpdate = true;
        heroFigs.forEach((h, k) => { const kk = sineInOut(lin(h.t0, h.t0 + 1.8, t)); const walking = kk > 0 && kk < 1 ? 1 : 0;
          h.f.position.set(lerp(h.x0, h.x1, kk), h.y, lerp(h.z0, h.z1, kk)); h.f.visible = t > h.t0 - 0.05;
          const arm = smooth(T.wrote - 0.3 + k * 0.1, T.wrote + 0.4 + k * 0.1, t) * (1 - smooth(SH[NF + k].launch - 0.2, SH[NF + k].launch + 0.4, t));
          h.f.userData.pose(t + k, { walk: walking, armUp: 0.55 * arm + 0.2 * (1 - walking) * (1 - arm), lookUp: 0.3 * smooth(T.effort, T.tools, t) });
          h.hand = V3(h.f.position.x + 0.32, h.y + 2.45 + 0.4 * arm, h.f.position.z + 0.05); h.vis = h.f.visible; });
        let arrived = 0;
        for (let i = 0; i < NS; i++) { const f = i < NF ? FIG[i] : heroFigs[i - NF]; const s = SH[i]; const hand = f.hand;
          let p, q; const flyK = lin(s.launch, s.launch + s.dur, t);
          if (flyK <= 0) { p = hand; qa.identity(); qb.setFromAxisAngle(up, Math.PI / 2); q = qa.clone().slerp(qb, folding); }
          else { const e = sineInOut(flyK); const c1 = hand.clone().lerp(s.tgt, 0.35).add(V3(s.side, s.lift, 0));
            const a1 = hand.clone().lerp(c1, e), b1 = c1.clone().lerp(s.tgt, e); p = a1.lerp(b1, e);
            const e2 = sineInOut(Math.min(1, flyK + 0.01)); const a2 = hand.clone().lerp(c1, e2), b2 = c1.clone().lerp(s.tgt, e2); const nx = a2.lerp(b2, e2);
            tmp.copy(nx).sub(p); if (tmp.lengthSq() < 1e-8) tmp.set(0, 0, -1); tmp.normalize();
            mtx.lookAt(V3(0, 0, 0), tmp, up); q = new THREE.Quaternion().setFromRotationMatrix(mtx).multiply(new THREE.Quaternion().setFromAxisAngle(up, Math.PI / 2));
            q.multiply(new THREE.Quaternion().setFromAxisAngle(V3(1, 0, 0), 0.25 * Math.sin(t * 2.3 + i)));
            if (flyK >= 1) arrived++; }
          const sc = (f.vis ? 1 : 0) * (flyK >= 1 ? 0 : 1 - smooth(0.93, 1, flyK)) * (i < NF ? 1 : 1.15) * (1 + 2.6 * smooth(0, 0.5, flyK));
          dObj.position.copy(p); dObj.quaternion.copy(q); dObj.scale.setScalar(Math.max(sc, 0.0001)); dObj.updateMatrix(); sheets.setMatrixAt(i, dObj.matrix); }
        sheets.instanceMatrix.needsUpdate = true;
        const domeK = arrived / NS; domeWins.forEach((w, k) => w.userData.setGlow((0.2 + 1.6 * domeK) * (1 + 0.04 * Math.sin(t * 3 + k))));

        // flywheel: slows and stops; after the stop only a tiny settle
        const settle = t > WB ? 0.03 * Math.exp(-(t - WB) * 1.5) * Math.sin((t - WB) * 7) : 0;
        wheel.rotation.z = -wheelAng(t) - settle;
        const spd = t < WA ? 1 : 1 - smooth(WA, WB, t);
        wheelMats[1].emissiveIntensity = 0.15 + 0.9 * spd; wheelMats[2].emissiveIntensity = 0.1 + 0.8 * spd; wheelLight.intensity = 6 * spd + 0.5;
        // motes: they drift with the wheel's draft, then hang in the light
        const draft = 0.25 + 0.75 * spd;
        for (let i = 0; i < NM; i++) { const m = moteS[i]; const tt = t * m.s;
          dObj.position.set(m.x + 0.25 * Math.sin(tt * 0.7 + m.p) + draft * 0.3 * Math.sin(tt * 2.1 + m.p), m.y + 0.18 * Math.sin(tt * 0.5 + m.p * 2) - 0.02 * t % 1 * 0, m.z + 0.2 * Math.cos(tt * 0.6 + m.p));
          dObj.quaternion.copy(camera.quaternion); dObj.scale.setScalar(0.7 + 0.5 * Math.sin(tt * 1.7 + m.p)); dObj.updateMatrix(); motes.setMatrixAt(i, dObj.matrix); }
        motes.instanceMatrix.needsUpdate = true; motes.material.opacity = 0.85 * inside;
        beams.forEach((b, k) => { b.material.opacity = (0.2 - k * 0.04) * (0.4 + 0.6 * inside) * (1 - 0.7 * smooth(T.so, T.fantasy + 0.6, t)) * (1 + 0.08 * Math.sin(t * 0.8 + k)); });
        benchLamp.intensity = 5 * (1 + 0.03 * Math.sin(t * 4.1));
        lever.userData.arm.rotation.z = 0.45 + 0.004 * Math.sin(t * 0.9);

        fill.update(1 - smooth(T.from + 0.05, T.from + 0.6, t));
        src1.update(t); src2.update(t);
        post.bloom = 0.5 + 0.2 * (1 - smooth(T.from, T.from + 1.2, t));
      },
    };
  },
};
