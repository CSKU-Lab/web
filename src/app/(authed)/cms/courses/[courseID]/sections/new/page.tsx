"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Button } from "~/components/commons/Button";
import { FileUploader } from "~/components/commons/FileUploader";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import SectionCard from "~/components/commons/SectionCard";
import UserAutoComplete from "~/components/commons/UserAutoComplete";
import {
  type CreateSectionBannerImage,
  type CreateSectionSchema,
  createSectionSchema,
} from "./_schemas/create-section.schema";
import SearchSelect from "~/components/commons/SearchSelect";
import StudentImport from "./_components/StudentImport";

function NewSectionPage() {
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
    const MOCK_SEMESTERS = [
      { id: "1", name: "Spring 2024" },
      { id: "2", name: "Summer 2024" },
      { id: "3", name: "Fall 2024" },
      { id: "4", name: "Winter 2024" },
    ];
    return MOCK_SEMESTERS.filter((semester) =>
      semester.name.toLowerCase().includes(query.toLowerCase()),
    );
  };

  const handleOnSubmit = (data: CreateSectionSchema) => {
    console.log(data);
  };

  return (
    <form onSubmit={form.handleSubmit(handleOnSubmit)}>
      <div className="relative">
        <div className="absolute left-4.5 w-1 h-130 bg-(--gray-5)"></div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-(--accent-color) text-(--on-accent-color) flex items-center justify-center font-semibold z-10 border-4 border-(--gray-5)">
            1
          </div>
          <h3 className="font-medium">Section Detail</h3>
        </div>
        <div className="mt-2 ml-12 flex gap-4">
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
                    >
                      {(options) =>
                        options.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => onChange(option)}
                            className="block text-sm mb-2 px-2 py-1 hover:bg-(--gray-3) rounded-md w-full text-left"
                          >
                            {option.name}
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
                <span className="text-(--gray-10) text-sm">(optional)</span>
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
          <div className="w-120 self-stretch flex flex-col gap-2">
            <Label>Preview</Label>
            <SectionCard
              name={getName()}
              instructor={getInstructors()}
              semester={getSemester()}
              bannerImage={form.watch("bannerImage")?.preview}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-8">
          <div className="w-10 h-10 rounded-full bg-(--accent-color) text-(--on-accent-color) flex items-center justify-center font-semibold z-10 border-4 border-(--gray-5)">
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
              />
            )}
          />

          <div className="flex items-center gap-2">
            <h6 className="text-sm text-(--gray-11)">or import by username</h6>
          </div>
          <StudentImport form={form} />
        </div>
        <Button
          type="submit"
          className="ml-12 mt-6 px-8 py-2 font-semibold"
          variant="action"
        >
          Create
        </Button>
      </div>
    </form>
  );
}

export default NewSectionPage;
