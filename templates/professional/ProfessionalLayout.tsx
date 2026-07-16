import { Container, Grid } from "@mantine/core";
import type { TemplateLayoutProps } from "../types";

// Two-column layout: experience + projects on the left (wide),
// skills / certs / awards / education / languages / patents on the right.
export function ProfessionalLayout({
  sections,
  isPatents,
  isPersonalProjects,
  isLanguages,
  wrapSection,
}: TemplateLayoutProps) {
  return (
    <Container fluid>
      <Grid columns={12} pt={10}>
        <Grid.Col span={8}>
          {wrapSection("workExperience", sections.workExperience)}
          {isPersonalProjects && wrapSection("projects", sections.projects)}
        </Grid.Col>
        <Grid.Col span={4}>
          {wrapSection("skills", sections.skills)}
          {wrapSection("certifications", sections.certifications)}
          {wrapSection("awards", sections.awards)}
          {wrapSection("education", sections.education)}
          {isLanguages && wrapSection("languages", sections.languages)}
          {isPatents && wrapSection("patents", sections.patents)}
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default ProfessionalLayout;
