import Link from "~/components/commons/Link";
import { useParams } from "next/navigation";
import { cn } from "~/lib/utils";
import { GetSidebarResponse } from "~/services/core-sidebar.service";

const studentStatusConfig = {
  passed: "bg-green-500",
  not_passed: "bg-red-500",
  in_progress: "bg-yellow-500",
  not_started: "bg-gray-400",
};

const CourseItem = ({
  sub_items,
  sectionID,
  labID,
}: {
  sub_items: GetSidebarResponse["sub_items"];
  sectionID: string;
  labID: string;
}) => {
  const { slug } = useParams();
  const materials = sub_items || [];

  return (
    <ul className="space-y-2 mt-2">
      {materials.map((material) => {
        const status = material.status || "not_started";
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
