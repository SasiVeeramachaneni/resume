import { Image, Container, Title, Button, Group, Text, List, ThemeIcon, rem, ListItem } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';
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
          <Text c="dimmed" mt="md">
          Create a standout resume effortlessly. Highlight your skills, and showcase your achievements. Whether you’re a seasoned professional or just starting out, our tools help you craft a resume that gets noticed. Start building your future today!
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

          <Group mt={30}>
            <Button component="a" href="/resume" radius="xl" size="md" className={classes.control}>
              Create your resume
            </Button> <Text c="dimmed" size="sm">No sign-up required</Text>
          </Group>
        </div>
        <Image src={image.src} className={classes.image} />
      </div>
    </Container>
  );
}