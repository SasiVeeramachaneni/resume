'use client';
import React, { useState } from 'react';
import { ResumeHeader } from "@/components/ResumeHeader/ResumeHeader";
import { Container, Grid } from '@mantine/core';
import { PersonalInfo } from "@/components/PersonalInfo/PersonalInfo";
import { Skills } from '@/components/Skills/Skills';
import { Certifications } from '@/components/Certifications/Certifications';
import { Awards } from '@/components/Awards/Awards';
import { Education } from '@/components/Education/Education';
import { Languages } from '@/components/Languages/Languages';
import { Patents } from '@/components/Patents/Patents';
import { Projects } from '@/components/Projects/Projects';
import { WorkExperience } from '@/components/WorkExp/WorkExp';
import { ReorderWidget } from '@/components/ReorderWidget/ReorderWidget';
import { ResumeContext } from '@/components/declarations/ResumeContext';
import type { WorkExperience as WorkExpType, Project, Education as EduType, Award, Certification, Language, Patent } from '@/components/declarations/types';

type SectionName = 'workExperience' | 'projects' | 'education' | 'awards' | 'certifications' | 'skills' | 'languages' | 'patents';

export default function ResumeBuilder() {
  const resumeContext = React.useContext(ResumeContext);

  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { resumeData, updateWorkExperience, updateProjects, updateEducation, updateAwards, updateCertifications, updateSkills, updateLanguages, updatePatents } = resumeContext;
  const { isPatents, isPersonalProjects, isLanguages, template } = resumeData.settings;

  const [activeSection, setActiveSection] = useState<SectionName | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEditingChange = (section: SectionName, index: number | null) => {
    setActiveSection(index !== null ? section : null);
    setEditingIndex(index);
  };

  const isActive = (section: SectionName) => activeSection === section && editingIndex !== null;

  function getData(section: SectionName) {
    switch (section) {
      case 'workExperience': return resumeData.workExperience;
      case 'projects': return resumeData.projects;
      case 'education': return resumeData.education;
      case 'awards': return resumeData.awards;
      case 'certifications': return resumeData.certifications;
      case 'skills': return resumeData.skills;
      case 'languages': return resumeData.languages;
      case 'patents': return resumeData.patents;
    }
  }

  function updateData(section: SectionName, data: any) {
    switch (section) {
      case 'workExperience': updateWorkExperience(data as WorkExpType[]); break;
      case 'projects': updateProjects(data as Project[]); break;
      case 'education': updateEducation(data as EduType[]); break;
      case 'awards': updateAwards(data as Award[]); break;
      case 'certifications': updateCertifications(data as Certification[]); break;
      case 'skills': updateSkills(data as string[]); break;
      case 'languages': updateLanguages(data as Language[]); break;
      case 'patents': updatePatents(data as Patent[]); break;
    }
  }

  const handleMoveUp = () => {
    if (activeSection === null || editingIndex === null || editingIndex === 0) return;
    const data = [...getData(activeSection)];
    [data[editingIndex - 1], data[editingIndex]] = [data[editingIndex], data[editingIndex - 1]];
    updateData(activeSection, data);
    setEditingIndex(editingIndex - 1);
  };

  const handleMoveDown = () => {
    if (activeSection === null || editingIndex === null) return;
    const data = [...getData(activeSection)];
    if (editingIndex === data.length - 1) return;
    [data[editingIndex], data[editingIndex + 1]] = [data[editingIndex + 1], data[editingIndex]];
    updateData(activeSection, data);
    setEditingIndex(editingIndex + 1);
  };

  const handleDelete = () => {
    if (activeSection === null || editingIndex === null) return;
    const data = [...getData(activeSection)];
    data.splice(editingIndex, 1);
    updateData(activeSection, data);
    setEditingIndex(null);
    setActiveSection(null);
  };

  const SectionShell = ({ section, side, children }: { section: SectionName; side: 'left' | 'right'; children: React.ReactNode }) => {
    const padding = side === 'left' ? { paddingLeft: '28px' } : { paddingRight: '28px' };
    const position = side === 'left' ? { left: '0' } : { right: '0' };
    const data = getData(section);

    return (
      <div style={{ position: 'relative' }}>
        {children}
        {isActive(section) && (
          <div style={{ position: 'absolute', ...position, top: '4px' }}>
            <ReorderWidget
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onDelete={handleDelete}
              isFirst={editingIndex === 0}
              isLast={editingIndex === data.length - 1}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <ResumeHeader />
      <Container pt={20} pb={40} fluid bg="var(--mantine-color-blue-light)">
        <Container size="xl" pt={40} pb={40} bg="var(--mantine-color-white)">
          <PersonalInfo />
          {template === 'classic' ? (
            <>
              <SectionShell section="skills" side="right">
                <Skills editingIndex={activeSection === 'skills' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('skills', i)} />
              </SectionShell>
              <SectionShell section="workExperience" side="left">
                <WorkExperience editingIndex={activeSection === 'workExperience' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('workExperience', i)} />
              </SectionShell>
              {isPersonalProjects && (
                <SectionShell section="projects" side="left">
                  <Projects editingIndex={activeSection === 'projects' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('projects', i)} />
                </SectionShell>
              )}
              <SectionShell section="certifications" side="right">
                <Certifications editingIndex={activeSection === 'certifications' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('certifications', i)} />
              </SectionShell>
              <SectionShell section="awards" side="right">
                <Awards editingIndex={activeSection === 'awards' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('awards', i)} />
              </SectionShell>
              <SectionShell section="education" side="right">
                <Education editingIndex={activeSection === 'education' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('education', i)} />
              </SectionShell>
              {isLanguages && (
                <SectionShell section="languages" side="right">
                  <Languages editingIndex={activeSection === 'languages' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('languages', i)} />
                </SectionShell>
              )}
              {isPatents && (
                <SectionShell section="patents" side="right">
                  <Patents editingIndex={activeSection === 'patents' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('patents', i)} />
                </SectionShell>
              )}
            </>
          ) : (
            <Container fluid>
              <Grid columns={12} pt={10}>
                <Grid.Col span={8}>
                  <SectionShell section="workExperience" side="left">
                    <WorkExperience editingIndex={activeSection === 'workExperience' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('workExperience', i)} />
                  </SectionShell>
                  {isPersonalProjects && (
                    <SectionShell section="projects" side="left">
                      <Projects editingIndex={activeSection === 'projects' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('projects', i)} />
                    </SectionShell>
                  )}
                </Grid.Col>
                <Grid.Col span={4}>
                  <SectionShell section="skills" side="right">
                    <Skills editingIndex={activeSection === 'skills' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('skills', i)} />
                  </SectionShell>
                  <SectionShell section="certifications" side="right">
                    <Certifications editingIndex={activeSection === 'certifications' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('certifications', i)} />
                  </SectionShell>
                  <SectionShell section="awards" side="right">
                    <Awards editingIndex={activeSection === 'awards' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('awards', i)} />
                  </SectionShell>
                  <SectionShell section="education" side="right">
                    <Education editingIndex={activeSection === 'education' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('education', i)} />
                  </SectionShell>
                  {isLanguages && (
                    <SectionShell section="languages" side="right">
                      <Languages editingIndex={activeSection === 'languages' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('languages', i)} />
                    </SectionShell>
                  )}
                  {isPatents && (
                    <SectionShell section="patents" side="right">
                      <Patents editingIndex={activeSection === 'patents' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('patents', i)} />
                    </SectionShell>
                  )}
                </Grid.Col>
              </Grid>
            </Container>
          )}
        </Container>
      </Container>
    </>
  );
}
