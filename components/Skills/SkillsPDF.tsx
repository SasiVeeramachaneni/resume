// SkillsPDF.tsx
import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { pdfStyles, photoStyles } from "../ResumePDF/ResumeStyles";

const styles = StyleSheet.create({
  skillContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
    marginBottom: 10,
  },
  skillBox: {
    padding: 4,
    fontSize: 8,
    border: "1px solid #eff8ff",
    borderRadius: 4,
    fontWeight: "bold",
    backgroundColor: "#eff8ff",
  },
});

interface SkillsPDFProps {
  skills: String[];
  template?: string;
}

// WorkExperience PDF component with TypeScript
const SkillsPDF: React.FC<SkillsPDFProps> = ({ skills, template }) => {
  if (template === "photo") {
    const parseSkillName = (s: String) => {
      const match = s.match(/^(.+?):\s*(\d+)%?$/);
      return match ? match[1].trim() : s.trim();
    };

    return (
      <>
        <Text style={photoStyles.sidebarSectionTitle}>SKILLS</Text>
        <View style={{ flexDirection: "column", gap: 3, marginBottom: 10 }}>
          {skills
            .filter((s) => s.trim())
            .map((skill, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 3,
                }}
              >
                <Text
                  style={{ color: "#ecf0f1", fontSize: 10, marginRight: 6 }}
                >
                  •
                </Text>
                <Text style={{ color: "#ffffff", fontSize: 8 }}>
                  {parseSkillName(skill)}
                </Text>
              </View>
            ))}
        </View>
      </>
    );
  }

  return (
    <>
      <Text style={pdfStyles.sectionTitle}>SKILLS</Text>
      <View style={styles.skillContainer}>
        {skills.map((skill, index) => (
          <Text key={index} style={styles.skillBox}>
            {skill}
          </Text>
        ))}
      </View>
    </>
  );
};

export default SkillsPDF;
