export function getLspLang(ext: string): string | null {
  switch (ext.toLowerCase()) {
    case "py":
    case "python":
      return "python";
    case "go":
      return "go";
    case "cpp":
    case "c":
    case "h":
    case "hpp":
      return "cpp";
    case "java":
      return "java";
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    default:
      return null;
  }
}
