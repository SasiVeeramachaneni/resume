import React from 'react';
import { ResumeHeader } from "@/components/ResumeHeader/ResumeHeader";
import { Container, Grid } from '@mantine/core';
import { PersonalInfo } from "@/components/PersonalInfo/PersonalInfo";
import { Skills } from '@/components/Skills/Skills';
import { Certifications } from '@/components/Certifications/Certifications';
import { Awards } from '@/components/Awards/Awards';
import { Education } from '@/components/Education/Education';
import { Languages } from '@/components/Languages/Languages';
import { Patents } from '@/components/Patents/Patents';
import { Projects } from '@/components/Projects/Projects';
import { WorkExperience } from '@/components/WorkExp/WorkExp';
import { ResumeContext } from '@/components/declarations/ResumeContext';


export default function ResumeBuilder() {
  const resumeContext = React.useContext(ResumeContext);

  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const { isPatents, isPersonalProjects, isLanguages } = resumeContext.resumeData.settings;

  return (
    <>
      <ResumeHeader />
      <Container pt={20} pb={40} fluid bg="var(--mantine-color-blue-light)">
        <Container size="xl" pt={40} pb={40} bg="var(--mantine-color-white)">
          <PersonalInfo />
          <Container fluid>
            <Grid columns={12} pt={10}>
              <Grid.Col span={8}>
                <WorkExperience />
                {isPersonalProjects && <Projects />}
              </Grid.Col>
              <Grid.Col span={4}>
                <Skills />
                <Certifications />
                <Awards />
                <Education />
                {isLanguages && <Languages />}
                {isPatents && <Patents />}
              </Grid.Col>
            </Grid>
          </Container>

        </Container>
      </Container>
    </>
  );
}
