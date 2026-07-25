'use client';

import React, { useContext, useState } from 'react';
import {
  Container,
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  ActionIcon,
  Text,
  Paper,
  Title,
  Checkbox,
  Card,
  Grid,
  Box,
} from '@mantine/core';
import {
  IconUser,
  IconBriefcase,
  IconSchool,
  IconBarbell,
  IconExternalLink,
  IconAward,
  IconCertificate,
  IconLanguage,
  IconArticle,
  IconTrash,
  IconPlus,
} from '@tabler/icons-react';
import { ResumeContext } from '../declarations/ResumeContext';
import {
  WorkExperience,
  Project,
  Education,
  Award,
  Certification,
  Language,
  Patent,
} from '../declarations/types';

interface MobileEditorProps {
  onDone?: () => void;
}

export function MobileEditor({ onDone }: MobileEditorProps) {
  const resumeContext = useContext(ResumeContext);
  if (!resumeContext) {
    throw new Error('ResumeContext must be used within a ResumeProvider');
  }

  const {
    resumeData,
    updatePersonalInfo,
    updateWorkExperience,
    updateProjects,
    updateEducation,
    updateAwards,
    updateCertifications,
    updateSkills,
    updateLanguages,
    updatePatents,
  } = resumeContext;

  const { settings, personalInfo } = resumeData;

  // Active step (tab) state
  const [activeTab, setActiveStep] = useState<string>('personalInfo');
  const [newSkill, setNewSkill] = useState('');

  // Available steps based on settings
  const tabs = [
    { id: 'personalInfo', label: 'Personal Info', icon: IconUser },
    { id: 'workExperience', label: 'Experience', icon: IconBriefcase },
    { id: 'education', label: 'Education', icon: IconSchool },
    { id: 'skills', label: 'Skills', icon: IconBarbell },
    ...(settings.isPersonalProjects
      ? [{ id: 'projects', label: 'Projects', icon: IconExternalLink }]
      : []),
    ...(settings.isCertifications
      ? [{ id: 'certifications', label: 'Certifications', icon: IconCertificate }]
      : []),
    ...(settings.isAwards
      ? [{ id: 'awards', label: 'Awards', icon: IconAward }]
      : []),
    ...(settings.isLanguages
      ? [{ id: 'languages', label: 'Languages', icon: IconLanguage }]
      : []),
    ...(settings.isPatents
      ? [{ id: 'patents', label: 'Patents', icon: IconArticle }]
      : []),
  ];

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveStep(tabs[currentTabIndex + 1].id);
    } else if (onDone) {
      onDone();
    }
  };

  const handlePrev = () => {
    if (currentTabIndex > 0) {
      setActiveStep(tabs[currentTabIndex - 1].id);
    }
  };

  // ----- PERSONAL INFO -----
  const renderPersonalInfo = () => {
    const { name, title, aboutMe, phoneNumber, email, linkedIn, github } = personalInfo;
    return (
      <Stack gap="md" p="md">
        <Title order={4} mb="xs" c="blue.6">Personal Details</Title>
        <TextInput
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => updatePersonalInfo('name', e.target.value)}
        />
        <TextInput
          label="Job Title"
          placeholder="Lead Product Manager"
          value={title}
          onChange={(e) => updatePersonalInfo('title', e.target.value)}
        />
        <Textarea
          label="About Me (Summary)"
          placeholder="Brief description about yourself..."
          minRows={3}
          value={aboutMe}
          onChange={(e) => updatePersonalInfo('aboutMe', e.target.value)}
        />
        <TextInput
          label="Phone Number"
          placeholder="+1 (234) 567-8900"
          value={phoneNumber}
          onChange={(e) => updatePersonalInfo('phoneNumber', e.target.value)}
        />
        <TextInput
          label="Email Address"
          placeholder="johndoe@example.com"
          value={email}
          onChange={(e) => updatePersonalInfo('email', e.target.value)}
        />
        {settings.isLinkedIn && (
          <TextInput
            label="LinkedIn URL"
            placeholder="linkedin.com/in/username"
            value={linkedIn || ''}
            onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
          />
        )}
        {settings.isGithub && (
          <TextInput
            label="GitHub URL"
            placeholder="github.com/username"
            value={github || ''}
            onChange={(e) => updatePersonalInfo('github', e.target.value)}
          />
        )}
      </Stack>
    );
  };

  // ----- WORK EXPERIENCE -----
  const renderWorkExperience = () => {
    const experiences = resumeData.workExperience;

    const handleAddExperience = () => {
      updateWorkExperience([
        ...experiences,
        { organization: '', from: '', to: '', isCurrent: false, role: '', points: [''] },
      ]);
    };

    const handleRemoveExperience = (idx: number) => {
      const updated = [...experiences];
      updated.splice(idx, 1);
      updateWorkExperience(updated);
    };

    const handleExpChange = (idx: number, field: keyof WorkExperience, val: any) => {
      const updated = [...experiences];
      updated[idx] = { ...updated[idx], [field]: val };
      updateWorkExperience(updated);
    };

    const handleAddBulletPoint = (expIdx: number) => {
      const updated = [...experiences];
      updated[expIdx].points.push('');
      updateWorkExperience(updated);
    };

    const handleRemoveBulletPoint = (expIdx: number, pointIdx: number) => {
      const updated = [...experiences];
      updated[expIdx].points.splice(pointIdx, 1);
      updateWorkExperience(updated);
    };

    const handleBulletChange = (expIdx: number, pointIdx: number, val: string) => {
      const updated = [...experiences];
      updated[expIdx].points[pointIdx] = val;
      updateWorkExperience(updated);
    };

    return (
      <Stack gap="md" p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={4} c="blue.6">Work Experience</Title>
          <Button
            size="xs"
            leftSection={<IconPlus size={14} />}
            variant="outline"
            onClick={handleAddExperience}
          >
            Add New
          </Button>
        </Group>

        {experiences.length === 0 ? (
          <Paper withBorder p="xl" ta="center" radius="md">
            <Text c="dimmed" size="sm">No experiences added yet.</Text>
            <Button
              size="xs"
              mt="md"
              leftSection={<IconPlus size={14} />}
              onClick={handleAddExperience}
            >
              Add Experience
            </Button>
          </Paper>
        ) : (
          experiences.map((exp, idx) => (
            <Card key={idx} withBorder radius="md" p="md" shadow="none">
              <Group justify="space-between" mb="xs">
                <Text fw={700} c="blue.7">Experience #{idx + 1}</Text>
                <ActionIcon color="red" variant="subtle" onClick={() => handleRemoveExperience(idx)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>

              <Stack gap="sm">
                <TextInput
                  label="Organization / Company"
                  placeholder="Acme Inc"
                  required
                  value={exp.organization}
                  onChange={(e) => handleExpChange(idx, 'organization', e.target.value)}
                />
                <TextInput
                  label="Role / Designation"
                  placeholder="Software Engineer"
                  value={exp.role}
                  onChange={(e) => handleExpChange(idx, 'role', e.target.value)}
                />
                <Grid gap="sm">
                  <Grid.Col span={6}>
                    <TextInput
                      label="From Date"
                      placeholder="MM/YYYY"
                      required
                      value={exp.from}
                      onChange={(e) => handleExpChange(idx, 'from', e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="To Date"
                      placeholder="MM/YYYY"
                      disabled={exp.isCurrent}
                      value={exp.isCurrent ? 'Present' : exp.to || ''}
                      onChange={(e) => handleExpChange(idx, 'to', e.target.value)}
                    />
                  </Grid.Col>
                </Grid>
                <Checkbox
                  label="I currently work here"
                  checked={exp.isCurrent}
                  onChange={(e) => handleExpChange(idx, 'isCurrent', e.target.checked)}
                />

                <Text size="xs" fw={700} mt="xs" mb={0}>Role description (Bullet points):</Text>
                {exp.points.map((pt, pIdx) => (
                  <Group key={pIdx} wrap="nowrap" align="flex-start" gap="xs">
                    <Text size="sm" pt={7} fw={600}>•</Text>
                    <Textarea
                      placeholder="Delivered high quality software, mentored junior developers..."
                      autosize
                      minRows={1}
                      style={{ flex: 1 }}
                      value={pt}
                      onChange={(e) => handleBulletChange(idx, pIdx, e.target.value)}
                    />
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      mt={4}
                      onClick={() => handleRemoveBulletPoint(idx, pIdx)}
                      disabled={exp.points.length === 1}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                ))}
                <Button
                  size="xs"
                  variant="subtle"
                  leftSection={<IconPlus size={12} />}
                  onClick={() => handleAddBulletPoint(idx)}
                  display="inline-flex"
                  styles={{ root: { alignSelf: 'flex-start' } }}
                >
                  Add Bullet Point
                </Button>
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    );
  };

  // ----- EDUCATION -----
  const renderEducation = () => {
    const educations = resumeData.education;

    const handleAddEducation = () => {
      updateEducation([
        ...educations,
        { degree: '', college: '', discipline: '', year: NaN, percentage: NaN },
      ]);
    };

    const handleRemoveEducation = (idx: number) => {
      const updated = [...educations];
      updated.splice(idx, 1);
      updateEducation(updated);
    };

    const handleEduChange = (idx: number, field: keyof Education, val: any) => {
      const updated = [...educations];
      if (field === 'year' || field === 'percentage') {
        updated[idx] = { ...updated[idx], [field]: parseFloat(val) || NaN };
      } else {
        updated[idx] = { ...updated[idx], [field]: val };
      }
      updateEducation(updated);
    };

    return (
      <Stack gap="md" p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={4} c="blue.6">Education</Title>
          <Button
            size="xs"
            leftSection={<IconPlus size={14} />}
            variant="outline"
            onClick={handleAddEducation}
          >
            Add New
          </Button>
        </Group>

        {educations.length === 0 ? (
          <Paper withBorder p="xl" ta="center" radius="md">
            <Text c="dimmed" size="sm">No education entries added yet.</Text>
            <Button
              size="xs"
              mt="md"
              leftSection={<IconPlus size={14} />}
              onClick={handleAddEducation}
            >
              Add Education
            </Button>
          </Paper>
        ) : (
          educations.map((edu, idx) => (
            <Card key={idx} withBorder radius="md" p="md" shadow="none">
              <Group justify="space-between" mb="xs">
                <Text fw={700} c="blue.7">Education #{idx + 1}</Text>
                <ActionIcon color="red" variant="subtle" onClick={() => handleRemoveEducation(idx)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>

              <Stack gap="sm">
                <TextInput
                  label="Degree"
                  placeholder="Master of Science"
                  required
                  value={edu.degree}
                  onChange={(e) => handleEduChange(idx, 'degree', e.target.value)}
                />
                <TextInput
                  label="College / University"
                  placeholder="Stanford University"
                  required
                  value={edu.college}
                  onChange={(e) => handleEduChange(idx, 'college', e.target.value)}
                />
                <TextInput
                  label="Discipline / Specialization"
                  placeholder="Computer Science"
                  value={edu.discipline}
                  onChange={(e) => handleEduChange(idx, 'discipline', e.target.value)}
                />
                <Grid gap="sm">
                  <Grid.Col span={6}>
                    <TextInput
                      label="Year of Graduation"
                      placeholder="YYYY"
                      type="number"
                      value={isNaN(edu.year) ? '' : edu.year.toString()}
                      onChange={(e) => handleEduChange(idx, 'year', e.target.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="GPA / Percentage"
                      placeholder="9.5 or 95%"
                      type="number"
                      value={isNaN(edu.percentage) ? '' : edu.percentage.toString()}
                      onChange={(e) => handleEduChange(idx, 'percentage', e.target.value)}
                    />
                  </Grid.Col>
                </Grid>
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    );
  };

  // ----- SKILLS -----
  const renderSkills = () => {
    const skills = resumeData.skills;

    const handleAddSkill = () => {
      if (newSkill.trim() && !skills.includes(newSkill.trim())) {
        updateSkills([...skills, newSkill.trim()]);
        setNewSkill('');
      }
    };

    const handleRemoveSkill = (idx: number) => {
      const updated = [...skills];
      updated.splice(idx, 1);
      updateSkills(updated);
    };

    return (
      <Stack gap="md" p="md">
        <Title order={4} mb="xs" c="blue.6">Skills & Keywords</Title>
        <Group align="flex-end" gap="sm">
          <TextInput
            label="Add Skill"
            placeholder="React / Product Strategy"
            style={{ flex: 1 }}
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddSkill();
            }}
          />
          <Button onClick={handleAddSkill}>Add</Button>
        </Group>

        <Text size="xs" c="dimmed">Tap to delete a skill:</Text>
        <Group gap="xs" mt="xs">
          {skills.length === 0 ? (
            <Text c="dimmed" size="sm" style={{ fontStyle: 'italic' }}>No skills added yet.</Text>
          ) : (
            skills.map((skill, idx) => (
              <Button
                key={idx}
                variant="light"
                color="blue"
                size="sm"
                radius="xl"
                rightSection={<Text size="xs" fw={700}>×</Text>}
                onClick={() => handleRemoveSkill(idx)}
              >
                {skill}
              </Button>
            ))
          )}
        </Group>
      </Stack>
    );
  };

  // ----- PROJECTS -----
  const renderProjects = () => {
    const projects = resumeData.projects;

    const handleAddProject = () => {
      updateProjects([
        ...projects,
        { name: '', githubLink: '', websiteLink: '', description: '' },
      ]);
    };

    const handleRemoveProject = (idx: number) => {
      const updated = [...projects];
      updated.splice(idx, 1);
      updateProjects(updated);
    };

    const handleProjectChange = (idx: number, field: keyof Project, val: string) => {
      const updated = [...projects];
      updated[idx] = { ...updated[idx], [field]: val };
      updateProjects(updated);
    };

    return (
      <Stack gap="md" p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={4} c="blue.6">Projects</Title>
          <Button
            size="xs"
            leftSection={<IconPlus size={14} />}
            variant="outline"
            onClick={handleAddProject}
          >
            Add New
          </Button>
        </Group>

        {projects.length === 0 ? (
          <Paper withBorder p="xl" ta="center" radius="md">
            <Text c="dimmed" size="sm">No projects added yet.</Text>
            <Button
              size="xs"
              mt="md"
              leftSection={<IconPlus size={14} />}
              onClick={handleAddProject}
            >
              Add Project
            </Button>
          </Paper>
        ) : (
          projects.map((proj, idx) => (
            <Card key={idx} withBorder radius="md" p="md" shadow="none">
              <Group justify="space-between" mb="xs">
                <Text fw={700} c="blue.7">Project #{idx + 1}</Text>
                <ActionIcon color="red" variant="subtle" onClick={() => handleRemoveProject(idx)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>

              <Stack gap="sm">
                <TextInput
                  label="Project Name"
                  placeholder="E-Commerce API"
                  required
                  value={proj.name}
                  onChange={(e) => handleProjectChange(idx, 'name', e.target.value)}
                />
                <TextInput
                  label="GitHub Repo Link"
                  placeholder="github.com/user/repo"
                  value={proj.githubLink}
                  onChange={(e) => handleProjectChange(idx, 'githubLink', e.target.value)}
                />
                <TextInput
                  label="Website Link"
                  placeholder="example.com"
                  value={proj.websiteLink}
                  onChange={(e) => handleProjectChange(idx, 'websiteLink', e.target.value)}
                />
                <Textarea
                  label="Project Description"
                  placeholder="Designed and built a microservice-based API supporting 10k DAU..."
                  minRows={2}
                  value={proj.description}
                  onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                />
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    );
  };

  // ----- CERTIFICATIONS -----
  const renderCertifications = () => {
    const certifications = resumeData.certifications;

    const handleAddCertField = () => {
      updateCertifications([
        ...certifications,
        { name: '', year: NaN, organization: '' },
      ]);
    };

    const handleRemoveCertField = (idx: number) => {
      const updated = [...certifications];
      updated.splice(idx, 1);
      updateCertifications(updated);
    };

    const handleCertChange = (idx: number, field: keyof Certification, val: any) => {
      const updated = [...certifications];
      if (field === 'year') {
        updated[idx] = { ...updated[idx], [field]: parseFloat(val) || NaN };
      } else {
        updated[idx] = { ...updated[idx], [field]: val };
      }
      updateCertifications(updated);
    };

    return (
      <Stack gap="md" p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={4} c="blue.6">Certifications</Title>
          <Button
            size="xs"
            leftSection={<IconPlus size={14} />}
            variant="outline"
            onClick={handleAddCertField}
          >
            Add New
          </Button>
        </Group>

        {certifications.length === 0 ? (
          <Paper withBorder p="xl" ta="center" radius="md">
            <Text c="dimmed" size="sm">No certifications added yet.</Text>
            <Button
              size="xs"
              mt="md"
              leftSection={<IconPlus size={14} />}
              onClick={handleAddCertField}
            >
              Add Certification
            </Button>
          </Paper>
        ) : (
          certifications.map((cert, idx) => (
            <Card key={idx} withBorder radius="md" p="md" shadow="none">
              <Group justify="space-between" mb="xs">
                <Text fw={700} c="blue.7">Certification #{idx + 1}</Text>
                <ActionIcon color="red" variant="subtle" onClick={() => handleRemoveCertField(idx)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>

              <Stack gap="sm">
                <TextInput
                  label="Certification Name"
                  placeholder="AWS Certified Solutions Architect"
                  required
                  value={cert.name}
                  onChange={(e) => handleCertChange(idx, 'name', e.target.value)}
                />
                <TextInput
                  label="Issuing Organization"
                  placeholder="Amazon Web Services"
                  required
                  value={cert.organization}
                  onChange={(e) => handleCertChange(idx, 'organization', e.target.value)}
                />
                <TextInput
                  label="Year of Receipt"
                  placeholder="YYYY"
                  type="number"
                  value={isNaN(cert.year) ? '' : cert.year.toString()}
                  onChange={(e) => handleCertChange(idx, 'year', e.target.value)}
                />
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    );
  };

  // ----- AWARDS -----
  const renderAwards = () => {
    const awards = resumeData.awards;

    const handleAddAward = () => {
      updateAwards([
        ...awards,
        { name: '', organization: '' },
      ]);
    };

    const handleRemoveAward = (idx: number) => {
      const updated = [...awards];
      updated.splice(idx, 1);
      updateAwards(updated);
    };

    const handleAwardChange = (idx: number, field: keyof Award, val: string) => {
      const updated = [...awards];
      updated[idx] = { ...updated[idx], [field]: val };
      updateAwards(updated);
    };

    return (
      <Stack gap="md" p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={4} c="blue.6">Awards / Achievements</Title>
          <Button
            size="xs"
            leftSection={<IconPlus size={14} />}
            variant="outline"
            onClick={handleAddAward}
          >
            Add New
          </Button>
        </Group>

        {awards.length === 0 ? (
          <Paper withBorder p="xl" ta="center" radius="md">
            <Text c="dimmed" size="sm">No awards added yet.</Text>
            <Button
              size="xs"
              mt="md"
              leftSection={<IconPlus size={14} />}
              onClick={handleAddAward}
            >
              Add Award
            </Button>
          </Paper>
        ) : (
          awards.map((award, idx) => (
            <Card key={idx} withBorder radius="md" p="md" shadow="none">
              <Group justify="space-between" mb="xs">
                <Text fw={700} c="blue.7">Award #{idx + 1}</Text>
                <ActionIcon color="red" variant="subtle" onClick={() => handleRemoveAward(idx)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>

              <Stack gap="sm">
                <TextInput
                  label="Award Title / Name"
                  placeholder="Employee of the Year"
                  required
                  value={award.name}
                  onChange={(e) => handleAwardChange(idx, 'name', e.target.value)}
                />
                <TextInput
                  label="Presenting Institution"
                  placeholder="Acme Org"
                  required
                  value={award.organization}
                  onChange={(e) => handleAwardChange(idx, 'organization', e.target.value)}
                />
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    );
  };

  // ----- LANGUAGES -----
  const renderLanguages = () => {
    const languages = resumeData.languages;

    const handleAddLang = () => {
      updateLanguages([
        ...languages,
        { name: '', proficiency: '' },
      ]);
    };

    const handleRemoveLang = (idx: number) => {
      const updated = [...languages];
      updated.splice(idx, 1);
      updateLanguages(updated);
    };

    const handleLangChange = (idx: number, field: keyof Language, val: any) => {
      const updated = [...languages];
      updated[idx] = { ...updated[idx], [field]: val };
      updateLanguages(updated);
    };

    return (
      <Stack gap="md" p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={4} c="blue.6">Languages</Title>
          <Button
            size="xs"
            leftSection={<IconPlus size={14} />}
            variant="outline"
            onClick={handleAddLang}
          >
            Add New
          </Button>
        </Group>

        {languages.length === 0 ? (
          <Paper withBorder p="xl" ta="center" radius="md">
            <Text c="dimmed" size="sm">No languages added yet.</Text>
            <Button
              size="xs"
              mt="md"
              leftSection={<IconPlus size={14} />}
              onClick={handleAddLang}
            >
              Add Language
            </Button>
          </Paper>
        ) : (
          languages.map((lang, idx) => (
            <Card key={idx} withBorder radius="md" p="md" shadow="none">
              <Group justify="space-between" mb="xs">
                <Text fw={700} c="blue.7">Language #{idx + 1}</Text>
                <ActionIcon color="red" variant="subtle" onClick={() => handleRemoveLang(idx)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>

              <Stack gap="sm">
                <TextInput
                  label="Language Name"
                  placeholder="Spanish / English"
                  required
                  value={lang.name}
                  onChange={(e) => handleLangChange(idx, 'name', e.target.value)}
                />
                <TextInput
                  label="Proficiency Level"
                  placeholder="High / Medium / Low"
                  value={lang.proficiency}
                  onChange={(e) => handleLangChange(idx, 'proficiency', e.target.value)}
                />
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    );
  };

  // ----- PATENTS -----
  const renderPatents = () => {
    const patents = resumeData.patents;

    const handleAddPatent = () => {
      updatePatents([
        ...patents,
        { name: '', year: NaN, description: '', link: '' },
      ]);
    };

    const handleRemovePatent = (idx: number) => {
      const updated = [...patents];
      updated.splice(idx, 1);
      updatePatents(updated);
    };

    const handlePatentChange = (idx: number, field: keyof Patent, val: any) => {
      const updated = [...patents];
      if (field === 'year') {
        updated[idx] = { ...updated[idx], [field]: parseFloat(val) || NaN };
      } else {
        updated[idx] = { ...updated[idx], [field]: val };
      }
      updatePatents(updated);
    };

    return (
      <Stack gap="md" p="md">
        <Group justify="space-between" align="center" mb="xs">
          <Title order={4} c="blue.6">Patents</Title>
          <Button
            size="xs"
            leftSection={<IconPlus size={14} />}
            variant="outline"
            onClick={handleAddPatent}
          >
            Add New
          </Button>
        </Group>

        {patents.length === 0 ? (
          <Paper withBorder p="xl" ta="center" radius="md">
            <Text c="dimmed" size="sm">No patents added yet.</Text>
            <Button
              size="xs"
              mt="md"
              leftSection={<IconPlus size={14} />}
              onClick={handleAddPatent}
            >
              Add Patent
            </Button>
          </Paper>
        ) : (
          patents.map((pat, idx) => (
            <Card key={idx} withBorder radius="md" p="md" shadow="none">
              <Group justify="space-between" mb="xs">
                <Text fw={700} c="blue.7">Patent #{idx + 1}</Text>
                <ActionIcon color="red" variant="subtle" onClick={() => handleRemovePatent(idx)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>

              <Stack gap="sm">
                <TextInput
                  label="Patent Title"
                  placeholder="Distributed stream synchronization..."
                  required
                  value={pat.name}
                  onChange={(e) => handlePatentChange(idx, 'name', e.target.value)}
                />
                <TextInput
                  label="Year Filed/Issued"
                  placeholder="YYYY"
                  type="number"
                  value={isNaN(pat.year) ? '' : pat.year.toString()}
                  onChange={(e) => handlePatentChange(idx, 'year', e.target.value)}
                />
                <TextInput
                  label="Patent Link"
                  placeholder="https://patents.google.com/..."
                  value={pat.link}
                  onChange={(e) => handlePatentChange(idx, 'link', e.target.value)}
                />
                <Textarea
                  label="Description"
                  placeholder="Brief description about the patent filing..."
                  minRows={2}
                  value={pat.description}
                  onChange={(e) => handlePatentChange(idx, 'description', e.target.value)}
                />
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    );
  };

  const renderActiveStep = () => {
    switch (activeTab) {
      case 'personalInfo':
        return renderPersonalInfo();
      case 'workExperience':
        return renderWorkExperience();
      case 'education':
        return renderEducation();
      case 'skills':
        return renderSkills();
      case 'projects':
        return renderProjects();
      case 'certifications':
        return renderCertifications();
      case 'awards':
        return renderAwards();
      case 'languages':
        return renderLanguages();
      case 'patents':
        return renderPatents();
      default:
        return null;
    }
  };

  return (
    <Container size="sm" p={0} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Horizontal pill tabs with scroll */}
      <Box
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-2)',
          backgroundColor: 'var(--mantine-color-white)',
          position: 'sticky',
          top: 0,
          zIndex: 5,
        }}
      >
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            gap: '8px',
            padding: '12px 16px',
            scrollbarWidth: 'none', // For Firefox
            msOverflowStyle: 'none', // For Internet Explorer
          }}
          className="hide-scrollbar"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                variant={isSelected ? 'filled' : 'light'}
                color="blue"
                size="sm"
                radius="xl"
                onClick={() => setActiveStep(tab.id)}
                leftSection={<Icon size={16} />}
                style={{ flexShrink: 0 }}
              >
                {tab.label}
              </Button>
            );
          })}
        </div>
      </Box>

      {/* Editor Body */}
      <Box style={{ flex: 1, paddingBottom: '160px' }} bg="var(--mantine-color-white)">
        {renderActiveStep()}
      </Box>

      {/* Next/Prev Navigation */}
      <Paper
        withBorder
        p="sm"
        style={{
          position: 'fixed',
          bottom: '60px', // Right above the bottom footer toolbar
          left: 0,
          right: 0,
          zIndex: 10,
          borderBottom: 'none',
        }}
      >
        <Container size="sm">
          <Group justify="space-between">
            <Button
              variant="outline"
              disabled={currentTabIndex === 0}
              onClick={handlePrev}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentTabIndex === tabs.length - 1 ? 'Preview Resume' : 'Next'}
            </Button>
          </Group>
        </Container>
      </Paper>
    </Container>
  );
}