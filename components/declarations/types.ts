export interface ResumeData {
  personalInfo: PersonalInfo;
  settings: Settings;
  workExperience: WorkExperience[];
  skills: string[];
  certifications: Certification[];
  awards: Award[];
  education: Education[];
  publications: Publication[];
}

export interface Settings {
  isLinkedIn: boolean;
  isGithub: boolean;
  isImage: boolean;
  isAwards: boolean;
  isCertifications: boolean;
  isPatents: boolean;
  isPersonalProjects: boolean;
  isLanguages: boolean;
}

export interface PersonalInfo {
  name: string;
  title: string;
  aboutMe: string;
  image?: string; 
  email: string;
  phoneNumber: string;
  linkedIn?: string; 
  github?: string; 
}

export interface WorkExperience {
  organization: string;
  from: Date;  // changed from Date to string
  to?: Date;    // changed from Date to string
  isCurrent: boolean;
  role: string;
  points: string[];
}

export interface Award {
  name: string;
  organization: string;
}

export interface Education {
  degree: string;
  college: string;
  discipline: string;
  year: number;
  percentage: number;
}

export interface Publication {
  label: string;
  year: number;
  link: string;
  desc: string;
}

export interface Certification {
  name: string;
  year: number;
  organization: string;
}
