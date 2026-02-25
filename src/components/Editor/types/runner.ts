import { CodeFile } from "./editor";

export interface Runner {
  id: string;
  name: string;
  initial_files: CodeFile[];
}
