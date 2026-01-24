import { BaseService } from "./base.service";

export interface GetSidebarResponse {
  name: string;
  id: string;
  status: string;
  sub_items: GetSidebarResponse[];
}

class SidebarService extends BaseService {
  constructor() {
    super("/sidebar");
  }

  async getSidebar() {
    const res = await this.api.get<GetSidebarResponse[]>(`${this._baseURL}/`);
    return res.data;
  }
}

export const coreSidebarService = new SidebarService();
