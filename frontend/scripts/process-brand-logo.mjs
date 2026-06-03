/**
 * Build transparent logo for store (header + dark UI).
 * Removes white background + black square frame.
 * Run: node scripts/process-brand-logo.mjs
 */
import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const BRAND_DIR = path.join(process.cwd(), "public", "images", "brand");
const SOURCE_LIGHT_BG = path.join(BRAND_DIR, "mutqan-logo-source.png");
const SOURCE_DARK_BG = path.join(BRAND_DIR, "mutqan-logo-dark-source.png");

function isCyanDot(r, g, b) {
  return b > 150 && g > 110 && r < 130;
}

/** White / off-white background */
function isBackground(r, g, b) {
  return r >= 238 && g >= 238 && b >= 238;
}

/** Black frame lines (not solid logo text) */
function isFrameBlack(r, g, b) {
  return r <= 55 && g <= 55 && b <= 55 && !isCyanDot(r, g, b);
}

function countOpaqueNeighbors(data, w, h, x, y) {
  let n = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const o = (ny * w + nx) * 4;
      if (data[o + 3] > 0) n++;
    }
  }
  return n;
}

function toTransparentRgba(data, width, height, channels) {
  const out = Buffer.alloc(width * height * 4);

  for (let i = 0; i < width * height; i++) {
    const o = i * channels;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];
    const t = i * 4;

    if (isBackground(r, g, b)) {
      out[t + 3] = 0;
      continue;
    }

    out[t] = r;
    out[t + 1] = g;
    out[t + 2] = b;
    out[t + 3] = 255;
  }

  // Remove black border: dark pixels with few opaque neighbors (thin frame)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = (y * width + x) * 4;
      if (out[t + 3] === 0) continue;
      const r = out[t];
      const g = out[t + 1];
      const b = out[t + 2];
      if (!isFrameBlack(r, g, b)) continue;

      const neighbors = countOpaqueNeighbors(out, width, height, x, y);
      if (neighbors < 5) {
        out[t + 3] = 0;
      }
    }
  }

  // Second pass: edge black remnants touching transparency
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = (y * width + x) * 4;
      if (out[t + 3] === 0) continue;
      const r = out[t];
      const g = out[t + 1];
      const b = out[t + 2];
      if (!isFrameBlack(r, g, b)) continue;

      let transparentNeighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) {
            transparentNeighbors++;
            continue;
          }
          const o = (ny * width + nx) * 4;
          if (out[o + 3] === 0) transparentNeighbors++;
        }
      }
      if (transparentNeighbors >= 3) {
        out[t + 3] = 0;
      }
    }
  }

  return out;
}

function lightenDarkText(data, width, height) {
  const out = Buffer.from(data);
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    if (out[o + 3] === 0) continue;
    const r = out[o];
    const g = out[o + 1];
    const b = out[o + 2];
    const lum = (r + g + b) / 3;

    if (isCyanDot(r, g, b)) continue;

    if (lum < 120) {
      out[o] = 255;
      out[o + 1] = 255;
      out[o + 2] = 255;
    } else if (lum < 200) {
      out[o] = Math.min(255, r + 80);
      out[o + 1] = Math.min(255, g + 80);
      out[o + 2] = Math.min(255, b + 80);
    }
  }
  return out;
}

async function processFromBuffer(inputBuffer, outputPath, postProcess) {
  const trimmed = await sharp(inputBuffer)
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .trim({ threshold: 18 })
    .toBuffer();

  const { data, info } = await sharp(trimmed)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let rgba = toTransparentRgba(data, info.width, info.height, info.channels);
  if (postProcess) rgba = postProcess(rgba, info.width, info.height);

  await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function processLogo() {
  const source = await readFile(SOURCE_LIGHT_BG);

  await processFromBuffer(source, path.join(BRAND_DIR, "mutqan-logo.png"), null);
  console.log("Wrote mutqan-logo.png (no frame, transparent)");

  await processFromBuffer(
    source,
    path.join(BRAND_DIR, "mutqan-logo-light.png"),
    lightenDarkText,
  );
  console.log("Wrote mutqan-logo-light.png");

  const iconSrc = path.join(BRAND_DIR, "mutqan-logo.png");
  await sharp(iconSrc)
    .resize(512, 512, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(path.join(process.cwd(), "app", "icon.png"));
  console.log("Wrote app/icon.png");
}

processLogo().catch((err) => {
  console.error(err);
  process.exit(1);
});
