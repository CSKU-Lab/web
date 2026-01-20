import { useState, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquare, Square, Trash2, Copy } from "lucide-react";
import GroupHeader from "./GroupHeader";
import TestCaseList from "./TestCaseList";
import AddGroupButton from "./AddGroupButton";
import {
  testCaseGroupsAtom,
  selectedGroupIdsAtom,
  selectedTestCaseIdsAtom,
  removeSelectedGroupsAtom,
  removeSelectedTestCasesAtom,
  duplicateSelectedTestCasesAtom,
  moveGroupAtom,
  moveTestCaseAtom,
  moveTestCaseToGroupAtom,
  selectAllGroupsAtom,
  deselectAllGroupsAtom,
} from "../../_stores/testcase-groups.store";
import { Button } from "~/components/commons/Button";
import type { TestCaseGroup } from "../../_types/testcase-group";

interface SortableGroupCardProps {
  group: TestCaseGroup;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isSelected: boolean;
}

function SortableGroupCard({
  group,
  isExpanded,
  onToggleExpand,
  isSelected,
}: SortableGroupCardProps) {
  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-gray-4 rounded-md bg-white mb-4 transition-shadow ${
        isDragging ? "shadow-lg opacity-50" : ""
      }`}
    >
      <GroupHeader
        group={group}
        isSelected={isSelected}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
      />
      {isExpanded && (
        <TestCaseList groupId={group.id} test_cases={group.test_cases} />
      )}
    </div>
  );
}

function TestCaseTab() {
  const testCaseGroups = useAtomValue(testCaseGroupsAtom);
  const selectedGroupIds = useAtomValue(selectedGroupIdsAtom);
  const selectedTestCaseIds = useAtomValue(selectedTestCaseIdsAtom);

  const [isMounted, setIsMounted] = useState(false);
  const [expandedGroupIds, setExpandedGroupIds] = useState<Set<string>>(
    new Set(),
  );
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const onRemoveSelectedGroups = useSetAtom(removeSelectedGroupsAtom);
  const onRemoveSelectedTestCases = useSetAtom(removeSelectedTestCasesAtom);
  const onDuplicateSelectedTestCases = useSetAtom(
    duplicateSelectedTestCasesAtom,
  );
  const onMoveGroup = useSetAtom(moveGroupAtom);
  const onMoveTestCase = useSetAtom(moveTestCaseAtom);
  const onMoveTestCaseToGroup = useSetAtom(moveTestCaseToGroupAtom);
  const onSelectAllGroups = useSetAtom(selectAllGroupsAtom);
  const onDeselectAllGroups = useSetAtom(deselectAllGroupsAtom);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const toggleExpand = (groupId: string) => {
    setExpandedGroupIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isGroup = testCaseGroups.some((g) => g.id === activeId);
    const isTestCase = testCaseGroups.some((g) =>
      g.test_cases.some((tc) => tc.id === activeId),
    );

    if (isGroup) {
      const fromIndex = testCaseGroups.findIndex((g) => g.id === activeId);
      const toIndex = testCaseGroups.findIndex((g) => g.id === overId);
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        onMoveGroup({ fromIndex, toIndex });
      }
    } else if (isTestCase) {
      const fromGroup = testCaseGroups.find((g) =>
        g.test_cases.some((tc) => tc.id === activeId),
      );
      const toGroup = testCaseGroups.find((g) => g.id === overId);
      const overTestCase = testCaseGroups
        .flatMap((g) => g.test_cases)
        .find((tc) => tc.id === overId);

      if (fromGroup && toGroup) {
        if (fromGroup.id === toGroup.id && overTestCase) {
          const fromIndex = fromGroup.test_cases.findIndex(
            (tc) => tc.id === activeId,
          );
          const toIndex = fromGroup.test_cases.findIndex(
            (tc) => tc.id === overId,
          );
          if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
            onMoveTestCase({
              groupId: fromGroup.id,
              fromIndex,
              toIndex,
            });
          }
        } else if (fromGroup.id !== toGroup.id) {
          const fromTestCase = fromGroup.test_cases.find(
            (tc) => tc.id === activeId,
          );
          if (fromTestCase) {
            onMoveTestCaseToGroup({
              fromGroupId: fromGroup.id,
              toGroupId: toGroup.id,
              testCaseId: fromTestCase.id,
            });
          }
        }
      }
    }
  };

  const totalSelectedCount =
    selectedGroupIds.length +
    Object.values(selectedTestCaseIds).reduce(
      (sum, ids) => sum + ids.length,
      0,
    );

  const isAllGroupsSelected =
    testCaseGroups.length > 0 &&
    selectedGroupIds.length === testCaseGroups.length;

  return (
    <div className="p-2">
      {!isMounted ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-gray-4 rounded-md bg-white p-3 animate-pulse"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-5 h-5 bg-gray-2 rounded" />
                <div className="w-32 h-4 bg-gray-2 rounded" />
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-32 bg-gray-2 rounded" />
                <div className="flex-1 h-32 bg-gray-2 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex justify-between items-center gap-2 flex-wrap mb-4">
            <div className="flex items-center gap-2">
              {testCaseGroups.length > 0 && (
                <button
                  onClick={
                    isAllGroupsSelected
                      ? onDeselectAllGroups
                      : onSelectAllGroups
                  }
                  className="flex items-center gap-1.5 text-sm text-gray-11 hover:text-gray-12 transition-colors"
                >
                  {isAllGroupsSelected ? (
                    <>
                      <CheckSquare size="1rem" />
                      Deselect all
                    </>
                  ) : (
                    <>
                      <Square size="1rem" />
                      Select all
                    </>
                  )}
                </button>
              )}
              {totalSelectedCount > 0 && (
                <span className="text-sm text-gray-10">
                  {totalSelectedCount} selected
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {totalSelectedCount > 0 && (
                <>
                  <Button
                    variant="ghost"
                    onClick={onRemoveSelectedTestCases}
                    disabled={Object.keys(selectedTestCaseIds).length === 0}
                  >
                    <Trash2 size="1rem" />
                    Delete Test Cases
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onDuplicateSelectedTestCases}
                    disabled={Object.keys(selectedTestCaseIds).length === 0}
                  >
                    <Copy size="1rem" />
                    Duplicate Test Cases
                  </Button>
                  {selectedGroupIds.length > 0 && (
                    <>
                      <div className="w-px h-6 bg-gray-4 mx-1" />
                      <Button variant="danger" onClick={onRemoveSelectedGroups}>
                        <Trash2 size="1rem" />
                        Delete Groups
                      </Button>
                    </>
                  )}
                  <div className="w-px h-6 bg-gray-4 mx-1" />
                </>
              )}
              <AddGroupButton />
            </div>
          </div>

          <SortableContext
            items={testCaseGroups.map((g) => g.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {testCaseGroups.map((group) => (
                <SortableGroupCard
                  key={group.id}
                  group={group}
                  isExpanded={expandedGroupIds.has(group.id)}
                  onToggleExpand={() => toggleExpand(group.id)}
                  isSelected={selectedGroupIds.includes(group.id)}
                />
              ))}
            </div>
          </SortableContext>

          {testCaseGroups.length === 0 && (
            <div className="text-center py-12 text-gray-10">
              <p>No test case groups yet</p>
              <p className="text-sm mt-1">
                Click &ldquo;Add Group&rdquo; to create your first test case
                group
              </p>
            </div>
          )}

          <DragOverlay>
            {activeId ? (
              <div className="bg-white border border-gray-4 rounded-md shadow-lg p-3 opacity-80">
                {testCaseGroups.some((g) => g.id === activeId) ? (
                  <p className="text-sm font-medium">
                    {testCaseGroups.find((g) => g.id === activeId)?.name}
                  </p>
                ) : (
                  <p className="text-sm text-gray-10">Moving test case...</p>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

export default TestCaseTab;
