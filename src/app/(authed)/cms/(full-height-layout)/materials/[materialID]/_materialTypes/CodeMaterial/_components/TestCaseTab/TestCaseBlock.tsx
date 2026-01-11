import CodeMirror from "~/components/Editor/CodeMirror";
import type { TestCase } from "../../_types/testcase";
import { Trash, Copy } from "lucide-react";
import {
  removeTestCaseAtom,
  updateTestCaseInputAtom,
  toggleTestCaseSelectionAtom,
} from "../../_stores/testcases.store";
import { useSetAtom } from "jotai";
import { useState } from "react";

export interface TestCaseProps extends TestCase {
  isSelected: boolean;
}

function TestCaseBlock({ order, input, output, isSelected }: TestCaseProps) {
  const onRemove = useSetAtom(removeTestCaseAtom);
  const onUpdateInput = useSetAtom(updateTestCaseInputAtom);
  const onToggleSelect = useSetAtom(toggleTestCaseSelectionAtom);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`p-2 border rounded-md bg-white transition-all ${
        isSelected ? "ring-2 ring-blue-5 border-blue-5" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <label
            className={`flex items-center justify-center w-5 h-5 rounded border cursor-pointer transition-colors ${
              isSelected
                ? "bg-blue-5 border-blue-5 text-white"
                : "border-gray-4 hover:border-gray-6"
            }`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(order)}
              className="sr-only"
            />
            {isSelected && (
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </label>
          <p className="text-sm font-medium">Case #{order}</p>
        </div>
        <div className="flex items-center gap-1">
          {(isHovered || isSelected) && (
            <button
              className="p-1 text-gray-11 hover:text-gray-12 hover:bg-gray-3 rounded transition-colors"
              onClick={() => {
                const newTestCase: TestCase = {
                  order: 0,
                  input,
                  output,
                };
                navigator.clipboard.writeText(
                  JSON.stringify(newTestCase, null, 2),
                );
              }}
              title="Copy test case data"
            >
              <Copy size="1rem" />
            </button>
          )}
          <button
            className="text-(--gray-12) hover:text-(--red-9) hover:bg-(--red-3) rounded p-1 transition-colors"
            onClick={() => onRemove(order)}
          >
            <Trash size="1rem" />
          </button>
        </div>
      </div>
      <div className="flex gap-2 min-h-[200px] mt-1.5">
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
