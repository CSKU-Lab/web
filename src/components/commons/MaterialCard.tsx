"use client";
import type { ClassNameProps } from "~/types/classname-props";
import { Skeleton } from "../ui/skeleton";
import { MaterialType } from "~/types/cms-material";
import { CodeXml, FileText, Type } from "lucide-react";
import { JSX } from "react";

const logoMap: Record<MaterialType, JSX.Element> = {
  [MaterialType.CODE]: <CodeXml className="w-4 h-4" />,
  [MaterialType.DOCUMENT]: <FileText className="w-4 h-4" />,
  [MaterialType.TYPE]: <Type className="w-4 h-4" />,
};

interface MaterialCardProps extends ClassNameProps {
  id: string;
  name: string;
  tags: string[];
  type: MaterialType;
  visibility: string;
  onClick?: () => void;
}

export default function MaterialCard({
  name,
  visibility,
  type,
  tags,
  onClick,
}: MaterialCardProps) {
  return (
    <button onClick={onClick} className="flex w-full gap-4 auto-rows-max mt-4">
      <div className="flex w-full h-fit text-md p-4 rounded-lg flex-col gap-2 border-2 hover:shadow-lg transition-shadow hover:cursor-pointer">
        <div className="flex flex-row justify-between">
          <p className="w-fit font-bold">{name}</p>
          <p className="w-fit">{visibility}</p>
        </div>
        <div className="flex flex-row gap-2 text-xs">
          <span className="border-2 p-1 rounded-md flex flex-row gap-2 px-2">
            {logoMap[type]} {type}
          </span>
          <p className="w-fit border-2 p-1 rounded-md px-2">{tags}</p>
        </div>
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
