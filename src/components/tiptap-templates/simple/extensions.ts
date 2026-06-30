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

import { CodeBlock } from "~/components/tiptap-node/code-block-node/code-block-node-extension";

import { createLowlight } from "lowlight";
import go from "highlight.js/lib/languages/go";
import c from "highlight.js/lib/languages/c";
import python from "highlight.js/lib/languages/python";
import javascript from "highlight.js/lib/languages/javascript";
import cpp from "highlight.js/lib/languages/cpp";
import plaintext from "highlight.js/lib/languages/plaintext";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import { MathInlineNode, MathBlockNode } from "~/components/tiptap-node/math-node"
import { CodeMaterialEmbedNode } from "~/components/tiptap-node/code-material-embed-node/code-material-embed-node-extension"

export const extensions = () => {
  const lowlight = createLowlight();

  lowlight.register("go", go);
  lowlight.register("c", c);
  lowlight.register("python", python);
  lowlight.register("py", python);
  lowlight.register("javascript", javascript);
  lowlight.register("js", javascript);
  lowlight.register("cpp", cpp);
  lowlight.register("c++", cpp);
  // Register plaintext so the "Plain text" option highlights nothing instead
  // of falling back to lowlight.highlightAuto (which colors it like code).
  lowlight.register("plaintext", plaintext);
  // Mermaid has no lowlight grammar; alias it to plaintext so the editable
  // source stays uncolored instead of falling back to highlightAuto. The
  // node view renders the diagram from this source in preview mode.
  lowlight.register("mermaid", plaintext);
  return [
    StarterKit.configure({
      codeBlock: false,
      horizontalRule: false,
      // Disable spellcheck squiggles inside inline code.
      code: {
        HTMLAttributes: { spellcheck: "false" },
      },
      link: {
        openOnClick: false,
        enableClickSelection: true,
      },
    }),

    CodeBlock.configure({
      languageClassPrefix: "language-",
      enableTabIndentation: true,
      defaultLanguage: "plaintext",
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
    TableKit.configure({
      table: { resizable: true },
    }),
    MathInlineNode,
    MathBlockNode,
    CodeMaterialEmbedNode,
  ];
};

export const ext = extensions();
