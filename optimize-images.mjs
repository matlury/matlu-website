import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const MEDIA_DIR = 'out/_next/static/media';

async function optimize() {
  try {
    const files = await fs.readdir(MEDIA_DIR);
    
    for (const file of files) {
      if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
        const filePath = path.join(MEDIA_DIR, file);
        const buffer = await fs.readFile(filePath);
        const metadata = await sharp(buffer).metadata();

        // If the image is the logo (based on the Lighthouse report size) or just generally huge
        if (metadata.width > 800) {
          console.log(`Optimizing ${file} (${metadata.width}x${metadata.height})`);
          
          await sharp(buffer)
            .resize(800, null, { withoutEnlargement: true }) // Limit to 800px width
            .png({ quality: 80, palette: true }) // Compress PNG
            .toFile(filePath + '.tmp');
          
          await fs.rename(filePath + '.tmp', filePath);
          console.log(`Finished ${file}`);
        }
      }
    }
  } catch (err) {
    console.error('Error optimizing images:', err.message);
  }
}

optimize();
