import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash } from "lucide-react";
import React, { Fragment } from "react";
import { toast } from "sonner";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { dateFormatter } from "~/lib/formatters/dateFormatter";
import { queryKeys } from "~/queryKeys";
import type { CMSSemester } from "~/types/cms-semester";
import useGetAffectedSections from "../_hooks/useGetAffectedSections";
import { cmsSemesterService } from "~/services/cms-semester.service";

interface Props {
  semester: CMSSemester;
  onClose: () => void;
}

function DeleteSemeseterDialog({ semester, onClose }: Props) {
  const queryClient = useQueryClient();

  const deleteSemester = useMutation({
    mutationFn: (id: string) => cmsSemesterService.delete(id),
    onSuccess: async () => {
      toast.success("Semester deleted successfully");
      await queryClient.refetchQueries({ queryKey: queryKeys.semester.all });
      onClose();
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response?.data?.error);
        return;
      }
    },
  });

  const { data: affectedSections, isFetching } = useGetAffectedSections(
    semester.id,
  );

  const renderAffectedSections = () => {
    if (isFetching) return <p>Loading...</p>;
    if (!affectedSections) return null;

    const lastIndex = affectedSections.length - 1;
    return affectedSections.map((data, index) => {
      return (
        <Fragment key={data.course_name}>
          <AffectedSection course={data.course_name} sections={data.sections} />
          {index !== lastIndex && (
            <div className="h-[1px] bg-(--gray-6) my-2 rounded-full"></div>
          )}
        </Fragment>
      );
    });
  };

  const affectedSectionsCount =
    affectedSections?.reduce((acc, curr) => acc + curr.sections.length, 0) ?? 0;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete ?</DialogTitle>
        </DialogHeader>
        <div className="max-h-[500px] overflow-auto space-y-1.5">
          <div className="flex gap-8">
            <div>
              <h6 className="text-xs text-(--gray-11)">Name</h6>
              <h5>{semester.name}</h5>
            </div>
            <div>
              <h6 className="text-xs text-(--gray-11)">Type</h6>
              <h5>{semester.type}</h5>
            </div>
            <div>
              <h6 className="text-xs text-(--gray-11)">Started Date</h6>
              <h5>{dateFormatter(semester.started_date)}</h5>
            </div>
          </div>
          <h6 className="text-sm text-(--gray-11) font-medium mt-3">
            This will permanently delete the semester itself and
            <span className="font-medium mx-1 text-(--gray-12)">
              {affectedSectionsCount} section
              {affectedSectionsCount > 1 ? "s" : ""}
            </span>
            , including:
          </h6>
          <div className="relative">
            <div className="max-h-60 overflow-y-auto pb-4">
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-(--gray-2) to-transparent h-6"></div>
              {renderAffectedSections()}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="w-full" variant="danger">
              Cancel
            </Button>
          </DialogClose>
          <Button
            isLoading={deleteSemester.isPending}
            onClick={() => deleteSemester.mutate(semester.id)}
            className="w-full"
            variant="primary"
          >
            <Trash size="1rem" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteSemeseterDialog;

interface AffectedSectionProps {
  course: string;
  sections: string[];
}

const AffectedSection = ({ course, sections }: AffectedSectionProps) => {
  return (
    <div>
      <span className="text-xs text-(--gray-11)">Course</span>
      <h6 className="font-medium">{course}</h6>
      <span className="text-xs text-(--gray-11)">
        Section{sections.length > 1 ? "s" : ""}
      </span>
      <h5 className="text-sm font-medium">{sections.join(",")}</h5>
    </div>
  );
};
