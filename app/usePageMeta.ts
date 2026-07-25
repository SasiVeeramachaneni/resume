import { useEffect } from 'react';

function setMeta(name: string, content: string) {
  const attr = name.startsWith('og:') || name.startsWith('fb:') ? 'property' : 'name';
  const selector = attr === 'property' ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attr, name);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

export function usePageMeta(title: string, description: string, image?: string, noIndex: boolean = false) {
  useEffect(() => {
    document.title = title;
    
    // Core SEO metas
    setMeta('description', description);
    
    // Open Graph
    setMeta('og:title', title);
    setMeta('og:description', description);
    setMeta('og:type', 'website');
    setMeta('og:url', window.location.href);
    
    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    
    // Image handling for OG & Twitter
    const defaultImage = 'https://createresume.in/og-image.png'; // standard branding image
    const finalImage = image || defaultImage;
    setMeta('og:image', finalImage);
    setMeta('twitter:image', finalImage);
    
    // Canonical link tag
    let canonicalLink = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    // Set canonical link safely
    canonicalLink.href = window.location.protocol + '//' + window.location.host + window.location.pathname;

    // Robots meta tag
    if (noIndex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow');
    }
  }, [title, description, image, noIndex]);
}
