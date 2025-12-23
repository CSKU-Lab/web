import type {
  AffectedEntities,
  AffectedType,
} from "~/types/cms-affected-entities";
import { BaseService } from "./base.service";

class AffectedEntitiesService extends BaseService {
  constructor() {
    super("/cms/affected-entities");
  }
  async get(type: AffectedType, id: string): Promise<AffectedEntities[]> {
    const res = await this.api.post<AffectedEntities[]>("", {
      type,
      id,
    });
    return res.data;
  }
}

export const cmsAffectedEntitiesService = new AffectedEntitiesService();
