import React, { useState, useContext, useEffect } from 'react';
import { Container, TextInput, Button, Title } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext';

export function Education({ editingIndex, onEditingChange }: { editingIndex: number | null; onEditingChange: (index: number | null) => void }) {

  const resumeContext = useContext(ResumeContext);
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { resumeData, updateEducation } = resumeContext;

  let educations = resumeData.education;
  const [errors, setErrors] = useState<number[]>([]);

  useEffect(() => {
    if (educations.length === 0) {
      updateEducation([{ degree: '', college: '', discipline: '', year: NaN, percentage: NaN }]);
    }
  }, [educations, updateEducation]);

  const handleAddEducation = () => {
    const emptyFields = educations.some(edu => edu.degree.trim() === '' || edu.college.trim() === '');
    if (emptyFields) {
      const newErrors = educations
        .map((edu, index) => (edu.degree.trim() === '' || edu.college.trim() === '' ? index : -1))
        .filter(index => index !== -1);
      setErrors(newErrors);
      return;
    }

    const newEducations = [...educations, { degree: '', college: '', discipline: '', year: NaN, percentage: NaN }];
    updateEducation(newEducations);
    setErrors([]);
    setTimeout(() => {
      onEditingChange(educations.length);
      document.getElementById(`edu-degree-${educations.length}`)?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newEducations = [...educations];

    if (field === 'year' || field === 'percentage') {
      newEducations[index] = { ...newEducations[index], [field]: parseFloat(value) || NaN };
    } else {
      newEducations[index] = { ...newEducations[index], [field]: value };
    }

    updateEducation(newEducations);

    if (errors.includes(index)) {
      const newErrors = [...errors];
      if (newEducations[index].degree.trim() !== '' && newEducations[index].college.trim() !== '') {
        newErrors.splice(newErrors.indexOf(index), 1);
        setErrors(newErrors);
      }
    }

    onEditingChange(index);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '5px' }}>
        <Title order={3} style={{color: 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-4))'}}>EDUCATION</Title>
        <Button onClick={handleAddEducation} variant="outline" size="xs">
          +Add
        </Button>
      </div>
      <Container p={0} m={0} fluid style={{ paddingInline: 0 }}>
        {educations.map((edu, index) => (
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
                id={`edu-degree-${index}`}
                placeholder="Name of Degree"
                variant="unstyled"
                value={edu.degree}
                size="md"
                onChange={(e) => handleChange(index, 'degree', e.currentTarget.value)}
                onFocus={() => onEditingChange(index)}
                onBlur={() => onEditingChange(null)}
                style={{
                  fontWeight: 'bold',
                  border: errors.includes(index) && edu.degree.trim() === '' ? '1px solid red' : 'none'
                }}
                styles={{ root: { paddingLeft: 0 }, wrapper: { paddingLeft: 0 }, input: { paddingLeft: 0 } }}
              />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextInput
                  placeholder="Discipline"
                  variant='unstyled'
                  value={edu.discipline}
                  size="sm"
                  onChange={(e) => handleChange(index, 'discipline', e.currentTarget.value)}
                  onFocus={() => onEditingChange(index)}
                  onBlur={() => onEditingChange(null)}
                  style={{
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    width: '310px'
                  }}
                  styles={{ root: { paddingLeft: 0 }, wrapper: { paddingLeft: 0 }, input: { paddingLeft: 0 } }}
                />

                <TextInput
                  placeholder="Per%"
                  variant='unstyled'
                  value={edu.percentage ? edu.percentage.toString() : ''}
                  size="sm"
                  onChange={(e) => handleChange(index, 'percentage', e.currentTarget.value)}
                  onFocus={() => onEditingChange(index)}
                  onBlur={() => onEditingChange(null)}
                  style={{ fontStyle: 'italic', width: '60px' }}
                  styles={{ root: { paddingLeft: 0 }, wrapper: { paddingLeft: 0 }, input: { paddingLeft: 0 } }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextInput
                  placeholder="Name of the College/School"
                  variant='unstyled'
                  value={edu.college}
                  size="sm"
                  onChange={(e) => handleChange(index, 'college', e.currentTarget.value)}
                  onFocus={() => onEditingChange(index)}
                  onBlur={() => onEditingChange(null)}
                  style={{
                    fontWeight: 'bold',
                    width: '300px',
                    border: errors.includes(index) && edu.college.trim() === '' ? '1px solid red' : 'none'
                  }}
                  styles={{ root: { paddingLeft: 0 }, wrapper: { paddingLeft: 0 }, input: { paddingLeft: 0 } }}
                />
                <TextInput
                  placeholder="Year"
                  variant='unstyled'
                  value={edu.year ? edu.year.toString() : ''}
                  size="sm"
                  onChange={(e) => handleChange(index, 'year', e.currentTarget.value)}
                  onFocus={() => onEditingChange(index)}
                  onBlur={() => onEditingChange(null)}
                  style={{ fontStyle: 'italic', width: '60px' }}
                  styles={{ root: { paddingLeft: 0 }, wrapper: { paddingLeft: 0 }, input: { paddingLeft: 0 } }}
                />
              </div>
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}
