import { useCallback, useState } from "react";
import useResume from "@/components/declarations/useResume";
import type {
  ResumeData,
  WorkExperience,
  Certification,
  Award,
  Education,
  Project,
} from "@/components/declarations/types";

export type LinkedInImportStatus = "idle" | "loading" | "success" | "error";

export interface UseLinkedInImportResult {
  status: LinkedInImportStatus;
  error: string | null;
  importedFields: number;
  importFromLinkedIn: () => Promise<void>;
  reset: () => void;
}

// Merge imported LinkedIn data into the existing resume, only overwriting
// fields that LinkedIn actually provided. This preserves anything the user
// has already typed in.
function mergeResumeData(
  current: ResumeData,
  incoming: ResumeData,
): { merged: ResumeData; filled: number } {
  let filled = 0;

  const personalInfo = { ...current.personalInfo };
  (
    Object.keys(incoming.personalInfo) as (keyof ResumeData["personalInfo"])[]
  ).forEach((k) => {
    const v = incoming.personalInfo[k];
    if (v && !personalInfo[k]) {
      personalInfo[k] = v as never;
      filled += 1;
    }
  });

  const mergeArrays = <T>(cur: T[], inc: T[]): T[] => {
    if (inc.length === 0) return cur;
    filled += inc.length;
    return inc;
  };

  const merged: ResumeData = {
    ...current,
    personalInfo,
    settings: { ...current.settings, ...incoming.settings },
    workExperience:
      Array.isArray(incoming.workExperience) && incoming.workExperience.length
        ? mergeArrays(current.workExperience, incoming.workExperience)
        : current.workExperience,
    skills:
      Array.isArray(incoming.skills) && incoming.skills.length
        ? mergeArrays(current.skills, incoming.skills)
        : current.skills,
    certifications:
      Array.isArray(incoming.certifications) && incoming.certifications.length
        ? mergeArrays(current.certifications, incoming.certifications)
        : current.certifications,
    awards:
      Array.isArray(incoming.awards) && incoming.awards.length
        ? mergeArrays(current.awards, incoming.awards)
        : current.awards,
    education:
      Array.isArray(incoming.education) && incoming.education.length
        ? mergeArrays(current.education, incoming.education)
        : current.education,
    projects:
      Array.isArray(incoming.projects) && incoming.projects.length
        ? mergeArrays(current.projects, incoming.projects)
        : current.projects,
    languages: current.languages,
    patents: current.patents,
    publications: current.publications,
  };

  return { merged, filled };
}

// Talk to the dev-only Vite middleware which in turn talks to the LinkedIn
// MCP server. Returns helpful errors when running in a production build
// (where the endpoint does not exist) or when the MCP server is not
// configured.
export function useLinkedInImport(): UseLinkedInImportResult {
  const { resumeData, setResumeData } = useResume();
  const [status, setStatus] = useState<LinkedInImportStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [importedFields, setImportedFields] = useState(0);

  const importFromLinkedIn = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/linkedin/import", { method: "POST" });
      if (res.status === 404) {
        throw new Error(
          "LinkedIn import is only available during local development (npm run dev). " +
            "The MCP bridge is not served in production builds.",
        );
      }
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(
          data.error || `Request failed with status ${res.status}`,
        );
      }
      const { merged, filled } = mergeResumeData(
        resumeData,
        data.resumeData as ResumeData,
      );
      setResumeData(merged);
      setImportedFields(filled);
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStatus("error");
    }
  }, [resumeData, setResumeData]);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setImportedFields(0);
  }, []);

  return { status, error, importedFields, importFromLinkedIn, reset };
}

export default useLinkedInImport;
