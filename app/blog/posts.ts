export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
}

const STORAGE_KEY = 'createresume_blog_posts';

export function getBlogPosts(): BlogPost[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  const customPosts: BlogPost[] = stored ? JSON.parse(stored) : [];
  const slugs = new Set<string>();
  const all: BlogPost[] = [];

  for (const p of defaultPosts) {
    if (!slugs.has(p.slug)) { all.push(p); slugs.add(p.slug); }
  }
  for (const p of customPosts) {
    if (!slugs.has(p.slug)) { all.push(p); slugs.add(p.slug); }
  }

  return all;
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find(p => p.slug === slug);
}

export function saveBlogPost(post: BlogPost): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  const customPosts: BlogPost[] = stored ? JSON.parse(stored) : [];
  const idx = customPosts.findIndex(p => p.slug === post.slug);
  if (idx >= 0) customPosts[idx] = post;
  else customPosts.push(post);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customPosts));
}

export function deleteBlogPost(slug: string): void {
  const stored = localStorage.getItem(STORAGE_KEY);
  const customPosts: BlogPost[] = stored ? JSON.parse(stored) : [];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customPosts.filter(p => p.slug !== slug)));
}

export function isCustomPost(slug: string): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;
  const customPosts: BlogPost[] = JSON.parse(stored);
  return customPosts.some(p => p.slug === slug);
}

export const defaultPosts: BlogPost[] = [
  {
    slug: '10-tips-for-standout-resume',
    title: '10 Tips for a Standout Resume in 2026',
    excerpt: 'Discover the key elements that make recruiters stop and take notice of your resume in today\'s competitive job market.',
    content: `<h2>1. Use a Clean, Professional Layout</h2>
<p>First impressions matter. Use a clean, well-structured layout that is easy to scan. Avoid clutter and stick to a professional font.</p>
<h2>2. Tailor Your Resume for Each Application</h2>
<p>Generic resumes get overlooked. Customize your resume for each job by highlighting relevant skills and experiences that match the job description.</p>
<h2>3. Quantify Your Achievements</h2>
<p>Use numbers to demonstrate your impact. Instead of saying "Improved sales," say "Increased sales by 30% within 6 months."</p>
<h2>4. Use Strong Action Verbs</h2>
<p>Start bullet points with powerful action verbs like "Led," "Developed," "Implemented," "Optimized," and "Achieved."</p>
<h2>5. Keep It Concise</h2>
<p>Stick to one page if you have less than 10 years of experience. Recruiters spend an average of 6-7 seconds scanning a resume.</p>
<h2>6. Include Relevant Keywords</h2>
<p>Many companies use ATS (Applicant Tracking Systems). Include keywords from the job description to pass the initial screening.</p>
<h2>7. Highlight Your Achievements, Not Just Responsibilities</h2>
<p>Focus on what you accomplished in each role rather than just listing your daily responsibilities.</p>
<h2>8. Add a Professional Summary</h2>
<p>A brief summary at the top of your resume helps recruiters quickly understand who you are and what you bring to the table.</p>
<h2>9. Proofread Multiple Times</h2>
<p>Typos and grammatical errors can cost you the job. Proofread carefully and ask someone else to review your resume.</p>
<h2>10. Keep It Updated</h2>
<p>Regularly update your resume even when you're not actively job searching. You never know when an opportunity might arise.</p>`,
    date: '2026-06-01',
    author: 'Create Resume Team',
    readTime: '5 min read',
    tags: ['resume tips', 'career advice', 'job search'],
  },
  {
    slug: 'perfect-resume-format',
    title: 'The Perfect Resume Format: What Recruiters Look For',
    excerpt: 'Learn the ideal resume structure that helps you get past ATS filters and capture recruiter attention instantly.',
    content: `<h2>The Reverse-Chronological Format</h2>
<p>The reverse-chronological format is the most widely accepted resume format. It lists your most recent experience first and works backward. This format is preferred by 95% of recruiters.</p>
<h2>The Essential Sections</h2>
<p>A well-structured resume should include the following sections in order:</p>
<ul>
<li><strong>Contact Information</strong> - Name, phone, email, LinkedIn, portfolio</li>
<li><strong>Professional Summary</strong> - 2-3 sentences highlighting your value proposition</li>
<li><strong>Work Experience</strong> - Your professional history with achievements</li>
<li><strong>Education</strong> - Degrees, certifications, and relevant coursework</li>
<li><strong>Skills</strong> - Technical and soft skills relevant to the role</li>
</ul>
<h2>ATS-Friendly Formatting</h2>
<p>Many companies use Applicant Tracking Systems to filter resumes. To ensure your resume gets through:</p>
<ul>
<li>Use standard section headings</li>
<li>Avoid tables and columns</li>
<li>Use standard fonts like Arial, Calibri, or Merriweather</li>
<li>Save as PDF unless instructed otherwise</li>
<li>Include keywords from the job description</li>
</ul>
<h2>Length Matters</h2>
<p>For most professionals, a one-page resume is ideal. If you have more than 10 years of experience, two pages may be acceptable. Never exceed two pages.</p>`,
    date: '2026-05-15',
    author: 'Create Resume Team',
    readTime: '4 min read',
    tags: ['resume format', 'ATS', 'recruiter tips'],
  },
  {
    slug: 'tailor-resume-different-industries',
    title: 'How to Tailor Your Resume for Different Industries',
    excerpt: 'Each industry has unique expectations. Here\'s how to adapt your resume for tech, finance, healthcare, and creative roles.',
    content: `<h2>Why Industry-Specific Resumes Matter</h2>
<p>Each industry has its own set of expectations, buzzwords, and priorities. A one-size-fits-all approach rarely works. Here's how to tailor your resume for different sectors.</p>
<h2>Tech Industry</h2>
<p>Tech recruiters look for specific technical skills, project experience, and problem-solving abilities. Emphasize:</p>
<ul>
<li>Programming languages and frameworks</li>
<li>Open-source contributions</li>
<li>Quantified project outcomes</li>
<li>GitHub/portfolio links</li>
</ul>
<h2>Finance Industry</h2>
<p>Finance roles value precision, analytical skills, and certifications. Highlight:</p>
<ul>
<li>Quantitative achievements</li>
<li>Financial modeling skills</li>
<li>Relevant certifications (CFA, CPA, etc.)</li>
<li>Attention to detail</li>
</ul>
<h2>Healthcare Industry</h2>
<p>Healthcare employers prioritize certifications, patient care experience, and regulatory knowledge. Include:</p>
<ul>
<li>Licenses and certifications</li>
<li>Clinical experience</li>
<li>Patient outcomes</li>
<li>Continuing education</li>
</ul>
<h2>Creative Industry</h2>
<p>Creative roles value portfolios, visual presentation, and brand experience. Showcase:</p>
<ul>
<li>Portfolio link prominently</li>
<li>Creative problem-solving examples</li>
<li>Brand names you've worked with</li>
<li>Design tools proficiency</li>
</ul>`,
    date: '2026-04-20',
    author: 'Create Resume Team',
    readTime: '6 min read',
    tags: ['industry tips', 'resume customization', 'career change'],
  },
];
