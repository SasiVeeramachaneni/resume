export interface ResumeData {
    Name: string;
    Role: String;
    AboutMe: String;
    Image: String;
    Email: String;
    PhoneNumber: String;
    LinkedIn: String;
    github: String;
    workExperience: WorkExperience[];
    skills: String[];
    certifications: Certification[];
    awards: Award[];
    education: Education[];
    publications: Publication[];
  }

  export interface WorkExperience {
    organizationName: string;
    startDate: string;
    endDate: string;
    isCurrentOrganization: boolean;
    role: String;
    experienceDetails: string[];
  }

  export interface Award {
    awardName: string;
    organization: string;
    year: number;
  }

  export interface Education {
    degree: string;
    school: string;
    fromYear: number;
    toYear: number;
    percentage: number;
  }

  export interface Publication {
    label: string;
    year: number;
    link: string;
    desc: string;
  }

  export interface Certification {
    label: string;
    year: number;
    org: string;
  }