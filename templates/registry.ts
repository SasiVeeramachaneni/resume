import type {
  TemplateDescriptor,
  TemplateMetadata,
  TemplateValue,
} from "./types";
import { professionalTemplate } from "./professional";
import { classicTemplate } from "./classic";

// To add a new template: create templates/<name>/ with a descriptor and
// append it here. Everything else (the picker, the resume page, the PDF link)
// picks templates up from this registry automatically.
export const allTemplates: TemplateDescriptor[] = [
  professionalTemplate,
  classicTemplate,
];

export function getTemplate(value: TemplateValue): TemplateDescriptor {
  return (
    allTemplates.find((t) => t.metadata.value === value) ?? professionalTemplate
  );
}

// Metadata list consumed by the template picker in the header.
export const templateOptions: TemplateMetadata[] = allTemplates.map(
  (t) => t.metadata,
);

export type {
  TemplateDescriptor,
  TemplateMetadata,
  TemplateValue,
  SectionName,
} from "./types";
