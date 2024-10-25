'use client';

import {
    Group,
    Button,
    Box
  } from '@mantine/core';
  import classes from './Header.module.css';
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