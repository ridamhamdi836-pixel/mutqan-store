/**
 * Compress PNG/JPEG under public/images and emit matching .webp siblings.
 * Run from frontend/: npm run optimize-images
 */
import { readdir, readFile, writeFile, stat } from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");

/** @type {{ match: (rel: string) => boolean; maxWidth: number; webpQuality: number; jpegQuality?: number; pngQuality?: number }[]} */
const RULES = [
  {
    match: (rel) => /[/\\]customers[/\\]/.test(rel) || /customer-\d/.test(rel),
    maxWidth: 160,
    webpQuality: 75,
    pngQuality: 80,
  },
  {
    match: (rel) => /-card\.(png|jpe?g)$/i.test(rel) || /card\.(png|jpe?g)$/i.test(rel),
    maxWidth: 720,
    webpQuality: 78,
    jpegQuality: 78,
    pngQuality: 82,
  },
  {
    match: (rel) => /[/\\]reviews[/\\]/.test(rel),
    maxWidth: 960,
    webpQuality: 80,
    jpegQuality: 80,
    pngQuality: 84,
  },
  {
    match: (rel) => /[/\\]hero[/\\]/.test(rel) || /-hero\.(png|jpe?g)$/i.test(rel),
    maxWidth: 1280,
    webpQuality: 82,
    jpegQuality: 82,
    pngQuality: 86,
  },
  {
    match: () => true,
    maxWidth: 1280,
    webpQuality: 80,
    jpegQuality: 80,
    pngQuality: 84,
  },
];

function ruleFor(rel) {
  return RULES.find((r) => r.match(rel)) ?? RULES[RULES.length - 1];
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(png|jpe?g)$/i.test(e.name) && !e.name.endsWith(".webp"))
      files.push(full);
  }
  return files;
}

async function optimizeFile(filePath) {
  const rel = path.relative(ROOT, filePath);
  const { maxWidth, webpQuality, jpegQuality = 80, pngQuality = 84 } = ruleFor(rel);
  const before = (await stat(filePath)).size;
  const input = sharp(await readFile(filePath));
  const meta = await input.metadata();

  let pipeline = input.rotate();
  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  const ext = path.extname(filePath).toLowerCase();
  let raster;
  if (ext === ".png") {
    raster = await pipeline
      .png({ quality: pngQuality, compressionLevel: 9, effort: 10 })
      .toBuffer();
  } else {
    raster = await pipeline.jpeg({ quality: jpegQuality, mozjpeg: true }).toBuffer();
  }

  if (raster.length < before) {
    await writeFile(filePath, raster);
  }

  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");
  const webp = await sharp(raster).webp({ quality: webpQuality, effort: 4 }).toBuffer();
  await writeFile(webpPath, webp);

  const after = (await stat(filePath)).size;
  const webpSize = (await stat(webpPath)).size;
  console.log(
    `${rel}: ${(before / 1024).toFixed(0)}KB → raster ${(after / 1024).toFixed(0)}KB, webp ${(webpSize / 1024).toFixed(0)}KB`,
  );
}

const files = await walk(ROOT);
console.log(`Optimizing ${files.length} images under public/images…\n`);
for (const f of files) {
  try {
    await optimizeFile(f);
  } catch (err) {
    console.error(`FAIL ${f}:`, err.message);
  }
}
console.log("\nDone. Store uses .webp via StoreImage when available.");
