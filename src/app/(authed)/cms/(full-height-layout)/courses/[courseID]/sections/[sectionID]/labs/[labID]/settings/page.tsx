"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import RouteNavigation from "../../../_components/RouteNavigation";
import PageTitle from "~/components/commons/PageTitle";
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

import { useGetSectionLab } from "../_hooks/useGetSectionLab";
import {
  updateSectionLabSchema,
  statusOptions,
  showDateFieldsStatuses,
  type UpdateSectionLabSchema,
} from "./_schemas/update-section-lab.schema";
import { useUpdateSectionLab } from "./_hooks/useUpdateSectionLab";
import type { LabStatus } from "~/types/cms-section-lab";

interface PageParams {
  [key: string]: string;
  courseID: string;
  sectionID: string;
  labID: string;
}

const statusConfig: Record<LabStatus, { text: string; colorClass: string }> = {
  open: { text: "Open", colorClass: "text-(--grass-9)" },
  readonly: { text: "Readonly", colorClass: "text-(--blue-9)" },
  hidden: { text: "Hidden", colorClass: "text-(--gray-9)" },
  disabled: { text: "Disabled", colorClass: "text-(--amber-9)" },
  closed: { text: "Closed", colorClass: "text-(--red-9)" },
};

export default function SettingsPage() {
  const { courseID, sectionID, labID } = useParams<PageParams>();

  const { data: lab, isLoading: isLabLoading } = useGetSectionLab({
    sectionID,
    labID,
  });

  const form = useForm<UpdateSectionLabSchema>({
    resolver: zodResolver(updateSectionLabSchema),
    defaultValues: {
      status: "hidden",
      opened_at: null,
      closed_at: null,
    },
  });

  const updateSectionLab = useUpdateSectionLab({
    sectionID,
    labID,
  });

  useEffect(() => {
    if (lab) {
      form.reset({
        status: lab.status,
        opened_at: lab.opened_at ? new Date(lab.opened_at) : null,
        closed_at: lab.closed_at ? new Date(lab.closed_at) : null,
      });
    }
  }, [lab, form]);

  const watchedStatus = form.watch("status");
  const showDateFields = showDateFieldsStatuses.includes(watchedStatus);

  useEffect(() => {
    if (!showDateFields) {
      form.setValue("opened_at", null);
      form.setValue("closed_at", null);
    }
  }, [showDateFields, form]);

  const statusStyle = lab ? statusConfig[lab.status] : null;

  const labMenus = [
    {
      name: "Materials",
      href: `/cms/courses/${courseID}/sections/${sectionID}/labs/${labID}`,
    },
    {
      name: "Settings",
      href: `/cms/courses/${courseID}/sections/${sectionID}/labs/${labID}/settings`,
    },
  ];

  const handleSubmit = async (data: UpdateSectionLabSchema) => {
    try {
      await updateSectionLab.mutateAsync(data);
      toast.success("Lab settings updated successfully!");
    } catch {
      toast.error("Failed to update lab settings");
    }
  };

  const disableSaveButton =
    isLabLoading ||
    updateSectionLab.isPending ||
    !form.formState.isDirty;

  return (
    <>
      <RouteNavigation
        headerContent={
          <>
            <Link
              href={`/cms/courses/${courseID}/sections/${sectionID}/labs`}
              className="inline-flex items-center gap-2 text-sm text-(--gray-11) hover:text-(--gray-12) mb-2 transition-colors ml-4 my-2.5"
            >
              <ArrowLeft size={16} />
              <span>Back to Labs</span>
            </Link>
            <PageTitle>{lab?.lab_name ?? "Loading..."}</PageTitle>
            {!isLabLoading && lab && (
              <div className="flex items-center gap-3 ml-4 mt-1 text-sm text-(--gray-11)">
                <span className={cn("font-medium", statusStyle?.colorClass)}>
                  {statusStyle?.text}
                </span>
                <span>•</span>
                <span>
                  {lab.completed_students}/{lab.total_students} students
                  completed
                </span>
              </div>
            )}
          </>
        }
        menus={labMenus}
      />

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
                <h3 className="text-lg font-medium text-gray-900">Status</h3>
                <p className="text-sm text-gray-600">
                  Set the visibility and availability of this lab.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={form.watch("status")}
                  onValueChange={(value: LabStatus) =>
                    form.setValue("status", value)
                  }
                >
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
                            option.value === "closed" && "bg-(--red-9)",
                          )}
                        />
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {showDateFields && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h3 className="text-lg font-medium text-gray-900">
                    Schedule
                  </h3>
                  <p className="text-sm text-gray-600">
                    Set when the lab should open and close.
                  </p>
                </div>

                <div className="grid grid-cols-1 @md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Opened At</Label>
                    <DateTimePicker
                      value={form.watch("opened_at") ?? undefined}
                      onChange={(date) =>
                        form.setValue("opened_at", date ?? null)
                      }
                    />
                    <p className="text-xs text-(--gray-9)">
                      When the lab becomes available to students
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Closed At</Label>
                    <DateTimePicker
                      value={form.watch("closed_at") ?? undefined}
                      onChange={(date) =>
                        form.setValue("closed_at", date ?? null)
                      }
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
