import type { PaginationRequestParams } from "~/types/pagination";
import type { AuthProvider, CreateUser, User, UserRole } from "~/types/user";
import { BaseService } from "~/services/base.service";

export type GetUserPaginationParams = PaginationRequestParams<User>;

class UserService extends BaseService {
  constructor() {
    super("/admin/users");
  }

  async getPagination(params: GetUserPaginationParams) {
    return this._getPagination<User>(params);
  }

  async deleteUser(id: string) {
    await this.api.delete(this._baseURL + `/${id}`);
  }

  async deleteManyUsers(IDs: string[]) {
    await this.api.post(this._baseURL + "/deleteMany", {
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
    return this.api.post(this._baseURL, {
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
    return this.api.post(this._baseURL, {
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
    const res = await this.api.patch(this._baseURL + `/${id}`, {
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
    const res = await this.api.patch(this._baseURL + `/${id}`, {
      username,
      email,
      display_name,
      roles,
    });

    return res.data;
  }

  async editUser(
    id: string,
    fields: {
      username?: string;
      display_name?: string;
      roles?: UserRole[];
      email?: string;
      password?: string;
      group_id?: string;
    },
  ) {
    const res = await this.api.patch(this._baseURL + `/${id}`, fields);
    return res.data;
  }

  async importUsers(users: CreateUser[]) {
    const res = await this.api.post(this._baseURL + "/import", {
      users,
    });

    return res.data;
  }

  async addAuthProvider(userID: string, provider: AuthProvider, password?: string) {
    await this.api.post(this._baseURL + `/${userID}/auth-providers`, {
      provider,
      ...(password ? { password } : {}),
    });
  }

  async removeAuthProvider(userID: string, provider: AuthProvider) {
    await this.api.delete(this._baseURL + `/${userID}/auth-providers/${provider}`);
  }
}

export const userService = new UserService();
