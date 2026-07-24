import React from 'react';
import { StyleSheet, Text, View } from '@react-pdf/renderer';
import { Language } from '../declarations/types';
import { pdfStyles, photoStyles } from '../ResumePDF/ResumeStyles';

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
  template?: string;
}

const LanguagesPDF: React.FC<LanguagesPDFProps> = ({ languages, template }) => {
  const visibleLanguages = (languages ?? []).filter((language) => language.name.trim() || language.proficiency.trim());

  if (visibleLanguages.length === 0) {
    return null;
  }

  if (template === 'photo') {
    return (
      <>
        <Text style={photoStyles.sidebarSectionTitle}>LANGUAGES</Text>
        <View style={{ flexDirection: 'column', gap: 3, marginBottom: 10 }}>
          {visibleLanguages.map((language, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
              <Text style={{ color: '#ecf0f1', fontSize: 10, marginRight: 6 }}>•</Text>
              <Text style={{ color: '#ffffff', fontSize: 8 }}>
                {language.name}{language.proficiency ? ` (${language.proficiency})` : ''}
              </Text>
            </View>
          ))}
        </View>
      </>
    );
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
