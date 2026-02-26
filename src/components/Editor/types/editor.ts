export interface IEditorSettings {
  fontSize: number;
  vimMode: boolean;
}

export interface CodeFile {
  name: string;
  content: string;
  required: boolean;
}
