"use client";
import { cn } from "~/lib/utils";
import type { ClassNameProps } from "~/types/classname-props";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import useResolvePath from "~/hooks/useResolvePath";

interface Props extends ClassNameProps {
  id: string;
  name: string;
  instructors: string[];
  semester: string;
  bannerImage: string | null;
}

export const PreviewCMSSectionCard = ({
  className,
  name,
  instructors = [],
  bannerImage,
}: Omit<Props, "id">) => {
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden aspect-video border border-(--gray-4) group",
        className,
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-(--gray-3) to-(--gray-4)">
        {bannerImage !== null && (
          <img
            loading="lazy"
            src={bannerImage}
            alt={`Section ${name} banner image`}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <h4 className="font-semibold truncate text-white">{name}</h4>
        <h6 className="font-anuphan text-sm text-white/80">{instructors.join(", ")}</h6>
      </div>
    </div>
  );
};

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
        "relative rounded-xl overflow-hidden aspect-video border border-(--gray-4) block group",
        className,
      )}
    >
      <div className="absolute inset-0 bg-linear-to-br from-(--gray-3) to-(--gray-4)">
        {bannerImage !== null && (
          <img
            loading="lazy"
            src={bannerImage}
            alt={`Section ${name} banner image`}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <h4 className="font-semibold truncate text-white">{name}</h4>
        <h6 className="font-anuphan text-sm text-white/80">{instructors.join(", ")}</h6>
      </div>
    </Link>
  );
};

export const FallbackSectionCard = () => {
  return (
    <div className="relative rounded-xl overflow-hidden aspect-video border border-(--gray-4)">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 p-4 space-y-1.5">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-36 h-3" />
      </div>
    </div>
  );
};
