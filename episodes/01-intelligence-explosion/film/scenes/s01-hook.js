// s01 · Hook (0 → 45.96 s). "For seventy years, every AI was built the same way. By people." … "Has it already begun?"
// One continuous night world, accelerating:
//   1 a long paper workbench; generations of paper machines, each tinkered by tiny amber hands; stamps roll 1956 → 2026
//     while the dolly accelerates and the hands thin out; the 2026 machine assembles itself in cyan.
//   2 its cyan thread climbs into tower 1: the amber floors (human code) fill cyan to 80 %, an amber sliver stays on top.
//   3 the thread runs on to tower 2: the research floor lights row by row with cyan interns; a new floor grows on the roof.
//   4 the camera dives through the research floor into the tower: a giant paper flywheel (training) and, in the basement,
//     the sealed test box. A cyan thread slips through its seam; the wheel grinds to a stop; the cyan light snaps off.
//   5 WOW (quiet): whispered "Again." = extreme close-up on the glowing seam, the thread tip creeps out.
//   6 the wheel turns by itself, the thread climbs to its hub; the camera orbits to the front and the blades are pages:
//     a split-flap flipbook, every page a slightly larger cyan disc; on "explosion" the pages blur; title card.
//   7 the flipbook slows and stops on its blank first page; the camera pushes in until the cream PAGE fills the frame (→ s02).
export default {
  build(E, def) {
    const { THREE, C, PAL, lin, smooth, lerp, clamp, expoOut, inOut, sineInOut, spring, wob } = E;
    const pal = PAL.night;
    const scene = new THREE.Scene();
    const camera = E.newCamera();
    const A = (p, n = 1) => E.at("hook", p, n), Z = (p, n = 1) => E.end("hook", p, n);
    const T = {
      for: A("For"), ai1: A("AI"), same: A("same"), people: A("people"), then: A("Then"), single: A("single"), that: A("that"), change: A("change"),
      may: A("May"), ai2: A("AI", 2), p80: A("80%"), anth: A("Anthropic"), sept: A("September"), automated: A("automated"), research: A("research"), intern: A("intern"),
      doing: A("doing"), next: A("next"), two: A("Two"), escaped: A("escaped"), openai2: A("OpenAI", 2), stopped: A("stopped"),
      again: A("Again"), againE: Z("Again"), machines: A("machines"), build: A("build"), always: A("always"), themE: Z("them"),
      old: A("old"), intel: A("intelligence"), expl: A("explosion"), has: A("Has"), begunE: Z("begun"), end: def.to,
    };
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const rnd = E.rng(101);
    const col = (h) => new THREE.Color(h);
    const AMBER = col(C.amber), CYAN = col(C.cyan);

    // ---------------- stage ----------------
    const st = E.stage(scene, pal, { stars: 170, orb: { x: -40, y: 33, r: 3.0, glow: 0.4 }, seed: 9 });
    const L = E.lights(scene, pal, { key: [-20, 30, 30], target: [0, 0, -6], intensity: 2.1, hemi: 0.7, box: 20 });
    const city = E.city(scene, pal, { zs: [-46, -38, -30, -23], holes: [0, 0.04, 0.12, 0.1], heights: [[4, 8], [5, 10], [6, 12], [4, 9]], seed: 21, width: 95 });
    const lightAmb = E.pointLight(C.amber, 0, 12); scene.add(lightAmb);     // follows the bench focus
    const lightCyA = E.pointLight(C.cyan, 0, 14); scene.add(lightCyA);      // 2026 machine → tower 1 → tower 2 room
    const lightCyB = E.pointLight(C.cyan, 0, 18); scene.add(lightCyB);      // hall: the wheel's training light
    const lightBox = E.pointLight(C.cyan, 0, 9); scene.add(lightBox);       // the test box seam (hero of the basement)

    // ---------------- 1 · the bench ----------------
    // camera dolly x(t): calm, then accelerating, braking onto the 2026 machine
    const vel = (t) => (t < T.then ? 2.4 : t < 8.5 ? 2.4 + 12.6 * ((t - T.then) / (8.5 - T.then)) ** 2 : t < 9.25 ? 15 * (1 - smooth(8.5, 9.25, t)) : 0);
    const X0 = -42, DT = 1 / 240, XT = [X0];
    for (let i = 1; i <= 9.6 / DT; i++) XT.push(XT[i - 1] + vel((i - 0.5) * DT) * DT);
    const xc = (t) => { const f = clamp(t, 0, 9.6) / DT, i = Math.floor(f), k = f - i; return lerp(XT[i], XT[Math.min(i + 1, XT.length - 1)], k); };
    const XE = xc(9.25);                    // where the dolly settles
    const LOOK = 1.25;                       // look target sits ahead of the camera
    const BY = 1.2;                          // bench top height

    const bench = new THREE.Group(); scene.add(bench);
    const bx0 = X0 - 6, bx1 = XE + LOOK + 2.6;
    { const top = E.box(bx1 - bx0, 0.22, 3.2, "#2a3a5f"); top.position.set((bx0 + bx1) / 2, BY - 0.11, 0); bench.add(top);
      const edge = E.box(bx1 - bx0, 0.035, 0.03, "#b9ae96"); edge.position.set((bx0 + bx1) / 2, BY - 0.02, 1.61); bench.add(edge);
      const apron = E.box(bx1 - bx0, 0.32, 0.06, "#1d2a47"); apron.position.set((bx0 + bx1) / 2, BY - 0.38, 1.5); bench.add(apron);
      for (let x = bx0 + 0.6; x < bx1; x += 7.5) { const lg = E.box(0.24, BY - 0.2, 0.24, "#16213a"); lg.position.set(x, (BY - 0.2) / 2, 1.2); bench.add(lg); }
      const wire = E.box(bx1 - bx0, 0.012, 0.012, "#0b1222"); wire.position.set((bx0 + bx1) / 2, 4.15, 0.25); bench.add(wire); }

    // machine designs: cut-paper cabinets that get rounder and more "disc" over time (the machine is a circle, never a robot)
    const faceCard = (w, h, draw) => E.drawnCard({ w, h, px: 256, depth: 0.03, hex: "#1b2846", draw });
    const machines = [];
    const makeMachine = (kind, s) => {
      const g = new THREE.Group(); g.scale.setScalar(s); const upd = []; let H = 1;
      const body = (w, h, d, hex = "#34497a") => { const b = E.box(w, h, d, hex); b.position.y = h / 2; g.add(b); H = h; return b; };
      if (kind === "dial") { body(0.9, 0.95, 0.7);
        const dial = E.extrude(E.circleShape(0.21), C.cream, 0.03); dial.position.set(-0.14, 0.58, 0.35); g.add(dial);
        const nd = E.box(0.018, 0.17, 0.01, C.ink); nd.geometry.translate(0, 0.08, 0); nd.position.set(-0.14, 0.58, 0.39); g.add(nd);
        for (const y of [0.72, 0.45]) { const k = E.box(0.09, 0.09, 0.06, C.cream); k.position.set(0.26, y, 0.36); g.add(k); }
        const ph = rnd() * 6; upd.push((t) => (nd.rotation.z = 0.9 * Math.sin(t * 1.3 + ph))); }
      else if (kind === "reels") { body(1.0, 1.25, 0.7, "#2f4371");
        for (const x of [-0.24, 0.24]) { const r = E.extrude(E.ringShape(0.09, 0.21), C.cream, 0.03); r.position.set(x, 0.86, 0.35); g.add(r);
          const sp = E.box(0.36, 0.03, 0.02, C.cream); sp.position.set(x, 0.86, 0.37); g.add(sp); upd.push((t) => { r.rotation.z = -t * 1.6; sp.rotation.z = -t * 1.6; }); }
        const slot = E.box(0.7, 0.05, 0.02, C.ink); slot.position.set(0, 0.42, 0.36); g.add(slot); }
      else if (kind === "lights") { body(1.2, 0.85, 0.7, "#30467a");
        const f = faceCard(1.0, 0.56, (c, w, h) => { const r = E.rng(kind.length * 7 + Math.round(s * 100)); for (let y = 0; y < 4; y++) for (let x = 0; x < 8; x++) { c.fillStyle = r() < 0.45 ? "#ffd9a8" : "#5d6f96"; c.beginPath(); c.arc(18 + x * 31, 20 + y * 30, 8, 0, 7); c.fill(); } });
        f.position.set(0, 0.45, 0.36); g.add(f); }
      else if (kind === "chess") { body(1.0, 1.35, 0.75, "#2d416c");
        const f = faceCard(0.7, 0.7, (c, w, h) => { for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { c.fillStyle = (x + y) % 2 ? "#0e1424" : "#efe6d2"; c.fillRect(x * w / 8, y * h / 8, w / 8 + 1, h / 8 + 1); } });
        f.position.set(0, 0.8, 0.38); g.add(f);
        const k = E.extrude(E.polyShape([[-0.08, 0], [0.08, 0], [0.05, 0.12], [0.08, 0.28], [0.02, 0.32], [0.02, 0.38], [-0.02, 0.38], [-0.02, 0.32], [-0.08, 0.28], [-0.05, 0.12]]), C.cream, 0.04); k.position.set(0.3, 1.35, 0); g.add(k); }
      else if (kind === "grid") { body(1.3, 1.1, 0.8, "#2b4070");
        const f = faceCard(1.1, 0.8, (c, w, h) => { const cols = [3, 5, 5, 2]; const P = cols.map((n, i) => Array.from({ length: n }, (_, j) => [30 + i * (w - 60) / 3, h / 2 + (j - (n - 1) / 2) * 34]));
          c.strokeStyle = "rgba(143,230,255,0.45)"; c.lineWidth = 1.5; for (let i = 0; i < 3; i++) P[i].forEach((a) => P[i + 1].forEach((b) => { c.beginPath(); c.moveTo(...a); c.lineTo(...b); c.stroke(); }));
          P.flat().forEach(([x, y]) => { c.fillStyle = "#efe6d2"; c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); }); });
        f.position.set(0, 0.58, 0.41); g.add(f); }
      else if (kind === "ring") { body(0.95, 1.55, 0.5, "#273a63");
        const r = E.extrude(E.ringShape(0.3, 0.43), C.cyan, 0.04, { emissive: 0.25 }); r.position.set(0, 0.95, 0.26); g.add(r);
        const d = E.extrude(E.circleShape(0.3), "#0b1428", 0.03); d.position.set(0, 0.95, 0.255); g.add(d);
        g.userData.ring = r; }
      else if (kind === "self") { const b = body(1.4, 0.32, 0.9, "#1d2b4c"); H = 2.3;
        const disc = E.extrude(E.circleShape(0.92), "#101a30", 0.08); disc.position.set(0, 1.32, 0); g.add(disc);
        const rings = E.machineRings({ n: 4, r: 0.86, w: 0.07 }); rings.position.set(0, 1.32, 0.1); g.add(rings);
        const stem = E.box(0.24, 0.5, 0.2, "#1d2b4c"); stem.position.set(0, 0.5, 0); g.add(stem);
        // cyan shards that fly in and click onto the disc ("it assembles itself")
        const shards = []; for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; const m = E.box(0.16, 0.05, 0.02, C.cyan); m.material.emissive = col(C.cyan); m.material.emissiveIntensity = 1.2; g.add(m); shards.push({ m, a }); }
        g.userData.rings = rings; g.userData.shards = shards; g.userData.disc = disc; }
      machines.push({ g, upd, kind }); g.userData.H = H; return g;
    };
    // labelled generations at the camera's look point when each stamp rolls; fillers in between
    const KEYS = [
      { t: T.for, year: "1956", label: "Dartmouth", kind: "dial" },
      { t: T.ai1, year: "1997", label: "Deep Blue", kind: "chess" },
      { t: T.same, year: "2012", label: "AlexNet", kind: "grid" },
      { t: T.people, year: "2023", label: "GPT-4", kind: "ring" },
      { t: T.single, year: "2024", label: "", kind: "ring", hands: 1 },
      { t: T.that, year: "2025", label: "", kind: "ring", hands: 1, retract: true },
      { t: T.change, year: "2026", label: "", kind: "self", hands: 0, x: XE + LOOK },
    ];
    KEYS.forEach((k) => (k.x = k.x ?? xc(k.t) + LOOK));
    const slots = []; const fillerKinds = ["reels", "lights", "dial", "reels", "lights", "grid", "ring", "grid", "ring"];
    slots.push({ x: X0 - 3.4, kind: "reels", s: 0.8, hands: 2, born: 0 });
    KEYS.forEach((k, i) => { slots.push({ x: k.x, kind: k.kind, s: lerp(0.86, 1.25, i / 6), hands: k.hands ?? 2, key: k, retract: k.retract, born: i });
      const nx = KEYS[i + 1]; if (!nx) return; const gap = nx.x - k.x; const n = Math.max(0, Math.round(gap / 3.1) - 1);
      for (let j = 1; j <= n; j++) slots.push({ x: k.x + gap * j / (n + 1), kind: fillerKinds[Math.min(fillerKinds.length - 1, i + (j > n / 2 ? 1 : 0) + (i > 2 ? 2 : 0))], s: lerp(0.86, 1.25, (i + j / (n + 1)) / 6), hands: i >= 4 ? 0 : i === 3 ? 1 : 2, born: i + 0.5 }); });
    slots.forEach((sl) => { const g = makeMachine(sl.kind, sl.s); g.position.set(sl.x, BY, sl.kind === "self" ? -0.1 : 0); bench.add(g); sl.g = g; sl.H = g.userData.H * sl.s; });
    const M26 = slots.find((s) => s.kind === "self");

    // tiny amber hands on amber arms that reach over the bench's back edge
    const rr = (w, h, r, cx, cy, rot = 0) => { const s = new THREE.Shape(); const pts = [];
      const add = (x, y) => { const c = Math.cos(rot), sn = Math.sin(rot); pts.push([cx + x * c - y * sn, cy + x * sn + y * c]); };
      const x = -w / 2, y = -h / 2; const n = 5;
      const corner = (ox, oy, a0) => { for (let i = 0; i <= n; i++) { const a = a0 + i / n * Math.PI / 2; add(ox + Math.cos(a) * r, oy + Math.sin(a) * r); } };
      corner(x + w - r, y + r, -Math.PI / 2); corner(x + w - r, y + h - r, 0); corner(x + r, y + h - r, Math.PI / 2); corner(x + r, y + r, Math.PI);
      s.moveTo(...pts[0]); pts.slice(1).forEach((p) => s.lineTo(...p)); return s; };
    const handGeo = new THREE.ExtrudeGeometry([rr(0.17, 0.2, 0.05, 0, 0.06), ...[-0.06, -0.02, 0.02, 0.06].map((x, i) => rr(0.036, i === 0 || i === 3 ? 0.11 : 0.14, 0.017, x, 0.2 - (i === 0 || i === 3 ? 0.015 : 0))), rr(0.04, 0.12, 0.018, -0.1, 0.07, 0.75)], { depth: 0.03, bevelEnabled: false, curveSegments: 4 });
    handGeo.scale(1.55, 1.55, 1);
    const amberMats = E.paperMats(C.amber, { emissive: 0.5 });
    const armGeo = new THREE.BoxGeometry(0.062, 1, 0.04);
    const hands = [];
    const UP = V3(0, 1, 0), _d = V3(0, 0, 0), _q = new THREE.Quaternion();
    slots.forEach((sl, si) => { if (sl.kind === "self") return;
      const sides = sl.hands === 1 ? [1] : sl.hands === 2 ? [-1, 1] : [];
      sides.forEach((side) => { const arm = new THREE.Mesh(armGeo, amberMats[0]); arm.castShadow = true; bench.add(arm);
        const hand = new THREE.Mesh(handGeo, amberMats); hand.castShadow = true; bench.add(hand);
        hands.push({ sl, side, arm, hand, ph: rnd() * 6.28, f: 1.6 + rnd() * 1.4 }); }); });
    const placeHand = (h, t) => { const { sl, side } = h; const x = sl.x, top = BY + sl.H;
      const S = V3(x + side * 0.5, BY + 0.05, -1.45);
      const W = V3(x + side * (0.5 * sl.s + 0.22) + 0.05 * Math.sin(t * h.f + h.ph), BY + sl.H * 0.78 + 0.05 * Math.sin(t * h.f * 1.3 + h.ph * 2), 0.12 + 0.05 * Math.sin(t * 0.9 + h.ph));
      const P = V3(x + side * 0.12 * sl.s, BY + sl.H * 0.55, 0.45);
      // hands withdraw as the year accelerates (2024/2025) and are gone by 2026
      let k = 0; if (sl.retract) k = smooth(T.that + 0.05, T.that + 0.75, t); if (sl.key && sl.key.year === "2024") k = smooth(T.that - 0.2, T.change, t);
      if (sl.born >= 3.5 && !sl.key) k = smooth(T.then - 0.3, T.then + 0.6, t);
      W.lerp(V3(x + side * 0.6, BY - 0.3, -1.6), inOut(k));
      _d.subVectors(W, S); const len = _d.length(); _d.normalize();
      h.arm.position.copy(S).addScaledVector(_d, len / 2); h.arm.scale.set(1, len, 1); h.arm.quaternion.setFromUnitVectors(UP, _d);
      const pd = P.clone().sub(W).normalize().lerp(_d, 0.35).normalize(); h.hand.position.copy(W); h.hand.quaternion.setFromUnitVectors(UP, pd);
      h.hand.rotateY(side > 0 ? 0.25 : -0.25); h.hand.rotateZ(0.15 * Math.sin(t * h.f * 2 + h.ph));
      const vis = k < 0.995; h.arm.visible = h.hand.visible = vis; };

    // a string of work lamps over the bench: warm where people work, dark where they are gone
    const lamps = slots.map((sl, i) => { const g = new THREE.Group(); g.position.set(sl.x, 3.55, 0.25); bench.add(g);
      const cord = E.box(0.012, 0.6, 0.012, "#0b1222"); cord.position.y = 0.3; g.add(cord);
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.22, 20, 1, true), E.paperMat("#1a2640")); shade.material.side = THREE.DoubleSide; shade.castShadow = true; g.add(shade);
      const bulb = new THREE.Mesh(new THREE.CircleGeometry(0.1, 20), new THREE.MeshBasicMaterial({ color: C.amber })); bulb.position.set(0, -0.1, 0.02); bulb.rotation.x = -0.6; g.add(bulb);
      return { g, bulb, sl, ph: rnd() * 6 }; });

    // workbench clutter: loose sheets, pencils, little cut parts (instanced)
    { const NS = 70, sheets = new THREE.InstancedMesh(new THREE.BoxGeometry(0.42, 0.008, 0.3), E.paperMat(C.cream), NS);
      const NP = 60, parts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 10), E.paperMat("#6f7fa6"), NP);
      const NC = 26, pens = new THREE.InstancedMesh(new THREE.BoxGeometry(0.5, 0.025, 0.025), E.paperMat("#c98a4a"), NC);
      const d = new THREE.Object3D(); const r = E.rng(77);
      for (let i = 0; i < NS; i++) { d.position.set(bx0 + 2 + r() * (bx1 - bx0 - 4), BY + 0.004 + r() * 0.01, 0.55 + r() * 0.9); d.rotation.set(0, r() * Math.PI, 0); d.scale.set(0.7 + r() * 0.6, 1, 0.7 + r() * 0.6); d.updateMatrix(); sheets.setMatrixAt(i, d.matrix);
        sheets.setColorAt(i, col(r() < 0.25 ? "#a9c4d8" : C.cream).multiplyScalar(0.75 + r() * 0.25)); }
      for (let i = 0; i < NP; i++) { d.position.set(bx0 + 2 + r() * (bx1 - bx0 - 4), BY + 0.015, 0.4 + r() * 1.1); d.rotation.set(0, 0, 0); d.scale.set(0.6 + r(), 1, 0.6 + r()); d.updateMatrix(); parts.setMatrixAt(i, d.matrix); }
      for (let i = 0; i < NC; i++) { d.position.set(bx0 + 2 + r() * (bx1 - bx0 - 4), BY + 0.02, 0.7 + r() * 0.8); d.rotation.set(0, r() * Math.PI, 0); d.scale.set(1, 1, 1); d.updateMatrix(); pens.setMatrixAt(i, d.matrix); }
      [sheets, parts, pens].forEach((m) => { m.castShadow = true; m.receiveShadow = true; bench.add(m); }); }

    // ---------------- 2 · tower 1 (the 80 % gauge) ----------------
    const T1 = V3(XE + LOOK + 6.2, 0, -14);
    const tw1 = E.tower({ w: 7, h: 24, floors: 20, hex: "#22324f" }); tw1.position.copy(T1); scene.add(tw1);
    { const back = E.box(6.6, 23.6, 5, "#1a2742"); back.position.set(0.3, 11.8, -3.2); tw1.add(back);
      const ant = E.box(0.14, 3.2, 0.14, "#22324f"); ant.position.set(2.2, 25.6, -1); tw1.add(ant);
      const cap = E.box(7.4, 0.35, 5.6, "#2c3f63"); cap.position.set(0.15, 24.1, -2.4); tw1.add(cap); }
    const F1 = tw1.userData.floors, FH1 = tw1.userData.fh;
    const floorY = (i) => 1.0 + i * FH1 + FH1 * 0.51;
    const pct = E.cutoutText("80%", { height: 2.3, hex: C.cyanPale, emissive: 0.5 }); pct.position.set(T1.x + 6.3, floorY(15.5), T1.z + 1.2); scene.add(pct);
    const pctRule = E.box(2.0, 0.06, 0.04, C.cyan); pctRule.material.emissive = CYAN.clone(); pctRule.material.emissiveIntensity = 1.5; pctRule.geometry.translate(1, 0, 0); pctRule.position.set(T1.x + 3.6, floorY(15.5), T1.z + 0.8); scene.add(pctRule);

    // ---------------- 3 · tower 2 (the research floor) ----------------
    const T2 = V3(T1.x + 19.5, 0, -14);
    const tw2 = new THREE.Group(); tw2.position.copy(T2); scene.add(tw2);
    const ROOM = { x0: -4, x1: 4, y0: 13, y1: 16.6, d: 5 };
    { const s = E.rectShape(10, 22, 0, 11);
      const hp = new THREE.Path(); hp.moveTo(ROOM.x0, ROOM.y0); hp.lineTo(ROOM.x1, ROOM.y0); hp.lineTo(ROOM.x1, ROOM.y1); hp.lineTo(ROOM.x0, ROOM.y1); hp.lineTo(ROOM.x0, ROOM.y0); s.holes.push(hp);
      for (let y = 1.6; y < 21; y += 1.55) { if (y > ROOM.y0 - 1.2 && y < ROOM.y1 + 0.2) continue; for (let x = -4.1; x < 4; x += 1.25) { const w = new THREE.Path(); w.moveTo(x, y); w.lineTo(x + 0.6, y); w.lineTo(x + 0.6, y + 0.85); w.lineTo(x, y + 0.85); w.lineTo(x, y); s.holes.push(w); } }
      tw2.add(E.extrude(s, "#1f2e4b", 0.5));
      const glowLo = E.glowPlane(9.6, ROOM.y0 - 0.4, "#5a7cb8"); glowLo.position.set(0, (ROOM.y0 - 0.4) / 2 + 0.2, -0.3); glowLo.userData.setGlow(0.12); tw2.add(glowLo);
      const glowHi = E.glowPlane(9.6, 22 - ROOM.y1 - 0.4, "#5a7cb8"); glowHi.position.set(0, ROOM.y1 + (22 - ROOM.y1) / 2, -0.3); glowHi.userData.setGlow(0.12); tw2.add(glowHi);
      const volLo = E.box(9.6, ROOM.y0, 5, "#17223b"); volLo.position.set(0, ROOM.y0 / 2, -3.2); tw2.add(volLo);
      const volHi = E.box(9.6, 22 - ROOM.y1, 5, "#17223b"); volHi.position.set(0, ROOM.y1 + (22 - ROOM.y1) / 2, -3.2); tw2.add(volHi);
      const cap = E.box(10.4, 0.35, 5.6, "#2c3f63"); cap.position.set(0, 22.15, -2.5); tw2.add(cap);
      // the room behind the cut: back wall, ceiling, floor, sides, stepped rows
      const wallB = E.box(8.2, ROOM.y1 - ROOM.y0 + 0.4, 0.3, "#1b2846"); wallB.position.set(0, (ROOM.y0 + ROOM.y1) / 2, -ROOM.d); tw2.add(wallB);
      const ceil = E.box(8.2, 0.25, ROOM.d, "#141e35"); ceil.position.set(0, ROOM.y1 + 0.12, -ROOM.d / 2); tw2.add(ceil);
      const flo = E.box(8.2, 0.25, ROOM.d, "#1d2a48"); flo.position.set(0, ROOM.y0 - 0.12, -ROOM.d / 2); tw2.add(flo);
      for (const sx of [-4.1, 4.1]) { const sw = E.box(0.2, ROOM.y1 - ROOM.y0, ROOM.d, "#16213a"); sw.position.set(sx, (ROOM.y0 + ROOM.y1) / 2, -ROOM.d / 2); tw2.add(sw); } }
    const ROWS = 4, PER = 7, FS = 0.58;
    const rowZ = (r) => -0.95 - r * 0.95, rowY = (r) => ROOM.y0 + r * 0.38;
    for (let r = 1; r < ROWS; r++) { const step = E.box(8.0, r * 0.38, 0.95, "#22314f"); step.position.set(0, ROOM.y0 + r * 0.19, rowZ(r)); tw2.add(step); }
    const figShapes = (() => { const S = [];
      let s = new THREE.Shape(); s.moveTo(-0.16, 0.54); s.lineTo(0.2, 0.54); s.quadraticCurveTo(0.3, 0.96, 0.26, 1.26); s.quadraticCurveTo(0.2, 1.38, 0.04, 1.4); s.quadraticCurveTo(-0.18, 1.38, -0.22, 1.22); s.quadraticCurveTo(-0.3, 0.86, -0.16, 0.54); S.push(s);
      s = new THREE.Shape(); s.moveTo(-0.14, 0.66); s.quadraticCurveTo(0.3, 0.68, 0.64, 0.62); s.lineTo(0.68, 0.04); s.lineTo(0.8, 0); s.lineTo(0.8, -0.04); s.lineTo(0.54, -0.04); s.lineTo(0.5, 0.46); s.quadraticCurveTo(0.2, 0.48, -0.12, 0.48); S.push(s);
      S.push(E.circleShape(0.14, 0.1, 1.62)); S.push(E.rectShape(0.08, 0.14, 0.07, 1.44));
      S.push(E.polyShape([[-0.02, 1.32], [0.42, 1.12], [0.8, 1.04], [0.8, 0.96], [0.4, 1.0], [-0.02, 1.2]])); return S; })();
    const NI = ROWS * PER;
    const figIM = new THREE.InstancedMesh(new THREE.ShapeGeometry(figShapes, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }), NI);
    const deskIM = new THREE.InstancedMesh(new THREE.BoxGeometry(0.85, 0.05, 0.42), E.paperMat("#2a3b60"), NI);
    const legIM = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, 0.84, 0.05), E.paperMat("#2a3b60"), NI);
    const monIM = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.46, 0.34), new THREE.MeshBasicMaterial({ color: 0xffffff }), NI);
    { const d = new THREE.Object3D(); for (let r = 0; r < ROWS; r++) for (let c = 0; c < PER; c++) { const i = r * PER + c; const x = -3.55 + c * 1.08 + (r % 2) * 0.22, y = rowY(r), z = rowZ(r);
        d.position.set(x, y, z); d.scale.setScalar(FS); d.updateMatrix(); figIM.setMatrixAt(i, d.matrix);
        d.scale.setScalar(1); d.position.set(x + 0.98 * FS, y + 0.86 * FS, z - 0.05); d.updateMatrix(); deskIM.setMatrixAt(i, d.matrix);
        d.position.set(x + 1.3 * FS, y + 0.43 * FS, z - 0.05); d.updateMatrix(); legIM.setMatrixAt(i, d.matrix);
        d.position.set(x + 1.12 * FS, y + 1.12 * FS, z - 0.12); d.updateMatrix(); monIM.setMatrixAt(i, d.matrix);
        figIM.setColorAt(i, col("#0a111f")); monIM.setColorAt(i, col("#0c1426")); } }
    [figIM, deskIM, legIM, monIM].forEach((m) => { m.castShadow = m !== monIM; m.receiveShadow = true; tw2.add(m); });
    const rowAt = [T.automated, T.automated + 0.42, T.research + 0.12, T.intern + 0.05];
    const roof = new THREE.Group(); roof.position.set(0, 22.3, -2.4); tw2.add(roof);
    { const b = E.box(6.4, 3.0, 4.2, "#1d2c4b"); b.position.y = 1.5; roof.add(b);
      for (let k = 0; k < 2; k++) { const gp = E.glowPlane(5.2, 0.5, C.cyan); gp.position.set(0, 0.85 + k * 1.2, 2.12); gp.userData.setGlow(1.3); roof.add(gp); } }

    // ---------------- cyan threads (the carriers between the towers) ----------------
    const thread = (pts, r = 0.05, segs = 240) => { const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
      const geo = new THREE.TubeGeometry(curve, segs, r, 6, false); const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: CYAN.clone().multiplyScalar(1.6) }));
      const tip = new THREE.Mesh(new THREE.SphereGeometry(r * 2.2, 12, 8), new THREE.MeshBasicMaterial({ color: col(C.cyanPale).multiplyScalar(2.2) }));
      const total = geo.index.count; const o = { m, tip, curve,
        set: (f) => { f = clamp(f, 0, 1); const n = Math.floor(f * segs) * 6 * 6; geo.setDrawRange(0, Math.min(total, n)); m.visible = tip.visible = f > 0.002; tip.position.copy(curve.getPointAt(f)); } };
      o.set(0); return o; };
    const m26Top = V3(M26.x, BY + 1.32 * M26.s, 0.2);
    const th1 = thread([m26Top, V3(M26.x + 0.6, BY + 2.6, -1.0), V3(M26.x + 2.2, 3.4, -5), V3(T1.x - 1.5, 2.2, T1.z + 3), V3(T1.x - 0.4, floorY(0), T1.z + 0.7)], 0.05);
    const th2 = thread([V3(T1.x + 3.4, floorY(15.5), T1.z + 0.6), V3(T1.x + 8, floorY(15.5) + 2.6, T1.z + 1.5), V3(T2.x - 9, ROOM.y0 + 3.4, T2.z + 1.5), V3(T2.x - 5.1, ROOM.y0 + 1.6, T2.z + 0.7), V3(T2.x - 3.6, ROOM.y0 + 0.4, T2.z - 0.6)], 0.06);
    [th1, th2].forEach((o) => scene.add(o.m, o.tip));

    // ---------------- 4 · the hall inside the tower (separate set, reached through the research floor) ----------------
    const HX = 420; const hall = new THREE.Group(); hall.position.set(HX, 0, 0); scene.add(hall);
    const WALL = "#22335a";
    { const back = E.box(0.4, 23, 17.5, WALL); back.position.set(-9.2, 5.5, -1.25); hall.add(back);
      const side = E.box(16.4, 23, 0.4, "#18233f"); side.position.set(-1, 5.5, -10.2); hall.add(side);
      const slab = E.box(16, 1.5, 17.5, "#22314f"); slab.position.set(-1, 0.75, -1.25); hall.add(slab);
      const slabEdge = E.box(0.04, 0.06, 17.5, C.cream); slabEdge.position.set(7.01, 1.47, -1.25); slabEdge.material.emissive = col(C.cream); slabEdge.material.emissiveIntensity = 0.1; hall.add(slabEdge);
      const bfloor = E.box(16, 1, 17.5, "#141e35"); bfloor.position.set(-1, -5.5, -1.25); hall.add(bfloor);
      for (let z = -8; z <= 6; z += 3.5) { const rib = E.box(0.5, 23, 0.7, "#1f2d4d"); rib.position.set(-8.75, 5.5, z); hall.add(rib); }
      for (let x = -6.5; x <= 5; x += 3.6) { const rib = E.box(0.7, 23, 0.5, "#1c2945"); rib.position.set(x, 5.5, -9.75); hall.add(rib); }
      const duct = E.box(0.9, 0.9, 17, "#26365a"); duct.position.set(-8.3, 14.2, -1.5); hall.add(duct);
      const tray = E.box(15, 0.12, 0.8, "#26365a"); tray.position.set(-1, 12.6, -9.4); hall.add(tray);
      // racks along the side wall, little LED faces
      for (let k = 0; k < 4; k++) { const rk = E.box(1.6, 3.4, 1.2, "#1a2744"); rk.position.set(-6.8 + k * 2.1, 1.5 + 1.7, -8.9); hall.add(rk);
        const f = faceCard(1.3, 3.0, (c, w, h) => { const r = E.rng(30 + k); for (let y = 0; y < 14; y++) for (let x = 0; x < 4; x++) { c.fillStyle = r() < 0.3 ? "#8fe6ff" : "#26365a"; c.fillRect(20 + x * 56, 20 + y * 52, 30, 10); } });
        f.position.set(-6.8 + k * 2.1, 3.2, -8.28); hall.add(f); }
      // basement clutter
      for (let k = 0; k < 3; k++) { const bx = E.box(1.3, 0.9 + k * 0.3, 1.1, "#18233d"); bx.position.set(-6.5 + k * 1.5, -5 + (0.9 + k * 0.3) / 2, -7.8 + k * 0.4); hall.add(bx); }
      const pipe = E.box(16, 0.22, 0.22, "#26365a"); pipe.position.set(-1, -0.45, -9.6); hall.add(pipe); }

    // the wheel: blades = pages. Axle along x at height AX; blade i stands upright (facing +z) when rotor angle = i·Δ.
    const NB = 18, BW = 8, R0 = 0.3, R1 = 4.8, AX = 7, DA = Math.PI * 2 / NB;
    const wheel = new THREE.Group(); wheel.position.set(0, AX, 0); hall.add(wheel);
    const rotor = new THREE.Group(); wheel.add(rotor);
    const pageW = 512, pageH = Math.round(512 * (R1 - R0) / BW);
    const pageGeo = new THREE.PlaneGeometry(BW, R1 - R0); pageGeo.translate(0, (R0 + R1) / 2, 0);
    const pageBackMat = new THREE.MeshStandardMaterial({ color: C.cream, map: E.paperTex, roughness: 0.92, side: THREE.BackSide, emissive: col(C.cream), emissiveIntensity: 0 });
    const pageMats = [], blades = [];
    for (let i = 0; i < NB; i++) { const c = document.createElement("canvas"); c.width = pageW; c.height = pageH; const g = c.getContext("2d");
      g.fillStyle = C.cream; g.fillRect(0, 0, pageW, pageH);
      // paper tooth
      const pr = E.rng(500 + i); g.globalAlpha = 0.05; for (let k = 0; k < 300; k++) { g.fillStyle = pr() < 0.5 ? "#000" : "#fff"; g.fillRect(pr() * pageW, pr() * pageH, 2, 2); } g.globalAlpha = 1;
      if (i > 0) { const r = pageH * 0.034 * Math.pow(1.2, i); const cx = pageW / 2, cy = pageH / 2;
        g.fillStyle = "#6fe3ff"; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill();
        g.strokeStyle = "#0a6f8c"; g.lineWidth = Math.max(1.5, r * 0.08); g.beginPath(); g.arc(cx, cy, r * 0.7, 0, 7); g.stroke();
        g.beginPath(); g.arc(cx, cy, r * 0.38, 0, 7); g.stroke();
        g.fillStyle = "rgba(10,111,140,0.55)"; g.font = "16px Inter"; g.textAlign = "right"; g.fillText(String(i), pageW - 18, pageH - 14); }
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
      const fm = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, bumpMap: E.bumpTex, bumpScale: 0.15, emissive: 0xffffff, emissiveMap: tex, emissiveIntensity: 0 }); pageMats.push(fm);
      const bg = new THREE.Group(); bg.rotation.x = -i * DA; wheel.add(bg); blades.push(bg);
      const f = new THREE.Mesh(pageGeo, fm), b = new THREE.Mesh(pageGeo, pageBackMat); f.castShadow = b.castShadow = true; f.receiveShadow = b.receiveShadow = true; bg.add(f, b);
      const rim = E.box(BW, 0.05, 0.03, "#c9bfa9"); rim.position.y = R1; bg.add(rim); }
    // end discs (spoked flywheel faces), cyan training ring on each
    const spokeDisc = () => { const s = E.circleShape(5.3); for (let k = 0; k < 6; k++) { const a0 = k / 6 * Math.PI * 2 + 0.16, a1 = (k + 1) / 6 * Math.PI * 2 - 0.16; const p = new THREE.Path();
        p.absarc(0, 0, 4.55, a0, a1, false); p.absarc(0, 0, 1.05, a1, a0, true); s.holes.push(p); } return s; };
    const ringMats = [];
    for (const sx of [-1, 1]) { const d = E.extrude(spokeDisc(), "#24365c", 0.24); d.rotation.y = Math.PI / 2; d.position.x = sx * (BW / 2 + 0.2) - 0.12; rotor.add(d);
      const rg = E.extrude(E.ringShape(4.95, 5.12), C.cyan, 0.05, { emissive: 1 }); rg.rotation.y = Math.PI / 2; rg.position.x = sx * (BW / 2 + 0.2) + 0.14 * sx; rotor.add(rg); ringMats.push(rg.material[0]);
      const tick = E.box(0.06, 0.5, 0.5, C.cream); tick.position.set(sx * (BW / 2 + 0.36), 4.8, 0); rotor.add(tick); }
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, BW + 3.6, 24), E.paperMat("#2c3f63")); axle.rotation.z = Math.PI / 2; axle.castShadow = true; wheel.add(axle);
    const hubMat = E.paperMats("#2c3f63"); const hubs = [-1, 1].map((sx) => { const h = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.3, 28), hubMat[0]); h.rotation.z = Math.PI / 2; h.position.x = sx * (BW / 2 + 1.0); wheel.add(h); return h; });
    hubMat[0].emissive = CYAN.clone(); hubMat[0].emissiveIntensity = 0;
    for (const sx of [-1, 1]) { const a = E.extrude(E.polyShape([[-3.4, -AX + 1.5], [-2.65, -AX + 1.5], [0, -0.35], [2.65, -AX + 1.5], [3.4, -AX + 1.5], [0.42, 0.55], [-0.42, 0.55]]), "#1f2e4f", 0.22); a.rotation.y = Math.PI / 2; a.position.x = sx * (BW / 2 + 1.25) - 0.11; wheel.add(a); }
    const blurMat = new THREE.MeshStandardMaterial({ color: C.cream, map: E.paperTex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, emissive: col(C.cream), emissiveIntensity: 0.25, roughness: 0.9 });
    // motion smear over the flight arc of the pages (only when the book spins fast)
    const HANG0 = Math.PI - 0.24, HANG1 = Math.PI + 0.03, RET = Math.PI * 2 - 6 * DA, BACK0 = Math.PI * 2 - 0.5;
    const smearGeo = (r) => { const g = new THREE.PlaneGeometry(BW, 1, 1, 40); const a = g.attributes.position;
      for (let k = 0; k < a.count; k++) { const v = a.getY(k) + 0.5, an = lerp(0.12, HANG0 - 0.1, v); a.setXYZ(k, a.getX(k), r * Math.cos(an), r * Math.sin(an)); } g.computeVertexNormals(); return g; };
    const blur = new THREE.Group(); wheel.add(blur);
    [R1 - 0.02, R1 * 0.72, R1 * 0.45].forEach((r) => blur.add(new THREE.Mesh(smearGeo(r), blurMat)));
    const blurIn = blur;
    // flipbook warp: x = (θ − iΔ) mod 2π → page angle. Upright at 0, a quick fall forward (one page per Δ),
    // the turned pages hang in front, travel round the back and queue as a fanned stack behind the top page.
    const warp = (x) => { if (x < DA) return HANG0 * sineInOut(x / DA);
      if (x < Math.PI) return lerp(HANG0, HANG1, (x - DA) / (Math.PI - DA));
      if (x < RET) return lerp(HANG1, BACK0, (x - Math.PI) / (RET - Math.PI));
      return lerp(BACK0, Math.PI * 2, (x - RET) / (Math.PI * 2 - RET)); };

    // the sealed test box in the basement; its seam leaks cyan
    const fineTex = E.paperTex.clone(); fineTex.repeat.set(1.6, 1.6); fineTex.needsUpdate = true;
    const fineMat = (hex) => new THREE.MeshStandardMaterial({ color: hex, map: fineTex, bumpMap: fineTex, bumpScale: 0.4, roughness: 0.93 });
    const BOX = { x: 0, w: 2.6, d: 3.4, y0: -5, h: 2.0 };
    const seamY = BOX.y0 + BOX.h + 0.02, FACE = BOX.w / 2;
    { const body = new THREE.Mesh(new THREE.BoxGeometry(BOX.w, BOX.h, BOX.d), fineMat("#1f2d4d")); body.position.set(0, BOX.y0 + BOX.h / 2, 0); body.castShadow = body.receiveShadow = true; hall.add(body);
      const lid = new THREE.Mesh(new THREE.BoxGeometry(BOX.w + 0.12, 0.5, BOX.d + 0.12), fineMat("#283a62")); lid.position.set(0, seamY + 0.02 + 0.25, 0); lid.castShadow = lid.receiveShadow = true; hall.add(lid);
      const lidEdge = E.box(0.02, 0.03, BOX.d + 0.12, C.cream); lidEdge.position.set(FACE + 0.07, seamY + 0.52, 0); hall.add(lidEdge);
      for (const z of [-0.62, 1.25]) { const tape = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.95, 0.26), fineMat(C.amber)); tape.material.emissive = AMBER.clone(); tape.material.emissiveIntensity = 0.32; tape.position.set(FACE + 0.075, seamY + 0.05, z); tape.castShadow = true; hall.add(tape);
        const tapeTop = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.26), tape.material); tapeTop.position.set(FACE - 0.18, seamY + 0.53, z); hall.add(tapeTop); } }
    const seam = E.glowPlane(BOX.d - 0.02, 0.07, C.cyan); seam.rotation.y = Math.PI / 2; seam.position.set(FACE - 0.04, seamY, 0); hall.add(seam);
    const seamS = E.glowPlane(BOX.w - 0.02, 0.07, C.cyan); seamS.position.set(0, seamY, BOX.d / 2 - 0.04); hall.add(seamS);
    // the escaping thread, from the seam across the basement and up to the wheel's hub
    const TP = [[FACE - 0.3, seamY, 0.25], [FACE + 0.05, seamY, 0.27], [FACE + 0.28, seamY - 0.12, 0.33], [FACE + 0.5, seamY - 0.6, 0.45], [FACE + 0.66, -4.55, 0.62], [FACE + 0.86, -4.97, 0.95],
      [FACE + 1.8, -4.97, 1.6], [4.3, -4.95, 2.3], [5.6, -4.9, 2.6], [6.35, -4.5, 2.7], [6.75, -2.4, 2.7], [7.08, 0.2, 2.6], [7.1, 1.56, 2.3], [6.5, 1.6, 1.6], [5.75, 2.6, 0.9], [5.5, 4.6, 0.4], [5.35, 6.3, 0.1], [5.18, AX, 0.0]];
    const th3 = thread(TP.map((p) => V3(...p)), 0.02, 400); hall.add(th3.m, th3.tip);
    // "Again.": a second, finer filament feels its way out of the seam
    const th4 = thread([[FACE - 0.2, seamY, -0.36], [FACE + 0.03, seamY + 0.004, -0.38], [FACE + 0.17, seamY + 0.03, -0.45], [FACE + 0.27, seamY + 0.1, -0.43], [FACE + 0.3, seamY + 0.18, -0.34], [FACE + 0.26, seamY + 0.22, -0.27]].map((q) => V3(...q)), 0.011, 120); hall.add(th4.m, th4.tip);
    // dust in the seam light
    const NM = 46, moteIM = new THREE.InstancedMesh(new THREE.SphereGeometry(0.006, 6, 4), new THREE.MeshBasicMaterial({ color: col(C.cyanPale).multiplyScalar(1.1) }), NM); hall.add(moteIM);
    const motes = Array.from({ length: NM }, () => ({ x: FACE + 0.05 + rnd() * 1.0, y: seamY - 0.45 + rnd() * 0.9, z: -0.9 + rnd() * 1.8, ph: rnd() * 6.28, s: 0.5 + rnd() }));
    const _o = new THREE.Object3D();
    const fracOf = (() => { const pts = TP.map((p) => V3(...p)); const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1])); return (i) => cum[i] / cum.at(-1); })();
    const F_OUT = fracOf(1), F_DROOP = fracOf(5), F_AGAIN = fracOf(5) + 0.012;

    // ---------------- wheel angle θ(t): fast (training) → grinds to a stop → turns by itself → explodes → stops on page 0 ----------------
    const TS = 23.0, DW = 1 / 600;
    const omega = (t) => {
      if (t < T.openai2) return 5.4;
      if (t < T.stopped + 0.5) { const k = lin(T.openai2, T.stopped + 0.5, t); return 5.4 * Math.pow(1 - k, 1.6) * (0.75 + 0.25 * Math.sin(t * 47)); }
      if (t < T.stopped + 0.95) return -0.55 * Math.sin(Math.PI * lin(T.stopped + 0.5, T.stopped + 0.95, t));           // backlash
      if (t < T.build - 0.25) return 0;
      if (t < T.build) return -0.35 * Math.sin(Math.PI * lin(T.build - 0.25, T.build, t));                                  // anticipation
      if (t < T.themE) return 1.7 * smooth(T.build, T.build + 1.6, t);
      if (t < T.intel) return lerp(1.7, 2.5, smooth(T.themE, T.themE + 0.8, t));
      if (t < 43.7) return lerp(2.5, 17, smooth(T.intel - 0.1, T.expl + 0.5, t));
      return 17 * (1 - smooth(43.7, 45.3, t)) ** 1.4; };
    const TH = [0]; const nW = Math.ceil((def.to + 0.1 - TS) / DW);
    for (let i = 1; i <= nW; i++) TH.push(TH[i - 1] + omega(TS + (i - 0.5) * DW) * DW);
    const thRaw = (t) => { const f = clamp((t - TS) / DW, 0, nW), i = Math.floor(f); return lerp(TH[i], TH[Math.min(i + 1, nW)], f - i); };
    const th0 = thRaw(45.3), thTarget = Math.ceil(th0 / (Math.PI * 2)) * Math.PI * 2;   // land on blank page 0, upright
    const theta = (t) => thRaw(t) + (thTarget - th0) * smooth(42.0, 45.3, t) + (t > 45.3 ? 0.006 * Math.sin((t - 45.3) * 5) : 0);

    // ---------------- camera ----------------
    const benchCam = (t) => { const x = xc(t);
      return { p: V3(x - 1.6 + 0.06 * wob(t, 1), 2.12 + 0.05 * wob(t, 2), 6.9 + 0.08 * wob(t, 3)), l: V3(x + LOOK, 1.78 + 0.03 * wob(t, 4), -0.3) }; };
    const b0 = benchCam(9.25);
    const K1 = [
      { t: 9.25, p: b0.p.toArray(), l: b0.l.toArray() },
      { t: 10.7, p: [T1.x - 6.5, 12, 30], l: [T1.x + 1.8, 13, -14] },
      { t: 14.55, p: [T1.x - 4.8, 12.6, 26.5], l: [T1.x + 2.0, 13.2, -14], ease: "sine" },
      { t: 16.3, p: [T2.x - 4, 14.6, 12], l: [T2.x, 15.0, -14] },
      { t: 19.7, p: [T2.x - 1.6, 15.3, -2.3], l: [T2.x - 0.2, 14.9, -17], ease: "sine" },
      { t: 22.25, p: [T2.x - 2.8, 18.4, 10], l: [T2.x, 19.2, -15], ease: "smooth" },
      { t: T.two + 0.05, p: [T2.x - 2.5, 18.0, 9.0], l: [T2.x, 18.8, -15], ease: "sine" },
      { t: 23.9, p: [T2.x, 16.0, -17.75], l: [T2.x, 16.0, -40], arc: 0 },
    ];
    const H = (x, y, z) => [HX + x, y, z];
    const K2 = [
      { t: 23.9, p: H(-7.6, 13.2, 0.4), l: H(-30, 13.2, 0.4) },
      { t: 25.0, p: H(31, 4.6, 9.5), l: H(0, 3.3, 0), arc: 0.06 },
      { t: 25.75, p: H(29.6, 4.3, 9.0), l: H(0, 3.1, 0), ease: "sine" },
      { t: 26.85, p: H(8.6, -2.3, 3.6), l: H(0.8, -3.6, 0.2) },
      { t: 28.0, p: H(30, 4.1, 8.0), l: H(0, 3.6, 0) },
      { t: 28.92, p: H(29, 4.0, 7.6), l: H(0, 3.6, 0), ease: "sine" },
      { t: T.again - 0.03, p: H(FACE + 0.95, seamY - 0.13, 0.98), l: H(FACE, seamY + 0.03, -0.1), arc: 0.03 },
      { t: 31.0, p: H(FACE + 0.8, seamY - 0.1, 0.84), l: H(FACE, seamY + 0.03, -0.12), ease: "sine" },
      { t: 33.35, p: H(29, 3.8, 9.5), l: H(0, 3.5, 0) },
      { t: 36.4, p: H(27, 4.2, 10.5), l: H(0.5, 4.2, 0), ease: "sine" },
      { t: 39.6, p: H(1.2, 9.9, 19.5), l: H(0, 8.6, 0), orbit: H(0, 0, 0) },
      { t: 41.5, p: H(0.3, 9.6, 12.8), l: H(0, 8.9, 0), ease: "sine" },
      { t: 42.8, p: H(0, 9.5, 24), l: H(0, 9.5, 0) },
      { t: 44.6, p: H(0, 9.5, 22.6), l: H(0, 9.5, 0), ease: "sine" },
      { t: def.to, p: H(0, 9.55, 6.0), l: H(0, 9.55, 0), arc: 0 },
    ];
    const ease = (e, x) => (e === "smooth" ? x * x * (3 - 2 * x) : e === "sine" ? sineInOut(x) : e === "linear" ? x : inOut(x));
    const path = (keys, t, seed) => { let i = 0; while (i < keys.length - 2 && t > keys[i + 1].t) i++;
      const a = keys[i], b = keys[i + 1]; const k = ease(b.ease, lin(a.t, b.t, t));
      const pa = V3(...a.p), pb = V3(...b.p), la = V3(...a.l), lb = V3(...b.l); let p;
      if (b.orbit) { const c = V3(...b.orbit); const ra = Math.hypot(pa.x - c.x, pa.z - c.z), rb = Math.hypot(pb.x - c.x, pb.z - c.z);
        const aa = Math.atan2(pa.z - c.z, pa.x - c.x), ab = Math.atan2(pb.z - c.z, pb.x - c.x); const an = lerp(aa, ab, k), rr2 = lerp(ra, rb, k);
        p = V3(c.x + Math.cos(an) * rr2, lerp(pa.y, pb.y, k) + Math.sin(Math.PI * k) * 1.2, c.z + Math.sin(an) * rr2); }
      else { p = pa.clone().lerp(pb, k); const bulge = Math.sin(Math.PI * k) * pa.distanceTo(pb) * (b.arc ?? 0.1); p.x += bulge * (i % 2 ? -1 : 1) * 0.7; p.y += bulge * 0.5; }
      const l = la.clone().lerp(lb, k);
      const d = p.distanceTo(l) * 0.01 * smooth(keys[0].t, keys[0].t + 0.8, t);
      p.x += d * (Math.sin(t * 0.37 + seed) * 0.9 + Math.sin(t * 0.83 + 1.3 + seed) * 0.4); p.y += d * (Math.sin(t * 0.51 + 0.7 + seed) * 0.6 + Math.sin(t * 1.13 + 2.1) * 0.2);
      l.x += d * Math.sin(t * 0.29 + 0.4 + seed) * 0.5; l.y += d * Math.sin(t * 0.43 + 1.9 + seed) * 0.35;
      return { p, l }; };

    // ---------------- DOM ----------------
    const layer = E.layer;
    const stamp = E.stampDOM(layer, KEYS.map((k) => ({ t: k.t, year: k.year, label: k.label })), T.may - 0.45);
    const srcMay = E.srcDOM(layer, { big: "MAY 2026", small: "&gt;80% of merged code at Anthropic: Claude", inAt: T.may, outAt: 15.0 });
    const srcSept = E.srcDOM(layer, { big: "SEPT 2026", small: "OpenAI: “automated research intern”", inAt: T.sept + 0.1, outAt: T.two - 0.2 });
    const srcStop = E.srcDOM(layer, { big: "OpenAI", small: "training paused", inAt: T.stopped, outAt: T.again - 0.65 });
    const title = E.titleDOM(layer, { text: "Has the Intelligence Explosion Already Begun?", inAt: T.begunE - 0.32, outAt: 45.05, size: 104 });
    Object.assign(title.el.style, { padding: "0 300px", top: "19%" });

    // ---------------- update ----------------
    const tmpC = new THREE.Color();
    const post = { bloom: 0.5, exposure: 1.15 };
    const update = (t) => {
      st.update(t); city.update(t);
      const inHall = t >= 23.9;
      // camera
      let cam; if (t < 9.25) cam = benchCam(t); else if (!inHall) cam = path(K1, t, 0.3); else cam = path(K2, t, 1.1);
      E.applyCam(camera, cam, 0.006 * Math.sin(t * 0.31));

      // key light follows the set
      const key = L.key, sh = key.shadow.camera;
      if (t < 9.6) { key.target.position.set(cam.l.x, 1, -1); key.position.set(cam.l.x - 10, 18, 14); key.intensity = 2.0; L.hemi.intensity = 0.7; Object.assign(sh, { left: -14, right: 14, top: 10, bottom: -6 }); }
      else if (!inHall) { key.target.position.set(T1.x + 9, 8, -14); key.position.set(T1.x - 22, 42, 30); key.intensity = 2.2; L.hemi.intensity = 0.75; Object.assign(sh, { left: -32, right: 32, top: 30, bottom: -14 }); }
      else { const w = smooth(36.8, 39.6, t); key.target.position.set(HX, lerp(1, 6, w), 0);
        key.position.set(HX + lerp(22, 5, w), lerp(24, 22, w), lerp(12, 26, w)); key.color.set(pal.key).lerp(col("#ffe6c4"), w);
        key.intensity = lerp(1.6, 2.4, w); L.hemi.intensity = lerp(0.75, 0.7, w); Object.assign(sh, { left: -16, right: 16, top: 16, bottom: -12 }); }
      sh.updateProjectionMatrix();

      // ---- bench ----
      const lx = cam.l.x;
      const people = 1 - smooth(T.then + 0.4, T.change, t);
      lightAmb.position.set(lx + 0.4, 3.0, 1.4); lightAmb.intensity = t < 10.5 ? (20 + 8 * people) * (1 + 0.04 * Math.sin(t * 7.1) * Math.sin(t * 2.3)) : 0;
      machines.forEach((m) => m.upd.forEach((f) => f(t)));
      hands.forEach((h) => { if (Math.abs(h.sl.x - lx) < 9 && t < 10.5) placeHand(h, t); else h.arm.visible = h.hand.visible = false; });
      lamps.forEach((lp) => { const yr = lp.sl.born; let on = 1;
        if (yr >= 3.5) on = 1 - smooth(T.then - 0.2, T.then + 0.6, t);
        if (lp.sl.key && lp.sl.key.year === "2024") on = 1 - smooth(T.that - 0.3, T.that + 0.2, t);
        if (lp.sl.key && lp.sl.key.year === "2025") { const k = t - (T.that + 0.35); on = k < 0 ? 1 : k < 0.07 ? 0.2 : k < 0.12 ? 0.8 : k < 0.18 ? 0.1 : 0; }
        if (lp.sl.kind === "self") on = 0;
        const f = 1 + 0.05 * Math.sin(t * 9 + lp.ph) * Math.sin(t * 3.3 + lp.ph);
        lp.bulb.material.color.copy(AMBER).multiplyScalar(lerp(0.06, 2.4, on) * f); lp.g.rotation.z = 0.03 * Math.sin(t * 0.8 + lp.ph); });
      // 2026: the machine assembles itself and lights on "change"
      { const g = M26.g, k = expoOut(lin(T.change - 0.9, T.change, t)); const on = smooth(T.change - 0.05, T.change + 0.25, t);
        g.userData.shards.forEach((s, i) => { const a = s.a + t * 0.4; const r = lerp(2.4 + 0.3 * i, 0.98, expoOut(lin(T.change - 1.3 + i * 0.07, T.change - 0.05, t)));
          s.m.position.set(Math.cos(a) * r, 1.32 + Math.sin(a) * r, 0.14); s.m.rotation.z = a + Math.PI / 2; s.m.visible = t > T.single; });
        g.userData.rings.userData.update(t, { think: 0.6 + on, glow: 0.12 + 0.75 * on }); g.userData.disc.rotation.z = t * 0.1;
        lightCyA.position.set(M26.x, BY + 1.6, 1.5); lightCyA.intensity = t < 10.4 ? 14 * on * (1 + 0.05 * Math.sin(t * 5)) : 0; void k; }
      machines.forEach((m) => { if (m.g.userData.ring) m.g.userData.ring.material[0].emissiveIntensity = 0.25 + 0.15 * Math.sin(t * 2 + m.g.position.x); });

      // ---- thread 1 + tower 1 gauge ----
      th1.set(inOut(lin(T.change + 0.35, 10.5, t)));
      let lv = 0; if (t > T.ai2 - 0.1) { const u = lin(T.ai2 - 0.1, T.p80, t); lv = 16 * Math.pow(u, 1.7); if (t > T.p80) lv = 16 + 0.85 * Math.exp(-(t - T.p80) * 5) * Math.sin((t - T.p80) * 15) + 0.02 * Math.sin(t * 3); }
      F1.forEach((p, i) => { const kc = clamp(lv - i, 0, 1); const fl = 1 + 0.04 * Math.sin(t * 6 + i * 1.7);
        tmpC.copy(AMBER).lerp(CYAN, kc); p.material.color.copy(tmpC).multiplyScalar((0.03 + (0.72 + 0.35 * kc) * 1.4) * fl); });
      { const k = spring(lin(T.p80, T.p80 + 0.7, t)); pct.scale.setScalar(Math.max(0.001, k)); pct.visible = t > T.p80 - 0.02; pct.rotation.y = -0.15 + 0.04 * Math.sin(t * 0.9); pct.position.y = floorY(15.5) + 0.05 * Math.sin(t * 1.3);
        pctRule.scale.x = Math.max(0.001, expoOut(lin(T.p80 - 0.15, T.p80 + 0.35, t))); pctRule.visible = t > T.p80 - 0.15; }

      // ---- thread 2 + tower 2 room ----
      th2.set(inOut(lin(14.5, 16.1, t)));
      let lit = 0;
      for (let r = 0; r < ROWS; r++) { const k = smooth(rowAt[r], rowAt[r] + 0.22, t); const fl = k > 0 && k < 1 ? 0.6 + 0.4 * Math.sin(t * 60) : 1; lit += k;
        for (let c = 0; c < PER; c++) { const i = r * PER + c; const wave = 1 + 0.35 * Math.max(0, Math.sin((t - T.doing) * 6 - c * 0.9 - r * 0.6)) * smooth(T.doing, T.doing + 0.4, t) * (1 - smooth(T.two, T.two + 0.5, t));
          figIM.setColorAt(i, tmpC.set("#0a111f").lerp(CYAN, k * fl * 0.62)); monIM.setColorAt(i, tmpC.set("#0c1426").lerp(CYAN, k * fl).multiplyScalar(0.9 + k * 0.5 * wave)); } }
      figIM.instanceColor.needsUpdate = true; monIM.instanceColor.needsUpdate = true;
      if (t > 10.4 && t < 23.95) { lightCyA.position.set(T2.x, ROOM.y0 + 2.2, T2.z - 0.6); lightCyA.intensity = 9 * lit * (1 + 0.04 * Math.sin(t * 7)) + (t < 15 ? 10 * smooth(T.ai2, T.p80, t) : 0);
        if (t < 15) lightCyA.position.set(T1.x + 1.5, floorY(8), T1.z + 3.2); }
      { const k = spring(lin(T.next, T.next + 0.95, t)); roof.scale.set(1, Math.max(0.001, k), 1); roof.visible = t > T.next - 0.02; roof.position.x = 0.03 * Math.sin(t * 1.1); }

      // ---- hall ----
      const train = t < T.stopped ? 1 : t < T.stopped + 0.1 ? [1, 0.25, 0.8, 0][Math.min(3, Math.floor((t - T.stopped) / 0.025))] : 0.0;
      const selfOn = smooth(T.build, T.build + 1.5, t);
      const th = theta(t); rotor.rotation.x = th;
      const morph = smooth(36.7, 39.3, t);
      blades.forEach((bg, i) => { const u = th - i * DA; const k = Math.floor(u / (Math.PI * 2)); const x = u - k * Math.PI * 2;
        bg.rotation.x = k * Math.PI * 2 + lerp(x, warp(x), morph) + 0.004 * Math.sin(t * 3 + i); });
      ringMats.forEach((m) => (m.emissiveIntensity = 1.6 * train + 0.9 * selfOn));
      lightCyB.position.set(HX + 4, 4.5, 4); lightCyB.intensity = inHall ? 22 * train + 9 * selfOn : 0;
      const reach = smooth(T.themE - 0.2, T.themE + 0.4, t);
      hubMat[0].emissiveIntensity = 2.2 * reach; hubs.forEach((h) => (h.rotation.x = th * 0.5));
      const flip = smooth(36.8, 39.4, t);
      pageMats.forEach((m) => (m.emissiveIntensity = 0.04 + 0.32 * flip + 0.25 * smooth(44.6, 45.8, t)));
      pageBackMat.emissiveIntensity = 0.03 + 0.25 * flip;
      const w = omega(t); const bl = clamp((w - 6) / 9, 0, 1) * smooth(38, 40, t);
      blurMat.opacity = 0.2 * bl; blurMat.emissiveIntensity = 0.25 + 0.25 * bl; blur.visible = bl > 0.01;
      // box + seam (the basement hero light)
      const again = smooth(T.again - 0.1, T.againE + 0.4, t) * (1 - smooth(31.2, 32.5, t));
      const pulse = 1 + 0.06 * Math.sin(t * 2.3) + 0.03 * Math.sin(t * 7.9);
      seam.userData.setGlow((1.05 + 0.55 * again) * pulse); seamS.userData.setGlow(0.9 * pulse);
      const ecu = smooth(28.95, T.again, t) * (1 - smooth(31.0, 32.6, t));
      lightBox.position.set(HX + FACE + lerp(0.9, 0.22, ecu), seamY + lerp(-0.1, 0.02, ecu), lerp(0.4, 0.1, ecu)); lightBox.distance = lerp(9, 2.4, ecu); lightBox.intensity = inHall ? lerp(7, 2.2, ecu) * (1 + 0.6 * again) * pulse : 0;
      th4.set(smooth(T.again - 0.05, T.againE + 1.5, t)); th4.tip.scale.setScalar(1 + 0.3 * Math.sin(t * 5));
      motes.forEach((m, i) => { _o.position.set(m.x + 0.05 * Math.sin(t * 0.3 * m.s + m.ph), m.y + 0.06 * Math.sin(t * 0.21 * m.s + m.ph * 2), m.z + 0.05 * Math.cos(t * 0.25 + m.ph)); _o.scale.setScalar(m.s); _o.updateMatrix(); moteIM.setMatrixAt(i, _o.matrix); });
      moteIM.instanceMatrix.needsUpdate = true; moteIM.visible = ecu > 0.01;
      let f3 = 0;
      if (t > T.escaped - 0.1) f3 = lerp(0, F_OUT, smooth(T.escaped - 0.1, T.escaped + 0.5, t)) + (F_DROOP - F_OUT) * smooth(T.escaped + 0.4, T.escaped + 1.9, t);
      f3 += (F_AGAIN - F_DROOP) * smooth(T.again, T.againE + 0.9, t);
      f3 += (1 - F_AGAIN) * inOut(lin(T.always - 0.35, T.themE, t));
      th3.set(f3);
      th3.tip.scale.setScalar(1 + 0.25 * Math.sin(t * 6) + 0.6 * again);

      // post
      post.bloom = inHall ? 0.55 + 0.1 * bl : 0.5;
      post.exposure = 1.15;
      // DOM
      stamp.update(t); srcMay.update(t); srcSept.update(t); srcStop.update(t); title.update(t);
    };
    return { scene, camera, post, update };
  },
};
