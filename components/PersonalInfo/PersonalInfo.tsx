'use client';
import React, { useContext } from 'react';
import { Group, TextInput, Textarea, Divider, Stack, Grid } from '@mantine/core';
import { IconPhone, IconMail, IconBrandLinkedin } from "@tabler/icons-react";
import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import { ResumeContext } from '../declarations/ResumeContext'; // Adjust the import path as necessary

export function PersonalInfo() {
  const resumeContext = useContext(ResumeContext);
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { resumeData, updatePersonalInfo } = resumeContext;
  const { name, title, aboutMe, phoneNumber, email, linkedIn } = resumeData.personalInfo;
  const { isImage } = resumeData.settings;

  const handleChange = (field: keyof typeof resumeData.personalInfo, value: string) => {
    updatePersonalInfo(field, value);

    if (field === 'name') {
      console.log('Updated Resume Data:', resumeData);
    }
  };

  return (
    <>
      <Group pl={20} gap={20} justify="flex-start">
        {isImage && <ImageUpload />}
        <Stack pb={15} gap={0} style={{ width: isImage ? '87%' : '100%' }}>
          <input
            placeholder="Your name"
            style={{
              fontWeight: 'bold',
              width: '500px',
              fontSize: '28px',
              padding: '0',
              paddingBottom: '5px',
              border: 'none'
            }}
            value={name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
          <input
            placeholder="Title"
            style={{
              fontWeight: 'bold',
              fontSize: '20px',
              padding: '0',
              paddingBottom: '5px',
              border: 'none'
            }}
            value={title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          <Textarea
            variant="unstyled"
            placeholder="About me"
            size="md"
            autosize
            minRows={1}
            maxRows={3}
            maxLength={isImage ? 470 : 530} // Conditional maxLength based on isImage
            style={{ width: '100%', padding: 0 }}
            value={aboutMe}
            onChange={(e) => handleChange('aboutMe', e.currentTarget.value)}
          />
        </Stack>
      </Group>
      <Divider size="sm" />
      <Grid align="center" columns={12} p={0} m={0}>
        <Grid.Col span={3}>
          <TextInput
            placeholder="Phone Number"
            leftSection={<IconPhone size={18} />}
            variant="unstyled"
            size="md"
            value={phoneNumber}
            onChange={(e) => handleChange('phoneNumber', e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <TextInput
            placeholder="Email ID"
            leftSection={<IconMail size={22} />}
            variant="unstyled"
            size="md"
            value={email}
            onChange={(e) => handleChange('email', e.currentTarget.value)}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            placeholder="LinkedIn"
            leftSection={<IconBrandLinkedin size={22} />}
            variant="unstyled"
            size="md"
            style={{ width: '100%' }}
            value={linkedIn || ''} // Handle optional value
            onChange={(e) => handleChange('linkedIn', e.currentTarget.value)}
          />
        </Grid.Col>
      </Grid>
      <Divider size="sm" />
    </>
  );
}
