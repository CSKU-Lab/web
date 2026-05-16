import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import { TableKit } from "@tiptap/extension-table";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

import { createLowlight } from "lowlight";
import go from "highlight.js/lib/languages/go";
import c from "highlight.js/lib/languages/c";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";
import cpp from "highlight.js/lib/languages/cpp";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import { MathInlineNode, MathBlockNode } from "~/components/tiptap-node/math-node"

export const extensions = () => {
  const lowlight = createLowlight();

  lowlight.register("go", go);
  lowlight.register("c", c);
  lowlight.register("python", python);
  lowlight.register("javascript", javascript);
  lowlight.register("js", javascript);
  lowlight.register("cpp", cpp);
  lowlight.register("c++", cpp);
  return [
    StarterKit.configure({
      codeBlock: false,
      horizontalRule: false,
      link: {
        openOnClick: false,
        enableClickSelection: true,
      },
    }),

    CodeBlockLowlight.configure({
      languageClassPrefix: "language-",
      enableTabIndentation: true,
      lowlight,
    }),
    HorizontalRule,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Highlight.configure({ multicolor: true }),
    Image,
    Typography,
    Superscript,
    Subscript,
    Selection,
    TableKit,
    MathInlineNode,
    MathBlockNode,
  ];
};

export const ext = extensions();
