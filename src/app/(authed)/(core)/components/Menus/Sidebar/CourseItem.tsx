import StatusIcon from "../../StatusIcon";
import Link from "~/components/commons/Link";
import { useParams } from "next/navigation";
import { cn } from "~/lib/utils";
import type { ICourseItem } from "../../../types";
import { GetSidebarResponse } from "~/services/core-sidebar.service";

const CourseItem = ({
  sub_items,
  name,
  id,
  status,
  sectionID,
  type,
}: GetSidebarResponse & { sectionID: string; type: string }) => {
  const { slug } = useParams();

  return (
    <>
      <ul className="space-y-2 mt-2">
        {sub_items.map(({ name, id: _slug, status }) => (
          <li key={_slug} className="text-xs overflow-hidden">
            <Link
              href={`/sections/${sectionID}/labs/${id}/${type}/${_slug}`}
              className={cn(
                "grid grid-cols-12 items-center p-2 rounded-md hover:bg-(--gray-3)",
                _slug === slug && "bg-(--gray-4)",
              )}
            >
              <div className="text-(--gray-12) flex justify-center items-center">
                {/* <StatusIcon {...{ status }} size="1rem" /> */}
              </div>
              <p className={cn("col-span-11 ml-2 truncate text-(--gray-12)")}>
                {name}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CourseItem;
