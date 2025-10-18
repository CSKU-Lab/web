"use client";
import { cn } from "~/lib/utils";
import type { ClassNameProps } from "~/types/classname-props";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import useResolvePath from "~/hooks/useResolvePath";
import Image from "next/image";

interface Props extends ClassNameProps {
  id: string;
  name: string;
  instructors: string[];
  semester: string;
  bannerImage: string | null;
}

export const CMSSectionCard = ({
  className,
  name,
  instructors = [],
  bannerImage,
  id,
}: Props) => {
  const generatePath = useResolvePath();
  return (
    <Link
      href={generatePath(`/cms/courses/:courseID/sections/${id}`)}
      className={cn(
        "rounded-xl overflow-hidden flex flex-col justify-end group border border-(--gray-4) h-full group",
        className,
      )}
    >
      <div className="flex-1 text-6xl bg-linear-to-br from-(--gray-3) to-(--gray-4) min-h-50 relative overflow-hidden">
        {bannerImage !== null && (
          <Image
            src={bannerImage}
            alt={`Section ${name} banner image`}
            fill
            className="group-hover:scale-105 transition-transform"
          />
        )}
      </div>
      <div className="flex items-center gap-4 bg-white p-4 w-full group-hover:bg-(--gray-1) transition-colors">
        <div className="space-y-0.5 flex-1 overflow-hidden flex flex-col">
          <h4 className="font-semibold truncate">
            {name}
          </h4>
          <h6 className="font-anuphan text-sm">{instructors.join(", ")}</h6>
        </div>
      </div>
    </Link>
  );
};

export const FallbackSectionCard = () => {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden flex flex-col justify-end group border border-(--gray-4) h-full",
      )}
    >
      <Skeleton className="min-h-50" />
      <div className="flex items-center gap-4 bg-white p-4 w-full">
        <div className="space-y-0.5 flex-1 overflow-hidden flex flex-col">
          <Skeleton className="w-20 h-4" />
          <div className="flex flex-wrap gap-1 mt-2">
            <Skeleton className="w-14 h-4" />
            <Skeleton className="w-14 h-4" />
            <Skeleton className="w-14 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
