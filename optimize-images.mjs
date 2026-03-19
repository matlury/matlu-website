import { readdir } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';

const directory = './public/img';

async function optimizeImages() {
  try {
    const files = await readdir(directory);
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg')) {
        const filePath = join(directory, file);
        const image = sharp(filePath);
        const metadata = await image.metadata();

        if (metadata.width && metadata.width > 1200) {
          await image.resize(1200).toFile(filePath.replace(/(\.[\w\d_-]+)$/i, '.optimized$1'));
          console.log(`Optimized: ${file}`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

optimizeImages();
