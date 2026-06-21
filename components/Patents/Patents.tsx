import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Textarea, TextInput, Title } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext';

const blankPatent = { name: '', year: NaN, description: '', link: '' };

export function Patents({ editingIndex, onEditingChange }: { editingIndex: number | null; onEditingChange: (index: number | null) => void }) {
  const resumeContext = useContext(ResumeContext);

  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { resumeData, updatePatents } = resumeContext;
  const patents = resumeData.patents;
  const [errors, setErrors] = useState<number[]>([]);

  useEffect(() => {
    if (patents.length === 0) {
      updatePatents([blankPatent]);
    }
  }, [patents, updatePatents]);

  const handleAddPatent = () => {
    const emptyFields = patents.some((patent) => patent.name.trim() === '');

    if (emptyFields) {
      const newErrors = patents
        .map((patent, index) => (patent.name.trim() === '' ? index : -1))
        .filter((index) => index !== -1);
      setErrors(newErrors);
      return;
    }

    updatePatents([...patents, blankPatent]);
    setErrors([]);
    setTimeout(() => {
      onEditingChange(patents.length);
      document.getElementById(`patent-name-${patents.length}`)?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newPatents = [...patents];

    if (field === 'year') {
      newPatents[index] = { ...newPatents[index], [field]: parseFloat(value) || NaN };
    } else {
      newPatents[index] = { ...newPatents[index], [field]: value };
    }

    updatePatents(newPatents);

    if (errors.includes(index) && newPatents[index].name.trim() !== '') {
      setErrors(errors.filter((errorIndex) => errorIndex !== index));
    }

    onEditingChange(index);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '5px' }}>
        <Title order={3} style={{ color: 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-4))' }}>PATENTS</Title>
        <Button onClick={handleAddPatent} variant="outline" size="xs">
          +Add
        </Button>
      </div>
      <Container p={0} m={0} fluid style={{ paddingInline: 0 }}>
        {patents.map((patent, index) => (
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
                id={`patent-name-${index}`}
                placeholder="Patent Name"
                variant="unstyled"
                value={patent.name}
                size="md"
                onChange={(e) => handleChange(index, 'name', e.currentTarget.value)}
                onFocus={() => onEditingChange(index)}
                onBlur={() => onEditingChange(null)}
                style={{
                  fontWeight: 'bold',
                  border: errors.includes(index) && patent.name.trim() === '' ? '1px solid red' : 'none',
                }}
              />
              <TextInput
                placeholder="Year"
                variant="unstyled"
                value={patent.year ? patent.year.toString() : ''}
                size="sm"
                onChange={(e) => handleChange(index, 'year', e.currentTarget.value)}
                onFocus={() => onEditingChange(index)}
                onBlur={() => onEditingChange(null)}
                style={{ fontStyle: 'italic', width: '80px' }}
              />
              <Textarea
                placeholder="2 line description"
                variant="unstyled"
                value={patent.description}
                size="sm"
                autosize
                minRows={1}
                maxRows={2}
                onChange={(e) => handleChange(index, 'description', e.currentTarget.value)}
                onFocus={() => onEditingChange(index)}
                onBlur={() => onEditingChange(null)}
              />
              <TextInput
                placeholder="Link to patent"
                variant="unstyled"
                value={patent.link}
                size="sm"
                onChange={(e) => handleChange(index, 'link', e.currentTarget.value)}
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
