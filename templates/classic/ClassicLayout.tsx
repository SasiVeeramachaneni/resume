import type { TemplateLayoutProps } from "../types";

// Single-column layout. Sections stack vertically in a traditional resume order.
export function ClassicLayout({
  sections,
  isPatents,
  isPersonalProjects,
  isLanguages,
  wrapSection,
}: TemplateLayoutProps) {
  return (
    <>
      {wrapSection("skills", sections.skills)}
      {wrapSection("workExperience", sections.workExperience)}
      {isPersonalProjects && wrapSection("projects", sections.projects)}
      {wrapSection("certifications", sections.certifications)}
      {wrapSection("awards", sections.awards)}
      {wrapSection("education", sections.education)}
      {isLanguages && wrapSection("languages", sections.languages)}
      {isPatents && wrapSection("patents", sections.patents)}
    </>
  );
}

export default ClassicLayout;
