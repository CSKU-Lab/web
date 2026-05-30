import { CMSUser } from "~/types/user";
import { BaseService } from "~/services/base.service";

class CMSUserService extends BaseService {
  constructor() {
    super("/cms/users");
  }

  async getByID(id: string): Promise<CMSUser> {
    const res = await this.api.get(`${this._baseURL}/${id}`);
    return res.data;
  }
}

export const cmsUserService = new CMSUserService();
