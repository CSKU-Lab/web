import { api } from "~/lib/api.client";
import type {
  AffectedEntities,
  AffectedType,
} from "~/types/cms-affected-entities";

class AffectedEntitiesService {
  async get(type: AffectedType, id: string): Promise<AffectedEntities[]> {
    const res = await api.post<AffectedEntities[]>(`/cms/affected-entities`, {
      type,
      id,
    });
    return res.data;
  }
}

export const cmsAffectedEntitiesService = new AffectedEntitiesService();
