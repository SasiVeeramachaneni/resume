// pdfParser.ts - Extract and parse resume data from PDF
// Use legacy build for Node compatibility (modern build requires worker even in Node)
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import type {
  ResumeData,
  WorkExperience,
  Education,
  Certification,
  Award,
  Language,
  Patent,
  Project,
} from "@/components/declarations/types";

import { EMBED_END, EMBED_START } from "./constants";

// Configure worker - must be synchronous before any getDocument call to avoid
// "No GlobalWorkerOptions.workerSrc specified" race.
// We set CDN synchronously for browser. Local Vite ?url asset would require static import
// which breaks Node/tsx tests, so we rely on CDN + disableWorker fallback for offline.
// This ensures first upload never fails due to async workerSrc.
if (typeof window !== "undefined") {
  // Browser: set CDN synchronously (version must match installed pdfjs-dist 6.3.289 legacy build)
  // Using jsDelivr which is CORS-enabled. Fallback to disableWorker if fetch fails (offline).
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@6.3.289/legacy/build/pdf.worker.min.mjs";
} else {
  // Node / test environment - use legacy build's default worker (file://) and disableWorker fallback.
  // Do not override workerSrc to https (Node ESM loader doesn't support https).
  // Leave as default "./pdf.worker.mjs" which Node can resolve via file scheme.
  // extractTextFromPdf will pass disableWorker:true to avoid worker fetch in Node anyway.
}

// Default empty resume for fallback
function defaultResumeData(): ResumeData {
  return {
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
}

export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  // Try with worker first (set via GlobalWorkerOptions.workerSrc); fallback to disableWorker for
  // Node/tests or offline where worker fetch fails. This avoids "No GlobalWorkerOptions.workerSrc" error.
  // Clone buffers to avoid detached ArrayBuffer on retry (pdfjs transfers buffer).
  let pdf: Awaited<ReturnType<typeof pdfjsLib.getDocument>> extends { promise: Promise<infer T> } ? T : never;
  // Keep a safe copy before any transfer
  let safeCopy: ArrayBuffer | null = null;
  try {
    safeCopy = arrayBuffer.slice(0);
  } catch {
    safeCopy = null;
  }
  const dataForFirst = safeCopy ? safeCopy.slice(0) : arrayBuffer;
  try {
    const loadingTask = pdfjsLib.getDocument({ data: dataForFirst } as any);
    pdf = await (loadingTask as any).promise;
  } catch (e) {
    // Retry without worker (main thread) - handles missing workerSrc, CDN failure, offline, CSP
    // Use a fresh copy to avoid detached buffer issue
    let dataForFallback: ArrayBuffer | Uint8Array = arrayBuffer;
    try {
      dataForFallback = safeCopy ? safeCopy.slice(0) : (arrayBuffer.slice ? arrayBuffer.slice(0) : arrayBuffer);
    } catch {
      // If slice fails (detached), try to use Uint8Array copy if available
      try {
        dataForFallback = new Uint8Array(safeCopy ?? arrayBuffer).slice().buffer;
      } catch {
        dataForFallback = arrayBuffer;
      }
    }
    try {
      const fallbackTask = pdfjsLib.getDocument({ data: dataForFallback, disableWorker: true } as any);
      pdf = await (fallbackTask as any).promise;
    } catch (fallbackError) {
      // If fallback also fails, throw original error if it was worker-related, otherwise throw fallback
      const msg = String((e as Error)?.message ?? e);
      if (msg.includes("workerSrc") || msg.includes("GlobalWorkerOptions") || msg.includes("fetch") || msg.includes("Worker")) {
        throw fallbackError;
      }
      throw e;
    }
  }
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // pdfjs items have str and hasEOL
    let pageText = "";
    for (const item of content.items as Array<{ str: string; hasEOL?: boolean }>) {
      if ("str" in item) {
        pageText += item.str;
        // @ts-ignore - hasEOL is present in newer pdfjs
        if ((item as { hasEOL?: boolean }).hasEOL) {
          pageText += "\n";
        } else {
          pageText += " ";
        }
      }
    }
    fullText += pageText + "\n";
  }
  return fullText;
}

export function tryExtractEmbeddedJson(rawText: string): ResumeData | null {
  try {
    // First try exact contiguous markers (future PDFs with wrap=false)
    let startIdx = rawText.indexOf(EMBED_START);
    let endIdx = rawText.indexOf(EMBED_END);
    let jsonStrRaw: string | null = null;
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      jsonStrRaw = rawText.substring(startIdx + EMBED_START.length, endIdx).trim();
    } else {
      // Fallback: markers may be broken by pdf.js wrapping (e.g. "__RESUME_ JSON_START__" with spaces/newlines)
      // Stripping all whitespace makes markers contiguous again and also reconstructs base64.
      const stripped = rawText.replace(/\s+/g, "");
      const sStart = stripped.indexOf(EMBED_START);
      const sEnd = stripped.indexOf(EMBED_END);
      if (sStart !== -1 && sEnd !== -1 && sEnd > sStart) {
        jsonStrRaw = stripped.substring(sStart + EMBED_START.length, sEnd).trim();
        // jsonStrRaw from stripped is already without whitespace (base64), keep as is
        // Try to decode directly
        const jsonStr = jsonStrRaw;
        try {
          let decoded: string;
          if (typeof atob === "function") {
            decoded = atob(jsonStr);
          } else {
            // @ts-ignore Node fallback
            decoded = Buffer.from(jsonStr, "base64").toString("utf-8");
          }
          try {
            decoded = decodeURIComponent(escape(decoded));
          } catch {}
          const data = JSON.parse(decoded);
          if (data && typeof data === "object" && "personalInfo" in (data as Record<string, unknown>)) {
            return data as ResumeData;
          }
        } catch {
          // fall through to generic handling below
        }
      }
    }
    if (jsonStrRaw !== null) {
      // Remove whitespace that pdfjs may have inserted inside base64
      const jsonStr = jsonStrRaw.replace(/\s+/g, "");
      let data: unknown = null;
      // First try direct JSON (legacy plain embedding)
      try {
        data = JSON.parse(jsonStrRaw);
      } catch {
        // Try base64 decode (robust to inserted whitespace)
        try {
          let decoded: string;
          // atob may not be available in Node tests; fallback
          if (typeof atob === "function") {
            decoded = atob(jsonStr);
          } else {
            // @ts-ignore Node fallback
            decoded = Buffer.from(jsonStr, "base64").toString("utf-8");
          }
          // Handle unicode encoding from encodeURIComponent path
          try {
            decoded = decodeURIComponent(escape(decoded));
          } catch {
            // if not encoded that way, keep as is
          }
          data = JSON.parse(decoded);
        } catch {
          // Try without removing whitespace (plain JSON with spaces)
          try {
            const cleanedForJson = jsonStrRaw;
            data = JSON.parse(cleanedForJson);
          } catch {
            return null;
          }
        }
      }
      if (data && typeof data === "object" && "personalInfo" in (data as Record<string, unknown>)) {
        return data as ResumeData;
      }
    }
  } catch {
    return null;
  }
  return null;
}

// Remove hidden JSON block (even when broken across lines/spaces) so it doesn't pollute heuristic sections
function stripEmbeddedJsonBlocks(text: string): string {
  // Matches __RESUME_JSON_START__ ... __RESUME_JSON_END__ with optional whitespace between every char
  // This handles the old buggy PDFs where maxWidth:1 broke markers into "__RESUME_ JSON_START__"
  const pattern =
    /__\s*R\s*E\s*S\s*U\s*M\s*E\s*_\s*J\s*S\s*O\s*N\s*_\s*S\s*T\s*A\s*R\s*T\s*__[\s\S]*?__\s*R\s*E\s*S\s*U\s*M\s*E\s*_\s*J\s*S\s*O\s*N\s*_\s*E\s*N\s*D\s*__/gi;
  let stripped = text.replace(pattern, " ");
  // Also remove exact contiguous block as fallback (faster)
  stripped = stripped.replace(/__RESUME_JSON_START__[\s\S]*?__RESUME_JSON_END__/g, " ");
  // Fallback for old PDFs where only start marker exists and base64 was split into many lines without end marker:
  // Remove any remaining lines that look like broken base64 chunks (isCorruptedValue) - but do it line-wise
  // We do this by splitting, filtering, and rejoining. Keep headings intact.
  const lines = stripped.split("\n");
  const filtered = lines.filter((line) => {
    const trimmed = line.trim();
    // Keep headings (EDUCATION etc.) even if they might look corrupted? Headings are short and uppercase, not base64
    if (isHeadingLine(trimmed)) return true;
    // If line is a corrupted base64 chunk, drop it
    if (isCorruptedValue(trimmed)) return false;
    // Also drop any line that still contains marker fragments
    if (trimmed.includes("__RESUME") || trimmed.includes("RESUME_JSON")) return false;
    return true;
  });
  return filtered.join("\n");
}

function isCorruptedValue(value: string): boolean {
  if (!value) return false;
  // Contains embedded marker fragments
  if (value.includes("__RESUME_JSON") || value.includes("RESUME_JSON")) return true;
  const trimmed = value.trim();
  // Heuristic: base64-like chunk from broken hidden JSON (long, no spaces, only base64 chars)
  // Old buggy PDFs split the hidden JSON into 20-100 char chunks due to maxWidth:1 wrapping.
  // Real education values are short human-readable with spaces (e.g., "BTech", "MIT", "Computer Science")
  // and never look like random base64.
  if (trimmed.length > 15 && /^[A-Za-z0-9+/=_-]+$/.test(trimmed) && !trimmed.includes(" ")) {
    // Try to decode as base64 and see if it looks like JSON fragment (contains " : { } )
    try {
      const padded = trimmed.padEnd(trimmed.length + ((4 - (trimmed.length % 4)) % 4), "=");
      let decoded: string;
      if (typeof atob === "function") {
        decoded = atob(padded);
      } else {
        // @ts-ignore Node
        decoded = Buffer.from(padded, "base64").toString("utf-8");
      }
      // If decoded contains JSON syntax, it's very likely a broken hidden JSON chunk
      if (/["{:\[]/.test(decoded) && /[a-zA-Z]/.test(decoded)) {
        return true;
      }
    } catch {
      // Not valid base64, ignore
    }
    // Fallback: very long base64-like without spaces is still suspicious for education fields
    // But avoid false positive for single-word long disciplines (e.g., "ElectricalEngineering" 21 chars)
    // Those are pure letters, not mixed case+digits+symbols typical of base64. Check for typical base64 start
    if (trimmed.length > 30) return true;
    if (trimmed.startsWith("eyJ") || trimmed.includes("eyJw")) return true;
  }
  return false;
}

// Helpers
function normalize(text: string): string {
  return text.replace(/\r/g, "").trim();
}

function extractContactInfo(fullText: string): { email: string; phone: string; linkedIn: string; github: string } {
  const emailMatch = fullText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const phoneMatch = fullText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
  // LinkedIn & Github URLs
  const linkedInMatch = fullText.match(/https?:\/\/(www\.)?linkedin\.com\/[^\s]+/i) || fullText.match(/linkedin\.com\/[^\s]+/i);
  const githubMatch = fullText.match(/https?:\/\/(www\.)?github\.com\/[^\s]+/i) || fullText.match(/github\.com\/[^\s]+/i);
  // Also look for standalone "LinkedIn" + URL nearby? Already covered by URL.
  // Fallback: if text contains "LinkedIn" as word, try to extract next token as url? But we already have generic.
  let linkedIn = linkedInMatch ? linkedInMatch[0].trim() : "";
  let github = githubMatch ? githubMatch[0].trim() : "";
  // Ensure https prefix
  if (linkedIn && !linkedIn.startsWith("http")) linkedIn = `https://${linkedIn}`;
  if (github && !github.startsWith("http")) github = `https://${github}`;
  // Clean phone: keep digits, +, -, spaces, parentheses
  let phone = phoneMatch ? phoneMatch[0].trim() : "";
  // Filter out phone that is actually year (e.g., 2020)
  if (phone && /^\d{4}$/.test(phone.replace(/\D/g, "")) && phone.replace(/\D/g, "").length === 4) {
    // likely a year not phone
    const maybePhone = fullText.match(/(\+?\d[\d\s\-\(\)]{7,}\d)/);
    phone = maybePhone ? maybePhone[0].trim() : "";
  }
  return {
    email: emailMatch ? emailMatch[0].trim() : "",
    phone,
    linkedIn,
    github,
  };
}

function splitIntoLines(text: string): string[] {
  return text
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

const HEADINGS = [
  "WORK EXPERIENCE",
  "EXPERIENCE",
  "EDUCATION",
  "SKILLS",
  "CERTIFICATIONS",
  "CERTIFICATION",
  "AWARDS",
  "AWARD",
  "LANGUAGES",
  "LANGUAGE",
  "PATENTS",
  "PATENT",
  "PROJECTS",
  "PROJECT",
  "PROFILE",
  "ABOUT ME",
  "SUMMARY",
  "CONTACT",
  "PERSONAL PROJECTS",
];

function isHeadingLine(line: string): string | null {
  const upper = line.toUpperCase().replace(/[:]/g, "").trim();
  for (const h of HEADINGS) {
    if (upper === h || upper === `${h}:` || upper.startsWith(`${h} `) ) {
      // Exact match or heading with colon, but avoid false positives like "Projects" inside sentence.
      // For our PDF headings are standalone lines exactly equal to heading.
      if (upper === h || upper === `${h}:`) return h;
      // Also handle "WORK EXPERIENCE" vs "EXPERIENCE" priority: longer first
    }
  }
  // Also handle case where line is "SKILLS" but may have extra spaces
  const normalized = upper.replace(/\s+/g, " ");
  for (const h of HEADINGS.sort((a,b)=>b.length-a.length)) {
    if (normalized === h) return h;
  }
  return null;
}

function splitByHeadings(fullText: string): { personalInfoText: string; sections: Map<string, string> } {
  const lines = splitIntoLines(fullText);
  const sections = new Map<string, string>();
  let personalInfoLines: string[] = [];
  let currentHeading: string | null = null;
  let currentLines: string[] = [];
  let foundFirstHeading = false;

  for (const line of lines) {
    const heading = isHeadingLine(line);
    if (heading) {
      foundFirstHeading = true;
      if (currentHeading) {
        sections.set(currentHeading, currentLines.join("\n"));
      } else {
        // save personalInfo
        personalInfoLines = [...currentLines];
      }
      currentHeading = heading;
      currentLines = [];
      continue;
    }
    currentLines.push(line);
  }
  if (currentHeading) {
    sections.set(currentHeading, currentLines.join("\n"));
  } else if (!foundFirstHeading) {
    personalInfoLines = [...currentLines];
  } else {
    // If we never set currentHeading but found headings, personalInfoLines already set
    // If last heading had no content, it's already handled
  }
  // If no heading found, personalInfoText is full text
  const personalInfoText = personalInfoLines.join("\n");
  return { personalInfoText, sections };
}

// Section parsers
function parseSkills(sectionText: string | undefined): string[] {
  if (!sectionText) return [];
  // Remove heading bullet artifacts and split
  // Skills may be lines, commas, bullets
  const cleaned = sectionText.replace(/•/g, "\n").replace(/·/g, "\n");
  // Split by commas and newlines
  const tokens = cleaned
    .split(/[\n,;]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .flatMap((t) => {
      // Further split by 2+ spaces (our PDF boxes may be concatenated with spaces)
      // But single skill may contain space (e.g., "Machine Learning"), so don't split on single space
      // If line contains multiple skills separated by 2+ spaces, split there
      if (/\s{2,}/.test(t)) {
        return t.split(/\s{2,}/).map((s) => s.trim()).filter(Boolean);
      }
      return [t];
    })
    .map((s) => s.replace(/^[-•\s]+/, "").trim())
    .filter(Boolean);
  // Remove duplicates and heading-like tokens
  const filtered = tokens.filter((t) => {
    const upper = t.toUpperCase();
    return !HEADINGS.includes(upper) && t.length > 0 && t.length < 80;
  });
  // Also handle case where skills were stored as "Skill: 80%" style in photo template
  const mapped = filtered.map((s) => {
    // Remove trailing percentage pattern like ": 80%" or " 80%"
    const m = s.match(/^(.+?)\s*:\s*\d+%?$/);
    if (m) return m[1].trim();
    return s;
  });
  return [...new Set(mapped)];
}

function parseWorkExperience(sectionText: string | undefined): WorkExperience[] {
  if (!sectionText) return [];
  const lines = splitIntoLines(sectionText);
  if (lines.length === 0) return [];

  const experiences: WorkExperience[] = [];
  const dateRangeRegex = /(\d{1,2}\/\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\b\d{4})\s*[-–—]\s*(\d{1,2}\/\d{4}|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\b\d{4}|Present|Current|Till\s*Date)/i;
  const containsDate = (line: string) => dateRangeRegex.test(line) || (/Present|Current/i.test(line) && /-/.test(line));

  let i = 0;
  while (i < lines.length) {
    // Skip empty headings remnants
    if (isHeadingLine(lines[i])) {
      i++;
      continue;
    }

    // Find next date line
    let dateLineIndex = -1;
    let dateRange = "";
    let orgFromLine = "";
    for (let j = i; j < lines.length; j++) {
      const match = lines[j].match(dateRangeRegex);
      if (match) {
        dateLineIndex = j;
        dateRange = match[0];
        orgFromLine = lines[j];
        break;
      }
      // Also check if line is like "Jan 2020 - Present" alone
      if (containsDate(lines[j])) {
        dateLineIndex = j;
        dateRange = lines[j];
        orgFromLine = lines[j];
        break;
      }
    }

    if (dateLineIndex === -1) {
      // No more date lines; treat remaining bullets as points for last exp?
      // If we have already experiences, attach remaining bullets to last
      if (experiences.length > 0) {
        const remainingBullets = lines.slice(i).filter((l) => l.startsWith("•") || l.startsWith("-") || l.length > 10);
        for (const b of remainingBullets) {
          const clean = b.replace(/^[•\-]\s*/, "").trim();
          if (clean) experiences[experiences.length - 1].points.push(clean);
        }
      }
      break;
    }

    // Determine organization
    let organization = "";
    let dateStr = dateRange.trim();
    // If dateLine contains org + date together
    const lineWithoutDate = orgFromLine.replace(dateRange, "").trim();
    if (lineWithoutDate) {
      organization = lineWithoutDate.replace(/^[•\-]\s*/, "").trim();
    } else if (dateLineIndex > i) {
      // Previous line is likely organization
      organization = lines[dateLineIndex - 1].replace(/^[•\-]\s*/, "").trim();
      // Ensure it's not a bullet point (long sentence) - if it's long and contains spaces, might be bullet
      // But org is usually short (few words). We'll accept.
      if (organization.length > 80 || organization.includes("•")) {
        organization = "";
      }
    }

    // If still empty, try to use current i line as org if not date
    if (!organization && i !== dateLineIndex) {
      organization = lines[i].replace(/^[•\-]\s*/, "").trim();
    }
    if (!organization) organization = `Organization ${experiences.length + 1}`;

    // Parse dates
    let from = "";
    let to: string | undefined = undefined;
    let isCurrent = false;
    const split = dateStr.split(/[-–—]/);
    if (split.length >= 2) {
      from = split[0].trim();
      to = split[1].trim();
      if (/Present|Current|Till/i.test(to || "")) {
        isCurrent = true;
        to = undefined;
      }
    } else {
      from = dateStr;
    }

    // Role is next line after dateLine if not bullet
    let role = "";
    let points: string[] = [];
    let nextIdx = dateLineIndex + 1;
    if (nextIdx < lines.length) {
      const candidate = lines[nextIdx];
      if (!containsDate(candidate) && !candidate.startsWith("•") && !candidate.startsWith("-") && candidate.length < 80 && !isHeadingLine(candidate)) {
        // Heuristic: role is short, usually title case, not too long sentence
        // But some roles are like "Senior Software Engineer" - okay
        // Check if candidate looks like bullet (long sentence with spaces and > 50 chars) - then it's point, not role
        // We'll treat as role if line is relatively short or contains common role keywords
        const isLikelyRole = candidate.length < 60 || /(Engineer|Developer|Manager|Designer|Analyst|Consultant|Intern|Lead|Architect|Officer|Specialist|Coordinator|Director|Associate)/i.test(candidate);
        if (isLikelyRole) {
          role = candidate;
          nextIdx++;
        }
      }
    }

    // Collect bullet points until next date line or heading
    while (nextIdx < lines.length) {
      const line = lines[nextIdx];
      if (isHeadingLine(line) || containsDate(line)) break;
      // Lookahead: if this line looks like next org (short, not bullet) and next line is a date, then break - it's next experience's org
      if (
        nextIdx + 1 < lines.length &&
        containsDate(lines[nextIdx + 1]) &&
        !line.startsWith("•") &&
        !line.startsWith("-") &&
        !line.startsWith("·") &&
        line.length < 60 &&
        !isHeadingLine(line)
      ) {
        break;
      }
      // Treat line starting with bullet or long line as point
      if (line.startsWith("•") || line.startsWith("-") || line.startsWith("·")) {
        const clean = line.replace(/^[•\-·]\s*/, "").trim();
        if (clean) points.push(clean);
      } else if (line.length > 12) {
        // Could be a point without bullet (when pdf extraction loses bullet)
        // Check if line looks like point (sentence) - avoid org: if next line is date we already handled above
        points.push(line);
      } else if (line.length > 0) {
        // Short line that might still be point continuation? Append to last point if exists
        if (points.length > 0) {
          points[points.length - 1] += ` ${line}`;
        } else {
          points.push(line);
        }
      }
      nextIdx++;
    }

    // If no points but we have remaining lines that were not captured as role, they may be points
    // Clean points: remove empty
    points = points.filter((p) => p.trim().length > 0);

    experiences.push({
      organization,
      from: from || "",
      to,
      isCurrent,
      role: role || "",
      points: points.length > 0 ? points : [""],
    });

    // Move i to nextIdx, but avoid infinite loop
    if (nextIdx <= dateLineIndex) i = dateLineIndex + 1;
    else i = nextIdx;
    // If next experience's org was previous line before date, we have already consumed it, so adjust i
    // If dateLineIndex == i and we consumed org from same line, i should already move
    // For case where org was previous line, we should ensure not reprocessing that org line
    if (i <= dateLineIndex) i = dateLineIndex + 1;
  }

  return experiences;
}

function parseEducation(sectionText: string | undefined): Education[] {
  if (!sectionText) return [];
  const lines = splitIntoLines(sectionText);
  if (lines.length === 0) return [];

  const educations: Education[] = [];
  // Each education block may be 2-4 lines. We group by empty? No empty. Use heuristic: degree is first line of block, then college, discipline, year/percentage
  // Iterate and collect blocks until we hit a line that contains Year or %
  let chunk: string[] = [];
  for (const line of lines) {
    if (isHeadingLine(line)) continue;
    // Skip corrupted hidden JSON fragments (old buggy PDFs)
    if (isCorruptedValue(line) || line.includes("__RESUME")) continue;
    chunk.push(line);
    const isYearLine = /Year:/i.test(line) || /Percentage/i.test(line) || /%\s*$/.test(line) || /\b(19|20)\d{2}\b/.test(line) && chunk.length >= 2;
    // Also treat if next line looks like new degree (short, title case) and chunk has at least 2 lines - but we don't know next line yet
    // So we trigger push when line is year/percentage line, or when chunk size >=4 (max per edu)
    if (isYearLine || chunk.length >= 4) {
      // Parse chunk as one education entry
      const degree = chunk[0] || "";
      let college = "";
      let discipline = "";
      let year = NaN;
      let percentage = NaN;

      // Extract year/percentage from last line(s)
      const lastLine = chunk[chunk.length - 1];
      const yearMatch = lastLine.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) year = parseInt(yearMatch[0], 10);
      const pctMatch = lastLine.match(/(\d+(?:\.\d+)?)\s*%/ ) || lastLine.match(/Percentage:\s*(\d+(?:\.\d+)?)/i);
      if (pctMatch) percentage = parseFloat(pctMatch[1]);

      if (chunk.length === 2) {
        // degree + college/year line
        // If second line is year line, college empty
        if (/Year:|Percentage|%/i.test(chunk[1])) {
          college = "";
        } else {
          college = chunk[1];
        }
      } else if (chunk.length === 3) {
        // Could be degree, college, discipline OR degree, discipline, yearLine
        if (/Year:|Percentage|%/i.test(chunk[2])) {
          college = chunk[1];
          discipline = "";
          // year already extracted
        } else {
          // No year line, so treat as degree, discipline, college? Let's assume degree, discipline, college is less likely
          college = chunk[1];
          discipline = chunk[2];
        }
      } else if (chunk.length >= 4) {
        college = chunk[1] || "";
        discipline = chunk[2] || "";
        // year already from last line
      }

      // If college is still empty and we have discipline but college missing, shift?
      // Try to avoid college being year string
      if (college && /Year:|Percentage|%/i.test(college)) college = "";

      // Filter out entries that are completely empty or heading-like
      if (degree.trim() || college.trim() || discipline.trim() || !isNaN(year)) {
        educations.push({
          degree: degree.trim(),
          college: college.trim(),
          discipline: discipline.trim(),
          year: isNaN(year) ? NaN : year,
          percentage: isNaN(percentage) ? NaN : percentage,
        });
      }
      chunk = [];
    }
  }
  // Handle leftover chunk not terminated by year line (e.g., missing year)
  if (chunk.length > 0) {
    const degree = chunk[0] || "";
    const college = chunk[1] || "";
    const discipline = chunk[2] || "";
    let year = NaN;
    let percentage = NaN;
    const combined = chunk.join(" ");
    const yMatch = combined.match(/\b(19|20)\d{2}\b/);
    if (yMatch) year = parseInt(yMatch[0], 10);
    const pMatch = combined.match(/(\d+(?:\.\d+)?)\s*%/);
    if (pMatch) percentage = parseFloat(pMatch[1]);
    if (degree.trim() || college.trim()) {
      educations.push({
        degree: degree.trim(),
        college: college.trim(),
        discipline: discipline.trim(),
        year,
        percentage,
      });
    }
  }

  return educations;
}

function parseCertifications(sectionText: string | undefined): Certification[] {
  if (!sectionText) return [];
  const lines = splitIntoLines(sectionText);
  const certs: Certification[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (isHeadingLine(lines[i])) continue;
    const name = lines[i].trim();
    let organization = "";
    let year = NaN;
    // Next line may contain org and year
    if (i + 1 < lines.length && !isHeadingLine(lines[i + 1])) {
      const next = lines[i + 1];
      // Check if next looks like org • year
      // Year in next line?
      const yMatch = next.match(/\b(19|20)\d{2}\b/);
      if (yMatch) {
        year = parseInt(yMatch[0], 10);
        organization = next.replace(yMatch[0], "").replace(/[•·|•]/g, "").replace(/\s*•\s*/g, " ").trim();
        // Clean stray bullets/dots
        organization = organization.replace(/^[•\-]\s*/, "").trim();
        i++; // consume next line
      } else if (next.length < 60 && !next.startsWith("•")) {
        // Might be org without year, and not a bullet point for next cert
        // Check if next line looks like cert name (capitalized short) - hard
        // For simplicity, assume it's org
        organization = next.trim();
        // Peek ahead for year
        if (i + 1 < lines.length) {
          const maybeYearLine = lines[i + 1];
          const ym2 = maybeYearLine.match(/\b(19|20)\d{2}\b/);
          if (ym2 && maybeYearLine.length < 20) {
            year = parseInt(ym2[0], 10);
            i++;
          }
        }
        i++;
      }
    }
    if (name) {
      certs.push({
        name,
        organization: organization || "",
        year: isNaN(year) ? NaN : year,
      });
    }
  }
  return certs;
}

function parseAwards(sectionText: string | undefined): Award[] {
  if (!sectionText) return [];
  const lines = splitIntoLines(sectionText);
  const awards: Award[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (isHeadingLine(lines[i])) continue;
    const name = lines[i].trim();
    let organization = "";
    if (i + 1 < lines.length && !isHeadingLine(lines[i + 1])) {
      const next = lines[i + 1];
      // If next line looks like org (not a award name)
      // Heuristic: if next line is short and not containing bullet
      if (next.length < 80 && !next.startsWith("•")) {
        organization = next.trim();
        i++;
      }
    }
    if (name) awards.push({ name, organization });
  }
  return awards;
}

function parseLanguages(sectionText: string | undefined): Language[] {
  if (!sectionText) return [];
  const lines = splitIntoLines(sectionText);
  const langs: Language[] = [];
  for (const raw of lines) {
    if (isHeadingLine(raw)) continue;
    let line = raw.replace(/^[•\-·]\s*/, "").trim();
    if (!line) continue;
    // Remove parentheses around proficiency like "English (High)"
    // Extract proficiency if present
    let proficiency: Language["proficiency"] = "";
    const profMatch = line.match(/\((High|medium|low|Medium|Low|HIGH)\)/i);
    if (profMatch) {
      const p = profMatch[1].toLowerCase();
      if (p === "high") proficiency = "High";
      else if (p === "medium") proficiency = "medium";
      else if (p === "low") proficiency = "low";
      line = line.replace(profMatch[0], "").trim();
    } else {
      // Check if last token is proficiency
      const tokens = line.split(/\s+/);
      const last = tokens[tokens.length - 1];
      if (/^(High|Medium|Low)$/i.test(last)) {
        const lower = last.toLowerCase();
        if (lower === "high") proficiency = "High";
        else if (lower === "medium") proficiency = "medium";
        else if (lower === "low") proficiency = "low";
        line = tokens.slice(0, -1).join(" ").trim();
      }
    }
    // Handle "Name : proficiency" or "Name - proficiency"
    if (!proficiency && line.includes(":")) {
      const parts = line.split(":");
      line = parts[0].trim();
      const maybeProf = parts[1].trim();
      if (/^(High|Medium|Low)$/i.test(maybeProf)) {
        const lower = maybeProf.toLowerCase();
        if (lower === "high") proficiency = "High";
        else if (lower === "medium") proficiency = "medium";
        else if (lower === "low") proficiency = "low";
      }
    }
    if (line || proficiency) {
      langs.push({ name: line, proficiency });
    }
  }
  return langs;
}

function parsePatents(sectionText: string | undefined): Patent[] {
  if (!sectionText) return [];
  const lines = splitIntoLines(sectionText);
  const patents: Patent[] = [];
  let i = 0;
  while (i < lines.length) {
    if (isHeadingLine(lines[i])) { i++; continue; }
    const name = lines[i].replace(/^[•\-]\s*/, "").trim();
    i++;
    let year = NaN;
    let description = "";
    let link = "";
    // Collect until next patent name or end. Assume patent name is short (<60 chars) and next year line may exist.
    const descLines: string[] = [];
    while (i < lines.length) {
      const line = lines[i];
      if (isHeadingLine(line)) break;
      // If line looks like URL, it's link
      if (/https?:\/\//i.test(line) || /www\./i.test(line)) {
        link = line.trim();
        i++;
        continue;
      }
      // Year detection: line is just 4 digit year
      if (/^\s*(19|20)\d{2}\s*$/.test(line) && isNaN(year)) {
        year = parseInt(line.trim(), 10);
        i++;
        continue;
      }
      // Also year may be embedded like "2021 • description"? Try to extract
      if (isNaN(year)) {
        const yMatch = line.match(/\b(19|20)\d{2}\b/);
        if (yMatch && line.length < 30) {
          year = parseInt(yMatch[0], 10);
          // Remove year from line and treat remainder as description?
          const remainder = line.replace(yMatch[0], "").trim().replace(/^[•\-]\s*/, "");
          if (remainder) descLines.push(remainder);
          i++;
          continue;
        }
      }
      // If line looks like next patent name: short, not long description, and we have already some description
      // Heuristic: if descLines not empty and line is short (<50) and not link, and next line is year or description, treat as new patent
      if (descLines.length > 0 && line.length < 50 && !line.startsWith("•") && i + 1 < lines.length) {
        const next = lines[i + 1];
        // If next is year or URL or description start, then current line is likely next patent name
        if (/^\s*(19|20)\d{2}\s*$/.test(next) || /https?:\/\//i.test(next) || next.length > 30) {
          break;
        }
      }
      // Otherwise treat as description
      if (line.length > 0) descLines.push(line.replace(/^[•\-]\s*/, "").trim());
      i++;
    }
    description = descLines.join(" ").trim();
    if (name || description || link || !isNaN(year)) {
      patents.push({
        name: name || "",
        year: isNaN(year) ? NaN : year,
        description,
        link,
      });
    }
    // Prevent infinite loop
    if (patents.length > 30) break;
  }
  return patents;
}

function parseProjects(sectionText: string | undefined): Project[] {
  if (!sectionText) return [];
  const lines = splitIntoLines(sectionText);
  const projects: Project[] = [];
  let i = 0;
  while (i < lines.length) {
    if (isHeadingLine(lines[i])) { i++; continue; }
    const name = lines[i].replace(/^[•\-]\s*/, "").trim();
    i++;
    let description = "";
    let githubLink = "";
    let websiteLink = "";
    const descLines: string[] = [];
    while (i < lines.length) {
      const line = lines[i];
      if (isHeadingLine(line)) break;
      // Links
      if (/github\.com/i.test(line) || (line.toLowerCase().includes("github") && line.includes("http"))) {
        const urlMatch = line.match(/https?:\/\/[^\s]+/i);
        githubLink = urlMatch ? urlMatch[0] : line.trim();
        if (!githubLink.includes("http")) githubLink = `https://${githubLink}`;
        i++;
        continue;
      }
      if (/https?:\/\//i.test(line)) {
        const urlMatch = line.match(/https?:\/\/[^\s]+/i);
        const url = urlMatch ? urlMatch[0] : line.trim();
        // Decide if github or website
        if (/github\.com/i.test(url)) githubLink = url;
        else if (!websiteLink) websiteLink = url;
        else {
          // If already have websiteLink, treat as description line
          descLines.push(line);
        }
        i++;
        continue;
      }
      if (line.toLowerCase() === "github" || line.toLowerCase() === "website" || line.toLowerCase() === "link") {
        // Next line may be URL
        i++;
        continue;
      }
      // If line is short and looks like next project name (capitalized, <40 chars) and we have description already
      if (descLines.length > 0 && line.length < 50 && !line.startsWith("•") && i + 1 < lines.length) {
        const next = lines[i + 1];
        // If next is long description or link, then current is next project
        if (next.length > 40 || /https?:\/\//i.test(next)) {
          break;
        }
      }
      if (line.length > 0) descLines.push(line.replace(/^[•\-]\s*/, "").trim());
      i++;
    }
    description = descLines.join(" ").trim();
    // Also extract inline links from description if any
    const urlInDesc = description.match(/https?:\/\/[^\s]+/i);
    if (urlInDesc && !githubLink && !websiteLink) {
      // Keep description as is, but also set link
      // Not needed
    }
    if (name || description || githubLink || websiteLink) {
      projects.push({
        name: name || "",
        description,
        githubLink,
        websiteLink,
      });
    }
    if (projects.length > 30) break;
  }
  return projects;
}

function parsePersonalInfo(personalInfoText: string, fullText: string, sections: Map<string, string>): ResumeData["personalInfo"] {
  const contact = extractContactInfo(fullText);
  // PersonalInfoText may contain name, title, aboutMe plus contact repeats
  // Remove contacts from it
  let text = personalInfoText;
  // Remove email/phone/linkedin/github substrings
  if (contact.email) text = text.replace(contact.email, "");
  if (contact.phone) text = text.replace(contact.phone, "");
  // Also remove URLs for linkedin/github if extracted
  if (contact.linkedIn) {
    // linkedin may have https, remove both with and without https
    const liShort = contact.linkedIn.replace(/^https?:\/\//, "");
    text = text.replace(contact.linkedIn, "").replace(liShort, "");
  }
  if (contact.github) {
    const ghShort = contact.github.replace(/^https?:\/\//, "");
    text = text.replace(contact.github, "").replace(ghShort, "");
  }
  // Remove tokens "LinkedIn", "GitHub", "Phone", "Email", icons leftover
  text = text.replace(/\b(LinkedIn|GitHub|Phone|Email)\b/gi, "");
  // Split remaining into lines
  const lines = splitIntoLines(text);
  // Filter out lines that are headings or too short generic
  const filtered = lines.filter((l) => {
    const upper = l.toUpperCase();
    return !HEADINGS.includes(upper) && l.length > 0;
  });

  let name = "";
  let title = "";
  let aboutMe = "";

  // Check if PROFILE section exists, then aboutMe is there
  const profileText = sections.get("PROFILE") || sections.get("ABOUT ME") || sections.get("SUMMARY");
  if (profileText) {
    aboutMe = profileText.split("\n").map((l) => l.trim()).filter(Boolean).join(" ").trim();
  }

  if (filtered.length > 0) {
    // Name is usually first line, should be 2-4 words, not a sentence
    // Find first line that looks like name (capitalized words, 1-4 words, length < 40)
    let nameIdx = 0;
    for (let idx = 0; idx < Math.min(3, filtered.length); idx++) {
      const line = filtered[idx];
      if (line.split(/\s+/).length <= 4 && line.length < 40 && !line.includes(".") && !line.includes(",")) {
        name = line;
        nameIdx = idx;
        break;
      }
    }
    if (!name && filtered.length > 0) name = filtered[0];

    // Title is next line after name that is short and not sentence
    const afterName = filtered.slice(nameIdx + 1);
    if (afterName.length > 0) {
      // Title heuristic: next short line before long paragraph
      const candidate = afterName[0];
      if (candidate && candidate.length < 80 && candidate.split(/\s+/).length <= 6) {
        title = candidate;
        // AboutMe is remaining lines if profile not already used
        if (!aboutMe) {
          const remaining = afterName.slice(1);
          // Join remaining lines as aboutMe, filter out contact-like remnants
          aboutMe = remaining.join(" ").trim();
        }
      } else {
        // Candidate looks like aboutMe directly
        if (!aboutMe) aboutMe = afterName.join(" ").trim();
      }
    }
  }

  // Fallback: if aboutMe still empty, try to extract from personalInfoText paragraph after name/title
  if (!aboutMe) {
    // Find between title and first heading - already filtered
    // Use filtered joining as aboutMe without name/title
    if (filtered.length >= 3) {
      aboutMe = filtered.slice(2).join(" ").trim();
    }
  }

  // Clean aboutMe: remove duplicate name/title if present
  if (aboutMe.includes(name)) aboutMe = aboutMe.replace(name, "").trim();
  if (title && aboutMe.includes(title)) aboutMe = aboutMe.replace(title, "").trim();

  // Limit aboutMe length (original max 470)
  if (aboutMe.length > 500) aboutMe = aboutMe.slice(0, 500);

  return {
    name: name.trim(),
    title: title.trim(),
    aboutMe: aboutMe.trim(),
    image: "",
    email: contact.email,
    phoneNumber: contact.phone,
    linkedIn: contact.linkedIn,
    github: contact.github,
  };
}

export function parseResumeFromText(rawText: string): ResumeData {
  const cleaned = normalize(rawText);
  // First try embedded JSON (handles both contiguous and whitespace-broken markers)
  const embedded = tryExtractEmbeddedJson(cleaned);
  if (embedded) {
    // Validate and return with defaults for missing fields
    const defaults = defaultResumeData();
    // Also sanitize embedded education in case old PDFs had corrupted persisted data
    const sanitize = (arr: unknown): Education[] =>
      Array.isArray(arr)
        ? (arr as Education[]).filter(
            (edu) => !isCorruptedValue(edu.degree) && !isCorruptedValue(edu.college) && !isCorruptedValue(edu.discipline),
          )
        : [];
    return {
      personalInfo: { ...defaults.personalInfo, ...embedded.personalInfo },
      settings: { ...defaults.settings, ...embedded.settings },
      workExperience: Array.isArray(embedded.workExperience) ? embedded.workExperience : [],
      skills: Array.isArray(embedded.skills) ? embedded.skills : [],
      certifications: Array.isArray(embedded.certifications) ? embedded.certifications : [],
      awards: Array.isArray(embedded.awards) ? embedded.awards : [],
      education: sanitize(embedded.education),
      languages: Array.isArray(embedded.languages) ? embedded.languages : [],
      patents: Array.isArray(embedded.patents) ? embedded.patents : [],
      projects: Array.isArray(embedded.projects) ? embedded.projects : [],
      publications: Array.isArray(embedded.publications) ? embedded.publications : [],
    };
  }

  // Strip hidden JSON blocks so they don't pollute heuristic sections (fixes old buggy PDFs where markers were broken)
  const cleanedWithoutEmbed = stripEmbeddedJsonBlocks(cleaned);

  const { personalInfoText, sections } = splitByHeadings(cleanedWithoutEmbed);

  const personalInfo = parsePersonalInfo(personalInfoText, cleanedWithoutEmbed, sections);

  // Map headings to our parsers, handling variants
  const getSection = (keys: string[]): string | undefined => {
    for (const k of keys) {
      if (sections.has(k)) return sections.get(k);
    }
    return undefined;
  };

  const skills = parseSkills(getSection(["SKILLS"]));
  const workExperience = parseWorkExperience(getSection(["WORK EXPERIENCE", "EXPERIENCE"]));
  let education = parseEducation(getSection(["EDUCATION"]));
  // Filter out corrupted education entries that are actually broken hidden JSON (old buggy PDFs)
  education = education.filter(
    (e) => !isCorruptedValue(e.degree) && !isCorruptedValue(e.college) && !isCorruptedValue(e.discipline),
  );
  const certifications = parseCertifications(getSection(["CERTIFICATIONS", "CERTIFICATION"]));
  const awards = parseAwards(getSection(["AWARDS", "AWARD"]));
  const languages = parseLanguages(getSection(["LANGUAGES", "LANGUAGE"]));
  const patents = parsePatents(getSection(["PATENTS", "PATENT"]));
  const projects = parseProjects(getSection(["PROJECTS", "PROJECT", "PERSONAL PROJECTS"]));

  // Infer settings based on content
  const settings: ResumeData["settings"] = {
    template: "professional",
    isLinkedIn: !!personalInfo.linkedIn,
    isGithub: !!personalInfo.github,
    isImage: !!personalInfo.image,
    isAwards: awards.length > 0,
    isCertifications: certifications.length > 0,
    isPatents: patents.length > 0,
    isPersonalProjects: projects.length > 0,
    isLanguages: languages.length > 0,
  };

  return {
    personalInfo,
    settings,
    workExperience,
    skills,
    certifications,
    awards,
    education,
    languages,
    patents,
    projects,
    publications: [],
  };
}

export async function parseResumePdf(arrayBuffer: ArrayBuffer): Promise<ResumeData> {
  const rawText = await extractTextFromPdf(arrayBuffer);
  if (!rawText || rawText.trim().length < 10) {
    throw new Error("Could not extract text from PDF. The file may be scanned or empty.");
  }
  return parseResumeFromText(rawText);
}

// Helper to emit hidden JSON for embedding in PDF (used by ResumePDF component)
// Re-export the robust base64 version from constants for convenience
export { getEmbeddedJsonString } from "./constants";
