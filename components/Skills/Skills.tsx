'use client';
import React, { useRef, useContext, useEffect, useState } from 'react';
import { Container, Title, TextInput, Button } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext'; // Adjust the import path as necessary

export function Skills() {
  const resumeContext = useContext(ResumeContext); // Use context
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider'); // Error if context is undefined
  }

  const { resumeData, updateSkills } = resumeContext; // Destructure resumeData and updateSkills from context

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [shake, setShake] = useState<number | null>(null);

  let skills = resumeData.skills; // Use skills from context

  // Add a default blank skill if the skills array is empty
  useEffect(() => {
    if (skills.length === 0) {
      skills = ['']; // Add a default blank skill
      updateSkills(skills); // Update the context with the default blank skill
    }
  }, [skills, updateSkills]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newSkills = [...skills];
      newSkills[index] = e.currentTarget.value;
      newSkills.push(''); // Add new input for the next skill
      updateSkills(newSkills); // Update the context
      setTimeout(() => {
        inputRefs.current[newSkills.length - 1]?.focus();
      }, 0);
    } else if (e.key === 'Enter') {
      setShake(index);
      setTimeout(() => setShake(null), 300);
    }
  };

  const handleAddSkill = () => {
    const emptyIndex = skills.findIndex(skill => skill.trim() === '');
    if (emptyIndex !== -1) {
      setShake(emptyIndex);
      setTimeout(() => setShake(null), 300);
      return;
    }

    updateSkills([...skills, '']); // Update the context with a new empty skill
    setTimeout(() => {
      inputRefs.current[skills.length]?.focus();
    }, 0);
  };

  function getTextWidth(text: string, font: string): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      return context.measureText(text).width*1.02;
    }
    return 0;
  }

  const font = "16px Arial";

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Title order={3} style={{color: 'light-dark(var(--mantine-color-blue-6), var(--mantine-color-blue-4))'}}>SKILLS</Title>
        <Button onClick={handleAddSkill} variant="outline" size="xs">
          +Add
        </Button>
      </div>
      <Container p={0} pt={5} pb={5}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {skills.map((skill, index) => (
            <TextInput
              key={index}
              variant='filled'
              ref={(el) => {
                inputRefs.current[index] = el; // Assign the ref without returning anything
              }}
              value={skill}
              onChange={(e) => {
                const newSkills = [...skills];
                newSkills[index] = e.currentTarget.value;
                updateSkills(newSkills); // Update the context when a skill changes
              }}
              onKeyDown={(e) => handleKeyPress(e, index)}
              placeholder="Skill"
              style={{
                width: `${Math.max(60, getTextWidth(skill, font) + 23)}px`,
                fontWeight: 'bold',
                animation: shake === index ? 'shake 0.3s' : undefined
              }} // Adjust width based on content
            />
          ))}
        </div>
      </Container>

      <style jsx global>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
