import React, { useState, useContext, useEffect } from 'react';
import { Container, TextInput, Button, Title } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext';

export function Certifications({ editingIndex, onEditingChange }: { editingIndex: number | null; onEditingChange: (index: number | null) => void }) {
  const resumeContext = useContext(ResumeContext);
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { resumeData, updateCertifications } = resumeContext;

  let certifications = resumeData.certifications;

  const [errors, setErrors] = useState<number[]>([]);

  useEffect(() => {
    if (certifications.length === 0) {
      updateCertifications([{ name: '', year: NaN, organization: '' }]);
    }
  }, [certifications, updateCertifications]);

  const handleAddCertification = () => {
    const emptyFields = certifications.some(cert => cert.name.trim() === '' || cert.organization.trim() === '');
    if (emptyFields) {
      const newErrors = certifications
        .map((cert, index) => (cert.name.trim() === '' || cert.organization.trim() === '' ? index : -1))
        .filter(index => index !== -1);
      setErrors(newErrors);
      return;
    }

    const newCertifications = [...certifications, { name: '', year: NaN, organization: '' }];
    updateCertifications(newCertifications);
    setErrors([]);
    setTimeout(() => {
      onEditingChange(certifications.length);
      document.getElementById(`cert-name-${certifications.length}`)?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newCertifications = [...certifications];

    if (field === 'year') {
      newCertifications[index] = { ...newCertifications[index], [field]: parseInt(value) || NaN };
    } else {
      newCertifications[index] = { ...newCertifications[index], [field]: value };
    }

    updateCertifications(newCertifications);

    if (errors.includes(index)) {
      const newErrors = [...errors];
      if (newCertifications[index].name.trim() !== '' && newCertifications[index].organization.trim() !== '') {
        newErrors.splice(newErrors.indexOf(index), 1);
        setErrors(newErrors);
      }
    }

    onEditingChange(index);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '5px' }}>
        <Title order={3} style={{color: 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-4))'}}>CERTIFICATIONS</Title>
        <Button onClick={handleAddCertification} variant="outline" size="xs">
          +Add
        </Button>
      </div>
      <Container p={0} m={0} fluid style={{ paddingInline: 0 }}>
        {certifications.map((cert, index) => (
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
                id={`cert-name-${index}`}
                placeholder="Certification Name"
                variant="unstyled"
                value={cert.name}
                size="md"
                onChange={(e) => handleChange(index, 'name', e.currentTarget.value)}
                onFocus={() => onEditingChange(index)}
                onBlur={() => onEditingChange(null)}
                style={{
                  fontWeight: 'bold',
                  border: errors.includes(index) && cert.name.trim() === '' ? '1px solid red' : 'none'
                }}
                styles={{ root: { paddingLeft: 0 }, wrapper: { paddingLeft: 0 }, input: { paddingLeft: 0 } }}
              />
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <TextInput
                  placeholder="Issuing Organization"
                  variant='unstyled'
                  value={cert.organization}
                  onChange={(e) => handleChange(index, 'organization', e.currentTarget.value)}
                  onFocus={() => onEditingChange(index)}
                  onBlur={() => onEditingChange(null)}
                  style={{
                    fontStyle: 'italic',
                    border: errors.includes(index) && cert.organization.trim() === '' ? '1px solid red' : 'none'
                  }}
                  styles={{ root: { paddingLeft: 0 }, wrapper: { paddingLeft: 0 }, input: { paddingLeft: 0 } }}
                />
                <TextInput
                  placeholder="Year"
                  value={cert.year ? cert.year.toString() : ''}
                  variant='unstyled'
                  onChange={(e) => handleChange(index, 'year', e.currentTarget.value)}
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
