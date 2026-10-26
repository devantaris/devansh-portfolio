/**
 * Post-build fix for static export.
 *
 * 1. Ensures out/index.html is a direct copy of public/blueprint.html so the root
 *    URL directly serves the Blueprint single-page experience.
 * 2. Rewrites /_next/ references if building with a sub-path basePath.
 */
import { readdirSync, readFileSync, writeFileSync, statSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const outDir = join(process.cwd(), 'out');
const blueprintSrc = join(process.cwd(), 'public', 'blueprint.html');

if (existsSync(blueprintSrc) && existsSync(outDir)) {
    copyFileSync(blueprintSrc, join(outDir, 'index.html'));
    console.log('fix-basepath: copied blueprint.html -> out/index.html');
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
if (!basePath) {
    console.log('fix-basepath: no basePath set, skipping assetPrefix rewrite');
    process.exit(0);
}

let filesFixed = 0;

function walk(dir) {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) { walk(p); continue; }
        if (!/\.(html|txt|xml|js)$/.test(name)) continue;
        const content = readFileSync(p, 'utf8');
        const fixed = content
            .replace(/(["'(])\/_next\//g, `$1${basePath}/_next/`)
            .replace(/(["'(])\/images\//g, `$1${basePath}/images/`)
            .replace(/(["'(])\/resume\.pdf/g, `$1${basePath}/resume.pdf`);
        if (fixed !== content) {
            writeFileSync(p, fixed);
            filesFixed++;
        }
    }
}

walk(outDir);
console.log(`fix-basepath: rewrote ${basePath}/_next in ${filesFixed} files`);
