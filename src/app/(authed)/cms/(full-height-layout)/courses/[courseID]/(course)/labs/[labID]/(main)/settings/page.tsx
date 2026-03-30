"use client";

import { Save, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { Button } from "~/components/commons/Button";
import SettingPaper from "~/components/commons/SettingPaper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  cmsLabService,
  type UpdateLabPayload,
} from "~/services/cms-lab.service";
import { toast } from "sonner";
import { queryKeys } from "~/queryKeys";
import { updateLabSchema } from "./schemas/update-lab.schema";
import { z } from "zod";
import Label from "~/components/commons/Label";
import Input from "~/components/commons/Input";
import useGetLab from "../../_hooks/useGetLab";
import DeleteLabDialog, {
  DeleteLabDialogTrigger,
} from "./_components/DeleteLabDialog";

export default function SettingPage() {
  const { labID, courseID } = useParams<{ labID: string; courseID: string }>();
  const { data: lab } = useGetLab({ labID });

  type FormValues = z.infer<typeof updateLabSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(updateLabSchema),
  });

  useEffect(() => {
    form.setValue("display_name", lab?.display_name ?? "");
  }, [form, lab]);

  const ctx = useQueryClient();
  const updateLab = useMutation({
    mutationFn: async (lab: UpdateLabPayload) =>
      await cmsLabService.updateById(labID, lab),
    onSuccess: async () => {
      toast.success("Lab updated successfully!");
      // Invalidate specific lab detail query
      await ctx.invalidateQueries({
        queryKey: queryKeys.lab.getById(labID),
      });
      // Invalidate all labs list queries (for lab lists in other views)
      await ctx.invalidateQueries({
        queryKey: queryKeys.lab.all,
      });
      // Invalidate lab materials since they may reference lab details
      await ctx.invalidateQueries({
        queryKey: queryKeys.lab.materials.all(labID),
      });
      // Invalidate parent course to refresh course detail views that show lab info
      await ctx.invalidateQueries({
        queryKey: queryKeys.course.getById(courseID),
      });
      // Invalidate breadcrumb cache for this lab
      await ctx.invalidateQueries({
        queryKey: ["breadcrumb", "lab", labID],
      });
      // Invalidate breadcrumb cache for parent course
      await ctx.invalidateQueries({
        queryKey: ["breadcrumb", "course", courseID],
      });
    },
  });

  const isUpdated = form.watch("display_name") === lab?.display_name;

  if (!lab) return null;

  const handleUpdateLab = async (data: updateLabSchema) => {
    updateLab.mutate({
      displayName: data.display_name,
    });
  };

  const dangerAction = () => (
    <DeleteLabDialog>
      <DeleteLabDialogTrigger asChild>
        <Button variant="danger" className="h-10">
          <Trash size="1rem" className="mr-2" />
          Delete Lab
        </Button>
      </DeleteLabDialogTrigger>
    </DeleteLabDialog>
  );

  return (
    <>
      <SettingPaper
        title="Lab Settings"
        description="Manage your lab details."
        dangerTitle="Danger Zone"
        dangerDescription="Deleting this lab will permanently remove all associated data."
        dangerAction={dangerAction()}
      >
        <form
          onSubmit={form.handleSubmit(handleUpdateLab)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-lg font-medium text-gray-900">General</h3>
              <p className="text-sm text-gray-600">
                Fill in the details of your lab.
              </p>
            </div>

            <div className="space-y-2">
              <Label isError={!!form.formState.errors.display_name}>
                Display Name <span className="text-(--red-9)">*</span>
              </Label>
              <div>
                <Input
                  isError={!!form.formState.errors.display_name}
                  placeholder="e.g. Python - Control flow statements"
                  {...form.register("display_name")}
                />
                <p className="text-xs mt-1 text-(--red-9)">
                  {form.formState.errors.display_name?.message}
                </p>
              </div>
            </div>
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
      </SettingPaper>
    </>
  );
}
