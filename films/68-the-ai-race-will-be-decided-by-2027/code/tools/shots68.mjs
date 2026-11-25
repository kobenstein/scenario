#!/usr/bin/env node
// docs/shots.md from scenes/plan.mjs on the REAL VO timing + the explanatory share (REGELN §13.2) + cuts/min. Run before animating.
import fs from 'node:fs';
import { timing, ROOT } from '../lib/kit.mjs';
import { resolve } from '../scenes/resolve.mjs';
const T = timing(process.env.TIMING || ROOT + 'audio/timing.json');
const S = resolve(T), WT = { EXPL: 1, MIX: .5, SCENE: 0, CLIP: 0 };
const by = {}; let w = 0;
for (const s of S) { const d = s.b - s.a; by[s.kind] = (by[s.kind] || 0) + d; w += d * WT[s.kind]; }
const share = w / T.duration * 100, cuts = S.filter((s) => s.tr === 'cut').length, lb = S.filter((s) => s.lb).map((s) => s.id);
const mm = (x) => `${Math.floor(x / 60)}:${(x % 60).toFixed(1).padStart(4, '0')}`;
let md = `# Film 68 · shots.md (Film-5-Format, generiert von tools/shots68.mjs aus scenes/plan.mjs auf dem echten VO-Timing)\n\n`;
md += `**Erklärgrafik-Anteil (REGELN §13.2, gewichtet pro Sekunde, EXPL 1 · MIX 0,5 · SZENE 0 · CLIP 0): ${share.toFixed(1)} %** (Ziel 60–70 %) · Laufzeit ${mm(T.duration)} · `;
md += Object.entries(by).map(([k, v]) => `${k} ${v.toFixed(1)} s`).join(' · ') + `\n\n`;
md += `Shots: ${S.length} · harte Schnitte: ${cuts} (${(cuts / (T.duration / 60)).toFixed(2)}/min; alle anderen Grenzen über den Träger „Staffelstab“) · Leitbild-Anker: ${lb.join(', ')} (${lb.length})\n\n`;
md += `Träger (alle Grenzen): der **Staffelstab**, ein goldener Lichtpunkt. Er verlässt Shot A an „raus“, fliegt in einem Bogen (0,45 s) und landet an „rein“ von Shot B; dort wächst B als Scheibe mit weichem Rand aus dem Landepunkt (0,7 s, expo-out). Das erste Element von B entsteht genau dort. Keine Blenden.\n\n`;
md += `| # | ab | Shot | Art | Satz (VO) | zeigt wörtlich | Motiv neu? | Träger rein → raus |\n|---|---|---|---|---|---|---|---|\n`;
S.forEach((s, i) => { md += `| ${i + 1} | ${mm(s.a)} | ${s.id}${s.lb ? ` (Leitbild ${s.lb})` : ''} | ${s.kind} | ${s.says.replace(/\|/g, '/')} | ${s.shows.replace(/\|/g, '/')} | ${s.lb && s.lb > 1 ? 'Anker (Leitbild)' : 'ja'}${s.shows.includes(';') ? ', je Satz ein neues Element' : ''} | Stab landet ${s.in.join('/')} → verlässt ${s.out.join('/')} |\n`; });
md += `\n## Nicht wiederholen (Welten und Motive früherer Filme)\n- #67 Nacht der Überschrift (goldene Riesenbuchstaben am Himmel, Akte, Band, Schiedsrichter-Stuhl, Checkliste) · #59 Kristall, Glocke, Stempel · #66 Preisschilder, langes Land · #54 große Halle, Vitrinen, Gästebuch · #31 Leiter · Uhren, Sanduhr, Feuerkreis, Serverregale, Roboter als Bild der KI, Gehirne, Matrix-Code.\n- Die KI ist hier eine **cyanfarbene Lichtscheibe** in der dritten Bahn, nie ein Roboter. Humanoide Roboter nur wörtlich im Pekinger Sprint (R4).\n`;
fs.mkdirSync(new URL('../docs/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../docs/shots.md', import.meta.url), md);
console.log(`share ${share.toFixed(1)} %`, by, `cuts ${cuts}`, `shots ${S.length}`, 'leitbild', lb);
for (const s of S) if (s.b - s.a < 1.5) console.log('SHORT', s.id, (s.b - s.a).toFixed(2));
