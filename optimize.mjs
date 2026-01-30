import { spawn } from 'child_process';

function run(command, args, name) {
  return new Promise((resolve, reject) => {
    console.log(`[${name}] Starting...`);
    const proc = spawn(command, args, { stdio: 'inherit', shell: true });
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`[${name}] failed with code ${code}`));
      } else {
        console.log(`[${name}] Completed.`);
        resolve();
      }
    });
  });
}

async function main() {
  try {
    console.log('\n--- Starting Parallel Optimizations ---');

    // Run optimizations in parallel
    await Promise.all([
      run('npx', ['cleancss', '-O2', '-o', 'out/css/all.css', 'public/css/all.css'], 'CSS Minification'),
      run('node', ['optimize-images.mjs'], 'Image Optimization')
    ]);

    console.log('\n✅ All optimizations complete!');
  } catch (err) {
    console.error(`\n❌ Error: ${err.message}`);
    process.exit(1);
  }
}

main();
