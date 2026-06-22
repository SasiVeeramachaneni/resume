'use client';
import React, { useState, useRef, useLayoutEffect } from 'react';
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

const SECTION_SIDES: Record<SectionName, 'left' | 'right'> = {
  workExperience: 'left',
  projects: 'left',
  skills: 'right',
  certifications: 'right',
  awards: 'right',
  education: 'right',
  languages: 'right',
  patents: 'right',
};

export default function ResumeBuilder() {
  const resumeContext = React.useContext(ResumeContext);

  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { resumeData, updateWorkExperience, updateProjects, updateEducation, updateAwards, updateCertifications, updateSkills, updateLanguages, updatePatents } = resumeContext;
  const { isPatents, isPersonalProjects, isLanguages, template } = resumeData.settings;

  const [activeSection, setActiveSection] = useState<SectionName | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const innerContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Partial<Record<SectionName, HTMLDivElement | null>>>({});
  const [widgetPos, setWidgetPos] = useState<{ top: number; side: 'left' | 'right' } | null>(null);

  const handleEditingChange = (section: SectionName, index: number | null) => {
    setActiveSection(index !== null ? section : null);
    setEditingIndex(index);
  };

  useLayoutEffect(() => {    const updatePos = () => {
      if (
        activeSection &&
        editingIndex !== null &&
        innerContainerRef.current &&
        sectionRefs.current[activeSection]
      ) {
        const containerRect = innerContainerRef.current.getBoundingClientRect();
        const sectionRect = sectionRefs.current[activeSection]!.getBoundingClientRect();
        setWidgetPos({
          top: sectionRect.top - containerRect.top + 4,
          side: template === 'classic' ? 'left' : SECTION_SIDES[activeSection],
        });
      } else {
        setWidgetPos(null);
      }
    };

    updatePos();
    window.addEventListener('resize', updatePos);
    return () => window.removeEventListener('resize', updatePos);
  }, [activeSection, editingIndex, resumeData, template]);

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

  const renderSection = (section: SectionName, side: 'left' | 'right', children: React.ReactNode) => {
    return (
      <div
        ref={(el) => {
          sectionRefs.current[section] = el;
        }}
      >
        {children}
      </div>
    );
  };

  return (
    <>
      <ResumeHeader />
      <Container pt={20} pb={40} fluid bg="var(--mantine-color-blue-light)">
        <Container ref={innerContainerRef} size="xl" pt={40} pb={40} bg="var(--mantine-color-white)" style={{ position: 'relative' }}>
          {widgetPos && (
            <div
              style={{
                position: 'absolute',
                top: `${widgetPos.top}px`,
                ...(widgetPos.side === 'left' ? { left: '-36px' } : { right: '-36px' }),
                zIndex: 10,
              }}
            >
              <ReorderWidget
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDelete={handleDelete}
                isFirst={editingIndex === 0}
                isLast={activeSection !== null && editingIndex === getData(activeSection).length - 1}
              />
            </div>
          )}
          <PersonalInfo />
          {template === 'classic' ? (
            <>
              {renderSection('skills', 'right',
                <Skills editingIndex={activeSection === 'skills' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('skills', i)} />
              )}
              {renderSection('workExperience', 'left',
                <WorkExperience editingIndex={activeSection === 'workExperience' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('workExperience', i)} />
              )}
              {isPersonalProjects && renderSection('projects', 'left',
                <Projects editingIndex={activeSection === 'projects' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('projects', i)} />
              )}
              {renderSection('certifications', 'right',
                <Certifications editingIndex={activeSection === 'certifications' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('certifications', i)} />
              )}
              {renderSection('awards', 'right',
                <Awards editingIndex={activeSection === 'awards' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('awards', i)} />
              )}
              {renderSection('education', 'right',
                <Education editingIndex={activeSection === 'education' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('education', i)} />
              )}
              {isLanguages && renderSection('languages', 'right',
                <Languages editingIndex={activeSection === 'languages' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('languages', i)} />
              )}
              {isPatents && renderSection('patents', 'right',
                <Patents editingIndex={activeSection === 'patents' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('patents', i)} />
              )}
            </>
          ) : (
            <Container fluid>
              <Grid columns={12} pt={10}>
                <Grid.Col span={8}>
                  {renderSection('workExperience', 'left',
                    <WorkExperience editingIndex={activeSection === 'workExperience' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('workExperience', i)} />
                  )}
                  {isPersonalProjects && renderSection('projects', 'left',
                    <Projects editingIndex={activeSection === 'projects' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('projects', i)} />
                  )}
                </Grid.Col>
                <Grid.Col span={4}>
                  {renderSection('skills', 'right',
                    <Skills editingIndex={activeSection === 'skills' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('skills', i)} />
                  )}
                  {renderSection('certifications', 'right',
                    <Certifications editingIndex={activeSection === 'certifications' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('certifications', i)} />
                  )}
                  {renderSection('awards', 'right',
                    <Awards editingIndex={activeSection === 'awards' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('awards', i)} />
                  )}
                  {renderSection('education', 'right',
                    <Education editingIndex={activeSection === 'education' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('education', i)} />
                  )}
                  {isLanguages && renderSection('languages', 'right',
                    <Languages editingIndex={activeSection === 'languages' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('languages', i)} />
                  )}
                  {isPatents && renderSection('patents', 'right',
                    <Patents editingIndex={activeSection === 'patents' ? editingIndex : null} onEditingChange={(i) => handleEditingChange('patents', i)} />
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
