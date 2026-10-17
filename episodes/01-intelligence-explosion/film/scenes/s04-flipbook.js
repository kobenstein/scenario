// s04 · The flipbook (script section 3: "Picture a flipbook." → "But it has started.")
// Carrier in: the CLOSED flipbook, centred, cover facing camera, 45 % frame width, centre at 46 % from top. It opens.
// Through-line (one object hands to the next): book → disc pops off the page and becomes the METR marker → ruler →
// paper wall → layered city of gates → power plant (its tower clock) → two clocks → the measured hand stretches into
// the 80 % bar on a flipbook page → that page turns: the flipbook in the dark → push into the blank next page (PAGE).
// Wow moment: "All you see is motion." — the self-turning book whirls into a fan of blurred pages, cyan light pours out.
export default {
  build(E, def) {
    const { THREE, C, PAL, lin, smooth, clamp, lerp, expoOut, inOut, sineInOut, spring, wob } = E;
    const T0 = def.from, T1 = def.to;
    const W = (p, n = 1) => E.at("scenario", p, n);
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const pal = PAL.night;
    const scene = new THREE.Scene(); const camera = E.newCamera();

    // ---------------- word anchors ----------------
    const tm = {
      book: E.end("scenario", "flip book"), each: W("Each page is one"), gen: W("one generation"), decades: W("For decades"),
      people: W("people drew"), drew: W("drew every"), byHand: W("by hand"), now: W("Now the pages help"), help: W("help draw"),
      next: W("the next page"), eachOne: W("each one faster"), fasterThan: W("faster than the last"), flipSlow: W("Flip slowly"),
      read: W("read every page"), flipFast: W("Flip fast enough"), vanish: W("vanish all"), all: W("All you see is motion"),
      motion: W("motion How"), howFast: W("How fast is it flipping"), research: W("The research group"), metr: W("METR measures"),
      human: W("human working time"), y2024: W("twenty twenty-four that"), minutes: W("minutes of work"), byNow: W("By now it's hours"),
      hours: W("hours The length"), doubled: W("doubled roughly"), seven: W("seven months"), lately: W("lately even"),
      evenFaster: W("faster But"), but: W("But there's a serious"), serious: W("serious case"), loop: W("loop runs into"),
      walls: W("walls Princeton"), princeton: W("Princeton"), normal: W("normal technology"), powerful: W("Powerful yes"),
      slowed: W("slowed by"), inst: W("institutions"), rules: W("rules the need"), test: W("test things"), code: W("Code isn't"),
      exper: W("experiments need"), chips: W("chips power"), power: W("power and time"), time: W("time Feeling"),
      feeling: W("Feeling faster"), being: W("being faster"), nineteen: W("nineteen percent"), longer: W("longer while"),
      believing: W("believing"), twentyPct: W("twenty percent faster"), even: W("Even Anthropic"), anthropic: W("Anthropic calls"),
      numbers: W("productivity numbers"), almost: W("almost certainly"), over: W("overstatement I"), idont: W("I don't know how fast"),
      spin: W("spin Nobody"), nobody: W("Nobody does"), butIt: W("But it has started"), started: W("started Now"),
    };

    // ---------------- stage, sky, far city, light ----------------
    const stg = E.stage(scene, pal, { stars: 150, seed: 41 });
    const farCity = new THREE.Group(); farCity.position.x = -8; scene.add(farCity);
    const fc = E.city(farCity, pal, { popAt: -10, seed: 404, zs: [-46, -38, -30], holes: [0, 0.05, 0.14], heights: [[4, 8], [5, 10], [6, 12]], width: 52 });
    const LT = E.lights(scene, pal, { intensity: 2.1, hemi: 0.75, box: 30 });
    const keyCol0 = new THREE.Color(pal.key), keyColCool = new THREE.Color("#a9c4d4"), hemiCol0 = new THREE.Color(pal.hemiSky), hemiCool = new THREE.Color("#7f98a8");

    // ---------------- G2: everything past the wall, built facing local +z, turned to face -x (down the ruler) ----------------
    const X0 = 2.5;                 // ruler start (world x)
    const XW = X0 + 50.8, ZR = 1.0; // wall plane (world x) and ruler line (world z)
    const G2 = new THREE.Group(); G2.position.set(XW, 0, ZR); G2.rotation.y = -Math.PI / 2; scene.add(G2);
    const Lw = (x, y, z) => V3(XW - z, y, ZR + x); // G2 local -> world
    // second sky behind the city (faces down the ruler)
    const sky2 = E.stage({ add: (...o) => G2.add(...o) }, pal, { floor: false, stars: 110, clouds: true, seed: 77, skyZ: -78, skyY: 46 });

    // ---------------- helpers ----------------
    const paper = (hex, opts) => E.paperMats(hex, opts);
    const glow = (w, h, hex) => { const m = E.glowPlane(w, h, hex); m.userData.setGlow(0); return m; };
    const archPath = (cx, w, h, y0 = 0.02) => { const p = new THREE.Path(); const r = w / 2; p.moveTo(cx - r, y0); p.lineTo(cx + r, y0); p.lineTo(cx + r, h - r); p.absarc(cx, h - r, r, 0, Math.PI, false); p.lineTo(cx - r, y0); return p; };
    const rectPath = (x, y, w, h) => { const p = new THREE.Path(); p.moveTo(x, y); p.lineTo(x + w, y); p.lineTo(x + w, y + h); p.lineTo(x, y + h); p.lineTo(x, y); return p; };
    // a pop-up layer that stands up around its bottom edge (local copy of E.popLayer with controllable sway)
    const pops = [];
    const pop = (parent, z, popAt, dur, i, sway = 0.05) => { const h = new THREE.Group(); h.position.z = z; parent.add(h);
      const o = { h, popAt, update: (t) => { const up = spring(lin(popAt, popAt + dur, t)); h.visible = t >= popAt - 0.03;
        h.rotation.x = -Math.PI / 2 * (1 - up) + 0.005 * Math.sin(t * (0.55 + i * 0.13) + i * 1.7) * up; h.position.x = sway * Math.sin(t * (0.21 + i * 0.04) + i); } };
      pops.push(o); return o; };
    // skyline row with one special building in the middle (gate) and lit windows
    const row = ({ x0 = -30, x1 = 30, seed = 1, hMin = 4, hMax = 7, winP = 0.3, mid, archW = 1.5, archH = 2.4 }) => {
      const r = E.rng(seed); const s = new THREE.Shape(); s.moveTo(x0, -0.4); const holes = []; const blds = [];
      let x = x0; while (x < x1) { let b;
        if (x < mid.x0 && x + 7 > mid.x0) b = { x, w: mid.x0 - x, h: hMin + r() * (hMax - hMin) };
        else if (Math.abs(x - mid.x0) < 1e-6) b = { x, w: mid.x1 - mid.x0, h: mid.h, prof: mid.prof, special: true };
        else b = { x, w: Math.min(3 + r() * 4, x1 - x), h: hMin + r() * (hMax - hMin), roof: r() };
        blds.push(b); x += b.w; if (Math.abs(x - mid.x0) < 0.01) x = mid.x0; }
      blds.forEach((b) => { s.lineTo(b.x, b.h); if (b.prof) b.prof(s, b); else if (b.roof > 0.7 && b.w > 3) { s.lineTo(b.x + b.w * 0.5, b.h + b.w * 0.3); s.lineTo(b.x + b.w, b.h); } else if (b.roof > 0.5 && b.w > 3) { s.lineTo(b.x + b.w * 0.7, b.h); s.lineTo(b.x + b.w * 0.7, b.h + 1.1); s.lineTo(b.x + b.w * 0.82, b.h + 1.1); s.lineTo(b.x + b.w * 0.82, b.h); s.lineTo(b.x + b.w, b.h); } else s.lineTo(b.x + b.w, b.h);
        if (!b.special && b.w > 2.4) for (let wy = 1.0; wy < b.h - 0.9; wy += 1.25) for (let wx = b.x + 0.55; wx < b.x + b.w - 0.9; wx += 1.0) if (r() < winP) holes.push(rectPath(wx, wy, 0.42, 0.62)); });
      s.lineTo(x1, -0.4); s.lineTo(x0, -0.4); if (mid.holes) holes.push(...mid.holes); holes.push(archPath(0, archW, archH)); s.holes.push(...holes); return s; };

    // ================= THE FLIPBOOK (local, endlessly cycling pages) =================
    const BW = 4.2, BH = 3, PT = 0.012, NS = 14, SEG = 14, COVER = "#2c3f63";
    const PX = 512, PY = Math.round(512 * BH / BW);
    const JB = 500; // first page of the "book in the dark" run (the 80 % bar page)
    const book = new THREE.Group(); scene.add(book);
    { const back = E.box(BW + 0.16, BH + 0.16, 0.05, COVER); back.position.set(BW / 2 + 0.02, 0, -0.33); book.add(back);
      const blk = E.box(BW - 0.05, BH - 0.06, 0.2, "#ddd2bb"); blk.position.set(BW / 2, 0, -0.2); book.add(blk);
      const spine = E.box(0.12, BH + 0.16, 0.36, COVER); spine.position.set(-0.02, 0, -0.17); book.add(spine); }
    const blkL = E.box(BW - 0.05, BH - 0.06, 0.16, "#ddd2bb"); blkL.position.set(-BW / 2, 0, -0.2); book.add(blkL);
    const coverPiv = new THREE.Group(); coverPiv.position.set(0, 0, 0.035); book.add(coverPiv);
    { const cv = E.extrude(E.roundRectShape(BW + 0.16, BH + 0.16, 0.08), COVER, 0.05); cv.position.set(BW / 2 + 0.02, 0, -0.025); coverPiv.add(cv);
      const emb = E.extrude(E.ringShape(0.36, 0.42), "#3a5078", 0.02); emb.position.set(BW / 2 + 0.02, 0.05, 0.03); coverPiv.add(emb);
      const dot = E.extrude(E.circleShape(0.14), "#3a5078", 0.02); dot.position.set(BW / 2 + 0.02, 0.05, 0.03); coverPiv.add(dot); }
    const mkCanvas = () => { const c = document.createElement("canvas"); c.width = PX; c.height = PY; const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return { c, g: c.getContext("2d"), tex, key: "" }; };
    const slots = [];
    for (let s = 0; s < NS; s++) { const fr = mkCanvas(), bk = mkCanvas();
      const geo = new THREE.PlaneGeometry(BW, BH, SEG, 1); geo.translate(BW / 2, 0, 0); const base = geo.attributes.position.array.slice();
      const mf = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xbdb8ae, map: fr.tex, roughness: 0.9, bumpMap: E.bumpTex, bumpScale: 0.2, side: THREE.FrontSide }));
      const mb = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0xa9a49b, map: bk.tex, roughness: 0.9, side: THREE.BackSide }));
      mf.castShadow = mb.castShadow = true; mf.receiveShadow = mb.receiveShadow = true;
      const pivot = new THREE.Group(); pivot.add(mf, mb); book.add(pivot); slots.push({ pivot, geo, base, fr, bk, j: null }); }
    // ---- page art ----
    const discSpec = (j) => {
      if (j < 0) return null;
      if (j <= 2) return { style: "pencil", r: [26, 32, 38][j], cx: 0.5, cy: 0.5, rot: 0 };
      if (j <= 5) return { style: "machine", r: [46, 54, 62][j - 3], cx: 0.5, cy: 0.5, rot: j * 0.4 };
      if (j === JB) return { style: "bar" };
      if (j > JB + 4) return null;
      const k = j * 0.55; return { style: "iris", r: 66, cx: 0.5 + 0.15 * Math.sin(k), cy: 0.53 - 0.15 * Math.abs(Math.sin(k)), rot: j * 0.47 };
    };
    const drawDisc = (g, d, p, w, h) => {
      const cx = d.cx * w, cy = d.cy * h, r = d.r; if (p <= 0) return;
      if (d.style === "pencil") {
        const a = Math.min(1, p * 1.25);
        if (p > 0.78) { const f = (p - 0.78) / 0.22; g.globalAlpha = 0.85 * f; g.fillStyle = "#7fd3e6"; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
          g.globalAlpha = 0.5 * f; g.strokeStyle = "#2c6f80"; g.lineWidth = 1.5; for (let k = -r; k < r; k += 6) { g.beginPath(); g.moveTo(cx + k - r * 0.3, cy + r * 0.8); g.lineTo(cx + k + r * 0.3, cy - r * 0.8); g.stroke(); } g.globalAlpha = 1; }
        g.strokeStyle = "#34323a"; g.lineWidth = 3.2; g.lineCap = "round"; g.beginPath();
        for (let i = 0; i <= 64 * a; i++) { const an = -Math.PI / 2 + (i / 64) * Math.PI * 2; const rr = r + 1.4 * Math.sin(i * 1.7); const x = cx + rr * Math.cos(an), y = cy + rr * Math.sin(an); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
        return; }
      if (d.style === "machine") {
        const a = Math.min(1, p * 1.25);
        if (p > 0.7) { const f = (p - 0.7) / 0.3; g.globalAlpha = f; g.fillStyle = "#0b5466"; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
          g.fillStyle = "#1aa9c8"; g.beginPath(); g.arc(cx, cy, r * 0.62, 0, Math.PI * 2); g.fill(); g.fillStyle = "#05070c"; g.beginPath(); g.arc(cx, cy, r * 0.28, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1; }
        g.strokeStyle = "#1aa9c8"; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + a * Math.PI * 2); g.stroke(); return; }
      // iris (machine-drawn generations)
      g.fillStyle = "#0b5466"; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
      g.strokeStyle = "#1aa9c8"; g.lineWidth = r * 0.16; g.beginPath(); g.arc(cx, cy, r * 0.9, 0, Math.PI * 2); g.stroke();
      g.fillStyle = "#6fe3ff"; g.beginPath(); const n = 16; for (let i = 0; i <= n; i++) { const a1 = d.rot + (i / n) * Math.PI * 2, a2 = a1 + Math.PI / n;
        g.lineTo(cx + Math.cos(a1) * r * 0.78, cy + Math.sin(a1) * r * 0.78); g.lineTo(cx + Math.cos(a2) * r * 0.36, cy + Math.sin(a2) * r * 0.36); } g.fill();
      g.fillStyle = "#05070c"; g.beginPath(); g.arc(cx, cy, r * 0.33, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#f4fbff"; g.beginPath(); g.arc(cx + r * 0.22 * Math.cos(d.rot), cy - r * 0.22, r * 0.09, 0, Math.PI * 2); g.fill();
      // motion streak marks on the page edge (the "animation" tick) — tiny pencil registration marks
      g.strokeStyle = "rgba(60,58,66,0.35)"; g.lineWidth = 2; g.beginPath(); g.moveTo(w - 22, h - 18); g.lineTo(w - 10, h - 18); g.stroke();
    };
    const drawBar = (g, w, h, p) => {
      const x0 = w * 0.1, x1 = w * 0.9, y = h * 0.5, bh = h * 0.1;
      g.fillStyle = "#d9cfb8"; g.fillRect(x0, y - bh / 2, x1 - x0, bh);
      const fx = x0 + (x1 - x0) * 0.8 * p; g.fillStyle = "#1aa9c8"; g.fillRect(x0, y - bh / 2, fx - x0, bh);
      g.fillStyle = "#6fe3ff"; g.fillRect(x0, y - bh / 2, fx - x0, bh * 0.28);
      g.strokeStyle = "#2a2833"; g.lineWidth = 3; g.strokeRect(x0, y - bh / 2, x1 - x0, bh);
      for (let k = 0; k <= 10; k++) { const xx = x0 + (x1 - x0) * k / 10; g.beginPath(); g.moveTo(xx, y + bh / 2); g.lineTo(xx, y + bh / 2 + (k % 5 ? 7 : 13)); g.stroke(); }
      const tp = clamp((p - 0.55) / 0.45, 0, 1); if (tp > 0) { g.globalAlpha = tp; g.fillStyle = "#1c1a24"; g.font = '86px "Instrument Serif"'; g.textAlign = "right";
        g.fillText("80%", fx + 8, y - bh / 2 - 18); g.font = '46px "Instrument Serif"'; g.textAlign = "left"; g.fillText("*", fx + 12, y - bh / 2 - 58); g.globalAlpha = 1; }
      g.fillStyle = "rgba(40,38,48,0.55)"; g.font = '17px "Inter"'; g.textAlign = "left"; g.fillText("0", x0 - 4, y + bh / 2 + 36); g.textAlign = "right"; g.fillText("100", x1 + 6, y + bh / 2 + 36);
    };
    // drawing schedule (human hand: pages 1-2; machine: pages 3-5)
    const drawWin = { 1: [tm.people - 0.12, tm.drew + 0.62], 2: [tm.byHand + 0.3, tm.byHand + 1.02], 3: [tm.help - 0.38, tm.next], 4: [tm.next + 0.62, tm.eachOne - 0.06], 5: [tm.eachOne + 0.36, tm.fasterThan + 0.06] };
    const turnsA = [[tm.gen - 0.1, 0.85], [drawWin[1][1] + 0.08, 0.6], [drawWin[2][1] + 0.05, 0.45], [drawWin[3][1] + 0.08, 0.45], [drawWin[4][1] + 0.06, 0.36], [drawWin[5][1] + 0.04, 0.3]];
    const prog = (j, t) => { if (j === JB) return lin(tm.anthropic + 0.25, tm.numbers + 0.3, t); const w = drawWin[j]; return w ? lin(w[0], w[1], t) : 1; };
    const frontKey = (j, t) => { const d = discSpec(j); if (!d) return "b"; const p = prog(j, t); return d.style + j + ":" + Math.round(p * 120); };
    const paintFront = (s, j, t) => { const { g, c } = s.fr; g.fillStyle = C.cream; g.fillRect(0, 0, c.width, c.height); const d = discSpec(j);
      if (d) { if (d.style === "bar") drawBar(g, c.width, c.height, prog(j, t)); else drawDisc(g, d, prog(j, t), c.width, c.height); } s.fr.tex.needsUpdate = true; };
    const paintBack = (s, j) => { const { g, c } = s.bk; g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = C.cream; g.fillRect(0, 0, c.width, c.height); const d = discSpec(j);
      if (d && d.style !== "bar") { g.setTransform(-1, 0, 0, 1, c.width, 0); drawDisc(g, d, 1, c.width, c.height); g.setTransform(1, 0, 0, 1, 0, 0); } s.bk.tex.needsUpdate = true; };
    // flip index over time
    const rateA = (t) => { const k = [[tm.fasterThan, 3.6], [tm.flipSlow - 0.2, 5.2], [tm.flipSlow + 0.5, 1.35], [tm.flipFast, 1.35], [tm.vanish, 11], [tm.all + 0.1, 26], [tm.howFast, 28], [tm.howFast + 2.2, 2.2], [tm.howFast + 4, 1.4]];
      if (t <= k[0][0]) return k[0][1]; for (let i = 0; i < k.length - 1; i++) if (t < k[i + 1][0]) return lerp(k[i][1], k[i + 1][1], sineInOut(lin(k[i][0], k[i + 1][0], t))); return k.at(-1)[1]; };
    const tContA = turnsA.at(-1)[0] + turnsA.at(-1)[1];
    const flipA = (t) => { if (t < tContA) { let F = -0.5; turnsA.forEach(([a, d]) => (F += lin(a, a + d, t))); return F; }
      let F = turnsA.length - 0.5; const dt = 1 / 120; for (let x = tContA; x < t; x += dt) F += rateA(Math.min(x + dt * 0.5, t)) * Math.min(dt, t - x); return F; };
    const turnsB = [[tm.idont + 0.55, 0.7], [tm.spin - 0.45, 0.7], [tm.nobody + 0.1, 0.62], [tm.butIt - 0.25, 0.5], [tm.started - 0.52, 0.52]];
    const flipB = (t) => { let F = JB - 0.5; turnsB.forEach(([a, d]) => (F += lin(a, a + d, t))); return F; };
    const spreadAt = (t) => (t < tContA || t > 205 ? 1 : 1 + 4 * clamp((rateA(t) - 3) / 22, 0, 1));
    const updBook = (t) => {
      const B = t >= 205; const F = B ? flipB(t) : flipA(t); const spread = spreadAt(t); const F0 = Math.floor(F);
      for (let j = F0 - 6; j <= F0 + 7; j++) { const s = slots[((j % NS) + NS) % NS];
        if (s.j !== j) { s.j = j; s.fr.key = ""; paintBack(s, j); }
        const fk = frontKey(j, t); if (fk !== s.fr.key) { s.fr.key = fk; paintFront(s, j, t); }
        const k = clamp((F - j) / spread + 0.5, 0, 1); const e = lerp(sineInOut(k), k, clamp((spread - 1) / 3, 0, 1)); const ang = -Math.PI * e; s.pivot.rotation.y = ang;
        const d = F - j; s.pivot.position.z = k >= 1 ? 0.012 + Math.max(0, 7 - d) * PT : k <= 0 ? -Math.min(-d, 7) * PT : 0.11 + 0.02 * Math.sin(j);
        s.pivot.visible = !(k <= 0 && -d > 6.6) && (B || j >= 0);
        const a = s.geo.attributes.position; const curl = k > 0 && k < 1 ? 0.2 * (1 + 0.3 * (spread - 1)) : 0.015;
        for (let v = 0; v < a.count; v++) { const x = s.base[v * 3]; a.array[v * 3 + 2] = curl * Math.sin((x / BW) * Math.PI) * 0.5 * BW * Math.sin(-ang); }
        a.needsUpdate = true; s.geo.computeVertexNormals(); }
      const open = B ? 1 : smooth(tm.book - 0.3, tm.book + 0.85, t);
      coverPiv.rotation.y = -Math.PI * (0.995 * sineInOut(open)); coverPiv.position.z = lerp(0.035, -0.07, smooth(0.6, 1, open)); coverPiv.visible = !B; blkL.visible = open > 0.4; blkL.scale.z = 0.3 + 0.7 * (B ? 1 : clamp(F / 20, 0, 1));
      return F;
    };

    // ---------------- the amber hand with its pencil (human phase) ----------------
    const hand = new THREE.Group(); hand.scale.setScalar(1.35); book.add(hand);
    { const AMB = "#f0a456"; const n = V3(-0.707, 0.707, 0);
      const tip = E.extrude(E.polyShape([[0, 0], [0.13 * 0.707 + 0.035 * 0.707, 0.13 * 0.707 - 0.035 * 0.707], [0.13 * 0.707 - 0.035 * 0.707, 0.13 * 0.707 + 0.035 * 0.707]]), "#2a2630", 0.04); hand.add(tip);
      const pen = E.box(0.075, 1.0, 0.045, "#e8d6a6"); pen.position.set(0.63 * 0.707, 0.63 * 0.707, 0.02); pen.rotation.z = -Math.PI / 4; hand.add(pen);
      const sleeve = E.extrude(E.roundRectShape(2.0, 0.5, 0.12), "#2a3352", 0.08); sleeve.position.set(0.62 + 1.3 * 0.83, 0.5 - 1.3 * 0.56, 0.03); sleeve.rotation.z = Math.atan2(-0.56, 0.83); hand.add(sleeve);
      const cuff = E.extrude(E.roundRectShape(0.16, 0.66, 0.05), "#e7dcc3", 0.09); cuff.position.set(0.62 + 0.32 * 0.83, 0.5 - 0.32 * 0.56, 0.035); cuff.rotation.z = Math.atan2(-0.56, 0.83); hand.add(cuff);
      const mats = paper(AMB, { emissive: 0.22 });
      const palm = E.extrude(E.roundRectShape(0.62, 0.46, 0.2), AMB, 0.06, { mats }); palm.position.set(0.56, 0.46, 0.05); palm.rotation.z = 0.35; hand.add(palm);
      const index = E.extrude(E.roundRectShape(0.46, 0.13, 0.06), AMB, 0.05, { mats }); index.position.set(0.3 + n.x * 0.06, 0.3 + n.y * 0.06, 0.11); index.rotation.z = Math.PI / 4; hand.add(index);
      const thumb = E.extrude(E.roundRectShape(0.36, 0.14, 0.06), AMB, 0.05, { mats }); thumb.position.set(0.36, 0.2, 0.12); thumb.rotation.z = 0.12; hand.add(thumb);
      const knuckle = E.extrude(E.roundRectShape(0.34, 0.12, 0.06), "#d98b45", 0.04, { mats: paper("#d98b45", { emissive: 0.2 }) }); knuckle.position.set(0.5, 0.62, 0.115); knuckle.rotation.z = 0.5; hand.add(knuckle); }
    // motion-blur fan: translucent ghost pages sweeping round the spine while the book whirls
    const NG = 22; const ghosts = []; { const gg = new THREE.PlaneGeometry(BW, BH); gg.translate(BW / 2, 0, 0);
      for (let i = 0; i < NG; i++) { const m = new THREE.Mesh(gg, new THREE.MeshBasicMaterial({ color: i % 3 ? "#e8f6f4" : "#bdf1ff", transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }));
        m.position.z = 0.1; book.add(m); ghosts.push(m); } }
    const updGhosts = (t, fast, F) => ghosts.forEach((m, i) => { const ph = ((i / NG + F * 0.0137) % 1 + 1) % 1; m.rotation.y = -Math.PI * ph; m.visible = fast > 0.02;
      m.material.opacity = 0.11 * fast * Math.sin(Math.PI * ph) * (0.7 + 0.3 * Math.sin(i * 7.3 + t * 13)); });
    const lamp = E.pointLight("#ffb866", 0, 16, true); lamp.position.set(2.6, 5.2, 4.2); scene.add(lamp);
    const pageGlow = E.pointLight(C.cyan, 0, 14); scene.add(pageGlow);
    // machine "reach-over" beam: a dotted cyan line from the left page's disc to the pen point on the right page
    const NB = 44; const beam = new THREE.InstancedMesh(new THREE.CircleGeometry(0.028, 8), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyan).multiplyScalar(2.2) }), NB); book.add(beam);
    const beamTip = new THREE.Mesh(new THREE.CircleGeometry(0.06, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(C.cyanPale).multiplyScalar(3) })); book.add(beamTip);
    const dObj = new THREE.Object3D();
    const discBook = (j, mirror = false) => { const d = discSpec(j); const x = d.cx * BW, y = (0.5 - d.cy) * BH; return { x: mirror ? -x : x, y, r: d.r / PX * BW }; };
    const penPoint = (j, p) => { const d = discBook(j); const a = Math.min(1, p * 1.25); const an = -Math.PI / 2 + a * Math.PI * 2;
      let x = d.x + d.r * Math.cos(an), y = d.y - d.r * Math.sin(an);
      if (p > 0.78) { const f = (p - 0.78) / 0.22; x = d.x + d.r * 0.55 * Math.sin(f * 31) * (1 - f * 0.4); y = d.y + d.r * 0.5 * Math.cos(f * 23) * (1 - f * 0.4); }
      return { x, y }; };
    const updHand = (t) => {
      const tIn = tm.decades - 0.25, tOut = tm.now; const vis = t > tIn - 0.1 && t < tOut + 1.2; hand.visible = vis; if (!vis) return;
      const rest = { x: BW + 1.6, y: -0.9 }, off = { x: BW + 5.5, y: -4.5 };
      let x, y, lift = 0.6;
      const w1 = drawWin[1], w2 = drawWin[2];
      if (t < w1[0]) { const k = inOut(lin(tIn, w1[0], t)); const p0 = penPoint(1, 0); x = lerp(off.x, p0.x, k); y = lerp(off.y, p0.y, k); lift = 0.6 * (1 - smooth(w1[0] - 0.35, w1[0], t)); }
      else if (t < w1[1]) { const p = penPoint(1, prog(1, t)); x = p.x; y = p.y; lift = 0.0; }
      else if (t < w2[0]) { const k = lin(w1[1], w2[0], t); const a = penPoint(1, 1), b = penPoint(2, 0);
        const away = Math.sin(Math.PI * k); x = lerp(a.x, b.x, k) + away * 2.0; y = lerp(a.y, b.y, k) - away * 0.9; lift = 0.7 * away; }
      else if (t < w2[1]) { const p = penPoint(2, prog(2, t)); x = p.x; y = p.y; lift = 0; }
      else { const k = inOut(lin(w2[1] + 0.05, tOut + 1.1, t)); const a = penPoint(2, 1); x = lerp(a.x, off.x, k); y = lerp(a.y, off.y, k); lift = 0.8 * Math.sin(Math.PI * Math.min(1, k * 2)); }
      hand.position.set(x, y, 0.06 + lift); hand.rotation.z = 0.06 * Math.sin(t * 1.3) + 0.05 * lift; hand.rotation.y = -0.12 * lift;
    };
    const updBeam = (t) => { let on = 0, j = 0, p = 0; for (const jj of [3, 4, 5]) { const w = drawWin[jj]; if (t > w[0] - 0.15 && t < w[1] + 0.2) { j = jj; p = prog(jj, t); on = smooth(w[0] - 0.15, w[0] + 0.05, t) * (1 - smooth(w[1], w[1] + 0.2, t)); } }
      beam.visible = beamTip.visible = on > 0.01; if (!beam.visible) return 0;
      const src = discBook(j - 1, true); const tip = penPoint(j, p); const P0 = V3(src.x, src.y, 0.14), P2 = V3(tip.x, tip.y, 0.04), P1 = V3((src.x + tip.x) / 2, Math.max(src.y, tip.y) + 0.9, 1.1);
      for (let i = 0; i < NB; i++) { const u = i / (NB - 1); const uu = u * on; const q = P0.clone().multiplyScalar((1 - uu) ** 2).add(P1.clone().multiplyScalar(2 * (1 - uu) * uu)).add(P2.clone().multiplyScalar(uu * uu));
        dObj.position.copy(q); dObj.scale.setScalar(0.6 + 0.6 * Math.sin(u * Math.PI) + 0.25 * Math.sin(t * 20 - i)); dObj.updateMatrix(); beam.setMatrixAt(i, dObj.matrix); }
      beam.instanceMatrix.needsUpdate = true; beamTip.position.set(tip.x, tip.y, 0.05); beamTip.scale.setScalar(0.8 + 0.3 * Math.sin(t * 25)); return on; };

    // ================= METR ruler + marker =================
    const RL = 92, RWd = 0.95;
    const rc = document.createElement("canvas"); rc.width = 8192; rc.height = 96; { const g = rc.getContext("2d"); const u = 8192 / RL;
      g.fillStyle = "#e9dfc8"; g.fillRect(0, 0, 8192, 96);
      const bands = [[0, 5, "#e3d6bb", "MINUTES"], [5, 20, "#efe6d2", "HOURS"], [20, 60, "#e3d6bb", "DAYS"], [60, RL, "#efe6d2", "WEEKS"]];
      bands.forEach(([a, b, col, lab]) => { g.fillStyle = col; g.fillRect(a * u, 0, (b - a) * u, 96); g.fillStyle = "#3a3846"; g.font = '600 25px "Inter"'; g.textAlign = "left"; g.fillText(lab.split("").join(String.fromCharCode(8202)), a * u + 14, 82); });
      g.strokeStyle = "#3a3846"; for (let x = 0; x <= RL; x += 0.25) { const big = Math.abs(x - Math.round(x)) < 1e-6; g.lineWidth = big ? 2.4 : 1.2; g.beginPath(); g.moveTo(x * u, 0); g.lineTo(x * u, big ? 30 : 15); g.stroke(); }
      g.fillStyle = "#2a2833"; g.font = '34px "Instrument Serif"'; g.textAlign = "center";
      [[0.6, "1 min"], [2, "15 min"], [6, "1 hr"], [10, "2 hrs"], [17, "4 hrs"], [27, "1 day"], [41, "2 days"], [55, "4 days"], [75, "1 wk"]].forEach(([x, s]) => g.fillText(s, x * u, 62));
      g.fillStyle = "#3a3846"; [5, 20, 60].forEach((x) => g.fillRect(x * u - 2, 0, 4, 96)); }
    const rtex = new THREE.CanvasTexture(rc); rtex.colorSpace = THREE.SRGBColorSpace; rtex.anisotropy = 8;
    const rgeo = new THREE.PlaneGeometry(RL, RWd); rgeo.translate(RL / 2, 0, 0);
    const ruler = new THREE.Mesh(rgeo, new THREE.MeshStandardMaterial({ map: rtex, roughness: 0.92, bumpMap: E.bumpTex, bumpScale: 0.2 })); ruler.rotation.x = -Math.PI / 2; ruler.position.set(X0, 0.012, ZR); ruler.receiveShadow = true; scene.add(ruler);
    const roll = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, RWd, 28), paper("#e9dfc8")); roll.rotation.x = Math.PI / 2; roll.castShadow = true; scene.add(roll);
    const tUnroll = [tm.howFast + 0.75, tm.howFast + 5.6];
    const updRuler = (t) => { const k = expoOut(lin(tUnroll[0], tUnroll[1], t)) * 0.999 + 0.001; ruler.scale.x = k; rtex.repeat.set(k, 1); ruler.visible = t > tUnroll[0];
      const rr = 0.07 + 0.32 * (1 - k); roll.scale.set(rr, 1, rr); roll.position.set(X0 + k * RL + rr * 0.5, rr, ZR); roll.rotation.y = -k * RL / Math.max(rr, 0.07) * 0.9; roll.visible = t > tUnroll[0] - 0.05 && k < 0.995; };
    // marker: the disc that popped off the page (cyan = machine)
    const MR = 0.35; const marker = new THREE.Group(); scene.add(marker);
    { const m = E.extrude(E.circleShape(MR), "#1aa9c8", 0.1, { emissive: 0.55 }); m.position.z = -0.05; marker.add(m);
      const ri = E.extrude(E.ringShape(MR * 0.55, MR * 0.75), C.cyan, 0.03, { emissive: 1.2 }); ri.position.z = 0.05; marker.add(ri);
      const pu = E.extrude(E.circleShape(MR * 0.3), "#05070c", 0.03); pu.position.z = 0.06; marker.add(pu);
      marker.userData.ring = ri; }
    const mkLight = E.pointLight(C.cyan, 0, 7); scene.add(mkLight);
    const RP = (p, y = MR) => V3(X0 + p, y, ZR);
    const LP = (z, x = 0) => Lw(x, MR, z);
    const bookPageWorld = V3(-2.1 + BW * 0.5 + 0.3, 1.65 + 0.1, 0.25);
    const hops = [
      [tm.howFast + 0.05, tm.howFast + 0.9, bookPageWorld, RP(0.35), 1.2],
      [tm.minutes - 0.45, tm.minutes, RP(0.35), RP(2)], [tm.hours - 0.5, tm.hours, RP(2), RP(6)], [tm.doubled - 0.55, tm.doubled, RP(6), RP(10)],
      [tm.seven - 0.6, tm.seven, RP(10), RP(17)], [tm.lately - 0.68, tm.lately, RP(17), RP(27)], [tm.evenFaster - 0.75, tm.evenFaster, RP(27), RP(41)],
      [tm.loop - 0.6, tm.loop, RP(41), RP(47)], [tm.walls - 0.42, tm.walls, RP(47), RP(50.8 - 0.2)], [tm.walls, tm.walls + 0.5, RP(50.8 - 0.2), RP(49.7), 0.25],
      [tm.inst - 0.95, tm.inst, LP(1.1), LP(-3.6), 0.95], [tm.rules - 0.9, tm.rules, LP(-3.6), LP(-8.6), 0.95], [tm.test - 0.9, tm.test, LP(-8.6), LP(-13.6), 0.95],
      [tm.code - 0.85, tm.code, LP(-13.6), LP(-19), 0.9], [tm.exper - 1.3, tm.exper, LP(-19), LP(-33.1), 2.6],
    ];
    const markerAt = (t) => { // returns {pos, impact, flying, scale}
      let prev = hops[0]; if (t < hops[0][0]) return { pos: hops[0][2].clone(), imp: 0, s: 1.63, k: 0 };
      for (const h of hops) { const [a, b, P, Q, hh] = h;
        if (t >= a && t < b) { const k = lin(a, b, t); const e = h === hops[0] ? k : sineInOut(k); const pos = P.clone().lerp(Q, e);
          const ht = hh ?? Math.min(2.4, 0.35 + 0.18 * P.distanceTo(Q)); pos.y += ht * Math.sin(Math.PI * k);
          return { pos, imp: 0, s: h === hops[0] ? lerp(1.63, 1, expoOut(k)) : 1, k: 1 }; }
        if (t >= b) prev = h; }
      return { pos: prev[3].clone(), imp: Math.exp(-(t - prev[1]) * 9) * (t - prev[1] < 1.2 ? 1 : 0), s: 1, k: 0 }; };
    const mkSmooth = (t, lag = 0.35) => { const p = V3(0, 0, 0); for (let i = 0; i < 7; i++) p.add(markerAt(t - (i / 6) * lag).pos); return p.multiplyScalar(1 / 7); };

    // ================= the wall + the city of gates (G2) =================
    const cool = (t) => smooth(tm.walls, tm.walls + 1.4, t);
    // wall (front) with a closed door
    const wallP = pop(G2, 0, tm.serious - 0.05, 1.0, 0, 0.0);
    const wallShape = E.rectShape(28, 3.4, 0, 1.7); wallShape.holes.push(archPath(0, 1.3, 2.1));
    const wall = E.extrude(wallShape, "#3d5379", 0.24); wall.position.z = -0.12; wallP.h.add(wall);
    const doorPiv = new THREE.Group(); doorPiv.position.set(-0.64, 0, 0); wallP.h.add(doorPiv);
    { const ds = new THREE.Shape(); const r = 0.63; ds.moveTo(0.01, 0.03); ds.lineTo(2 * r - 0.01, 0.03); ds.lineTo(2 * r - 0.01, 2.1 - r); ds.absarc(r, 2.1 - r, r - 0.01, 0, Math.PI, false); ds.lineTo(0.01, 0.03);
      const d = E.extrude(ds, "#4a6290", 0.1); d.position.z = -0.05; doorPiv.add(d); }
    // institutions: offices
    const offP = pop(G2, -5, tm.princeton + 0.1, 1.1, 1);
    const offShape = row({ seed: 21, hMin: 4.6, hMax: 7.5, winP: 0.45, mid: { x0: -2.2, x1: 2.2, h: 6.2, holes: [rectPath(-1.6, 3.4, 0.5, 0.7), rectPath(1.1, 3.4, 0.5, 0.7), rectPath(-1.6, 4.7, 0.5, 0.7), rectPath(1.1, 4.7, 0.5, 0.7), rectPath(-0.25, 4.0, 0.5, 0.9)] }, archW: 1.5, archH: 2.5 });
    const office = E.extrude(offShape, pal.layers[2], 0.22); office.position.z = -0.11; offP.h.add(office);
    const offGlow = [glow(28, 4.3, "#ffb35c"), glow(28, 4.3, "#ffb35c")]; offGlow[0].position.set(-15.0, 2.6, -0.7); offGlow[1].position.set(15.0, 2.6, -0.7); offGlow.forEach((g) => offP.h.add(g));
    const offGlowHi = glow(4, 3.4, "#ffb35c"); offGlowHi.position.set(0, 4.6, -0.6); offP.h.add(offGlowHi);
    // rules: the court (pediment + columns)
    const courtP = pop(G2, -10, tm.princeton + 0.35, 1.2, 2);
    const colHoles = []; [-3.3, -2.3, -1.3, 1.0, 2.0, 3.0].forEach((x) => colHoles.push(rectPath(x, 1.0, 0.36, 3.2)));
    const courtShape = row({ seed: 33, hMin: 5, hMax: 8.5, winP: 0.3, archW: 1.7, archH: 2.9,
      mid: { x0: -4.6, x1: 4.6, h: 5.0, holes: colHoles, prof: (s, b) => { s.lineTo(b.x - 0.3, b.h); s.lineTo(b.x - 0.3, b.h + 0.5); s.lineTo(b.x + b.w * 0.5, b.h + 2.7); s.lineTo(b.x + b.w + 0.3, b.h + 0.5); s.lineTo(b.x + b.w + 0.3, b.h); s.lineTo(b.x + b.w, b.h); } } });
    const court = E.extrude(courtShape, pal.layers[1], 0.22); court.position.z = -0.11; courtP.h.add(court);
    const courtGlowL = glow(3.0, 3.6, "#d8e4ff"), courtGlowR = glow(3.0, 3.6, "#d8e4ff"); courtGlowL.position.set(-2.55, 2.6, -0.7); courtGlowR.position.set(2.45, 2.6, -0.7); courtP.h.add(courtGlowL, courtGlowR);
    const courtWin = [glow(24, 4.2, "#ffb35c"), glow(24, 4.2, "#ffb35c")]; courtWin[0].position.set(-17, 2.7, -0.8); courtWin[1].position.set(17, 2.7, -0.8); courtWin.forEach((g) => courtP.h.add(g));
    // test things: the hospital (cross)
    const hospP = pop(G2, -15, tm.princeton + 0.6, 1.25, 3);
    const cross = new THREE.Path(); { const cx = 0, cy = 7.0, a = 0.32, b = 0.95; cross.moveTo(cx - a, cy - b); cross.lineTo(cx + a, cy - b); cross.lineTo(cx + a, cy - a); cross.lineTo(cx + b, cy - a); cross.lineTo(cx + b, cy + a); cross.lineTo(cx + a, cy + a); cross.lineTo(cx + a, cy + b); cross.lineTo(cx - a, cy + b); cross.lineTo(cx - a, cy + a); cross.lineTo(cx - b, cy + a); cross.lineTo(cx - b, cy - a); cross.lineTo(cx - a, cy - a); cross.lineTo(cx - a, cy - b); }
    const hwin = []; for (let y = 3.2; y < 5.6; y += 1.2) for (let x = -3.2; x < 3.3; x += 1.1) if (Math.abs(x + 0.15) > 1.2) hwin.push(rectPath(x, y, 0.5, 0.7));
    const hospShape = row({ seed: 47, hMin: 6, hMax: 9.5, winP: 0.28, archW: 1.6, archH: 2.6, mid: { x0: -4.0, x1: 4.0, h: 9.0, holes: [cross, ...hwin] } });
    const hosp = E.extrude(hospShape, pal.layers[0], 0.22); hosp.position.z = -0.11; hospP.h.add(hosp);
    const crossGlow = glow(2.2, 2.2, "#f4fbff"); crossGlow.position.set(0, 7.0, -0.6); hospP.h.add(crossGlow);
    const hospWinGlow = glow(7.2, 2.8, "#ffb35c"); hospWinGlow.position.set(0, 4.5, -0.65); hospP.h.add(hospWinGlow);
    const hospSide = [glow(24, 5.2, "#ffb35c"), glow(24, 5.2, "#ffb35c")]; hospSide[0].position.set(-16.2, 3.2, -0.8); hospSide[1].position.set(16.2, 3.2, -0.8); hospSide.forEach((g) => hospP.h.add(g));
    // chips, power and time: the power plant (huge, far)
    const plantP = pop(G2, -40, tm.princeton + 0.9, 1.9, 4, 0);
    const ps = new THREE.Shape(); { const tw = (s, x0, x1, h) => { const m = (x0 + x1) / 2, w = x1 - x0; s.lineTo(x0, 0); s.quadraticCurveTo(x0 + w * 0.3, h * 0.55, x0 + w * 0.16, h); s.lineTo(x1 - w * 0.16, h); s.quadraticCurveTo(x1 - w * 0.3, h * 0.55, x1, 0); };
      ps.moveTo(-34, -0.4); ps.lineTo(-34, 0); tw(ps, -28, -16, 15); ps.lineTo(-13, 0); ps.lineTo(-13, 14.2); ps.lineTo(-2.6, 14.2); ps.lineTo(-2.6, 18.6); ps.lineTo(0, 20.8); ps.lineTo(2.6, 18.6); ps.lineTo(2.6, 14.2); ps.lineTo(15, 14.2); ps.lineTo(15, 0);
      tw(ps, 17, 29, 15); ps.lineTo(31, 0); ps.lineTo(31, 25); ps.lineTo(32.6, 25); ps.lineTo(32.6, 0); ps.lineTo(36, 0); ps.lineTo(36, -0.4); ps.lineTo(-34, -0.4);
      const holes = [archPath(0, 2.4, 3.6)]; const r = E.rng(91);
      for (let y = 4.6; y < 12; y += 1.5) for (let x = -12.2; x < 14.0; x += 1.2) { if (Math.abs(x) < 3.4 && y < 14) continue; if (y > 9.2 && x > -4 && x < 14.4) continue; if (r() < 0.55) holes.push(rectPath(x, y, 0.55, 0.8)); }
      for (let y = 2.0; y < 24; y += 2.2) holes.push(rectPath(31.5, y, 0.6, 0.5)); ps.holes.push(...holes); }
    const plant = E.extrude(ps, "#1b2742", 0.3); plant.position.z = -0.15; plantP.h.add(plant);
    const plantGlow = glow(27, 7.6, "#ffb35c"); plantGlow.position.set(1, 8.0, -0.8); plantP.h.add(plantGlow);
    const gateGlow = glow(2.6, 3.8, "#fff1d6"); gateGlow.position.set(0, 1.9, -0.6); plantP.h.add(gateGlow);
    const chimGlow = glow(0.9, 23, "#ffb35c"); chimGlow.position.set(31.8, 13, -0.7); plantP.h.add(chimGlow);
    // steam from the cooling towers
    const steam = []; { const r = E.rng(5); for (let i = 0; i < 6; i++) { const sh = new THREE.Shape(); let x = -2.2; sh.moveTo(-2.4, 0); while (x < 2.2) { const rr = 0.6 + r() * 0.7; sh.absarc(x + rr, 0, rr, Math.PI, 0, true); x += rr * 2; } sh.lineTo(x, -0.4); sh.lineTo(-2.4, -0.4);
      const m = E.extrude(sh, "#2c3a59", 0.12); m.receiveShadow = false; plantP.h.add(m); steam.push({ m, x: i % 2 ? 23 : -22, ph: i / 6 * 1 + r() * 0.1, sp: 0.09 + r() * 0.03 }); } }
    const plantLight = E.pointLight("#ffb35c", 0, 34); plantLight.position.set(0, 3.5, -2.5); plantP.h.add(plantLight);
    // queue of experiments at the single gate + the tiny figure
    const crates = []; for (let i = 0; i < 7; i++) { const g = new THREE.Group(); const b = E.box(0.62, 0.62, 0.62, "#2c3f63"); b.position.y = 0.31; g.add(b);
      const sl = glow(0.38, 0.07, C.cyan); sl.position.set(0, 0.42, 0.315); g.add(sl); g.userData.sl = sl; g.position.set(0, 0, -38.9 + i * 0.86); G2.add(g); crates.push(g); }
    const fig = E.figure({ pose: "stand", hair: "short", seed: 4, scale: 0.95 }); fig.position.set(-0.8, 0, -39.3); G2.add(fig);

    // ================= the two clocks (on the plant hall) =================
    const CR = 1.4, CY = 11.5, CZ = 0.78; // relative to plant hinge (z -40)
    const clocks = [0, 1].map((i) => { const g = new THREE.Group(); plantP.h.add(g);
      const rim = E.extrude(E.ringShape(CR, CR + 0.16), "#141b2c", 0.14); g.add(rim);
      const cv = document.createElement("canvas"); cv.width = cv.height = 512; const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
      const face = new THREE.Mesh(new THREE.CircleGeometry(CR, 64), new THREE.MeshStandardMaterial({ color: 0xffffff, map: tex, roughness: 0.9, emissive: new THREE.Color("#ffe6c0"), emissiveIntensity: 0, emissiveMap: tex })); face.position.z = 0.04; face.receiveShadow = true; g.add(face);
      const back = E.extrude(E.circleShape(CR + 0.05), "#26324d", 0.08); back.position.z = -0.06; g.add(back);
      const mkHand = (len, wdt, z) => { const p = new THREE.Group(); p.position.z = z; const m = E.box(wdt, len, 0.03, "#15131c"); m.geometry.translate(0, len / 2 - 0.12, 0); m.castShadow = true; p.add(m); g.add(p); p.userData.m = m; return p; };
      const hr = mkHand(0.85, 0.11, 0.09), mn = mkHand(1.18, 0.07, 0.12);
      const cap = E.extrude(E.circleShape(0.09), "#15131c", 0.03); cap.position.z = 0.15; g.add(cap);
      return { g, cv, ctx: cv.getContext("2d"), tex, face, hr, mn, key: "" }; });
    const paintClock = (c, frac, felt, lit) => { const key = Math.round(frac * 300) + ":" + felt; if (key === c.key) return; c.key = key; const g = c.ctx, S = 512, R = 250;
      g.fillStyle = "#efe6d2"; g.fillRect(0, 0, S, S);
      if (frac > 0) { const f1 = Math.min(frac, 1); g.fillStyle = felt ? "#ffcf8a" : "#b9c4d6"; g.beginPath(); g.moveTo(256, 256); g.arc(256, 256, R * 0.86, -Math.PI / 2, -Math.PI / 2 + f1 * Math.PI * 2); g.closePath(); g.fill();
        if (frac > 1) { g.fillStyle = "#ffb35c"; g.beginPath(); g.moveTo(256, 256); g.arc(256, 256, R * 0.95, -Math.PI / 2, -Math.PI / 2 + (frac - 1) * Math.PI * 2); g.closePath(); g.fill();
          g.fillStyle = "#b9c4d6"; g.beginPath(); g.arc(256, 256, R * 0.55, 0, Math.PI * 2); g.fill(); } }
      g.strokeStyle = "#24222c"; for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, big = i % 5 === 0; g.lineWidth = big ? 7 : 2.5; g.beginPath(); g.moveTo(256 + Math.cos(a) * R * (big ? 0.8 : 0.88), 256 + Math.sin(a) * R * (big ? 0.8 : 0.88)); g.lineTo(256 + Math.cos(a) * R * 0.96, 256 + Math.sin(a) * R * 0.96); g.stroke(); }
      c.tex.needsUpdate = true; };
    const tSplit = [tm.feeling + 0.75, tm.being + 0.55], tRace = [tm.being + 0.75, tm.longer + 0.2];
    const feltFrac = (t) => 0.8 * expoOut(lin(tRace[0], tRace[0] + 3.4, t)) + 0.006 * Math.sin(t * 9) * smooth(tRace[0] + 3.0, tRace[0] + 3.6, t);
    const measFrac = (t) => 1.19 * sineInOut(lin(tRace[0], tRace[1], t));
    const tSwing = [tm.even - 0.55, tm.even + 0.05], tStretch = [tm.even + 0.05, tm.anthropic + 0.3], tRetract = [tm.numbers + 0.35, tm.numbers + 1.05];
    const SPINE_B = 9.6, BYB = CY, BZB = 0.5; // book B placement on the plant hall (hinge-local)
    const barStartX = SPINE_B + 0.1 * BW, measX = 1.9;
    // footnote tag (hangs from the "80%*", flaps in a draft)
    const tagPiv = new THREE.Group(); plantP.h.add(tagPiv);
    const fnote = E.drawnCard({ w: 0.62, h: 0.36, px: 256, draw: (g, w, h) => { g.fillStyle = "#1c1a24"; g.font = '120px "Instrument Serif"'; g.fillText("*", 18, 118); g.fillStyle = "rgba(28,26,36,0.55)"; [40, 62, 84].forEach((y, i) => g.fillRect(96, y, 130 - i * 26, 7)); } });
    fnote.position.set(0, -0.3, 0); tagPiv.add(fnote);
    const thread = new THREE.Mesh(new THREE.PlaneGeometry(0.012, 0.14), new THREE.MeshBasicMaterial({ color: "#24222c" })); thread.position.set(0, -0.06, 0.01); tagPiv.add(thread);
    const bookLamp = E.pointLight("#ffe2b8", 0, 10); plantP.h.add(bookLamp);
    const clockLamp = E.pointLight("#ffe2b8", 0, 20); clockLamp.position.set(0, 15.5, 6); plantP.h.add(clockLamp);

    // ================= DOM =================
    const L = E.layer;
    const src1 = E.srcDOM(L, { big: "Doubles ~every 7 months", small: "METR: task length AI can finish alone", inAt: tm.metr, outAt: tm.but - 0.2 });
    const src2 = E.srcDOM(L, { big: "“AI as Normal Technology”", small: "Narayanan &amp; Kapoor, 2025", inAt: tm.princeton + 0.3, outAt: tm.code - 0.3 });
    const src3 = E.srcDOM(L, { big: "−19%", small: "METR RCT, 2025", inAt: tm.nineteen, outAt: tm.even - 0.1 });
    const src4 = E.srcDOM(L, { big: "“almost certainly an overstatement”", small: "Anthropic", inAt: tm.almost, outAt: tm.idont + 0.2 });
    const tag24 = E.tagDOM(L, { title: "2024", sub: "minutes", inAt: tm.y2024, outAt: tm.byNow - 0.1, cyan: true });
    const tag26 = E.tagDOM(L, { title: "2026", sub: "hours", inAt: tm.byNow + 0.15, outAt: tm.doubled + 0.4, cyan: true });
    const tagFelt = E.tagDOM(L, { title: "felt", inAt: tm.feeling + 0.2, outAt: tm.even - 0.2 });
    const tagMeas = E.tagDOM(L, { title: "measured", inAt: tm.being + 0.1, outAt: tm.even - 0.2 });
    const doms = [src1, src2, src3, src4, tag24, tag26, tagFelt, tagMeas];

    // ================= camera =================
    const D0 = 8.62, Y0 = 1.65 - 0.2174; // opening framing: cover 45 % wide, centre at 46 % from top
    const plantW = (x, y, z) => Lw(x, y, z - 40);
    const follow = (off, look, lag = 0.4) => (t) => { const m = mkSmooth(t, lag); return [m.clone().add(V3(...off(t))), m.clone().add(V3(...look(t)))]; };
    const K = [
      [T0, [0, Y0, 0.05 + D0], [0, Y0, 0]],
      [tm.each, [0.25, Y0 + 0.12, 7.9], [-0.35, Y0 + 0.1, 0]],
      [tm.decades + 0.2, [-0.6, 1.9, 8.2], [-1.3, 1.55, 0]],
      [tm.people + 0.4, [0.7, 2.0, 6.6], [0.0, 1.55, 0]],
      [tm.byHand + 0.8, [0.5, 1.95, 6.4], [-0.1, 1.58, 0]],
      [tm.help, [-1.2, 2.3, 8.6], [-2.0, 1.65, 0]],
      [tm.fasterThan, [-1.6, 2.1, 9.0], [-2.1, 1.6, 0]],
      [tm.flipSlow + 0.4, [-0.6, 2.0, 8.0], [-1.6, 1.6, 0]],
      [tm.flipFast + 0.1, [-0.2, 1.6, 7.6], [-1.8, 1.65, 0]],
      [tm.all - 0.1, [2.6, 1.3, 9.6], [-2.0, 1.75, 0.3], "sine"],
      [tm.motion + 0.5, [5.6, 0.95, 10.0], [-2.2, 1.85, 0.6], "sine"],
      [tm.howFast + 0.3, [5.4, 1.2, 10.2], [-1.4, 1.6, 0.4]],
      [tm.howFast + 1.6, [5.0, 3.0, 10.5], [3.6, 0.5, ZR]],
      [tm.research + 1.6, [5.5, 4.6, 12.5], [8.5, 0.5, ZR - 1]],
      [tm.human - 1.0, [3.8, 3.6, 10.5], [5.5, 0.6, ZR - 1]],
      [tm.y2024 - 0.8, [2.6, 2.5, 8.6], [2.1, 0.4, ZR]],
      [tm.minutes + 0.3, follow(() => [0.4, 2.4, 8.0], () => [0, 0.1, 0], 0.45)],
      [tm.lately - 0.5, follow((t) => [lerp(0.4, -1.5, lin(tm.minutes, tm.lately, t)), lerp(2.4, 4.6, lin(tm.minutes, tm.lately, t)), lerp(8.0, 15, lin(tm.minutes, tm.lately, t))], () => [1.5, 0.1, 0], 0.5)],
      [tm.evenFaster + 0.2, follow(() => [-2.0, 5.2, 16.5], () => [4.0, 0.3, 0], 0.55)],
      [tm.but + 0.9, [33.5, 2.6, 3.4], [53.3, 1.5, ZR]],
      [tm.walls - 0.2, [42.4, 1.55, 1.9], [53.3, 1.6, ZR], "sine"],
      [tm.princeton, [43.6, 1.55, 1.8], [53.3, 1.8, ZR], "sine"],
      [tm.normal, Lw(9, 10.5, 13.5), Lw(0, 4.2, -14)],
      [tm.slowed, Lw(5.5, 7.6, 9.5), Lw(0, 3.0, -12)],
      [tm.inst - 0.6, Lw(0.7, 1.5, 6.4), Lw(0, 1.2, -6)],
      [tm.inst + 0.3, follow(() => [0, 1.3, 0].map((v, i) => v), () => [0, 0, 0], 0.5)],
    ];
    // tunnel follow: camera sits behind the marker (local +z), looking down the gates
    const tunnel = (t) => { const m = mkSmooth(t, 0.55); const back = Lw(0.6, 1.35, 0).sub(Lw(0, 0, 0)); const dirZ = Lw(0, 0, -1).sub(Lw(0, 0, 0));
      const p = m.clone().add(back).add(dirZ.clone().multiplyScalar(-5.6)); const l = m.clone().add(dirZ.clone().multiplyScalar(6)); l.y = 1.2; p.y = 1.5 + 0.25 * Math.sin(t * 0.7); return [p, l]; };
    K[K.length - 1] = [tm.inst + 0.3, tunnel];
    K.push([tm.test + 0.6, tunnel]);
    K.push([tm.code + 0.9, Lw(1.5, 12.5, -7.2), Lw(0.5, 6.5, -32)]);
    K.push([tm.code + 2.4, Lw(10, 24, -3), Lw(1.0, 7.0, -40)]);
    K.push([tm.time - 0.1, Lw(8, 21, -8), Lw(0.8, 7.6, -40)]);
    K.push([tm.being + 0.4, plantW(0.4, CY + 0.15, CZ + 9.4), plantW(0, CY, CZ)]);
    K.push([tm.longer, plantW(-0.1, CY + 0.3, CZ + 8.6), plantW(0, CY + 0.05, CZ)]);
    K.push([tm.even - 0.3, plantW(-0.2, CY + 0.3, CZ + 8.4), plantW(0.1, CY + 0.05, CZ)]);
    K.push([tm.anthropic + 0.6, plantW(7.0, CY + 0.3, CZ + 10.2), plantW(6.6, CY, BZB)]);
    K.push([tm.almost, plantW(SPINE_B + 2.1, CY + 0.2, BZB + 7.0), plantW(SPINE_B + 2.0, CY, BZB)]);
    K.push([tm.idont, plantW(SPINE_B + 2.1, CY + 0.15, BZB + 6.6), plantW(SPINE_B + 2.05, CY, BZB)]);
    K.push([tm.spin + 0.2, plantW(SPINE_B + 1.0, CY + 1.0, BZB + 11.0), plantW(SPINE_B + 0.3, CY - 0.1, BZB)]);
    K.push([tm.nobody + 0.5, plantW(SPINE_B + 1.2, CY + 0.9, BZB + 10.4), plantW(SPINE_B + 0.5, CY - 0.05, BZB)]);
    K.push([T1, plantW(SPINE_B + 2.1, CY, BZB + 3.3), plantW(SPINE_B + 2.1, CY, BZB)]);
    const evalKey = (k, t) => { if (typeof k[1] === "function") return k[1](t); return [k[1].isVector3 ? k[1].clone() : V3(...k[1]), k[2].isVector3 ? k[2].clone() : V3(...k[2])]; };
    const camAt = (t) => {
      let i = 0; while (i < K.length - 2 && t > K[i + 1][0]) i++;
      const a = K[i], b = K[i + 1]; const raw = lin(a[0], b[0], t);
      const ease = b[3] || (typeof a[1] === "function" && typeof b[1] === "function" ? "lin" : "inOut");
      const kk = ease === "sine" ? sineInOut(raw) : ease === "lin" ? raw : raw * raw * (3 - 2 * raw) * 0.35 + inOut(raw) * 0.65;
      const [pa, la] = evalKey(a, t), [pb, lb] = evalKey(b, t); const p = pa.lerp(pb, kk), l = la.lerp(lb, kk);
      const bul = Math.sin(Math.PI * kk) * pa.distanceTo(pb) * 0.08; p.x += bul * (i % 2 ? -0.6 : 0.6); p.y += bul * 0.35;
      // perpetual drift (zero at both ends so the carriers line up exactly)
      const env = smooth(T0, T0 + 1.2, t) * (1 - smooth(T1 - 1.4, T1, t)); const d = p.distanceTo(l) * 0.008 * env;
      p.x += d * (Math.sin(t * 0.37) * 0.9 + Math.sin(t * 0.83 + 1.3) * 0.4); p.y += d * (Math.sin(t * 0.51 + 0.7) * 0.6 + Math.sin(t * 1.13 + 2.1) * 0.2);
      l.x += d * Math.sin(t * 0.29 + 0.4) * 0.4; l.y += d * Math.sin(t * 0.43 + 1.9) * 0.3;
      // impact bump on "walls"
      const bt = t - tm.walls; if (bt > 0 && bt < 0.9) { const bb = Math.exp(-bt * 6) * Math.sin(bt * 38) * 0.06; p.y += bb; l.y += bb * 0.5; p.x -= bb; }
      return { p, l };
    };

    const tmpV = new THREE.Vector3();
    const post = { bloom: 0.4, exposure: 1.15 };
    return {
      scene, camera, post,
      update(t) {
        stg.update(t); sky2.update(t); fc.update(t); pops.forEach((p) => p.update(t));
        // ---- book placement: A (desk) until the steelman, then B (on the plant hall, in the dark)
        const B = t >= 205; const want = B ? plantP.h : scene; if (book.parent !== want) want.add(book);
        if (B) { book.position.set(SPINE_B, BYB, BZB); book.rotation.set(0, 0, 0.003 * Math.sin(t * 0.7)); }
        else { book.position.set(-BW / 2, 1.65, 0); book.rotation.set(0, 0, 0.003 * Math.sin(t * 0.7)); }
        const F = updBook(t); updHand(t); updGhosts(t, B ? 0 : smooth(tm.vanish - 0.6, tm.all, t) * (1 - smooth(tm.howFast + 0.3, tm.howFast + 2.0, t)), F); const beamOn = updBeam(t);
        // ---- lights: lamp (human phase) → cyan page glow (machine phase) → wow
        const human = smooth(tm.decades - 0.8, tm.decades + 0.4, t) * (1 - smooth(tm.now, tm.now + 1.6, t));
        const fast = smooth(tm.flipFast, tm.all, t) * (1 - smooth(tm.howFast + 0.5, tm.howFast + 3.5, t));
        lamp.intensity = (B ? 0 : 1) * (4 + 7 * human) * (1 - 0.55 * smooth(tm.now, tm.flipSlow, t)) * (1 + 0.03 * Math.sin(t * 7.1) * Math.sin(t * 2.3)) * (1 - smooth(tm.howFast + 2, tm.howFast + 5, t));
        const machine = smooth(tm.now, tm.help, t);
        pageGlow.position.set(-1.5 + 0.4 * Math.sin(t * 3), 2.2, 3.2 + 0.8 * fast); pageGlow.intensity = B ? 0 : (0.3 + 2.2 * beamOn + 1.2 * machine * (1 - fast) * (1 - smooth(tm.howFast, tm.howFast + 3, t)) + 12 * fast * (0.85 + 0.15 * Math.sin(t * 31)));
        // ---- ruler + marker
        updRuler(t);
        const M = markerAt(t); marker.position.copy(M.pos); const sq = M.imp; marker.scale.set(M.s * (1 + 0.14 * sq), M.s * (1 - 0.2 * sq), M.s);
        marker.position.y -= MR * 0.2 * sq; marker.visible = t > tm.howFast + 0.02 && t < tm.feeling + 1.5;
        tmpV.copy(camera.position); marker.rotation.y = Math.atan2(tmpV.x - marker.position.x, tmpV.z - marker.position.z) + 0.15 * Math.sin(t * 1.3); marker.rotation.z = M.k ? -t * 6 : 0.04 * Math.sin(t * 2);
        marker.userData.ring.rotation.z = t * 0.8;
        mkLight.position.copy(marker.position).add(V3(0, 0.6, 0.3)); mkLight.intensity = marker.visible ? 5 + 2 * Math.sin(t * 3.1) : 0;
        // ---- the wall, the city, the plant
        const c = cool(t); const hit = t - tm.walls; if (hit > 0 && hit < 1.5) wallP.h.rotation.x -= 0.03 * Math.exp(-hit * 4) * Math.sin(hit * 30);
        doorPiv.rotation.y = 1.75 * expoOut(lin(tm.slowed + 0.15, tm.slowed + 1.3, t)) - 0.06 * Math.sin(Math.PI * lin(tm.slowed - 0.1, tm.slowed + 0.15, t));
        const flick = (s) => 1 + 0.05 * Math.sin(t * 5.3 + s) * Math.sin(t * 2.1 + s * 2);
        const baseOn = smooth(tm.princeton + 1, tm.princeton + 2.5, t) * 0.32;
        const offOn = baseOn + 0.9 * expoOut(lin(tm.inst - 0.1, tm.inst + 0.6, t)); offGlow.forEach((g, i) => g.userData.setGlow(offOn * flick(i))); offGlowHi.userData.setGlow(offOn * 1.2 * flick(3));
        const ctOn = baseOn * 0.3 + 0.38 * expoOut(lin(tm.rules - 0.1, tm.rules + 0.6, t)); courtGlowL.userData.setGlow(ctOn * flick(4)); courtGlowR.userData.setGlow(ctOn * flick(5)); courtWin.forEach((g, i) => g.userData.setGlow(baseOn * 0.8 * flick(6 + i)));
        const hsOn = baseOn * 0.5 + 1.3 * expoOut(lin(tm.test - 0.1, tm.test + 0.6, t)); crossGlow.userData.setGlow(hsOn * flick(7)); hospWinGlow.userData.setGlow(0.3 * baseOn + 0.6 * hsOn); hospSide.forEach((g, i) => g.userData.setGlow(baseOn * 0.8 * flick(8 + i)));
        const dark = smooth(tm.idont, tm.spin, t);
        const powerOn = 0.25 * smooth(tm.princeton + 1.5, tm.princeton + 3, t) + 1.1 * expoOut(lin(tm.power - 0.05, tm.power + 0.7, t));
        plantGlow.userData.setGlow(powerOn * flick(9) * (1 - dark)); gateGlow.userData.setGlow((0.45 + 0.6 * powerOn) * flick(10) * (1 - 0.95 * dark)); chimGlow.userData.setGlow(powerOn * 0.8 * flick(11) * (1 - dark));
        plantLight.intensity = (6 + 16 * powerOn) * (1 - dark);
        steam.forEach((s, i) => { const u = ((t * s.sp + s.ph) % 1 + 1) % 1; s.m.position.set(s.x + u * 2.5 + 0.4 * Math.sin(t * 0.3 + i), 13.6 + u * 6.5, -0.4); s.m.scale.setScalar(0.5 + u * 0.9); s.m.visible = u < 0.92; });
        crates.forEach((g, i) => { const on = expoOut(lin(tm.chips - 0.1 + i * 0.07, tm.chips + 0.4 + i * 0.07, t)); g.userData.sl.userData.setGlow(0.25 + 1.6 * on);
          g.position.z = -38.9 + i * 0.86 - 0.08 * smooth(0, 1, (t * 0.4 + i * 0.13) % 1); g.position.y = 0.01 * Math.sin(t * 2 + i); });
        fig.userData.pose(t, { lookUp: 0.35 + 0.25 * smooth(tm.power - 0.2, tm.power + 1.2, t), lean: -0.1 });
        // ---- clocks
        const split = inOut(lin(tSplit[0], tSplit[1], t)); const tOn = expoOut(lin(tm.time - 0.1, tm.time + 0.6, t));
        clocks[0].g.position.set(-measX * split, CY, CZ + 0.02 * Math.sin(t * 0.9)); clocks[1].g.position.set(measX * split, CY, CZ - 0.25 * (1 - smooth(tSplit[0], tSplit[0] + 0.5, t)));
        const fold = smooth(tm.almost + 1.5, tm.almost + 2.2, t); clocks.forEach((cl) => { cl.g.visible = fold < 0.999; cl.g.rotation.x = -fold * 1.4; });
        clocks[1].g.visible = clocks[1].g.visible && t > tSplit[0] - 0.05;
        const ff = feltFrac(t), mf = measFrac(t);
        paintClock(clocks[0], ff, true); paintClock(clocks[1], mf, false);
        clocks.forEach((cl, i) => { cl.face.material.emissiveIntensity = 0.18 * tOn + (i === 0 ? 0.25 * smooth(tm.twentyPct - 0.2, tm.twentyPct + 0.5, t) * (1 - smooth(tm.even, tm.even + 0.8, t)) : 0); });
        // felt: ahead and spinning; measured: lagging, then over the mark
        const feltSpin = t < tRace[0] ? t * 0.08 : ff * Math.PI * 2;
        clocks[0].mn.rotation.z = -feltSpin; clocks[0].hr.rotation.z = -feltSpin / 12 - 1.0 - 2.6 * smooth(tRace[0], tRace[0] + 3.4, t);
        let mAng = t < tRace[0] ? t * 0.05 : mf * Math.PI * 2; const sw = sineInOut(lin(tSwing[0], tSwing[1], t)); mAng = lerp(mAng, Math.PI / 2, sw);
        clocks[1].mn.rotation.z = -mAng; clocks[1].hr.rotation.z = -mAng / 12 - 1.0 - 0.6 * smooth(tRace[0], tRace[1], t);
        const stretchLen = barStartX - measX; const st = expoOut(lin(tStretch[0], tStretch[1], t)) * (1 - inOut(lin(tRetract[0], tRetract[1], t)));
        clocks[1].mn.userData.m.scale.y = 1 + ((stretchLen + 0.12) / 1.18 - 1) * st;
        // footnote tag: swings down from behind the page at "numbers", flaps harder on "overstatement"
        const fx = SPINE_B + BW * (0.1 + 0.8 * 0.8) + 0.12, fy = BYB + BH * 0.5 - 0.36;
        tagPiv.position.set(fx + 0.15, fy + 0.2, BZB + 0.06); const tIn = spring(lin(tm.numbers + 0.4, tm.numbers + 1.3, t));
        const flap = (0.12 + 0.45 * smooth(tm.over - 0.15, tm.over + 0.25, t) * (1 - 0.6 * smooth(tm.over + 1.2, tm.idont, t))) * Math.sin(t * 9.5) + 0.06 * Math.sin(t * 3.1);
        tagPiv.rotation.set(-Math.PI * (1 - tIn) * 0.95 + flap * tIn, 0.25 * flap, 0.06 * Math.sin(t * 2.2)); tagPiv.visible = t > tm.numbers + 0.35 && t < turnsB[0][0] + 0.3;
        const bookRight = smooth(tm.anthropic, tm.almost, t);
        bookLamp.position.set(SPINE_B + 2.6, BYB + 3.2, BZB + 4.5); bookLamp.intensity = B ? (10 + 18 * bookRight + 10 * dark + 14 * smooth(tm.started - 0.5, T1, t)) * (1 + 0.025 * Math.sin(t * 3.3)) : 0;
        clockLamp.intensity = (t > tm.code ? 1 : 0) * (16 * smooth(tm.time - 0.3, tm.feeling + 1, t)) * (1 - dark);
        // ---- global key light follows the shot; colour cools after the wall, the world goes dark at the end
        const cam = camAt(t); E.applyCam(camera, cam);
        LT.key.target.position.copy(cam.l); LT.key.position.copy(cam.l).add(V3(-26, 34, 36)); LT.key.target.updateMatrixWorld();
        LT.key.color.copy(keyCol0).lerp(keyColCool, c * 0.8); LT.hemi.color.copy(hemiCol0).lerp(hemiCool, c * 0.7);
        LT.key.intensity = 2.1 * (1 - 0.25 * human) * (1 - 0.35 * fast) * (1 - 0.85 * dark) * (1 - 0.3 * smooth(tm.feeling, tm.being, t) * (1 - dark));
        LT.hemi.intensity = 0.75 * (1 - 0.15 * c) * (1 - 0.75 * dark);
        post.bloom = 0.4 + 0.3 * fast + 0.1 * beamOn + 0.15 * smooth(tm.power, tm.power + 0.6, t) * (1 - smooth(tm.feeling, tm.being, t));
        post.exposure = 1.15 - 0.07 * c * (1 - smooth(tm.power - 0.3, tm.power + 0.8, t)) + 0.05 * dark;
        // ---- DOM
        doms.forEach((d) => d.update(t));
        const mp = E.project(marker.position, camera); tag24.place(mp.x + 150, mp.y - 92); tag26.place(mp.x + 150, mp.y - 92);
        const c0 = E.project(plantW(-measX * split - CR * 0.4, CY + CR + 0.35, CZ), camera), c1 = E.project(plantW(measX * split + CR * 0.15, CY + CR + 0.35, CZ), camera);
        tagFelt.place(c0.x, c0.y - 30); tagMeas.place(c1.x + 30, c1.y - 30);
      },
    };
  },
};
