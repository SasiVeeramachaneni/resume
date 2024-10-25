// /components/SettingsModal.tsx
'use client';

import React, { useContext, useState } from 'react';
import { Modal, SimpleGrid, Button, Group, Switch } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext';
import { Settings } from '../declarations/types';
import { IconDeviceFloppy } from '@tabler/icons-react';

interface SettingsModalProps {
    opened: boolean;
    close: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ opened, close }) => {
    const resumeContext = useContext(ResumeContext);

    if (!resumeContext) {
        return null; // Handle the case when context is undefined
    }

    const { resumeData, updateSettings } = resumeContext;
    const [settings, setSettings] = useState<Settings>(resumeData.settings);

    const handleCheckboxChange = (field: keyof Settings) => (
        event: React.ChangeEvent<HTMLInputElement> | boolean
    ) => {
        const checked = typeof event === 'boolean' ? event : event.currentTarget.checked;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [field]: checked,
        }));
    };

    const handleSave = () => {
        // Update settings in the context
        updateSettings(settings);
        close();
    };

    return (
        <Modal opened={opened} onClose={close} size="50%" centered>
            <SimpleGrid cols={2} spacing="xl" pl={30}>
                <Switch
                    label="LinkedIn"
                    description="Helps with the linkedin URL"
                    size="md"
                    variant="outline"
                    style={{ fontWeight: 'bold' }}
                    checked={settings.isLinkedIn}
                    onChange={handleCheckboxChange('isLinkedIn')}
                />
                <Switch
                    label="GitHub"
                    description="Show case your pet projects skills"
                    size="md"
                    variant="outline"
                    style={{ fontWeight: 'bold' }}

                    checked={settings.isGithub}
                    onChange={handleCheckboxChange('isGithub')}
                />
                <Switch
                    label="Awards"
                    description="I am recognized"
                    size="md"
                    variant="outline"
                    style={{ fontWeight: 'bold' }}

                    checked={settings.isAwards}
                    onChange={handleCheckboxChange('isAwards')}
                />
                <Switch
                    label="Certifications"
                    description="We all do certifications"
                    size="md"
                    style={{ fontWeight: 'bold' }}

                    variant="outline"
                    checked={settings.isCertifications}
                    onChange={handleCheckboxChange('isCertifications')}
                />
                <Switch
                    label="Image"
                    description="Brand yourself"
                    size="md"
                    variant="outline"
                    style={{ fontWeight: 'bold' }}

                    checked={settings.isImage}
                    onChange={handleCheckboxChange('isImage')}
                />
                <Switch
                    label="Patents"
                    description="Are you a inventor"
                    size="md"
                    variant="outline"
                    style={{ fontWeight: 'bold' }}

                    checked={settings.isPatents}
                    onChange={handleCheckboxChange('isPatents')}
                />
                <Switch
                    label="Projects"
                    description="Showcase your fun time projects"
                    size="md"
                    variant="outline"
                    style={{ fontWeight: 'bold' }}

                    checked={settings.isPersonalProjects}
                    onChange={handleCheckboxChange('isPersonalProjects')}
                />
                <Switch
                    label="Languages"
                    description="Needed for students"
                    size="md"
                    variant="outline"
                    style={{ fontWeight: 'bold' }}

                    checked={settings.isLanguages}
                    onChange={handleCheckboxChange('isLanguages')}
                />
            </SimpleGrid>
            <Group justify='center' pt={30}>
                <Button onClick={handleSave} size="md" rightSection={<IconDeviceFloppy size={20} />}>
                    Save
                </Button>
            </Group>

        </Modal>
    );
};

export default SettingsModal;
