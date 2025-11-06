"use client";

import CodeMirror from "~/components/Editor/CodeMirror";
import CodeHeader from "../CodeHeader";
import useEditor from "../hooks/useEditor";
import { useEffect } from "react";
import Playground from "../Playground";

interface Props {
  problemId: string;
}
function CodeBlock({ problemId }: Props) {
  const {
    setup,
    fontSize,
    code,
    setCode,
    selectedLanguage,
    vimMode,
    initialCode,
  } = useEditor();

  useEffect(() => {
    setup({ allowLanguages: { python: "python" }, problemId });
  }, [setup, problemId]);

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <CodeHeader />
        <div className="h-64">
          <CodeMirror
            style={{ fontSize }}
            lang={selectedLanguage}
            value={code}
            onChange={setCode}
            vimMode={vimMode}
            {...{ initialCode }}
          />
        </div>
      </div>
      <Playground className="mt-2 h-64 max-h-72 not-prose" />
    </>
  );
}

export default CodeBlock;
