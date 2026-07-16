# Resume Builder

> **Try it online:** <https://createresume.in> — build, edit and download a
> professional PDF resume right from your browser. No sign-up required.

An open-source resume builder built with **Vite + React + Mantine**, routed with
**React Router**. Build, edit and download a professional PDF resume in the
browser. No backend required — the only server-side piece is an
**opt-in, dev-only** bridge that lets you import your LinkedIn profile by
scraping the page from an already-running Chrome over the Chrome DevTools
Protocol.

> Note: this repo was originally scaffolded from a Mantine Next.js template and
> has since **migrated to React Router**. It is a plain Vite single-page app
> (`npm run dev` / `vite build`) whose routes live in `app/router.tsx` and are
> rendered client-side — there is no Next.js runtime and no server-side
> rendering. The `react-router-dom` package drives routing instead.

## Features

- Live, WYSIWYG-style resume editor at `/resume`
- Pluggable templates: `templates/professional` (two-column) and `templates/classic` (single-column) — each lives in its own folder with its metadata and render logic, so adding a template is a self-contained drop-in
- Sections: personal info, work experience, skills, certifications, awards,
  education, languages, patents, projects
- Image upload, dark/light theme toggle
- One-click PDF download via `@react-pdf/renderer`
- **Connect with LinkedIn** import (dev-only, scrapes your logged-in Chrome via CDP)
- Open source — find it on GitHub (the GitHub button on the landing page and
  the GitHub icon in the header of every other page link back to the repo.
  Enhance it as you like!)

## Local setup

### Prerequisites

- **Node.js 18+** (built and tested on Node 20/22) — check with `node -v`.
  Use [nvm](https://github.com/nvm-sh/nvm) if you need to switch versions.
- **npm 9+** — ships with Node (check with `npm -v`).
- (Optional, only for the LinkedIn import) **Google Chrome** started with
  remote debugging — see [Connect with LinkedIn (CDP import)](#connect-with-linkedin-cdp-import).

No global packages, no Docker, no database — everything runs from the repo.

### 1. Get the code

```bash
git clone https://github.com/SasiVeeramachaneni/resume.git
cd resume
```

### 2. Install dependencies

```bash
npm install
```

This pulls the app deps plus the dev-only `puppeteer-core` (used by the
optional LinkedIn scraper). Nothing is installed globally.

### 3. Start the dev server

```bash
npm run dev
```

Vite prints a local URL (default <http://localhost:5173>). Open it in your
browser, then visit `/resume` — e.g. <http://localhost:5173/resume> — to use
the resume builder. Changes to the code hot-reload instantly.

### 4. Build the resume

On `/resume`:

- Fill in your personal info, experience, education, skills, etc. in the
  WYSIWYG editor.
- Pick a template (`professional` or `classic`) from the header.
- Toggle sections and dark/light theme as needed.
- Click **Download** to export a one-click PDF via `@react-pdf/renderer`.

### 5. (Optional) Import from LinkedIn

To pull your LinkedIn profile straight into the form, start Chrome with
remote debugging while signed into LinkedIn, then click
**Connect with LinkedIn** in the builder. See
[Connect with LinkedIn (CDP import)](#connect-with-linkedin-cdp-import) and
[Connect with LinkedIn via MCP](#connect-with-linkedin-via-mcp) for the two
ways to do it.

### 6. (Optional) Production build / preview

```bash
npm run build       # outputs the static site to dist/
npm run preview     # serves the production build locally
```

## npm scripts

### Build and dev

- `dev` — start the dev server (incl. the LinkedIn CDP bridge)
- `build` — production build (also generates the sitemap)
- `preview` — preview the production build

### Quality

- `typecheck` — TypeScript type check (`tsc --noEmit`)
- `jest` / `jest:watch` — run tests
- `prettier:check` / `prettier:write` — format code
- `lint:stylelint` — lint CSS

### Docs

- `docs` — serve this README as a Docsify site (see [Docs](#docs-rendered-with-docsify))

### Other

- `storybook` / `storybook:build` — Storybook

## Docs (rendered with Docsify)

This README is also rendered as a polished, navigable site using
[Docsify](https://docsify.js.io/) — zero build step, `README.md` stays the
single source of truth.

```bash
npm run docs      # serves the repo root on http://localhost:5174
```

Then open <http://localhost:5174/docs.html>. Docsify fetches `README.md` and
`_sidebar.md` at runtime and renders them with syntax highlighting, search,
copy-to-clipboard on code blocks, and a sidebar of section shortcuts. No
install is needed (Docsify and plugins load from a CDN), and the Vite app's own
`index.html` entry is untouched.

> Prefer a one-off static server? From the repo root run
> `python3 -m http.server 5174` and open <http://localhost:5174/docs.html>.

## Connect with LinkedIn (CDP import)

On the `/resume` page, next to the **Settings** button, there is a
**Connect with LinkedIn** button. Clicking it imports the _currently logged-in_
LinkedIn user's profile (name, headline, about, experience, education, skills,
certifications, projects, awards) straight into the resume form. Fields you have
already filled in are preserved; only empty fields are populated.

### How it works

The scrape needs Node + puppeteer-core (and a Chrome instance you control),
which can't run in the browser. So the LinkedIn connection happens **server-side
during dev only**:

1. `npm run dev` starts Vite, which loads the dev-only plugin
   `scripts/linkedin-dev-plugin.mjs`.
2. The plugin imports the scraper (`scripts/linkedin-cdp-scrape.mjs`) and
   exposes dev-only endpoints (never shipped to production):
   - `POST /api/linkedin/import` — attaches to your running Chrome via CDP,
     opens `/in/me`, scrapes the rendered DOM, maps the result to the app's
     `ResumeData` shape (`scripts/linkedin-mapper.mjs`) and returns it as JSON.
   - `GET  /api/linkedin/status` — reports which Chrome DevTools endpoint the
     bridge will use.
3. The browser button (`components/LinkedInImport/LinkedInImportButton.tsx`)
   just `fetch`es `/api/linkedin/import` and merges the result into
   `ResumeContext` via `hooks/useLinkedInImport.ts`.

No secrets or endpoints are exposed in the production build — the plugin runs
exclusively inside the Vite dev server. A separate **MCP** entry point is also
provided so you can drive the same scrape from opencode or any MCP client — see
[Connect with LinkedIn via MCP](#connect-with-linkedin-via-mcp) below.

### Reuse your logged-in Chrome session (no OAuth)

The bridge attaches to an **already-running Chrome** instance over the Chrome
DevTools Protocol (CDP) and reads the page you're already signed into. It only
ever sees the LinkedIn account _you_ are currently logged in as — no OAuth, no
LinkedIn Developer App, no API keys.

It opens a fresh tab inside your running Chrome and reads `/in/me` (which
LinkedIn redirects to your own profile when you're signed in), then scrapes
the rendered DOM for name, headline, about, experience, education, skills,
certifications, awards and projects.

#### One-time setup

1. Start Chrome with remote debugging enabled, while signed into LinkedIn:

   ```bash
   # macOS
   open -na "Google Chrome" --args --remote-debugging-port=9222

   # Linux
   google-chrome --remote-debugging-port=9222

   # Windows (cmd)
   start chrome --remote-debugging-port=9222
   ```

   > Tip: if you don't want this to disturb your normal Chrome profile, make a
   > dedicated profile dir for it, e.g. on macOS:
   > `open -na "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir=/tmp/li-chrome`
   > You'll sign into LinkedIn once in that fresh profile.

2. In that Chrome window, sign in to https://www.linkedin.com if you haven't already.

3. Run the dev server (these env vars are the default, so you can usually just `npm run dev`):

   ```bash
   npm run dev
   ```

4. Open `/resume` and click **Connect with LinkedIn**.

That's it — no separate login browser, no token file. Each import attaches to
your Chrome, opens a temporary tab, reads the profile and closes the tab.

#### Verifying the setup

With the dev server running, check the bridge:

```bash
# Which Chrome DevTools endpoint is configured? (does not attach to Chrome)
curl http://localhost:5173/api/linkedin/status
# -> {"ok":true,"cdpUrl":"http://127.0.0.1:9222","profileUrl":"https://www.linkedin.com/in/me","renderTimeoutMs":45000}

# Import the logged-in user's profile into the resume:
curl -X POST http://localhost:5173/api/linkedin/import
# -> {"ok":true,"resumeData":{...}}
```

If the import fails, the red notification in the app (or the `error` field of
the JSON response) will explain what went wrong.

### Configuration reference

All variables are optional and only read by the dev server.

| Variable                  | Default                         | Description                                                          |
| ------------------------- | ------------------------------- | -------------------------------------------------------------------- |
| `LINKEDIN_CDP_URL`        | `http://127.0.0.1:9222`         | Chrome DevTools endpoint the scraper attaches to                     |
| `LINKEDIN_PROFILE_URL`    | `https://www.linkedin.com/in/me`| Profile URL to load (LinkedIn redirects this to your own profile)     |
| `LINKEDIN_RENDER_TIMEOUT` | `45000`                         | How long the scraper waits for the LinkedIn page to render, in ms    |

### Local tip

Keep a permanent set of these variables in a `.env.local` file (it is already in
`.gitignore`). For the default CDP flow you usually don't need any:

```bash
# .env.local
# LINKEDIN_CDP_URL=http://127.0.0.1:9222
```

Vite automatically loads `.env.local` for `process.env` in the config.

### Troubleshooting

- **"LinkedIn redirected to a sign-in page" / blank profile** — Chrome is not
  signed into LinkedIn. Open the Chrome that you started with
  `--remote-debugging-port=9222`, sign into LinkedIn, then retry the import.
  The bridge only ever sees the session _you_ are logged into, so it cannot
  access anyone else's profile.
- **"Could not connect to Chrome"/"Connection refused"** — Chrome was not
  started with `--remote-debugging-port=9222` (or you set a non-default
  `LINKEDIN_CDP_URL`). Restart Chrome with the flag.
- **Profile only has name + headline, no sections** — the scraper walks
  LinkedIn's DOM by section heading text; LinkedIn sometimes renders sections
  lazily. The default 2.5s post-load wait is usually enough, but if your
  profile is very long you can bump `LINKEDIN_RENDER_TIMEOUT`. You can always
  retry — each press re-scrapes.
- **Timeout** — LinkedIn pages can be slow. Raise `LINKEDIN_RENDER_TIMEOUT`
  (e.g. `60000`).
- **"puppeteer-core is not installed"** — the devDependency is missing. Run
  `npm install`.
- **"MCP error -32000: Connection closed"** — this error is from the *old*
  stdio MCP bridge that was replaced by the in-process CDP scrape. If you still
  see it you are running a stale MCP server process or have stale
  `LINKEDIN_MCP_*` env vars set. Relaunch `npm run dev`, and if you use the MCP
  entry point (see [Connect with LinkedIn via MCP](#connect-with-linkedin-via-mcp)),
  restart the MCP server / opencode so it picks up the current script.
- **"LinkedIn import is only available during local development"** — you clicked
  the button in a production build. The bridge is dev-only by design; the
  button degrades gracefully in production builds.

## Connect with LinkedIn via MCP

The CDP scrape described above is also wrapped as a **Model Context Protocol
(MCP) server** in `scripts/linkedin-mcp-server.mjs`. Any MCP client can call it
as the `linkedin_import_profile` tool and get back the same `ResumeData` JSON
the browser button uses — no Vite dev server required.

The included `opencode.json` already wires this server up for **opencode**, so
if you use opencode in this repo you can connect in three steps:

1. Start Chrome with remote debugging enabled and sign into LinkedIn
   (same one-time setup as the CDP flow above):

   ```bash
   # macOS
   open -na "Google Chrome" --args --remote-debugging-port=9222
   # Linux
   google-chrome --remote-debugging-port=9222
   # Windows (cmd)
   start chrome --remote-debugging-port=9222
   ```

2. Install deps (the MCP server reuses the existing `puppeteer-core`
   devDependency, no MCP SDK needed):

   ```bash
   npm install
   ```

3. (Re)start opencode in this repo. opencode reads `opencode.json` at startup and
   spawns the server as a stdio MCP server. The `linkedin` server and its
   `linkedin_import_profile` tool are then available to agents.

> opencode loads config once at startup and does not hot-reload it. After
> editing `opencode.json`, quit and restart opencode for changes to take effect.

### How to connect with MCP (the config)

The sample config in `opencode.json` is:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "linkedin": {
      "type": "local",
      "command": ["node", "scripts/linkedin-mcp-server.mjs"],
      "enabled": true,
      "env": {
        "LINKEDIN_CDP_URL": "http://127.0.0.1:9222",
        "LINKEDIN_PROFILE_URL": "https://www.linkedin.com/in/me",
        "LINKEDIN_RENDER_TIMEOUT": "45000"
      }
    }
  }
}
```

- `type: "local"` runs the command as a stdio subprocess.
- `command` is an array of strings (never a single string).
- `env` is passed to the subprocess; the three LinkedIn vars are optional and
  match the CDP variables documented in [Configuration reference](#configuration-reference).
  Header/secret string values support `{env:VAR}` interpolation; the shell-style
  `${VAR}` is not substituted.
- Add `"enabled": false` to keep the entry but disable the server.

> Using a different MCP client (Claude Desktop, etc.)? Point it at the same
> command — `node scripts/linkedin-mcp-server.mjs` over the stdio transport.
> The server implements the `initialize`, `tools/list`, and `tools/call`
> methods of JSON-RPC 2.0 with no extra dependencies.

### Using the tool to fill the resume

Ask the agent to import your profile, for example:

> Use the `linkedin_import_profile` MCP tool to import my LinkedIn profile,
> then write the returned `resumeData` into the resume form by merging it into
> `ResumeContext` via `hooks/useLinkedInImport.ts` (empty fields only).

The tool returns:

```json
{ "ok": true, "resumeData": { "personalInfo": { ... }, "workExperience": [ ... ], ... } }
```

Pass `"includeRaw": true` to also get the raw scraped LinkedIn profile for
debugging. On failure the tool returns `isError: true` with a human-actionable
message (Chrome not reachable, not signed in, page timed out) — see
[Troubleshooting](#troubleshooting) for the common fixes.

## Privacy & security

- The LinkedIn bridge runs entirely on your machine during `npm run dev`. No
  profile data is sent anywhere except from your own Chrome to your own browser.
- The bridge is never bundled into the production output (`vite build`), so an
  open-source consumer deploying this app gets a static site with no LinkedIn
  backend — the Connect button simply shows a helpful "dev-only" message.
- The scraper only operates on the LinkedIn session _you_ are logged into; it
  cannot scrape arbitrary profiles.

## Project layout

```
app/                       # routes & shared app code
  resume/page.tsx          # /resume builder page (template-agnostic; renders via registry)
components/
  ResumeHeader/            # header with Settings + Connect-with-LinkedIn + Download
  LinkedInImport/          # the Connect-with-LinkedIn button
  Heading/Header.tsx       # shared header on About/Blog/Tech/etc., incl. GitHub icon
  HeroBullets/             # landing-page hero with the GitHub button + "Enhance as you like"
  declarations/            # ResumeContext + types + useResume hook
  Settings/                # settings modal (toggles for sections)
  ...
templates/                 # one folder per template — drop a new one in to add a layout
  types.ts                 # TemplateDescriptor / TemplateLayoutProps / SectionName
  registry.ts             # allTemplates array + getTemplate(value) + templateOptions
  professional/            # two-column layout, metadata, preview swatch CSS
  classic/                 # single-column layout, metadata, preview swatch CSS
hooks/
  useLinkedInImport.ts     # calls the dev bridge, merges into ResumeContext
config.ts                  # shared constants (GITHUB_REPO_URL, etc.)
scripts/
  linkedin-dev-plugin.mjs  # dev-only Vite plugin exposing /api/linkedin/{import,status}
  linkedin-cdp-scrape.mjs  # attaches to Chrome via CDP and scrapes the logged-in LinkedIn profile
  linkedin-mapper.mjs      # maps LinkedIn profile JSON -> ResumeData
```

### Adding a template

1. Create `templates/<your-template>/` with:
   - `<YourTemplate>Layout.tsx` — a component implementing `TemplateLayoutProps`
     that arranges the section nodes (use `wrapSection(section, node)` for each
     rendered section so the reorder widget can track it).
   - `preview.module.css` — `.preview` and `.mobilePreview` swatch classes used
     by the template picker.
   - `index.ts` — exports a `TemplateDescriptor` (metadata, `sectionSides`,
     `previewClassName` / `mobilePreviewClassName`, `Layout`).
2. Register it in `templates/registry.ts` by adding it to `allTemplates`.
3. Optionally widen `TemplateValue` in `templates/types.ts` (and the
   `settings.template` union in `components/declarations/types.ts`).

That's it — the resume page, the template picker in the header, and the PDF
download all pick it up automatically.

## Licence

See [LICENCE](./LICENCE).
