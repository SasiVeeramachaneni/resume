// CertificationsPDF.tsx
import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { Certification } from "../declarations/types"; // Adjust the import path if necessary
import { pdfStyles, photoStyles } from "../ResumePDF/ResumeStyles";

// Define styles for the PDF
const styles = StyleSheet.create({
  certContainer: {
    marginBottom: 10,
  },
  certName: {
    fontSize: 10,
    fontWeight: "bold",
  },
  certDetails: {
    fontSize: 8,
    color: "#555",
    fontStyle: "italic",
  },
});

// Define props type for CertificationsPDF
interface CertificationsPDFProps {
  certifications: Certification[];
  template?: string;
}

// Certifications PDF component
const CertificationsPDF: React.FC<CertificationsPDFProps> = ({
  certifications,
  template,
}) => {
  if (template === "photo") {
    return (
      <>
        <Text style={photoStyles.sidebarSectionTitle}>CERTIFICATIONS</Text>
        {certifications.map((cert, index) => (
          <View key={index} style={styles.certContainer}>
            <Text style={[styles.certName, { color: "#ffffff", fontSize: 9 }]}>
              {cert.name}
            </Text>
            <Text
              style={[
                styles.certDetails,
                { color: "#bdc3c7", fontSize: 7, fontStyle: "italic" },
              ]}
            >
              {cert.organization} {cert.year ? `• ${cert.year}` : ""}
            </Text>
          </View>
        ))}
      </>
    );
  }

  return (
    <>
      {/* Section title */}
      <Text style={pdfStyles.sectionTitle}>CERTIFICATIONS</Text>

      {/* Certification items */}
      {certifications.map((cert, index) => (
        <View key={index} style={styles.certContainer}>
          <Text style={styles.certName}>{cert.name}</Text>
          <Text style={styles.certDetails}>
            {cert.organization} {cert.year ? `• ${cert.year}` : ""}
          </Text>
        </View>
      ))}
    </>
  );
};

export default CertificationsPDF;
