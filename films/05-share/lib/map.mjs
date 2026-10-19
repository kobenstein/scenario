// The world as a printed paper map in Equal Earth projection, lying on a table and seen at an angle (never a globe).
// Data: Natural Earth via world-atlas@2.0.2 (data/countries-110m.json, data/countries-50m.json for close-ups).
//
//   worldMap(ctx, cam, o)   cam = { cx, cy, z, rot, tilt, x, y, f }  (cx,cy = view centre in Equal Earth units, see ll();
//                                   z = zoom (1 = whole world ~1790 px wide); rot = in-plane rotation (rad); tilt = how far the
//                                   sheet leans away (0 = flat-on, .5 = on a table); x,y = screen anchor; f = focal length px)
//     o: { t, paper: '#ece2c8', ink, land, sea, borders: true, hatch: true, graticule: true, sheet: true (paper edge + shadow),
//          highlight: ['USA', 'NOR', …] (amber fill + light), borderGlow: ['USA'] (glowing border), dim: 0..1 (darken all
//          non-highlighted land), terminator: { utc: 6.5, decl: -10 } (day/night split, soft twilight), light: [x,y] (warm spot),
//          detail: 'auto'|'110m'|'50m', glowCol }
//   region(name, fill = .55) → cam for a country or named area: 'USA' (lower 48), 'Alaska', 'Norway', 'Switzerland',
//          'Philippines', 'Kenya', 'South Korea', 'World', or an ISO alpha-3 / numeric id.  Spread it into your cam: {...region('USA'), tilt: .45}
//   ll(lon, lat) → [x, y] Equal Earth units;  project(cam, lon, lat) → [sx, sy, scale] screen position on the tilted sheet
//   country(id) → { id, name, polys } (lon/lat rings) for custom drawing
import { Path2D } from '@napi-rs/canvas';
import fs from 'node:fs';
import { W, H, rgba, clamp, mix, prng, addGlow, rough, poly, hatch } from '../engine.mjs';
import { fibreFill, halftoneFill } from './print.mjs';

const DATA = new URL('../data/', import.meta.url);
const ISO = { USA: '840', NOR: '578', CHE: '756', PHL: '608', KEN: '404', KOR: '410', CAN: '124', MEX: '484', BRA: '076', IND: '356', CHN: '156', NGA: '566', DEU: '276', GBR: '826', FRA: '250', JPN: '392', AUS: '036', ZAF: '710', RUS: '643', IDN: '360', EGY: '818', ARG: '032', SWE: '752', FIN: '246', DNK: '208', ISL: '352' };
const NAMES = { 'United States': 'USA', Norway: 'NOR', Switzerland: 'CHE', Philippines: 'PHL', Kenya: 'KEN', 'South Korea': 'KOR' };

function decode(topo) {
  const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
  const arcs = topo.arcs.map((arc) => { let x = 0, y = 0; return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
  const ring = (idx) => { const pts = []; for (const i of idx) { const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]; for (let k = pts.length ? 1 : 0; k < a.length; k++) pts.push(a[k]); } return pts; };
  const geoms = (obj) => obj.geometries.map((g) => {
    const polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
    return { id: g.id, name: g.properties?.name, polys: polys.map((p) => p.map(ring)), arcIdx: polys.flat(2) };
  });
  const countries = geoms(topo.objects.countries), land = geoms(topo.objects.land);
  const use = new Map(); for (const c of countries) for (const i of c.arcIdx) { const k = i < 0 ? ~i : i; use.set(k, (use.get(k) || 0) + 1); }
  const borders = [...use].filter(([, n]) => n > 1).map(([k]) => arcs[k]);
  return { countries, land, borders, byId: new Map(countries.map((c) => [c.id, c])) };
}
const DS = {};
function data(detail) { if (!DS[detail]) DS[detail] = decode(JSON.parse(fs.readFileSync(new URL(`countries-${detail}.json`, DATA), 'utf8'))); return DS[detail]; }

// ---------- Equal Earth (Šavrič, Patterson, Jenny 2018) ----------
const A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, M = Math.sqrt(3) / 2, D2R = Math.PI / 180;
export function ll(lon, lat) {
  const l = lon * D2R, th = Math.asin(M * Math.sin(lat * D2R)), t2 = th * th, t6 = t2 * t2 * t2;
  return [l * Math.cos(th) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))), th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))];
}
const K = 330; // px per Equal Earth unit at z = 1
const CAM = { cx: .25, cy: .2, z: 1, rot: -.06, tilt: .42, x: W / 2, y: H / 2, f: 1700 };
function projector(cam) {
  const c = { ...CAM, ...cam }, cr = Math.cos(c.rot), sr = Math.sin(c.rot), ct = Math.cos(c.tilt), st = Math.sin(c.tilt), k = K * c.z;
  const P = (ex, ey) => {
    const u0 = (ex - c.cx) * k, v0 = -(ey - c.cy) * k, u = u0 * cr - v0 * sr, v = u0 * sr + v0 * cr;
    const depth = c.f - v * st, q = c.f / Math.max(60, depth);
    return [c.x + u * q, c.y + v * ct * q, q];
  };
  return { P, c, k };
}
export const project = (cam, lon, lat) => { const [ex, ey] = ll(lon, lat); return projector(cam).P(ex, ey); };
export function country(id, detail = '110m') { const d = data(detail); const key = ISO[id] || NAMES[id] || id; return d.byId.get(key) || d.countries.find((c) => c.name === id); }

// rings that cross the antimeridian are unwrapped (lon may run past ±180); the land is clipped to the map outline
function ringPath(ctx, P, ring) { let first = true, prev = 0, k = 0; for (const [lon0, lat] of ring) { let lon = lon0 + k; if (!first && lon - prev > 180) { k -= 360; lon -= 360; } else if (!first && prev - lon > 180) { k += 360; lon += 360; } prev = lon; const [ex, ey] = ll(clamp(lon, -200, 200), lat), [x, y] = P(ex + (lon > 180 ? (lon - 180) * .015 : lon < -180 ? (lon + 180) * .015 : 0), ey); first ? ctx.moveTo(x, y) : ctx.lineTo(x, y); first = false; } ctx.closePath(); }
function countryPath(ctx, P, c, filter) { for (const p of c.polys) { if (filter && !filter(p[0])) continue; for (const r of p) ringPath(ctx, P, r); } }

const AREAS = {
  USA: { id: 'USA', filter: (r) => r[0][0] > -130 && r[0][1] < 50 },
  Alaska: { id: 'USA', filter: (r) => r[0][0] < -130 && r[0][1] > 50 },
  Norway: { id: 'NOR', filter: (r) => r[0][1] < 72 }, Switzerland: { id: 'CHE' }, Philippines: { id: 'PHL' }, Kenya: { id: 'KEN' }, 'South Korea': { id: 'KOR' },
};
export function region(name, fill = .55) {
  if (name === 'World') return { cx: 0, cy: 0, z: 1 };
  const A = AREAS[name] || { id: name }, c = country(A.id);
  if (!c) throw new Error('map.region: unknown ' + name);
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (const p of c.polys) { if (A.filter && !A.filter(p[0])) continue; for (const [lon, lat] of p[0]) { const [x, y] = ll(lon, lat); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } }
  const z = Math.min(W * fill / ((x1 - x0) * K), H * fill / ((y1 - y0) * K));
  return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, z };
}
// outline of the Equal Earth world (the edge of the printed map)
function outline() { const pts = []; for (let lat = -90; lat <= 90; lat += 3) pts.push(ll(180, lat)); for (let lat = 90; lat >= -90; lat -= 3) pts.push(ll(-180, lat)); return pts; }
const OUT = outline();
// sun elevation boundary: latitude where the sun stands at elevation h for a given longitude
function twilight(lon, lonS, decl, h) {
  const a = Math.sin(decl * D2R), b = Math.cos(decl * D2R) * Math.cos((lon - lonS) * D2R), R = Math.hypot(a, b), al = Math.atan2(b, a);
  const s = clamp(Math.sin(h * D2R) / R, -1, 1), wrap = (v) => Math.atan2(Math.sin(v), Math.cos(v));
  const p1 = wrap(Math.asin(s) - al), p2 = wrap(Math.PI - Math.asin(s) - al);
  return (Math.abs(p1) <= Math.PI / 2 + 1e-9 ? p1 : p2) / D2R;
}

export function worldMap(ctx, cam = {}, o = {}) {
  const { P, c, k } = projector(cam), t = o.t ?? 0;
  const detail = o.detail === 'auto' || !o.detail ? (c.z > 3.2 ? '50m' : '110m') : o.detail;
  const D = data(detail);
  const paper = o.paper || '#ece2c8', ink = o.ink || '#2a2030', land = o.land || '#cdb98f', sea = o.sea || '#e4d8bc', glowCol = o.glowCol || '#ffb35c';
  const lw = (w) => w * Math.sqrt(c.z) * .9;
  // sheet: rough-edged paper with a soft shadow on the table
  const sheet = (() => { const m = .14, cs = [[-2.7066 - m, -1.3173 - m], [2.7066 + m, -1.3173 - m], [2.7066 + m, 1.3173 + m], [-2.7066 - m, 1.3173 + m]].map(([x, y]) => P(x, y)); return rough(cs.map((p) => [p[0], p[1]]), 2.2, 5, { step: 10 }); })();
  if (o.sheet !== false) {
    ctx.save(); ctx.fillStyle = 'rgba(3,3,10,.55)'; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40; ctx.shadowOffsetX = 18; ctx.shadowOffsetY = 26;
    poly(ctx, sheet); ctx.fill(); ctx.restore();
    ctx.save(); poly(ctx, sheet);
    const lg = o.light || [W * .7, H * .25], g = ctx.createRadialGradient(lg[0], lg[1], 0, lg[0], lg[1], W * .9);
    g.addColorStop(0, mixHex(paper, '#fff6e2', .5)); g.addColorStop(.6, paper); g.addColorStop(1, mixHex(paper, '#6b5a48', .55));
    ctx.fillStyle = g; ctx.fill(); ctx.restore();
    poly(ctx, sheet); fibreFill(ctx, .55);
  }
  ctx.save();
  // the map's own edge: sea tone + engraved horizontal hatch
  ctx.beginPath(); OUT.forEach(([x, y], i) => { const [sx, sy] = P(x, y); i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); }); ctx.closePath();
  const outlinePath = new Path2D(); OUT.forEach(([x, y], i) => { const [sx, sy] = P(x, y); i ? outlinePath.lineTo(sx, sy) : outlinePath.moveTo(sx, sy); }); outlinePath.closePath();
  ctx.fillStyle = rgba(sea, .9); ctx.fill(outlinePath);
  if (o.hatch !== false) hatch(ctx, outlinePath, -c.rot * 0 + Math.atan2(P(1, 0)[1] - P(0, 0)[1], P(1, 0)[0] - P(0, 0)[0]), Math.max(3.2, 4.5 * Math.sqrt(c.z) * .8), .22, { col: '#3a3046', w: .8, wobble: .6, box: [0, 0, W, H] });
  ctx.strokeStyle = rgba(ink, .55); ctx.lineWidth = lw(1.4); ctx.stroke(outlinePath);
  // graticule in pencil
  if (o.graticule !== false) {
    ctx.save(); ctx.clip(outlinePath); ctx.strokeStyle = rgba(ink, .14); ctx.lineWidth = lw(.8); ctx.beginPath();
    for (let lon = -180; lon <= 180; lon += 30) for (let lat = -90; lat <= 90; lat += 3) { const [x, y] = ll(lon, lat), [sx, sy] = P(x, y); lat === -90 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); }
    for (let lat = -60; lat <= 60; lat += 30) for (let lon = -180; lon <= 180; lon += 4) { const [x, y] = ll(lon, lat), [sx, sy] = P(x, y); lon === -180 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); }
    ctx.stroke(); ctx.restore();
  }
  // land (all countries in one path), halftone + coast ink
  const area = (e) => { const A = AREAS[e]; const cn = country(A ? A.id : e, detail); return cn ? { cn, filter: A?.filter && e !== 'USA' ? A.filter : null } : null; };
  const hi = (o.highlight || []).map(area).filter(Boolean), bg = (o.borderGlow || []).map(area).filter(Boolean);
  ctx.save(); ctx.clip(outlinePath);
  const landPath = new Path2D(); for (const cn of D.countries) countryPath(landPath, P, cn);
  ctx.fillStyle = land; ctx.fill(landPath);
  ctx.save(); ctx.beginPath(); for (const cn of D.countries) countryPath(ctx, P, cn); halftoneFill(ctx, .35); ctx.restore();
  if (o.dim) { ctx.fillStyle = `rgba(20,16,28,${.45 * o.dim})`; ctx.fill(landPath); }
  ctx.strokeStyle = rgba(ink, .75); ctx.lineWidth = lw(1.15); ctx.lineJoin = 'round'; ctx.stroke(landPath);
  if (o.borders !== false) {
    ctx.save(); ctx.setLineDash([lw(3), lw(2.5)]); ctx.strokeStyle = rgba(ink, .45); ctx.lineWidth = lw(.8); ctx.beginPath();
    for (const arc of D.borders) { let pl = null; arc.forEach(([lon, lat], i) => { const [x, y] = ll(lon, lat), [sx, sy] = P(x, y); (i && Math.abs(lon - pl) < 180) ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); pl = lon; }); }
    ctx.stroke(); ctx.restore();
  }
  ctx.restore(); // outline clip
  // highlighted countries: amber ink + light rising from the paper
  for (const { cn, filter } of hi) {
    const pth = new Path2D(); countryPath(pth, P, cn, filter);
    const pulse = .85 + .15 * Math.sin(t * 1.6);
    ctx.fillStyle = rgba(glowCol, .85); ctx.fill(pth);
    ctx.save(); ctx.clip(pth); const b = bboxOf(cn, P, filter); const g = ctx.createRadialGradient(b.cx - b.w * .15, b.cy - b.h * .2, 0, b.cx, b.cy, Math.max(b.w, b.h) * .7);
    g.addColorStop(0, `rgba(255,241,214,${.75 * pulse})`); g.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = g; ctx.fillRect(b.x, b.y, b.w, b.h); ctx.restore();
    addGlow(ctx, b.cx, b.cy, Math.max(b.w, b.h) * .75, .35 * pulse, glowCol, '#fff1d6');
    ctx.strokeStyle = rgba('#7a3b17', .9); ctx.lineWidth = lw(1.3); ctx.stroke(pth);
  }
  for (const { cn, filter } of bg) {
    const pth = new Path2D(); countryPath(pth, P, cn, filter);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const a = .8 + .2 * Math.sin(t * 3);
    for (const [w, al] of [[lw(14), .12], [lw(6), .3], [lw(2.2), .95]]) { ctx.strokeStyle = rgba(w < lw(3) ? '#fff1d6' : glowCol, al * a); ctx.lineWidth = w; ctx.stroke(pth); }
    ctx.restore();
  }
  // day / night: night side in ink-blue, with three twilight steps (civil, nautical, astronomical)
  if (o.terminator) {
    const utc = o.terminator.utc ?? 12, decl = o.terminator.decl ?? -10, lonS = -15 * (utc - 12), pole = decl > 0 ? -90 : 90;
    ctx.save(); ctx.clip(outlinePath);
    const na = o.terminator.night ?? 1;
    for (const [h, a] of [[0, .2 * na], [-6, .2 * na], [-12, .2 * na], [-18, .24 * na]]) {
      ctx.beginPath(); let first = true;
      for (let lon = -180; lon <= 180; lon += 2) { const lat = twilight(lon, lonS, decl, h), [x, y] = ll(lon, lat), [sx, sy] = P(x, y); first ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); first = false; }
      for (let lon = 180; lon >= -180; lon -= 6) { const [x, y] = ll(lon, pole), [sx, sy] = P(x, y); ctx.lineTo(sx, sy); }
      ctx.closePath(); ctx.fillStyle = `rgba(11,17,44,${a})`; ctx.fill();
    }
    if (o.cityLights !== false) { // tiny amber specks on land where the sun is down
      const r = prng(57), D2 = data('110m');
      ctx.save(); ctx.clip(landPathAll(P, D2)); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 2600; i++) {
        const lon = -180 + r() * 360, lat = -45 + r() * 112, cosz = Math.sin(lat * D2R) * Math.sin(decl * D2R) + Math.cos(lat * D2R) * Math.cos(decl * D2R) * Math.cos((lon - lonS) * D2R);
        if (cosz > -.08) continue; const [x, y] = ll(lon, lat), [sx, sy, q] = P(x, y), m = r();
        ctx.fillStyle = `rgba(255,${180 + m * 50 | 0},110,${(.25 + .6 * m) * Math.min(1, -cosz * 6)})`; const sz = (m > .93 ? 2.2 : 1.3) * Math.min(1.6, q); ctx.fillRect(sx, sy, sz, sz);
      }
      ctx.restore();
    }
    ctx.restore();
  }
  ctx.restore();
  return { P, outline: outlinePath, sheet };
}
const LP = new WeakMap();
function landPathAll(P, D) { const p = new Path2D(); for (const cn of D.countries) countryPath(p, P, cn); return p; }
function bboxOf(cn, P, filter) { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const p of cn.polys.filter((q) => !filter || filter(q[0]))) for (const [lon, lat] of p[0]) { const [ex, ey] = ll(lon, lat), [x, y] = P(ex, ey); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 }; }
function mixHex(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, u)); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
