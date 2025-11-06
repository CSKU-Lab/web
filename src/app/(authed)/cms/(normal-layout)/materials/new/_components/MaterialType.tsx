import { type JSX, cloneElement } from "react";
import { cn } from "~/lib/tiptap-utils";

interface Props {
  icon: JSX.Element;
  name: string;
  isSelected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
}

function MaterialType({ icon, name, isSelected, onSelect, disabled }: Props) {
  const styledIcon = cloneElement(icon, {
    size: "1.25rem",
  });

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "min-w-30 pl-3 pr-10 py-2 rounded-lg border overflow-hidden flex flex-col items-start gap-2 h-fit",
        disabled && "bg-(--gray-1)",
        isSelected
          ? "bg-(--gray-3) border-(--gray-11) text-(--gray-11)"
          : "bg-(--gray-1) hover:bg-(--gray-2) border-(--gray-6) hover:border-(--gray-9) transition-colors text-(--gray-9)",
      )}
    >
      {styledIcon}
      <h5 className="font-medium">{name}</h5>
    </button>
  );
}

export default MaterialType;
