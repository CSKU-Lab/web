import { Plus } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { queryKeys } from "~/queryKeys";
import { AxiosError } from "axios";
import {
  type WriteSemester,
  writeSemesterSchema,
} from "../schemas/write-semester";
import { cmsSemesterService } from "~/services/cms-semester.service";
import { DatePicker } from "~/components/commons/DatePicker";
import SemesterType from "./SemesterType";
import dayjs from "dayjs";

const AddSemester = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(writeSemesterSchema),
    defaultValues: {
      name: "",
      type: "first",
      started_date: undefined,
    },
  });

  const isError = (field: keyof WriteSemester) => !!errors[field];

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const handleCreateSemester: SubmitHandler<WriteSemester> = async (
    payload,
  ) => {
    try {
      setIsPending(true);

      await cmsSemesterService.create(payload);
      await queryClient.invalidateQueries({ queryKey: queryKeys.semester.all });
      reset();
      setIsOpen(false);
      toast.success("Semester created successfully");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error("Error", { description: err.response?.data?.error });
        return;
      }
      toast.error("Error", {
        description: "Something went wrong when trying to create semester",
      });
    } finally {
      setIsPending(false);
    }
  };

  const startSemesterMonth = useMemo(() => {
    return new Date();
  }, []);

  const endSemesterMonth = useMemo(() => {
    return dayjs().add(10, "year").toDate();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size="1rem" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="p-4">
          <DialogTitle>Add new semester</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateSemester)}>
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
                      startMonth={startSemesterMonth}
                      endMonth={endSemesterMonth}
                      isError={isError("started_date")}
                    />
                  )}
                />

                {isError("started_date") && (
                  <p className="text-(--red-9) text-sm font-light">
                    {errors.started_date?.message}
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
              <Plus size="1rem" />
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSemester;
