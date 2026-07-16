import type React from "react";
import type { ResumeData } from "@/components/declarations/types";

// The set of reorderable/editable resume sections. Kept here (not in the
// resume page) so each template can reference it without importing the page.
export type SectionName =
  | "workExperience"
  | "projects"
  | "education"
  | "awards"
  | "certifications"
  | "skills"
  | "languages"
  | "patents";

// Adding a new template only requires widening this union (or use `string`)
// plus an entry in the registry.
export type TemplateValue = "professional" | "classic";

export interface TemplateMetadata {
  value: TemplateValue;
  title: string;
  description: string;
}

// Pre-built React nodes for every section. The resume page builds these from
// the shared section components and hands them to the template layout, so the
// template only decides *where* and *in what order* to render them.
export interface TemplateSections {
  workExperience: React.ReactNode;
  projects: React.ReactNode;
  education: React.ReactNode;
  awards: React.ReactNode;
  certifications: React.ReactNode;
  skills: React.ReactNode;
  languages: React.ReactNode;
  patents: React.ReactNode;
}

export interface TemplateLayoutProps {
  sections: TemplateSections;
  isPatents: boolean;
  isPersonalProjects: boolean;
  isLanguages: boolean;
  // Wraps a section node with the ref-bearing div the reorder widget tracks.
  wrapSection: (
    section: SectionName,
    children: React.ReactNode,
  ) => React.ReactNode;
}

// Everything the app needs to know about a template, in one descriptor.
// To add a template: create a folder under templates/<name>/, export a
// TemplateDescriptor, and register it in templates/registry.ts.
export interface TemplateDescriptor {
  metadata: TemplateMetadata;
  // Which side the reorder widget appears on for each section.
  sectionSides: Record<SectionName, "left" | "right">;
  // CSS module class names for the template-picker preview swatches.
  previewClassName: string;
  mobilePreviewClassName: string;
  // Editor layout renderer.
  Layout: React.FC<TemplateLayoutProps>;
  // Optional per-template PDF document; falls back to the shared ResumePDF.
  PDFDocument?: React.FC<{ resumeData: ResumeData }>;
}
