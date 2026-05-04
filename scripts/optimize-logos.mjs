import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const CMS_URL = (process.env.API_URL || 'https://cms.matlu.fi').replace(/\/$/, '');
const OUTPUT_DIR = './public/logos/members';
const MANIFEST_PATH = './public/logos/members/manifest.json';

// Max dimensions for marquee logos
const MAX_WIDTH = 180;
const MAX_HEIGHT = 46;

const MEMBERS_QUERY = `
  query MembersQuery {
    members(filters: { enabled: { eq: true } }, sort: "order:asc") {
      documentId
      name
      url
      logo {
        url
        alternativeText
      }
    }
  }
`;

async function fetchMembers() {
  const response = await fetch(`${CMS_URL}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: MEMBERS_QUERY }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch members: ${response.statusText}`);
  }

  const { data } = await response.json();
  return data?.members || [];
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9äöå]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50);
}

async function downloadAndOptimizeLogo(logoUrl, outputName) {
  const fullUrl = logoUrl.startsWith('http') ? logoUrl : `${CMS_URL}${logoUrl}`;

  const response = await fetch(fullUrl);
  if (!response.ok) {
    console.warn(`  [Skip] Failed to download ${fullUrl}: ${response.statusText}`);
    return null;
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  // Resize to fit within MAX_WIDTH x MAX_HEIGHT, maintaining aspect ratio
  const optimized = await sharp(buffer)
    .resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85, effort: 6 })
    .toBuffer();

  const outputPath = path.join(OUTPUT_DIR, `${outputName}.webp`);
  await fs.writeFile(outputPath, optimized);

  const originalSize = buffer.length;
  const optimizedSize = optimized.length;
  const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

  return {
    originalSize,
    optimizedSize,
    savings,
    outputPath: `/logos/members/${outputName}.webp`,
  };
}

async function main() {
  console.log('[Logos] Fetching member data from CMS...');

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const members = await fetchMembers();
  const enabledMembers = members.filter((m) => m.logo?.url);

  console.log(`[Logos] Found ${enabledMembers.length} members with logos`);

  const manifest = {};
  let totalSaved = 0;

  for (const member of enabledMembers) {
    const slug = slugify(member.name);
    console.log(`[Logos] Optimizing: ${member.name}...`);

    const result = await downloadAndOptimizeLogo(member.logo.url, slug);

    if (result) {
      manifest[member.documentId] = {
        name: member.name,
        src: result.outputPath,
        alt: member.logo.alternativeText || member.name,
        href: member.url || '#',
      };
      totalSaved += result.originalSize - result.optimizedSize;
      console.log(
        `  [OK] ${slug}.webp (${(result.originalSize / 1024).toFixed(1)}KB → ${(result.optimizedSize / 1024).toFixed(1)}KB, saved ${result.savings}%)`
      );
    }
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  console.log(`\n[Logos] Optimized ${Object.keys(manifest).length} logos`);
  console.log(`[Logos] Total savings: ${(totalSaved / 1024).toFixed(1)}KB`);
  console.log(`[Logos] Manifest saved to ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error('[Logos] Error:', err);
  process.exit(1);
});
