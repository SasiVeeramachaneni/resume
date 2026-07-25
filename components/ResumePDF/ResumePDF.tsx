// components/ResumePDF/ResumePDF.tsx
import React from "react";
import {
  Document,
  Page,
  View,
  StyleSheet,
  Font,
  Text,
  Image,
} from "@react-pdf/renderer";
import { PersonalInfoPDF } from "../PersonalInfo/PersonalInfoPDF";
import { ResumeData } from "../declarations/types"; // Adjust path if needed

import WorkExperiencePDF from "../WorkExp/WorkExpPDF";
import SkillsPDF from "../Skills/SkillsPDF";
import CertificationsPDF from "../Certifications/CertificationsPDF";
import AwardsPDF from "../Awards/AwardsPDF";
import EducationPDF from "../Education/EducationPDF";
import LanguagesPDF from "../Languages/LanguagesPDF";
import PatentsPDF from "../Patents/PatentsPDF";
import ProjectsPDF from "../Projects/ProjectsPDF";

import { photoStyles } from "./ResumeStyles";

Font.register({
  family: "Merriweather",
  fonts: [
    { src: "/fonts/Merriweather-Regular.ttf" }, // font-style: normal, font-weight: normal
    { src: "/fonts/Merriweather-Italic.ttf", fontStyle: "italic" },
    { src: "/fonts/Merriweather-Bold.ttf", fontWeight: "bold" },
  ],
});

// Define styles for PDF components
const styles = StyleSheet.create({
  page: {
    padding: 12,
    fontFamily: "Merriweather",
    backgroundColor: "#FFF",
  },
  section: {
    padding: 5,
    marginBottom: 10,
  },
});

// Stylings for Photo Template Page
const photoPageStyles = StyleSheet.create({
  page: {
    fontFamily: "Merriweather",
    backgroundColor: "#FFFFFF",
    padding: 0,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  sidebar: {
    width: "28%",
    backgroundColor: "#1e2531", // Deep navy slate
    padding: "30px 18px",
    color: "#ffffff",
  },
  main: {
    width: "72%",
    padding: "35px 25px",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    objectFit: "cover",
    border: "2px solid rgba(255, 255, 255, 0.25)",
  },
  sidebarField: {
    marginBottom: 10,
  },
  sidebarLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#95a5a6",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  sidebarValue: {
    fontSize: 8,
    color: "#ecf0f1",
  },
  mainName: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e2531",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#7f8c8d",
    marginBottom: 20,
  },
  profileText: {
    fontSize: 8.5,
    color: "#2c3e50",
    lineHeight: 1.6,
  },
});

// Render the entire Photo Template layout
const PhotoTemplatePDF: React.FC<{ resumeData: ResumeData }> = ({
  resumeData,
}) => {
  const {
    personalInfo,
    settings,
    workExperience,
    skills,
    certifications,
    awards,
    education,
    patents,
    projects,
  } = resumeData;
  const languages = resumeData.languages ?? [];
  const hasLanguages = languages.some(
    (language) => language.name.trim() || language.proficiency.trim(),
  );

  return (
    <View style={photoPageStyles.container}>
      {/* Left dark sidebar */}
      <View style={photoPageStyles.sidebar}>
        {/* Rounded photo */}
        {settings.isImage && personalInfo.image && (
          <View style={photoPageStyles.avatarContainer}>
            <Image style={photoPageStyles.avatar} src={personalInfo.image} />
          </View>
        )}

        {/* Contact info stacked vertically */}
        <View style={{ marginBottom: 15 }}>
          <Text style={photoStyles.sidebarSectionTitle}>Contact</Text>

          {personalInfo.phoneNumber && (
            <View style={photoPageStyles.sidebarField}>
              <Text style={photoPageStyles.sidebarLabel}>Phone</Text>
              <Text style={photoPageStyles.sidebarValue}>
                {personalInfo.phoneNumber}
              </Text>
            </View>
          )}

          {personalInfo.email && (
            <View style={photoPageStyles.sidebarField}>
              <Text style={photoPageStyles.sidebarLabel}>Email</Text>
              <Text style={photoPageStyles.sidebarValue}>
                {personalInfo.email}
              </Text>
            </View>
          )}

          {settings.isLinkedIn && personalInfo.linkedIn && (
            <View style={photoPageStyles.sidebarField}>
              <Text style={photoPageStyles.sidebarLabel}>LinkedIn</Text>
              <Text style={photoPageStyles.sidebarValue}>
                {personalInfo.linkedIn}
              </Text>
            </View>
          )}

          {settings.isGithub && personalInfo.github && (
            <View style={photoPageStyles.sidebarField}>
              <Text style={photoPageStyles.sidebarLabel}>GitHub</Text>
              <Text style={photoPageStyles.sidebarValue}>
                {personalInfo.github}
              </Text>
            </View>
          )}
        </View>

        {/* Reorderable sections on sidebar */}
        <SkillsPDF skills={skills} template="photo" />
        {settings.isCertifications &&
          certifications &&
          certifications.length > 0 && (
            <CertificationsPDF
              certifications={certifications}
              template="photo"
            />
          )}
        {(settings.isLanguages || hasLanguages) &&
          languages &&
          languages.length > 0 && (
            <LanguagesPDF languages={languages} template="photo" />
          )}
        {settings.isPatents && patents && patents.length > 0 && (
          <PatentsPDF patents={patents} template="photo" />
        )}
      </View>

      {/* Right Column */}
      <View style={photoPageStyles.main}>
        {/* Name and title */}
        <View>
          <Text style={photoPageStyles.mainName}>{personalInfo.name}</Text>
          <Text style={photoPageStyles.mainTitle}>{personalInfo.title}</Text>
        </View>

        {/* Profile (About Me) */}
        {personalInfo.aboutMe && (
          <View style={{ marginBottom: 15 }}>
            <Text style={photoStyles.sectionTitle}>Profile</Text>
            <Text style={photoPageStyles.profileText}>
              {personalInfo.aboutMe}
            </Text>
          </View>
        )}

        {/* Reorderable sections on main column */}
        <WorkExperiencePDF workExperience={workExperience} template="photo" />
        {settings.isPersonalProjects && projects && projects.length > 0 && (
          <ProjectsPDF projects={projects} template="photo" />
        )}
        <EducationPDF education={education} template="photo" />
        {settings.isAwards && awards && awards.length > 0 && (
          <AwardsPDF awards={awards} template="photo" />
        )}
      </View>
    </View>
  );
};

// Props interface for ResumeBuilder
interface ResumeBuilderProps {
  resumeData: ResumeData;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ resumeData }) => {
  const isPhoto = resumeData.settings.template === "photo";

  if (isPhoto) {
    return (
      <Document>
        <Page size="A4" style={photoPageStyles.page}>
          <PhotoTemplatePDF resumeData={resumeData} />
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Personal Information */}
        <View style={styles.section}>
          <PersonalInfoPDF resumeData={resumeData} />
        </View>
      </Page>
    </Document>
  );
};

export default ResumeBuilder;
