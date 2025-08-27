"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash, X } from "lucide-react";
import React, { useCallback, useEffect } from "react";
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
import { userService } from "~/services/user.service";
import AutoComplete from "~/components/commons/AutoComplete";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import { Skeleton } from "~/components/ui/skeleton";
import useGetCourse from "../_hooks/useGetCourse";
import { useParams } from "next/navigation";
import { queryKeys } from "~/queryKeys";

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

  const queryUsers = useCallback(async (query: string) => {
    const res = await userService.getPagination({
      search: query,
      sort_by: "display_name",
    });

    return res.data.map((user) => ({
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      profile_image: user.profile_image,
    }));
  }, []);

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
                  <AutoComplete
                    {...{ value, onChange }}
                    isError={!!form.formState.errors.creators}
                    renderSelected={(creator) => (
                      <div
                        key={creator.id}
                        className="flex items-center gap-2 shrink-0 bg-(--gray-4) pl-2 pr-3 py-0.5 rounded-full"
                      >
                        <UserProfileImage
                          username={creator.username}
                          src={creator.profile_image}
                          size="1.5rem"
                          textSize="0.5rem"
                        />
                        <span className="text-xs">{creator.display_name}</span>
                        <button
                          className="text-(--gray-11) hover:text-(--gray-12) focus:outline-none"
                          type="button"
                          onClick={() =>
                            onChange(value.filter((c) => c.id !== creator.id))
                          }
                        >
                          <X size="0.8rem" />
                        </button>
                      </div>
                    )}
                    queryFn={queryUsers}
                    loadingFallback={Array.from({ length: 5 }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="flex items-center px-2 py-1.5 gap-2"
                        >
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <Skeleton className="w-32 h-4 rounded" />
                        </div>
                      ),
                    )}
                  >
                    {(options) =>
                      options.map((creator) => (
                        <button
                          onClick={() => onChange([...value, creator])}
                          key={creator.id}
                          className="flex items-center px-2 py-1.5 gap-2 hover:bg-gray-100 cursor-pointer w-full rounded-md"
                        >
                          <UserProfileImage
                            src={creator.profile_image}
                            username={creator.display_name}
                          />
                          <div className="flex-1 space-y-0.5 grid text-left">
                            <h4 className="text-sm font-medium truncate text-(--gray-12) leading-tight">
                              {creator.display_name}
                            </h4>
                            <h6 className="text-xs font-light text-(--gray-10)">
                              @{creator.username}
                            </h6>
                          </div>
                        </button>
                      ))
                    }
                  </AutoComplete>
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
