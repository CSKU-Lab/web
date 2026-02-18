"use client";

import { useMaterialDisplay } from "~/hooks/useMaterialDisplay";
import type { CMSMaterial } from "~/types/cms-material";
import Link from "next/link";
import { cn } from "~/lib/utils";

interface MaterialCardProps {
  material: CMSMaterial;
  courseID: string;
  sectionID: string;
  labID: string;
}

function MaterialCard({
  material,
  courseID,
  sectionID,
  labID,
}: MaterialCardProps) {
  const { logoMap } = useMaterialDisplay();

  return (
    <Link
      href={`/cms/courses/${courseID}/sections/${sectionID}/labs/${labID}/materials/${material.id}/submissions`}
      className={cn(
        "block rounded-md overflow-hidden bg-white border border-(--gray-4)",
        "hover:bg-(--gray-1) transition-colors cursor-pointer",
      )}
    >
      <div className="h-5 bg-linear-to-bl from-gray-400 to-gray-300" />
      <div className="p-4 space-y-3">
        <div>
          <h6 className="text-xs text-(--gray-9) leading-tight">Name</h6>
          <h3 className="text-lg font-medium line-clamp-2 mt-1">
            {material.name}
          </h3>
        </div>

        <div>
          <h6 className="text-xs text-(--gray-9) leading-tight">Type</h6>
          <div className="flex items-center gap-1.5 mt-1">
            {logoMap[material.type]}
            <span className="text-sm font-medium capitalize text-(--gray-12)">
              {material.type}
            </span>
          </div>
        </div>

        {material.tags.length > 0 && (
          <div>
            <h6 className="text-xs text-(--gray-9) leading-tight">Tags</h6>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {material.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-(--gray-3) text-(--gray-11)"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}

export default MaterialCard;
