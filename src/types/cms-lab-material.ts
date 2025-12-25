import { CMSMaterial } from "./cms-material";

export interface CMSLabMaterial {
  id: string;
  lab_id: string;
  material_id: string;
  material_data: CMSMaterial;
  created_at: Date;
}
