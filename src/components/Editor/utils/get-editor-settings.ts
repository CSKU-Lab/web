import { IEditorSettings } from "../types/editor";

export const getEditorSettings = () => {
  if (typeof window !== "undefined") {
    const settings = localStorage.getItem("editor-settings");
    if (settings) {
      try {
        return JSON.parse(settings) as IEditorSettings;
      } catch {}
    }
  }
  return {
    fontSize: 14,
    vimMode: false,
  };
};
