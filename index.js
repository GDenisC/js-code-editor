import esbuild from 'esbuild';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile: 'builds/latest.js',
    banner: {
        'js': `/* ${pkg.displayName} version: ${pkg.version} by ${pkg.author}\n   ${pkg.license} license */`
    },
    minify: true,
    platform: 'browser',
    format: 'iife',
    globalName: 'editor',
    target: ['chrome58', 'firefox57', 'safari11', 'edge16'],
    define: { STYLES: `\"${fs.readFileSync('styles.css', 'utf-8').replace(/[\n\r]+/g, '')}\"` }
}).then(() => {
    console.log('Build complete');
    fs.writeFileSync(`builds/${pkg.version}.js`, fs.readFileSync('builds/latest.js'));
    console.log(`Build version: ${pkg.version}`);
});