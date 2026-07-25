"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import { usePageMeta } from "@/app/usePageMeta";
import { ResumeHeader } from "@/components/ResumeHeader/ResumeHeader";
import { Container, Paper, Group, Text, UnstyledButton, Loader, Card, Stack, Title, Button } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconEdit, IconEye, IconPalette, IconDownload } from "@tabler/icons-react";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import ResumePDF from "@/components/ResumePDF/ResumePDF";
import { MobileEditor } from "@/components/MobileEditor/MobileEditor";
import { PersonalInfo } from "@/components/PersonalInfo/PersonalInfo";
import { PhotoPersonalInfo } from "@/components/PersonalInfo/PhotoPersonalInfo";
import { Skills } from "@/components/Skills/Skills";
import { PhotoSkills } from "@/components/Skills/PhotoSkills";
import { Certifications } from "@/components/Certifications/Certifications";
import { Awards } from "@/components/Awards/Awards";
import { Education } from "@/components/Education/Education";
import { Languages } from "@/components/Languages/Languages";
import { Patents } from "@/components/Patents/Patents";
import { Projects } from "@/components/Projects/Projects";
import { WorkExperience } from "@/components/WorkExp/WorkExp";
import { ReorderWidget } from "@/components/ReorderWidget/ReorderWidget";
import { ResumeContext } from "@/components/declarations/ResumeContext";
import type {
  WorkExperience as WorkExpType,
  Project,
  Education as EduType,
  Award,
  Certification,
  Language,
  Patent,
} from "@/components/declarations/types";
import { getTemplate, templateOptions } from "@/templates";
import type { SectionName } from "@/templates";

export default function ResumeBuilder() {
  usePageMeta(
    "Resume Builder - Edit & Customize Your Resume Online",
    "Edit your resume with our intuitive builder. Add work experience, skills, education, and more. Choose between professional, classic and photo templates.",
  );
  const resumeContext = React.useContext(ResumeContext);

  if (!resumeContext) {
    throw new Error("ResumeContext must be used within a ResumeProvider");
  }

  const {
    resumeData,
    updateSettings,
    updateWorkExperience,
    updateProjects,
    updateEducation,
    updateAwards,
    updateCertifications,
    updateSkills,
    updateLanguages,
    updatePatents,
  } = resumeContext;
  const { isPatents, isPersonalProjects, isLanguages, template } =
    resumeData.settings;
  const templateDescriptor = getTemplate(template);

  const [activeSection, setActiveSection] = useState<SectionName | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const isMobile = useMediaQuery("(max-width: 48em)");
  const [mobileViewMode, setMobileViewMode] = useState<"edit" | "templates" | "preview">("edit");

  const handleDownload = async () => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
  };

  const innerContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<
    Partial<Record<SectionName, HTMLDivElement | null>>
  >({});
  const [widgetPos, setWidgetPos] = useState<{
    top: number;
    side: "left" | "right";
  } | null>(null);

  const handleEditingChange = (section: SectionName, index: number | null) => {
    setActiveSection(index !== null ? section : null);
    setEditingIndex(index);
  };

  useLayoutEffect(() => {
    const updatePos = () => {
      if (
        activeSection &&
        editingIndex !== null &&
        innerContainerRef.current &&
        sectionRefs.current[activeSection]
      ) {
        const containerRect = innerContainerRef.current.getBoundingClientRect();
        const sectionRect =
          sectionRefs.current[activeSection]!.getBoundingClientRect();
        setWidgetPos({
          top: sectionRect.top - containerRect.top + 4,
          side: templateDescriptor.sectionSides[activeSection],
        });
      } else {
        setWidgetPos(null);
      }
    };

    updatePos();
    window.addEventListener("resize", updatePos);
    return () => window.removeEventListener("resize", updatePos);
  }, [activeSection, editingIndex, resumeData, templateDescriptor]);

  function getData(section: SectionName) {
    switch (section) {
      case "workExperience":
        return resumeData.workExperience;
      case "projects":
        return resumeData.projects;
      case "education":
        return resumeData.education;
      case "awards":
        return resumeData.awards;
      case "certifications":
        return resumeData.certifications;
      case "skills":
        return resumeData.skills;
      case "languages":
        return resumeData.languages;
      case "patents":
        return resumeData.patents;
    }
  }

  function updateData(section: SectionName, data: any) {
    switch (section) {
      case "workExperience":
        updateWorkExperience(data as WorkExpType[]);
        break;
      case "projects":
        updateProjects(data as Project[]);
        break;
      case "education":
        updateEducation(data as EduType[]);
        break;
      case "awards":
        updateAwards(data as Award[]);
        break;
      case "certifications":
        updateCertifications(data as Certification[]);
        break;
      case "skills":
        updateSkills(data as string[]);
        break;
      case "languages":
        updateLanguages(data as Language[]);
        break;
      case "patents":
        updatePatents(data as Patent[]);
        break;
    }
  }

  const handleMoveUp = () => {
    if (activeSection === null || editingIndex === null || editingIndex === 0)
      return;
    const data = [...getData(activeSection)];
    [data[editingIndex - 1], data[editingIndex]] = [
      data[editingIndex],
      data[editingIndex - 1],
    ];
    updateData(activeSection, data);
    setEditingIndex(editingIndex - 1);
  };

  const handleMoveDown = () => {
    if (activeSection === null || editingIndex === null) return;
    const data = [...getData(activeSection)];
    if (editingIndex === data.length - 1) return;
    [data[editingIndex], data[editingIndex + 1]] = [
      data[editingIndex + 1],
      data[editingIndex],
    ];
    updateData(activeSection, data);
    setEditingIndex(editingIndex + 1);
  };

  const handleDelete = () => {
    if (activeSection === null || editingIndex === null) return;
    const data = [...getData(activeSection)];
    data.splice(editingIndex, 1);
    updateData(activeSection, data);
    setEditingIndex(null);
    setActiveSection(null);
  };

  const wrapSection = (section: SectionName, children: React.ReactNode) => {
    return (
      <div
        ref={(el) => {
          sectionRefs.current[section] = el;
        }}
      >
        {children}
      </div>
    );
  };

  const sectionProps = (section: SectionName) => ({
    editingIndex: activeSection === section ? editingIndex : null,
    onEditingChange: (i: number | null) => handleEditingChange(section, i),
  });

  const sections = {
    workExperience: <WorkExperience {...sectionProps("workExperience")} />,
    projects: <Projects {...sectionProps("projects")} />,
    education: <Education {...sectionProps("education")} />,
    awards: <Awards {...sectionProps("awards")} />,
    certifications: <Certifications {...sectionProps("certifications")} />,
    skills:
      template === "photo" ? (
        <PhotoSkills {...sectionProps("skills")} />
      ) : (
        <Skills {...sectionProps("skills")} />
      ),
    languages: <Languages {...sectionProps("languages")} />,
    patents: <Patents {...sectionProps("patents")} />,
  };
  const TemplateLayout = templateDescriptor.Layout;

  if (isMobile) {
    return (
      <div style={{ minHeight: "100vh", position: "relative", backgroundColor: "var(--mantine-color-white)" }}>
        {mobileViewMode === "edit" && (
          <>
            <Paper
              withBorder
              p="sm"
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                borderLeft: 'none',
                borderRight: 'none',
                borderTop: 'none',
                backgroundColor: '#ffffff',
              }}
            >
              <Group justify="space-between" align="center">
                <div style={{ width: 60 }} />
                <Text fw={700} size="lg">Resume Editor</Text>
                <UnstyledButton
                  onClick={() => setMobileViewMode("preview")}
                  style={{
                    color: "var(--mantine-color-blue-6)",
                    fontWeight: 600,
                    fontSize: "16px",
                    width: 60,
                    textAlign: "right",
                  }}
                >
                  Done
                </UnstyledButton>
              </Group>
            </Paper>
            <MobileEditor onDone={() => setMobileViewMode("preview")} />
          </>
        )}

        {mobileViewMode === "templates" && (
          <>
            <Paper
              withBorder
              p="sm"
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                borderLeft: 'none',
                borderRight: 'none',
                borderTop: 'none',
                backgroundColor: '#ffffff',
              }}
            >
              <Group justify="center" align="center">
                <Text fw={700} size="lg">Choose Template</Text>
              </Group>
            </Paper>
            <Container size="sm" p="md" style={{ overflowY: "auto", paddingBottom: "100px" }}>
              <Title order={3} ta="center" mb="md" mt="xs">Select Template</Title>
              <Text ta="center" size="sm" c="dimmed" mb="xl">
                Choose a professional design for your resume. You can switch any time.
              </Text>
              <Stack gap="lg">
                {templateOptions.map((opt) => {
                  const isSelected = template === opt.value;
                  const descriptor = getTemplate(opt.value);
                  return (
                    <Card
                      key={opt.value}
                      withBorder
                      shadow="sm"
                      radius="md"
                      p="md"
                      style={{
                        borderColor: isSelected ? "var(--mantine-color-blue-6)" : "var(--mantine-color-gray-2)",
                        borderWidth: isSelected ? "2px" : "1px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                        <div
                          className={descriptor.mobilePreviewClassName}
                          style={{
                            width: "140px",
                            height: "190px",
                            border: "1px solid var(--mantine-color-gray-3)",
                            borderRadius: "4px",
                            backgroundColor: "var(--mantine-color-gray-0)",
                            boxShadow: "var(--mantine-shadow-xs)"
                          }}
                        />
                      </div>
                      <Text fw={700} size="md" ta="center" mb={4}>{opt.title}</Text>
                      <Text size="xs" c="dimmed" ta="center" mb="md" style={{ minHeight: "36px" }}>
                        {opt.description}
                      </Text>
                      <Button
                        fullWidth
                        variant={isSelected ? "light" : "filled"}
                        color={isSelected ? "green" : "blue"}
                        onClick={() => {
                          updateSettings({ template: opt.value });
                          setMobileViewMode("preview");
                        }}
                      >
                        {isSelected ? "Active (Selected)" : "Select"}
                      </Button>
                    </Card>
                  );
                })}
              </Stack>
            </Container>
          </>
        )}

        {mobileViewMode === "preview" && (
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingBottom: "80px" }}>
            <ResumeHeader />
            <Container size="sm" p="md" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Group justify="space-between" align="center" mb="md">
                <Title order={4} c="blue.6">PDF Preview</Title>
                <PDFDownloadLink
                  key={JSON.stringify(resumeData)}
                  document={<ResumePDF resumeData={resumeData} />}
                  fileName="resume.pdf"
                >
                  <Button
                    onClick={handleDownload}
                    size="xs"
                    rightSection={<IconDownload size={14} />}
                  >
                    Download PDF
                  </Button>
                </PDFDownloadLink>
              </Group>

              <Paper withBorder p={0} shadow="sm" radius="md" style={{ flex: 1, minHeight: "450px", backgroundColor: "#f8f9fa", overflow: "hidden" }}>
                <BlobProvider document={<ResumePDF resumeData={resumeData} />}>
                  {({ blob, url, loading, error }) => {
                    if (loading) {
                      return (
                        <div style={{ display: "flex", height: "450px", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
                          <Loader size="md" mb="md" />
                          <Text size="sm" c="dimmed">Generating professional PDF preview...</Text>
                        </div>
                      );
                    }
                    if (error) {
                      return (
                        <div style={{ display: "flex", height: "450px", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px" }}>
                          <Text size="sm" color="red">Failed to generate PDF automatically.</Text>
                          <Text size="xs" c="dimmed" mt="xs" ta="center">You can still download the PDF directly using the download button above.</Text>
                        </div>
                      );
                    }
                    return (
                      <iframe
                        src={url ? `${url}#toolbar=0&navpanes=0` : undefined}
                        style={{
                          width: "100%",
                          height: "calc(100vh - 220px)",
                          minHeight: "450px",
                          border: "none",
                        }}
                        title="Resume PDF Preview"
                      />
                    );
                  }}
                </BlobProvider>
              </Paper>
            </Container>
          </div>
        )}

        <Paper
          withBorder
          shadow="md"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            backgroundColor: "#ffffff",
            borderTop: "1px solid var(--mantine-color-gray-2)",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            zIndex: 101,
          }}
        >
          <UnstyledButton
            onClick={() => setMobileViewMode("edit")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              height: "100%",
              color: mobileViewMode === "edit" ? "var(--mantine-color-blue-6)" : "var(--mantine-color-gray-5)",
            }}
          >
            <IconEdit size={20} />
            <Text size="xs" style={{ marginTop: 4, fontWeight: mobileViewMode === "edit" ? 600 : 400 }}>
              Edit Details
            </Text>
          </UnstyledButton>
          <UnstyledButton
            onClick={() => setMobileViewMode("templates")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              height: "100%",
              color: mobileViewMode === "templates" ? "var(--mantine-color-blue-6)" : "var(--mantine-color-gray-5)",
            }}
          >
            <IconPalette size={20} />
            <Text size="xs" style={{ marginTop: 4, fontWeight: mobileViewMode === "templates" ? 600 : 400 }}>
              Templates
            </Text>
          </UnstyledButton>
          <UnstyledButton
            onClick={() => setMobileViewMode("preview")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              height: "100%",
              color: mobileViewMode === "preview" ? "var(--mantine-color-blue-6)" : "var(--mantine-color-gray-5)",
            }}
          >
            <IconEye size={20} />
            <Text size="xs" style={{ marginTop: 4, fontWeight: mobileViewMode === "preview" ? 600 : 400 }}>
              Preview PDF
            </Text>
          </UnstyledButton>
        </Paper>
      </div>
    );
  }

  return (
    <>
      <ResumeHeader />
      <Container pt={20} pb={40} fluid bg="var(--mantine-color-blue-light)">
        <Container
          ref={innerContainerRef}
          size="xl"
          p={template === "photo" ? 0 : undefined}
          pt={template === "photo" ? 0 : 40}
          pb={template === "photo" ? 0 : 40}
          bg="var(--mantine-color-white)"
          style={{
            position: "relative",
            minHeight: "297mm"
          }}
          className={template === "photo" ? "photo-template" : undefined}
        >
          {widgetPos && (
            <div
              style={{
                position: "absolute",
                top: `${widgetPos.top}px`,
                ...(widgetPos.side === "left"
                  ? { left: "-36px" }
                  : { right: "-36px" }),
                zIndex: 10,
              }}
            >
              <ReorderWidget
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onDelete={handleDelete}
                isFirst={editingIndex === 0}
                isLast={
                  activeSection !== null &&
                  editingIndex === getData(activeSection).length - 1
                }
              />
            </div>
          )}
          {template !== "photo" && <PersonalInfo />}
          <TemplateLayout
            sections={sections}
            isPatents={isPatents}
            isPersonalProjects={isPersonalProjects}
            isLanguages={isLanguages}
            wrapSection={wrapSection}
          />
        </Container>
      </Container>
    </>
  );
}
