"use client";

import {
  CMSLabStatusMaterial,
  CMSLabStatusStudent,
  CMSLabStatusSubmission,
} from "~/types/cms-lab-status";
import { StatusCell } from "./StatusCell";
import UserProfileImage from "~/components/Menus/UserProfileImage";

interface StudentStatusGridProps {
  student: CMSLabStatusStudent;
  materials: CMSLabStatusMaterial[];
  hoveredMaterialIndex: number | null;
  onHoverMaterial: (index: number | null) => void;
  baseUrl: string;
}

export function StudentStatusGrid({
  student,
  materials,
  hoveredMaterialIndex,
  onHoverMaterial,
  baseUrl,
}: StudentStatusGridProps) {
  return (
    <div className="flex items-center gap-8 py-2 px-3 border-b border-(--gray-4) hover:bg-(--gray-2) transition-colors">
      <div className="shrink-0 flex gap-1.5 items-center w-[300px]">
        <UserProfileImage
          className="shrink-0"
          size="2rem"
          username={student.username}
          src={student.profile_image}
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">
            {student.display_name}
          </div>
          <div className="text-xs text-(--gray-11) truncate">
            @{student.username}
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 flex-wrap">
          {materials.map((material, index) => {
            const submission =
              student.material_statuses[material.material_id] ??
              ({
                status: "not_submitted",
              } as CMSLabStatusSubmission);

            return (
              <StatusCell
                key={material.material_id}
                material={material}
                submission={submission}
                materialIndex={index}
                hoveredMaterialIndex={hoveredMaterialIndex}
                onHover={onHoverMaterial}
                baseUrl={baseUrl}
                studentId={student.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
