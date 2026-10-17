// s13 · Your part (668.99 → 730.88 s). Dawn palette throughout.
// Carrier in: the amber "you" figure (E.figure stand, #ffa047) centred at ~40 % frame height, exactly as s12 ends.
//   1 pull back: the figure stands on a dawn rooftop beside the exam desk; on it the sealed test box from the hook,
//     its seam now stitched shut with amber paper ("Back to July … they looked for a shortcut").
//   2 "Now we're the ones being tested": the box lid opens, the figure walks to the desk and sits; the booklet is the flipbook.
//     "whether AI gets smarter — it will": the pages race and blur (each page a bigger cyan disc).
//   3 "keep a hand on the book": an amber paper hand slides in, its thumb rests on the page edge — the turning slows to a readable rhythm.
//   4 "a number creeping up in a report": the book settles on the report page from part 2; its % ticks upward in the margin.
//   5 "headline": a newspaper flips up behind the book; on "question" a small card with a hand-cut "?" slides beneath it.
//   6 three small doors pop up on the roof and light amber one by one: laptop ("work with AI"), workplace ("report"), ballot box ("vote").
//   7 "The pages are turning": back on the book in the thumb's hold, calm; the camera drifts up into the dawn city …
//   8 … to Lena's window: she holds the card ("Would you have let Lena's system run?").
//   9 "Next time": her desk empties, then a small pop-up of new work grows on it; the camera drifts back: end screen
//     (calm dawn city on the left, open sky on the right half for the two end-screen video boxes).
// Wow moment: the thumb landing on the book and the racing pages settling into a readable rhythm (largest tempo contrast).
import { drawReport } from "./s02-why.js";

export default {
  build(E, def) {
    const { THREE, C, PAL, lin, smooth, lerp, clamp, expoOut, inOut, sineInOut, spring, wob } = E;
    const pal = PAL.dawn;
    const scene = new THREE.Scene();
    const camera = E.newCamera();
    const A = (p, n = 1) => E.at("yourpart", p, n), Z = (p, n = 1) => E.end("yourpart", p, n);
    const T = {
      back: A("Back"), shortcut: A("shortcut"), now: A("Now"), tested2: A("tested", 2), smarter: A("smarter"), itwill: A("it will"),
      hand: A("hand"), book: A("book"), so: A("So"), begunE: Z("begun"), quietly: A("Quietly"), number: A("number"), reportE: Z("report"),
      read: A("Read"), headline: A("headline"), question: A("question"), slow: A("slow"), work: A("work"), report2: A("report", 2), vote: A("vote"),
      optionalE: Z("optional"), pages: A("pages"), decide: A("decide"), fastE: Z("fast"), would: A("Would"), lena: A("Lena's"), below: Z("below"),
      next: A("Next time", 2), cheap: A("cheap"), workE: Z("work", 2), voEnd: E.section("yourpart").voEnd, end: def.to,
    };
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
    const col = (h) => new THREE.Color(h);
    const rnd = E.rng(1313);

    // ---------------- stage: dawn ----------------
    const st = E.stage(scene, pal, { stars: 40, orb: { x: -16, y: 13, r: 4.2, hex: "#ffd9a8", glow: 0.85 }, seed: 31, floorColor: "#6a4a68" });
    const L = E.lights(scene, pal, { key: [-26, 18, 22], target: [0, 0, -4], intensity: 2.3, hemi: 0.9, box: 9 });
    const city = E.city(scene, pal, { zs: [-50, -42, -34, -27], holes: [0, 0.05, 0.12, 0.1], heights: [[4, 9], [5, 11], [6, 13], [4, 9]], seed: 77, width: 95 });
    const warm = E.pointLight("#ffc890", 0, 6); scene.add(warm);           // the desk's warm practical
    const doorLight = E.pointLight(C.amber, 0, 6); scene.add(doorLight);
    const roomLight = E.pointLight("#ffbe7a", 0, 9); scene.add(roomLight);  // Lena's lamp

    // roof edge / parapet + a few roof props (depth layers in front of the city)
    { const par = E.box(40, 0.5, 0.4, "#7a4f70"); par.position.set(0, 0.25, -3.2); scene.add(par);
      const vent = E.box(0.9, 1.1, 0.9, "#603f5f"); vent.position.set(-3.4, 0.55, -2.2); scene.add(vent);
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 1.6, 24), E.paperMat("#94627e")); tank.position.set(7.4, 0.8, -2.4); tank.castShadow = true; scene.add(tank);
      const ant = E.box(0.06, 2.4, 0.06, "#4d3350"); ant.position.set(7.4, 2.8, -2.4); scene.add(ant); }

    // ---------------- the figure ("you") ----------------
    const FIG = "#ffa047";
    const fig = (o) => { const f = E.figure(o); f.userData.mat.side = THREE.DoubleSide; f.traverse((m) => { if (m.isMesh) m.castShadow = true; }); return f; };
    const youStand = fig({ pose: "stand", hex: FIG, seed: 7 }); scene.add(youStand);
    const youSit = fig({ pose: "sit", hex: FIG, seed: 7 }); youSit.position.set(0.5, 0, 0.12); scene.add(youSit);

    // ---------------- the exam desk + the box (seam repaired) ----------------
    const DESK = { x: 1.62, y: 0.8, z: -0.42 };
    { const top = E.box(1.7, 0.05, 1.0, "#94627e"); top.position.set(DESK.x, DESK.y - 0.025, DESK.z); scene.add(top);
      for (const [dx, dz] of [[-0.78, -0.42], [0.78, -0.42], [-0.78, 0.42], [0.78, 0.42]]) { const lg = E.box(0.05, DESK.y - 0.05, 0.05, "#603f5f"); lg.position.set(DESK.x + dx, (DESK.y - 0.05) / 2, DESK.z + dz); scene.add(lg); }
      const seat = E.box(0.42, 0.04, 0.42, "#7a4f70"); seat.position.set(0.42, 0.5, DESK.z); scene.add(seat);
      const back = E.box(0.04, 0.5, 0.42, "#7a4f70"); back.position.set(0.22, 0.75, DESK.z); scene.add(back);
      for (const [dx, dz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) { const lg = E.box(0.03, 0.5, 0.03, "#603f5f"); lg.position.set(0.42 + dx, 0.25, DESK.z + dz); scene.add(lg); } }
    const BOX = { w: 1.12, h: 0.28, d: 0.68 }; const boxY = DESK.y;
    const box = new THREE.Group(); box.position.set(DESK.x, boxY, DESK.z - 0.04); scene.add(box);
    { const b = E.box(BOX.w, BOX.h, BOX.d, "#3a2b52"); b.position.y = BOX.h / 2; box.add(b);
      // amber stitches across the old seam (front + sides)
      for (let k = 0; k < 9; k++) { const s = E.box(0.018, 0.09, 0.012, C.amber); s.material.emissive = col(C.amber); s.material.emissiveIntensity = 0.5; s.position.set(-0.48 + k * 0.12, BOX.h - 0.02, BOX.d / 2 + 0.006); s.rotation.z = (k % 2 ? 1 : -1) * 0.5; box.add(s); } }
    const lidHinge = new THREE.Group(); lidHinge.position.set(0, BOX.h, -BOX.d / 2); box.add(lidHinge);
    { const lid = E.box(BOX.w + 0.03, 0.05, BOX.d + 0.03, "#4a3762"); lid.position.set(0, 0.025, BOX.d / 2); lidHinge.add(lid);
      for (let k = 0; k < 9; k++) { const s = E.box(0.018, 0.012, 0.07, C.amber); s.material.emissive = col(C.amber); s.material.emissiveIntensity = 0.5; s.position.set(-0.48 + k * 0.12, 0.052, BOX.d - 0.02); s.rotation.y = (k % 2 ? 1 : -1) * 0.5; lidHinge.add(s); } }
    const boxGlow = E.glowPlane(BOX.w - 0.08, BOX.d - 0.08, "#ffd9a8"); boxGlow.rotation.x = -Math.PI / 2; boxGlow.position.set(0, BOX.h - 0.03, 0); box.add(boxGlow);

    // ---------------- the flipbook (= exam booklet), lying open in the box ----------------
    const BW = 0.48, BH = 0.27, NP = 24, P = 14;     // page P = the report page
    const rep = (ctx, w, h) => { ctx.save(); ctx.scale(w / 1920, h / 1080); drawReport(ctx, 1920, 1080, E.rng); ctx.restore(); };
    const book = E.flipbook({ w: BW, h: BH, pages: NP, cover: "#4a3762", seed: 13, drawPage: (ctx, w, h, i) => {
      if (i === P) return rep(ctx, w, h);
      const r = h * 0.05 * Math.pow(1.17, i % 16); ctx.fillStyle = "#6fe3ff"; ctx.beginPath(); ctx.arc(w / 2, h / 2, r, 0, 7); ctx.fill();
      ctx.strokeStyle = "#0a6f8c"; ctx.lineWidth = Math.max(1.5, r * 0.08); ctx.beginPath(); ctx.arc(w / 2, h / 2, r * 0.7, 0, 7); ctx.stroke();
      ctx.fillStyle = "rgba(31,29,38,0.5)"; ctx.font = "15px Inter"; ctx.textAlign = "right"; ctx.fillText(String(i + 1), w - 14, h - 12); } });
    book.rotation.x = -Math.PI / 2; const BOOK = V3(DESK.x, boxY + BOX.h - 0.035, DESK.z - 0.04); book.position.copy(BOOK); scene.add(book);
    const RP = V3(BOOK.x + BW / 2, BOOK.y, BOOK.z);   // right page centre
    // hi-res report overlay while the book rests on page P (identical content, sharper for the close-up)
    const repCard = E.drawnCard({ w: BW, h: BH, px: 1600, depth: 0.001, draw: (g, w, h) => drawReport(g, w, h, E.rng) });
    repCard.rotation.x = -Math.PI / 2; repCard.position.set(RP.x, BOOK.y - P * 0.012 + 0.003, RP.z); repCard.castShadow = false; scene.add(repCard);
    // the % in the margin keeps creeping up
    const pc = document.createElement("canvas"); pc.width = 512; pc.height = 256; const pg = pc.getContext("2d"); const ptex = new THREE.CanvasTexture(pc); ptex.colorSpace = THREE.SRGBColorSpace;
    const pct = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.05), new THREE.MeshStandardMaterial({ map: ptex, emissiveMap: ptex, emissive: 0xffffff, emissiveIntensity: 0.35, roughness: 0.95 }));
    pct.rotation.x = -Math.PI / 2; pct.position.set(RP.x + BW * 0.31, repCard.position.y + 0.002, RP.z - BH * 0.06); scene.add(pct);
    let pctLast = "";
    const drawPct = (t) => { const t0 = T.number, v = t < t0 ? 61 : Math.min(79, 61 + Math.floor((t - t0) / 0.6)); const tk = t0 + (v - 61) * 0.6; const k = t < t0 ? 1 : expoOut(clamp((t - tk) / 0.22, 0, 1));
      const key = v + "|" + k.toFixed(2); if (key === pctLast) return; pctLast = key;
      pg.fillStyle = "#efe6d2"; pg.fillRect(0, 0, 512, 256); pg.save(); pg.beginPath(); pg.rect(0, 20, 512, 216); pg.clip();
      pg.fillStyle = "#0a6f8c"; pg.font = '190px "Instrument Serif"'; pg.textBaseline = "alphabetic"; const y = 200;
      if (k < 1 && v > 61) pg.fillText((v - 1) + "%", 110, y - k * 200); pg.fillText(v + "%", 110, y + (1 - k) * 200); pg.restore();
      pg.beginPath(); pg.moveTo(40, 150); pg.lineTo(80, 150); pg.lineTo(60, 112); pg.closePath(); pg.fill(); ptex.needsUpdate = true; };

    // flip(t): still → racing (AI gets smarter) → thumb lands, readable rhythm → settles on the report page → (later) calm turning
    const vel = (t) => { if (t < T.now + 0.6) return 0;
      if (t < T.hand) return lerp(0.6, 11, smooth(T.now + 0.6, T.itwill, t));
      if (t < T.so) return lerp(11, 1.6, expoOut(lin(T.hand, T.hand + 0.9, t)));
      if (t < T.begunE + 0.4) return 1.6 * (1 - smooth(T.so + 0.6, T.begunE + 0.4, t));
      if (t < T.pages - 0.2) return 0;
      return 1.1 * smooth(T.pages - 0.2, T.pages + 0.6, t); };
    const DT = 1 / 240, T0 = def.from, NF = Math.ceil((def.to - T0) / DT) + 2, FT = [0];
    for (let i = 1; i < NF; i++) FT.push(FT[i - 1] + vel(T0 + (i - 0.5) * DT) * DT);
    const fRaw = (t) => { const f = clamp((t - T0) / DT, 0, NF - 1), i = Math.floor(f); return lerp(FT[i], FT[Math.min(i + 1, NF - 1)], f - i); };
    const fLand = fRaw(T.begunE + 0.4); const target = (() => { let x = P - 0.5; while (x < fLand) x += NP; return x; })();
    const flipAt = (t) => fRaw(t) + (target - fLand) * smooth(T.now + 0.6, T.begunE + 0.4, t);

    // the hand (amber paper, the viewer's), thumb on the page edge
    const rr = (w, h, r, cx, cy, rot = 0) => { const s = new THREE.Shape(); const pts = []; const add = (x, y) => { const c = Math.cos(rot), sn = Math.sin(rot); pts.push([cx + x * c - y * sn, cy + x * sn + y * c]); };
      const x = -w / 2, y = -h / 2, n = 6; const corner = (ox, oy, a0) => { for (let i = 0; i <= n; i++) { const a = a0 + i / n * Math.PI / 2; add(ox + Math.cos(a) * r, oy + Math.sin(a) * r); } };
      corner(x + w - r, y + r, -Math.PI / 2); corner(x + w - r, y + h - r, 0); corner(x + r, y + h - r, Math.PI / 2); corner(x + r, y + r, Math.PI); s.moveTo(...pts[0]); pts.slice(1).forEach((p) => s.lineTo(...p)); return s; };
    const handGeo = new THREE.ExtrudeGeometry([rr(0.17, 0.2, 0.05, 0, 0.06), ...[-0.06, -0.02, 0.02, 0.06].map((x, i) => rr(0.036, i === 0 || i === 3 ? 0.11 : 0.14, 0.017, x, 0.2 - (i === 0 || i === 3 ? 0.015 : 0))), rr(0.042, 0.13, 0.019, -0.105, 0.09, 0.95), rr(0.12, 0.3, 0.05, 0.0, -0.17)], { depth: 0.012, bevelEnabled: false, curveSegments: 4 });
    const hand = new THREE.Mesh(handGeo, E.paperMats(C.amber, { emissive: 0.45 })); hand.castShadow = true; scene.add(hand);
    hand.rotation.set(-Math.PI / 2, 0, Math.PI * 0.82);   // lying flat, fingers toward the book's right edge, thumb on it

    // ---------------- headline + question card ----------------
    const paperHinge = new THREE.Group(); paperHinge.position.set(DESK.x + 0.05, DESK.y, DESK.z - 0.47); scene.add(paperHinge);
    const paper = E.drawnCard({ w: 0.78, h: 0.52, px: 900, depth: 0.004, hex: "#efe6d2", draw: (g, w, h) => {
      g.fillStyle = "#1f1d26"; g.font = '64px "Instrument Serif"'; g.textAlign = "center"; g.fillText("The Morning Paper", w / 2, 78);
      g.fillRect(40, 100, w - 80, 4); g.fillRect(40, 110, w - 80, 1.5);
      g.font = '118px "Instrument Serif"'; g.fillText("AI builds AI", w / 2, 250);
      const r = E.rng(9); g.fillStyle = "rgba(31,29,38,0.3)"; for (let c = 0; c < 3; c++) for (let y = 300; y < h - 40; y += 30) g.fillRect(40 + c * ((w - 80) / 3) + 10, y, ((w - 80) / 3 - 30) * (0.7 + r() * 0.3), 11);
      g.fillStyle = "#6fe3ff"; g.beginPath(); g.arc(w - 150, 380, 70, 0, 7); g.fill(); } });
    paper.position.set(0, 0.26, 0); paperHinge.add(paper);
    const qcard = new THREE.Group(); scene.add(qcard);
    { const base = E.box(0.24, 0.006, 0.15, C.cream); qcard.add(base); const q = E.cutoutText("?", { height: 0.12, hex: "#1f1d26" }); q.rotation.x = -Math.PI / 2; q.position.y = 0.006; qcard.add(q); }

    // ---------------- three small doors on the roof ----------------
    const doorIcon = (k) => { const g = new THREE.Group(); const ink = "#2a1c30";
      if (k === 0) { const scr = E.box(0.26, 0.17, 0.012, ink); scr.position.set(0, 0.2, 0); scr.rotation.x = -0.15; g.add(scr); const kb = E.box(0.3, 0.015, 0.14, ink); kb.position.set(0, 0.1, 0.06); g.add(kb); }
      else if (k === 1) { const b = E.extrude(E.polyShape([[-0.16, 0], [0.16, 0], [0.16, 0.26], [0.05, 0.26], [0.05, 0.34], [-0.05, 0.34], [-0.05, 0.26], [-0.16, 0.26]]), ink, 0.02); b.position.y = 0.04; g.add(b);
        for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) { const w = E.glowPlane(0.05, 0.04, C.amber); w.position.set(-0.09 + x * 0.09, 0.1 + y * 0.065, 0.025); w.userData.setGlow(1.4); g.add(w); } }
      else { const b = E.box(0.28, 0.2, 0.18, ink); b.position.y = 0.14; g.add(b); const card = E.box(0.12, 0.1, 0.008, C.cream); card.position.set(0, 0.28, 0); card.rotation.z = 0.15; g.add(card); g.userData.card = card; }
      return g; };
    const doorAt = [T.work, T.report2, T.vote];
    const doors = [0, 1, 2].map((k) => { const hinge = new THREE.Group(); hinge.position.set(3.55 + k * 0.95, 0, -0.5); scene.add(hinge);
      const fr = new THREE.Group(); hinge.add(fr);
      const mk = (w, h, x, y) => { const b = E.box(w, h, 0.08, "#94627e"); b.position.set(x, y, 0); fr.add(b); };
      mk(0.06, 0.95, -0.31, 0.475); mk(0.06, 0.95, 0.31, 0.475); mk(0.68, 0.06, 0, 0.95);
      const glow = E.glowPlane(0.56, 0.9, "#ffcf94"); glow.position.set(0, 0.46, -0.05); glow.userData.setGlow(0.08); fr.add(glow);
      const icon = doorIcon(k); icon.position.set(0, 0.06, -0.02); icon.scale.setScalar(1.2); fr.add(icon);
      const pan = new THREE.Group(); pan.position.set(-0.28, 0, 0.03); fr.add(pan);
      const p = E.box(0.56, 0.9, 0.025, "#b07a8c"); p.position.set(0.28, 0.46, 0); pan.add(p); const knob = E.box(0.04, 0.04, 0.03, C.amber); knob.position.set(0.5, 0.46, 0.02); pan.add(knob);
      return { hinge, glow, pan, icon, k }; });

    // ---------------- Lena's window in the dawn city ----------------
    const LT = V3(-6.5, 0, -17);
    const lt = new THREE.Group(); lt.position.copy(LT); scene.add(lt);
    const RY0 = 9, RY1 = 11.8, RX = 2.2, RD = 2.6;
    { const lower = E.box(6, RY0, 4, "#7a4f70"); lower.position.set(0, RY0 / 2, -2); lt.add(lower);
      const upper = E.box(6, 4, 4, "#7a4f70"); upper.position.set(0, RY1 + 2, -2); lt.add(upper);
      for (const sx of [-1, 1]) { const side = E.box(6 / 2 - RX, RY1 - RY0, 4, "#7a4f70"); side.position.set(sx * (RX + (3 - RX) / 2), (RY0 + RY1) / 2, -2); lt.add(side); }
      const backW = E.box(RX * 2, RY1 - RY0, 0.1, "#94627e"); backW.position.set(0, (RY0 + RY1) / 2, -RD); lt.add(backW);
      const win = E.glowPlane(1.1, 0.9, "#ffe3b8"); win.position.set(-1.1, RY0 + 1.6, -RD + 0.06); win.userData.setGlow(0.9); lt.add(win);
      for (let y = 1.5; y < RY0 - 0.5; y += 1.6) for (let x = -2.2; x <= 2.2; x += 1.1) { const w = E.glowPlane(0.5, 0.7, "#ffcf94"); w.position.set(x, y, 0.01); w.userData.setGlow(rnd() < 0.4 ? 0.9 : 0.15); lt.add(w); }
      const roofT = E.box(6.4, 0.3, 4.4, "#94627e"); roofT.position.set(0, RY1 + 4.15, -2); lt.add(roofT); }
    const ldesk = new THREE.Group(); ldesk.position.set(0.3, RY0, -1.4); lt.add(ldesk);
    { const top = E.box(1.5, 0.05, 0.7, "#b07a8c"); top.position.y = 0.76; ldesk.add(top); for (const dx of [-0.7, 0.7]) { const lg = E.box(0.05, 0.76, 0.6, "#94627e"); lg.position.set(dx, 0.38, 0); ldesk.add(lg); } }
    const deskItems = []; // fold away on "Next time"
    { const mon = new THREE.Group(); mon.position.set(0.35, 0.78, -0.15); ldesk.add(mon); const sc = E.box(0.62, 0.42, 0.03, "#3a2740"); sc.position.y = 0.32; mon.add(sc);
      const glow = E.glowPlane(0.56, 0.36, C.cyan); glow.position.set(0, 0.32, 0.02); glow.userData.setGlow(0.7); mon.add(glow); const st2 = E.box(0.05, 0.12, 0.05, "#3a2740"); st2.position.y = 0.06; mon.add(st2); deskItems.push(mon);
      const lamp = new THREE.Group(); lamp.position.set(-0.6, 0.78, -0.15); ldesk.add(lamp); const arm = E.box(0.03, 0.45, 0.03, "#3a2740"); arm.position.y = 0.22; arm.rotation.z = -0.3; lamp.add(arm);
      const sh = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.12, 16, 1, true), E.paperMat("#3a2740")); sh.material.side = THREE.DoubleSide; sh.position.set(0.1, 0.45, 0); lamp.add(sh); const bl = E.glowPlane(0.1, 0.03, C.amber); bl.position.set(0.1, 0.39, 0.01); bl.userData.setGlow(2); lamp.add(bl); deskItems.push(lamp);
      for (let k = 0; k < 3; k++) { const pp = E.box(0.3, 0.008, 0.22, C.cream); const g = new THREE.Group(); g.position.set(-0.15 + k * 0.08, 0.79 + k * 0.009, 0.15); pp.rotation.y = k * 0.2; g.add(pp); ldesk.add(g); deskItems.push(g); } }
    const lena = fig({ pose: "sit", hair: "bun", coat: true, seed: 3 }); lena.position.set(-0.75, RY0, -1.2); lena.scale.setScalar(1.05); lt.add(lena);
    { const ch = E.box(0.4, 0.04, 0.4, "#3a2740"); ch.position.set(-0.75, RY0 + 0.5, -1.25); lt.add(ch); const cb = E.box(0.04, 0.55, 0.4, "#3a2740"); cb.position.set(-0.98, RY0 + 0.77, -1.25); lt.add(cb); }
    const lcard = new THREE.Group(); lena.userData.forearm.add(lcard); lcard.position.set(0.42, 0.04, 0.01);
    { const c = E.box(0.2, 0.13, 0.004, C.cream); lcard.add(c); const q = E.cutoutText("?", { height: 0.1, hex: "#1f1d26" }); q.position.z = 0.004; lcard.add(q); }
    // "something new": a pop-up of new work on the emptied desk — people and a small machine disc, side by side
    const pop = new THREE.Group(); pop.position.set(0.15, 0.78, 0); ldesk.add(pop);
    const popBits = [];
    { const base = E.box(0.9, 0.012, 0.4, C.cream); pop.add(base);
      const disc = E.extrude(E.circleShape(0.13), C.cyan, 0.02, { emissive: 0.5 }); disc.position.set(0.25, 0.16, -0.05); pop.add(disc); popBits.push(disc);
      [[-0.3, 0], [-0.08, 0.06], [0.05, -0.04]].forEach(([x, z], i) => { const f = fig({ pose: "stand", hex: FIG, scale: 0.15, seed: 40 + i }); f.position.set(x, 0.006, z); pop.add(f); popBits.push(f); });
      const tb = E.box(0.18, 0.08, 0.12, "#b07a8c"); tb.position.set(-0.18, 0.05, -0.1); pop.add(tb); popBits.push(tb); }

    // ---------------- camera ----------------
    const H = (x, y, z) => [x, y, z];
    const LW = (x, y, z) => [LT.x + x, LT.y + y, LT.z + z];
    const K = [
      { t: def.from, p: H(0.04, 1.095, 8.68), l: H(0.04, 1.095, 0) },
      { t: T.shortcut, p: H(0.55, 1.85, 9.6), l: H(0.9, 1.05, -0.4) },
      { t: T.now, p: H(0.6, 1.9, 9.2), l: H(0.95, 1.05, -0.4), ease: "sine" },
      { t: T.smarter - 0.2, p: H(1.2, 1.75, 4.0), l: H(1.4, 0.95, -0.45) },
      { t: T.hand - 0.25, p: H(RP.x - 0.08, 1.75, RP.z + 0.55), l: H(RP.x - 0.08, BOOK.y, RP.z), arc: 0.05 },
      { t: T.book + 0.3, p: H(RP.x - 0.06, 1.69, RP.z + 0.5), l: H(RP.x - 0.06, BOOK.y, RP.z), ease: "sine" },
      { t: T.begunE + 0.6, p: H(RP.x, BOOK.y + 0.52, RP.z + 0.1), l: H(RP.x, BOOK.y, RP.z) },
      { t: T.read + 0.2, p: H(RP.x + 0.05, BOOK.y + 0.4, RP.z + 0.08), l: H(RP.x + 0.06, BOOK.y, RP.z), ease: "sine" },
      { t: T.headline + 0.1, p: H(RP.x + 0.06, BOOK.y + 0.36, RP.z + 0.08), l: H(RP.x + 0.08, BOOK.y, RP.z), ease: "sine" },
      { t: T.question - 0.2, p: H(DESK.x + 0.05, 1.95, DESK.z + 2.3), l: H(DESK.x + 0.05, 1.25, DESK.z - 0.4) },
      { t: T.slow + 0.4, p: H(DESK.x + 0.05, 1.8, DESK.z + 1.85), l: H(DESK.x + 0.05, 1.2, DESK.z - 0.45), ease: "sine" },
      { t: T.work + 0.05, p: H(4.5, 1.3, 3.6), l: H(4.5, 0.6, -0.5) },
      { t: T.optionalE, p: H(4.45, 1.2, 3.1), l: H(4.5, 0.58, -0.5), ease: "sine" },
      { t: T.pages + 0.3, p: H(DESK.x - 0.2, 1.75, DESK.z + 1.6), l: H(DESK.x + 0.1, 1.0, DESK.z - 0.3) },
      { t: T.fastE + 0.2, p: H(1.5, 4.2, 9.5), l: H(-3.6, 6.0, -16) },
      { t: T.lena, p: LW(0.0, 10.2, 4.6), l: LW(-0.2, 9.95, -1.3) },
      { t: T.next, p: LW(0.0, 10.15, 4.2), l: LW(-0.2, 9.95, -1.3), ease: "sine" },
      { t: T.voEnd, p: LW(0.1, 10.1, 3.8), l: LW(0.1, 9.9, -1.3), ease: "sine" },
      { t: T.voEnd + 3.2, p: H(-1.5, 7.0, 13), l: H(-0.5, 6.3, -20) },
      { t: def.to, p: H(-1.2, 7.1, 12.2), l: H(-0.4, 6.35, -20), ease: "sine" },
    ];
    const ease = (e, x) => (e === "smooth" ? x * x * (3 - 2 * x) : e === "sine" ? sineInOut(x) : inOut(x));
    const path = (t) => { let i = 0; while (i < K.length - 2 && t > K[i + 1].t) i++;
      const a = K[i], b = K[i + 1]; const k = ease(b.ease, lin(a.t, b.t, t));
      const pa = V3(...a.p), pb = V3(...b.p); const p = pa.clone().lerp(pb, k), l = V3(...a.l).lerp(V3(...b.l), k);
      const bulge = Math.sin(Math.PI * k) * pa.distanceTo(pb) * (b.arc ?? 0.1); p.x += bulge * (i % 2 ? -1 : 1) * 0.6; p.y += bulge * 0.4;
      const d = p.distanceTo(l) * 0.01 * smooth(def.from, def.from + 0.8, t);
      p.x += d * (Math.sin(t * 0.37) * 0.9 + Math.sin(t * 0.83 + 1.3) * 0.4); p.y += d * (Math.sin(t * 0.51 + 0.7) * 0.6 + Math.sin(t * 1.13 + 2.1) * 0.2);
      l.x += d * Math.sin(t * 0.29 + 0.4) * 0.5; l.y += d * Math.sin(t * 0.43 + 1.9) * 0.35; return { p, l }; };

    // ---------------- DOM ----------------
    const layer = E.layer;
    const nextSrc = E.srcDOM(layer, { big: "Next", small: "What Happens to Work When Intelligence Is Free?", inAt: T.voEnd + 0.6 });

    const post = { bloom: 0.45, exposure: 1.1 };
    const update = (t) => {
      st.update(t); city.update(t);
      const cam = path(t); E.applyCam(camera, cam, 0.004 * Math.sin(t * 0.3));
      // key light follows the action (small shadow box = crisp paper shadows)
      const near = t < T.fastE ? (t > T.work - 0.6 && t < T.pages ? V3(4.5, 0.5, -0.5) : V3(DESK.x, 1, DESK.z)) : V3(LT.x, LT.y + RY0, LT.z - 1);
      L.key.target.position.copy(near); L.key.position.copy(near).add(V3(-14, 11, 13)); const sb = L.key.shadow.camera;
      Object.assign(sb, t < T.fastE ? { left: -4, right: 4, top: 3, bottom: -2 } : { left: -9, right: 9, top: 8, bottom: -6 }); sb.updateProjectionMatrix();

      // figure: stands, walks to the chair, sits
      const walk = smooth(T.now + 0.1, T.now + 1.1, t), down = smooth(T.now + 1.05, T.now + 1.35, t), seated = t >= T.now + 1.35;
      youStand.visible = !seated; youSit.visible = seated;
      youStand.position.set(lerp(0, 0.38, walk), -0.4 * down, lerp(0, 0.12, walk));
      youStand.userData.pose(t, { walk: walk > 0 && walk < 1 ? 1 : 0, lookUp: 0.15 * (1 - walk) * smooth(def.from, T.back + 1, t), lean: down });
      const reach = smooth(T.hand - 0.5, T.hand + 0.3, t);
      youSit.userData.pose(t, { reach: 0.6 + 0.3 * reach, lean: 0.25, lookUp: -0.25 + 0.15 * smooth(T.pages, T.fastE, t) });

      // box: glows softly, lid opens on "Now"
      const open = expoOut(lin(T.now - 0.1, T.now + 1.0, t)) - 0.04 * Math.sin(Math.PI * lin(T.now - 0.3, T.now - 0.05, t));
      lidHinge.rotation.x = -open * Math.PI * 0.62; boxGlow.userData.setGlow(0.25 + 0.35 * open + 0.04 * Math.sin(t * 2.1));
      warm.position.set(DESK.x, DESK.y + 0.9, DESK.z + 0.6); warm.intensity = t < T.fastE + 1 ? 1.4 + 1.2 * open : 0;

      // book
      const f = flipAt(t); const sp = 1 + 3.2 * clamp(vel(t) / 11, 0, 1);
      book.userData.update(t, { flip: f, spread: sp });
      const onRep = t > T.begunE + 0.35 && t < T.optionalE;
      repCard.visible = pct.visible = onRep; if (onRep) drawPct(t);
      // hand
      const hk = expoOut(lin(T.hand - 0.35, T.hand + 0.35, t));
      hand.visible = t > T.hand - 0.4; hand.position.set(RP.x + BW / 2 + 0.06 + 0.002 * Math.sin(t * 1.3), BOOK.y + 0.012 + 0.03 * (1 - hk), RP.z + 0.1 + 0.45 * (1 - hk));
      // headline + question card
      const up = spring(lin(T.headline - 0.05, T.headline + 0.9, t)); paperHinge.visible = t > T.headline - 0.08;
      paperHinge.rotation.x = -Math.PI / 2 * (1 - up) + 0.01 * Math.sin(t * 0.9) * up;
      const qk = expoOut(lin(T.question - 0.1, T.question + 0.7, t)); qcard.visible = t > T.question - 0.12;
      qcard.position.set(DESK.x + 0.05 + 0.9 * (1 - qk), DESK.y + 0.004, DESK.z - 0.33 + 0.01 * Math.sin(t)); qcard.rotation.y = 0.12 * (1 - qk) + 0.02 * Math.sin(t * 0.7);
      // doors
      doors.forEach((d) => { const pu = spring(lin(T.work - 0.7 + d.k * 0.18, T.work + 0.4 + d.k * 0.18, t)); d.hinge.visible = t > T.work - 0.75 + d.k * 0.18;
        d.hinge.rotation.x = -Math.PI / 2 * (1 - pu) + 0.008 * Math.sin(t * 0.8 + d.k) * pu;
        const op = expoOut(lin(doorAt[d.k] - 0.05, doorAt[d.k] + 0.8, t)); d.pan.rotation.y = -1.75 * op;
        d.glow.userData.setGlow(0.08 + 1.5 * op * (1 + 0.04 * Math.sin(t * 5 + d.k)));
        if (d.icon.userData.card) d.icon.userData.card.position.y = 0.28 - 0.08 * smooth(T.vote + 0.4, T.vote + 1.4, t); });
      const doorsOn = t > T.work - 0.7 && t < T.pages + 0.4;
      doorLight.position.set(4.5, 0.7, 0.7); doorLight.intensity = doorsOn ? 3 * smooth(T.work, T.vote + 0.6, t) + 1 : 0;

      // Lena: holds the card, raises it toward us; desk empties, then fills with something new
      const raise = smooth(T.would - 0.3, T.would + 0.9, t);
      lena.userData.pose(t, { reach: 0.3 + 0.5 * raise, lookUp: 0.08 * raise, lean: -0.2 * raise });
      lcard.rotation.z = 0.25 - 0.4 * raise;
      roomLight.position.set(LT.x - 0.6, LT.y + RY0 + 1.5, LT.z + 0.4); roomLight.intensity = t > T.pages ? 6 : 0;
      deskItems.forEach((g, i) => { const k = inOut(lin(T.next + 0.05 + i * 0.07, T.next + 0.6 + i * 0.07, t)); g.scale.set(1, Math.max(0.001, 1 - k), 1); g.visible = k < 0.999; g.position.x += 0; });
      popBits.forEach((b, i) => { const k = spring(lin(T.cheap - 0.1 + i * 0.16, T.cheap + 0.8 + i * 0.16, t)); b.scale.y = Math.max(0.001, k) * (b.userData.pose ? 0.15 : 1); b.visible = k > 0.002;
        if (b.userData.pose) { b.scale.x = b.scale.z = 0.15; b.userData.pose(t, { reach: 0.4 + 0.3 * Math.sin(t * 1.5 + i), walk: 0 }); } });
      pop.visible = t > T.cheap - 0.15; pop.children[0].scale.x = Math.max(0.001, expoOut(lin(T.cheap - 0.15, T.cheap + 0.4, t)));

      post.exposure = 1.1 + 0.05 * smooth(T.voEnd, def.to, t);
      nextSrc.update(t);
    };
    return { scene, camera, post, update };
  },
};
