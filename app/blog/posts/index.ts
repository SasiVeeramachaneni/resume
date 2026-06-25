import { post as tips10 } from './10-tips-for-standout-resume';
import { post as perfectFormat } from './perfect-resume-format';
import { post as tailorIndustries } from './tailor-resume-different-industries';
import { post as rewrote7Times } from './i-rewrote-my-resume-7-times';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
}

export const defaultPosts: BlogPost[] = [
  tips10,
  perfectFormat,
  tailorIndustries,
  rewrote7Times,
];

const STORAGE_KEY = 'createresume_blog_posts';

export function getBlogPosts(): BlogPost[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  const customPosts: BlogPost[] = stored ? JSON.parse(stored) : [];
  const slugs = new Set<string>();
  const all: BlogPost[] = [];

  for (const p of defaultPosts) {
    if (!slugs.has(p.slug)) { all.push(p); slugs.add(p.slug); }
  }
  for (const p of customPosts) {
    if (!slugs.has(p.slug)) { all.push(p); slugs.add(p.slug); }
  }

  return all;
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find(p => p.slug === slug);
}

export function saveBlogPost(post: BlogPost): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  const customPosts: BlogPost[] = stored ? JSON.parse(stored) : [];
  const idx = customPosts.findIndex(p => p.slug === post.slug);
  if (idx >= 0) customPosts[idx] = post;
  else customPosts.push(post);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customPosts));
}

export function deleteBlogPost(slug: string): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  const customPosts: BlogPost[] = stored ? JSON.parse(stored) : [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customPosts.filter(p => p.slug !== slug)));
}

export function isCustomPost(slug: string): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;
  const customPosts: BlogPost[] = JSON.parse(stored);
  return customPosts.some(p => p.slug === slug);
}
