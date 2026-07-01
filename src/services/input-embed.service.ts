import { BaseService } from "~/services/base.service";

export interface InputEmbedSubmitParams {
  nodeID: string;
  value: string;
  documentMaterialID: string;
  labID: string;
  sectionID: string;
}

export interface InputEmbedSubmitResult {
  passed: boolean;
  score: number;
}

export interface InputEmbedMyResultParams {
  nodeID: string;
  documentMaterialID: string;
  labID: string;
  sectionID: string;
}

export interface InputEmbedMyResult {
  submitted: boolean;
  passed: boolean;
  score: number;
  value: string;
}

class InputEmbedService extends BaseService {
  constructor() {
    super("");
  }

  async submit({
    nodeID,
    value,
    documentMaterialID,
    labID,
    sectionID,
  }: InputEmbedSubmitParams): Promise<InputEmbedSubmitResult> {
    const res = await this.api.post<InputEmbedSubmitResult>(`/input-submissions`, {
      node_id: nodeID,
      document_material_id: documentMaterialID,
      lab_id: labID,
      section_id: sectionID,
      value,
    });
    return res.data;
  }

  async getMyResult({
    nodeID,
    documentMaterialID,
    labID,
    sectionID,
  }: InputEmbedMyResultParams): Promise<InputEmbedMyResult> {
    const params = new URLSearchParams({
      node_id: nodeID,
      document_material_id: documentMaterialID,
      lab_id: labID,
      section_id: sectionID,
    });
    const res = await this.api.get<InputEmbedMyResult>(
      `/input-submissions/my-result?${params.toString()}`,
    );
    return res.data;
  }
}

export const inputEmbedService = new InputEmbedService();
