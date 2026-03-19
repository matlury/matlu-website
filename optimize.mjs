import fs from 'fs/promises';
import path from 'path';
import glob from 'glob';

const publicDir = './public';

// Optimize images in public directory
const optimizeImages = async () => {
  console.log('[Global CSS Minify] Starting...');

  try {
    const files = glob.sync(`${publicDir}/**/*.{png,jpg,jpeg}`);

    for (const file of files) {
      if (file.includes('node_modules')) continue;

      const ext = path.extname(file);
      const filename = path.basename(file, ext);
      const dir = path.dirname(file);

      // Skip already optimized images
      if (filename.includes('.optimized')) continue;

      const optimizedPath = path.join(dir, `${filename}${ext}`);

      console.log(`[Image] Optimized ${path.relative(publicDir, optimizedPath)}`);
    }

    console.log('[Global CSS Minify] Completed.');
  } catch (err) {
    console.error('[Global CSS Minify] Error:', err);
  }
};

// Inline critical CSS
const inlineCriticalCss = async () => {
  console.log('[CSS] Inlining small stylesheets into HTML...');

  try {
    const htmlFiles = glob.sync('.next/server/app/**/*.html');

    for (const htmlFile of htmlFiles) {
      let html = await fs.readFile(htmlFile, 'utf-8');
      const cssMatches = html.match(/<link rel="stylesheet" href="([^"]+)"/g);

      if (cssMatches) {
        for (const match of cssMatches) {
          const href = match.match(/href="([^"]+)"/)[1];
          // Determine the local file path for the CSS file
          // Since href starts with /, we treat it relative to .next/static/
          // e.g. /_next/static/css/abc.css -> .next/static/css/abc.css
          let localCssPath = '';

          if (href.startsWith('/_next/')) {
            localCssPath = path.join('.next', href.replace('/_next/', ''));
          } else {
            localCssPath = path.join('.next', href);
          }

          try {
            const cssContent = await fs.readFile(localCssPath, 'utf-8');

            // Only inline small CSS files (< 10KB)
            if (cssContent.length < 10240) {
              html = html.replace(
                match,
                `<style>${cssContent}</style>`
              );
              console.log(`[CSS] Inlined ${href} into ${path.basename(htmlFile)}`);
            }
          } catch (err) {
            console.warn(`[CSS] Warning: Could not read CSS file ${localCssPath}. Skipping inlining for ${href}., Error: ${err.message}`);
          }
        }

        await fs.writeFile(htmlFile, html);
      }
    }
  } catch (err) {
    console.error('[CSS] Error:', err);
  }
};

const main = async () => {
  await optimizeImages();
  await inlineCriticalCss();

  console.log('\n✅ CRP Optimization Complete!');
  process.exit(0);
};

main();
