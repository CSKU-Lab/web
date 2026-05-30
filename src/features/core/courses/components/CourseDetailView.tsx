"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCourseDetail } from "~/features/core/courses/hooks/useCourseDetail";
import { useEnrollCourse, useUnenrollCourse } from "~/features/core/courses/hooks/useCourseAction";
import { Button } from "~/components/commons/Button";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Error from "~/components/commons/Error";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import { ServerCrash, Users, ArrowLeft, BookOpen, CheckCircle, Loader2 } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";

function CourseDetailView() {
  const params = useParams();
  const courseId = params.courseID as string;

  const { data, isLoading, isError, refetch } = useCourseDetail(courseId);
  const { enroll } = useEnrollCourse(courseId);
  const { unenroll } = useUnenrollCourse(courseId);

  if (isLoading) {
    return (
      <div className="bg-(--gray-1) h-full p-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  const course = data?.course;
  const labs = data?.labs;
  const isEnrolled = course?.is_enrolled ?? false;

  return (
    <Error
      isError={isError}
      fallback={
        <ErrorFallback
          icon={<ServerCrash size="2rem" />}
          onRetry={refetch}
          title="Cannot load course details"
          message="Please try again later"
        />
      }
    >
      <div className="bg-(--gray-1) h-full p-8 space-y-8 overflow-y-auto overflow-x-hidden">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-sm text-(--gray-11) hover:text-(--gray-12) transition-colors"
        >
          <ArrowLeft size="1rem" /> Back to Course Explorer
        </Link>

        <div className="relative h-64 w-full rounded-xl overflow-hidden">
          {course?.banner ? (
            <Image
              src={course.banner}
              alt={course.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-linear-to-br from-accent to-accent/60 h-full" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h4 className="text-4xl font-semibold text-white">{course?.name}</h4>
            {course?.description && (
              <p className="mt-2 text-white/80 max-w-2xl">{course.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 @xl:grid-cols-3 gap-6">
          <div className="@xl:col-span-2 space-y-6">
            <section className="rounded-lg border border-(--gray-4) bg-(--gray-1) p-6">
              <h5 className="text-lg font-semibold mb-4">Course Labs</h5>
              <div className="grid gap-3">
                {labs?.map((lab) => (
                  <div
                    key={lab.id}
                    className="flex items-center gap-4 px-4 py-3 rounded-md border border-(--gray-4) bg-(--gray-2)"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground font-medium">
                      {lab.position}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{lab.lab_name}</p>
                      <p className="text-sm text-(--gray-11)">
                        {lab.total_students} students enrolled
                      </p>
                    </div>
                    <BookOpen size="1.25rem" className="text-(--gray-11)" />
                  </div>
                ))}
                {(!labs || labs.length === 0) && (
                  <p className="text-(--gray-11) text-center py-8">
                    No labs available yet
                  </p>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-(--gray-4) bg-(--gray-1) p-6">
              <h5 className="text-lg font-semibold mb-4">Instructors</h5>
              <div className="space-y-3">
                {course?.creators.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center gap-3"
                  >
                    <UserProfileImage
                      username={creator.display_name}
                      src={creator.profile_image ?? undefined}
                      size="2.5rem"
                    />
                    <div>
                      <p className="font-medium">{creator.display_name}</p>
                      <p className="text-sm text-(--gray-11)">@{creator.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-(--gray-4) bg-(--gray-1) p-6 space-y-4">
              <div className="flex items-center gap-2 text-(--gray-11)">
                <Users size="1.25rem" />
                <span>{course?.total_students} students enrolled</span>
              </div>
              {isEnrolled ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-11">
                    <CheckCircle size="1.25rem" />
                    <span>Enrolled</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full py-2.5"
                    onClick={() => unenroll.mutate()}
                    disabled={unenroll.isPending}
                  >
                    {unenroll.isPending && (
                      <Loader2 size="1rem" className="animate-spin mr-2" />
                    )}
                    Unenroll
                  </Button>
                </div>
              ) : (
                <Button
                  className="w-full py-2.5"
                  onClick={() => enroll.mutate()}
                  disabled={enroll.isPending}
                >
                  {enroll.isPending && (
                    <Loader2 size="1rem" className="animate-spin mr-2" />
                  )}
                  Enroll in Course
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Error>
  );
}

export default CourseDetailView;