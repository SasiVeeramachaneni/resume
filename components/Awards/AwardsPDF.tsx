// AwardsPDF.tsx
import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { Award } from '../declarations/types'; // Adjust the import path as necessary
import { pdfStyles } from '../ResumePDF/ResumeStyles';


// Define styles for PDF rendering
const styles = StyleSheet.create({
    awardContainer: {
        marginBottom: 10,
    },
    awardName: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    awardOrganization: {
        fontSize: 8,
        color: '#555',
        fontStyle: 'italic',
    },
});

// Define props for AwardsPDF
interface AwardsPDFProps {
    awards: Award[];
}

// Awards PDF component
const AwardsPDF: React.FC<AwardsPDFProps> = ({ awards }) => {
    return (
        <>
            <Text style={pdfStyles.sectionTitle}>AWARDS</Text>

            {/* Award items */}
            {awards.map((award, index) => (
                <View key={index} style={styles.awardContainer}>
                    <Text style={styles.awardName}>{award.name}</Text>
                    <Text style={styles.awardOrganization}>{award.organization}</Text>
                </View>
            ))}
        </>
    );
};

export default AwardsPDF;
