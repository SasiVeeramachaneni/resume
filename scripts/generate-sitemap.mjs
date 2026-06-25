import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const SITE_URL = 'https://createresume.in';

const postsPath = resolve(root, 'app/blog/posts.ts');
const source = readFileSync(postsPath, 'utf-8');
const slugRegex = /slug:\s*'([^']+)'/g;
const slugs = [];
let match;
while ((match = slugRegex.exec(source)) !== null) {
  slugs.push(match[1]);
}

const pages = [
  { loc: '/', priority: '1.0', changefreq: 'monthly' },
  { loc: '/resume', priority: '0.9', changefreq: 'monthly' },
  { loc: '/about', priority: '0.5', changefreq: 'monthly' },
  { loc: '/tech', priority: '0.5', changefreq: 'monthly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
  ...slugs.map(slug => ({
    loc: `/blog/${slug}`,
    priority: '0.7',
    changefreq: 'monthly',
  })),
];

const now = new Date().toISOString().split('T')[0];
const urls = pages.map(
  p => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
).join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const outDir = resolve(root, 'public');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'sitemap.xml'), sitemap, 'utf-8');

console.log(`sitemap.xml generated at public/sitemap.xml with ${pages.length} URLs`);
