// ═══════════════════════════════════════════════════════
// CTRL-A — CAPTURE TOOL SCREENSHOTS
//
// Self-hosts the tool-preview screenshots so the CTRL-A toolkit
// stations stop depending on the third-party WordPress mShots
// service (rate-limited, occasionally blank, outside ROV control).
//
// For every tool in `toolkitSections` (app/ctrla/data.ts) this:
//   1. opens the tool's site in headless Chromium,
//   2. screenshots the fold at 1200x750,
//   3. encodes it to WebP (via Chromium's own canvas encoder,
//      so no `sharp`/native dep is required),
//   4. writes public/ctrla/toolshots/{id}.webp, and
//   5. rewrites public/ctrla/toolshots/manifest.json with the
//      ids that now have a shot.
//
// The site keeps working with an empty manifest: every tool
// falls back to mShots until a shot is captured here.
//
// ── Requirements ────────────────────────────────────────
//   npm i -D playwright        (or: npx playwright ...)
//   npx playwright install chromium
//
// ── Run ─────────────────────────────────────────────────
//   node scripts/capture-toolshots.mjs            # all tools, skip existing
//   node scripts/capture-toolshots.mjs --force    # recapture everything
//   node scripts/capture-toolshots.mjs --only=vercel-com,figma-com
//
// If Playwright / Chromium is not installed the script exits
// cleanly with instructions and changes nothing.
// ═══════════════════════════════════════════════════════

import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdir, writeFile, readFile, access } from "node:fs/promises";
import { constants } from "node:fs";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "ctrla", "toolshots");
const MANIFEST = join(OUT_DIR, "manifest.json");

const WIDTH = 1200;
const HEIGHT = 750;
const WEBP_QUALITY = 0.85;
const NAV_TIMEOUT = 30_000;
const SETTLE_MS = 2_500; // let fonts / hero animation settle before the shot

// ── CLI flags ───────────────────────────────────────────
const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const onlyArg = args.find((a) => a.startsWith("--only="));
const ONLY = onlyArg
  ? new Set(onlyArg.slice("--only=".length).split(",").map((s) => s.trim()).filter(Boolean))
  : null;

// ── Stable id from a tool URL ───────────────────────────
// MUST stay in exact sync with `toolShotId` in
// app/ctrla/_components/toolshots.ts
function toolShotId(url) {
  return url
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function exists(p) {
  try {
    await access(p, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// ── Load the tool list from the TS source via jiti ──────
async function loadTools() {
  let jiti;
  try {
    jiti = require("jiti")(fileURLToPath(import.meta.url));
  } catch {
    throw new Error("jiti not found — run from the repo so devDependencies resolve.");
  }
  const data = jiti(join(ROOT, "app", "ctrla", "data.ts"));
  const sections = data.toolkitSections ?? [];
  const seen = new Set();
  const tools = [];
  for (const section of sections) {
    for (const t of section.tools ?? []) {
      if (!t.url) continue;
      const id = toolShotId(t.url);
      if (seen.has(id)) continue; // same site referenced twice
      seen.add(id);
      tools.push({ id, url: t.url, name: t.name });
    }
  }
  return tools;
}

// ── Playwright (optional dependency) ────────────────────
async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    return null;
  }
}

async function readManifest() {
  try {
    const raw = await readFile(MANIFEST, "utf8");
    const json = JSON.parse(raw);
    return Array.isArray(json.shots) ? json.shots : [];
  } catch {
    return [];
  }
}

async function writeManifest(ids) {
  const sorted = [...new Set(ids)].sort();
  const body = {
    $comment:
      "Generated/maintained by scripts/capture-toolshots.mjs. `shots` lists the tool ids (see toolShotId) that have a self-hosted screenshot at /ctrla/toolshots/{id}.webp. Empty = every tool falls back to mShots.",
    updated: new Date().toISOString().slice(0, 10),
    shots: sorted,
  };
  await writeFile(MANIFEST, JSON.stringify(body, null, 2) + "\n", "utf8");
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const tools = await loadTools();
  const targets = tools.filter((t) => (ONLY ? ONLY.has(t.id) : true));
  console.log(`Found ${tools.length} tools (${targets.length} targeted).`);

  const pw = await loadPlaywright();
  if (!pw) {
    console.log("\nPlaywright is not installed — capture is PENDING on tooling.");
    console.log("Install it, then re-run:");
    console.log("  npm i -D playwright");
    console.log("  npx playwright install chromium");
    console.log("  node scripts/capture-toolshots.mjs");
    console.log("\nNo files were changed. The site still falls back to mShots.");
    process.exit(0);
  }

  let browser;
  try {
    browser = await pw.chromium.launch();
  } catch (err) {
    console.log("\nChromium is not installed for Playwright — capture is PENDING.");
    console.log("Run:  npx playwright install chromium");
    console.log(`(${err.message})`);
    console.log("\nNo files were changed. The site still falls back to mShots.");
    process.exit(0);
  }

  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  });

  // A dedicated blank page used only to encode PNG -> WebP with Chromium's
  // canvas encoder (avoids a native `sharp` dependency).
  const encoder = await context.newPage();
  await encoder.setContent("<!doctype html><body></body>");

  const captured = new Set(await readManifest());
  let ok = 0;
  let failed = 0;

  for (const tool of targets) {
    const outFile = join(OUT_DIR, `${tool.id}.webp`);
    if (!FORCE && (await exists(outFile))) {
      console.log(`· skip  ${tool.id} (exists)`);
      captured.add(tool.id);
      continue;
    }
    const page = await context.newPage();
    try {
      await page.goto(tool.url, { waitUntil: "networkidle", timeout: NAV_TIMEOUT });
      await page.waitForTimeout(SETTLE_MS);
      const png = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT } });

      const dataUrl = await encoder.evaluate(
        async ({ b64, q }) => {
          const img = new Image();
          img.src = "data:image/png;base64," + b64;
          await img.decode();
          const c = document.createElement("canvas");
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          c.getContext("2d").drawImage(img, 0, 0);
          return c.toDataURL("image/webp", q);
        },
        { b64: png.toString("base64"), q: WEBP_QUALITY }
      );

      const webp = Buffer.from(dataUrl.split(",")[1], "base64");
      await writeFile(outFile, webp);
      captured.add(tool.id);
      ok++;
      console.log(`✓ shot  ${tool.id}  (${(webp.length / 1024).toFixed(0)} KB)`);
    } catch (err) {
      failed++;
      console.log(`✗ fail  ${tool.id}  ${err.message.split("\n")[0]}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  await writeManifest([...captured]);

  console.log(`\nDone. ${ok} captured, ${failed} failed, ${captured.size} total in manifest.`);
  if (failed > 0) {
    console.log("Failed tools keep falling back to mShots — re-run to retry them.");
  }
}

main().catch((err) => {
  console.error("capture-toolshots failed:", err);
  process.exit(1);
});
