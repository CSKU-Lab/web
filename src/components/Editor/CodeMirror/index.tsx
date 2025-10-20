"use client";
import {
  EditorView,
  placeholder as placeHolderExtension,
} from "@codemirror/view";
import { basicSetup } from "codemirror";
import { EditorState, type Extension } from "@codemirror/state";
import { useMemo } from "react";
import { getLang } from "./utils/getLang";
import { vim } from "@replit/codemirror-vim";
import readOnlyRangeExtension from "codemirror-readonly-ranges";
import { getReadOnlyRanges } from "./utils/getReadOnlyRanges";
import { highlightExtension } from "./extensions/highlightRanges";
import { githubLight } from "@uiw/codemirror-theme-github";
import ReactCodeMirror from "@uiw/react-codemirror";

interface CodeMirrorProps {
  value?: string;
  onChange?: (value: string) => void;
  lang?: string;
  vimMode?: boolean;
  initialCode?: string;
  extensions?: Extension[];
  editable?: boolean;
  readOnly?: boolean;
  placeholder?: string;
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
    lang,
    vimMode,
    editable = true,
    readOnly = false,
    initialCode = "",
    placeholder,
    ...others
  } = props;

  const mergedExtensions = useMemo(
    () =>
      Object.values({
        lang: lang ? getLang(lang) : null,
        vimMode: vimMode ? vim() : null,
        readOnlyRange: readOnlyRangeExtension((state) =>
          getReadOnlyRanges(state, initialCode),
        ),
        highlightRanges: highlightExtension((state) =>
          getReadOnlyRanges(state, initialCode),
        ),
        placeholder: placeHolderExtension(placeholder || "Start typing..."),
      }).filter((ext) => ext !== null),
    [lang, vimMode, initialCode, placeholder],
  );

  return (
    <ReactCodeMirror
      {...others}
      extensions={[
        basicSetup,
        theme,
        githubLight,
        ...mergedExtensions,
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
