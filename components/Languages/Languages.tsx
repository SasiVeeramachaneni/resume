import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Group, Select, TextInput, Title } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext';

const blankLanguage = { name: '', proficiency: '' as const };

export function Languages({ editingIndex, onEditingChange }: { editingIndex: number | null; onEditingChange: (index: number | null) => void }) {
  const resumeContext = useContext(ResumeContext);

  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { resumeData, updateLanguages } = resumeContext;
  const languages = resumeData.languages ?? [];
  const [errors, setErrors] = useState<number[]>([]);

  useEffect(() => {
    if (languages.length === 0) {
      updateLanguages([{ ...blankLanguage }]);
    }
  }, [languages, updateLanguages]);

  const handleAddLanguage = () => {
    const emptyFields = languages.some((language) => language.name.trim() === '' || language.proficiency.trim() === '');

    if (emptyFields) {
      const newErrors = languages
        .map((language, index) => (language.name.trim() === '' || language.proficiency.trim() === '' ? index : -1))
        .filter((index) => index !== -1);
      setErrors(newErrors);
      return;
    }

    updateLanguages([...languages, { ...blankLanguage }]);
    setErrors([]);
    setTimeout(() => {
      onEditingChange(languages.length);
      document.getElementById(`language-name-${languages.length}`)?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: 'name' | 'proficiency', value: string) => {
    const newLanguages = [...languages];
    newLanguages[index] = { ...newLanguages[index], [field]: value } as typeof newLanguages[number];
    updateLanguages(newLanguages);

    if (errors.includes(index) && newLanguages[index].name.trim() !== '' && newLanguages[index].proficiency.trim() !== '') {
      setErrors(errors.filter((errorIndex) => errorIndex !== index));
    }

    onEditingChange(index);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '5px' }}>
        <Title order={3} style={{ color: 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-4))' }}>
          LANGUAGES
        </Title>
        <Button onClick={handleAddLanguage} variant="outline" size="xs">
          +Add
        </Button>
      </div>
      <Container p={0} m={0} fluid style={{ paddingInline: 0 }}>
        {languages.map((language, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              backgroundColor: editingIndex === index ? '#eff8ff' : 'transparent',
              borderRadius: '4px',
            }}
          >
            <div>
              <Group wrap="nowrap" align="center" justify="space-between" gap="xs">
                <TextInput
                  id={`language-name-${index}`}
                  placeholder="Language name"
                  variant="unstyled"
                  value={language.name}
                  size="md"
                  onChange={(e) => handleChange(index, 'name', e.currentTarget.value)}
                  onFocus={() => onEditingChange(index)}
                  onBlur={() => onEditingChange(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.preventDefault();
                      const proficiencyInput = document.getElementById(`language-proficiency-${index}`);
                      if (proficiencyInput) {
                        proficiencyInput.focus();
                        proficiencyInput.click();
                      }
                    }
                  }}
                  style={{
                    flex: 1,
                    fontWeight: 'bold',
                    border: errors.includes(index) && language.name.trim() === '' ? '1px solid red' : 'none',
                  }}
                />
                <Select
                  id={`language-proficiency-${index}`}
                  placeholder="Proficiency"
                  variant="unstyled"
                  value={language.proficiency || null}
                  data={['High', 'Medium', 'Low']}
                  onChange={(value) => handleChange(index, 'proficiency', value ?? '')}
                  onFocus={() => onEditingChange(index)}
                  onBlur={() => onEditingChange(null)}
                  allowDeselect
                  searchable={false}
                  size="sm"
                  w={110}
                  styles={{
                    input: {
                      fontStyle: 'italic',
                      textAlign: 'right',
                      border: errors.includes(index) && language.proficiency.trim() === '' ? '1px solid red' : 'none',
                    },
                  }}
                />
              </Group>
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}
