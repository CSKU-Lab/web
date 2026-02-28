import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import { createLowlight } from "lowlight";
import go from "highlight.js/lib/languages/go";
import c from "highlight.js/lib/languages/c";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";
import cpp from "highlight.js/lib/languages/cpp";

export function createCodeBlockExt() {
  const lowlight = createLowlight();

  lowlight.register("go", go);
  lowlight.register("c", c);
  lowlight.register("python", python);
  lowlight.register("javascript", javascript);
  lowlight.register("js", javascript);
  lowlight.register("cpp", cpp);
  lowlight.register("c++", cpp);

  return [
    CodeBlockLowlight.configure({
      languageClassPrefix: "language-",
      enableTabIndentation: true,
      lowlight,
    }),
  ];
}
