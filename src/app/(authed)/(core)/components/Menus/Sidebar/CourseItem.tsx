import StatusIcon from "../../StatusIcon";
import Link from "~/components/commons/Link";
import { useParams } from "next/navigation";
import { cn } from "~/lib/utils";
import type { ICourseItem } from "../../../types";

const CourseItem = ({
  subItems,
  type,
  labID,
  sectionID,
}: ICourseItem & { type: "labs" | "materials"; sectionID: string }) => {
  const { slug } = useParams();

  return (
    <>
      <ul className="space-y-2 mt-2">
        {subItems.map(({ name, slug: _slug, status }) => (
          <li key={_slug} className="text-xs overflow-hidden">
            <Link
              href={`/sections/${sectionID}/labs/${labID}/${type}/${_slug}`}
              className={cn(
                "grid grid-cols-12 items-center p-2 rounded-md hover:bg-(--gray-3)",
                _slug === slug && "bg-(--gray-4)",
              )}
            >
              <div className="text-(--gray-12) flex justify-center items-center">
                <StatusIcon {...{ status }} size="1rem" />
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
