"use client";
import type { ClassNameProps } from "~/types/classname-props";
import { MaterialType } from "~/types/cms-material";
import { CodeXml, FileText, Type } from "lucide-react";
import { JSX } from "react";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { useMaterialDisplay } from "~/hooks/useMaterialDisplay";

interface MaterialCardProps extends ClassNameProps {
  id: string;
  name: string;
  tags: string[];
  type: MaterialType;
  visibility: "public" | "private";
  onClick?: () => void;
}

export default function MaterialCard({
  name,
  visibility,
  type,
  tags,
  onClick,
}: MaterialCardProps) {
  const { logoMap, visibilityStyleMap } = useMaterialDisplay();

  return (
    <button onClick={onClick} className="w-full text-left mt-4 group">
      <div
        className="
      flex flex-col gap-3
      rounded-xl border border-gray-200
      bg-(--gray-1) p-5
      transition-all duration-200
      hover:-translate-y-0.5
      hover:shadow-lg hover:border-gray-300
    "
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-base text-gray-900 truncate">
            {name}
          </h3>

          <Badge
            variant="outline"
            className={visibilityStyleMap[visibility].className}
          >
            {visibility}
          </Badge>
        </div>

        <Badge variant="outline" className="text-xs">
          <span className="flex items-center gap-1 ">
            {logoMap[type]}
            <span className="capitalize">{type}</span>
          </span>
        </Badge>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} variant="default" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

export const FallbackMaterialCard = () => {
  return (
    <div className="flex w-full h-fit p-4 rounded-lg flex-col gap-2 border-2">
      <div className="flex flex-row justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>

      <div className="flex flex-row gap-2 text-xs items-center">
        <Skeleton className="h-6 w-6 rounded-md" />
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>
    </div>
  );
};
