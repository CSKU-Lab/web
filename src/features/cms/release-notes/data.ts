export interface ReleaseHighlight {
  title: string;
  description: string;
}

export interface ReleaseNote {
  /** Must match `version` in package.json on the release this note ships with. */
  version: string;
  /** ISO date, e.g. "2026-06-29". */
  date: string;
  highlights: ReleaseHighlight[];
}

/**
 * Curated CMS release notes, newest first.
 *
 * On each release, prepend one entry whose `version` matches package.json.
 * If no entry matches the running version, no modal is shown (safe no-op).
 */
export const releaseNotes: ReleaseNote[] = [
  {
    version: "0.52.0",
    date: "2026-06-30",
    highlights: [
      {
        title: "What's New on every update",
        description:
          "This dialog now greets you with a summary of changes the first time you open the CMS after a new release.",
      },
      {
        title: "Richer submission detail",
        description:
          "Test cases are grouped like the core view and show a per-group score, making grading easier to read.",
      },
      {
        title: "Mermaid diagrams in code blocks",
        description:
          "Write a mermaid code block in document materials and it renders as a diagram.",
      },
      {
        title: "Document material upgrades",
        description:
          "A blog-style header and a left scrollspy table-of-contents rail make long documents easier to navigate.",
      },
      {
        title: "Submit cooldown & pass confetti",
        description:
          "Code materials add a 5s submit cooldown to curb spamming, and students get a confetti burst when they pass.",
      },
    ],
  },
  {
    version: "0.51.0",
    date: "2026-06-29",
    highlights: [
      {
        title: "Prev/next material navigation",
        description:
          "Move between materials directly from a document material with new previous/next controls.",
      },
      {
        title: "Tidier code blocks",
        description:
          "The code block language selector is now anchored to the top-right for a cleaner editor.",
      },
    ],
  },
];
