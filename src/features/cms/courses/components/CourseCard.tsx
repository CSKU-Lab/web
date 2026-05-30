import Link from "next/link";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import { Badge } from "~/components/ui/badge";
import type { Course } from "~/types/cms-course";

function CourseCard({ id, name, creators }: Course) {
  const renderCreators = () => {
    const MAX_SHOW_CREATORS = 3;

    return (
      <div className="flex items-center gap-1 mt-4">
        {creators
          .slice(0, MAX_SHOW_CREATORS)
          .map(({ id, display_name, profile_image }) => (
            <UserProfileImage
              className="ring-2 ring-white rounded"
              key={id}
              username={display_name}
              src={profile_image}
              textSize="10px"
              size="1.75rem"
            />
          ))}
        {creators.length > MAX_SHOW_CREATORS && (
          <Badge variant="secondary" className="ml-1 text-xs">
            +{creators.length - MAX_SHOW_CREATORS} more
          </Badge>
        )}
      </div>
    );
  };

  return (
    <Link
      href={`/cms/courses/${id}`}
      className="block rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) hover:bg-(--gray-1)"
    >
      <div className="bg-linear-to-bl from-accent to-accent/40 h-5"></div>
      <div className="p-4 space-y-2 flex-1">
        <div>
          <h6 className="text-xs leading-tight">Name</h6>
          <h3 className="text-lg font-medium line-clamp-2 mt-2">{name}</h3>
        </div>
        <div>
          <h6 className="text-xs leading-tight">Creators</h6>
          {renderCreators()}
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
