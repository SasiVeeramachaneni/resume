import {
    Group,
    Button,
    Box,
    Image,
    Title,
    Text
  } from '@mantine/core';
  import classes from './Header.module.css';
  import icon from './resume.png'
  import { CreateResumeLogo } from '../CreateResumeLogo/CreateResumeLogo';
  
  
  export function Header() {

    return (
      <Box pb={0}>
        <header className={classes.header}>
          <Group justify="space-between" h="100%">
            <CreateResumeLogo />  
            <Group visibleFrom="sm">
              <Button component="a" href="/resume">Create Resume</Button>
            </Group>
  
          </Group>
        </header>
  
      </Box>
    );
  }