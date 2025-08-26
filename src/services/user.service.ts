import { api } from "~/lib/api";
import type { PaginationRequestParams } from "~/types/pagination";
import type { CreateUser, User, UserRole } from "~/types/user";
import { PaginationMixin } from "./pagination.mixin";

export type GetUserPaginationParams = PaginationRequestParams<User>;

class UserService {
  _baseURL = "/admin/users";

  async deleteUser(id: string) {
    await api.delete(this._baseURL + `/${id}`);
  }

  async deleteManyUsers(IDs: string[]) {
    await api.post(this._baseURL + "/deleteMany", {
      ids: IDs,
    });
  }

  async createCredentialUser(
    username: string,
    password: string,
    display_name: string,
    roles: UserRole[],
    group_id: string,
  ) {
    return api.post(this._baseURL, {
      username,
      display_name,
      password,
      roles,
      group_id,
      type: "credential",
    });
  }

  async createOauthUser(
    username: string,
    display_name: string,
    email: string,
    roles: UserRole[],
  ) {
    return api.post(this._baseURL, {
      username,
      display_name,
      email,
      roles,
      type: "oauth",
    });
  }

  async editCredentialUser(
    id: string,
    username: string,
    password: string | undefined,
    display_name: string,
    roles: UserRole[],
    group_id: string,
  ) {
    const res = await api.patch(this._baseURL + `/${id}`, {
      username,
      password,
      display_name,
      roles,
      group_id,
    });

    return res.data;
  }

  async editOauthUser(
    id: string,
    username: string,
    email: string,
    display_name: string,
    roles: UserRole[],
  ) {
    const res = await api.patch(this._baseURL + `/${id}`, {
      username,
      email,
      display_name,
      roles,
    });

    return res.data;
  }

  async importUsers(users: CreateUser[]) {
    const res = await api.post(this._baseURL + "/import", {
      users,
    });

    return res.data;
  }
}

export const userService = new (PaginationMixin<User, typeof UserService>(
  UserService,
))();
