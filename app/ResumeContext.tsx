'use client'

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ResumeData, WorkExperience, Award, Education, Certification, Publication } from './types';

const initialResumeData: ResumeData = {
    Name: "",
    Role: "",
    AboutMe: "",
    Image: "",
    Email: "",
    PhoneNumber: "",
    LinkedIn: "",
    github: "",
    workExperience: [],
    skills: [],
    certifications: [],
    awards: [],
    education: [],
    publications: []
};

interface ResumeContextType {
  resumeData: ResumeData;
  updateName: (name: string) => void;
  updateRole: (Role: string) => void;
  updateAboutMe: (AboutMe: string) => void;
  updateImage: (Image: string) => void;
  updatePhoneNumber: (PhoneNumber: string) => void;
  updateLinkedIn: (LinkedIn: string) => void;
  updateGithub: (github: string) => void;
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

  const updateName = (Name: string) => {
    setResumeData((prevData) => ({ ...prevData, Name }));
  };

  const updateRole = (Role: string) => {
    setResumeData((prevData) => ({ ...prevData, Role }));
  };

  const updateAboutMe = (AboutMe: string) => {
    setResumeData((prevData) => ({ ...prevData, AboutMe }));
  };

  const updateImage = (Image: string) => {
    setResumeData((prevData) => ({ ...prevData, Image }));
  };

  const updatePhoneNumber = (PhoneNubmer: string) => {
    setResumeData((prevData) => ({ ...prevData, PhoneNubmer }));
  };

  const updateLinkedIn = (LinkedIn: string) => {
    setResumeData((prevData) => ({ ...prevData, LinkedIn }));
  };

  const updateGithub = (github: string) => {
    setResumeData((prevData) => ({ ...prevData, github }));
  };

  const updateWorkExperience = (workExperience: WorkExperience[]) => {
    setResumeData((prevData) => ({ ...prevData, workExperience }));
  };

  const updateAwards = (awards: Award[]) => {
    setResumeData((prevData) => ({ ...prevData, awards }));
  };

  const updateEducation = (education: Education[]) => {
    setResumeData((prevData) => ({ ...prevData, education }));
  };

  const updatePublications = (publication: Publication[]) => {
    setResumeData((prevData) => ({ ...prevData, publication }));
  }

  const updateCertifications = (certification: Certification[]) => {
    setResumeData((prevData) => ({ ...prevData, certification }));
  }

  const updateSkills = (skill: String[]) => {
    setResumeData((prevData) => ({ ...prevData, skill }));
  }

  return (
    <ResumeContext.Provider value={{ resumeData, updateName, updateRole, updateAboutMe, updateImage, updatePhoneNumber, updateLinkedIn, updateGithub, updateWorkExperience, updateAwards, updateEducation, updatePublications, updateCertifications, updateSkills }}>
      {children}
    </ResumeContext.Provider>
  );
};

export { ResumeProvider, ResumeContext };
