// Debug helper: bypass the Vite dev server and run the scraper directly.
//   node scripts/test-import.mjs
import { fetchMyProfile } from "./linkedin-cdp-scrape.mjs";
import { mapLinkedInToResumeData } from "./linkedin-mapper.mjs";

const t0 = Date.now();
try {
  const raw = await fetchMyProfile();
  const mapped = mapLinkedInToResumeData(raw);
  console.log("scraped in", ((Date.now() - t0) / 1000).toFixed(1), "s");
  console.log("name :", mapped.personalInfo.name);
  console.log("title:", mapped.personalInfo.title);
  console.log("exp  :", mapped.workExperience.length, "entries");
  console.log("edu  :", mapped.education.length, "entries");
  console.log("skills:", mapped.skills.length);
  console.log("certs :", mapped.certifications.length);
  console.log("awards:", mapped.awards.length);
  console.log("proj  :", mapped.projects.length);
  console.log("---raw json---");
  console.log(JSON.stringify(mapped, null, 2));
} catch (e) {
  console.error("FAIL after", ((Date.now() - t0) / 1000).toFixed(1), "s:", e.message);
  process.exit(1);
}