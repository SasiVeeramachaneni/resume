import { useEffect, useState } from 'react';
import { Container, Title, Text, SimpleGrid, Card, Badge, Group, Button, Center, Loader } from '@mantine/core';
import { Link } from 'react-router-dom';
import { BlogPost, getBlogPosts } from './posts';
import { Header } from '@/components/Heading/Header';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPosts(getBlogPosts());
    setLoading(false);
  }, []);

  return (
    <>
      <Header />
      <Container size="lg" py="xl">
        <Title order={1} mb="xs">Blog</Title>
        <Text c="dimmed" mb="lg">Tips, guides, and insights to build your best resume</Text>

        {loading ? (
          <Center py="xl"><Loader /></Center>
        ) : posts.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">No posts yet.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {posts.map(post => (
              <Card key={post.slug} shadow="sm" padding="lg" radius="md" withBorder>
                <Group gap="xs" mb="xs">
                  {post.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} size="sm" variant="light">{tag}</Badge>
                  ))}
                </Group>
                <Title order={3} size="h4" mb="xs">{post.title}</Title>
                <Text size="sm" c="dimmed" mb="md" lineClamp={3}>{post.excerpt}</Text>
                <Group justify="space-between" align="center">
                  <Text size="xs" c="dimmed">{post.date} · {post.readTime}</Text>
                  <Button component={Link} to={`/blog/${post.slug}`} variant="light" size="xs">
                    Read more
                  </Button>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </>
  );
}
