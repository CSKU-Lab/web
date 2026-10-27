"use client";
import {
  EditorView,
  placeholder as placeHolderExtension,
} from "@codemirror/view";
import { basicSetup } from "codemirror";
import { EditorState, type Extension } from "@codemirror/state";
import { indentUnit } from "@codemirror/language";
import { useMemo } from "react";
import { getLangFromExtension } from "./utils/getLang";
import { vim } from "@replit/codemirror-vim";
import readOnlyRangeExtension from "codemirror-readonly-ranges";
import { getReadOnlyRanges } from "./utils/getReadOnlyRanges";
import { highlightExtension } from "./extensions/highlightRanges";
import { githubDarkInit, githubLightInit } from "@uiw/codemirror-theme-github";
import ReactCodeMirror from "@uiw/react-codemirror";
import { createIndentWithTab } from "./extensions/indentWithTab";
import { useTheme } from "next-themes";

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
  /** Indentation width in spaces (Tab key + auto-indent). Defaults to 4. */
  indentSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

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
    indentSize = 4,
    extensions: extraExtensions = [],
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
        ".cm-content, .cm-gutters": {
          fontFamily: "var(--font-mono), monospace",
          fontVariantLigatures: "var(--code-ligatures)",
        },
      }),
    [fontSize],
  );

  const lightSelectionTheme = useMemo(
    () =>
      EditorView.theme({
        ".cm-selectionBackground": { background: "#b3d4ff !important" },
        "&.cm-focused .cm-selectionBackground": { background: "#b3d4ff !important" },
        "::selection": { background: "#b3d4ff" },
        ".cm-activeLine": { backgroundColor: "rgba(0, 0, 0, 0.04) !important" },
      }),
    [],
  );

  const { resolvedTheme: currentTheme } = useTheme();

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

  const customGithubDark = useMemo(
    () =>
      githubDarkInit({
        settings: {
          fontFamily: "var(--font-mono), monospace",
          background: "var(--gray-1)",
          caret: "var(--gray-11)",
          gutterBackground: "var(--gray-2)",
          selection: "var(--gray-4)",
          lineHighlight: "var(--gray-3)",
        },
      }),
    [],
  );
  const customGithubLight = useMemo(
    () =>
      githubLightInit({
        settings: {
          fontFamily: "var(--font-mono), monospace",
          background: "var(--gray-1)",
          caret: "var(--gray-12)",
          gutterBackground: "var(--gray-2)",
          selection: "#b3d4ff",
          lineHighlight: "rgba(0, 0, 0, 0.04)",
        },
      }),
    [],
  );

  return (
    <ReactCodeMirror
      {...others}
      indentWithTab={false}
      theme={currentTheme === "light" ? customGithubLight : customGithubDark}
      extensions={[
        basicSetup,
        theme,
        indentUnit.of(" ".repeat(indentSize)),
        EditorState.tabSize.of(indentSize),
        ...(currentTheme === "light" ? [lightSelectionTheme] : []),
        ...mergedExtensions,
        ...extraExtensions,
        createIndentWithTab(indentSize),
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
