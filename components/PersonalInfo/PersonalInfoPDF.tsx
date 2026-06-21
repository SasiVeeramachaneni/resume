// components/PersonalInfo/PersonalInfoPDF.tsx
import React from 'react';
import { View, Text, Image, Link, Svg, Path, StyleSheet } from '@react-pdf/renderer';
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
        marginRight: 4,
        fontSize: 8,
        fontWeight: 700,
    },
    iconSvg: {
        marginRight: 4,
    },
    inputText: {
        fontSize: 7,
        color: '#333',
    },
    linkText: {
        fontSize: 7,
        color: '#333',
        textDecoration: 'underline',
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
    const { name, title, aboutMe, phoneNumber, email, linkedIn, github, image } = personalInfo;
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
                    {phoneNumber && (
                        <View style={styles.inputContainer}>
                            <Svg width="10" height="10" viewBox="0 0 24 24" style={styles.iconSvg}>
                                <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="#333"/>
                            </Svg>
                            <Text style={styles.inputText}>{phoneNumber}</Text>
                        </View>
                    )}
                    {email && (
                        <View style={styles.inputContainer}>
                            <Svg width="10" height="10" viewBox="0 0 24 24" style={styles.iconSvg}>
                                <Path d="M22 6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" fill="#333"/>
                            </Svg>
                            <Text style={styles.inputText}>{email}</Text>
                        </View>
                    )}
                    {settings.isLinkedIn && linkedIn && (
                        <View style={styles.inputContainer}>
                            <Svg width="10" height="10" viewBox="0 0 24 24" style={styles.iconSvg}>
                                <Path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" fill="none" stroke="#333" strokeWidth="2"/>
                                <Path d="M8 11v5" stroke="#333" strokeWidth="2"/>
                                <Path d="M8 8v0" stroke="#333" strokeWidth="2"/>
                                <Path d="M12 16v-5" stroke="#333" strokeWidth="2"/>
                                <Path d="M16 16v-3a2 2 0 0 0 -4 0" stroke="#333" strokeWidth="2"/>
                            </Svg>
                            <Link src={linkedIn} style={styles.linkText}>LinkedIn</Link>
                        </View>
                    )}
                    {settings.isGithub && github && (
                        <View style={styles.inputContainer}>
                            <Svg width="10" height="10" viewBox="0 0 24 24" style={styles.iconSvg}>
                                <Path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="#333"/>
                            </Svg>
                            <Link src={github} style={styles.linkText}>GitHub</Link>
                        </View>
                    )}
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
