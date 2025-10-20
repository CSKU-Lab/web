"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import Input from "~/components/commons/Input";
import { cmsCourseService } from "~/services/cms-course.service";
import { createCourseSchame } from "../_schemas/course.create";
import { useState } from "react";
import type { CreateCourse } from "~/types/cms-course";
import { toast } from "sonner";
import Label from "~/components/commons/Label";
import InlineError from "~/components/commons/InlineError";
import AutoComplete from "~/components/commons/AutoComplete";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import { Skeleton } from "~/components/ui/skeleton";
import { userService } from "~/services/user.service";

function CreateCourseButton() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(createCourseSchame),
    defaultValues: {
      name: "",
      creators: [],
    },
  });

  const mutation = useMutation({
    mutationFn: async (course: CreateCourse) =>
      await cmsCourseService.create(course),
    onSuccess: () => {
      toast.success("Course created successfully!");
      setIsOpen(false);
      form.reset();
    },
  });

  const queryUsers = async (query: string) => {
    const res = await userService.getUserPagination({
      search: query,
      sortBy: "display_name",
    });

    return res.data.map((user) => ({
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      profile_image: user.profile_image,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="my-4 shrink-0 px-3 py-1.5">
          <Plus size="1rem" />
          New course
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="p-4">
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit((course) => mutation.mutate(course))}>
          <div className="p-4 space-y-6">
            <div className="space-y-2">
              <Label isError={!!form.formState.errors.name} htmlFor="name">
                Name
              </Label>
              <Input
                isError={!!form.formState.errors.name}
                id="name"
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
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="px-6" variant="primary">
                Close
              </Button>
            </DialogClose>
            <Button
              isLoading={mutation.isPending}
              className="px-6"
              variant="action"
              type="submit"
            >
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCourseButton;
