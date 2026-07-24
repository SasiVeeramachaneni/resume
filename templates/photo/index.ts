import type { TemplateDescriptor } from "../types";
import { PhotoLayout } from "./PhotoLayout";
import classes from "./preview.module.css";

export const photoTemplate: TemplateDescriptor = {
  metadata: {
    value: "photo",
    title: "Photo",
    description: "Sidebar resume layout built for a profile photo",
  },
  sectionSides: {
    workExperience: "right",
    projects: "right",
    skills: "left",
    certifications: "left",
    awards: "right",
    education: "right",
    languages: "left",
    patents: "left",
  },
  previewClassName: classes.preview,
  mobilePreviewClassName: classes.mobilePreview,
  Layout: PhotoLayout,
};
