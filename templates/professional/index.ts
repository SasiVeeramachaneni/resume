import type { TemplateDescriptor } from "../types";
import { ProfessionalLayout } from "./ProfessionalLayout";
import classes from "./preview.module.css";

export const professionalTemplate: TemplateDescriptor = {
  metadata: {
    value: "professional",
    title: "Professional",
    description: "Two-column professional resume layout",
  },
  sectionSides: {
    workExperience: "left",
    projects: "left",
    skills: "right",
    certifications: "right",
    awards: "right",
    education: "right",
    languages: "right",
    patents: "right",
  },
  previewClassName: classes.preview,
  mobilePreviewClassName: classes.mobilePreview,
  Layout: ProfessionalLayout,
};
