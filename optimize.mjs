import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { glob } from 'glob';

const MEDIA_DIR = 'out/_next/static/media';
const OUT_DIR = 'out';

function run(command, args, name) {
  return new Promise((resolve, reject) => {
    console.log(`[${name}] Starting...`);
    const proc = spawn(command, args, { stdio: 'inherit', shell: true });
    proc.on('close', (code) => {
      if (code !== 0) reject(new Error(`[${name}] failed`));
      else {
        console.log(`[${name}] Completed.`);
        resolve();
      }
    });
  });
}

async function optimizeImages() {
  const files = await fs.readdir(MEDIA_DIR).catch(() => []);
  for (const file of files) {
    if (file.endsWith('.png') || file.endsWith('.jpg')) {
      const filePath = path.join(MEDIA_DIR, file);
      const buffer = await fs.readFile(filePath);
      const metadata = await sharp(buffer).metadata();
      const isLogo = file.toLowerCase().includes('matlu');
      const targetWidth = isLogo ? 560 : 800;

      if (metadata.width > targetWidth || isLogo) {
        await sharp(buffer)
          .resize(targetWidth, null, { withoutEnlargement: true })
          .png({ quality: 70, palette: true, effort: 10 })
          .toFile(filePath + '.tmp');
        await fs.rename(filePath + '.tmp', filePath);
        console.log(`[Image] Optimized ${file}`);
      }
    }
  }
}

async function inlineCSS() {
  console.log('[CSS] Inlining small stylesheets into HTML...');
  const htmlFiles = await glob('out/**/*.html');
  
  for (const htmlPath of htmlFiles) {
    let html = await fs.readFile(htmlPath, 'utf8');
    
    // Find Next.js CSS links safely without matching across tags
    const cssRegex = /<link[^>]*?rel="stylesheet"[^>]*?href="(\/_next\/static\/(?:css|chunks)\/.*?\.css)"[^>]*?>/g;
    let match;
    const matches = [];
    
    while ((match = cssRegex.exec(html)) !== null) {
      matches.push({ fullTag: match[0], href: match[1] });
    }

    for (const { fullTag, href } of matches) {
      const cssPath = path.join(OUT_DIR, href);
      try {
        let cssContent = await fs.readFile(cssPath, 'utf8');
        
        // Fix relative paths (e.g., url(../media/...) or url(../../media/...))
        cssContent = cssContent.replace(/url\(\.\.?\/\.\.?\/media\//g, 'url(/_next/static/media/');
        cssContent = cssContent.replace(/url\(\.\.\/media\//g, 'url(/_next/static/media/');
        
        // Only inline if it's small (under 10KB) to avoid bloating HTML too much
        if (cssContent.length < 10000) {
          // Use a function for replacement to avoid special character issues ($&)
          html = html.split(fullTag).join(`<style>${cssContent}</style>`);
          console.log(`[CSS] Inlined ${href} into ${path.relative(OUT_DIR, htmlPath)}`);
        }
      } catch (e) {
        console.warn(`[CSS] Could not read ${cssPath}`);
      }
    }
    
    await fs.writeFile(htmlPath, html);
  }
}

async function main() {
  try {
    // Parallel tasks
    await Promise.all([
      run('npx', ['cleancss', '-O2', '-o', 'out/css/all.css', 'public/css/all.css'], 'Global CSS Minify'),
      optimizeImages()
    ]);
    
    // Inline CSS must happen after Next.js finishes writing HTML (which is now)
    await inlineCSS();

    console.log('\n✅ CRP Optimization Complete!');
  } catch (err) {
    console.error(`\n❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();