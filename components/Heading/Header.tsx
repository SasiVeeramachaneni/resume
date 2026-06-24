import {
    Group,
    Button,
    Box
  } from '@mantine/core';
  import { Link } from 'react-router-dom';
  import { IconBook2, IconFileText } from '@tabler/icons-react';
  import classes from './Header.module.css';
  import { CreateResumeLogo } from '../CreateResumeLogo/CreateResumeLogo';
  
  
  export function Header() {

    return (
      <Box pb={0}>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            <CreateResumeLogo />  
            <Group visibleFrom="sm">
              <Button component={Link} to="/blog" variant="subtle" leftSection={<IconBook2 size={16} />}>Blog</Button>
              <Button component={Link} to="/resume" leftSection={<IconFileText size={16} />}>Create Resume</Button>
            </Group>
  
          </Group>
        </header>
  
      </Box>
    );
  }