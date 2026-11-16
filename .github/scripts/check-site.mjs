// Validates the static site before it can be merged or deployed.
//  1. Every file that gets published exists.
//  2. app.js has valid JavaScript syntax.
//  3. Every local file referenced from index.html (src/href/poster) exists.
// Run from the repo root:  node .github/scripts/check-site.mjs
import { existsSync, readFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const errors = [];

// 1. Required files
for (const f of ['index.html', 'styles.css', 'app.js']) {
    if (!existsSync(f) || statSync(f).size === 0) errors.push(`Missing or empty required file: ${f}`);
}
if (!existsSync('assets') || !statSync('assets').isDirectory()) errors.push('Missing directory: assets/');

// 2. JavaScript syntax
if (existsSync('app.js')) {
    try {
        execFileSync(process.execPath, ['--check', 'app.js'], { stdio: 'pipe' });
    } catch (e) {
        errors.push(`app.js syntax error:\n${e.stderr?.toString() ?? e.message}`);
    }
}

// 3. Local references in index.html
if (existsSync('index.html')) {
    const html = readFileSync('index.html', 'utf8');
    const refs = [...html.matchAll(/\b(?:src|href|poster)="([^"]+)"/g)].map((m) => m[1]);
    for (const ref of new Set(refs)) {
        if (/^(#|https?:|\/\/|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;
        const local = ref.split(/[?#]/)[0];
        if (!local) continue;
        if (!existsSync(local)) errors.push(`index.html references a missing file: ${ref}`);
    }
}

if (errors.length) {
    console.error('Site validation FAILED:\n - ' + errors.join('\n - '));
    process.exit(1);
}
console.log('Site validation passed.');
