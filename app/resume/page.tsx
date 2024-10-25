'use client';
import React from 'react';
import { ResumeHeader } from "@/components/ResumeHeader/ResumeHeader";
import { Container, Grid } from '@mantine/core';
import { PersonalInfo } from "@/components/PersonalInfo/PersonalInfo";
import { Skills } from '@/components/Skills/Skills';
import { Certifications } from '@/components/Certifications/Certifications';
import { Awards } from '@/components/Awards/Awards';
import { Education } from '@/components/Education/Education';
import { WorkExperience } from '@/components/WorkExp/WorkExp';


export default function ResumeBuilder() {
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
              </Grid.Col>
              <Grid.Col span={4}>
                <Skills />
                <Certifications />
                <Awards />
                <Education />
              </Grid.Col>
            </Grid>
          </Container>

        </Container>
      </Container>
    </>
  );
}
