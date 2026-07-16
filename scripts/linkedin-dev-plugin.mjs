// Dev-only Vite plugin that exposes a LinkedIn import endpoint backed by a
// direct Chrome DevTools Protocol (CDP) scrape.
//
// Why a dev plugin? CDP scraping needs Node + puppeteer-core (and a Chrome
// instance you control), which can't run in the browser. During `npm run dev`
// Vite runs in Node, so we do the scrape here and stream the result (mapped to
// the app's ResumeData shape) back to the browser.
//
// This endpoint is ONLY available in dev (`vite dev`). It is never bundled
// into the production build, so shipping the open-source app does not expose
// any server-side secrets or endpoints.
//
// How it works:
//   1. You start Chrome with `--remote-debugging-port=9222` while signed into
//      LinkedIn.
//   2. The browser button (`components/LinkedInImport/LinkedInImportButton.tsx`)
//      POSTs to `/api/linkedin/import`.
//   3. This plugin uses puppeteer-core to attach to your running Chrome, opens
//      a new tab to https://www.linkedin.com/in/me (which redirects to your own
//      profile), waits for the page to render, then reads the structured data
//      directly out of the DOM.
//   4. The scraped JSON is mapped via `scripts/linkedin-mapper.mjs` to the
//      app's ResumeData shape and returned to the browser.
//
// Because the new tab shares the existing Chrome session, LinkedIn sees you as
// already signed in — no OAuth, no API keys, no separate login.
//
// Configuration (all optional, see README.md):
//   LINKEDIN_CDP_URL          - Chrome DevTools endpoint (default: http://127.0.0.1:9222)
//   LINKEDIN_PROFILE_URL      - profile URL to load (default: https://www.linkedin.com/in/me)
//   LINKEDIN_RENDER_TIMEOUT   - how long to wait for the page to render, in ms (default: 45000)

import { fetchMyProfile, cdpConfig } from "./linkedin-cdp-scrape.mjs";
import { mapLinkedInToResumeData } from "./linkedin-mapper.mjs";

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export function linkedinDevPlugin() {
  return {
    name: "resume-linkedin-dev",
    configureServer(server) {
      // Import the currently logged-in user's LinkedIn profile into ResumeData.
      server.middlewares.use("/api/linkedin/import", async (req, res) => {
        if (req.method !== "POST" && req.method !== "GET") {
          return sendJson(res, 405, { ok: false, error: "Method not allowed" });
        }
        try {
          const raw = await fetchMyProfile();
          const resumeData = mapLinkedInToResumeData(raw);
          return sendJson(res, 200, { ok: true, resumeData });
        } catch (err) {
          return sendJson(res, 500, {
            ok: false,
            error: err && err.message ? err.message : String(err),
          });
        }
      });

      // Lightweight status endpoint (does not touch Chrome): reports which
      // CDP endpoint the bridge will use, so the UI can show whether the
      // bridge is wired up.
      server.middlewares.use("/api/linkedin/status", (_req, res) => {
        const { cdpUrl, profileUrl, renderTimeoutMs } = cdpConfig();
        return sendJson(res, 200, {
          ok: true,
          cdpUrl,
          profileUrl,
          renderTimeoutMs,
        });
      });
    },
  };
}

export default linkedinDevPlugin;