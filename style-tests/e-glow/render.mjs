// Renders the canvas directly (toDataURL, CPU raster) into ffmpeg: node render.mjs out.mp4 [fromFrame] [toFrame]
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import path from "node:path";
const [out, from = 0, to] = process.argv.slice(2);
const FPS = 24;
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--disable-gpu"] });
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
p.on("pageerror", (e) => console.error("[page]", e.message));
await p.goto("file://" + path.resolve(path.dirname(new URL(import.meta.url).pathname), "index.html"));
await p.waitForFunction(() => window.__timelines);
const total = Math.round(await p.evaluate(() => window.__timelines.main.duration()) * FPS);
const end = Math.min(Number(to ?? total), total);
const ff = spawn("ffmpeg", ["-v", "error", "-y", "-f", "image2pipe", "-vcodec", "mjpeg", "-framerate", String(FPS), "-i", "-",
  "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", out], { stdio: ["pipe", "inherit", "inherit"] });
const t0 = Date.now();
for (let f = Number(from); f < end; f++) {
  const url = await p.evaluate((t) => { window.__timelines.main.seek(t); return document.getElementById("c").toDataURL("image/jpeg", .95); }, f / FPS);
  const buf = Buffer.from(url.split(",")[1], "base64");
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (f % 24 === 0) console.log(`frame ${f}/${end} ${((Date.now() - t0) / (f - from + 1)).toFixed(0)} ms/frame`);
}
ff.stdin.end(); await new Promise((r) => ff.on("close", r)); await b.close();
console.log("done", out);
