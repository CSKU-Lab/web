import type { CMSUserGroup } from "~/types/cms-user-group";
import type { PaginationRequestParams } from "~/types/pagination";
import { BaseService } from "./base.service";

export type GetUserGroupPaginationParams =
  PaginationRequestParams<CMSUserGroup>;

class UserGroupService extends BaseService {
  constructor() {
    super("/admin/user-groups");
  }

  async create(name: string) {
    return this.api.post(this._baseURL, {
      name,
    });
  }

  async getPagination(params: GetUserGroupPaginationParams) {
    return this._getPagination<CMSUserGroup>(params);
  }

  async uppdate(id: string, name: string) {
    return this.api.patch(`${this._baseURL}/${id}`, { name });
  }

  async delete(id: string) {
    return this.api.delete(`${this._baseURL}/${id}`);
  }
}

export const userGroupService = new UserGroupService();
