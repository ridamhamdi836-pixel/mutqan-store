/**
 * One-time / occasional: recompress PNG/JPEG under public/images (max width 1920, WebP quality 82).
 * Run from frontend/: npm run optimize-images
 */
import { readdir, readFile, writeFile, stat } from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 82;
const PNG_QUALITY = 85;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(png|jpe?g)$/i.test(e.name)) files.push(full);
  }
  return files;
}

async function optimizeFile(filePath) {
  const before = (await stat(filePath)).size;
  const img = sharp(await readFile(filePath));
  const meta = await img.metadata();
  let pipeline = img;
  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  const ext = path.extname(filePath).toLowerCase();
  let out;
  if (ext === ".png") {
    out = await pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toBuffer();
  } else {
    out = await pipeline.jpeg({ quality: WEBP_QUALITY, mozjpeg: true }).toBuffer();
  }
  if (out.length < before) {
    await writeFile(filePath, out);
    const saved = ((before - out.length) / before) * 100;
    console.log(`OK ${path.relative(ROOT, filePath)}: ${(before / 1024).toFixed(0)}KB → ${(out.length / 1024).toFixed(0)}KB (-${saved.toFixed(0)}%)`);
  } else {
    console.log(`skip ${path.relative(ROOT, filePath)} (already small)`);
  }
}

const files = await walk(ROOT);
console.log(`Optimizing ${files.length} images under public/images…`);
for (const f of files) {
  try {
    await optimizeFile(f);
  } catch (err) {
    console.error(`FAIL ${f}:`, err.message);
  }
}
console.log("Done.");
