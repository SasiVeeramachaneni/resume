import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const SITE_URL = 'https://createresume.in';
const now = new Date().toISOString().split('T')[0];

// read each post file and extract its slug field
const postsDir = resolve(root, 'app/blog/posts');
const postFiles = readdirSync(postsDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
const fileSlugs = postFiles.map(f => {
  const src = readFileSync(resolve(postsDir, f), 'utf-8');
  const m = src.match(/slug:\s*'([^']+)'/);
  return m ? m[1] : null;
}).filter(Boolean);

// read custom post slugs from JSON (added via editor)
const customJsonPath = resolve(root, 'app/blog/custom-posts.json');
let customSlugs = [];
if (existsSync(customJsonPath)) {
  try {
    customSlugs = JSON.parse(readFileSync(customJsonPath, 'utf-8'));
  } catch { /* ignore malformed JSON */ }
}

const slugs = [...fileSlugs, ...customSlugs];

function buildXml(urls) {
  const items = urls.map(
    p => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</urlset>\n`;
}

const mainPages = [
  { loc: '/', priority: '1.0', changefreq: 'monthly' },
  { loc: '/resume', priority: '0.9', changefreq: 'monthly' },
  { loc: '/about', priority: '0.5', changefreq: 'monthly' },
  { loc: '/tech', priority: '0.5', changefreq: 'monthly' },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly' },
];

const blogPages = slugs.map(slug => ({
  loc: `/blog/${slug}`,
  priority: '0.7',
  changefreq: 'monthly',
}));

const sitemapsDir = resolve(root, 'public', 'sitemaps');
if (!existsSync(sitemapsDir)) mkdirSync(sitemapsDir, { recursive: true });

writeFileSync(resolve(sitemapsDir, 'sitemap.xml'), buildXml(mainPages), 'utf-8');
writeFileSync(resolve(sitemapsDir, 'blogs.xml'), buildXml(blogPages), 'utf-8');

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemaps/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemaps/blogs.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>\n`;

writeFileSync(resolve(root, 'public', 'sitemap.xml'), indexXml, 'utf-8');

const total = mainPages.length + blogPages.length;
console.log(`sitemap index → public/sitemap.xml`);
console.log(`main pages  → public/sitemaps/sitemap.xml (${mainPages.length} URLs)`);
console.log(`blog posts  → public/sitemaps/blogs.xml (${blogPages.length} URLs)`);
console.log(`total: ${total} URLs`);
