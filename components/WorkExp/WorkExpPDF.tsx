import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { WorkExperience } from '../declarations/types'; // Import the type

// Define styles for PDF
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#077ee6',
    fontFamily: 'Times-Roman', // Use Times-Roman
  },
  experienceContainer: {
    paddingBottom: 10,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    fontFamily: 'Times-Roman', // Use Times-Roman
  },
  organization: {
    fontWeight: 'bold',
    fontSize: 10,
    fontFamily: 'Times-Roman', // Use Times-Roman
  },
  dates: {
    fontSize: 7,
    fontStyle: 'italic',
    fontFamily: 'Times-Roman', // Use Times-Roman
  },
  role: {
    fontSize: 10,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 5,
    fontFamily: 'Times-Roman', // Use Times-Roman
  },
  bulletPoint: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    fontSize: 7,
    marginBottom: 2,
    lineHeight: 1.3,
  },
  bulletSymbol: {
    width: 10,
  },
  bulletText: {
    flex: 1,
    fontFamily: 'Times-Roman', // Use Times-Roman
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
        <Text style={styles.title}>WORK EXPERIENCE</Text>

        {workExperience.map((exp, index) => (
          <View key={index} style={styles.experienceContainer}>
            {/* Organization and Dates */}
            <View style={styles.header}>
              <Text style={styles.organization}>{exp.organization}</Text>
              <Text style={styles.dates}>
                {exp.from} - {exp.isCurrent ? 'Present' : exp.to}
              </Text>
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
        ))}
          </>

  );
};

export default WorkExperiencePDF;
