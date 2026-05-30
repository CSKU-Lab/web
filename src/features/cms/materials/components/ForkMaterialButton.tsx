"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { GitFork } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import { cmsCourseService } from "~/services/cms-course.service";
import { cmsMaterialService } from "~/services/cms-material.service";

export default function ForkMaterialButton() {
  const router = useRouter();
  const { courseID, materialID } = useParams<{
    courseID: string;
    materialID: string;
  }>();
  const [targetCourseID, setTargetCourseID] = useState("");

  const coursesQuery = useQuery({
    queryKey: ["material-fork-courses"],
    queryFn: () =>
      cmsCourseService.getPagination({
        page: 1,
        page_size: 100,
        search: "",
        sort_by: "name",
        sort_order: "desc",
        filters: [],
        show: "active",
      }),
  });

  const courses = useMemo(
    () => coursesQuery.data?.data.filter((course) => course.id !== courseID) ?? [],
    [courseID, coursesQuery.data?.data],
  );

  const fork = useMutation({
    mutationFn: () => cmsMaterialService.fork(targetCourseID, materialID),
    onSuccess: (forkedMaterialID) => {
      toast.success("Material forked");
      router.push(`/cms/courses/${targetCourseID}/materials/${forkedMaterialID}`);
    },
    onError: () => {
      toast.error("Failed to fork material");
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <GitFork size="1rem" />
          Fork
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader className="p-4">
          <DialogTitle>Fork material</DialogTitle>
        </DialogHeader>
        <div className="p-4 space-y-4">
          <select
            value={targetCourseID}
            onChange={(event) => setTargetCourseID(event.target.value)}
            className="w-full rounded-md border border-(--gray-7) bg-(--gray-1) px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--accent-8)"
          >
            <option value="">Select target course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          <Button
            variant="action"
            disabled={!targetCourseID || fork.isPending}
            onClick={() => fork.mutate()}
          >
            <GitFork size="1rem" />
            {fork.isPending ? "Forking..." : "Fork material"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
