"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

import {
  type CreateDefaultLabParams,
  cmsDefaultLabService,
} from "~/services/cms-default-lab.service";

import type { CreateDefaultLabSchema } from "../_schemas/create-default-lab.schema";
import { Switch } from "~/components/ui/switch";

type DefaultSwitchProps = {
  courseID: string;
  data: CreateDefaultLabSchema;
  isDefault: boolean;
};

export default function DefaultSwitch({
  courseID,
  data,
  isDefault,
}: DefaultSwitchProps) {
  const [checked, setChecked] = useState(isDefault);

  const deleteDefaultLab = useMutation({
    mutationFn: () => cmsDefaultLabService.delete(courseID, data.lab_id),

    onSuccess: () => {
      toast.success("Default Lab unset successfully");
      setChecked(false);
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description:
            err.response?.data.error || "Failed to unset Default Lab",
        });
        return;
      }

      toast.error("Something went wrong. Please try again.");
    },
  });

  const createDefaultLab = useMutation({
    mutationFn: (params: CreateDefaultLabParams) =>
      cmsDefaultLabService.create(params),

    onSuccess: () => {
      toast.success("Default Lab set successfully");
      setChecked(true);
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data.error || "Failed to set Default Lab",
        });
        return;
      }

      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleCheckedChange = (next: boolean) => {
    if (next) {
      createDefaultLab.mutate({
        courseID,
        payload: {
          lab_id: data.lab_id,
        },
      });
    } else {
      deleteDefaultLab.mutate();
    }
  };

  return (
    <Switch
      checked={checked}
      disabled={createDefaultLab.isPending || deleteDefaultLab.isPending}
      onCheckedChange={handleCheckedChange}
    />
  );
}
