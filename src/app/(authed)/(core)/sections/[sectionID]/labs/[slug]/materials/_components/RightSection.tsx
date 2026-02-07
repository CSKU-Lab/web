"use client";

import { useCallback, useState } from "react";
import CodeEditor from "~/components/Editor/CodeEditor";
import { configService } from "~/services/config.service";
import type { CodeFile } from "~/types/code-material";

function RightSection() {
  const [files, setFiles] = useState<CodeFile[]>([
    {
      name: "main.py",
      content: "# Write your code here\nprint('Hello, World!')\n",
    },
  ]);
  const queryRunners = useCallback(() => configService.getRunners(), []);

  return (
    <div className="flex-1 border-t-0 border-l-0 border flex flex-col min-h-0 min-w-[300px] overflow-hidden">
      <div className="flex-1 min-h-0 overflow-auto flex flex-col">
        <CodeEditor
          files={files}
          onFilesChange={setFiles}
          permissions={{
            writeFiles: true,
            modifyFiles: false,
          }}
          queryRunnerFn={queryRunners}
        />
      </div>
    </div>
  );
}

export default RightSection;
