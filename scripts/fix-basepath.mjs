/**
 * Post-build fix for GitHub Pages static export.
 *
 * Next.js (turbopack) emits bootstrap <script>/<link> tags in the exported
 * HTML without the `assetPrefix` basePath, so on a project site
 * (username.github.io/<repo>/) every chunk 404s and the page never hydrates.
 * This script rewrites /_next/ references in the exported HTML/RSC files to
 * include the basePath. No-op when not building for GitHub Pages.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
if (!basePath) {
    console.log('fix-basepath: no basePath set, skipping');
    process.exit(0);
}

const outDir = join(process.cwd(), 'out');
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
