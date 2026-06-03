/**
 * Build transparent logo for store (header + dark UI).
 * Run: node scripts/process-brand-logo.mjs
 *
 * Place sources in public/images/brand/:
 *   mutqan-logo-source.png      — logo on white background (store header)
 *   mutqan-logo-dark-source.png — logo on black background (footer / admin)
 */
import { readFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const BRAND_DIR = path.join(process.cwd(), "public", "images", "brand");
const SOURCE_LIGHT_BG = path.join(BRAND_DIR, "mutqan-logo-source.png");
const SOURCE_DARK_BG = path.join(BRAND_DIR, "mutqan-logo-dark-source.png");

function removeSolidBackground(data, width, height, channels, bg = "white") {
  const out = Buffer.from(data);
  const threshold = bg === "white" ? 240 : 35;

  for (let i = 0; i < width * height; i++) {
    const o = i * channels;
    const r = data[o];
    const g = data[o + 1];
    const b = data[o + 2];

    const isBg =
      bg === "white"
        ? r >= threshold && g >= threshold && b >= threshold
        : r <= threshold && g <= threshold && b <= threshold;

    if (isBg) out[o + 3] = 0;
  }
  return out;
}

/** Lighten dark navy Arabic text on transparent logo for dark surfaces */
function lightenDarkText(data, width, height) {
  const out = Buffer.from(data);
  for (let i = 0; i < width * height; i++) {
    const o = i * 4;
    if (out[o + 3] === 0) continue;
    const r = out[o];
    const g = out[o + 1];
    const b = out[o + 2];
    const lum = (r + g + b) / 3;

    // Keep cyan dot
    if (b > 160 && g > 120 && r < 120) continue;

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

async function processFromFile(inputPath, outputPath, bg, postProcess) {
  const input = await readFile(inputPath);
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let rgba = removeSolidBackground(data, info.width, info.height, info.channels, bg);
  if (postProcess) rgba = postProcess(rgba, info.width, info.height);

  await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);
}

async function processLogo() {
  await processFromFile(
    SOURCE_LIGHT_BG,
    path.join(BRAND_DIR, "mutqan-logo.png"),
    "white",
    null,
  );
  console.log("Wrote mutqan-logo.png (transparent, for header)");

  try {
    await processFromFile(
      SOURCE_DARK_BG,
      path.join(BRAND_DIR, "mutqan-logo-light.png"),
      "black",
      lightenDarkText,
    );
    console.log("Wrote mutqan-logo-light.png (transparent, for dark surfaces)");
  } catch {
    // Fallback: invert default logo
    const input = await readFile(path.join(BRAND_DIR, "mutqan-logo.png"));
    const { data, info } = await sharp(input)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const light = Buffer.from(data);
    for (let i = 0; i < info.width * info.height; i++) {
      const o = i * 4;
      if (light[o + 3] === 0) continue;
      light[o] = 255 - light[o];
      light[o + 1] = 255 - light[o + 1];
      light[o + 2] = 255 - light[o + 2];
    }
    await sharp(light, {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png({ compressionLevel: 9 })
      .toFile(path.join(BRAND_DIR, "mutqan-logo-light.png"));
    console.log("Wrote mutqan-logo-light.png (inverted fallback)");
  }

  const iconSrc = path.join(BRAND_DIR, "mutqan-logo.png");
  await sharp(iconSrc)
    .resize(512, 512, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toFile(path.join(process.cwd(), "app", "icon.png"));
  console.log("Wrote app/icon.png");
}

processLogo().catch((err) => {
  console.error(err);
  process.exit(1);
});
