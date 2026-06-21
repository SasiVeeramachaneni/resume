import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Textarea, TextInput, Title } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext';

const blankProject = { name: '', githubLink: '', websiteLink: '', description: '' };

export function Projects({ editingIndex, onEditingChange }: { editingIndex: number | null; onEditingChange: (index: number | null) => void }) {
  const resumeContext = useContext(ResumeContext);

  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { resumeData, updateProjects } = resumeContext;
  const projects = resumeData.projects;
  const [errors, setErrors] = useState<number[]>([]);

  useEffect(() => {
    if (projects.length === 0) {
      updateProjects([blankProject]);
    }
  }, [projects, updateProjects]);

  const handleAddProject = () => {
    const emptyFields = projects.some((project) => project.name.trim() === '');

    if (emptyFields) {
      const newErrors = projects
        .map((project, index) => (project.name.trim() === '' ? index : -1))
        .filter((index) => index !== -1);
      setErrors(newErrors);
      return;
    }

    updateProjects([...projects, blankProject]);
    setErrors([]);
    setTimeout(() => {
      onEditingChange(projects.length);
      document.getElementById(`project-name-${projects.length}`)?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    updateProjects(newProjects);

    if (errors.includes(index) && newProjects[index].name.trim() !== '') {
      setErrors(errors.filter((errorIndex) => errorIndex !== index));
    }

    onEditingChange(index);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '5px' }}>
        <Title order={3} style={{ color: 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-4))' }}>PROJECTS</Title>
        <Button onClick={handleAddProject} variant="outline" size="xs">
          +Add
        </Button>
      </div>
      <Container p={0} m={0} fluid style={{ paddingInline: 0 }}>
        {projects.map((project, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              backgroundColor: editingIndex === index ? '#eff8ff' : 'transparent',
              borderRadius: '4px',
            }}
          >
            <div>
              <TextInput
                id={`project-name-${index}`}
                placeholder="Project Name"
                variant="unstyled"
                value={project.name}
                size="md"
                onChange={(e) => handleChange(index, 'name', e.currentTarget.value)}
                onFocus={() => onEditingChange(index)}
                onBlur={() => onEditingChange(null)}
                style={{
                  fontWeight: 'bold',
                  border: errors.includes(index) && project.name.trim() === '' ? '1px solid red' : 'none',
                }}
              />
              <Textarea
                placeholder="Project description"
                variant="unstyled"
                value={project.description}
                size="sm"
                autosize
                minRows={1}
                maxRows={3}
                onChange={(e) => handleChange(index, 'description', e.currentTarget.value)}
                onFocus={() => onEditingChange(index)}
                onBlur={() => onEditingChange(null)}
              />
              <TextInput
                placeholder="GitHub link"
                variant="unstyled"
                value={project.githubLink}
                size="sm"
                onChange={(e) => handleChange(index, 'githubLink', e.currentTarget.value)}
                onFocus={() => onEditingChange(index)}
                onBlur={() => onEditingChange(null)}
                style={{ fontStyle: 'italic' }}
              />
              <TextInput
                placeholder="Website link"
                variant="unstyled"
                value={project.websiteLink}
                size="sm"
                onChange={(e) => handleChange(index, 'websiteLink', e.currentTarget.value)}
                onFocus={() => onEditingChange(index)}
                onBlur={() => onEditingChange(null)}
                style={{ fontStyle: 'italic' }}
              />
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}
