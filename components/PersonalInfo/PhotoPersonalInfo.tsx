"use client";

import React, { useState, useContext } from "react";
import {
  Group,
  TextInput,
  Textarea,
  Divider,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import {
  IconPhone,
  IconMail,
  IconBrandLinkedin,
  IconBrandGithub,
} from "@tabler/icons-react";
import { ImageUpload } from "@/components/ImageUpload/ImageUpload";
import { ResumeContext } from "../declarations/ResumeContext";

// Photo template personal info: photo fills full sidebar width, name is HUGE
// uppercase with accent bar, contact info centered below.
export function PhotoPersonalInfo() {
  const resumeContext = useContext(ResumeContext);
  if (!resumeContext) {
    throw new Error("ResumeContext must be used within a ResumeProvider");
  }

  const { resumeData, updatePersonalInfo } = resumeContext;
  const { name, title, aboutMe, phoneNumber, email, linkedIn, github } =
    resumeData.personalInfo;
  const { isImage, isGithub } = resumeData.settings;

  const [activeField, setActiveField] = useState<string | null>(null);

  const handleChange = (
    field: keyof typeof resumeData.personalInfo,
    value: string,
  ) => {
    updatePersonalInfo(field, value);
  };

  const handleFocus = (field: string) => setActiveField(field);
  const handleBlur = () => setActiveField(null);

  return (
    <>
      {/* Photo fills full width of left sidebar area */}
      <Group
        pl={0}
        pb={15}
        gap={0}
        align="flex-start"
        style={{ position: "relative" }}
      >
        {isImage && (
          <div style={{ width: "35%", position: "relative" }}>
            <ImageUpload />
          </div>
        )}
        {/* Name with accent bar in main area */}
        <div
          style={{
            width: isImage ? "65%" : "100%",
            paddingLeft: isImage ? "20px" : "0",
          }}
        >
          <input
            placeholder="YOUR NAME"
            style={{
              fontWeight: "900",
              width: "100%",
              fontSize: "42px",
              padding: "0",
              paddingBottom: "8px",
              border: "none",
              outline: "none",
              color: "#2c3e50",
              backgroundColor:
                activeField === "name" ? "#f8f9fa" : "transparent",
              textTransform: "uppercase",
              letterSpacing: "2px",
              borderBottom: "6px solid #f1c40f",
            }}
            value={name}
            onChange={(e) => handleChange("name", e.target.value)}
            onFocus={() => handleFocus("name")}
            onBlur={handleBlur}
          />
          <input
            placeholder="Your Title"
            style={{
              fontWeight: "600",
              fontSize: "18px",
              padding: "8px 0 0 0",
              border: "none",
              outline: "none",
              color: "#7f8c8d",
              backgroundColor:
                activeField === "title" ? "#f8f9fa" : "transparent",
              width: "100%",
            }}
            value={title}
            onChange={(e) => handleChange("title", e.target.value)}
            onFocus={() => handleFocus("title")}
            onBlur={handleBlur}
          />
          <Textarea
            variant="unstyled"
            placeholder="About me (appears in sidebar)"
            size="md"
            autosize
            minRows={1}
            maxRows={3}
            maxLength={400}
            style={{
              width: "100%",
              padding: "8px 0 0 0",
              backgroundColor:
                activeField === "aboutMe" ? "#f8f9fa" : "transparent",
              color: "#555",
              fontSize: "14px",
            }}
            value={aboutMe}
            onChange={(e) => handleChange("aboutMe", e.currentTarget.value)}
            onFocus={() => handleFocus("aboutMe")}
            onBlur={handleBlur}
          />
        </div>
      </Group>

      {/* Contact info centered below name */}
      <div style={{ textAlign: "center", padding: "10px 0 20px 0" }}>
        <Group justify="center" gap="lg" wrap="nowrap">
          {phoneNumber && (
            <Text size="sm" c="dimmed">
              <IconPhone
                size={14}
                style={{ marginRight: "4px", verticalAlign: "middle" }}
              />
              {phoneNumber}
            </Text>
          )}
          {email && (
            <Text size="sm" c="dimmed">
              <IconMail
                size={14}
                style={{ marginRight: "4px", verticalAlign: "middle" }}
              />
              {email}
            </Text>
          )}
          {linkedIn && (
            <Text size="sm" c="dimmed">
              <IconBrandLinkedin
                size={14}
                style={{ marginRight: "4px", verticalAlign: "middle" }}
              />
              {linkedIn}
            </Text>
          )}
          {isGithub && github && (
            <Text size="sm" c="dimmed">
              <IconBrandGithub
                size={14}
                style={{ marginRight: "4px", verticalAlign: "middle" }}
              />
              {github}
            </Text>
          )}
        </Group>
      </div>

      <Divider size="sm" />
    </>
  );
}
