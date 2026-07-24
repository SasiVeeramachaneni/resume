import React from 'react';
import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Patent } from '../declarations/types';
import { pdfStyles, photoStyles } from '../ResumePDF/ResumeStyles';

const styles = StyleSheet.create({
  patentContainer: {
    marginBottom: 10,
  },
  patentName: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingBottom: 2,
  },
  patentDetails: {
    fontSize: 8,
    color: '#555',
    fontStyle: 'italic',
    paddingBottom: 2,
  },
  patentDescription: {
    fontSize: 8,
    color: '#333',
    lineHeight: 1.4,
    paddingBottom: 2,
  },
  patentLink: {
    fontSize: 8,
    color: '#448DEC',
    textDecoration: 'none',
  },
});

interface PatentsPDFProps {
  patents: Patent[];
  template?: string;
}

const PatentsPDF: React.FC<PatentsPDFProps> = ({ patents, template }) => {
  const visiblePatents = patents.filter(
    (patent) => patent.name.trim() || patent.description.trim() || patent.link.trim() || patent.year
  );

  if (visiblePatents.length === 0) {
    return null;
  }

  if (template === 'photo') {
    return (
      <>
        <Text style={photoStyles.sidebarSectionTitle}>PATENTS</Text>
        {visiblePatents.map((patent, index) => (
          <View key={index} style={styles.patentContainer}>
            <Text style={[styles.patentName, { color: '#ffffff', fontSize: 9 }]}>{patent.name}</Text>
            {patent.year ? <Text style={[styles.patentDetails, { color: '#bdc3c7', fontSize: 7, fontStyle: 'italic' }]}>{patent.year}</Text> : null}
            {patent.description ? <Text style={[styles.patentDescription, { color: '#ecf0f1', fontSize: 7 }]}>{patent.description}</Text> : null}
            {patent.link ? (
              <Link src={patent.link} style={[styles.patentLink, { color: '#95a5a6', fontSize: 7 }]}>
                Link
              </Link>
            ) : null}
          </View>
        ))}
      </>
    );
  }

  return (
    <>
      <Text style={pdfStyles.sectionTitle}>PATENTS</Text>
      {visiblePatents.map((patent, index) => (
        <View key={index} style={styles.patentContainer}>
          <Text style={styles.patentName}>{patent.name}</Text>
          {patent.year ? <Text style={styles.patentDetails}>{patent.year}</Text> : null}
          {patent.description ? <Text style={styles.patentDescription}>{patent.description}</Text> : null}
          {patent.link ? (
            <Link src={patent.link} style={styles.patentLink}>
              {patent.link}
            </Link>
          ) : null}
        </View>
      ))}
    </>
  );
};

export default PatentsPDF;
