// ResumePDF.js
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  text: { marginBottom: 4 },
});

export function ResumePDF() {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Resume</Text>
          <Text style={styles.text}>Name: John Doe</Text>
          <Text style={styles.text}>Title: Software Engineer</Text>
          <Text style={styles.text}>Phone: (123) 456-7890</Text>
          <Text style={styles.text}>Email: john.doe@example.com</Text>
        </View>
        {/* Add more sections and resume details here */}
      </Page>
    </Document>
  );
}
