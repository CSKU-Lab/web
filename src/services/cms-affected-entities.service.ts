<<<<<<< HEAD
import type {
  AffectedEntities,
  AffectedType,
} from "~/types/cms-affected-entities";
import { BaseService } from "./base.service";
||||||| parent of b8906f9 (add: lab management pages & integrate: with be apis)
import { api } from "~/lib/api.client";
import type { AffectedEntities } from "~/types/cms-affected-entities";
=======
import { api } from "~/lib/api.client";
import type {
  AffectedEntities,
  AffectedType,
} from "~/types/cms-affected-entities";
>>>>>>> b8906f9 (add: lab management pages & integrate: with be apis)

<<<<<<< HEAD
class AffectedEntitiesService extends BaseService {
  constructor() {
    super("/cms/affected-entities");
  }
  async get(type: AffectedType, id: string): Promise<AffectedEntities[]> {
    const res = await this.api.post<AffectedEntities[]>(this._baseURL, {
||||||| parent of b8906f9 (add: lab management pages & integrate: with be apis)
class AffectedEntitiesService {
  async get(
    type: "course" | "semester",
    id: string,
  ): Promise<AffectedEntities[]> {
    const res = await api.post<AffectedEntities[]>(`/cms/affected-entities`, {
=======
class AffectedEntitiesService {
  async get(type: AffectedType, id: string): Promise<AffectedEntities[]> {
    const res = await api.post<AffectedEntities[]>(`/cms/affected-entities`, {
>>>>>>> b8906f9 (add: lab management pages & integrate: with be apis)
      type,
      id,
    });
    return res.data;
  }
}

export const cmsAffectedEntitiesService = new AffectedEntitiesService();
