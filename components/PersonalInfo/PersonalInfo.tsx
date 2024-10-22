'use client';
import { Group, TextInput, Flex, Textarea, Divider } from '@mantine/core';
import { IconPhone, IconMail, IconBrandLinkedin } from "@tabler/icons-react";
import { ImageUpload } from "@/components/ImageUpload/ImageUpload";

export function PersonalInfo() {

  return (
    <>
          <Group pl={30} gap={20} justify="flex-start">
            <ImageUpload />
            <Flex direction="column">
              <TextInput
                placeholder="Your name"
                variant="unstyled"
                size="xl"
              />
              <TextInput
                placeholder="Title"
                variant="unstyled"
                size="lg"
              />
              <Textarea
                variant="unstyled"
                placeholder="About me"
                maxRows={3}
              />
            </Flex>
          </Group>
          <Divider size="sm" />
          <Group pl={30} gap={20} justify="flex-start">
            <TextInput
              placeholder="Phone Number"
              leftSection={<IconPhone size={18} />}
              variant="unstyled"
              size="lg"
            />
            <TextInput
              placeholder="Email ID"
              leftSection={<IconMail size={22} />}
              variant="unstyled"
              size="lg"
            />
            <TextInput
              placeholder="LinkedIn"
              leftSection={<IconBrandLinkedin size={22} />}
              variant="unstyled"
              size="lg"
            />
          </Group>
          <Divider size="sm" />
    </>
  );
}
