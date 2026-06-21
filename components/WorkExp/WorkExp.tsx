import React, { useState, useContext, useEffect } from 'react';
import { Container, TextInput, Button, Title, Checkbox, Textarea, Group, Text } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext';

export function WorkExperience({ editingIndex, onEditingChange }: { editingIndex: number | null; onEditingChange: (index: number | null) => void }) {
  const resumeContext = useContext(ResumeContext);
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { resumeData, updateWorkExperience } = resumeContext;

  let experiences = resumeData.workExperience;

  const [errors, setErrors] = useState<number[]>([]);

  useEffect(() => {
    if (experiences.length === 0) {
      updateWorkExperience([{ organization: '', from: '', to: '', isCurrent: false, role: '', points: [''] }]);
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

    const newExperiences = [
      ...experiences,
      { organization: '', from: '', to: '', isCurrent: false, role: '', points: [''] }
    ];
    updateWorkExperience(newExperiences);
    setErrors([]);
    setTimeout(() => {
      onEditingChange(experiences.length);
      document.getElementById(`work-org-${experiences.length}`)?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: string, value: string | boolean) => {
    const newExperiences = [...experiences];

    if (field === 'from' || field === 'to') {
      newExperiences[index] = { ...newExperiences[index], [field]: value };
    } else if (field === 'isCurrent') {
      newExperiences[index] = { ...newExperiences[index], isCurrent: value as boolean };
    } else {
      if (typeof value === 'string') {
        newExperiences[index] = { ...newExperiences[index], [field]: value };
      }
    }

    updateWorkExperience(newExperiences);

    if (errors.includes(index) && (typeof value === 'string' ? value.trim() !== '' : true)) {
      const newErrors = errors.filter(errIndex => errIndex !== index);
      setErrors(newErrors);
    }

    onEditingChange(index);
  };

  const formatDate = (date: string | null | undefined) => {
    return date ? date : '';
  };

  const handlePointChange = (expIndex: number, pointIndex: number, value: string) => {
    const newExperiences = [...experiences];
    newExperiences[expIndex].points[pointIndex] = value;
    updateWorkExperience(newExperiences);
  };

  const addBulletPoint = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences[index].points.push('');
    updateWorkExperience(newExperiences);
  };

  const removeBulletPoint = (expIndex: number, pointIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[expIndex].points.splice(pointIndex, 1);
    updateWorkExperience(newExperiences);
  };

  const handlePointKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    expIndex: number,
    pointIndex: number
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      addBulletPoint(expIndex);
      setTimeout(() => {
        document.getElementById(`point-${expIndex}-${pointIndex + 1}`)?.focus();
      }, 0);
    } else if (e.key === 'Backspace' && e.currentTarget.value === '' && pointIndex > 0) {
      e.preventDefault();

      removeBulletPoint(expIndex, pointIndex);
      setTimeout(() => {
        document.getElementById(`point-${expIndex}-${pointIndex - 1}`)?.focus();
      }, 0);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title order={3} style={{ color: 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-4))' }}>EXPERIENCE</Title>
        <Button onClick={handleAddExperience} variant="outline" size="xs">
          +Add
        </Button>
      </div>
      <Container p={0} m={0} fluid style={{ paddingInline: 0 }}>
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
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <input
                  id={`work-org-${index}`}
                  placeholder="Organization Name"
                  value={exp.organization}
                  onChange={(e) => handleChange(index, 'organization', e.currentTarget.value)}
                  onFocus={() => onEditingChange(index)}
                  onBlur={() => onEditingChange(null)}
                  style={{
                    fontWeight: 'bold',
                    width: '400px',
                    border: errors.includes(index) && exp.organization.trim() === '' ? '1px solid red' : 'none',
                    fontSize: '20px',
                    outline: 'none',
                    backgroundColor: 'transparent',
                  }}
                />
                <Group gap={1} pr={2}>
                  <TextInput
                    placeholder="mm/yyyy"
                    value={formatDate(exp.from)}
                    size="sm"
                    onChange={(e) => handleChange(index, 'from', e.currentTarget.value)}
                    onFocus={() => onEditingChange(index)}
                    onBlur={() => onEditingChange(null)}
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
                        value={formatDate(exp.to)}
                        size="sm"
                        onChange={(e) => handleChange(index, 'to', e.currentTarget.value)}
                        onFocus={() => onEditingChange(index)}
                        onBlur={() => onEditingChange(null)}
                        style={{ fontStyle: 'italic', width: '83px' }}
                      />
                    </>
                  )}
                </Group>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <input
                  placeholder="Role in Organization"
                  value={exp.role}
                  onChange={(e) => handleChange(index, 'role', e.currentTarget.value)}
                  onFocus={() => onEditingChange(index)}
                  onBlur={() => onEditingChange(null)}
                  style={{
                    fontStyle: 'italic',
                    width: '400px',
                    fontSize: '18px',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    border: 'none',
                  }}
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
                    onFocus={() => onEditingChange(index)}
                    onBlur={() => onEditingChange(null)}
                    autosize
                    minRows={1}
                    style={{
                      lineHeight: '24px',
                      width: '100%',
                      padding: '0',
                    }}
                />
                </div>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}
