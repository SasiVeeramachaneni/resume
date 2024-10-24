'use client';
import React, { useState, useContext, useEffect } from 'react';
import { Container, TextInput, Button, Title } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext'; // Adjust the import path as necessary

export function Certifications() {
  const resumeContext = useContext(ResumeContext); // Use context
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider'); // Error if context is undefined
  }

  const { resumeData, updateCertifications } = resumeContext; // Destructure resumeData and updateCertifications from context

  let certifications = resumeData.certifications;

  const [errors, setErrors] = useState<number[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Ensure there's always a blank certification with year as a number
  useEffect(() => {
    if (certifications.length === 0) {
      updateCertifications([{ name: '', year: NaN, organization: '' }]); // Add a default blank certification with `year` as number
    }
  }, [certifications, updateCertifications]);

  const handleAddCertification = () => {
    // Check if all mandatory fields are filled
    const emptyFields = certifications.some(cert => cert.name.trim() === '' || cert.organization.trim() === '');
    if (emptyFields) {
      const newErrors = certifications
        .map((cert, index) => (cert.name.trim() === '' || cert.organization.trim() === '' ? index : -1))
        .filter(index => index !== -1);
      setErrors(newErrors);
      return;
    }

    // Add a new blank certification and update the context
    const newCertifications = [...certifications, { name: '', year: NaN, organization: '' }];
    updateCertifications(newCertifications); // Update context with new certification
    setErrors([]);
    setTimeout(() => {
      setEditingIndex(certifications.length); // Set focus on the new certification
      document.getElementById(`cert-name-${certifications.length}`)?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newCertifications = [...certifications];

    if (field === 'year') {
      newCertifications[index] = { ...newCertifications[index], [field]: parseInt(value) || NaN }; // Convert year to number
    } else {
      newCertifications[index] = { ...newCertifications[index], [field]: value };
    }

    updateCertifications(newCertifications); // Update the context whenever a certification is changed

    if (errors.includes(index)) {
      const newErrors = [...errors];
      if (newCertifications[index].name.trim() !== '' && newCertifications[index].organization.trim() !== '') {
        newErrors.splice(newErrors.indexOf(index), 1);
        setErrors(newErrors);
      }
    }

    setEditingIndex(index);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '5px' }}>
        <Title order={3}>Certifications</Title>
        <Button onClick={handleAddCertification} variant="outline" size="xs">
          +Add
        </Button>
      </div>
      <Container p={0}>
        {certifications.map((cert, index) => (
          <div
            key={index}
            style={{
              marginBottom: '10px',
              backgroundColor: editingIndex === index ? '#eff8ff' : 'transparent',
              borderRadius: '4px',
            }}
          >
            <TextInput
              id={`cert-name-${index}`}
              placeholder="Certification Name"
              variant="unstyled"
              value={cert.name}
              size="md"
              onChange={(e) => handleChange(index, 'name', e.currentTarget.value)}
              onFocus={() => setEditingIndex(index)}
              onBlur={() => setEditingIndex(null)}
              style={{
                fontWeight: 'bold',
                border: errors.includes(index) && cert.name.trim() === '' ? '1px solid red' : 'none'
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <TextInput
                placeholder="Issuing Organization"
                variant='unstyled'
                value={cert.organization}
                onChange={(e) => handleChange(index, 'organization', e.currentTarget.value)}
                onFocus={() => setEditingIndex(index)}
                onBlur={() => setEditingIndex(null)}
                style={{
                  fontStyle: 'italic',
                  border: errors.includes(index) && cert.organization.trim() === '' ? '1px solid red' : 'none'
                }}
              />
              <TextInput
                placeholder="Year"
                value={cert.year ? cert.year.toString() : ''}
                variant='unstyled'
                onChange={(e) => handleChange(index, 'year', e.currentTarget.value)}
                style={{ fontStyle: 'italic', width: '60px' }}
              />
            </div>
          </div>
        ))}
      </Container>
    </>
  );
}
