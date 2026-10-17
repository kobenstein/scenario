// s01 · Hook (stub while rewriting)
export default {
  build(E, def) {
    const { THREE } = E; const scene = new THREE.Scene(); E.stage(scene, E.PAL.night); E.lights(scene, E.PAL.night);
    const camera = E.newCamera();
    return { scene, camera, update(t) { E.applyCam(camera, E.camPath([{ t: def.from, p: [0, 6, 30], l: [0, 5, 0] }, { t: def.to, p: [2, 6.5, 26], l: [0, 5, 0] }], t)); } };
  },
};
