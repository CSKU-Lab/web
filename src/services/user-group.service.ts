import { api } from "~/lib/api.client";
import { PaginationMixin } from "./pagination.mixin";
import type { CMSUserGroup } from "~/types/cms-user-group";
import type { PaginationRequestParams } from "~/types/pagination";
import { BaseService } from "./base.service";

export type GetUserGroupPaginationParams = Partial<
  PaginationRequestParams<CMSUserGroup>
>;

class UserGroupService extends BaseService {
  constructor() {
    super("/admin/user-groups");
  }

  async create(name: string) {
    return api.post(this._baseURL, {
      name,
    });
  }

  async uppdate(id: string, name: string) {
    return api.patch(`${this._baseURL}/${id}`, { name });
  }

  async delete(id: string) {
    return api.delete(`${this._baseURL}/${id}`);
  }
}

export const userGroupService = new (PaginationMixin<
  CMSUserGroup,
  typeof UserGroupService
>(UserGroupService))();
