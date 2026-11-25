#!/usr/bin/env node
// docs/shots.md from scenes/plan.mjs on the VO timing (real if <ROOT>audio/timing.json exists, else the provisional one) + the explanatory
// share (REGELN §13.2) + hard cuts/min + leitbild anchors + the builder packages. Run before animating and again after every new VO / vo-vN.
//   node tools/shots76.mjs            (TIMING=… to force a file)
import fs from 'node:fs';
import { timing } from '../lib/kit.mjs';
import { TIMING, chunkRanges } from '../film.mjs';
import { resolve } from '../scenes/resolve.mjs';
const T = timing(TIMING);
const S = resolve(T), WT = { EXPL: 1, MIX: .5, SCENE: 0, CLIP: 0 };
const by = {}; let w = 0;
for (const s of S) { const d = s.b - s.a; by[s.kind] = (by[s.kind] || 0) + d; w += d * WT[s.kind]; }
const share = w / T.duration * 100, cuts = S.filter((s) => s.tr === 'cut').length, lb = S.filter((s) => s.lb).map((s) => s.id);
const planes = S.filter((s, i) => i && (s.tr ?? 'plane') === 'plane').length, matches = S.filter((s) => s.tr === 'match').length;
const mm = (x) => `${Math.floor(x / 60)}:${(x % 60).toFixed(1).padStart(4, '0')}`;
const R = chunkRanges(T), pkg = Object.values(R);
const pshare = (id) => { let ww = 0, dd = 0; for (const s of S.filter((x) => (x.pk || 'L') === id)) { const d = s.b - s.a; dd += d; ww += d * WT[s.kind]; } return (ww / dd * 100).toFixed(1); };
const clipS = S.filter((s) => s.kind === 'CLIP').reduce((a, s) => a + s.b - s.a, 0);
const shortS = S.filter((s) => s.b - s.a < 1.5).map((s) => `${s.id} ${(s.b - s.a).toFixed(1)} s`);
let md = `# Film 76 · shots.md (Film-5-Format, generiert von tools/shots76.mjs aus scenes/plan.mjs)\n\n`;
md += `Timing: **${T.provisional ? 'VORLÄUFIG' : 'echtes VO'}** (\`${TIMING.replace(/.*\/code\//, 'code/')}\`). Nach dem echten VO (\`<ROOT>audio/timing.json\`) neu laufen lassen; die Anker sind Satzanfänge, die Shots ziehen mit.\n\n`;
md += `**Erklärgrafik-Anteil (REGELN §13.2, gewichtet pro Sekunde, EXPL 1 · MIX 0,5 · SZENE/WELT 0 · CLIP 0): ${share.toFixed(1)} %** (Ziel 60–70 %) · Laufzeit ${mm(T.duration)} · `;
md += Object.entries(by).map(([k, v]) => `${k} ${v.toFixed(1)} s`).join(' · ') + ` · ohne Clip-Sekunden ${(w / (T.duration - clipS) * 100).toFixed(1)} %\n\n`;
md += `Shots: ${S.length} (${(S.length / (T.duration / 60)).toFixed(1)} Motive/min, Ø ${(T.duration / S.length).toFixed(1)} s) · harte Schnitte: ${cuts} (${(cuts / (T.duration / 60)).toFixed(2)}/min) · Übergänge: ${planes}× Papierflieger, ${matches}× Match (Form läuft im Bild weiter) · Leitbild-Anker: ${lb.join(', ')} (${lb.length})\n\n`;
md += `Pakete: ` + pkg.map((r) => `**${r.id}** ${mm(r.a)}–${mm(r.b)} (${((r.b - r.a) / 60).toFixed(1)} min, Anteil ${pshare(r.id)} %)`).join(' · ') + `\n\n`;
md += `Clips (Slots, vorläufige Längen bis \`audio/timing.json\`): ` + S.filter((s) => s.kind === 'CLIP').map((s) => `${s.id} ${mm(s.a)} ${(s.b - s.a).toFixed(1)} s`).join(' · ') + ` = ${clipS.toFixed(1)} s (${(clipS / T.duration * 100).toFixed(1)} %)\n\n`;
if (shortS.length) md += `Kurze Shots (< 1,5 s, prüfen): ${shortS.join(', ')}\n\n`;
md += `Träger: der **Papierflieger** (die Frage des Kindes, in h5 am Küchentisch aus der Heftseite gefaltet). Er verlässt Shot A an „raus“, fliegt einen Bogen (0,55 s) mit Schräglage, landet an „rein“ von Shot B und öffnet sich dort; B entfaltet sich als Scheibe mit weichem Rand (0,7 s, expo-out, dünner Papierrand). Das erste Element von B entsteht genau dort. „match“ = der Shot setzt das letzte Bild des vorigen selbst fort (gleiches Objekt, gleiche Stelle). Keine Blenden.\n\n`;
md += `| # | ab | Shot | Pkt | Art | Satz (VO) | zeigt wörtlich | Motiv neu? | Träger rein → raus |\n|---|---|---|---|---|---|---|---|---|\n`;
S.forEach((s, i) => {
  const tr = i === 0 ? 'Start' : (s.tr ?? 'plane') === 'plane' ? `Flieger landet ${s.in.join('/')}` : s.tr === 'match' ? 'Match (läuft weiter)' : 'harter Schnitt';
  const neu = s.neu ? `nein: ${s.neu}` : s.lb && s.lb > 1 ? 'ja (Anker: Leitbild kehrt zurück, neue Grafik darauf)' : 'ja' + (s.shows.includes(';') ? ', je Satz ein neues Element' : '');
  md += `| ${i + 1} | ${mm(s.a)} | ${s.id}${s.lb ? ` (Leitbild ${s.lb})` : ''} | ${s.pk || 'L'} | ${s.kind} | ${s.says.replace(/\|/g, '/')} | ${s.shows.replace(/\|/g, '/')} | ${neu} | ${tr} → raus ${s.out.join('/')} |\n`;
});
md += `\n## Nicht wiederholen (Welten und Motive früherer Filme, aus docs von #59–#69)\n`;
md += `- **#69:** THE PLAN SHEET (Blaupausen-Raster), das Puzzle-Mond-Kit, 27 Inseln, Kisten, Regelhefte. **#68:** das Nachtstadion, die Anzeigetafel, Laufbahnen, Staffelstab, Läufer, Punktekarte. **#67:** Überschrift am Himmel, Tafel, Schiedsrichterstuhl, Band, Papierturm, Checkliste mit Kästchen, goldene Karte CORRECT. **#66:** Preisschilder, Quittungen, Lohnzettel, Dollar-Balken, das lange Land. **#65:** Stimm-Bogen, Telefonmasten, Fenster-Portal der Mutter. **#63:** die Waage (THE SCALE), Handfläche des Papstes. **#59:** Kristall, Glocke, Stempel. **#54:** große Halle, Vitrinen. **#31:** Leiter. **#27:** Schaufenster, Briefkasten.\n`;
md += `- **Älter:** Zifferblatt/jede Uhr, Sanduhr, Serverregale, Feuerkreis, Globus, Weltkarte mit Nadeln, Roboter als Bild der KI, Gehirne, Matrix-Code, Kalenderblätter als Motiv, Dominoreihe.\n`;
md += `- **In #76 darum:** Die „Alters-Uhr“ ist KEINE Uhr, sondern die fünf Lebensstufen aus Thumbnail B mit rollendem Zähler AGE n · JAHR (bewusst freigegebenes Thumbnail-Motiv; flache Blöcke, keine Treppe in den Himmel wie #16). Statt Waage eine **Wippe** vom Spielplatz. Statt Lohnzettel ein **Lohnbalken**. Keine Stempel: Urteile sind Wörter, die aufsteigen, oder ein Schild-Badge. Die Maschine ist der **Chip aus Licht** (Thumbnail A), nie ein Roboter oder Gesicht; der „Freund im Gerät“ ist ein weiches Licht, kein Gesicht. Küchentisch (#65/#69 hatten Küchen) hier von der Seite unter der Hängelampe, nur 4× (h4, a18b, a30h/t0, s2).\n`;
fs.mkdirSync(new URL('../docs/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../docs/shots.md', import.meta.url), md);
console.log(`timing ${T.provisional ? 'PROVISIONAL' : 'REAL'} ${T.duration.toFixed(1)} s · share ${share.toFixed(1)} %`, Object.fromEntries(Object.entries(by).map(([k, v]) => [k, +v.toFixed(1)])), `cuts ${cuts} · shots ${S.length} · planes ${planes} · matches ${matches} · leitbild`, lb.join(','));
for (const r of pkg) console.log(`  ${r.id.padEnd(3)} ${mm(r.a)}–${mm(r.b)}  ${((r.b - r.a) / 60).toFixed(2)} min  share ${pshare(r.id)} %`);
if (shortS.length) console.log('SHORT', shortS.join(', '));
