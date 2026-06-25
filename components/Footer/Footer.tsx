import { Anchor, Container, Group, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import classes from './Footer.module.css';

export function Footer() {
  return (
    <footer className={classes.footer}>
      <Container>
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            &copy; {new Date().getFullYear()} Resume Builder
          </Text>
          <Group gap="md">
            <Anchor component={Link} to="/blog" size="sm">Blog</Anchor>
            <Anchor component={Link} to="/tech" size="sm">Tech Stack</Anchor>
            <Anchor component={Link} to="/about" size="sm">About</Anchor>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
