import CodeMirror from "~/components/Editor/CodeMirror";
import type { TestCase } from "../../_types/testcase";
import { Trash } from "lucide-react";
import {
  removeTestCaseAtom,
  updateTestCaseInputAtom,
} from "../../_stores/testcases.store";
import { useSetAtom } from "jotai";

function TestCaseBlock({ order, input, output }: TestCase) {
  const onRemove = useSetAtom(removeTestCaseAtom);
  const onUpdateInput = useSetAtom(updateTestCaseInputAtom);

  return (
    <div className="p-2 border rounded-md bg-white">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">Case #{order}</p>
        <button
          className="text-(--gray-12) hover:text-(--red-9)"
          onClick={() => onRemove(order)}
        >
          <Trash size="1rem" />
        </button>
      </div>
      <div className="flex gap-2 h-50 mt-1.5">
        <div className="flex-1 flex flex-col">
          <p className="text-xs">Input</p>
          <CodeMirror
            value={input}
            onChange={(newInput) => onUpdateInput({ order, newInput })}
            className="border mt-1 rounded-md overflow-hidden flex-1 relative"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <p className="text-xs">Output</p>
          <CodeMirror
            value={output}
            className="border mt-1 rounded-md overflow-hidden flex-1"
            readOnly
          />
        </div>
      </div>
    </div>
  );
}

export default TestCaseBlock;
