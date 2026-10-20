// Contact sheet of single frames: node snap.mjs out.png 0.5 2 3.5 ...
import { chromium } from "playwright-core";
import path from "node:path";
const [out, ...ts] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on("pageerror", (e) => console.error("[page]", e.message));
await p.goto("file://" + path.resolve(path.dirname(new URL(import.meta.url).pathname), "index.html"));
await p.waitForFunction(() => window.__timelines);
for (const t of ts) { const t0 = Date.now(); await p.evaluate((t) => window.__timelines.main.seek(t), Number(t));
  await p.screenshot({ path: out.replace(".png", `_${t}.png`) }); console.log(t, Date.now() - t0, "ms"); }
await b.close();
