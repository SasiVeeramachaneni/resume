'use client';

import { HoverCard, Group, Button, UnstyledButton, Text, SimpleGrid, ThemeIcon, Anchor, Divider, Center, Box, rem, useMantineTheme} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useContext } from 'react';
import { IconNotification, IconCode, IconBook, IconChartPie3, IconFingerprint, IconCoin, IconChevronDown, IconUpload, IconPalette, IconDownload, IconSettings } from '@tabler/icons-react';
import classes from './ResumeHeader.module.css';
import { CreateResumeLogo } from '../CreateResumeLogo/CreateResumeLogo';
import SettingsModal from '../Settings/Settings';
import ResumePDF from '../ResumePDF/ResumePDF';
import { ResumeContext } from '../declarations/ResumeContext';



const mockdata = [
  {
    icon: IconCode,
    title: 'Open source',
    description: 'This Pokémon’s cry is very loud and distracting',
  },
  {
    icon: IconCoin,
    title: 'Free for everyone',
    description: 'The fluid of Smeargle’s tail secretions changes',
  },
  {
    icon: IconBook,
    title: 'Documentation',
    description: 'Yanma is capable of seeing 360 degrees without',
  },
  {
    icon: IconFingerprint,
    title: 'Security',
    description: 'The shell’s rounded shape and the grooves on its.',
  },
  {
    icon: IconChartPie3,
    title: 'Analytics',
    description: 'This Pokémon uses its flying ability to quickly chase',
  },
  {
    icon: IconNotification,
    title: 'Notifications',
    description: 'Combusken battles with the intensely hot flames it spews',
  },
];

export function ResumeHeader() {

  const resumeContext = useContext(ResumeContext);
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { resumeData } = resumeContext;

  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);

  const theme = useMantineTheme();

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon style={{ width: rem(22), height: rem(22) }} color={theme.colors.blue[6]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

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
                <IconPalette
                  style={{ width: rem(18), height: rem(18) }}
                  color={theme.colors.blue[6]}
                />
              </Center>
            </a>
            <HoverCard width={600} position="bottom" radius="md" shadow="md" withinPortal>
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Select template
                    </Box>
                    <IconChevronDown
                      style={{ width: rem(18), height: rem(18) }}
                      color={theme.colors.blue[6]}
                    />
                  </Center>
                </a>
              </HoverCard.Target>

              <HoverCard.Dropdown style={{ overflow: 'hidden' }}>
                <Group justify="space-between" px="md">
                  <Text fw={500}>Features</Text>
                  <Anchor href="#" fz="xs">
                    View all
                  </Anchor>
                </Group>

                <Divider my="sm" />

                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>

                <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="sm">
                        Get started
                      </Text>
                      <Text size="xs" c="dimmed">
                        Their food sources have decreased, and their numbers
                      </Text>
                    </div>
                    <Button variant="default">Get started</Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            <a href="#" className={classes.link}>
              <Center inline>
                <Box component="span" mr={5}>
                  Upload resume
                </Box>
                <IconUpload
                  style={{ width: rem(18), height: rem(18) }}
                  color={theme.colors.blue[6]}
                />
              </Center>
            </a>
          </Group>

          <Group visibleFrom="sm">
            <Button onClick={open} leftSection={<IconSettings size={18} />} variant="default">Settings</Button>
            <SettingsModal opened={opened} close={close} />
            <PDFDownloadLink
              document={
                <ResumePDF
                  resumeData={resumeData}
                />
              }
              fileName="resume.pdf"
            >
              <Button rightSection={<IconDownload size={18} />}>
                Download
              </Button>
            </PDFDownloadLink>
          </Group>

        </Group>
      </header>

    </Box>
  );
}