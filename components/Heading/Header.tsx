import { Group, Button, Box, ActionIcon, Tooltip } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconBook2, IconFileText, IconBrandGithub } from "@tabler/icons-react";
import classes from "./Header.module.css";
import { CreateResumeLogo } from "../CreateResumeLogo/CreateResumeLogo";
import { GITHUB_REPO_LABEL, GITHUB_REPO_URL } from "@/config";

export function Header() {
  return (
    <Box pb={0}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <CreateResumeLogo />
          <Group gap="sm" visibleFrom="sm">
            <Button
              component={Link}
              to="/blog"
              variant="subtle"
              leftSection={<IconBook2 size={16} />}
            >
              Blog
            </Button>
            <Button
              component={Link}
              to="/resume"
              leftSection={<IconFileText size={16} />}
            >
              Create Resume
            </Button>
            <Tooltip
              label={`Star on GitHub · ${GITHUB_REPO_LABEL}`}
              position="bottom"
            >
              <ActionIcon
                component="a"
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                size="lg"
                aria-label="GitHub repository"
                color="gray"
              >
                <IconBrandGithub size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>

          {/* GitHub icon always available, even on small screens */}
          <Tooltip label={`GitHub · ${GITHUB_REPO_LABEL}`} position="bottom">
            <ActionIcon
              component="a"
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="subtle"
              size="lg"
              aria-label="GitHub repository"
              color="gray"
              hiddenFrom="sm"
            >
              <IconBrandGithub size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </header>
    </Box>
  );
}
