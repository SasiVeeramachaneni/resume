import type { TemplateDescriptor } from "../types";
import { ClassicLayout } from "./ClassicLayout";
import classes from "./preview.module.css";

export const classicTemplate: TemplateDescriptor = {
  metadata: {
    value: "classic",
    title: "Classic",
    description: "Single-column resume layout",
  },
  // The reorder widget sits to the left for every section in the classic layout.
  sectionSides: {
    workExperience: "left",
    projects: "left",
    skills: "left",
    certifications: "left",
    awards: "left",
    education: "left",
    languages: "left",
    patents: "left",
  },
  previewClassName: classes.preview,
  mobilePreviewClassName: classes.mobilePreview,
  Layout: ClassicLayout,
};
