'use client';
import React, { useState, useContext, useEffect } from 'react';
import { Container, TextInput, Button, Title } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext'; // Adjust the import path as necessary

export function Education() {

  const resumeContext = useContext(ResumeContext); // Use context
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider'); // Error if context is undefined
  }

  const { resumeData, updateEducation } = resumeContext; // Destructure resumeData and updateEducation from context

  let educations = resumeData.education;
  const [errors, setErrors] = useState<number[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Ensure there's always a blank education entry
  useEffect(() => {
    if (educations.length === 0) {
      updateEducation([{ degree: '', college: '', discipline: '', year: NaN, percentage: NaN }]); // Set percentage as NaN
    }
  }, [educations, updateEducation]);

  const handleAddEducation = () => {
    // Check if all mandatory fields are filled
    const emptyFields = educations.some(edu => edu.degree.trim() === '' || edu.college.trim() === '');
    if (emptyFields) {
      const newErrors = educations
        .map((edu, index) => (edu.degree.trim() === '' || edu.college.trim() === '' ? index : -1))
        .filter(index => index !== -1);
      setErrors(newErrors);
      return;
    }

    // Add a new blank education and update the context
    const newEducations = [...educations, { degree: '', college: '', discipline: '', year: NaN, percentage: NaN }];
    updateEducation(newEducations); // Update the context
    setErrors([]);
    setTimeout(() => {
      setEditingIndex(educations.length);
      document.getElementById(`edu-degree-${educations.length}`)?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newEducations = [...educations];

    if (field === 'year' || field === 'percentage') {
      newEducations[index] = { ...newEducations[index], [field]: parseFloat(value) || NaN }; // Convert year and percentage to numbers
    } else {
      newEducations[index] = { ...newEducations[index], [field]: value };
    }

    updateEducation(newEducations); // Update the context whenever education is changed

    if (errors.includes(index)) {
      const newErrors = [...errors];
      if (newEducations[index].degree.trim() !== '' && newEducations[index].college.trim() !== '') {
        newErrors.splice(newErrors.indexOf(index), 1);
        setErrors(newErrors);
      }
    }

    setEditingIndex(index);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '5px' }}>
        <Title order={3}>Education</Title>
        <Button onClick={handleAddEducation} variant="outline" size="xs">
          +Add
        </Button>
      </div>
      <Container p={0}>
        {educations.map((edu, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              backgroundColor: editingIndex === index ? '#eff8ff' : 'transparent',
              borderRadius: '4px',
            }}
          >
            <TextInput
              id={`edu-degree-${index}`}
              placeholder="Name of Degree"
              variant="unstyled"
              value={edu.degree}
              size="md"
              onChange={(e) => handleChange(index, 'degree', e.currentTarget.value)}
              onFocus={() => setEditingIndex(index)}
              onBlur={() => setEditingIndex(null)}
              style={{
                fontWeight: 'bold',
                border: errors.includes(index) && edu.degree.trim() === '' ? '1px solid red' : 'none'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextInput
                placeholder="Discipline"
                variant='unstyled'
                value={edu.discipline}
                size="sm"
                onChange={(e) => handleChange(index, 'discipline', e.currentTarget.value)}
                onFocus={() => setEditingIndex(index)}
                onBlur={() => setEditingIndex(null)}
                style={{
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  width: '310px'
                }}
              />

              <TextInput
                placeholder="Per%"
                variant='unstyled'
                value={edu.percentage ? edu.percentage.toString() : ''}
                size="sm"
                onChange={(e) => handleChange(index, 'percentage', e.currentTarget.value)}
                onFocus={() => setEditingIndex(index)}
                onBlur={() => setEditingIndex(null)}
                style={{ fontStyle: 'italic', width: '60px' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextInput
                placeholder="Name of the College/School"
                variant='unstyled'
                value={edu.college}
                size="sm"
                onChange={(e) => handleChange(index, 'college', e.currentTarget.value)}
                onFocus={() => setEditingIndex(index)}
                onBlur={() => setEditingIndex(null)}
                style={{
                  fontWeight: 'bold',
                  width: '300px',
                  border: errors.includes(index) && edu.college.trim() === '' ? '1px solid red' : 'none'
                }}
              />
              <TextInput
                placeholder="Year"
                variant='unstyled'
                value={edu.year ? edu.year.toString() : ''}
                size="sm"
                onChange={(e) => handleChange(index, 'year', e.currentTarget.value)}
                onFocus={() => setEditingIndex(index)}
                onBlur={() => setEditingIndex(null)}
                style={{ fontStyle: 'italic', width: '60px' }}
              />
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}
