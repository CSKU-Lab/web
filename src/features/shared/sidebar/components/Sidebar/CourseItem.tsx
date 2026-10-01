import Link from "~/components/commons/Link";
import { useParams } from "next/navigation";
import { cn } from "~/lib/utils";
import { useSidebarMaterials } from "~/hooks/useSidebar";
import { Skeleton } from "~/components/ui/skeleton";

const studentStatusConfig: Record<string, string> = {
  passed: "bg-green-500",
  not_passed: "bg-red-500",
  in_progress: "bg-yellow-500",
  not_started: "bg-gray-400",
};

const CourseItem = ({
  sectionID,
  labID,
  enabled,
}: {
  sectionID: string;
  labID: string;
  enabled: boolean;
}) => {
  const { slug } = useParams();
  const { data: materials = [], isLoading } = useSidebarMaterials(sectionID, labID, enabled);

  if (isLoading) {
    return (
      <ul className="space-y-2 mt-2">
        {[0, 1, 2].map((item) => (
          <li key={item} className="flex items-center gap-2 p-2">
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="h-3 w-4/5" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className="space-y-2 mt-2">
      {materials.map((material) => {
        const status = material.student_status || "not_started";
        const statusColor = studentStatusConfig[status] || studentStatusConfig.not_started;

        return (
          <li key={material.id} className="text-xs overflow-hidden">
            <Link
              href={`/sections/${sectionID}/labs/${labID}/materials/${material.id}`}
              className={cn(
                "grid grid-cols-12 items-center p-2 rounded-md hover:bg-(--gray-3)",
                slug === material.id && "bg-(--gray-4)",
              )}
            >
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  statusColor,
                )}
              />
              <p className={cn("col-span-11 ml-2 truncate text-(--gray-12)")}>
                {material.name}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default CourseItem;
