import React from 'react';
import { Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Project } from '../declarations/types';
import { pdfStyles } from '../ResumePDF/ResumeStyles';

const styles = StyleSheet.create({
  projectContainer: {
    paddingBottom: 10,
  },
  projectName: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingBottom: 2,
  },
  projectDescription: {
    fontSize: 8,
    color: '#333',
    lineHeight: 1.6,
    paddingBottom: 2,
  },
  links: {
    display: 'flex',
    flexDirection: 'row',
  },
  projectLink: {
    fontSize: 8,
    color: '#448DEC',
    textDecoration: 'none',
    marginRight: 8,
  },
});

interface ProjectsPDFProps {
  projects?: Project[];
}

const ProjectsPDF: React.FC<ProjectsPDFProps> = ({ projects }) => {
  const visibleProjects = (projects ?? []).filter(
    (project) =>
      project.name?.trim() ||
      project.description?.trim() ||
      project.githubLink?.trim() ||
      project.websiteLink?.trim()
  );

  if (visibleProjects.length === 0) {
    return null;
  }

  return (
    <>
      <Text style={pdfStyles.sectionTitle}>PROJECTS</Text>
      {visibleProjects.map((project, index) => (
        <View key={index} style={styles.projectContainer}>
          <Text style={styles.projectName}>{project.name}</Text>
          {project.description ? <Text style={styles.projectDescription}>{project.description}</Text> : null}
          {project.githubLink?.trim() || project.websiteLink?.trim() ? (
            <View style={styles.links}>
              {project.githubLink?.trim() ? (
                <Link src={project.githubLink} style={styles.projectLink}>
                  GitHub
                </Link>
              ) : null}
              {project.websiteLink?.trim() ? (
                <Link src={project.websiteLink} style={styles.projectLink}>
                  Website
                </Link>
              ) : null}
            </View>
          ) : null}
        </View>
      ))}
    </>
  );
};

export default ProjectsPDF;
