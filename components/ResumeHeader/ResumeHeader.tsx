import {
  HoverCard,
  Group,
  Button,
  UnstyledButton,
  Text,
  SimpleGrid,
  ThemeIcon,
  Anchor,
  Divider,
  Center,
  Box,
  rem,
  useMantineTheme,
  ActionIcon,
  Menu,
  Notification,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React, { useContext } from "react";
import {
  IconNotification,
  IconCode,
  IconBook,
  IconChartPie3,
  IconFingerprint,
  IconCoin,
  IconChevronDown,
  IconUpload,
  IconPalette,
  IconDownload,
  IconSettings,
  IconMenu2,
  IconBook2,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import classes from "./ResumeHeader.module.css";
import { CreateResumeLogo } from "../CreateResumeLogo/CreateResumeLogo";
import SettingsModal from "../Settings/Settings";
import ResumePDF from "../ResumePDF/ResumePDF";
import { LinkedInImportButton } from "../LinkedInImport/LinkedInImportButton";
import { PdfImportButton } from "../PdfImport/PdfImportButton";
import { useLinkedInImport } from "@/hooks/useLinkedInImport";
import { usePdfImport } from "@/hooks/usePdfImport";
import { ResumeContext } from "../declarations/ResumeContext";
import { getTemplate, templateOptions } from "@/templates";

const mockdata = [
  {
    icon: IconCode,
    title: "Open source",
    description: "This Pokémon’s cry is very loud and distracting",
  },
  {
    icon: IconCoin,
    title: "Free for everyone",
    description: "The fluid of Smeargle’s tail secretions changes",
  },
  {
    icon: IconBook,
    title: "Documentation",
    description: "Yanma is capable of seeing 360 degrees without",
  },
  {
    icon: IconFingerprint,
    title: "Security",
    description: "The shell’s rounded shape and the grooves on its.",
  },
  {
    icon: IconChartPie3,
    title: "Analytics",
    description: "This Pokémon uses its flying ability to quickly chase",
  },
  {
    icon: IconNotification,
    title: "Notifications",
    description: "Combusken battles with the intensely hot flames it spews",
  },
];

function LinkedInImportMenuItem() {
  const { status, importFromLinkedIn, importedFields } = useLinkedInImport();
  const isLoading = status === "loading";
  const label = isLoading
    ? "Importing..."
    : status === "success"
      ? `Imported ${importedFields} field${importedFields === 1 ? "" : "s"}`
      : "Connect with LinkedIn";
  return (
    <Menu.Item
      onClick={importFromLinkedIn}
      disabled={isLoading}
      leftSection={<IconBrandLinkedin size={16} />}
    >
      {label}
    </Menu.Item>
  );
}

function PdfImportMenuItem() {
  const { status, error, importFromFile, reset } = usePdfImport();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isLoading = status === "loading";
  const label = isLoading ? "Reading PDF..." : "Upload Resume PDF";
  React.useEffect(() => {
    if (status === "success" || status === "error") {
      const t = setTimeout(reset, 3500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [status, reset]);
  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: "none" }}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            await importFromFile(file);
            e.target.value = "";
          }
        }}
      />
      <Menu.Item
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        leftSection={<IconUpload size={16} />}
      >
        {label}
      </Menu.Item>
      {status === "error" && error && (
        <Notification
          color="red"
          title="PDF import failed"
          onClose={reset}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            maxWidth: 420,
          }}
        >
          {error}
        </Notification>
      )}
      {status === "success" && (
        <Notification
          color="teal"
          title="PDF imported"
          onClose={reset}
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            maxWidth: 420,
          }}
        >
          Resume loaded. Redirecting to editor...
        </Notification>
      )}
    </>
  );
}

export function ResumeHeader() {
  const resumeContext = useContext(ResumeContext);
  if (!resumeContext) {
    throw new Error("ResumeContext must be used within a ResumeProvider");
  }

  const { resumeData, setResumeData, updateSettings } = resumeContext;
  const selectedTemplate = resumeData.settings.template ?? "professional";

  const handleTemplateSelect = (
    template: (typeof templateOptions)[number]["value"],
  ) => {
    updateSettings({ template });
  };

  const handleDownload = async () => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
  };

  const handleUpload = () => {
    const storedData = localStorage.getItem("resumeData");
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
          <item.icon
            style={{ width: rem(22), height: rem(22) }}
            color={theme.colors.blue[6]}
          />
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
            <HoverCard
              width={460}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
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
                    const descriptor = getTemplate(template.value);

                    return (
                      <UnstyledButton
                        key={template.value}
                        className={classes.templateOption}
                        data-selected={isSelected || undefined}
                        onClick={() => handleTemplateSelect(template.value)}
                      >
                        <Box className={descriptor.previewClassName} />
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
            <Box ml="sm">
              <PdfImportButton variant="button" />
            </Box>
          </Group>

          <SettingsModal opened={opened} close={close} />
          <Group visibleFrom="sm">
            <LinkedInImportButton variant="button" />
            <PdfImportButton variant="button" label="Upload PDF" />
            <Button
              onClick={open}
              leftSection={<IconSettings size={18} />}
              variant="default"
            >
              Settings
            </Button>
            <Button
              component={Link}
              to="/blog"
              leftSection={<IconBook2 size={18} />}
              variant="default"
            >
              Blog
            </Button>
            <PDFDownloadLink
              key={JSON.stringify(resumeData)}
              document={<ResumePDF resumeData={resumeData} />}
              fileName="resume.pdf"
            >
              <Button
                onClick={handleDownload}
                rightSection={<IconDownload size={18} />}
              >
                Download
              </Button>
            </PDFDownloadLink>
          </Group>

          <Group hiddenFrom="sm" gap="xs">
            <LinkedInImportButton variant="icon" />
            <PdfImportButton variant="icon" />
            <PDFDownloadLink
              key={JSON.stringify(resumeData)}
              document={<ResumePDF resumeData={resumeData} />}
              fileName="resume.pdf"
            >
              <ActionIcon
                onClick={handleDownload}
                variant="default"
                size="lg"
                aria-label="Download"
              >
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
                  const descriptor = getTemplate(template.value);
                  return (
                    <Menu.Item
                      key={template.value}
                      onClick={() => handleTemplateSelect(template.value)}
                      className={classes.mobileTemplateItem}
                      data-selected={isSelected || undefined}
                    >
                      <Box
                        className={descriptor.mobilePreviewClassName}
                        style={
                          isSelected
                            ? {
                                borderColor: "var(--mantine-color-blue-6)",
                                borderStyle: "solid",
                              }
                            : undefined
                        }
                      />
                      <Text size="sm" fw={500}>
                        {template.title}
                      </Text>
                    </Menu.Item>
                  );
                })}

                <Menu.Divider />

                <Menu.Item
                  onClick={open}
                  leftSection={<IconSettings size={16} />}
                >
                  Settings
                </Menu.Item>
                <LinkedInImportMenuItem />
                <PdfImportMenuItem />
                <Menu.Item
                  component={Link}
                  to="/blog"
                  leftSection={<IconBook2 size={16} />}
                >
                  Blog
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </header>

      <Text ta="center" size="md" c="dimmed" py={4}>
        Open{" "}
        <Anchor
          onClick={open}
          style={{ textDecoration: "underline", cursor: "pointer" }}
        >
          Settings
        </Anchor>{" "}
        for enabling more configurations
      </Text>
    </Box>
  );
}
