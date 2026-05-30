"use client";
import { useAtomValue, useSetAtom } from "jotai";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TestCaseItem from "~/features/cms/materials/types/CodeMaterial/components/TestCaseTab/TestCaseItem";
import {
  selectedTestCaseIdsAtom,
  addTestCaseToGroupAtom,
} from "~/features/cms/materials/types/CodeMaterial/stores/testcase-groups.store";
import { Button } from "~/components/commons/Button";
import { Plus } from "lucide-react";

interface TestCaseListProps {
  groupId: string;
  test_cases: Array<{
    id: string;
    order: number;
    input: string;
    output: string;
    isHidden?: boolean;
  }>;
  isOwner: boolean;
}

interface SortableTestCaseItemProps {
  testCase: {
    id: string;
    order: number;
    input: string;
    output: string;
    isHidden?: boolean;
  };
  groupId: string;
  isSelected: boolean;
  isOwner: boolean;
}

function SortableTestCaseItem({
  testCase,
  groupId,
  isSelected,
  isOwner,
}: SortableTestCaseItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ 
    id: `testcase-${testCase.id}`,
    transition: {
      duration: 250,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`transition-all duration-250 ${
        isDragging ? "opacity-50 scale-[1.02]" : ""
      } ${isOver ? "ring-2 ring-blue-400 ring-inset" : ""}`}
    >
      <div className="flex items-start gap-1">
        {isOwner && (
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-11 hover:text-gray-12 mt-2"
          >
          <svg
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="3" cy="4" r="1.5" fill="currentColor" />
            <circle cx="9" cy="4" r="1.5" fill="currentColor" />
            <circle cx="3" cy="10" r="1.5" fill="currentColor" />
            <circle cx="9" cy="10" r="1.5" fill="currentColor" />
            <circle cx="3" cy="16" r="1.5" fill="currentColor" />
            <circle cx="9" cy="16" r="1.5" fill="currentColor" />
          </svg>
        </button>
        )}
        <div className="flex-1">
          <TestCaseItem
            testCase={testCase}
            groupId={groupId}
            isSelected={isSelected}
            isOwner={isOwner}
          />
        </div>
      </div>
    </div>
  );
}

function TestCaseList({ groupId, test_cases, isOwner }: TestCaseListProps) {
  const selectedTestCaseIds = useAtomValue(selectedTestCaseIdsAtom);
  const onAddTestCase = useSetAtom(addTestCaseToGroupAtom);

  const selectedIds = selectedTestCaseIds[groupId] || [];

  const handleAddTestCase = () => {
    onAddTestCase(groupId);
  };

  return (
    <div className="p-3 bg-gray-1 border-b rounded-b-md">
      {isOwner && (
        <div className="mb-3">
          <Button variant="ghost" onClick={handleAddTestCase}>
            <Plus size="1rem" />
            Add Test Case
          </Button>
        </div>
      )}
      <div className="space-y-3">
        {test_cases.map((testCase) => (
          <SortableTestCaseItem
            key={testCase.id}
            testCase={testCase}
            groupId={groupId}
            isSelected={selectedIds.includes(testCase.id)}
            isOwner={isOwner}
          />
        ))}
      </div>
      {test_cases.length === 0 && (
        <div className="text-center py-6 text-gray-10 text-sm">
          No test cases in this group. Click &ldquo;Add Test Case&rdquo; to create one.
        </div>
      )}
    </div>
  );
}

export default TestCaseList;
