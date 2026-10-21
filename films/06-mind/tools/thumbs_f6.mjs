// Film 6 thumbnails in the film's own paper style: drawn with the film kit (no generated pictures), big headline for the phone feed.
//   node tools/thumbs_f6.mjs <out_dir> [names…]      → <name>.png (1920×1080) and <name>-1280.png
import fs from 'node:fs';
import { W, H, rgba, canvas } from '../engine.mjs';
import { F6, nightRoom, ready, coolLine, ember, pane, coolText } from '../lib/f6_kit.mjs';
import { heldPhone } from '../lib/phone.mjs';
import { chairC01 } from '../lib/f6_c01_room.mjs';
import { addGlow } from '../engine.mjs';
import { filmFinish } from '../lib/print.mjs';
import { createCanvas } from '@napi-rs/canvas';

const OUT = process.argv[2] || 'thumbs'; fs.mkdirSync(OUT, { recursive: true });
const want = process.argv.slice(3);
const T0 = 30;   // a calm moment of every breathing light

// the headline: cream serif like the film's title in the glass, a soft dark halo so it reads on a phone, the cool line under it
function headline(g, lines, o = {}) {
  const x = o.x ?? 96, size0 = o.size ?? 230, maxW = o.maxW ?? 1000, lead = o.lead ?? .92, font = o.font ?? 'Instrument Serif';
  g.save(); g.font = `${o.weight ? o.weight + ' ' : ''}${size0}px "${font}"`;
  const wMax = Math.max(...lines.map((l) => g.measureText(l).width)); const size = Math.min(size0, size0 * maxW / wMax);
  g.font = `${o.weight ? o.weight + ' ' : ''}${size}px "${font}"`;
  const total = size * lead * (lines.length - 1), y0 = (o.cy ?? 540) - total / 2 + size * .34;
  lines.forEach((l, i) => {
    const y = y0 + i * size * lead;
    g.shadowColor = 'rgba(3,5,14,.85)'; g.shadowBlur = size * .22; g.fillStyle = 'rgba(3,5,14,.55)'; g.fillText(l, x + 3, y + 5);
    g.shadowBlur = size * .08; g.shadowColor = rgba(F6.amberCore, .25); g.fillStyle = o.col || F6.cream; g.fillText(l, x, y);
    g.shadowBlur = 0;
  });
  const lw = Math.max(...lines.map((l) => g.measureText(l).width));
  g.restore();
  const yl = y0 + (lines.length - 1) * size * lead + size * .2;
  if (o.line !== false) coolLine(g, T0, { from: [x, yl], to: [x + lw, yl], u: 1, w: 2.6, glow: 1.2, head: false });
  return { size, bottom: yl };
}

const chat = (q, w, h) => {   // the phone's screen in phone units (150 × 310): your message, then the answer, lit cool
  q.fillStyle = '#0b1022'; q.fillRect(0, 0, w, h);
  const bubble = (x, y, bw, lines, fill, col, size) => {
    const bh = lines.length * size * 1.3 + 12; q.fillStyle = fill; q.beginPath(); q.roundRect(x, y, bw, bh, 9); q.fill();
    q.fillStyle = col; q.font = `500 ${size}px "Inter"`; lines.forEach((l, i) => q.fillText(l, x + 8, y + 6 + size + i * size * 1.3)); return y + bh;
  };
  q.fillStyle = rgba(F6.cool, .5); q.font = '600 7px "Inter"'; q.fillText('2:14 AM', w / 2 - 12, 22);
  let y = bubble(w - 104, 52, 96, ["I can't sleep.", 'Everything feels', 'heavy tonight.'], 'rgba(243,236,218,.92)', '#2a2420', 9.5);
  y = bubble(8, y + 14, 122, ['I understand exactly', 'how you feel.'], 'rgba(150,200,255,.24)', F6.coolCore, 11.5);
  q.fillStyle = rgba(F6.cool, .85); q.fillRect(14, y + 10, 2, 11);   // the cursor of the next answer
};

const THUMBS = {
  // 1 · the phone in your hand at night, the answer that sounds like someone
  'f6-paper-1-phone': async (g) => {
    nightRoom(g, T0, { cam: { x: 1330, y: 520, z: 1.5 }, screen: 'dark', typing: false, figure: false, lampA: 1.15 });
    g.fillStyle = 'rgba(4,6,16,.22)'; g.fillRect(0, 0, W, H);
    const gr = g.createLinearGradient(0, 0, W * .6, 0); gr.addColorStop(0, 'rgba(4,6,16,.9)'); gr.addColorStop(.75, 'rgba(4,6,16,.45)'); gr.addColorStop(1, 'rgba(4,6,16,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    heldPhone(g, 1450, 610, 2.75, { t: T0, ang: -.08, screen: chat, warm: .9, lit: 1 });
    headline(g, ['IS ANYONE', 'IN THERE?'], { x: 90, cy: 520, size: 250, maxW: 1060 });
  },
  // 2a · the same phone with the second question
  'f6-paper-2a-phone': async (g) => {
    nightRoom(g, T0, { cam: { x: 1330, y: 520, z: 1.5 }, screen: 'dark', typing: false, figure: false, lampA: 1.15 });
    g.fillStyle = 'rgba(4,6,16,.22)'; g.fillRect(0, 0, W, H);
    const gr = g.createLinearGradient(0, 0, W * .6, 0); gr.addColorStop(0, 'rgba(4,6,16,.9)'); gr.addColorStop(.75, 'rgba(4,6,16,.45)'); gr.addColorStop(1, 'rgba(4,6,16,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    heldPhone(g, 1450, 610, 2.75, { t: T0, ang: -.08, screen: chat, warm: .9, lit: 1 });
    headline(g, ['IS AI', 'CONSCIOUS?'], { x: 90, cy: 520, size: 270, maxW: 1000 });
  },
  // 2b · the chair opposite you: no one sits there, only the answer hangs in the air where a face would be
  'f6-paper-2b-chair': async (g) => {
    const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#10152c'); bg.addColorStop(.75, '#0d1022'); bg.addColorStop(1, '#08070e'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
    const wl = g.createRadialGradient(-120, 760, 0, -120, 760, 1500); wl.addColorStop(0, rgba(F6.amber, .4)); wl.addColorStop(.45, rgba(F6.amberDeep, .16)); wl.addColorStop(1, rgba(F6.amberDeep, 0)); g.fillStyle = wl; g.fillRect(0, 0, W, H);   // the lamp off to the left
    const CX = 1390, FY = 1110, S = 5.2;
    const fl = g.createLinearGradient(0, 905, 0, H); fl.addColorStop(0, '#120e16'); fl.addColorStop(1, '#08070c'); g.fillStyle = fl; g.fillRect(0, 905, W, H - 905);
    g.save(); g.translate(CX - 90, FY - 8); g.scale(1, .2); const pg = g.createRadialGradient(0, 0, 0, 0, 0, 700); pg.addColorStop(0, rgba(F6.amber, .32)); pg.addColorStop(1, rgba(F6.amber, 0)); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, 700, 0, Math.PI * 2); g.fill(); g.restore();
    chairC01(g, T0, CX, FY, S, 1.25, -1, true);
    // the answer where a face would be: cool light, readable, a soft halo
    const ty = FY - 118 * S + 120;
    addGlow(g, CX, ty - 10, 640, .3, F6.cool, F6.coolCore);
    g.save(); g.font = '78px "Instrument Serif"'; g.textAlign = 'center'; g.shadowColor = rgba(F6.cool, .8); g.shadowBlur = 22; g.fillStyle = F6.coolCore;
    g.fillText('I understand exactly', CX, ty - 40); g.fillText('how you feel.', CX, ty + 50); g.restore();
    const gr = g.createLinearGradient(0, 0, W * .6, 0); gr.addColorStop(0, 'rgba(4,6,16,.75)'); gr.addColorStop(.7, 'rgba(4,6,16,.25)'); gr.addColorStop(1, 'rgba(4,6,16,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    headline(g, ['IS AI', 'CONSCIOUS?'], { x: 90, cy: 470, size: 270, maxW: 860 });
  },
  // (2a old) the window: in the glass the room, you at the desk, and the chair opposite, empty
  'f6-paper-2x-window': async (g) => {
    nightRoom(g, T0, { cam: { x: 1300, y: 430, z: 1.75 }, screen: 'answer', typing: false, figure: true, window: { reflectA: 1 } });
    const gr = g.createLinearGradient(0, 0, W * .58, 0); gr.addColorStop(0, 'rgba(4,6,16,.9)'); gr.addColorStop(.7, 'rgba(4,6,16,.5)'); gr.addColorStop(1, 'rgba(4,6,16,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    headline(g, ['IS AI', 'CONSCIOUS?'], { x: 90, cy: 520, size: 260, maxW: 960 });
  },
  // 2b · the screen: the answer writes itself, the lamp beside it, you small in front
  'f6-paper-2b-screen': async (g) => {
    nightRoom(g, T0, { cam: { x: 700, y: 520, z: 2.0 }, screen: 'answer', typing: false, figure: true });
    const gr = g.createLinearGradient(0, 0, W * .55, 0); gr.addColorStop(0, 'rgba(4,6,16,.92)'); gr.addColorStop(.7, 'rgba(4,6,16,.55)'); gr.addColorStop(1, 'rgba(4,6,16,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    headline(g, ['IS AI', 'CONSCIOUS?'], { x: 90, cy: 520, size: 260, maxW: 960 });
  },
};

for (const [name, draw] of Object.entries(THUMBS)) {
  if (want.length && !want.includes(name)) continue;
  const [c, g] = canvas(W, H);
  await draw(g); await ready();                 // warm-up frame loads the kit's images, then the real one
  g.clearRect(0, 0, W, H); await draw(g);
  filmFinish(g, T0, { riso: .3 });               // the film's own print finish: the paper look of every frame
  fs.writeFileSync(`${OUT}/${name}.png`, await c.encode('png'));
  const s = createCanvas(1280, 720), sg = s.getContext('2d'); sg.drawImage(c, 0, 0, 1280, 720);
  fs.writeFileSync(`${OUT}/${name}-1280.png`, await s.encode('png'));
  console.log(name);
}
