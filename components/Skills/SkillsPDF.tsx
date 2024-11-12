// SkillsPDF.tsx
import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfStyles } from '../ResumePDF/ResumeStyles';

const styles = StyleSheet.create({
    skillContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 3,
        marginBottom: 10
    },
    skillBox: {
        padding: 4,
        fontSize: 8,
        border: '1px solid #eff8ff',
        borderRadius: 4,
        fontWeight: 'bold',
        backgroundColor: '#eff8ff'
    },
});

interface SkillsPDFProps {
    skills: String[];
}

// WorkExperience PDF component with TypeScript
const SkillsPDF: React.FC<SkillsPDFProps> = ({ skills }) => {

    return (
        <>
            <Text style={pdfStyles.sectionTitle}>SKILLS</Text>
            <View style={styles.skillContainer}>
                {skills.map((skill, index) => (
                    <Text key={index} style={styles.skillBox}>
                        {skill}
                    </Text>
                ))}
            </View>
        </>

    );
};

export default SkillsPDF;
