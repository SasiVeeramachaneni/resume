'use client';
import React, { useState } from 'react';
import { Container, TextInput, Button, Title } from '@mantine/core';

export function Certifications() {
  const [certifications, setCertifications] = useState([{ name: '', year: '', organization: '' }]);
  const [errors, setErrors] = useState<number[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

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

    setCertifications([...certifications, { name: '', year: '', organization: '' }]);
    setErrors([]);
    setTimeout(() => {
      setEditingIndex(certifications.length);
      document.getElementById(`cert-name-${certifications.length}`)?.focus();
    }, 0);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const newCertifications = [...certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    setCertifications(newCertifications);

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
              size="sm"
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
                value={cert.year}
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
