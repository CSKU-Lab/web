"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "~/components/commons/Button";
import { FileUploader } from "~/components/commons/FileUploader";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import UserAutoComplete from "~/components/commons/UserAutoComplete";
import {
  type CreateSectionBannerImage,
  type CreateSectionSchema,
  createSectionSchema,
} from "~/features/cms/sections/schemas/create-section.schema";
import SearchSelect from "~/components/commons/SearchSelect";
import StudentImport from "~/features/cms/sections/components/StudentImport";
import { useMutation } from "@tanstack/react-query";
import {
  cmsSectionService,
  type CreateSectionPayload,
} from "~/services/cms-section.service";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { cmsSemesterService } from "~/services/cms-semester.service";
import { PreviewCMSSectionCard } from "~/components/commons/SectionCard";
import PageTitle from "~/components/commons/PageTitle";
import { cmsUserExistanceService } from "~/services/cms-user-existances.service";

function NewSectionView() {
  const form = useForm({
    resolver: zodResolver(createSectionSchema),
    defaultValues: {
      name: "",
      instructors: [],
      bannerImage: {
        file: null,
        preview: null,
      },
      semester: {
        id: "",
        name: "",
      },
      students_input: [],
      students_upload: [],
    },
  });

  const getName = () => {
    if (form.watch("name").trim() === "") {
      return "Section Name";
    }
    return form.watch("name");
  };

  const getInstructors = () => {
    const instructors = form.watch("instructors");
    if (instructors.length === 0) {
      return ["Instructor Name"];
    }
    return instructors.map((instructor) => instructor.display_name);
  };

  const getSemester = () => {
    if (form.watch("semester").name.trim() === "") {
      return "Semester";
    }
    return form.watch("semester").name;
  };

  const handleOnFileSelect = (
    onChange: (payload: CreateSectionBannerImage) => void,
  ) => {
    return (files: File[]) => {
      const file = files[0];
      if (!file) return;

      // Create preview URL using FileReader for base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange({
          file,
          preview: result, // This will be a base64 data URL
        });
      };
      reader.readAsDataURL(file);
    };
  };

  const querySemesters = async (query: string) => {
    const res = await cmsSemesterService.getPagination({
      search: query,
      page_size: 10,
      page: 1,
    });
    return res.data;
  };

  const { courseID } = useParams<{ courseID: string }>();
  const router = useRouter();
  const createSection = useMutation({
    mutationFn: (data: CreateSectionSchema) => {
      const students = data.students_input
        .map((student) => student.username)
        .concat(data.students_upload);

      const payload: CreateSectionPayload = {
        name: data.name,
        course_id: courseID,
        semester_id: data.semester.id,
        instructors: data.instructors.map((instructor) => instructor.id),
        students,
        banner: (data.bannerImage.file as File) ?? null,
      };

      return cmsSectionService.create(payload);
    },
    onSuccess: (sectionID) => {
      toast.success("Section created successfully!");
      router.push(`/cms/courses/${courseID}/sections/${sectionID}`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const handleOnSubmit = async (data: CreateSectionSchema) => {
    try {
      const students = data.students_input
        .map((student) => student.username)
        .concat(data.students_upload);

      if (students.length > 0) {
        const res = await cmsUserExistanceService.check({
          find_by: "username",
          role: "student",
          users: students,
        });

        if (res.code === "INVALID_USERS") {
          toast.error("Error", { description: "Some students do not exist" });
          return;
        }
      }

      createSection.mutate(data);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description:
            err.response?.data.error || "An unexpected error occurred",
        });
      }
    }
  };

  return (
    <>
      <PageTitle>New Section</PageTitle>
      <form
        onSubmit={form.handleSubmit(handleOnSubmit)}
        className="relative mt-4 p-4"
      >
        <div className="absolute left-8.25 w-1 h-130 bg-(--gray-5)"></div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold z-10 border-4 border-(--gray-5)">
            1
          </div>
          <h3 className="font-medium">Section Detail</h3>
        </div>
        <div className="mt-2 ml-12 flex flex-col xl:flex-row gap-4">
          <div className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <Label className="gap-0" isError={!!form.formState.errors.name}>
                Name <span className="text-(--red-9)">*</span>
              </Label>
              <div>
                <Input
                  isError={!!form.formState.errors.name}
                  placeholder="e.g. SEC001"
                  {...form.register("name")}
                />
                <p className="text-xs mt-1 text-(--red-9)">
                  {form.formState.errors.name?.message}
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label
                className="gap-0"
                isError={!!form.formState.errors.instructors}
              >
                Instructors <span className="text-(--red-9)">*</span>
              </Label>
              <Controller
                control={form.control}
                name="instructors"
                render={({ field: { value, onChange } }) => (
                  <div>
                    <UserAutoComplete
                      isError={!!form.formState.errors.instructors}
                      value={value}
                      onChange={onChange}
                    />
                    <p className="text-xs mt-1 text-(--red-9)">
                      {form.formState.errors.instructors?.message}
                    </p>
                  </div>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                className="gap-0"
                isError={!!form.formState.errors.semester}
              >
                Semester <span className="text-(--red-9)">*</span>
              </Label>
              <Controller
                control={form.control}
                name="semester"
                render={({ field: { value, onChange } }) => (
                  <div>
                    <SearchSelect
                      isError={!!form.formState.errors.semester}
                      value={value}
                      queryFn={querySemesters}
                      className="w-full"
                      customValueRender={(sem) =>
                        sem.id === "" && sem.name === ""
                          ? ""
                          : `${sem.name}/${sem.type}`
                      }
                    >
                      {(options) =>
                        options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => onChange(option)}
                            className="block text-sm mb-2 px-2 py-1 hover:bg-(--gray-3) rounded-md w-full text-left"
                          >
                            {`${option.name}/${option.type}`}
                          </button>
                        ))
                      }
                    </SearchSelect>
                    <p className="text-xs mt-1 text-(--red-9)">
                      {form.formState.errors.semester?.message}
                    </p>
                  </div>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>
                Banner
                <span className="text-(--gray-10) text-sm">(optional · Recommended 1280×720px · 16:9)</span>
              </Label>
              <Controller
                control={form.control}
                name="bannerImage"
                render={({ field: { onChange } }) => (
                  <FileUploader
                    onFileSelect={handleOnFileSelect(onChange)}
                    accept={{ "image/*": [] }}
                    maxSize={10000000}
                    className="h-40"
                  />
                )}
              />
            </div>
          </div>
          <div className="w-full xl:w-96 flex flex-col gap-2">
            <Label>Preview</Label>
            <PreviewCMSSectionCard
              name={getName()}
              instructors={getInstructors()}
              semester={getSemester()}
              bannerImage={form.watch("bannerImage")?.preview}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-8">
          <div className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold z-10 border-4 border-(--gray-5)">
            2
          </div>
          <h3 className="font-medium">
            Add/Import Students{" "}
            <span className="text-(--gray-10) text-sm">(optional)</span>
          </h3>
        </div>
        <div className="space-y-4 mt-2 ml-12">
          <Controller
            control={form.control}
            name="students_input"
            render={({ field: { value, onChange } }) => (
              <UserAutoComplete
                value={value!}
                onChange={onChange}
                placeHolder="Type student name"
                role="student"
              />
            )}
          />

          <div className="flex items-center gap-2">
            <h6 className="text-sm text-(--gray-11)">or import by username</h6>
          </div>
          <Controller
            control={form.control}
            name="students_upload"
            render={({ field }) => <StudentImport {...field} />}
          />
        </div>
        <Button
          type="submit"
          className="ml-12 mt-6 px-8 py-2 font-semibold"
          variant="action"
        >
          Create
        </Button>
      </form>
    </>
  );
}

export default NewSectionView;
