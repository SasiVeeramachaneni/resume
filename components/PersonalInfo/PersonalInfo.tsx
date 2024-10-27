'use client';

import React, { useState, useContext } from 'react';
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

  // State to track the currently active (focused) field
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleChange = (field: keyof typeof resumeData.personalInfo, value: string) => {
    updatePersonalInfo(field, value);
    if (field === 'name') {
      console.log('Updated Resume Data:', resumeData);
    }
  };

  const handleFocus = (field: string) => setActiveField(field);
  const handleBlur = () => setActiveField(null);

  return (
    <>
      <Group pl={20} gap={20} justify="flex-start">
        {isImage && <ImageUpload />}
        <Stack pb={15} gap={0} style={{ width: isImage ? '87%' : '100%' }}>
          <input
            placeholder="Your name"
            style={{
              fontWeight: 'bold',
              width: '100%',
              fontSize: '28px',
              padding: '0',
              paddingBottom: '5px',
              border: 'none',
              outline: 'none',
              color: 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-4))',
              backgroundColor: activeField === 'name' ? '#eff8ff' : 'transparent'
            }}
            value={name}
            onChange={(e) => handleChange('name', e.target.value)}
            onFocus={() => handleFocus('name')}
            onBlur={handleBlur}
          />
          <input
            placeholder="Title"
            style={{
              fontWeight: 'bold',
              fontSize: '20px',
              padding: '0',
              paddingBottom: '5px',
              border: 'none',
              outline: 'none',
              backgroundColor: activeField === 'title' ? '#eff8ff' : 'transparent'
            }}
            value={title}
            onChange={(e) => handleChange('title', e.target.value)}
            onFocus={() => handleFocus('title')}
            onBlur={handleBlur}
          />
          <Textarea
            variant="unstyled"
            placeholder="About me"
            size="md"
            autosize
            minRows={1}
            maxRows={3}
            maxLength={isImage ? 430 : 470}
            style={{
              width: '100%',
              padding: 0,
              backgroundColor: activeField === 'aboutMe' ? '#eff8ff' : 'transparent'
            }}
            value={aboutMe}
            onChange={(e) => handleChange('aboutMe', e.currentTarget.value)}
            onFocus={() => handleFocus('aboutMe')}
            onBlur={handleBlur}
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
            onFocus={() => handleFocus('phoneNumber')}
            onBlur={handleBlur}
            style={{
              backgroundColor: activeField === 'phoneNumber' ? '#eff8ff' : 'transparent'
            }}
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
            onFocus={() => handleFocus('email')}
            onBlur={handleBlur}
            style={{
              backgroundColor: activeField === 'email' ? '#eff8ff' : 'transparent'
            }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            placeholder="LinkedIn"
            leftSection={<IconBrandLinkedin size={22} />}
            variant="unstyled"
            size="md"
            value={linkedIn || ''} 
            onChange={(e) => handleChange('linkedIn', e.currentTarget.value)}
            onFocus={() => handleFocus('linkedIn')}
            onBlur={handleBlur}
            style={{
              width: '100%',backgroundColor: activeField === 'linkedIn' ? '#eff8ff' : 'transparent'
            }}
          />
        </Grid.Col>
      </Grid>
      <Divider size="sm" />
    </>
  );
}
