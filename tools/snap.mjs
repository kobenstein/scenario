#!/usr/bin/env node
// Still frames for review: node tools/snap.mjs --dir <composition> --t 1.5,3,4.2 --out <dir> [--scale 0.5]
// Seeks the composition timeline like render-fast.mjs and writes one JPEG per time (named by time).
import { chromium } from "playwright-core";
import http from "node:http"; import fs from "node:fs"; import path from "node:path";
const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
const dir = path.resolve(arg("dir", ".")), out = path.resolve(arg("out", "snaps")), times = arg("t", "0").split(",").map(Number);
const scale = Number(arg("scale", 0.5));
fs.mkdirSync(out, { recursive: true });
const MIME = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".woff2": "font/woff2", ".png": "image/png", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => { const p = path.join(dir, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(dir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": MIME[path.extname(p)] || "application/octet-stream" }); fs.createReadStream(p).pipe(res); });
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const browser = await chromium.launch({ executablePath: arg("chrome", "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"), headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--hide-scrollbars", "--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on("pageerror", (e) => console.error("[page]", e.message)); page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") console.error("[console]", m.text().slice(0, 400)); });
await page.goto(`http://127.0.0.1:${server.address().port}/index.html`, { waitUntil: "load" });
for (let i = 0; !(await page.evaluate(() => !!(window.__timelines && window.__timelines.main))); i++) { if (i > 240) throw new Error("no timeline"); await new Promise((r) => setTimeout(r, 500)); }
console.log("ready");
for (const t of times) { const t0 = Date.now(); await page.evaluate((t) => { window.__timelines.main.seek(t, false); }, t);
  const f = path.join(out, `t${t.toFixed(2).padStart(7, "0")}.jpg`);
  fs.writeFileSync(f, await page.screenshot({ type: "jpeg", quality: 85, animations: "allow", caret: "initial", timeout: 180000 }));
  console.log(f, Date.now() - t0, "ms"); }
await browser.close(); server.close();
