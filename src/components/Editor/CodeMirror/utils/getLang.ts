import { python } from "@codemirror/lang-python";
import { go } from "@codemirror/lang-go";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { LanguageSupport, StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";

const shellLanguage = () => new LanguageSupport(StreamLanguage.define(shell));

export const getLangFromExtension = (ext: string): LanguageSupport | null => {
  switch (ext.toLowerCase()) {
    case "py":
    case "python":
      return python();
    case "go":
      return go();
    case "cpp":
    case "c":
    case "h":
    case "hpp":
      return cpp();
    case "java":
      return java();
    case "js":
    case "jsx":
      return javascript();
    case "ts":
    case "tsx":
      return javascript({ typescript: true });
    case "sh":
    case "bash":
      return shellLanguage();
    default:
      return null;
  }
};
