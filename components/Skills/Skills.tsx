import React, { useRef, useContext, useEffect, useState } from 'react';
import { Container, Title, TextInput, Button } from '@mantine/core';
import { ResumeContext } from '../declarations/ResumeContext';

export function Skills({ editingIndex, onEditingChange }: { editingIndex: number | null; onEditingChange: (index: number | null) => void }) {
  const resumeContext = useContext(ResumeContext);
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { resumeData, updateSkills } = resumeContext;

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [shake, setShake] = useState<number | null>(null);

  let skills = resumeData.skills;

  useEffect(() => {
    if (skills.length === 0) {
      skills = [''];
      updateSkills(skills);
    }
  }, [skills, updateSkills]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      const newSkills = [...skills];
      newSkills[index] = e.currentTarget.value;
      newSkills.push('');
      updateSkills(newSkills);
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

    updateSkills([...skills, '']);
    setTimeout(() => {
      inputRefs.current[skills.length]?.focus();
    }, 0);
  };

  function getTextWidth(text: string, font: string): number {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (context) {
      context.font = font;
      return context.measureText(text).width * 1.02;
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
      <Container p={0} pt={5} pb={5} m={0} fluid style={{ paddingInline: 0 }}>
        {skills.map((skill, index) => (
          <div
            key={index}
            style={{
              marginBottom: '4px'
            }}
          >
            <TextInput
              variant='filled'
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={skill}
              onChange={(e) => {
                const newSkills = [...skills];
                newSkills[index] = e.currentTarget.value;
                updateSkills(newSkills);
              }}
              onKeyDown={(e) => handleKeyPress(e, index)}
              onFocus={() => onEditingChange(index)}
              onBlur={() => onEditingChange(null)}
              placeholder="Skill"
              style={{
                width: `${Math.max(60, getTextWidth(skill, font) + 23)}px`,
                fontWeight: 'bold',
                animation: shake === index ? 'shake 0.3s' : undefined
              }}
            />
          </div>
        ))}
      </Container>

      <style>{`
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
