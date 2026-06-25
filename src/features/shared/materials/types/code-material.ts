export interface CodeFile {
  name: string;
  content: string;
  readonly?: boolean;
  /** Segment structure (editable/readonly/hidden/exclude) for segmented files. */
  segments?: { content: string; type: "editable" | "readonly" | "hidden" | "exclude" }[];
}
