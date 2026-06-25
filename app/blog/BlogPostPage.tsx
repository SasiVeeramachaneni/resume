import { useEffect, useState, useRef } from 'react';
import { Container, Title, Text, Badge, Group, Button, Anchor, Paper } from '@mantine/core';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import { BlogPost, getBlogPost } from './posts';
import { Header } from '@/components/Heading/Header';
import { usePageMeta } from '@/app/usePageMeta';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const articleRef = useRef<HTMLDivElement>(null);
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (slug) setPost(getBlogPost(slug) ?? null);
  }, [slug]);

  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a');
      if (!a || !a.getAttribute('href')?.startsWith('/')) return;
      e.preventDefault();
      navigate(a.getAttribute('href')!);
    };
    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  }, [navigate, post]);

  usePageMeta(
    post ? `${post.title} | Create Resume Blog` : 'Blog Post | Create Resume',
    post ? post.excerpt : 'Read our blog post for expert resume tips and career advice.',
  );

  if (!post) {
    return (
      <>
        <Header />
        <Container size="md" py="xl">
          <Text c="dimmed">Post not found.</Text>
          <Button component={Link} to="/blog" variant="light" mt="md" leftSection={<IconArrowLeft size={16} />}>
            Back to Blog
          </Button>
        </Container>
      </>
    );
  }

  return (
    <>
      <Header />
      <Container size="md" py="xl">
        <Anchor component={Link} to="/blog" size="sm" c="dimmed">
          <Group gap={4}>
            <IconArrowLeft size={14} />
            <span>Back to Blog</span>
          </Group>
        </Anchor>

        <Title order={1} mt="md">{post.title}</Title>

        <Group gap="xs" mt="sm">
          <Text size="sm" c="dimmed">{post.date}</Text>
          <Text size="sm" c="dimmed">·</Text>
          <Text size="sm" c="dimmed">{post.author}</Text>
          <Text size="sm" c="dimmed">·</Text>
          <Text size="sm" c="dimmed">{post.readTime}</Text>
        </Group>

        <Group gap="xs" mt="sm">
          {post.tags.map(tag => (
            <Badge key={tag} size="sm" variant="light">{tag}</Badge>
          ))}
        </Group>

        <div ref={articleRef} className="blog-article" dangerouslySetInnerHTML={{ __html: post.content }} />

        <style>{`
          .blog-article { font-size: 17px; line-height: 1.7; color: light-dark(#222, #e0e0e0); }

          .blog-article .hero-block { background: light-dark(#f5f7fa, #1a1d23); border-radius: 12px; padding: 28px 24px; margin-bottom: 32px; }
          .blog-article .hero-stat-row { display: flex; gap: 24px; flex-wrap: wrap; justify-content: space-around; }
          .blog-article .hero-stat { text-align: center; }
          .blog-article .hero-stat-num { font-size: 28px; font-weight: 800; color: var(--mantine-color-blue-6); }
          .blog-article .hero-stat-label { font-size: 13px; color: var(--mantine-color-dimmed); margin-top: 2px; }

          .blog-article .prose { max-width: 680px; margin: 0 auto 24px; }
          .blog-article .prose p { margin-bottom: 1.1em; }

          .blog-article .section-head { font-size: 24px; font-weight: 700; margin: 48px 0 16px; padding-bottom: 8px; border-bottom: 2px solid light-dark(#eee, #333); }
          .blog-article .sub-head { font-size: 19px; font-weight: 600; margin: 32px 0 12px; }

          .blog-article .pull-quote { margin: 28px auto; max-width: 600px; text-align: center; padding: 20px 24px; border-left: 3px solid var(--mantine-color-blue-5); background: light-dark(#f8f9fb, #16181d); border-radius: 8px; }
          .blog-article .pull-quote p { font-size: 19px; font-style: italic; font-weight: 500; color: light-dark(#333, #ccc); margin: 0; }

          .blog-article .perception-grid { display: grid; gap: 16px; margin: 20px 0; max-width: 680px; margin-left: auto; margin-right: auto; }
          @media (min-width: 640px) { .blog-article .perception-grid { grid-template-columns: 1fr 1fr; } }
          .blog-article .perception-card { padding: 16px; border-radius: 8px; border: 1px solid light-dark(#e5e7eb, #2d2d2d); }
          .blog-article .perception-card.bad { border-left: 3px solid #ef4444; }
          .blog-article .perception-card.good { border-left: 3px solid #22c55e; }
          .blog-article .pc-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--mantine-color-dimmed); margin-bottom: 6px; }
          .blog-article .pc-copy { font-size: 14px; line-height: 1.5; margin-bottom: 8px; }
          .blog-article .pc-thought { font-size: 13px; font-style: italic; color: var(--mantine-color-dimmed); }

          .blog-article .compare-block { max-width: 560px; margin: 20px auto; padding: 16px 20px; background: light-dark(#fafafa, #15171a); border-radius: 10px; border: 1px solid light-dark(#e5e7eb, #2a2a2a); text-align: center; }
          .blog-article .compare-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
          .blog-article .compare-label.before { color: #ef4444; }
          .blog-article .compare-label.after { color: #22c55e; }
          .blog-article .compare-text { font-size: 15px; line-height: 1.5; margin-bottom: 8px; }
          .blog-article .compare-arrow { font-size: 20px; color: var(--mantine-color-dimmed); margin: 4px 0; }

          .blog-article .insight-list { max-width: 680px; margin: 24px auto; }
          .blog-article .insight-item { display: flex; gap: 16px; margin-bottom: 24px; }
          .blog-article .insight-num { flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background: var(--mantine-color-blue-6); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; }
          .blog-article .insight-body h4 { font-size: 16px; font-weight: 600; margin: 0 0 4px; }
          .blog-article .insight-body p { font-size: 15px; margin: 0; color: var(--mantine-color-dimmed); line-height: 1.6; }

          .blog-article .cta-block { text-align: center; padding: 36px 24px; margin: 48px auto 0; max-width: 520px; background: linear-gradient(135deg, light-dark(#f0f4ff, #141824), light-dark(#e8f0fe, #181d2a)); border-radius: 12px; border: 1px solid light-dark(#d0d9f0, #2a2f40); }
          .blog-article .cta-block h3 { font-size: 20px; font-weight: 700; margin: 0 0 8px; }
          .blog-article .cta-block p { font-size: 14px; color: var(--mantine-color-dimmed); margin: 0 0 16px; }
          .blog-article .cta-btn { display: inline-block; padding: 10px 24px; background: var(--mantine-color-blue-6); color: #fff; border-radius: 8px; font-weight: 600; font-size: 15px; text-decoration: none; }
          .blog-article .cta-btn:hover { background: var(--mantine-color-blue-7); }
        `}</style>
      </Container>
    </>
  );
}
