"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash, Eye, EyeOff, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import PageTitle from "~/components/commons/PageTitle";
import DeleteCourseDialog from "./_components/DeleteCourseDialog";

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
    form.setValue("type", course?.type ?? "public");
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
    JSON.stringify(form.watch("creators")) ===
      JSON.stringify(course?.creators) &&
    form.watch("type") === course?.type;

  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const handleDeleteCourse = () => setConfirmDeleteVisible(true);
  const onCloseDeleteDialog = () => setConfirmDeleteVisible(false);

  if (!course) return null;

  return (
    <>
      {confirmDeleteVisible && (
        <DeleteCourseDialog onClose={onCloseDeleteDialog} />
      )}
      <PageTitle>Settings</PageTitle>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-4xl space-y-8 2xl:mt-10">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-1.5 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Course Settings
              </h2>
              <p className="text-sm text-gray-600">
                Manage your course details and visibility.
              </p>
              <hr />
            </div>
            <form
              onSubmit={form.handleSubmit((course) =>
                updateCourse.mutate(course),
              )}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-medium text-gray-900">General</h3>
                  <p className="text-sm text-gray-600">
                    Fill in the details of your course.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label isError={!!form.formState.errors.name} htmlFor="name">
                    Course Name
                  </Label>
                  <Input
                    isError={!!form.formState.errors.name}
                    id="name"
                    className="text-sm"
                    {...form.register("name")}
                  />
                  <InlineError isError={!!form.formState.errors.name}>
                    Course name is required
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
                    Course creators are required
                  </InlineError>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Visibility
                  </h3>
                  <p className="text-sm text-gray-600">
                    Choose who can see this course.
                  </p>
                </div>
                <Controller
                  control={form.control}
                  name="type"
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      value={value}
                      onValueChange={onChange}
                      defaultValue="public"
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <div className="flex flex-col">
                          <Label
                            htmlFor="public"
                            className="font-medium text-gray-900"
                          >
                            Public
                          </Label>
                          <p className="text-xs text-gray-500">
                            Everyone can see this course
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="private"
                          id="private"
                          className="font-medium"
                        />
                        <div className="flex flex-col">
                          <Label htmlFor="private" className="font-medium">
                            Private
                          </Label>
                          <p className="text-xs text-gray-500">
                            Only invited users would see this course
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                />
              </div>

              <Button
                type="submit"
                variant="action"
                className="w-full h-10"
                disabled={isUpdated}
              >
                <Save size="1rem" className="mr-2" />
                Save Changes
              </Button>
            </form>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="space-y-1.5 mb-6">
              <h2 className="text-xl font-semibold text-red-900">
                Danger Zone
              </h2>
              <p className="text-sm text-red-700">
                Deleting this course will permanently remove all associated
                data. This action cannot be undone.
              </p>
              <hr />
            </div>
            <Button
              variant="danger"
              className="h-10"
              onClick={handleDeleteCourse}
            >
              <Trash size="1rem" className="mr-2" />
              Delete Course
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SettingPage;
