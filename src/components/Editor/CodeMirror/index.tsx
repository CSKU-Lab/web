"use client";
import {
  EditorView,
  placeholder as placeHolderExtension,
} from "@codemirror/view";
import { basicSetup } from "codemirror";
import { EditorState, type Extension } from "@codemirror/state";
import { useEffect, useMemo, useRef } from "react";
import { getLang } from "./utils/getLang";
import { vim } from "@replit/codemirror-vim";
import readOnlyRangeExtension from "codemirror-readonly-ranges";
import { getReadOnlyRanges } from "./utils/getReadOnlyRanges";
import { highlightExtension } from "./extensions/highlightRanges";
import { githubLight } from "@uiw/codemirror-theme-github";

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
    value = "",
    onChange,
    lang,
    vimMode,
    extensions = [],
    editable = true,
    readOnly = false,
    className = "",
    style,
    initialCode = "",
    placeholder,
  } = props;

  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

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

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: "",
      extensions: [
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
      ],
    });

    const view = new EditorView({
      state: state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [onChange, editable, readOnly, mergedExtensions]);

  useEffect(() => {
    if (viewRef.current) {
      if (viewRef.current.state.doc.toString() === value) return;

      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  return <div ref={editorRef} className={className} {...{ style }} />;
}

export default CodeMirror;
