import { api } from "~/lib/api";
import { PaginationMixin } from "./pagination.mixin";
import type { UserGroup } from "~/types/user-group";
import type { PaginationRequestParams } from "~/types/pagination";

export type GetUserGroupPaginationParams = Partial<
  PaginationRequestParams<UserGroup>
>;

class UserGroupService {
  _baseURL: string = "/admin/user-groups";

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
  UserGroup,
  typeof UserGroupService
>(UserGroupService))();
