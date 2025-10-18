import { cn } from "~/lib/utils";
import type { ClassNameProps } from "~/types/classname-props";
import { Skeleton } from "../ui/skeleton";

interface Props extends ClassNameProps {
  name: string;
  instructors: string[];
  semester: string;
  bannerImage: string | null;
}

export const SectionCard = ({
  className,
  name,
  instructors = [],
  bannerImage,
  semester,
}: Props) => {
  return (
    <div
      className={cn(
        "rounded-xl overflow-hidden flex flex-col justify-end group border border-(--gray-4) h-full",
        className,
      )}
    >
      <div
        className="flex-1 text-6xl transition-all bg-cover bg-center bg-linear-to-br from-(--gray-3) to-(--gray-4)  min-h-50"
        style={{
          backgroundImage:
            bannerImage !== null ? `url(${bannerImage})` : undefined,
        }}
      ></div>
      <div className="flex items-center gap-4 bg-white p-4 w-full">
        <div className="space-y-0.5 flex-1 overflow-hidden flex flex-col">
          <h4 className="font-semibold truncate">
            {name} • {semester}
          </h4>
          <h6 className="font-anuphan text-sm">{instructors.join(", ")}</h6>
        </div>
      </div>
    </div>
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
