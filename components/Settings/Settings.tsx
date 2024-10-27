'use client';

import React, { useContext, useState } from 'react';
import {
  Modal,
  SimpleGrid,
  Button,
  Group,
  Text,
  UnstyledButton,
  rem,
  useMantineTheme,
  ThemeIcon,
  Checkbox,
} from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext';
import { IconBrandLinkedin, IconDeviceFloppy, IconBrandGithub, IconAward, IconCertificate, IconCamera, IconApps, IconLanguage, IconFileCertificate } from '@tabler/icons-react';
import { Settings } from '../declarations/types';
import classes from './Settings.module.css';

interface SettingsModalProps {
  opened: boolean;
  close: () => void;
}

interface ToggleButtonProps {
  field: keyof Settings;
  label: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onToggle: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ field, label, description, icon, isActive, onToggle }) => {
  const theme = useMantineTheme();

  return (
    <UnstyledButton
      className={classes.subLink}
      onClick={onToggle}
      style={{
        border: isActive ? `2px solid ${theme.colors.blue[6]}` : `2px solid ${theme.colors.gray[6]}`,
        borderRadius: '8px',
        position: 'relative',
        padding: '8px',
      }}
    >
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          {React.cloneElement(icon as React.ReactElement, {
            style: { width: rem(30), height: rem(30) },
            color: isActive ? "var(--mantine-color-blue-filled)" : "#000",
          })}
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {label}
          </Text>
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        </div>
      </Group>
      {isActive && (
        <Checkbox
          checked
          readOnly
          size="xs"
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            pointerEvents: 'none',
          }}
        />
      )}
    </UnstyledButton>
  );
};

const SettingsModal: React.FC<SettingsModalProps> = ({ opened, close }) => {
  const theme = useMantineTheme();
  const resumeContext = useContext(ResumeContext);

  if (!resumeContext) {
    return null;
  }

  const { resumeData, updateSettings } = resumeContext;
  const [settings, setSettings] = useState<Settings>(resumeData.settings);

  const handleCheckboxChange = (field: keyof Settings) => () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [field]: !prevSettings[field],
    }));
  };

  const handleSave = () => {
    updateSettings(settings);
    close();
  };

  return (
    <Modal opened={opened} radius='xl' onClose={close} size="50%" centered>
      <SimpleGrid cols={2} spacing="xl" pl={30} pr={30}>
        {/* LinkedIn Toggle Button */}
        <ToggleButton
          field="isLinkedIn"
          label="LinkedIn"
          description="Helps with the LinkedIn URL"
          icon={<IconBrandLinkedin />}
          isActive={settings.isLinkedIn}
          onToggle={handleCheckboxChange('isLinkedIn')}
        />
        
        {/* GitHub Toggle Button */}
        <ToggleButton
          field="isGithub"
          label="GitHub"
          description="Showcase your pet projects skills"
          icon={<IconBrandGithub />}
          isActive={settings.isGithub}
          onToggle={handleCheckboxChange('isGithub')}
        />

        {/* Awards Toggle Button */}
        <ToggleButton
          field="isAwards"
          label="Awards"
          description="I am recognized"
          icon={<IconAward />}
          isActive={settings.isAwards}
          onToggle={handleCheckboxChange('isAwards')}
        />

        {/* Certifications Toggle Button */}
        <ToggleButton
          field="isCertifications"
          label="Certifications"
          description="We all do certifications"
          icon={<IconCertificate />}
          isActive={settings.isCertifications}
          onToggle={handleCheckboxChange('isCertifications')}
        />

        {/* Image Toggle Button */}
        <ToggleButton
          field="isImage"
          label="Image"
          description="Brand yourself"
          icon={<IconCamera />}
          isActive={settings.isImage}
          onToggle={handleCheckboxChange('isImage')}
        />

        {/* Patents Toggle Button */}
        <ToggleButton
          field="isPatents"
          label="Patents"
          description="Are you an inventor?"
          icon={<IconFileCertificate />}
          isActive={settings.isPatents}
          onToggle={handleCheckboxChange('isPatents')}
        />

        {/* Projects Toggle Button */}
        <ToggleButton
          field="isPersonalProjects"
          label="Projects"
          description="Showcase your fun time projects"
          icon={<IconApps />}
          isActive={settings.isPersonalProjects}
          onToggle={handleCheckboxChange('isPersonalProjects')}
        />

        {/* Languages Toggle Button */}
        <ToggleButton
          field="isLanguages"
          label="Languages"
          description="Needed for students"
          icon={<IconLanguage />}
          isActive={settings.isLanguages}
          onToggle={handleCheckboxChange('isLanguages')}
        />
      </SimpleGrid>
      <Group justify="center" pt={30}>
        <Button onClick={handleSave} size="md" rightSection={<IconDeviceFloppy size={20} />}>
          Save
        </Button>
      </Group>
    </Modal>
  );
};

export default SettingsModal;
