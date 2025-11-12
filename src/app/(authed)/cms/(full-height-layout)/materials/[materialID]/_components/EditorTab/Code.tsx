import { useAtom } from "jotai";
import CodeMirror from "~/components/Editor/CodeMirror";
import { codeStore } from "../../_stores/editor.store";
import RunnerSelect from "./RunnerSelect";

function Code() {
  const [code, setCode] = useAtom(codeStore);
  return (
    <div className="flex-1 min-h-0 flex relative">
      <RunnerSelect />
      <div className="flex-1 min-h-0 overflow-auto">
        <CodeMirror
          className="h-full"
          lang="go"
          vimMode
          value={code}
          onChange={setCode}
        />
      </div>
    </div>
  );
}

export default Code;
