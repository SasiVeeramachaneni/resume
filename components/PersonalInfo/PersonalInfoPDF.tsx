// components/PersonalInfo/PersonalInfoPDF.tsx
import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '../declarations/types';
import WorkExperiencePDF from '../WorkExp/WorkExpPDF'
import SkillsPDF from '../Skills/SkillsPDF';
import CertificationsPDF from '../Certifications/CertificationsPDF';
import AwardsPDF from '../Awards/AwardsPDF';
import EducationPDF from '../Education/EducationPDF';

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    name: {
        fontWeight: 900,
        fontSize: 16,
        paddingBottom: 4,
        color: '#448DEC'
    },
    title: {
        fontSize: 12,
        fontWeight: 800,
        paddingBottom: 4,
        color: '#333',
    },
    aboutMe: {
        fontSize: 8,
        paddingBottom: 4,
        color: '#333',
        lineHeight: 1.8,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#000', // Change color as needed
    },
    contactSection: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        flexGrow: 1,
    },
    icon: {
        marginRight: 5,
        fontSize: 7,
    },
    inputText: {
        fontSize: 7,
        color: '#333',
    },
    grid: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    col8: {
        flex: 2, // Spans 8/12 columns
    },
    col4: {
        flex: 1,
        paddingLeft: 10 // Spans 4/12 columns
    }
});

interface PersonalInfoPDFProps {
    resumeData: ResumeData;
}

export const PersonalInfoPDF: React.FC<PersonalInfoPDFProps> = ({ resumeData }) => {
    const { personalInfo, settings, workExperience, skills, certifications, awards, education } = resumeData;
    const { name, title, aboutMe, phoneNumber, email, linkedIn } = personalInfo;
    const isImageEnabled = settings.isImage;

    return (
        <View style={styles.container}>
            {isImageEnabled && (
                <View>
                    {/* Image Placeholder - Update to actual image if needed */}
                    <Text>Image Placeholder</Text>
                </View>
            )}
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.aboutMe}>{aboutMe}</Text>
            <View style={styles.divider} />
            <View style={{ paddingTop: '5px', paddingBottom: '5px' }}>
                <View style={styles.contactSection}>

                    {/* Phone Number */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.icon}>📞</Text>
                        <Text style={styles.inputText}>{phoneNumber}</Text>
                    </View>

                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.icon}>✉️</Text>
                        <Text style={styles.inputText}>{email}</Text>
                    </View>

                    {/* LinkedIn */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.icon}>🔗</Text>
                        <Text style={styles.inputText}>{linkedIn}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.divider} />
            <View style={styles.grid}>
                {/* Equivalent to Grid.Col span={8} */}
                <View style={styles.col8}>
                    <WorkExperiencePDF workExperience={workExperience} />
                </View>

                {/* Equivalent to Grid.Col span={4} */}
                <View style={styles.col4}>
                    <SkillsPDF skills={skills} />
                    <CertificationsPDF certifications={certifications} />
                    <AwardsPDF awards={awards} />
                    <EducationPDF education={education} />
                </View>
            </View>
        </View>
    );
};
