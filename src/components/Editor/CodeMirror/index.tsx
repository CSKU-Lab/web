"use client";
import {
  EditorView,
  placeholder as placeHolderExtension,
} from "@codemirror/view";
import { basicSetup } from "codemirror";
import { EditorState, type Extension } from "@codemirror/state";
import { useMemo } from "react";
import { getLangFromExtension } from "./utils/getLang";
import { vim } from "@replit/codemirror-vim";
import readOnlyRangeExtension from "codemirror-readonly-ranges";
import { getReadOnlyRanges } from "./utils/getReadOnlyRanges";
import { highlightExtension } from "./extensions/highlightRanges";
import { githubLight } from "@uiw/codemirror-theme-github";
import ReactCodeMirror from "@uiw/react-codemirror";
import { indentWithTab } from "./extensions/indentWithTab";

interface CodeMirrorProps {
  value?: string;
  onChange?: (value: string) => void;
  extension?: string;
  vimMode?: boolean;
  initialCode?: string;
  extensions?: Extension[];
  editable?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  fontSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

const theme = EditorView.theme({
  "&": {
    height: "100%",
  },
});

function CodeMirror(props: CodeMirrorProps) {
  const {
    onChange,
    extension,
    vimMode,
    editable = true,
    readOnly = false,
    initialCode = "",
    placeholder,
    fontSize = 14,
    ...others
  } = props;

  const langExtension = extension ? getLangFromExtension(extension) : null;

  const theme = useMemo(
    () =>
      EditorView.theme({
        "&": {
          height: "100%",
          fontSize: `${fontSize}px`,
        },
      }),
    [fontSize],
  );

  const mergedExtensions = useMemo(
    () =>
      Object.values({
        lang: langExtension,
        vimMode: vimMode ? vim() : null,
        readOnlyRange: readOnlyRangeExtension((state) =>
          getReadOnlyRanges(state, initialCode),
        ),
        highlightRanges: highlightExtension((state) =>
          getReadOnlyRanges(state, initialCode),
        ),
        placeholder: placeHolderExtension(placeholder || "Start typing..."),
      }).filter((ext) => ext !== null),
    [langExtension, vimMode, initialCode, placeholder],
  );

  return (
    <ReactCodeMirror
      {...others}
      indentWithTab={false}
      extensions={[
        basicSetup,
        theme,
        githubLight,
        ...mergedExtensions,
        indentWithTab,
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorState.readOnly.of(readOnly || !editable),
      ]}
    />
  );
}

export default CodeMirror;
