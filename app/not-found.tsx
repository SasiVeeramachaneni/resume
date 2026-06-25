import { Container, Title, Text, Group, Button } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Heading/Header';
import { usePageMeta } from '@/app/usePageMeta';

export default function NotFoundPage() {
  usePageMeta(
    'Page Not Found (404) | Create Resume',
    'The page you are looking for does not exist. Browse our resume builder, blog, or learn more about us.',
  );
  return (
    <>
      <Header />
      <Container size="md" py={80} ta="center">
        <Title order={1} size={60} c="dimmed">404</Title>
        <Title order={2} mt="md">Page not found</Title>
        <Text c="dimmed" mt="sm" maw={400} mx="auto">
          The page you are looking for does not exist or has been moved.
        </Text>
        <Group justify="center" mt="xl">
          <Button component={Link} to="/resume">Create Resume</Button>
          <Button component={Link} to="/blog" variant="outline">Blog</Button>
          <Button component={Link} to="/about" variant="subtle">About</Button>
        </Group>
      </Container>
    </>
  );
}
