import { HoverCard, Group, Button, UnstyledButton, Text, SimpleGrid, ThemeIcon, Anchor, Divider, Center, Box, rem, useMantineTheme, ActionIcon, Menu } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useContext } from 'react';
import { IconNotification, IconCode, IconBook, IconChartPie3, IconFingerprint, IconCoin, IconChevronDown, IconUpload, IconPalette, IconDownload, IconSettings, IconMenu2, IconBook2 } from '@tabler/icons-react';
import classes from './ResumeHeader.module.css';
import { CreateResumeLogo } from '../CreateResumeLogo/CreateResumeLogo';
import SettingsModal from '../Settings/Settings';
import ResumePDF from '../ResumePDF/ResumePDF';
import { ResumeContext } from '../declarations/ResumeContext';

const templateOptions = [
  {
    value: 'professional',
    title: 'Professional',
    description: 'Two-column professional resume layout',
  },
  {
    value: 'classic',
    title: 'Classic',
    description: 'Single-column resume layout',
  },
] as const;

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

  const { resumeData, setResumeData, updateSettings } = resumeContext;
  const selectedTemplate = resumeData.settings.template ?? 'professional';

  const handleTemplateSelect = (template: typeof templateOptions[number]['value']) => {
    updateSettings({ template });
  };

  const handleDownload = async () => {
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }

  const handleUpload = () => {
    const storedData = localStorage.getItem('resumeData');
    if (storedData) {
      setResumeData(JSON.parse(storedData));
    }
  };

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
            <HoverCard width={460} position="bottom" radius="md" shadow="md" withinPortal>
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

              <HoverCard.Dropdown>
                <SimpleGrid cols={2} spacing="sm">
                  {templateOptions.map((template) => {
                    const isSelected = selectedTemplate === template.value;

                    return (
                      <UnstyledButton
                        key={template.value}
                        className={classes.templateOption}
                        data-selected={isSelected || undefined}
                        onClick={() => handleTemplateSelect(template.value)}
                      >
                        <Box className={classes.templatePreview} data-template={template.value} />
                        <Text fw={600} size="sm">
                          {template.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {template.description}
                        </Text>
                      </UnstyledButton>
                    );
                  })}
                </SimpleGrid>
              </HoverCard.Dropdown>
            </HoverCard>
            {/*
            <a href="#" onClick={handleUpload} className={classes.link}>
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
            */}
          </Group>

          <SettingsModal opened={opened} close={close} />
          <Group visibleFrom="sm">
            <Button onClick={open} leftSection={<IconSettings size={18} />} variant="default">Settings</Button>
            <Button component={Link} to="/blog" leftSection={<IconBook2 size={18} />} variant="default">Blog</Button>
            <PDFDownloadLink
              key={JSON.stringify(resumeData)}
              document={
                <ResumePDF
                  resumeData={resumeData}
                />
              }
              fileName="resume.pdf"
            >
              <Button onClick={handleDownload} rightSection={<IconDownload size={18} />}>
                Download
              </Button>
            </PDFDownloadLink>
          </Group>

          <Group hiddenFrom="sm" gap="xs">
            <PDFDownloadLink
              key={JSON.stringify(resumeData)}
              document={<ResumePDF resumeData={resumeData} />}
              fileName="resume.pdf"
            >
              <ActionIcon onClick={handleDownload} variant="default" size="lg" aria-label="Download">
                <IconDownload size={20} />
              </ActionIcon>
            </PDFDownloadLink>

            <Menu shadow="md" width={220}>
              <Menu.Target>
                <ActionIcon variant="default" size="lg" aria-label="Menu">
                  <IconMenu2 size={20} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>Template</Menu.Label>
                {templateOptions.map((template) => {
                  const isSelected = selectedTemplate === template.value;
                  return (
                    <Menu.Item
                      key={template.value}
                      onClick={() => handleTemplateSelect(template.value)}
                      className={classes.mobileTemplateItem}
                      data-selected={isSelected || undefined}
                    >
                      <Box className={classes.mobileTemplatePreview} data-template={template.value} />
                      <Text size="sm" fw={500}>{template.title}</Text>
                    </Menu.Item>
                  );
                })}

                <Menu.Divider />

                <Menu.Item onClick={open} leftSection={<IconSettings size={16} />}>
                  Settings
                </Menu.Item>
                <Menu.Item component={Link} to="/blog" leftSection={<IconBook2 size={16} />}>
                  Blog
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>

        </Group>
      </header>

      <Text ta="center" size="md" c="dimmed" py={4}>
        Open <Anchor onClick={open} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Settings</Anchor> for enabling more configurations
      </Text>

    </Box>
  );
}
