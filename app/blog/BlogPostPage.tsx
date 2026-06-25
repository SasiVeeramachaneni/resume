import { useEffect, useState } from 'react';
import { Container, Title, Text, Badge, Group, Button, Anchor, Paper } from '@mantine/core';
import { useParams, Link } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import { BlogPost, getBlogPost } from './posts';
import { Header } from '@/components/Heading/Header';
import { usePageMeta } from '@/app/usePageMeta';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (slug) setPost(getBlogPost(slug) ?? null);
  }, [slug]);

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

        <Paper mt="lg" p="lg" withBorder>
          <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </Paper>

        <style>{`
          .blog-content h2 { margin-top: 1.5rem; margin-bottom: 0.5rem; font-size: 1.25rem; }
          .blog-content p { margin-bottom: 0.75rem; line-height: 1.7; }
          .blog-content ul { padding-left: 1.5rem; margin-bottom: 0.75rem; }
          .blog-content li { margin-bottom: 0.25rem; line-height: 1.6; }
        `}</style>
      </Container>
    </>
  );
}
