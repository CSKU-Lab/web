import { useState, useEffect, useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { isOwnerAtom } from "~/features/cms/materials/types/CodeMaterial/stores/owner.store";
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
  defaultDropAnimationSideEffects,
  DragOverlayProps,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckSquare, Square, Trash2, Copy } from "lucide-react";
import GroupHeader from "~/features/cms/materials/types/CodeMaterial/components/TestCaseTab/GroupHeader";
import TestCaseList from "~/features/cms/materials/types/CodeMaterial/components/TestCaseTab/TestCaseList";
import AddGroupButton from "~/features/cms/materials/types/CodeMaterial/components/TestCaseTab/AddGroupButton";
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
} from "~/features/cms/materials/types/CodeMaterial/stores/testcase-groups.store";
import { Button } from "~/components/commons/Button";
import type { TestCaseGroup } from "~/features/cms/materials/types/CodeMaterial/types/testcase-group";

interface SortableGroupCardProps {
  group: TestCaseGroup;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isSelected: boolean;
  isOwner: boolean;
}

function SortableGroupCard({
  group,
  isExpanded,
  onToggleExpand,
  isSelected,
  isOwner,
}: SortableGroupCardProps) {
  const { setNodeRef, transform, transition, isDragging, isOver, attributes, listeners } = useSortable({
    id: `group-${group.id}`,
    transition: {
      duration: 300,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  };

  const dragHandleProps = { ...attributes, ...listeners };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-2 rounded-md bg-(--gray-1) mb-4 transition-all duration-300 ${
        isDragging 
          ? "shadow-xl opacity-60 border-blue-400 scale-[1.01]" 
          : isOver
            ? "border-blue-400 shadow-lg bg-blue-50/30"
            : "border-gray-4"
      }`}
    >
      <GroupHeader
        group={group}
        isSelected={isSelected}
        isExpanded={isExpanded}
        onToggleExpand={onToggleExpand}
        isOwner={isOwner}
        dragHandleProps={dragHandleProps}
      />
      {isExpanded && (
        <TestCaseList groupId={group.id} test_cases={group.test_cases} isOwner={isOwner} />
      )}
    </div>
  );
}

function TestCaseTab() {
  const testCaseGroups = useAtomValue(testCaseGroupsAtom);
  const selectedGroupIds = useAtomValue(selectedGroupIdsAtom);
  const selectedTestCaseIds = useAtomValue(selectedTestCaseIdsAtom);
  const isOwner = useAtomValue(isOwnerAtom);

  // Sort groups by order field
  const sortedTestCaseGroups = useMemo(() => {
    return [...testCaseGroups].sort((a, b) => a.order - b.order);
  }, [testCaseGroups]);

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

  const dropAnimation: DragOverlayProps["dropAnimation"] = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  // Build the list of all sortable items (groups and test cases)
  // Always include all items to prevent SortableContext from re-calculating
  // when groups expand/collapse, which can interfere with scroll behavior
  const allSortableItems = sortedTestCaseGroups.flatMap((group) => {
    const items = [`group-${group.id}`];
    items.push(...group.test_cases.map((tc) => `testcase-${tc.id}`));
    return items;
  });

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

    if (activeId === overId) return;

    const isActiveGroup = activeId.startsWith("group-");
    const isActiveTestCase = activeId.startsWith("testcase-");
    const isOverGroup = overId.startsWith("group-");
    const isOverTestCase = overId.startsWith("testcase-");

    if (isActiveGroup && isOverGroup) {
      // Dragging a group onto another group - reorder groups
      const activeGroupId = activeId.replace("group-", "");
      const overGroupId = overId.replace("group-", "");
      const fromIndex = sortedTestCaseGroups.findIndex((g) => g.id === activeGroupId);
      const toIndex = sortedTestCaseGroups.findIndex((g) => g.id === overGroupId);
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        onMoveGroup({ fromIndex, toIndex });
      }
    } else if (isActiveTestCase) {
      // Dragging a test case
      const activeTestCaseId = activeId.replace("testcase-", "");
      
      // Find the source group
      const fromGroup = sortedTestCaseGroups.find((g) =>
        g.test_cases.some((tc) => tc.id === activeTestCaseId),
      );
      
      if (!fromGroup) return;

      if (isOverTestCase) {
        // Dragging test case onto another test case
        const overTestCaseId = overId.replace("testcase-", "");
        const toGroup = sortedTestCaseGroups.find((g) =>
          g.test_cases.some((tc) => tc.id === overTestCaseId),
        );

        if (fromGroup && toGroup) {
          if (fromGroup.id === toGroup.id) {
            // Reorder within the same group
            const fromIndex = fromGroup.test_cases.findIndex(
              (tc) => tc.id === activeTestCaseId,
            );
            const toIndex = toGroup.test_cases.findIndex(
              (tc) => tc.id === overTestCaseId,
            );
            if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
              onMoveTestCase({
                groupId: fromGroup.id,
                fromIndex,
                toIndex,
              });
            }
          } else {
            // Move test case to a different group
            const fromTestCase = fromGroup.test_cases.find(
              (tc) => tc.id === activeTestCaseId,
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
      } else if (isOverGroup) {
        // Dragging test case onto a group
        const overGroupId = overId.replace("group-", "");
        const toGroup = sortedTestCaseGroups.find((g) => g.id === overGroupId);
        
        if (fromGroup && toGroup && fromGroup.id !== toGroup.id) {
          const fromTestCase = fromGroup.test_cases.find(
            (tc) => tc.id === activeTestCaseId,
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
    sortedTestCaseGroups.length > 0 &&
    selectedGroupIds.length === sortedTestCaseGroups.length;

  // Helper to get drag overlay content
  const getDragOverlayContent = () => {
    if (!activeId) return null;
    
    if (activeId.startsWith("group-")) {
      const groupId = activeId.replace("group-", "");
      const group = sortedTestCaseGroups.find((g) => g.id === groupId);
      return (
        <div className="bg-(--gray-1) border-2 border-blue-400 rounded-lg shadow-2xl p-4 rotate-2">
          <p className="text-sm font-semibold text-gray-900">{group?.name ?? "Group"}</p>
          <p className="text-xs text-gray-500 mt-1">{group?.test_cases?.length ?? 0} test cases</p>
        </div>
      );
    } else if (activeId.startsWith("testcase-")) {
      return (
        <div className="bg-(--gray-1) border-2 border-blue-400 rounded-lg shadow-2xl p-4 rotate-1 scale-105">
          <p className="text-sm font-medium text-gray-900">Test Case</p>
          <p className="text-xs text-blue-500 mt-1">Drop to move</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-2 h-full overflow-y-auto">
      {!isMounted ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border border-gray-4 rounded-md bg-(--gray-1) p-3 animate-pulse"
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
        <>
          <div className="flex justify-between items-center gap-2 flex-wrap mb-4">
            <div className="flex items-center gap-2">
              {isOwner && sortedTestCaseGroups.length > 0 && (
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
              {isOwner && totalSelectedCount > 0 && (
                <span className="text-sm text-gray-10">
                  {totalSelectedCount} selected
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isOwner && totalSelectedCount > 0 && (
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
              {isOwner && <AddGroupButton />}
            </div>
          </div>

          <div className="relative">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              autoScroll={{ threshold: { x: 0.2, y: 0.2 }, canScroll: () => true }}
              measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
            >
              <SortableContext
                items={allSortableItems}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                {sortedTestCaseGroups.map((group) => (
                  <SortableGroupCard
                    key={group.id}
                    group={group}
                    isExpanded={expandedGroupIds.has(group.id)}
                    onToggleExpand={() => toggleExpand(group.id)}
                    isSelected={selectedGroupIds.includes(group.id)}
                    isOwner={isOwner}
                  />
                ))}
              </div>
            </SortableContext>

            {sortedTestCaseGroups.length === 0 && (
              <div className="text-center py-12 text-gray-10">
                <p>No test case groups yet</p>
                <p className="text-sm mt-1">
                  Click &ldquo;Add Group&rdquo; to create your first test case
                  group
                </p>
              </div>
            )}

              <DragOverlay dropAnimation={dropAnimation}>
                {getDragOverlayContent()}
              </DragOverlay>
            </DndContext>
          </div>
        </>
      )}
    </div>
  );
}

export default TestCaseTab;
