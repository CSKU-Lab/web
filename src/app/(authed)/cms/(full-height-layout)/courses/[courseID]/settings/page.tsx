"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "~/components/commons/Button";
import InlineError from "~/components/commons/InlineError";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import { createCourseSchame } from "../../_schemas/course.create";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCourse } from "~/types/cms-course";
import { cmsCourseService } from "~/services/cms-course.service";
import { toast } from "sonner";
import useGetCourse from "../_hooks/useGetCourse";
import { useParams } from "next/navigation";
import { queryKeys } from "~/queryKeys";
import UserAutoComplete from "~/components/commons/UserAutoComplete";

function SettingPage() {
  const { courseID } = useParams<{ courseID: string }>();
  const { data: course } = useGetCourse({ courseID });

  const form = useForm({
    resolver: zodResolver(createCourseSchame),
    defaultValues: {
      name: course?.name ?? "",
      creators: course?.creators ?? [],
      type: course?.type ?? "public",
    },
  });

  useEffect(() => {
    form.setValue("name", course?.name ?? "");
    form.setValue("creators", course?.creators ?? []);
  }, [form, course]);

  const ctx = useQueryClient();
  const updateCourse = useMutation({
    mutationFn: async (course: CreateCourse) =>
      await cmsCourseService.updateByID(courseID, course),
    onSuccess: async () => {
      toast.success("Course updated successfully!");
      await ctx.invalidateQueries({
        queryKey: queryKeys.course.getById(courseID),
      });
    },
  });

  const isUpdated =
    form.watch("name") === course?.name &&
    JSON.stringify(form.watch("creators")) === JSON.stringify(course?.creators);

  if (!course) return null;

  return (
    <div className="w-1/2">
      <div className="p-4 border border-(--gray-3) rounded-md bg-white">
        <h6 className="text-lg  font-medium text-(--gray-11)">General</h6>
        <form
          onSubmit={form.handleSubmit((course) => updateCourse.mutate(course))}
          className="mt-4"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label isError={!!form.formState.errors.name} htmlFor="name">
                Name
              </Label>
              <Input
                isError={!!form.formState.errors.name}
                id="name"
                className="text-xs"
                {...form.register("name")}
              />
              <InlineError isError={!!form.formState.errors.name}>
                course name is required
              </InlineError>
            </div>
            <div className="space-y-2">
              <Label
                isError={!!form.formState.errors.creators}
                htmlFor="creators"
              >
                Creators
              </Label>
              <Controller
                name="creators"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <UserAutoComplete value={value} onChange={onChange} />
                )}
              />
              <InlineError isError={!!form.formState.errors.creators}>
                course creators is required
              </InlineError>
            </div>

            <Button
              type="submit"
              variant="action"
              className="w-full h-10"
              disabled={isUpdated}
            >
              <Save size="1rem" />
              Save
            </Button>
          </div>
        </form>
      </div>
      <div className="space-y-2 mt-8 border border-(--red-6) bg-(--red-1) rounded-md p-4">
        <h6 className="text-lg font-medium text-(--red-9)">Danger zone</h6>
        <Button variant="danger" className="mt-4 h-8">
          <Trash size="1rem" />
          Delete course
        </Button>
      </div>
    </div>
  );
}

export default SettingPage;
