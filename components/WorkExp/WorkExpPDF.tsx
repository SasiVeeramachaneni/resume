import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { WorkExperience } from '../declarations/types'; // Import the type
import { pdfStyles } from '../ResumePDF/ResumeStyles';

// Define styles for PDF
const styles = StyleSheet.create({
  experienceContainer: {
    paddingBottom: 10,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  organization: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  dates: {
    fontSize: 7,
    fontStyle: 'italic',
  },
  role: {
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 5,
  },
  bulletPoint: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    fontSize: 8,
    marginBottom: 2,
    lineHeight: 1.8,
  },
  bulletSymbol: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
});

// Define props type for WorkExperiencePDF
interface WorkExperiencePDFProps {
  workExperience: WorkExperience[];
}

// WorkExperience PDF component with TypeScript
const WorkExperiencePDF: React.FC<WorkExperiencePDFProps> = ({ workExperience }) => {
  return (
    <>
      <Text style={pdfStyles.sectionTitle}>WORK EXPERIENCE</Text>

      {workExperience.map((exp, index) => {
        const dateRange = `${exp.from} - ${exp.isCurrent ? 'Present' : exp.to}`;

        return (
          <View key={index} style={styles.experienceContainer}>
            {/* Organization and Dates */}
            <View style={styles.header}>
              <Text style={styles.organization}>{exp.organization}</Text>
              <Text style={styles.dates}>{dateRange}</Text>

            </View>

            {/* Role */}
            <Text style={styles.role}>{exp.role}</Text>

            {/* Bullet Points */}
            {exp.points.map((point, pointIndex) => (
              <View key={pointIndex} style={styles.bulletPoint}>
                <Text style={styles.bulletSymbol}>•</Text>
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        )
      })}
    </>

  );
};

export default WorkExperiencePDF;
