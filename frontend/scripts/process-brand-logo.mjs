/**
 * Build transparent + light logo variants from source PNG.
 * Run: node scripts/process-brand-logo.mjs
 */
import { readFile, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const BRAND_DIR = path.join(process.cwd(), "public", "images", "brand");
const SOURCE = path.join(BRAND_DIR, "mutqan-logo-source.png");

function removeSolidBackground(data, width, height, channels, bg = "white") {
  const out = Buffer.from(data);
  const threshold = bg === "white" ? 235 : 25;

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

async function processLogo() {
  const input = await readFile(SOURCE);
  const meta = await sharp(input).metadata();
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const transparent = removeSolidBackground(
    data,
    info.width,
    info.height,
    info.channels,
    "white",
  );

  await sharp(transparent, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toFile(path.join(BRAND_DIR, "mutqan-logo.png"));

  // Light variant: invert RGB on non-transparent pixels for dark UI
  const light = Buffer.from(transparent);
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

  console.log("Wrote mutqan-logo.png and mutqan-logo-light.png");
}

processLogo().catch((err) => {
  console.error(err);
  process.exit(1);
});
