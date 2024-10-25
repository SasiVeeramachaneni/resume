'use client';

import React from 'react';
import {
  Group,
  Button,
  Center,
  Box,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings, IconDownload } from '@tabler/icons-react';
import { pdf } from '@react-pdf/renderer';
import { ResumePDF } from '../generatepdf/generatepdf'; // Adjust path if necessary
import SettingsModal from '../Settings/Settings';
import { CreateResumeLogo } from '../CreateResumeLogo/CreateResumeLogo';
import classes from './ResumeHeader.module.css';

export function ResumeHeader() {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();

  const handleDownload = async () => {
    const blob = await pdf(<ResumePDF />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <CreateResumeLogo />

          <Group h="100%" gap={0} visibleFrom="sm">
            <a href="#" className={classes.link}>
              <Center inline>
                <Box component="span" mr={5}>
                  Select color
                </Box>
              </Center>
            </a>
          </Group>

          <Group visibleFrom="sm">
            <Button onClick={open} leftSection={<IconSettings size={18} />} variant="default">
              Settings
            </Button>
            <SettingsModal opened={opened} close={close} />
            <Button onClick={handleDownload} rightSection={<IconDownload size={18} />}>
              Download
            </Button>
          </Group>
        </Group>
      </header>
    </Box>
  );
}
