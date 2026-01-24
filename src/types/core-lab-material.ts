import { Material } from "./core-material";

export interface LabMaterial {
  id: string;
  lab_id: string;
  material_id: string;
  material_data: Material;
  created_at: Date;
}
