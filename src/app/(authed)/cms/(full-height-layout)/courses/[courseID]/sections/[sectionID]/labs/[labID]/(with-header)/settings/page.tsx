"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Save, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "~/components/commons/Button";
import Label from "~/components/commons/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/commons/Select";
import { DateTimePicker } from "~/components/commons/DateTimePicker";
import SettingPaper from "~/components/commons/SettingPaper";
import { cn } from "~/lib/utils";

import { useGetSectionLab } from "../../_hooks/useGetSectionLab";
import {
  updateSectionLabSchema,
  statusOptions,
  showDateFieldsStatuses,
  type UpdateSectionLabSchema,
} from "./_schemas/update-section-lab.schema";
import { useUpdateSectionLab } from "./_hooks/useUpdateSectionLab";

export default function SettingsPage() {
  const { sectionID, labID } = useParams<{
    courseID: string;
    sectionID: string;
    labID: string;
  }>();

  const { data: lab, isFetching } = useGetSectionLab({
    sectionID,
    labID,
  });

  const form = useForm<UpdateSectionLabSchema>({
    resolver: zodResolver(updateSectionLabSchema),
    defaultValues: {
      status: "hidden",
      opened_at: null,
      readonly_at: null,
    },
  });

  const updateSectionLab = useUpdateSectionLab({
    sectionID,
    labID,
  });

  useEffect(() => {
    if (lab && !isFetching) {
      form.reset({
        status: lab.status,
        opened_at: lab.opened_at ? new Date(lab.opened_at) : null,
        readonly_at: lab.readonly_at ? new Date(lab.readonly_at) : null,
      });
    }
  }, [lab, isFetching, form]);

  const watchedStatus = form.watch("status");
  const showDateFields = showDateFieldsStatuses.includes(watchedStatus);

  useEffect(() => {
    if (!showDateFields) {
      console.log("clear opened_at and readonly_at because status");
      form.setValue("opened_at", null);
      form.setValue("readonly_at", null);
    }
  }, [showDateFields, watchedStatus, form]);

  const handleSubmit = async (data: UpdateSectionLabSchema) => {
    try {
      await updateSectionLab.mutateAsync(data);
      toast.success("Lab settings updated successfully!");
    } catch {
      toast.error("Failed to update lab settings");
    }
  };

  const disableSaveButton =
    isFetching || updateSectionLab.isPending || !form.formState.isDirty;

  return (
    <>
      <div className="flex flex-col h-full px-4 py-6">
        <SettingPaper
          title="Lab Status Settings"
          description="Configure the lab status and scheduling."
        >
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <h3 className="text-lg font-medium text-(--gray-12)">Status</h3>
                <p className="text-sm text-(--gray-11)">
                  Set the visibility and availability of this lab.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field: { value, onChange } }) => (
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger className="w-full h-9">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <span
                              className={cn(
                                "inline-block w-2 h-2 rounded-full mr-2",
                                option.value === "open" && "bg-(--grass-9)",
                                option.value === "readonly" && "bg-(--blue-9)",
                                option.value === "hidden" && "bg-(--gray-9)",
                                option.value === "disabled" && "bg-(--amber-9)",
                              )}
                            />
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {showDateFields && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-medium text-(--gray-12)">
                    Schedule
                  </h3>
                  <p className="text-sm text-(--gray-11)">
                    Set when the lab should start and end.
                  </p>
                </div>

                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Opened At</Label>
                    <Controller
                      control={form.control}
                      name="opened_at"
                      render={({ field: { value, onChange } }) => (
                        <div className="flex items-center gap-2">
                          <DateTimePicker
                            value={value ?? undefined}
                            onChange={(date) => onChange(date ?? null)}
                          />
                          {value && (
                            <button
                              type="button"
                              onClick={() => onChange(null)}
                              className="text-(--gray-9) hover:text-(--gray-12) transition-colors"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    />
                    <p className="text-xs text-(--gray-9)">
                      When the lab becomes available to students
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Readonly At</Label>
                    <Controller
                      control={form.control}
                      name="readonly_at"
                      render={({ field: { value, onChange } }) => (
                        <div className="flex items-center gap-2">
                          <DateTimePicker
                            value={value ?? undefined}
                            onChange={(date) => onChange(date ?? null)}
                          />
                          {value && (
                            <button
                              type="button"
                              onClick={() => onChange(null)}
                              className="text-(--gray-9) hover:text-(--gray-12) transition-colors"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    />
                    <p className="text-xs text-(--gray-9)">
                      When the lab closes for submissions
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="action"
              className="w-full h-10"
              disabled={disableSaveButton}
              isLoading={updateSectionLab.isPending}
            >
              <Save size="1rem" className="mr-2" />
              Save Changes
            </Button>
          </form>
        </SettingPaper>
      </div>
    </>
  );
}
