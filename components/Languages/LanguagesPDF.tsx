import React from 'react';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { Language } from '../declarations/types';
import { pdfStyles } from '../ResumePDF/ResumeStyles';

const styles = StyleSheet.create({
  languageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  languageName: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingBottom: 2,
    color: '#333',
  },
  proficiency: {
    fontSize: 8,
    color: '#555',
    fontStyle: 'italic',
  },
});

interface LanguagesPDFProps {
  languages: Language[];
}

const LanguagesPDF: React.FC<LanguagesPDFProps> = ({ languages }) => {
  const visibleLanguages = (languages ?? []).filter((language) => language.name.trim() || language.proficiency.trim());

  if (visibleLanguages.length === 0) {
    return null;
  }

  return (
    <>
      <Text style={pdfStyles.sectionTitle}>LANGUAGES</Text>
      {visibleLanguages.map((language, index) => (
        <View key={index} style={styles.languageContainer}>
          <Text style={styles.languageName}>{language.name}</Text>
          <Text style={styles.proficiency}>{language.proficiency}</Text>
        </View>
      ))}
    </>
  );
};

export default LanguagesPDF;
