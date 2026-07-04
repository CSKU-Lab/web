import { Extension } from "@tiptap/react";

/**
 * Marks a document as rendered inside the instructor submission review flow.
 * When present, embed node views (code / input) render the SELECTED student's
 * submitted content read-only instead of the student's own interactive editor.
 *
 * Passed through the editor instance (not React context) because Tiptap node
 * view portals do not reliably inherit outer React context.
 */
export interface DocumentReviewValue {
  sectionID: string;
  labID: string;
  studentID: string;
}

interface DocumentReviewOptions {
  review: DocumentReviewValue | null;
}

interface DocumentReviewStorage {
  review: DocumentReviewValue | null;
}

export const DocumentReviewExtension = Extension.create<
  DocumentReviewOptions,
  DocumentReviewStorage
>({
  name: "documentReview",

  addOptions() {
    return { review: null };
  },

  addStorage() {
    return { review: null };
  },

  onBeforeCreate() {
    this.storage.review = this.options.review;
  },
});

/** Read the review value from an editor's storage, or null when not in review mode. */
export function getDocumentReview(
  storage: unknown,
): DocumentReviewValue | null {
  const s = (storage as Record<string, DocumentReviewStorage | undefined>)
    ?.documentReview;
  return s?.review ?? null;
}
