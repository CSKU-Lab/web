export interface IEditorSettings {
  fontSize: number;
  vimMode: boolean;
  ligatures: boolean;
  /** Indentation width in spaces (Tab key + auto-indent). */
  indentSize: number;
}

export interface CodeFile {
  name: string;
  content: string;
  readonly?: boolean;
  initialCode?: string;
  /** Segment structure for position-aware readonly enforcement in student editor. */
  segments?: FileSegment[];
}

export type SegmentType = "editable" | "readonly" | "hidden" | "exclude";

export interface FileSegment {
  content: string;
  type: SegmentType;
}

export interface TemplateFile {
  name: string;
  segments: FileSegment[];
}
