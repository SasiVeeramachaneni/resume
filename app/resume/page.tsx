'use client';
import React, { useState, useRef } from 'react';
import { ResumeHeader } from "@/components/ResumeHeader/ResumeHeader";
import { Container, Grid, Title, TextInput } from '@mantine/core';
import { PersonalInfo } from "@/components/PersonalInfo/PersonalInfo";
import { Skills } from '@/components/Skills/Skills';
import { Certifications } from '@/components/Certifications/Certifications';
import { Awards } from '@/components/Awards/Awards';
import { Education } from '@/components/Education/Education';

export default function ResumeBuilder() {
  return (
    <>
      <ResumeHeader />
      <Container pt={30} pb={40} fluid bg="var(--mantine-color-blue-light)">
        <Container size="xl" pt={40} pb={40} bg="var(--mantine-color-white)">
          <PersonalInfo />
          <Container fluid>
            <Grid columns={12} pt={10}>
              <Grid.Col span={8}>
                <Title order={3}>Work experience</Title>
              </Grid.Col>
              <Grid.Col span={4}>
                <Skills />
                <Certifications />
                <Awards />
                <Education />
                <Title order={3}>Publications</Title>
              </Grid.Col>
            </Grid>
          </Container>

        </Container>
      </Container>
    </>
  );
}
