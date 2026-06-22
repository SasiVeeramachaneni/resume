import { Container, Title, Text, Badge, Group, Stack } from '@mantine/core';
import { Header } from '@/components/Heading/Header';

const techStack = [
  { name: 'React 19', description: 'UI component library for building the interface' },
  { name: 'TypeScript', description: 'Type-safe JavaScript for reliable code' },
  { name: 'Vite', description: 'Fast build tool and dev server' },
  { name: 'React Router', description: 'Client-side routing between pages' },
  { name: 'Mantine v9', description: 'Component library with theming and dark mode' },
  { name: 'React-pdf', description: 'PDF generation from React components' },
  { name: 'Tabler Icons', description: 'Icon library for UI elements' },
  { name: 'PostCSS', description: 'CSS processing with Mantine preset' },
  { name: 'Storybook', description: 'Component development and documentation' },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <Container size="sm" py="xl">
        <Stack gap="lg">
          <Title order={1}>About</Title>
          <Text c="dimmed">
            This resume builder is built with a modern React stack,
            designed for type safety, performance, and developer experience.
          </Text>

          <Title order={2} size="h3">Tech Stack</Title>

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
