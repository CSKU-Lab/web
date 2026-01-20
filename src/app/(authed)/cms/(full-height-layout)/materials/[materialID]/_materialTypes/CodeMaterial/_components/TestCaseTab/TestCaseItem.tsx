import { memo, useState, useEffect } from "react";
import { Trash2, Copy } from "lucide-react";
import { useSetAtom } from "jotai";
import {
  removeTestCaseAtom,
  duplicateTestCaseAtom,
  updateTestCaseAtom,
  toggleTestCaseSelectionAtom,
} from "../../_stores/testcase-groups.store";
import type { TestCase } from "../../_types/testcase-group";
import { Button } from "~/components/commons/Button";

interface TestCaseItemProps {
  testCase: TestCase;
  groupId: string;
  isSelected: boolean;
}

function TestCaseItem({ testCase, groupId, isSelected }: TestCaseItemProps) {
  const [inputValue, setInputValue] = useState(testCase.input);

  const onRemove = useSetAtom(removeTestCaseAtom);
  const onDuplicate = useSetAtom(duplicateTestCaseAtom);
  const onUpdateInput = useSetAtom(updateTestCaseAtom);
  const onToggleSelect = useSetAtom(toggleTestCaseSelectionAtom);

  useEffect(() => {
    setInputValue(testCase.input);
  }, [testCase.input]);

  const handleInputChange = (newInput: string) => {
    setInputValue(newInput);
    onUpdateInput({
      groupId,
      testCaseId: testCase.id,
      input: newInput,
    });
  };

  return (
    <div
      className={`p-2 border rounded-md bg-white transition-all ${
        isSelected ? "ring-2 ring-blue-5 border-blue-5" : "border-gray-4"
      }`}
    >
      <div className="flex justify-between items-center mb-2">
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
              onChange={() =>
                onToggleSelect({ groupId, testCaseId: testCase.id })
              }
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
          <p className="text-sm font-medium text-gray-11">
            Case #{testCase.order}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            onClick={() => onDuplicate({ groupId, testCaseId: testCase.id })}
            className="text-gray-11 hover:text-gray-12"
            title="Duplicate test case"
          >
            <Copy size="1rem" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => onRemove({ groupId, testCaseId: testCase.id })}
            className="text-(--red-11) hover:text-(--red-12) hover:bg-(--red-3)"
            title="Delete test case"
          >
            <Trash2 size="1rem" />
          </Button>
        </div>
      </div>
      <div className="flex gap-2 min-h-[150px]">
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-gray-10 mb-1">Input</p>
          <textarea
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            className="w-full h-full min-h-[120px] p-2 resize-none font-mono text-sm border border-gray-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-5"
            placeholder="Enter input..."
          />
        </div>
        <div className="flex-1 flex flex-col">
          <p className="text-xs text-gray-10 mb-1">Output</p>
          <textarea
            value={testCase.output}
            readOnly
            className="w-full h-full min-h-[120px] p-2 resize-none font-mono text-sm border border-gray-4 rounded-md bg-gray-1 focus:outline-none"
            placeholder="Expected output..."
          />
        </div>
      </div>
    </div>
  );
}

export default memo(TestCaseItem);
