// Optional MCP (Model Context Protocol) server that exposes the same LinkedIn
// CDP scrape used by the dev plugin, so an MCP client such as opencode can call
// it as a tool. It speaks JSON-RPC 2.0 over stdio (the "stdio" transport) with
// a hand-rolled protocol implementation, so it has no extra npm dependencies
// beyond `puppeteer-core` (already a devDependency).
//
// Why this exists alongside the dev plugin:
//   - The dev plugin (`/api/linkedin/import`) is for the in-browser Connect
//     button while running `npm run dev`.
//   - This MCP server is for AI tooling: register it in opencode's `opencode.json`
//     (see README, "Connect with LinkedIn via MCP") and an agent can invoke the
//     `linkedin_import_profile` tool to pull your profile straight into the
//     resume data.
//
// Reuses the existing scraper + mapper, so the behaviour is identical to the
// dev plugin.
//
// Run it manually:
//   node scripts/linkedin-mcp-server.mjs
// Required prerequisites: Chrome running with --remote-debugging-port=9222 and
// signed into LinkedIn (see README).

import { fetchMyProfile, cdpConfig } from "./linkedin-cdp-scrape.mjs";
import { mapLinkedInToResumeData } from "./linkedin-mapper.mjs";

const PROTOCOL_VERSION = "2024-11-05";
const SERVER_INFO = { name: "resume-linkedin", version: "1.0.0" };
const TOOL_NAME = "linkedin_import_profile";
const TOOL_DESCRIPTION =
  "Import the currently logged-in LinkedIn user's profile (name, headline, " +
  "about, experience, education, skills, certifications, awards, projects) " +
  "into the app's ResumeData shape by scraping the signed-in Chrome over the " +
  "Chrome DevTools Protocol. Requires Chrome running with " +
  "--remote-debugging-port=9222 and signed into LinkedIn.";

const tools = [
  {
    name: TOOL_NAME,
    description: TOOL_DESCRIPTION,
    inputSchema: {
      type: "object",
      properties: {
        includeRaw: {
          type: "boolean",
          default: false,
          description:
            "If true, also include the raw scraped LinkedIn profile alongside the mapped ResumeData.",
        },
      },
    },
  },
];

// Send one JSON-RPC result/error back over stdout (newline-delimited).
function send(message) {
  process.stdout.write(JSON.stringify(message) + "\n");
}

function ok(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function error(id, code, message, data) {
  const payload = { jsonrpc: "2.0", id, error: { code, message } };
  if (data !== undefined) payload.error.data = data;
  send(payload);
}

async function handleToolCall(id, params) {
  const name = params && params.name;
  const args = (params && params.arguments) || {};

  if (name !== TOOL_NAME) {
    return error(id, -32601, `Unknown tool: ${String(name)}`);
  }

  try {
    const raw = await fetchMyProfile();
    const resumeData = mapLinkedInToResumeData(raw);
    const payload = args.includeRaw
      ? { ok: true, resumeData, raw }
      : { ok: true, resumeData };
    const text = JSON.stringify(payload, null, 2);
    return ok(id, {
      content: [{ type: "text", text }],
    });
  } catch (err) {
    const message = err && err.message ? err.message : String(err);
    // Return as an MCP tool error (isError) so the client can surface it,
    // rather than a transport-level error.
    return ok(id, {
      isError: true,
      content: [{ type: "text", text: `LinkedIn import failed: ${message}` }],
    });
  }
}

async function handleRequest(message) {
  const { id, method, params } = message;

  switch (method) {
    case "initialize":
      return ok(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });

    case "tools/list":
      // Echo the negotiated protocol version for clients that check it.
      return ok(id, { tools });

    case "tools/call":
      return handleToolCall(id, params);

    case "ping":
      return ok(id, {});

    default:
      return error(id, -32601, `Method not found: ${String(method)}`);
  }
}

// Line-delimited JSON-RPC on stdin.
let buffer = "";
process.stdin.setEncoding("utf8");

process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let nl;
  while ((nl = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (!line) continue;
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      // Malformed JSON — we cannot know the id, so emit a notification-less error.
      send({
        jsonrpc: "2.0",
        id: null,
        error: { code: -32700, message: "Parse error" },
      });
      continue;
    }

    // Notifications (no id) get no response.
    if (message.id === undefined || message.id === null) {
      if (message.method === "notifications/initialized") {
        // Nothing to do; just acknowledged.
      }
      continue;
    }

    Promise.resolve(handleRequest(message)).catch((err) => {
      const detail = err && err.message ? err.message : String(err);
      error(message.id, -32603, `Internal error: ${detail}`);
    });
  }
});

// Keep stdin open in case the parent pipes with no immediate data.
process.stdin.resume();

// Helpful stderr line on manual startup (does not pollute the JSON-RPC stdout).
process.stderr.write(
  `[resume-linkedin] MCP server ready on stdio. CDP: ${cdpConfig().cdpUrl}\n`,
);

// Surface unhandled rejections on stderr without crashing the protocol stream.
process.on("unhandledRejection", (err) => {
  process.stderr.write(`[resume-linkedin] unhandledRejection: ${String(err)}\n`);
});