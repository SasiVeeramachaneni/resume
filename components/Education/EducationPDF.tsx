// EducationPDF.tsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Education } from '../declarations/types'; // Adjust the import path as necessary
import { pdfStyles } from '../ResumePDF/ResumeStyles';


// Define styles for the PDF layout
const styles = StyleSheet.create({
    educationContainer: {
        marginBottom: 10,
    },
    degree: {
        fontSize: 10,
        fontWeight: 'bold',
        paddingBottom: 2
    },
    details: {
        fontSize: 8,
        color: '#555',
        paddingBottom: 2
    },
    lineItem: {
        fontSize: 8,
        fontStyle: 'italic',
        paddingBottom: 2
    },
});

// Define the props for EducationPDF
interface EducationPDFProps {
    education: Education[];
}

// Education PDF component
const EducationPDF: React.FC<EducationPDFProps> = ({ education }) => {
    return (
        <>
            <Text style={pdfStyles.sectionTitle}>EDUCATION</Text>

            {/* Education items */}
            {education.map((edu, index) => (
                <View key={index} style={styles.educationContainer}>
                    <Text style={styles.degree}>{edu.degree}</Text>
                    <Text style={styles.details}>{edu.college}</Text>
                    <Text style={styles.lineItem}>{edu.discipline}</Text>
                    <Text style={styles.lineItem}>
                        {edu.year ? `Year: ${edu.year}` : ''} {edu.percentage ? `• Percentage: ${edu.percentage}%` : ''}
                    </Text>
                </View>
            ))}
        </>
    );
};

export default EducationPDF;
