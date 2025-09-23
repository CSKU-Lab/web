import { cn } from "~/lib/utils";
import type { ClassNameProps } from "~/types/classname-props";

interface Props extends ClassNameProps {
  name: string;
  instructor: string[];
  semester: string;
  bannerImage: string | null;
}

const SectionCard = ({
  className,
  name,
  instructor = [],
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
        className="flex-1 text-6xl transition-all bg-cover bg-center bg-linear-to-br from-(--gray-3) to-(--gray-4)"
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
          <h6 className="font-anuphan text-sm">{instructor.join(", ")}</h6>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;
