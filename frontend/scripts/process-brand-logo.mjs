/**
 * Logo: flood-fill frame/white from edges → transparent PNG → trim
 */
import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const BRAND_DIR = path.join(process.cwd(), "public", "images", "brand");
const SOURCE_HEADER = path.join(BRAND_DIR, "mutqan-logo-source.png");
const SOURCE_DARK = path.join(BRAND_DIR, "mutqan-logo-dark-source.png");
const OUTPUT_WIDTH = 280;

function isCyan(r, g, b) {
  return b > 130 && g > 90 && r < 150;
}

/** Pixels that are clearly background (not logo ink) */
function isHardBackground(r, g, b) {
  const lum = (r + g + b) / 3;
  const sat = Math.max(r, g, b) - Math.min(r, g, b);
  if (lum > 242) return true;
  if (lum < 22) return true;
  if (lum > 168 && sat < 28) return true;
  if (r <= 42 && g <= 58 && b <= 78 && lum < 62) return true;
  return false;
}

/** Edge flood: frame, white, and gray JPEG halo connected to the border */
function floodBackgroundMask(data, width, height) {
  const bg = new Uint8Array(width * height);
  const queue = [];

  const push = (x, y) => {
    const p = y * width + x;
    if (bg[p]) return;
    bg[p] = 1;
    queue.push(p);
  };

  for (let x = 0; x < width; x++) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    push(0, y);
    push(width - 1, y);
  };

  const neighbors = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (queue.length) {
    const p = queue.pop();
    const x = p % width;
    const y = (p - x) / width;
    const o = p * 3;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];

    for (const [dx, dy] of neighbors) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const np = ny * width + nx;
      if (bg[np]) continue;

      const no = np * 3;
      const nr = data[no];
      const ng = data[no + 1];
      const nb = data[no + 2];

      if (isHardBackground(nr, ng, nb)) {
        push(nx, ny);
        continue;
      }

      const lum = (nr + ng + nb) / 3;
      const sat = Math.max(nr, ng, nb) - Math.min(nr, ng, nb);
      const lumHere = (r + g + b) / 3;
      const satHere = Math.max(r, g, b) - Math.min(r, g, b);

      if (isCyan(nr, ng, nb) || isCyan(r, g, b)) continue;

      const grayHalo =
        sat < 42 &&
        satHere < 42 &&
        lum > 95 &&
        lumHere > 95 &&
        Math.abs(nr - r) + Math.abs(ng - g) + Math.abs(nb - b) < 72;

      if (grayHalo) push(nx, ny);
    }
  }

  return bg;
}

function boundsFromMask(bg, width, height) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (bg[y * width + x]) continue;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < minX) return null;
  const pad = 2;
  return {
    left: Math.max(0, minX - pad),
    top: Math.max(0, minY - pad),
    width: Math.min(width, maxX - minX + 1 + pad * 2),
    height: Math.min(height, maxY - minY + 1 + pad * 2),
  };
}

function maskToRgba(data, width, height, bg) {
  const out = Buffer.alloc(width * height * 4);
  for (let p = 0; p < width * height; p++) {
    const o = p * 3;
    const t = p * 4;
    out[t] = data[o];
    out[t + 1] = data[o + 1];
    out[t + 2] = data[o + 2];
    out[t + 3] = bg[p] ? 0 : 255;
  }
  return out;
}

/** Drop white/gray halos; binarize alpha after resize */
function cleanFringe(rgba, width, height, { grayLumCutoff = 118 } = {}) {
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    const r = rgba[o];
    const g = rgba[o + 1];
    const b = rgba[o + 2];
    const lum = (r + g + b) / 3;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);

    if (rgba[o + 3] === 0) continue;

    if (isCyan(r, g, b)) {
      rgba[o + 3] = 255;
      continue;
    }

    if (lum > grayLumCutoff && sat < 50) {
      rgba[o + 3] = 0;
      continue;
    }

    if (rgba[o + 3] < 200) {
      rgba[o + 3] = 0;
      continue;
    }

    rgba[o + 3] = 255;
  }
  return rgba;
}

function lightenForDarkBg(data, width, height) {
  const out = Buffer.from(data);
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    if (out[o + 3] === 0) continue;
    const r = out[o];
    const g = out[o + 1];
    const b = out[o + 2];
    if (isCyan(r, g, b)) continue;
    const lum = (r + g + b) / 3;
    if (lum < 150) {
      out[o] = 255;
      out[o + 1] = 255;
      out[o + 2] = 255;
    } else if (lum < 220) {
      out[o] = Math.min(255, r + 90);
      out[o + 1] = Math.min(255, g + 90);
      out[o + 2] = Math.min(255, b + 90);
    }
  }
  return out;
}

async function saveLogo(sourcePath, postProcess, filename, fringeOpts = {}) {
  const input = await readFile(sourcePath);
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });

  const bg = floodBackgroundMask(data, info.width, info.height);
  const bounds = boundsFromMask(bg, info.width, info.height);
  if (!bounds) throw new Error("No logo content in source");

  const cropW = bounds.width;
  const cropH = bounds.height;
  const cropped = Buffer.alloc(cropW * cropH * 3);
  const croppedBg = new Uint8Array(cropW * cropH);

  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const sx = bounds.left + x;
      const sy = bounds.top + y;
      const sp = sy * info.width + sx;
      const dp = y * cropW + x;
      cropped[dp * 3] = data[sp * 3];
      cropped[dp * 3 + 1] = data[sp * 3 + 1];
      cropped[dp * 3 + 2] = data[sp * 3 + 2];
      croppedBg[dp] = bg[sp];
    }
  }

  const refinedBg = floodBackgroundMask(cropped, cropW, cropH);
  for (let p = 0; p < cropW * cropH; p++) {
    if (refinedBg[p]) croppedBg[p] = 1;
  }

  let rgba = maskToRgba(cropped, cropW, cropH, croppedBg);
  rgba = cleanFringe(rgba, cropW, cropH, fringeOpts);
  if (postProcess) rgba = postProcess(rgba, cropW, cropH);

  const scale = OUTPUT_WIDTH / Math.max(cropW, cropH);
  const outW = Math.round(cropW * scale);
  const outH = Math.round(cropH * scale);

  const resized = await sharp(rgba, {
    raw: { width: cropW, height: cropH, channels: 4 },
  })
    .resize(outW, outH, { kernel: sharp.kernel.nearest })
    .ensureAlpha()
    .raw()
    .toBuffer();

  const pngBuffer = await sharp(cleanFringe(resized, outW, outH, fringeOpts), {
    raw: { width: outW, height: outH, channels: 4 },
  })
    .png()
    .toBuffer();

  await sharp(pngBuffer)
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, filename));

  return sharp(path.join(BRAND_DIR, filename)).metadata();
}

/** Header logo: trim empty canvas, transparent white, scale for wide mark (~1.75:1) */
async function exportHeaderLogo() {
  const input = await readFile(SOURCE_HEADER);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  const h = info.height;
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const o3 = i * 3;
    const o4 = i * 4;
    out[o4] = data[o3];
    out[o4 + 1] = data[o3 + 1];
    out[o4 + 2] = data[o3 + 2];
    const lum = (data[o3] + data[o3 + 1] + data[o3 + 2]) / 3;
    out[o4 + 3] = lum > 252 ? 0 : 255;
  }
  const outPath = path.join(BRAND_DIR, "mutqan-logo.png");
  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .trim({ threshold: 1 })
    .resize({ width: 320, withoutEnlargement: false })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
  return sharp(outPath).metadata();
}

async function main() {
  const m1 = await exportHeaderLogo();
  const m2 = await saveLogo(SOURCE_DARK, lightenForDarkBg, "mutqan-logo-light.png");
  console.log("mutqan-logo.png", m1.width, "x", m1.height);
  console.log("mutqan-logo-light.png", m2.width, "x", m2.height);

  await sharp(path.join(BRAND_DIR, "mutqan-logo.png"))
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(process.cwd(), "app", "icon.png"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
