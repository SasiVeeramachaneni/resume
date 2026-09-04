import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  ResumeData,
  WorkExperience,
  Award,
  Education,
  Certification,
  Publication,
  Settings,
  PersonalInfo,
  Patent,
  Project,
  Language,
} from "./types";

// Initializing the resume data with correct property names
const initialResumeData: ResumeData = {
  personalInfo: {
    name: "",
    title: "",
    aboutMe: "",
    image: "",
    email: "",
    phoneNumber: "",
    linkedIn: "",
    github: "",
  },
  settings: {
    template: "professional",
    isLinkedIn: true,
    isGithub: false,
    isImage: true,
    isAwards: true,
    isCertifications: true,
    isPatents: false,
    isPersonalProjects: false,
    isLanguages: false,
  },
  workExperience: [],
  skills: [],
  certifications: [],
  awards: [],
  education: [],
  languages: [],
  patents: [],
  projects: [],
  publications: [],
};

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>; // Add this line
  updatePersonalInfo: (
    field: keyof ResumeData["personalInfo"],
    value: string,
  ) => void;
  updateSettings: (updatedSettings: Partial<Settings>) => void;
  updateWorkExperience: (workExperience: WorkExperience[]) => void;
  updateSkills: (skills: string[]) => void;
  updateCertifications: (certifications: Certification[]) => void;
  updateAwards: (awards: Award[]) => void;
  updateEducation: (education: Education[]) => void;
  updateLanguages: (languages: Language[]) => void;
  updatePatents: (patents: Patent[]) => void;
  updateProjects: (projects: Project[]) => void;
  updatePublications: (publications: Publication[]) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

function isCorruptedEducationValue(value: string): boolean {
  if (!value) return false;
  if (value.includes("__RESUME_JSON") || value.includes("RESUME_JSON")) return true;
  const trimmed = value.trim();
  if (trimmed.length > 15 && /^[A-Za-z0-9+/=_-]+$/.test(trimmed) && !trimmed.includes(" ")) {
    try {
      const padded = trimmed.padEnd(trimmed.length + ((4 - (trimmed.length % 4)) % 4), "=");
      let decoded: string;
      if (typeof atob === "function") {
        decoded = atob(padded);
      } else {
        // @ts-ignore
        decoded = Buffer.from(padded, "base64").toString("utf-8");
      }
      if (/["{:\[]/.test(decoded) && /[a-zA-Z]/.test(decoded)) return true;
    } catch {}
    if (trimmed.length > 30) return true;
    if (trimmed.startsWith("eyJ") || trimmed.includes("eyJw")) return true;
  }
  return false;
}

function sanitizeResumeData(data: ResumeData): ResumeData {
  let needsSanitize = false;
  const filteredEducation = (data.education || []).filter((edu) => {
    const corrupted =
      isCorruptedEducationValue(edu.degree) ||
      isCorruptedEducationValue(edu.college) ||
      isCorruptedEducationValue(edu.discipline);
    if (corrupted) needsSanitize = true;
    return !corrupted;
  });
  if (needsSanitize) {
    return { ...data, education: filteredEducation };
  }
  return data;
}

const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumeData, setResumeDataRaw] = useState<ResumeData>(() => {
    // Hydrate from localStorage for returning users (PDF download also saves here)
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("resumeData");
        if (stored) {
          const parsed = JSON.parse(stored) as ResumeData;
          // Basic validation that it looks like resume data
          if (parsed && parsed.personalInfo && Array.isArray(parsed.skills)) {
            const sanitized = sanitizeResumeData(parsed);
            // If sanitized, overwrite corrupted storage
            if (sanitized !== parsed) {
              try {
                localStorage.setItem("resumeData", JSON.stringify(sanitized));
              } catch {}
            }
            return sanitized;
          }
        }
      } catch {
        // ignore parse errors
      }
    }
    return initialResumeData;
  });

  // Wrap setter to always sanitize (prevents corrupted education from PDF import persisting)
  const setResumeData: React.Dispatch<React.SetStateAction<ResumeData>> = React.useCallback(
    (value: React.SetStateAction<ResumeData>) => {
      setResumeDataRaw((prev) => {
        const next = typeof value === "function" ? (value as (prev: ResumeData) => ResumeData)(prev) : value;
        return sanitizeResumeData(next);
      });
    },
    [],
  );

  // Immediate cleanup for already-mounted corrupted state (user sees JSON in EDUCATION as in screenshot)
  useEffect(() => {
    const sanitized = sanitizeResumeData(resumeData);
    if (sanitized !== resumeData) {
      setResumeDataRaw(sanitized);
      try {
        localStorage.setItem("resumeData", JSON.stringify(sanitized));
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist changes so refresh / return keeps edits
  useEffect(() => {
    try {
      // Avoid persisting empty initial state on first mount if no data yet
      const hasContent =
        resumeData.personalInfo.name ||
        resumeData.personalInfo.email ||
        resumeData.skills.length > 0 ||
        resumeData.workExperience.length > 0 ||
        resumeData.education.length > 0;
      if (hasContent) {
        localStorage.setItem("resumeData", JSON.stringify(resumeData));
      }
    } catch {
      // ignore quota errors
    }
  }, [resumeData]);

  const updatePersonalInfo = (
    field: keyof ResumeData["personalInfo"],
    value: string,
  ) => {
    setResumeData((prevData) => ({
      ...prevData,
      personalInfo: { ...prevData.personalInfo, [field]: value },
    }));
  };

  const updateSettings = (updatedSettings: Partial<Settings>) => {
    setResumeData((prevData) => ({
      ...prevData,
      settings: { ...prevData.settings, ...updatedSettings },
    }));
  };

  const updateWorkExperience = (workExperience: WorkExperience[]) => {
    setResumeData((prevData) => ({ ...prevData, workExperience }));
  };

  const updateSkills = (skills: string[]) => {
    setResumeData((prevData) => ({ ...prevData, skills }));
  };

  const updateCertifications = (certifications: Certification[]) => {
    setResumeData((prevData) => ({ ...prevData, certifications }));
  };

  const updateAwards = (awards: Award[]) => {
    setResumeData((prevData) => ({ ...prevData, awards }));
  };

  const updateEducation = (education: Education[]) => {
    setResumeData((prevData) => ({ ...prevData, education }));
  };

  const updateLanguages = (languages: Language[]) => {
    setResumeData((prevData) => ({ ...prevData, languages }));
  };

  const updatePatents = (patents: Patent[]) => {
    setResumeData((prevData) => ({ ...prevData, patents }));
  };

  const updateProjects = (projects: Project[]) => {
    setResumeData((prevData) => ({ ...prevData, projects }));
  };

  const updatePublications = (publications: Publication[]) => {
    setResumeData((prevData) => ({ ...prevData, publications }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        setResumeData,
        updatePersonalInfo,
        updateSettings,
        updateWorkExperience,
        updateSkills,
        updateCertifications,
        updateAwards,
        updateEducation,
        updateLanguages,
        updatePatents,
        updateProjects,
        updatePublications,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export { ResumeProvider, ResumeContext };
