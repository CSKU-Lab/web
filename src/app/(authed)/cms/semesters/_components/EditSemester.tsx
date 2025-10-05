import { Save } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/commons/Dialog";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "~/queryKeys";
import { AxiosError } from "axios";
import {
  type WriteSemester,
  writeSemesterSchema,
} from "../_schemas/write-semester";
import { cmsSemesterService } from "~/services/cms-semester.service";
import { DatePicker } from "~/components/commons/DatePicker";
import SemesterType from "./SemesterType";
import type { CMSSemester } from "~/types/cms-semester";

interface Props {
  semester: CMSSemester;
  onClose: () => void;
}

const EditSemester = ({ semester, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(writeSemesterSchema),
    defaultValues: {
      ...semester,
      started_date: new Date(semester.started_date),
    },
  });

  const isError = (field: keyof WriteSemester) => !!errors[field];

  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const handleUpdateSemester: SubmitHandler<WriteSemester> = async (
    payload,
  ) => {
    try {
      setIsPending(true);

      await cmsSemesterService.update(semester.id, payload);
      await queryClient.invalidateQueries({ queryKey: queryKeys.semester.all });
      reset();
      onClose();
      toast.success("Semester edited successfully");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error("Error", { description: err.response?.data?.error });
        return;
      }
      toast.error("Error", {
        description: "Something went wrong when trying to update semester",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader className="p-4">
          <DialogTitle>Edit semester</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdateSemester)}>
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <Label isError={isError("name")}>Name</Label>
              <Input {...register("name")} />
              {isError("name") && (
                <p className="text-(--red-9) text-sm font-light">
                  {errors.name?.message}
                </p>
              )}
            </div>
            <div className="flex gap-6">
              <div className="space-y-3 flex-1">
                <Label isError={isError("type")}>Type</Label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field: { value, onChange } }) => (
                    <SemesterType
                      value={value}
                      onChange={onChange}
                      isError={isError("type")}
                    />
                  )}
                />
                {isError("type") && (
                  <p className="text-(--red-9) text-sm font-light">
                    {errors.name?.message}
                  </p>
                )}
              </div>
              <div className="space-y-3 flex-1">
                <Label isError={isError("started_date")}>Started Date</Label>
                <Controller
                  control={control}
                  name="started_date"
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      value={value}
                      onChange={onChange}
                      isError={isError("started_date")}
                    />
                  )}
                />

                {isError("started_date") && (
                  <p className="text-(--red-9) text-sm font-light">
                    {errors.name?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              isLoading={isPending}
              disabled={isPending}
              variant="action"
              className="py-2 w-full"
            >
              <Save size="1rem" />
              Update
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSemester;
