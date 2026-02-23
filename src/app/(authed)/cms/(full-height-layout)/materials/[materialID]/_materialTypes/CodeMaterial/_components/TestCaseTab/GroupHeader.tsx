import { GripVertical, Trash2, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useSetAtom } from "jotai";
import {
  removeGroupAtom,
  duplicateGroupAtom,
  updateGroupAtom,
  toggleGroupSelectionAtom,
  selectedGroupIdsAtom,
} from "../../_stores/testcase-groups.store";
import type { TestCaseGroup } from "../../_types/testcase-group";
import { Button } from "~/components/commons/Button";
import Input from "~/components/commons/Input";

interface GroupHeaderProps {
  group: TestCaseGroup;
  isSelected: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isOwner: boolean;
  dragHandleProps?: Record<string, unknown>;
}

function GroupHeader({
  group,
  isSelected,
  isExpanded,
  onToggleExpand,
  isOwner,
  dragHandleProps,
}: GroupHeaderProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(group.name);

  const onRemove = useSetAtom(removeGroupAtom);
  const onDuplicate = useSetAtom(duplicateGroupAtom);
  const onUpdateGroup = useSetAtom(updateGroupAtom);
  const onToggleSelect = useSetAtom(toggleGroupSelectionAtom);
  const selectedGroupIds = useSetAtom(selectedGroupIdsAtom);

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (nameValue.trim() && nameValue !== group.name) {
      onUpdateGroup({ groupId: group.id, name: nameValue.trim() });
    } else {
      setNameValue(group.name);
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameBlur();
    } else if (e.key === "Escape") {
      setIsEditingName(false);
      setNameValue(group.name);
    }
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onUpdateGroup({ groupId: group.id, score: numValue });
    }
  };

  const isAllSelected = group.test_cases.length > 0;

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-2 border-b rounded-t-md">
      {isOwner && (
        <button
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-gray-11 hover:text-gray-12"
        >
          <GripVertical size="1.25rem" />
        </button>
      )}

      {isOwner && (
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
            onChange={() => onToggleSelect(group.id)}
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
      )}

      <button
        onClick={onToggleExpand}
        className="text-gray-11 hover:text-gray-12 transition-colors"
      >
        {isExpanded ? <ChevronUp size="1.25rem" /> : <ChevronDown size="1.25rem" />}
      </button>

      {isOwner && isEditingName ? (
        <input
          type="text"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onBlur={handleNameBlur}
          onKeyDown={handleNameKeyDown}
          className="flex-1 px-2 py-1 text-sm font-medium border rounded bg-(--gray-1) focus:outline-none focus:ring-2 focus:ring-blue-5"
          autoFocus
        />
      ) : (
        <button
          onClick={() => isOwner && setIsEditingName(true)}
          className={`flex-1 text-left px-2 py-1 text-sm font-medium rounded transition-colors ${isOwner ? "hover:bg-gray-3" : "cursor-default"}`}
        >
          {group.name}
        </button>
      )}

      <div className="flex items-center gap-1.5 ml-2">
        <span className="text-xs text-gray-10">Score:</span>
        <Input
          type="number"
          min={0}
          value={group.score}
          onChange={handleScoreChange}
          className="w-20 h-8 text-sm"
          disabled={!isOwner}
        />
      </div>

      {isOwner && (
        <div className="flex items-center gap-1">
          <Button variant="ghost" onClick={() => onDuplicate(group.id)}>
            <Copy size="1rem" />
          </Button>
          <Button
            variant="ghost"
            onClick={() => onRemove(group.id)}
            className="text-(--red-11) hover:text-(--red-12) hover:bg-(--red-3)"
          >
            <Trash2 size="1rem" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default GroupHeader;
