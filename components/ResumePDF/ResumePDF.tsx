'use client';
// components/ResumeBuilder.tsx
import React from 'react';
import { Document, Page, View, StyleSheet, Font } from '@react-pdf/renderer';
import { PersonalInfoPDF } from "../PersonalInfo/PersonalInfoPDF";
import { ResumeData } from '../declarations/types'; // Adjust path if needed


Font.register({ family: 'Merriweather', fonts: [
  { src: '/fonts/Merriweather-Regular.ttf' }, // font-style: normal, font-weight: normal
  { src: '/fonts/Merriweather-Italic.ttf', fontStyle: 'italic' },
  { src: '/fonts/Merriweather-Bold.ttf', fontWeight: 'bold' },
 ]});

// Define styles for PDF components
const styles = StyleSheet.create({
  page: {
    padding: 12,
    fontFamily: 'Merriweather',
    backgroundColor: '#FFF',
  },
  section: {
    padding: 5,
    marginBottom: 10,
  },
  leftColumn: {
    width: '66%',
    paddingRight: 10,
  },
  rightColumn: {
    width: '33%',
    paddingLeft: 10,
  },
});

// Props interface for ResumeBuilder
interface ResumeBuilderProps {
  resumeData: ResumeData;
}

const ResumeBuilder: React.FC<ResumeBuilderProps> = ({ resumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Personal Information */}
      <View style={styles.section}>
        <PersonalInfoPDF resumeData={resumeData} />
      </View>

      {/* Main content with left and right columns */}
      <View style={[styles.section, { flexDirection: 'row' }]}>
        {/* Left Column */}
        {/*<View style={styles.leftColumn}>
          <WorkExperiencePDF workExperience={resumeData.workExperience} />
        </View>*/}
        {/* Right Column */}
        {/*<View style={styles.rightColumn}>
          <SkillsPDF skills={resumeData.skills} />
          <CertificationsPDF certifications={resumeData.certifications} />
          <AwardsPDF awards={resumeData.awards} />
          <EducationPDF education={resumeData.education} />
        </View>*/}
      </View>
    </Page>
  </Document>
);

export default ResumeBuilder;
