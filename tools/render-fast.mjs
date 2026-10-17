#!/usr/bin/env node
// Fast frame renderer for Scenario compositions.
// Hyperframes stays the authoring/preview format; this replaces only its slow final capture.
// It seeks the composition's GSAP root timeline frame by frame (which calls the scene's render(t)),
// screenshots the page (WebGL + grain + DOM overlays in one image) and pipes JPEGs into ffmpeg.
// Usage: node tools/render-fast.mjs --dir style-tests/b3-fast --out out.mp4 [--from 0] [--to 450] [--fps 30]
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const arg = (k, d) => { const i = process.argv.indexOf("--" + k); return i > 0 ? process.argv[i + 1] : d; };
const dir = path.resolve(arg("dir", "."));
const out = path.resolve(arg("out", "out.mp4"));
const fps = Number(arg("fps", 30));
const comp = arg("comp", "main");
const quality = Number(arg("quality", 95));
const W = Number(arg("width", 1920)), H = Number(arg("height", 1080));
const browserPath = arg("chrome", process.env.CHROME_PATH);

const MIME = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".wav": "audio/wav" };
const server = http.createServer((req, res) => {
  const p = path.join(dir, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(dir) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": MIME[path.extname(p)] || "application/octet-stream" }); fs.createReadStream(p).pipe(res);
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const url = arg("url", `http://127.0.0.1:${server.address().port}/index.html`);

const browser = await chromium.launch({ executablePath: browserPath, headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--disable-gpu-vsync", "--hide-scrollbars", "--force-color-profile=srgb"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.error("[page]", e.message));
page.on("console", (m) => { if (m.type() === "error") console.error("[console]", m.text().slice(0, 300)); });
page.on("response", (r) => { if (r.status() >= 400) console.error("[" + r.status() + "]", r.url()); });
await page.goto(url, { waitUntil: "load" });
for (let i = 0; ; i++) { // the scene registers its timeline after fonts + three.js are ready
  if (await page.evaluate((c) => !!(window.__timelines && window.__timelines[c]), comp)) break;
  if (i > 240) throw new Error("timeline '" + comp + "' never registered");
  await new Promise((r) => setTimeout(r, 500));
}
const duration = await page.evaluate((c) => window.__timelines[c].duration(), comp);
const total = Math.round(duration * fps);
const from = Number(arg("from", 0)), to = Math.min(Number(arg("to", total)), total);

const ff = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "image2pipe", "-vcodec", "mjpeg", "-framerate", String(fps), "-i", "-",
  "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", "-r", String(fps), out], { stdio: ["pipe", "inherit", "inherit"] });
const t0 = Date.now();
for (let f = from; f < to; f++) {
  await page.evaluate(([c, t]) => { window.__timelines[c].seek(t, false); }, [comp, f / fps]);
  const jpg = await page.screenshot({ type: "jpeg", quality, animations: "allow", caret: "initial" });
  if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once("drain", r));
  if ((f - from) % 30 === 29) console.log(`frame ${f + 1}/${to}  ${((Date.now() - t0) / (f - from + 1) / 1000).toFixed(2)} s/frame`);
}
ff.stdin.end();
await new Promise((r) => ff.on("close", r));
await browser.close(); server.close();
console.log(`done ${to - from} frames in ${((Date.now() - t0) / 1000).toFixed(0)} s -> ${out}`);
