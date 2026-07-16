// Project-wide constants. Centralized so buttons/links can be updated in one place.

// The open-source repository for this resume builder. Used by the GitHub
// buttons/icons across the landing page and the shared header on other pages.
export const GITHUB_REPO_URL = "https://github.com/SasiVeeramachaneni/resume";

// Repository owner/name parsed from the URL, used for the GitHub icon tooltip.
export const GITHUB_REPO_LABEL = GITHUB_REPO_URL.replace(
  /^https?:\/\/github\.com\//,
  "",
);
