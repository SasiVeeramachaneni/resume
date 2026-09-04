export const EMBED_START = "__RESUME_JSON_START__";
export const EMBED_END = "__RESUME_JSON_END__";

export function getEmbeddedJsonString(resumeData: unknown): string {
  try {
    const json = JSON.stringify(resumeData);
    // Use base64 to avoid whitespace tokenization issues in pdfjs extraction
    // Handle unicode safely
    let b64: string;
    if (typeof window !== "undefined" && typeof window.btoa === "function") {
      b64 = window.btoa(unescape(encodeURIComponent(json)));
    } else {
      // Node fallback (for tests / SSR)
      // @ts-ignore
      b64 = Buffer.from(json, "utf-8").toString("base64");
    }
    return `${EMBED_START}${b64}${EMBED_END}`;
  } catch {
    return "";
  }
}
