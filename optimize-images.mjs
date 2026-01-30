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

        // If the image is the logo or just generally oversized
        const isLogo = file.toLowerCase().includes('matlu');
        const targetWidth = isLogo ? 560 : 800; // 560px is exactly 2x the 280px display width

        if (metadata.width > targetWidth || isLogo) {
          console.log(`Optimizing ${file} (${metadata.width}x${metadata.height}) -> Target width: ${targetWidth}`);
          
          await sharp(buffer)
            .resize(targetWidth, null, { withoutEnlargement: true })
            .png({ 
              quality: 70, 
              palette: true, 
              compressionLevel: 9,
              effort: 10 
            })
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
