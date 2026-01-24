import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

const CourseCardSkeleton = () => {
  return (
    <Card className="pt-0 w-full flex flex-col">
      <CardContent className="px-0 relative overflow-hidden rounded-t-xl">
        <Skeleton className="aspect-video w-full" />
      </CardContent>

      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>

      <div className="flex items-center gap-2 w-full px-6">
        <Skeleton className="h-px w-3/12" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-px w-full" />
      </div>

      <CardFooter className="flex justify-end gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </CardFooter>
    </Card>
  );
};

export default CourseCardSkeleton;
