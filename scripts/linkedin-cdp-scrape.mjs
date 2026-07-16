// Direct LinkedIn profile scraper that runs in the Vite dev server (Node).
//
// This replaces the previous MCP-server bridge. The dev plugin imports
// `fetchMyProfile` from here and calls it directly — no stdio transport, no
// MCP SDK, no subprocess that can die with "MCP error -32000: Connection
// closed".
//
// How it works:
//   1. You start Chrome with --remote-debugging-port=9222 while signed into
//      LinkedIn.
//   2. The dev plugin calls fetchMyProfile(), which uses puppeteer-core to
//      attach to your running Chrome, opens a new tab to
//      https://www.linkedin.com/in/me (which redirects to your own profile),
//      waits for the page to render, then reads structured data out of the DOM
//      and returns it as JSON.
//
// Because the new tab shares the existing Chrome session, LinkedIn sees you as
// already signed in — no OAuth, no API keys, no separate login.

// Where to find the running Chrome's DevTools endpoint. The default matches
// the port you get from `--remote-debugging-port=9222`.
const CDP_URL = process.env.LINKEDIN_CDP_URL || "http://127.0.0.1:9222";
// Optional: override the profile URL (mostly for testing).
const PROFILE_URL =
  process.env.LINKEDIN_PROFILE_URL || "https://www.linkedin.com/in/me";
// How long to wait for the page to render before scraping.
const RENDER_TIMEOUT_MS = parseInt(
  process.env.LINKEDIN_RENDER_TIMEOUT || "45000",
  10,
);

// ---------- profile scraping ------------------------------------------------

// The big page.evaluate() that pulls the profile out of LinkedIn's DOM. Runs in
// the page context, so it must be a single serialisable function — no closures
// over outer scope, no imports. Returned field names line up with what
// scripts/linkedin-mapper.mjs already understands.
function scrapeProfilePage() {
  function txt(el) {
    return (el && el.innerText ? el.innerText : "").trim();
  }

  // Find a profile section by its visible heading (e.g. "Experience",
  // "Education", "Skills"). LinkedIn renders headings inside <h2>/<h3> with a
  // child span. We hunt by trimmed, case-insensitive text.
  function findSectionByText(labels) {
    const wanted = labels.map((s) => s.toLowerCase());
    const headings = Array.from(
      document.querySelectorAll(
        'h2, h3, [role="heading"], div.pvs-header__container',
      ),
    );
    const heading = headings.find((h) => {
      const t = txt(h).toLowerCase();
      return wanted.some((w) => t === w || t.startsWith(w));
    });
    if (!heading) return null;
    let node = heading;
    // Walk up to the section container. LinkedIn wraps each section in <section>.
    for (let i = 0; i < 6 && node && node.tagName !== "SECTION"; i += 1) {
      node = node.parentElement;
    }
    return node || heading.parentElement;
  }

  // Each section's items are <li> elements with multi-line innerText. We split
  // those lines and keep the meaningful ones.
  function listItemLines(li) {
    return txt(li)
      .split(/\r?\n+/)
      .map((s) => s.replace(/\s+/g, " ").trim())
      .filter((s) => s.length > 0);
  }

  // Try to pull a date range out of a list of text lines.
  function parseDateRange(lines) {
    const dateRe =
      /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4})\s*(?:[-–—]|to)\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4}|present|now|current)/i;
    for (const line of lines) {
      const m = line.match(dateRe);
      if (m) {
        return {
          startDate: m[1].trim(),
          endDate: /present|now|current/i.test(m[2]) ? "Present" : m[2].trim(),
          isCurrent: /present|now|current/i.test(m[2]),
        };
      }
    }
    return { startDate: "", endDate: "", isCurrent: false };
  }

  function splitTrailingYear(str) {
    const m = str.match(
      /((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4})\s*(?:[-–—]|to)\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4}|present|now|current)/i,
    );
    if (m) {
      return {
        startDate: m[1].trim(),
        endDate: /present|now|current/i.test(m[2]) ? "Present" : m[2].trim(),
      };
    }
    const ym = str.match(
      /\b(\d{4})\s*(?:[-–—]|to)\s*(\d{4}|present|now|current)\b/i,
    );
    if (ym) {
      return {
        startDate: ym[1].trim(),
        endDate: /present|now|current/i.test(ym[2]) ? "Present" : ym[2].trim(),
      };
    }
    return { startDate: "", endDate: "" };
  }

  // ---------- name & headline ----------
  // LinkedIn no longer renders an <h1>; the user's name lives in an obfuscated
  // <h2> and historically in div.text-heading-xlarge. The most reliable source
  // is document.title ("<name> | LinkedIn"), so we use that as a fallback.
  function nameFromTitle() {
    const t = document.title || "";
    return t.replace(/\s*\|\s*LinkedIn\s*$/i, "").trim();
  }
  function nameFromHeadings() {
    // Pick the first h2/h1 inside <main> whose text isn't a system heading
    // ("0 notifications", "Profile language", "Public profile & URL",
    // "Ad Options", "Don't want to see this", …).
    const skip = /^(0 notifications|profile language|public profile|ad options|don.t want to see this)/i;
    const main = document.querySelector("main") || document;
    const heads = Array.from(
      main.querySelectorAll("h1, h2, [role=\"heading\"]"),
    );
    const found = heads
      .map(txt)
      .find((t) => t && t.length > 1 && !skip.test(t));
    return found || "";
  }
  const name =
    txt(document.querySelector("h1")) ||
    txt(document.querySelector("div.text-heading-xlarge")) ||
    nameFromHeadings() ||
    nameFromTitle();

  // Headline: the medium-weight text right under the name in the intro card.
  // LinkedIn's class is obfuscated, so use a few selectors and pick the first
  // candidate that isn't the name or a system heading.
  const headlineCandidates = Array.from(
    document.querySelectorAll(
      "div.text-body-medium, .text-body-medium, [class*=\"text-body-medium\"], main div[class*=\"text-body\"]",
    ),
  );
  let headline = "";
  for (const el of headlineCandidates) {
    const t = txt(el);
    if (t && t.length > 2 && t !== name && !/^0 notifications/i.test(t)) {
      headline = t;
      break;
    }
  }

  // ---------- about ----------
  const aboutSection = findSectionByText(["About"]);
  let about = "";
  if (aboutSection) {
    // The about paragraph is usually a span/p inside the section with the
    // longest non-heading text.
    const candidates = Array.from(
      aboutSection.querySelectorAll("span, p, div"),
    ).map(txt);
    about =
      candidates
        .filter((s) => s.length > 30 && s !== "About")
        .sort((a, b) => b.length - a.length)[0] || "";
  }

  // ---------- experience ----------
  const experience = [];
  const expSection = findSectionByText(["Experience", "Work experience"]);
  if (expSection) {
    const items = expSection.querySelectorAll("li");
    items.forEach((li) => {
      const lines = listItemLines(li);
      if (lines.length === 0) return;
      // LinkedIn layout: first line is the role title OR company; the second is
      // usually the company OR role; dates often contain "·" + "Present".
      const { startDate, endDate, isCurrent } = parseDateRange(lines);
      const dateLine =
        lines.find((l) =>
          /·|present|present|[-–—]\s*\d{4}|\b\d{4}\b/i.test(l),
        ) || "";
      // Description lines: long lines that aren't title/company/dates.
      const descriptionLines = lines.filter(
        (l) =>
          l.length > 40 &&
          l !== dateLine &&
          !/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}/i.test(
            l,
          ) &&
          !/^\s*Skills\b/i.test(l),
      );
      const title = lines[0] || "";
      // Company is typically the second line when it looks like a company
      // ("· Full-time" suffix is common), else reuse the first line.
      let company = "";
      if (lines[1] && lines[1] !== dateLine && lines[1] !== title) {
        company = lines[1].split("·")[0].trim();
      }
      experience.push({
        title: title,
        company: company,
        startDate,
        endDate,
        isCurrent,
        description: descriptionLines.join("\n"),
        experienceDetails: descriptionLines,
      });
    });
  }

  // ---------- education ----------
  const education = [];
  const eduSection = findSectionByText(["Education"]);
  if (eduSection) {
    eduSection.querySelectorAll("li").forEach((li) => {
      const lines = listItemLines(li);
      if (lines.length === 0) return;
      const { startDate, endDate } = splitTrailingYear(lines.join("\n"));
      const school = lines[0] || "";
      // Second line often holds "Degree, Field of study".
      const degreeLine = lines[1] || "";
      const degreeParts = degreeLine
        .split(/,|·/)
        .map((s) => s.trim())
        .filter(Boolean);
      education.push({
        school,
        degree: degreeParts[0] || degreeLine || "",
        fieldOfStudy: degreeParts.slice(1).join(", "),
        startDate,
        endDate,
      });
    });
  }

  // ---------- skills ----------
  let skills = [];
  const skillsSection = findSectionByText(["Skills"]);
  if (skillsSection) {
    // Skill chips render as <a> or <span> with a count badge. Take their text.
    skills = Array.from(skillsSection.querySelectorAll("a, span"))
      .map(txt)
      .filter(
        (s) =>
          s &&
          s.length > 1 &&
          s.length < 60 &&
          !/^\d/.test(s) &&
          s !== "Skills",
      )
      // De-dup, preserving order.
      .filter((v, i, arr) => arr.indexOf(v) === i);
  }

  // ---------- certifications ----------
  const certifications = [];
  const certSection = findSectionByText([
    "Licenses & certifications",
    "Licenses & Certifications",
    "Certifications",
    "Licenses",
  ]);
  if (certSection) {
    certSection.querySelectorAll("li").forEach((li) => {
      const lines = listItemLines(li);
      if (lines.length === 0) return;
      const name = lines[0] || "";
      let issuer = "";
      let issueDate = "";
      for (const l of lines.slice(1)) {
        if (
          !issueDate &&
          /\b(issued|issued\s+\d|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|20\d{2})/i.test(
            l,
          )
        ) {
          issueDate = l;
        } else if (!issuer) {
          issuer = l.split("·")[0].trim();
        }
      }
      certifications.push({ name, organization: issuer, issuer, issueDate });
    });
  }

  // ---------- honors / awards ----------
  const awards = [];
  const awardSection = findSectionByText([
    "Honors & awards",
    "Honors & Awards",
    "Awards",
  ]);
  if (awardSection) {
    awardSection.querySelectorAll("li").forEach((li) => {
      const lines = listItemLines(li);
      if (lines.length === 0) return;
      const name = lines[0] || "";
      let issuer = "";
      for (const l of lines.slice(1)) {
        if (!issuer) {
          issuer = l.split("·")[0].trim();
          break;
        }
      }
      awards.push({ name, organization: issuer, issuer });
    });
  }

  // ---------- projects ----------
  const projects = [];
  const projSection = findSectionByText(["Projects"]);
  if (projSection) {
    projSection.querySelectorAll("li").forEach((li) => {
      const lines = listItemLines(li);
      if (lines.length === 0) return;
      const name = lines[0] || "";
      const description = lines
        .slice(1)
        .filter((l) => l.length > 20)
        .join("\n");
      projects.push({ name, description });
    });
  }

  const url = location.href;
  return {
    name,
    headline,
    about,
    experience,
    education,
    skills,
    certifications,
    awards,
    projects,
    profileUrl: url,
    url,
  };
}

async function getPuppeteer() {
  try {
    const mod = await import("puppeteer-core");
    return mod.default || mod;
  } catch (e) {
    throw new Error(
      "puppeteer-core is not installed. Run `npm install` (it is a devDependency).",
    );
  }
}

// Attach to the already-running Chrome (started with
// `--remote-debugging-port=9222`), open the user's own LinkedIn profile, and
// return the scraped DOM data. Throws Errors with human-actionable messages on
// the common failure modes (Chrome not reachable, not signed in, page too
// slow).
export async function fetchMyProfile() {
  const puppeteer = await getPuppeteer();
  let browser;
  try {
    browser = await puppeteer.connect({
      browserURL: CDP_URL,
      defaultViewport: null,
    });
  } catch (e) {
    const msg = e && e.message ? e.message : String(e);
    // Translate the raw connect failure into something the user can act on.
    if (
      /ECONNREFUSED|connect|fetch failed|net::ERR|HTTP 404|HTTP 400/i.test(
        msg,
      ) ||
      msg === "fetch failed"
    ) {
      throw new Error(
        `Could not connect to Chrome at ${CDP_URL}. ` +
          "Start Chrome with --remote-debugging-port=9222 and sign in to LinkedIn, " +
          "then retry. (See the README's 'Connect with LinkedIn' section.)",
      );
    }
    throw new Error(`Could not connect to Chrome at ${CDP_URL}: ${msg}`);
  }
  let page;
  try {
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });

    // LinkedIn aggressively blocks automation. Undo puppeteer's
    // `navigator.webdriver=true` flag and the CDP injected scripts hint, so the
    // tab looks like a normal user navigation, not a bot. (`evaluateOnNewDocument`
    // runs before any page script on every navigation.)
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(Navigator.prototype, "webdriver", {
        get: () => undefined,
        configurable: true,
      });
      Object.defineProperty(Navigator.prototype, "languages", {
        get: () => ["en-US", "en"],
        configurable: true,
      });
      Object.defineProperty(Navigator.prototype, "plugins", {
        get: () => [1, 2, 3, 4, 5],
        configurable: true,
      });
      window.chrome = window.chrome || { runtime: {} };
    });
    // Real Chrome UA (no "HeadlessChrome") and an English Accept-Language so
    // LinkedIn doesn't see a default CDP avatar.
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36",
    );
    await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9" });

    await page.goto(PROFILE_URL, {
      waitUntil: "domcontentloaded",
      timeout: RENDER_TIMEOUT_MS,
    });
    try {
      // LinkedIn no longer renders an <h1> on profile pages (the name moved to
      // an obfuscated <h2>); <main> wraps the whole profile-card/sections tree
      // and is a stable presence, so wait for that.
      await page.waitForSelector("main", { timeout: RENDER_TIMEOUT_MS });
    } catch {
      throw new Error(
        "The LinkedIn profile page did not load its <main> container in time. " +
          "The DOM may have changed, or the page is still loading — retry the import.",
      );
    }
    // A signed-out LinkedIn redirects /in/me -> /uas/login, and an
    // automation-flagged session also hits /checkpoint/ or /uas/challenge.
    // The sign-in/challenge pages DO have an <h1>, so we must check the URL
    // explicitly before treating the page as a profile.
    const url = page.url();
    if (/login|signin|\/uas\/|deck\.php|\/checkpoint|challenge|captcha/i.test(url)) {
      throw new Error(
        "LinkedIn redirected to a sign-in / verification page (" +
          url +
          "). Open the Chrome that is running with --remote-debugging-port=9222, " +
          "complete the sign-in / captcha in that window, then retry the import.",
      );
    }
    // Give the SPA a moment to render the section content.
    await new Promise((r) => setTimeout(r, 2500));

    const data = await page.evaluate(scrapeProfilePage);
    return data;
  } finally {
    try {
      if (page) await page.close();
    } catch {
      /* ignore */
    }
    try {
      browser.disconnect();
    } catch {
      /* ignore */
    }
  }
}

export function cdpConfig() {
  return { cdpUrl: CDP_URL, profileUrl: PROFILE_URL, renderTimeoutMs: RENDER_TIMEOUT_MS };
 }

export default fetchMyProfile;