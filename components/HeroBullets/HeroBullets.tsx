import {
  Image,
  Container,
  Title,
  Button,
  Group,
  Text,
  List,
  ThemeIcon,
  rem,
  ListItem,
  Stack,
} from "@mantine/core";
import { IconCheck, IconBook2, IconBrandGithub } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { GITHUB_REPO_URL } from "@/config";
import image from "./resume.webp";
import classes from "./HeroBullets.module.css";

export function HeroBullets() {
  return (
    <Container size="lg">
      <div className={classes.inner}>
        <div className={classes.content}>
          <Title className={classes.title}>
            Create{" "}
            <span className={classes.highlight}>
              <Text
                inherit
                variant="gradient"
                component="span"
                gradient={{ from: "blue", to: "yellow" }}
              >
                Resume
              </Text>
            </span>
          </Title>
          <Text size="lg" fw={500} mt="sm">
            Expert tips and strategies for your best resume
          </Text>
          <Text c="dimmed" mt="sm">
            Create a standout resume effortlessly. Highlight your skills, and
            showcase your achievements. Whether you're a seasoned professional
            or just starting out, our tools help you craft a resume that gets
            noticed. Start building your future today!
          </Text>

          <List
            mt={30}
            spacing="sm"
            size="md"
            icon={
              <ThemeIcon size={25} radius="xl">
                <IconCheck
                  style={{ width: rem(18), height: rem(18) }}
                  stroke={1.5}
                />
              </ThemeIcon>
            }
          >
            <ListItem>
              <b>3 templates</b> – Professional, classic, and sidebar-photo
              layouts
            </ListItem>
            <ListItem>
              <b>No sign-up required</b> – Build and download your professional
              PDF instantly
            </ListItem>
            <ListItem>
              <b>Focus</b> – Clean, simple editor interface to focus on your
              content
            </ListItem>
          </List>

          <Group mt={30} className={classes.buttons} align="flex-start">
            <Button
              component={Link}
              to="/resume"
              radius="xl"
              size="md"
              className={classes.control}
            >
              Create your resume
            </Button>
            <Button
              component={Link}
              to="/blog"
              radius="xl"
              size="md"
              variant="outline"
              className={classes.control}
              leftSection={<IconBook2 size={18} />}
            >
              Blogs
            </Button>
            <Stack gap={4} className={classes.control}>
              <Button
                component="a"
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                radius="xl"
                size="md"
                variant="light"
                color="gray"
                leftSection={<IconBrandGithub size={18} />}
              >
                GitHub
              </Button>
              <Text size="xs" c="dimmed" ta="center">
                Enhance as you like
              </Text>
            </Stack>
          </Group>
          <Text
            c="blue.6"
            fw={700}
            size="md"
            mt="md"
            className={classes.signupText}
          >
            ⚡ No sign-up required — start building your resume instantly!
          </Text>
        </div>
        <Image
          src={image}
          className={classes.image}
          alt="Resume builder preview showing a professional resume template"
        />
      </div>
    </Container>
  );
}
