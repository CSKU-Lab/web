import { CMSMaterial } from "~/types/cms-material";

export interface CMSLabMaterial {
  id: string;
  lab_id: string;
  material_id: string;
  position: number;
  material_data: CMSMaterial;
  created_at: Date;
}
