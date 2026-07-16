// Maps a raw LinkedIn profile (as returned by a LinkedIn MCP server tool)
// into the ResumeData shape used by this app's ResumeContext.
//
// LinkedIn MCP servers differ in their output schema, so this mapper is
// intentionally defensive: it looks for common key names and falls back
// gracefully. Anything it cannot parse is simply skipped.

function pick(obj, keys, fallback = '') {
  if (!obj || typeof obj !== 'object') return fallback;
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') {
      return obj[k];
    }
  }
  return fallback;
}

function toStr(v) {
  if (v === undefined || v === null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function toArr(v) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function firstNonEmpty(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return '';
}

function concatName(profile) {
  const first = pick(profile, ['firstName', 'first_name', 'givenName', 'given_name']);
  const last = pick(profile, ['lastName', 'last_name', 'familyName', 'family_name']);
  const full = pick(profile, ['name', 'fullName', 'full_name', 'displayName', 'username']);
  if (full) return toStr(full);
  return [toStr(first), toStr(last)].filter(Boolean).join(' ').trim();
}

function mapExperience(experiences) {
  return toArr(experiences).map((exp) => {
    const company = toStr(pick(exp, ['company', 'companyName', 'company_name', 'organization', 'organizationName']));
    const role = toStr(pick(exp, ['title', 'role', 'jobTitle', 'job_title', 'position']));
    const startDate = toStr(pick(exp, ['startDate', 'start_date', 'start', 'from', 'startDateLabel']));
    const endDate = toStr(pick(exp, ['endDate', 'end_date', 'end', 'to', 'endDateLabel']));
    const isCurrent = /present|current|now/i.test(endDate) || pick(exp, ['isCurrent', 'is_current']) === true;
    const desc = pick(exp, ['description', 'summary', 'bulletPoints', 'bullets']);
    const points = toArr(desc)
      .flatMap((d) => toStr(d).split(/\r?\n/))
      .map((s) => s.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean);
    return {
      organization: company || role,
      from: startDate,
      to: isCurrent ? '' : endDate,
      isCurrent,
      role,
      points,
    };
  });
}

function mapEducation(educations) {
  return toArr(educations).map((edu) => {
    const school = toStr(pick(edu, ['school', 'schoolName', 'school_name', 'institution', 'university']));
    const degree = toStr(pick(edu, ['degree', 'degreeName', 'degree_name', 'qualification']));
    const discipline = toStr(pick(edu, ['fieldOfStudy', 'field_of_study', 'field', 'major', 'discipline', 'concentration']));
    const yearRaw = pick(edu, ['endDate', 'end_date', 'endYear', 'end_year', 'year', 'graduationYear', 'graduation_year']);
    const yearNum = parseInt(toStr(yearRaw).slice(-4), 10);
    return {
      degree: degree || discipline || school,
      college: school,
      discipline,
      year: Number.isFinite(yearNum) ? yearNum : 0,
      percentage: 0,
    };
  });
}

function mapSkills(skills) {
  return toArr(skills)
    .map((s) => toStr(typeof s === 'string' ? s : pick(s, ['name', 'skill', 'title'])))
    .filter(Boolean);
}

function mapCertifications(certs) {
  return toArr(certs).map((c) => ({
    name: toStr(pick(c, ['name', 'title', 'certification', 'certificateName'])),
    year: parseInt(toStr(pick(c, ['year', 'issueDate', 'issue_date', 'startDate', 'start_date'])).slice(-4), 10) || 0,
    organization: toStr(pick(c, ['organization', 'issuer', 'issuingOrganization', 'authority'])),
  })).filter((c) => c.name);
}

function mapProjects(projects) {
  return toArr(projects).map((p) => ({
    name: toStr(pick(p, ['name', 'title', 'projectName', 'project'])),
    githubLink: toStr(pick(p, ['githubLink', 'github', 'repo', 'url'])),
    websiteLink: toStr(pick(p, ['websiteLink', 'website', 'link', 'demo', 'liveUrl'])),
    description: toStr(pick(p, ['description', 'desc', 'summary', 'details'])),
  })).filter((p) => p.name);
}

function mapAwards(awards) {
  return toArr(awards).map((a) => ({
    name: toStr(pick(a, ['name', 'title', 'awardName'])),
    organization: toStr(pick(a, ['organization', 'issuer', 'issuerName'])),
  })).filter((a) => a.name);
}

export function mapLinkedInToResumeData(raw) {
  // Some MCP servers wrap the profile inside a top-level object
  // (e.g. { profile: {...} } or { data: {...} }). Unwrap it first.
  const profile = raw && typeof raw === 'object' && (raw.profile || raw.data)
    ? firstNonEmpty(raw.profile, raw.data, raw)
    : raw;

  const name = concatName(profile);
  const title = toStr(pick(profile, ['headline', 'title', 'role', 'jobTitle', 'job_title', 'currentTitle', 'currentRole']));
  const aboutMe = toStr(pick(profile, ['about', 'summary', 'aboutMe', 'about_me', 'description', 'bio']));
  const email = toStr(pick(profile, ['email', 'emailAddress', 'email_address']));
  const phoneNumber = toStr(pick(profile, ['phoneNumber', 'phone_number', 'phone', 'mobile']));
  const linkedIn = toStr(firstNonEmpty(
    pick(profile, ['linkedIn', 'linkedin', 'linkedinUrl', 'linkedin_url', 'profileUrl', 'profile_url']),
    typeof profile === 'object' && profile.url ? profile.url : ''
  ));
  const github = toStr(pick(profile, ['github', 'githubUrl', 'github_url']));

  const experienceRoot = pick(profile, ['experience', 'experiences', 'workExperience', 'work_experience', 'positions', 'jobs'], null);
  const educationRoot = pick(profile, ['education', 'educations', 'schools'], null);
  const skillsRoot = pick(profile, ['skills', 'skill', 'topSkills', 'top_skills'], null);
  const certsRoot = pick(profile, ['certifications', 'certification', 'certs', 'licenses', 'license'], null);
  const projectsRoot = pick(profile, ['projects', 'project', 'accomplishments'], null);
  const awardsRoot = pick(profile, ['awards', 'award', 'honors', 'honor', 'honorsAwards'], null);

  const workExperience = mapExperience(experienceRoot);
  const education = mapEducation(educationRoot);
  const skills = mapSkills(skillsRoot);
  const certifications = mapCertifications(certsRoot);
  const projects = mapProjects(projectsRoot);
  const awards = mapAwards(awardsRoot);

  return {
    personalInfo: {
      name,
      title,
      aboutMe,
      image: '',
      email,
      phoneNumber,
      linkedIn,
      github,
    },
    settings: {
      template: 'professional',
      isLinkedIn: Boolean(linkedIn),
      isGithub: Boolean(github),
      isImage: false,
      isAwards: awards.length > 0,
      isCertifications: certifications.length > 0,
      isPatents: false,
      isPersonalProjects: projects.length > 0,
      isLanguages: false,
    },
    workExperience,
    skills,
    certifications,
    awards,
    education,
    languages: [],
    patents: [],
    projects,
    publications: [],
  };
}

export default mapLinkedInToResumeData;