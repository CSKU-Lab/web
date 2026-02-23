"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "~/components/commons/Button";
import InlineError from "~/components/commons/InlineError";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { WriteCourse } from "~/types/cms-course";
import { cmsCourseService } from "~/services/cms-course.service";
import { toast } from "sonner";
import useGetCourse from "../_hooks/useGetCourse";
import { useParams } from "next/navigation";
import { queryKeys } from "~/queryKeys";
import UserAutoComplete from "~/components/commons/UserAutoComplete";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import DeleteCourseDialog, {
  DeleteCourseDialogTrigger,
} from "./_components/DeleteCourseDialog";
import {
  SettingCard,
  SettingDescription,
  SettingDivider,
  SettingHeader,
  SettingLayout,
  SettingSection,
  SettingSectionDescription,
  SettingSectionHeader,
  SettingSectionTitle,
  SettingTitle,
} from "~/components/crafts/Settings";
import { createCourseSchame } from "../../../_schemas/course.create";
import RouteNavigation from "../_components/RouteNavigation";

function SettingPage() {
  const { courseID } = useParams<{ courseID: string }>();
  const { data: course } = useGetCourse({ courseID });

  const form = useForm({
    resolver: zodResolver(createCourseSchame),
  });

  useEffect(() => {
    form.setValue("name", course?.name ?? "");
    form.setValue("creators", course?.creators ?? []);
    form.setValue("visibility", course?.visibility ?? "public");
  }, [form, course]);

  const ctx = useQueryClient();
  const updateCourse = useMutation({
    mutationFn: async (course: WriteCourse) =>
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
    form.watch("visibility") === course?.visibility;

  if (!course) return null;

  return (
    <>
      <RouteNavigation title="Settings" />
      <SettingLayout>
        <SettingCard>
          <SettingHeader>
            <SettingTitle>Course Settings</SettingTitle>
            <SettingDescription>
              Manage your course details and visibility.
            </SettingDescription>
            <SettingDivider />
          </SettingHeader>
          <form
            onSubmit={form.handleSubmit((course) =>
              updateCourse.mutate(course),
            )}
            className="space-y-6"
          >
            <SettingSection>
              <SettingSectionHeader>
                <SettingSectionTitle>General</SettingSectionTitle>
                <SettingSectionDescription>
                  Fill in the details of your course.
                </SettingSectionDescription>
              </SettingSectionHeader>
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
            </SettingSection>

            <SettingSection>
              <SettingSectionHeader>
                <SettingSectionTitle>Visibility</SettingSectionTitle>
                <SettingSectionDescription>
                  Choose who can see this course.
                </SettingSectionDescription>
              </SettingSectionHeader>
              <Controller
                control={form.control}
                name="visibility"
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
                          className="font-medium text-(--gray-12)"
                        >
                          Public
                        </Label>
                        <p className="text-xs text-(--gray-11)">
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
                        <Label
                          htmlFor="private"
                          className="font-medium text-(--gray-12)"
                        >
                          Private
                        </Label>
                        <p className="text-xs text-(--gray-11)">
                          Only invited users would see this course
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                )}
              />
            </SettingSection>

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
        </SettingCard>
        <SettingCard variant="danger">
          <SettingHeader>
            <SettingTitle variant="danger">Danger Zone</SettingTitle>
            <SettingDescription variant="danger">
              Deleting this course will permanently remove all associated data.
              This action cannot be undone.
            </SettingDescription>
            <SettingDivider variant="danger" />
          </SettingHeader>
          <DeleteCourseDialog>
            <DeleteCourseDialogTrigger asChild>
              <Button variant="danger" className="h-10">
                <Trash size="1rem" className="mr-2" />
                Delete Course
              </Button>
            </DeleteCourseDialogTrigger>
          </DeleteCourseDialog>
        </SettingCard>
      </SettingLayout>
    </>
  );
}

export default SettingPage;
