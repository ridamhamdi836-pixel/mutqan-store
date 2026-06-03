/**
 * Optional WebP siblings only — never resize or overwrite PNG/JPEG originals.
 * Store serves originals via StoreImage (unoptimized).
 */
import { readdir, readFile, writeFile, stat } from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "images");

/** @type {{ match: (rel: string) => boolean; webpQuality: number }[]} */
const RULES = [
  { match: (rel) => /[/\\]customers[/\\]/.test(rel) || /customer-\d/.test(rel), webpQuality: 90 },
  { match: (rel) => /[/\\]hero[/\\]/.test(rel) || /-hero\.(png|jpe?g)$/i.test(rel), webpQuality: 95 },
  { match: () => true, webpQuality: 92 },
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
  const { webpQuality } = ruleFor(rel);
  const before = (await stat(filePath)).size;
  const input = sharp(await readFile(filePath)).rotate();

  const webpPath = filePath.replace(/\.(png|jpe?g)$/i, ".webp");
  const webp = await input.webp({ quality: webpQuality, effort: 4 }).toBuffer();
  await writeFile(webpPath, webp);

  const webpSize = (await stat(webpPath)).size;
  console.log(
    `${rel}: original ${(before / 1024).toFixed(0)}KB (unchanged), webp ${(webpSize / 1024).toFixed(0)}KB`,
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
console.log("\nDone. Store serves original PNG/JPEG; WebP siblings are optional.");
