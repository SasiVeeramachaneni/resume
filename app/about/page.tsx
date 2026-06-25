import { Container, Title, Text, List, ListItem, ThemeIcon, rem } from '@mantine/core';
import { IconCircleCheck } from '@tabler/icons-react';
import { Header } from '@/components/Heading/Header';
import { usePageMeta } from '@/app/usePageMeta';

export default function AboutPage() {
  usePageMeta(
    'About - Create Resume | Modern Resume Builder',
    'Learn about our mission to make resume creation effortless. Professional templates, ATS-friendly formatting, and easy-to-use editing tools.',
  );
  return (
    <>
      <Header />
      <Container size="sm" py="xl">
        <Title order={1}>About Us</Title>
        <Text size="lg" fw={500} mt="md">Your Career Starts Here</Text>

        <Text c="dimmed" mt="md">
          At Create Resume, we believe every job seeker deserves the opportunity to make a great first impression.
          That's why we've built an easy-to-use resume builder that helps you create professional, ATS-friendly
          resumes in minutes—no design skills required.
        </Text>

        <Text c="dimmed" mt="md">
          Whether you're applying for your first job, changing careers, or aiming for your next big promotion,
          our platform is designed to help you present your experience with confidence.
        </Text>

        <Title order={2} size="h3" mt="xl">Our Mission</Title>
        <Text c="dimmed" mt="sm">
          Our mission is simple: empower people to achieve their career goals by making resume creation effortless,
          professional, and accessible to everyone.
        </Text>
        <Text c="dimmed" mt="sm">
          We understand that job searching can be stressful. Creating a standout resume shouldn't be.
          Our goal is to remove the complexity so you can focus on landing interviews and advancing your career.
        </Text>

        <Title order={2} size="h3" mt="xl">What We Offer</Title>
        <Text c="dimmed" mt="sm">
          We provide everything you need to create job-winning application documents, including:
        </Text>

        <List
          mt="sm"
          spacing="sm"
          icon={
            <ThemeIcon size={22} radius="xl" color="blue">
              <IconCircleCheck style={{ width: rem(14), height: rem(14) }} />
            </ThemeIcon>
          }
        >
          <ListItem>Professionally designed, recruiter-approved resume templates</ListItem>
          <ListItem>ATS-friendly formatting to improve compatibility with hiring systems</ListItem>
          <ListItem>Easy-to-use editing tools</ListItem>
          <ListItem>Multiple download formats</ListItem>
          <ListItem>Resume tips and writing guidance</ListItem>
        </List>

        <Text c="dimmed" mt="sm">
          Every feature is built with simplicity, speed, and professionalism in mind.
        </Text>

        <Title order={2} size="h3" mt="xl">Why Choose Us?</Title>
        <Text c="dimmed" mt="sm">
          We focus on delivering a resume-building experience that is:
        </Text>

        <List
          mt="sm"
          spacing="sm"
          icon={
            <ThemeIcon size={22} radius="xl" color="blue">
              <IconCircleCheck style={{ width: rem(14), height: rem(14) }} />
            </ThemeIcon>
          }
        >
          <ListItem>
            <b>Easy to Use</b> – Build a polished resume in just a few simple steps.
          </ListItem>
          <ListItem>
            <b>Professional</b> – Choose from modern templates designed to impress recruiters.
          </ListItem>
          <ListItem>
            <b>ATS-Friendly</b> – Increase your chances of passing Applicant Tracking Systems.
          </ListItem>
          <ListItem>
            <b>Time-Saving</b> – Create and customize resumes quickly.
          </ListItem>
          <ListItem>
            <b>Secure</b> – Your personal information and documents are never sent anywhere.
          </ListItem>
        </List>
      </Container>
    </>
  );
}
