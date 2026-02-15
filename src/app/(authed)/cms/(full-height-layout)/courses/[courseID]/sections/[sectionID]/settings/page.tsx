"use client";
import { Save, Trash } from "lucide-react";
import { Button } from "~/components/commons/Button";
import Label from "~/components/commons/Label";
import {
  SettingCard,
  SettingDescription,
  SettingDivider,
  SettingHeader,
  SettingLayout,
  SettingSection,
  SettingTitle,
} from "~/components/crafts/Settings";
import SectionBanner from "./_components/SectionBanner";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type UpdateSectionSchema,
  updateSectionSchema,
} from "./_schemas/update-section.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cmsSectionService,
  type UpdateSectionPayload,
} from "~/services/cms-section.service";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import Input from "~/components/crafts/Input";
import UserAutoComplete from "~/components/commons/UserAutoComplete";
import InlineError from "~/components/commons/InlineError";
import SearchSelect from "~/components/commons/SearchSelect";
import { cmsSemesterService } from "~/services/cms-semester.service";
import useGetSection from "../_hooks/useGetSection";
import { useEffect } from "react";
import { queryKeys } from "~/queryKeys";
import DeleteSectionDialog, {
  DeleteSectionDialogTrigger,
} from "./_components/DeleteSectionDialog";
import RouteNavigation from "../_components/RouteNavigation";

function SettingsPage() {
  const { data: section, isFetching } = useGetSection();

  const form = useForm({
    resolver: zodResolver(updateSectionSchema),
    defaultValues: {
      name: "",
      instructors: [],
      banner: null,
    },
  });

  useEffect(() => {
    if (section && !isFetching) {
      form.reset({
        name: section.name,
        instructors: section.instructors,
        semester: {
          id: section.semester.id,
          name: section.semester.name,
          type: section.semester.type,
        },
        banner: section.banner ?? null,
      });
    }
  }, [section, isFetching, form]);

  const { sectionID } = useParams<{ sectionID: string }>();
  const queryClient = useQueryClient();

  const updateSection = useMutation({
    mutationFn: (payload: UpdateSectionPayload) =>
      cmsSectionService.update(sectionID, payload),
    onSuccess: () => {
      toast.success("Section updated successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.section.getById(sectionID),
      });
    },
  });

  const disableSaveButton =
    isFetching || updateSection.isPending || !form.formState.isDirty;

  const handleOnSubmit = (data: UpdateSectionSchema) => {
    let banner = null;
    if (data.banner instanceof File) {
      banner = data.banner;
    }

    updateSection.mutate({
      name: data.name,
      instructors: data.instructors.map((instructor) => instructor.id),
      semester_id: data.semester.id,
      banner,
    });
  };

  const querySemesters = async (query: string) => {
    const res = await cmsSemesterService.getPagination({
      search: query,
      page_size: 10,
      page: 1,
    });
    return res.data;
  };

  return (
    <>
      <RouteNavigation title="Settings" />
      <SettingLayout>
        <SettingCard>
          <SettingHeader>
            <SettingTitle>Section Settings</SettingTitle>
            <SettingDescription>
              Manage your section settings
            </SettingDescription>
            <SettingDivider />
          </SettingHeader>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <SettingSection>
              <div className="space-y-2">
                <Label>
                  Banner{" "}
                  <span className="text-xs text-(--gray-11)">
                    (Max file size 10 MB, Only image allowed)
                  </span>
                </Label>
                <Controller
                  control={form.control}
                  name="banner"
                  render={({ field }) => <SectionBanner {...field} />}
                />
              </div>
              <div className="space-y-2">
                <Input label="Name" {...form.register("name")} />
                <InlineError isError={!!form.formState.errors.name}>
                  {form.formState.errors.name?.message}
                </InlineError>
              </div>
              <div className="space-y-2">
                <Label isError={false} htmlFor="creators">
                  Instructors
                </Label>
                <Controller
                  control={form.control}
                  name="instructors"
                  render={({ field }) => <UserAutoComplete {...field} />}
                />
                <InlineError isError={!!form.formState.errors.instructors}>
                  {form.formState.errors.instructors?.message}
                </InlineError>
              </div>
              <div className="space-y-1.5">
                <Label isError={!!form.formState.errors.semester}>
                  Semester
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
              <Button
                disabled={disableSaveButton}
                type="submit"
                variant="action"
                className="w-full h-9"
              >
                <Save size="1rem" />
                Save Changes
              </Button>
            </SettingSection>
          </form>
        </SettingCard>
        <SettingCard variant="danger">
          <SettingHeader>
            <SettingTitle variant="danger">Danger Zone</SettingTitle>
            <SettingDescription variant="danger">
              Deleting this section is irreversible. All associated data will be
              permanently removed.
            </SettingDescription>
            <SettingDivider />
          </SettingHeader>
          <SettingSection>
            <DeleteSectionDialog>
              <DeleteSectionDialogTrigger asChild>
                <Button variant="danger" className="h-9">
                  <Trash size="1rem" />
                  Delete Section
                </Button>
              </DeleteSectionDialogTrigger>
            </DeleteSectionDialog>
          </SettingSection>
        </SettingCard>
      </SettingLayout>
    </>
  );
}

export default SettingsPage;
