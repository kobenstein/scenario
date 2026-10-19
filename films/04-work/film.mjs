// Film 04 "You Don't Have to Work Anymore": one shot per sentence, anchored to the VO word times.
// Every chapter lives in scenes/sNN.mjs (00..08) and returns its shots; this file stitches them into one timeline.
//   entry = { t, draw(ctx, t, s), tr: 'iris'|'zoom'|'out'|'match'|'black'|'page'|'left'|'right'|'up'|'down'|'push'|'dissolve'|'fog', d, x, y, r, depth }
//   tr/d/x/y describe the transition INTO this shot (x, y = screen point of the carrier object at the hand-over).
// SECS=03,04 node render.mjs --snap ...   builds only those chapters (absolute times stay the same).
import fs from 'node:fs';
import { Film } from './engine.mjs';
import { timing, prepareClips } from './lib/kit.mjs';

export const ROOT = '/mnt/project-files/scenario/film-04-work/';
const ALL = ['00', '01', '02', '03', '03b', '04', '05', '06', '07', '08', 'hill'];

export async function build() {
  const T = timing(ROOT + 'audio/timing.json');
  const want = process.env.SECS ? process.env.SECS.split(',') : ALL;
  const list = [];
  for (const id of want) {
    const f = new URL(`./scenes/s${id}.mjs`, import.meta.url);
    if (!fs.existsSync(f)) continue;
    const mod = await import(f.href);
    const shots = await mod.default(T);
    for (const e of shots) list.push({ ...e, sec: id });
  }
  list.sort((p, q) => p.t - q.t);
  const end = T.duration;
  const shots = list.map((e, i) => {
    const nx = list[i + 1], d = e.d ?? .9, dn = nx ? (nx.d ?? .9) : 0;
    const a = i ? e.t - d / 2 : (e.t > 0 ? e.t : 0), b = nx ? nx.t + dn / 2 : end;
    return { a: i ? a : 0, b, draw: e.draw, sec: e.sec, sound: e.sound, out: nx ? { kind: nx.tr || 'dissolve', x: nx.x, y: nx.y, r: nx.r, depth: nx.depth } : { kind: 'black' }, _start: e.t };
  });
  for (let i = 1; i < shots.length; i++) shots[i].a = Math.min(shots[i].a, shots[i - 1].b - .01);
  const film = new Film(shots, { grainAmt: .045 });
  film.T = T;
  film.prepare = (t) => prepareClips(T, t);
  film.list = list;
  return film;
}
