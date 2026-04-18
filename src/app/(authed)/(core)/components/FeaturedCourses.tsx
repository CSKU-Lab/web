"use client";

import Link from "next/link";
import { useFeaturedCourses } from "../_hooks/useFeaturedCourses";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Error from "~/components/commons/Error";
import { ServerCrash, Users } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";

const FeaturedCourses = () => {
  const { data: courses, isLoading, isError, refetch } = useFeaturedCourses(4);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-32 rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Error
      isError={isError}
      fallback={
        <ErrorFallback
          icon={<ServerCrash size="2rem" />}
          onRetry={refetch}
          title="Cannot load featured courses"
          message="Please try again later"
        />
      }
    >
      <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4">
        {courses?.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) hover:bg-(--gray-2) transition-colors"
          >
            <div className="bg-linear-to-bl from-accent to-accent/40 h-5" />
            <div className="p-4 space-y-3">
              <h3 className="text-lg font-medium line-clamp-2">{course.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-(--gray-11)">
                <Users size="1rem" />
                <span>{course.total_students} students</span>
              </div>
              <div className="flex items-center gap-1">
                {course.creators.slice(0, 3).map((creator) => (
                  <UserProfileImage
                    key={creator.id}
                    className="ring-2 ring-white rounded -ml-1 first:ml-0"
                    username={creator.display_name}
                    src={creator.profile_image ?? undefined}
                    textSize="10px"
                    size="1.5rem"
                  />
                ))}
                {course.creators.length > 3 && (
                  <span className="text-xs text-(--gray-11) ml-1">
                    +{course.creators.length - 3}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Error>
  );
};

export default FeaturedCourses;
