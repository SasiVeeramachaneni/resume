import { Container, Title, Text, Badge, Group, Stack } from '@mantine/core';
import { Header } from '@/components/Heading/Header';
import { usePageMeta } from '@/app/usePageMeta';

const techStack = [
  { name: 'React 19', description: 'UI library for building the interface' },
  { name: 'TypeScript', description: 'Type-safe JavaScript for reliable code' },
  { name: 'Vite', description: 'Fast build tool and dev server' },
  { name: 'React Router', description: 'Client-side routing between pages' },
  { name: 'Mantine v9', description: 'Component library with theming and dark mode support' },
  { name: 'React-pdf', description: 'PDF generation from React components' },
  { name: 'TipTap', description: 'Rich text editor for authoring blog posts' },
  { name: 'Tabler Icons', description: 'Icon library for UI elements' },
  { name: 'PostCSS', description: 'CSS processing with Mantine preset' },
  { name: 'Storybook', description: 'Component development and documentation' },
  { name: 'Jest', description: 'Testing framework for unit and integration tests' },
];

export default function TechPage() {
  usePageMeta(
    'Tech Stack - Create Resume | Built With React & TypeScript',
    'Discover the modern web technologies powering Create Resume. React 19, TypeScript, Mantine v9, Vite, and more.',
  );
  return (
    <>
      <Header />
      <Container size="sm" py="xl">
        <Stack gap="lg">
          <Title order={1}>Tech Stack</Title>
          <Text c="dimmed">
            This resume builder is built with a modern React stack,
            designed for type safety, performance, and developer experience.
          </Text>

          <Stack gap="sm">
            {techStack.map((item) => (
              <Group key={item.name} gap="sm">
                <Badge variant="light" size="lg">{item.name}</Badge>
                <Text size="sm">{item.description}</Text>
              </Group>
            ))}
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
