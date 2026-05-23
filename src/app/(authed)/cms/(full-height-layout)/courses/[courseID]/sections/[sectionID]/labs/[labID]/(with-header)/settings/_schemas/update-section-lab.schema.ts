import { z } from "zod";
import type { LabStatus } from "~/types/cms-section-lab";

export const updateSectionLabSchema = z.object({
  status: z.enum(["hidden", "open", "readonly", "disabled"]),
  opened_at: z.date().nullable(),
  readonly_at: z.date().nullable(),
});

export type UpdateSectionLabSchema = z.infer<typeof updateSectionLabSchema>;

export const statusOptions: { value: LabStatus; label: string }[] = [
  { value: "hidden", label: "Hidden" },
  { value: "open", label: "Open" },
  { value: "readonly", label: "Readonly" },
  { value: "disabled", label: "Disabled" },
];

export const showDateFieldsStatuses: LabStatus[] = [
  "hidden",
  "open",
  "readonly",
];
