"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import InlineError from "~/components/commons/InlineError";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import { createCourseSchame } from "../_schemas/course.create";
import { useMutation } from "@tanstack/react-query";
import type { WriteCourse } from "~/types/cms-course";
import { cmsCourseService } from "~/services/cms-course.service";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Button } from "~/components/commons/Button";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import PageTitle from "~/components/commons/PageTitle";
import UserAutoComplete from "~/components/commons/UserAutoComplete";

function NewCoursePage() {
  const form = useForm({
    resolver: zodResolver(createCourseSchame),
    defaultValues: {
      name: "",
      creators: [],
      visibility: "public",
    },
  });

  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async (course: WriteCourse) =>
      await cmsCourseService.create(course),
    onSuccess: (res) => {
      toast.success("Course created successfully!");
      router.push(`/cms/courses/${res.id}`);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        form.setError("name", { message: err.response?.data.error });
      }
    },
  });

  return (
    <div>
      <PageTitle>New Course</PageTitle>
      <form
        onSubmit={form.handleSubmit((course) => mutation.mutate(course))}
        className="md:w-4/5 mt-4 space-y-10 p-4"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <h5 className="text-xl font-medium">General</h5>
            <p className="text-sm text-(--gray-10)">
              Fill in the details of your course.
            </p>
            <hr />
          </div>
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Programming Course"
              {...form.register("name")}
            />
            <InlineError isError={!!form.formState.errors.name}>
              {form.formState.errors.name?.message}
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
              render={({ field }) => <UserAutoComplete {...field} />}
            />
            <InlineError isError={!!form.formState.errors.creators}>
              course creators is required
            </InlineError>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <h5 className="text-xl font-medium">Visibility</h5>
            <p className="text-sm text-(--gray-10)">
              Choose who can see this course.
            </p>
            <hr />
          </div>
          <Controller
            control={form.control}
            name="visibility"
            render={({ field: { value, onChange } }) => (
              <RadioGroup
                value={value}
                onValueChange={onChange}
                defaultValue="public"
                className="space-y-2 mt-4"
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
                    <Label htmlFor="private" className="font-medium">
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
        </div>
        <Button type="submit" variant="action">
          Create
        </Button>
      </form>
    </div>
  );
}

export default NewCoursePage;
