import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem, ListItem } from '@mantine/core';
import { IconCheck, IconBook2 } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import image from './resume.webp';
import classes from './HeroBullets.module.css';

export function HeroBullets() {
  return (
    <Container size="lg">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Create <span className={classes.highlight}>
        <Text inherit variant="gradient" component="span" gradient={{ from: 'blue', to: 'yellow' }}>
          Resume
        </Text></span>
          </Title>
          <Text size="lg" fw={500} mt="sm">
            Expert tips and strategies for your best resume
          </Text>
          <Text c="dimmed" mt="sm">
          Create a standout resume effortlessly. Highlight your skills, and showcase your achievements. Whether you're a seasoned professional or just starting out, our tools help you craft a resume that gets noticed. Start building your future today!
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="md"
            icon={
              <ThemeIcon size={25} radius="xl">
                <IconCheck style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ThemeIcon>
            }
          >
            <ListItem>
              <b>2 templates</b> – Supporting professionals and freshers
            </ListItem>
            <ListItem>
              <b>Edit anytime</b> – Edit your resume any time
            </ListItem>
            <ListItem>
              <b>Focus</b> – Clean and simple interface
            </ListItem>
          </List>

          <Group mt={30} className={classes.buttons}>
            <Button component={Link} to="/resume" radius="xl" size="md" className={classes.control}>
              Create your resume
            </Button>
            <Button component={Link} to="/blog" radius="xl" size="md" variant="outline" className={classes.control} leftSection={<IconBook2 size={18} />}>
              Blogs
            </Button>
          </Group>
          <Text c="dimmed" size="sm" mt="sm" className={classes.signupText}>No sign-up required</Text>
        </div>
        <Image src={image} className={classes.image} />
      </div>
    </Container>
  );
}