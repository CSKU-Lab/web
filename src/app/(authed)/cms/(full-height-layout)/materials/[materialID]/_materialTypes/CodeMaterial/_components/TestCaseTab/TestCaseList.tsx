import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TestCaseItem from "./TestCaseItem";
import {
  selectedTestCaseIdsAtom,
  addTestCaseToGroupAtom,
  moveTestCaseAtom,
} from "../../_stores/testcase-groups.store";
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
  } = useSortable({ id: testCase.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-50" : ""}
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
  const onMoveTestCase = useSetAtom(moveTestCaseAtom);

  const [activeId, setActiveId] = useState<string | null>(null);

  const selectedIds = selectedTestCaseIds[groupId] || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const fromIndex = test_cases.findIndex((tc) => tc.id === activeId);
    const toIndex = test_cases.findIndex((tc) => tc.id === overId);

    if (
      fromIndex !== -1 &&
      toIndex !== -1 &&
      fromIndex !== toIndex
    ) {
      onMoveTestCase({
        groupId,
        fromIndex,
        toIndex,
      });
    }
  };

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={test_cases.map((tc) => tc.id)}
          strategy={verticalListSortingStrategy}
        >
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
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <div className="bg-white border border-gray-4 rounded-md shadow-lg p-3 opacity-80">
              <p className="text-sm text-gray-10">Moving test case...</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      {test_cases.length === 0 && (
        <div className="text-center py-6 text-gray-10 text-sm">
          No test cases in this group. Click "Add Test Case" to create one.
        </div>
      )}
    </div>
  );
}

export default TestCaseList;
