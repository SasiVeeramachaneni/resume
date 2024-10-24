'use client';
import React, { useState, useContext, useEffect } from 'react';
import { Container, TextInput, Button, Title } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext'; // Adjust the import path as necessary

export function Awards() {

  const resumeContext = useContext(ResumeContext); // Use context
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider'); // Error if context is undefined
  }

  const { resumeData, updateAwards } = resumeContext; // Destructure resumeData and updateAwards from context

  const [errors, setErrors] = useState<number[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  let awards = resumeData.awards;

  // Ensure there's always a blank default award
  useEffect(() => {
    if (awards.length === 0) {
      updateAwards([{ name: '', organization: '' }]); // Add a blank award
    }
  }, [awards, updateAwards]);

  const handleAddAward = () => {
    // Check if all mandatory fields are filled
    const emptyFields = awards.some(award => award.name.trim() === '' || award.organization.trim() === '');
    if (emptyFields) {
      const newErrors = awards
        .map((award, index) => (award.name.trim() === '' || award.organization.trim() === '' ? index : -1))
        .filter(index => index !== -1);
      setErrors(newErrors);
      return;
    }

    // Add a new blank award and update the context
    const newAwards = [...awards, { name: '', organization: '' }];
    updateAwards(newAwards);
    setErrors([]);
    setTimeout(() => {
      setEditingIndex(awards.length); // Set focus on the new award
      document.getElementById(`award-name-${awards.length}`)?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newAwards = [...awards];
    newAwards[index] = { ...newAwards[index], [field]: value };
    updateAwards(newAwards); // Update the context whenever an award is changed

    if (errors.includes(index)) {
      const newErrors = [...errors];
      if (newAwards[index].name.trim() !== '' && newAwards[index].organization.trim() !== '') {
        newErrors.splice(newErrors.indexOf(index), 1);
        setErrors(newErrors);
      }
    }

    setEditingIndex(index);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '5px' }}>
        <Title order={3}>Awards</Title>
        <Button onClick={handleAddAward} variant="outline" size="xs">
          +Add
        </Button>
      </div>
      <Container p={0}>
        {awards.map((award, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              backgroundColor: editingIndex === index ? '#eff8ff' : 'transparent',
              borderRadius: '4px'
            }}
          >
            <TextInput
              id={`award-name-${index}`}
              placeholder="Award Name"
              variant="unstyled"
              value={award.name}
              size="md"
              onChange={(e) => handleChange(index, 'name', e.currentTarget.value)}
              onFocus={() => setEditingIndex(index)}
              onBlur={() => setEditingIndex(null)}
              style={{
                fontWeight: 'bold',
                border: errors.includes(index) && award.name.trim() === '' ? '0.25px solid red' : 'none'
              }}
            />
            <TextInput
              placeholder="Issuing Organization"
              variant='unstyled'
              value={award.organization}
              size="sm"
              onChange={(e) => handleChange(index, 'organization', e.currentTarget.value)}
              onFocus={() => setEditingIndex(index)}
              onBlur={() => setEditingIndex(null)}
              style={{
                fontStyle: 'italic',
                border: errors.includes(index) && award.organization.trim() === '' ? '0.25px solid red' : 'none'
              }}
            />
          </div>
        ))}
      </Container>
    </>
  );
}
