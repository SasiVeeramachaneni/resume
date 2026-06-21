// components/PersonalInfo/PersonalInfoPDF.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { ResumeData } from '../declarations/types';
import WorkExperiencePDF from '../WorkExp/WorkExpPDF'
import SkillsPDF from '../Skills/SkillsPDF';
import CertificationsPDF from '../Certifications/CertificationsPDF';
import AwardsPDF from '../Awards/AwardsPDF';
import EducationPDF from '../Education/EducationPDF';
import LanguagesPDF from '../Languages/LanguagesPDF';
import PatentsPDF from '../Patents/PatentsPDF';
import ProjectsPDF from '../Projects/ProjectsPDF';

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
    headerRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom:5
    },
    imageCol: {
        marginRight: 15,
    },
    image: {
        height: 80,
        objectFit: 'contain' as const,
        borderRadius: 8,
    },
    infoCol: {
        flex: 1,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#000',
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
    const { personalInfo, settings, workExperience, skills, certifications, awards, education, patents, projects } = resumeData;
    const languages = resumeData.languages ?? [];
    const hasLanguages = languages.some((language) => language.name.trim() || language.proficiency.trim());
    const { name, title, aboutMe, phoneNumber, email, linkedIn, image } = personalInfo;
    const isImageEnabled = settings.isImage;
    const isClassicTemplate = settings.template === 'classic';
    const sectionItems = [
        <SkillsPDF key="skills" skills={skills} />,
        <WorkExperiencePDF key="work" workExperience={workExperience} />,
        settings.isPersonalProjects && <ProjectsPDF key="projects" projects={projects} />,
        settings.isCertifications && <CertificationsPDF key="certifications" certifications={certifications} />,
        settings.isAwards && <AwardsPDF key="awards" awards={awards} />,
        <EducationPDF key="education" education={education} />,
        (settings.isLanguages || hasLanguages) && <LanguagesPDF key="languages" languages={languages} />,
        settings.isPatents && <PatentsPDF key="patents" patents={patents} />,
    ].filter(Boolean);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                {isImageEnabled && personalInfo.image && (
                    <View style={styles.imageCol}>
                        <Image style={styles.image} src={personalInfo.image} />
                    </View>
                )}
                <View style={styles.infoCol}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.aboutMe}>{aboutMe}</Text>
                </View>
            </View>
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
            {isClassicTemplate ? (
                <View>
                    {sectionItems}
                </View>
            ) : (
                <View style={styles.grid}>
                    {/* Equivalent to Grid.Col span={8} */}
                    <View style={styles.col8}>
                        <WorkExperiencePDF workExperience={workExperience} />
                        {settings.isPersonalProjects && <ProjectsPDF projects={projects} />}
                    </View>

                    {/* Equivalent to Grid.Col span={4} */}
                    <View style={styles.col4}>
                        <SkillsPDF skills={skills} />
                        {settings.isCertifications && <CertificationsPDF certifications={certifications} />}
                        {settings.isAwards && <AwardsPDF awards={awards} />}
                        <EducationPDF education={education} />
                        {(settings.isLanguages || hasLanguages) && <LanguagesPDF languages={languages} />}
                        {settings.isPatents && <PatentsPDF patents={patents} />}
                    </View>
                </View>
            )}
        </View>
    );
};
