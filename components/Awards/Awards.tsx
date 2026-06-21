import React, { useState, useContext, useEffect } from 'react';
import { Container, TextInput, Button, Title } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext';

export function Awards({ editingIndex, onEditingChange }: { editingIndex: number | null; onEditingChange: (index: number | null) => void }) {

  const resumeContext = useContext(ResumeContext);
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { resumeData, updateAwards } = resumeContext;

  const [errors, setErrors] = useState<number[]>([]);

  let awards = resumeData.awards;

  useEffect(() => {
    if (awards.length === 0) {
      updateAwards([{ name: '', organization: '' }]);
    }
  }, [awards, updateAwards]);

  const handleAddAward = () => {
    const emptyFields = awards.some(award => award.name.trim() === '' || award.organization.trim() === '');
    if (emptyFields) {
      const newErrors = awards
        .map((award, index) => (award.name.trim() === '' || award.organization.trim() === '' ? index : -1))
        .filter(index => index !== -1);
      setErrors(newErrors);
      return;
    }

    const newAwards = [...awards, { name: '', organization: '' }];
    updateAwards(newAwards);
    setErrors([]);
    setTimeout(() => {
      onEditingChange(awards.length);
      document.getElementById(`award-name-${awards.length}`)?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newAwards = [...awards];
    newAwards[index] = { ...newAwards[index], [field]: value };
    updateAwards(newAwards);

    if (errors.includes(index)) {
      const newErrors = [...errors];
      if (newAwards[index].name.trim() !== '' && newAwards[index].organization.trim() !== '') {
        newErrors.splice(newErrors.indexOf(index), 1);
        setErrors(newErrors);
      }
    }

    onEditingChange(index);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '5px' }}>
        <Title order={3} style={{color: 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-4))'}}>AWARDS</Title>
        <Button onClick={handleAddAward} variant="outline" size="xs">
          +Add
        </Button>
      </div>
      <Container p={0} m={0} fluid style={{ paddingInline: 0 }}>
        {awards.map((award, index) => (
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
                id={`award-name-${index}`}
                placeholder="Award Name"
                variant="unstyled"
                value={award.name}
                size="md"
                onChange={(e) => handleChange(index, 'name', e.currentTarget.value)}
                onFocus={() => onEditingChange(index)}
                onBlur={() => onEditingChange(null)}
                style={{
                  fontWeight: 'bold',
                  border: errors.includes(index) && award.name.trim() === '' ? '0.25px solid red' : 'none'
                }}
                styles={{ root: { paddingLeft: 0 }, wrapper: { paddingLeft: 0 }, input: { paddingLeft: 0 } }}
              />
              <TextInput
                placeholder="Issuing Organization"
                variant='unstyled'
                value={award.organization}
                size="sm"
                onChange={(e) => handleChange(index, 'organization', e.currentTarget.value)}
                onFocus={() => onEditingChange(index)}
                onBlur={() => onEditingChange(null)}
                style={{
                  fontStyle: 'italic',
                  border: errors.includes(index) && award.organization.trim() === '' ? '0.25px solid red' : 'none'
                }}
                styles={{ root: { paddingLeft: 0 }, wrapper: { paddingLeft: 0 }, input: { paddingLeft: 0 } }}
              />
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}
