// Scene windows (global seconds), anchored to words of the cut VO. Do not change from/to inside a scene module.
import { at, section, E } from "../engine.js";
const IDS = ["s01-hook", "s02-why", "s03-lena", "s04-flipbook", "s05-2028", "s06-fork", "s07-endings", "s08-builders", "s09-report", "s10-test", "s11-brake", "s12-rules", "s13-yourpart"];
export const windows = () => {
  const b = [0, section("why").start, section("scenario").start,
    at("scenario", "Picture a flip") - 0.15, at("scenario", "Now let's imagine March") - 0.15,
    section("fork").start, section("endings").start, at("endings", "Here's what surprised me") - 0.35,
    section("solutions").start, at("solutions", "Second let someone else") - 0.2, at("solutions", "Third build the brake") - 0.2,
    at("solutions", "Fourth turn promises") - 0.2, section("yourpart").start, section("yourpart").end];
  return IDS.map((id, i) => ({ id, from: +b[i].toFixed(3), to: +b[i + 1].toFixed(3) }));
};
// placeholder for scenes not built yet: dark paper stage with the scene id
const placeholder = (id) => (E2, def) => { const { THREE } = E2; const scene = new THREE.Scene(); E2.stage(scene, E2.PAL.night); E2.lights(scene, E2.PAL.night);
  const cam = E2.newCamera(); const lbl = E2.cutoutText(id, { height: 3 }); lbl.position.set(0, 5, 0); scene.add(lbl);
  return { scene, camera: cam, update: (t) => E2.applyCam(cam, E2.camPath([{ t: def.from, p: [0, 6, 30], l: [0, 5, 0] }, { t: def.to, p: [2, 6.5, 26], l: [0, 5, 0] }], t)) }; };
export const sceneList = async (timing) => {
  // timing must be set before windows(); start() sets it, so compute lazily via a tiny bootstrap
  const { setTiming } = await import("../engine.js");
  setTiming(timing);
  const W = windows();
  return Promise.all(W.map(async (w) => { let mod = null; try { mod = (await import(`./${w.id}.js`)).default; } catch (e) { if (!String(e).includes("Failed to fetch")) console.error(w.id, e); }
    return { ...w, build: mod ? mod.build : placeholder(w.id) }; }));
};
