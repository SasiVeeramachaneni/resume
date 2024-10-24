'use client';
import React, { useState, useContext, useEffect } from 'react';
import { Container, TextInput, Button, Title, Checkbox, Textarea, Group, Text } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext';

export function WorkExperience() {
  const resumeContext = useContext(ResumeContext); // Use context
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider'); // Error if context is undefined
  }

  const { resumeData, updateWorkExperience } = resumeContext; // Destructure resumeData and updateWorkExperience from context
  
  let experiences = resumeData.workExperience;

  const [errors, setErrors] = useState<number[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Ensure there's always a blank work experience entry
  useEffect(() => {
    if (experiences.length === 0) {
      updateWorkExperience([{ organization: '', from: '', to: '', isCurrent: false, role: '', points: [''] }]); // Add default blank experience with empty strings for from and to
    }
  }, [experiences, updateWorkExperience]);

  const handleAddExperience = () => {
    const emptyFields = experiences.some(
      exp => exp.organization.trim() === '' || exp.from === ''
    );
    if (emptyFields) {
      const newErrors = experiences
        .map((exp, index) =>
          exp.organization.trim() === '' || exp.from === '' ? index : -1
        )
        .filter(index => index !== -1);
      setErrors(newErrors);
      return;
    }

    // Add a new blank work experience and update the context
    const newExperiences = [
      ...experiences,
      { organization: '', from: '', to: '', isCurrent: false, role: '', points: [''] }
    ];
    updateWorkExperience(newExperiences); // Update the context
    setErrors([]);
    setTimeout(() => {
      setEditingIndex(experiences.length);
      document.getElementById(`work-org-${experiences.length}`)?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: string, value: string | boolean) => {
    const newExperiences = [...experiences];

    if (field === 'from' || field === 'to') {
      newExperiences[index] = { ...newExperiences[index], [field]: value }; // Store value as string
    } else if (field === 'isCurrent') {
      // Handle boolean value for 'isCurrent'
      newExperiences[index] = { ...newExperiences[index], [field]: value };
    } else {
      // Handle other string fields
      if (typeof value === 'string') {
        newExperiences[index] = { ...newExperiences[index], [field]: value };
      }
    }

    updateWorkExperience(newExperiences); // Update the context

    if (errors.includes(index) && (typeof value === 'string' ? value.trim() !== '' : true)) {
      const newErrors = errors.filter(errIndex => errIndex !== index);
      setErrors(newErrors);
    }

    setEditingIndex(index);
  };

  // Format the Date object to mm/yyyy format
  const formatDate = (date: string | null) => {
    return date ? date : ''; // Return empty string if date is empty
  };

  const handlePointChange = (expIndex: number, pointIndex: number, value: string) => {
    const newExperiences = [...experiences];
    newExperiences[expIndex].points[pointIndex] = value;
    updateWorkExperience(newExperiences); // Update the context
  };

  const addBulletPoint = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences[index].points.push('');
    updateWorkExperience(newExperiences); // Update the context
  };

  const removeBulletPoint = (expIndex: number, pointIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[expIndex].points.splice(pointIndex, 1);
    updateWorkExperience(newExperiences); // Update the context
  };

  const handlePointKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    expIndex: number,
    pointIndex: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent new line

      // Add a new bullet point and move focus to it
      addBulletPoint(expIndex);
      setTimeout(() => {
        document.getElementById(`point-${expIndex}-${pointIndex + 1}`)?.focus();
      }, 0);
    } else if (e.key === 'Backspace' && e.currentTarget.value === '' && pointIndex > 0) {
      e.preventDefault(); // Prevent deleting the previous bullet's content

      // Remove the current bullet point if empty and move focus to the previous one
      removeBulletPoint(expIndex, pointIndex);
      setTimeout(() => {
        document.getElementById(`point-${expIndex}-${pointIndex - 1}`)?.focus();
      }, 0);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title order={3}>Work Experience</Title>
        <Button onClick={handleAddExperience} variant="outline" size="xs">
          +Add
        </Button>
      </div>
      <Container p={0}>
        {experiences.map((exp, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              backgroundColor: editingIndex === index ? '#eff8ff' : 'transparent',
              borderRadius: '4px',
              paddingTop: '2px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextInput
                id={`work-org-${index}`}
                placeholder="Organization Name"
                variant="unstyled"
                value={exp.organization}
                size="lg"
                onChange={(e) => handleChange(index, 'organization', e.currentTarget.value)}
                onFocus={() => setEditingIndex(index)}
                onBlur={() => setEditingIndex(null)}
                style={{
                  fontWeight: 'bold',
                  width: '400px',
                  border: errors.includes(index) && exp.organization.trim() === '' ? '1px solid red' : 'none'
                }}
              />
              <Group gap={1} pr={2}>
                <TextInput
                  placeholder="mm/yyyy"
                  value={formatDate(exp.from)} // Keep the date as blank initially
                  size="sm"
                  onChange={(e) => handleChange(index, 'from', e.currentTarget.value)}
                  onFocus={() => setEditingIndex(index)}
                  onBlur={() => setEditingIndex(null)}
                  style={{
                    fontStyle: 'italic',
                    width: '83px',
                    border: errors.includes(index) && exp.from === '' ? '1px solid red' : 'none'
                  }}
                />
                {!exp.isCurrent && (
                  <>
                    <Text>-</Text>
                    <TextInput
                      placeholder="mm/yyyy"
                      value={formatDate(exp.to)} // Keep the date as blank initially
                      size="sm"
                      onChange={(e) => handleChange(index, 'to', e.currentTarget.value)}
                      onFocus={() => setEditingIndex(index)}
                      onBlur={() => setEditingIndex(null)}
                      style={{ fontStyle: 'italic', width: '83px' }}
                    />
                  </>
                )}
              </Group>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextInput
                placeholder="Role in Organization"
                variant="unstyled"
                value={exp.role}
                size="md"
                onChange={(e) => handleChange(index, 'role', e.currentTarget.value)}
                onFocus={() => setEditingIndex(index)}
                onBlur={() => setEditingIndex(null)}
                style={{ fontWeight: 'bold', fontStyle: 'italic', width: '300px' }}
              />
              <Checkbox
                label="Current Organization"
                checked={exp.isCurrent}
                onChange={(e) => handleChange(index, 'isCurrent', e.currentTarget.checked)}
                size="sm"
              />
            </div>

            {exp.points.map((point, pointIndex) => (
              <div
                key={pointIndex}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  marginTop: '5px',
                  width: '100%',
                }}
              >
                <Text style={{ fontSize: '18px', lineHeight: '24px', paddingTop: '4px' }}>•</Text>
                <Textarea
                  id={`point-${index}-${pointIndex}`}
                  placeholder={`Bullet point ${pointIndex + 1}`}
                  variant="unstyled"
                  value={point}
                  size="md"
                  onChange={(e) => handlePointChange(index, pointIndex, e.currentTarget.value)}
                  onKeyDown={(e) => handlePointKeyPress(e, index, pointIndex)}
                  onFocus={() => setEditingIndex(index)}
                  onBlur={() => setEditingIndex(null)}
                  autosize
                  minRows={1}
                  maxRows={4}
                  style={{
                    lineHeight: '24px',
                    width: '100%',
                    padding: '0',
                  }}
                />
              </div>
            ))}


          </div>
        ))}
      </Container>
    </>
  );
}
