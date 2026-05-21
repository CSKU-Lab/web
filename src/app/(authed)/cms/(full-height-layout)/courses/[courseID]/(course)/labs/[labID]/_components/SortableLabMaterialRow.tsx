"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Globe, Lock, Trash2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import type { CMSLabMaterial } from "~/types/cms-lab-material";
import { useMaterialDisplay } from "~/hooks/useMaterialDisplay";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import { cn } from "~/lib/utils";

interface SortableLabMaterialRowProps {
  labMaterial: CMSLabMaterial;
  onNavigate: (materialID: string) => void;
  onDelete: (materialID: string) => void;
  isDeleting?: boolean;
}

export default function SortableLabMaterialRow({
  labMaterial,
  onNavigate,
  onDelete,
  isDeleting,
}: SortableLabMaterialRowProps) {
  const { material_data } = labMaterial;
  const { logoMap } = useMaterialDisplay();

  const {
    setNodeRef,
    transform,
    transition,
    isDragging,
    attributes,
    listeners,
  } = useSortable({ id: labMaterial.material_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative rounded-md border border-(--gray-4) bg-(--gray-1)",
        "transition-colors duration-150 hover:border-(--gray-5) hover:bg-(--gray-2)",
        isDragging && "opacity-50 shadow-lg z-50",
      )}
    >
      {/* drag handle — hidden until hover */}
      <button
        type="button"
        className={cn(
          "absolute top-1/2 -translate-y-1/2 -left-3 z-10",
          "flex items-center justify-center w-6 h-10 rounded-md",
          "bg-(--gray-1) border border-(--gray-4) shadow-sm",
          "text-(--gray-8) hover:text-(--gray-12) hover:bg-(--gray-2)",
          "cursor-grab active:cursor-grabbing touch-none",
          "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0",
          "transition-all duration-150 ease-out",
        )}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>

      <div className="flex items-start gap-3 px-4 py-3">
        {/* type icon */}
        <span className="mt-0.5 shrink-0 text-(--gray-9)">{logoMap[material_data.type]}</span>

        {/* main content */}
        <button
          className="flex-1 min-w-0 text-left"
          onClick={() => onNavigate(material_data.id)}
        >
          <p className="text-sm font-medium text-(--gray-12) truncate">{material_data.name}</p>

          {material_data.created_by && (
            <div className="flex items-center gap-1.5 mt-1">
              <UserProfileImage
                src={material_data.created_by.profile_image}
                username={material_data.created_by.display_name ?? "?"}
                size="1rem"
                textSize="0.5rem"
              />
              <span className="text-xs text-(--gray-9) truncate max-w-[160px]">
                {material_data.created_by.display_name}
              </span>
            </div>
          )}

          {(material_data.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {material_data.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </button>

        {/* right: type badge + visibility icon + delete */}
        <div className="shrink-0 flex items-center gap-2 mt-0.5">
          <Badge variant="outline" className="text-xs capitalize">{material_data.type}</Badge>
          {material_data.visibility === "public" ? (
            <Globe size={14} className="text-green-600" />
          ) : (
            <Lock size={14} className="text-(--gray-9)" />
          )}
          <button
            className="text-(--gray-7) hover:text-red-500 transition-colors disabled:opacity-40 ml-1"
            onClick={() => onDelete(material_data.id)}
            disabled={isDeleting}
            aria-label="Remove material"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
