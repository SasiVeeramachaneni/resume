import { useEffect } from 'react';

function setMeta(name: string, content: string) {
  const attr = name.startsWith('og:') ? 'property' : 'name';
  const selector = attr === 'property' ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, name);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

export function usePageMeta(title: string, description: string, image?: string) {
  useEffect(() => {
    document.title = title;
    setMeta('description', description);
    setMeta('og:title', title);
    setMeta('og:description', description);
    if (image) setMeta('og:image', image);
  }, [title, description, image]);
}
