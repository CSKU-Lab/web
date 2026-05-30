import type { CMSUserGroup } from "~/types/cms-user-group";
import type { PaginationRequestParams } from "~/types/pagination";
import { BaseService } from "~/services/base.service";
import type { User } from "~/types/user";

interface CheckPayload {
  find_by: keyof User;
  role: User["roles"][number];
  users: string[];
}

export type GetUserGroupPaginationParams = Partial<
  PaginationRequestParams<CMSUserGroup>
>;

type CheckResponse =
  | {
      code: "OK";
      message: string;
    }
  | {
      code: "INVALID_USERS";
      error: string;
      users: string[];
    };

class CMSUserExistance extends BaseService {
  constructor() {
    super("/cms/user-existances");
  }

  async check(payload: CheckPayload): Promise<CheckResponse> {
    const res = await this.api.post<CheckResponse>(this._baseURL, payload);
    return res.data;
  }
}

export const cmsUserExistanceService = new CMSUserExistance();
