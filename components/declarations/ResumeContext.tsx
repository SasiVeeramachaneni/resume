'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { ResumeData, WorkExperience, Award, Education, Certification, Publication, Settings, PersonalInfo } from './types';

// Initializing the resume data with correct property names
const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    title: '',
    aboutMe: '',
    image: '',
    email: '',
    phoneNumber: '',
    linkedIn: '',
    github: '',
  },
  settings: {
    isLinkedIn: true,
    isGithub: false,
    isImage: false,
    isAwards: true,
    isCertifications: true,
    isPatents: false,
    isPersonalProjects: false,
    isLanguages: false
  },
  workExperience: [],
  skills: [],
  certifications: [],
  awards: [],
  education: [],
  publications: [],
};

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>; // Add this line
  updatePersonalInfo: (field: keyof ResumeData['personalInfo'], value: string) => void;
  updateSettings: (updatedSettings: Partial<Settings>) => void;
  updateWorkExperience: (workExperience: WorkExperience[]) => void;
  updateSkills: (skills: string[]) => void;
  updateCertifications: (certifications: Certification[]) => void;
  updateAwards: (awards: Award[]) => void;
  updateEducation: (education: Education[]) => void;
  updatePublications: (publications: Publication[]) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
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
        updatePublications,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export { ResumeProvider, ResumeContext };
