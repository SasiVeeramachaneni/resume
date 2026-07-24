import React, { useRef, useContext, useEffect, useState } from "react";
import { Container, Title, TextInput, Button, Text } from "@mantine/core";
import { ResumeContext } from "../declarations/ResumeContext";

// Photo template skills: shows proficiency bars. Format: "Skill Name: XX%"
// where XX is 0-100. If no percentage specified, defaults to 100%.
export function PhotoSkills({
  editingIndex,
  onEditingChange,
}: {
  editingIndex: number | null;
  onEditingChange: (index: number | null) => void;
}) {
  const resumeContext = useContext(ResumeContext);
  if (!resumeContext) {
    throw new Error("ResumeContext must be used within a ResumeProvider");
  }

  const { resumeData, updateSkills } = resumeContext;

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [shake, setShake] = useState<number | null>(null);

  let skills = resumeData.skills;

  useEffect(() => {
    if (skills.length === 0) {
      skills = [""];
      updateSkills(skills);
    }
  }, [skills, updateSkills]);

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      const newSkills = [...skills];
      newSkills[index] = e.currentTarget.value;
      newSkills.push("");
      updateSkills(newSkills);
      setTimeout(() => {
        inputRefs.current[newSkills.length - 1]?.focus();
      }, 0);
    } else if (e.key === "Enter") {
      setShake(index);
      setTimeout(() => setShake(null), 300);
    }
  };

  const handleAddSkill = () => {
    const emptyIndex = skills.findIndex((skill) => skill.trim() === "");
    if (emptyIndex !== -1) {
      setShake(emptyIndex);
      setTimeout(() => setShake(null), 300);
      return;
    }

    updateSkills([...skills, ""]);
    setTimeout(() => {
      inputRefs.current[skills.length]?.focus();
    }, 0);
  };

  // Parse skill string to extract name and proficiency
  // Format: "Skill Name: XX%" or just "Skill Name" (defaults to 100%)
  const parseSkill = (skill: string) => {
    const match = skill.match(/^(.+?):\s*(\d+)%?$/);
    if (match) {
      return {
        name: match[1].trim(),
        proficiency: Math.min(100, Math.max(0, parseInt(match[2]))),
      };
    }
    return { name: skill.trim(), proficiency: 100 };
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <Title
          order={3}
          style={{
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: "700",
            letterSpacing: "2px",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          SKILLS
        </Title>
        <Button
          onClick={handleAddSkill}
          variant="outline"
          size="xs"
          color="gray"
        >
          +Add
        </Button>
      </div>

      {/* Integrated interactive bullet-point inputs (no duplication) */}
      <Container p={0} m={0} fluid style={{ paddingInline: 0 }}>
        {skills.map((skill, index) => {
          const { name } = parseSkill(skill);
          return (
            <div
              key={`input-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "#ecf0f1", fontSize: "14px" }}>•</span>
              <input
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
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#ffffff",
                  fontSize: "13px",
                  width: "100%",
                  padding: "4px 0",
                  fontFamily: "inherit",
                  animation: shake === index ? "shake 0.3s" : undefined,
                }}
              />
            </div>
          );
        })}
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
