"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  type CreateDefaultLabParams,
  cmsDefaultLabService,
} from "~/services/cms-default-lab.service";

import type { CreateDefaultLabSchema } from "~/features/cms/courses/schemas/labs/create-default-lab.schema";
import { Switch } from "~/components/ui/switch";

type DefaultSwitchProps = {
  courseID: string;
  data: CreateDefaultLabSchema;
  isDefault: boolean;
  onToggle?: (labId: string, isDefault: boolean) => void;
};

export default function DefaultSwitch({
  courseID,
  data,
  isDefault,
  onToggle,
}: DefaultSwitchProps) {
  const [checked, setChecked] = useState(isDefault);

  const deleteDefaultLab = useMutation({
    mutationFn: () => cmsDefaultLabService.delete(courseID, data.lab_id),

    onSuccess: () => {
      toast.success("Default Lab unset successfully");
      onToggle?.(data.lab_id, false);
    },

    onError: () => {
      setChecked(true);
      toast.error("Failed to unset Default Lab");
    },
  });

  const createDefaultLab = useMutation({
    mutationFn: (params: CreateDefaultLabParams) =>
      cmsDefaultLabService.create(params),

    onSuccess: () => {
      toast.success("Default Lab set successfully");
      onToggle?.(data.lab_id, true);
    },

    onError: () => {
      setChecked(false);
      toast.error("Failed to set Default Lab");
    },
  });

  const handleCheckedChange = (next: boolean) => {
    setChecked(next);
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
    <label
      className="relative inline-flex items-center cursor-pointer"
      onClick={(e) => e.stopPropagation()}
    >
      <Switch
        checked={checked}
        disabled={createDefaultLab.isPending || deleteDefaultLab.isPending}
        onCheckedChange={handleCheckedChange}
      />
    </label>
  );
}