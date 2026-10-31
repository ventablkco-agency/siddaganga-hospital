import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const sourceRoot = path.resolve('public/assets');
const outputRoot = path.resolve('public/optimized-assets');
const raster = /\.(?:png|jpe?g|webp)$/i;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (raster.test(entry.name)) files.push(fullPath);
  }
  return files;
}

const files = await walk(sourceRoot);
for (const input of files) {
  const relative = path.relative(sourceRoot, input);
  const outputRelative = relative.replace(/\.(?:png|jpe?g|webp)$/i, '.webp');
  const output = path.join(outputRoot, path.dirname(outputRelative), path.basename(outputRelative));
  const folder = relative.split(path.sep)[0];
  const maxWidth = folder === 'hero' ? 1200 : folder === 'gallery' ? 1100 : folder === 'doctors' ? 720 : 640;
  await mkdir(path.dirname(output), { recursive: true });
  await sharp(input)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 76, effort: 5, smartSubsample: true })
    .toFile(output);
}
console.log(`Optimized ${files.length} images into public/optimized-assets`);
