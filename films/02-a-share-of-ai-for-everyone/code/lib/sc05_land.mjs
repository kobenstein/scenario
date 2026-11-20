// C5 · land outlines (lon/lat rings) for the "humanity" microtext border (3.12). Owner: c05.
// The topojson decode is copied from lib/map.mjs (decode()), reading data/land-110m.json (Natural Earth via world-atlas@2.0.2).
//   landRings(detail = '110m') → [[ [lon, lat] … ] …] outer rings of all land polygons, largest first
import fs from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';
const DATA = new URL('../data/', import.meta.url);
let RINGS = null;
export function landRings() {
  if (RINGS) return RINGS;
  const topo = JSON.parse(fs.readFileSync(new URL('land-110m.json', DATA), 'utf8'));
  const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
  const arcs = topo.arcs.map((arc) => { let x = 0, y = 0; return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
  const ring = (idx) => { const pts = []; for (const i of idx) { const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]; for (let k = pts.length ? 1 : 0; k < a.length; k++) pts.push(a[k]); } return pts; };
  const out = [];
  for (const g of topo.objects.land.geometries) { const polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : []; for (const p of polys) out.push(ring(p[0])); }
  out.sort((p, q) => q.length - p.length); RINGS = out; return out;
}
// the flat world as one printed sheet without any borders between countries (3.12: "taken as one country")
//   landMap(g, P) draws into g; P(lon, lat) → [x, y] screen projection (e.g. map.mjs project with a cam)
export function landMap(g, P, o = {}) {
  const N = !!o.night, paper = o.paper || (N ? '#122434' : '#ece2c8'), land = o.land || (N ? '#1f3b50' : '#d8c49a');
  const inkA = (al) => (N ? `rgba(255,217,160,${al * .55})` : `rgba(42,32,48,${al})`);
  // the sheet: the Equal Earth outline, paper with a soft shadow
  const edge = []; for (let la = -90; la <= 90; la += 2) edge.push(P(180, la)); for (let la = 90; la >= -90; la -= 2) edge.push(P(-180, la));
  const path = (pts) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
  g.save(); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 40; g.shadowOffsetX = 16; g.shadowOffsetY = 24; path(edge); g.fillStyle = paper; g.fill(); g.restore();
  g.save(); path(edge); g.clip();
  const lg = g.createRadialGradient(700, 220, 0, 760, 520, 1100); lg.addColorStop(0, N ? 'rgba(150,190,215,.12)' : 'rgba(255,248,230,.5)'); lg.addColorStop(1, N ? 'rgba(0,0,0,.25)' : 'rgba(90,70,50,.25)'); g.fillStyle = lg; g.fillRect(0, 0, 4000, 4000);
  // ruled sea
  g.strokeStyle = N ? 'rgba(159,184,192,.07)' : 'rgba(42,32,48,.10)'; g.lineWidth = 1; for (let y = 0; y < 1200; y += 6) { g.beginPath(); g.moveTo(0, y); g.lineTo(2000, y); g.stroke(); }
  // graticule
  g.strokeStyle = N ? 'rgba(159,184,192,.10)' : 'rgba(42,32,48,.12)'; g.lineWidth = .8; for (let lo = -150; lo <= 150; lo += 30) { g.beginPath(); for (let la = -90; la <= 90; la += 3) { const [x, y] = P(lo, la); la === -90 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
  for (let la = -60; la <= 60; la += 30) { g.beginPath(); for (let lo = -180; lo <= 180; lo += 4) { const [x, y] = P(lo, la); lo === -180 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
  // land as one: fill + coast ink, no borders. Equal Earth squeezes the polar band (70°–90° N is ~27 px here) against the flat pole
  // line, which read as land cut flat along the top: the land is drawn on its own layer and fades out from 64° N to 80° N
  const cw = g.canvas.width, ch = g.canvas.height, lc = createCanvas(cw, ch), lx = lc.getContext('2d');
  lx.setTransform(g.getTransform());
  lx.beginPath();
  for (const r of landRings()) { let prev = null; r.forEach(([lo, la], i) => { const [x, y] = P(lo, la); if (!i || Math.abs(lo - prev) > 180) lx.moveTo(x, y); else lx.lineTo(x, y); prev = lo; }); lx.closePath(); }
  lx.fillStyle = land; lx.fill(); lx.strokeStyle = inkA(.75); lx.lineWidth = 1.1; lx.lineJoin = 'round'; lx.stroke();
  lx.setTransform(1, 0, 0, 1, 0, 0);
  const yTop = P(0, o.fadeTo ?? 80)[1], yBot = P(0, o.fadeFrom ?? 64)[1];
  if (yBot > yTop) { lx.globalCompositeOperation = 'destination-out'; const fg = lx.createLinearGradient(0, yTop, 0, yBot); fg.addColorStop(0, 'rgba(0,0,0,1)'); fg.addColorStop(1, 'rgba(0,0,0,0)'); lx.fillStyle = fg; lx.fillRect(0, 0, cw, Math.ceil(yBot) + 1); lx.globalCompositeOperation = 'source-over'; }
  g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.drawImage(lc, 0, 0); g.restore();
  g.restore();
  g.strokeStyle = inkA(.5); g.lineWidth = 1.2; path(edge); g.stroke();
}
