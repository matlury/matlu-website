import fs from 'fs/promises';
import path from 'path';
import { globSync } from 'glob';

// Inline critical CSS
const inlineCriticalCss = async () => {
  console.log('[CSS] Inlining small stylesheets into HTML...');

  try {
    // Target the static export output directory
    const htmlFiles = globSync('./out/**/*.html');

    for (const htmlFile of htmlFiles) {
      let html = await fs.readFile(htmlFile, 'utf-8');
      // Match the full <link> tag including trailing attributes and self-closing />
      const cssRegex = /<link rel="stylesheet" href="([^"]+)"[^>]*\/>/g;
      const cssMatches = html.match(cssRegex);

      if (cssMatches) {
        for (const match of cssMatches) {
          const href = match.match(/href="([^"]+)"/)[1];
          // Determine the local file path for the CSS file
          let localCssPath = '';

          if (href.startsWith('/_next/')) {
            localCssPath = path.join('.next', href.replace('/_next/', ''));
          } else {
            localCssPath = path.join('.next', href);
          }

          try {
            const cssContent = await fs.readFile(localCssPath, 'utf-8');

            // Skip CSS files with relative font/media paths (../media/) - these break when inlined
            if (cssContent.includes('../media/') || cssContent.includes('url(')) {
              console.log(`[CSS] Skipping ${href} (contains relative asset paths)`);
              continue;
            }

            // Only inline small CSS files (< 12KB)
            if (cssContent.length < 12288) {
              html = html.replace(
                match,
                `<style>${cssContent}</style>`
              );
              console.log(`[CSS] Inlined ${href} into ${path.basename(htmlFile)}`);
            }
          } catch (err) {
            console.warn(`[CSS] Warning: Could not read CSS file ${localCssPath}. Skipping inlining for ${href}. Error: ${err.message}`);
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
  await inlineCriticalCss();

  console.log('\n✅ CRP Optimization Complete!');
  process.exit(0);
};

main();
