import { BaseService } from "./base.service";

export interface CoreSearchPrivateCourseResult {
  id: string;
  name: string;
  section_name: string;
  path: string;
}

export interface CoreSearchPublicCourseResult {
  id: string;
  name: string;
  path: string;
}

export interface CoreSearchSectionResult {
  id: string;
  name: string;
  course_name: string;
  path: string;
}

export interface CoreSearchLabResult {
  id: string;
  lab_name: string;
  section_name: string;
  course_name: string;
  path: string;
}

export interface CoreSearchMaterialResult {
  id: string;
  material_name: string;
  lab_name: string;
  section_name: string;
  course_name: string;
  path: string;
}

export interface CoreSearchResult {
  private_courses: CoreSearchPrivateCourseResult[];
  public_courses: CoreSearchPublicCourseResult[];
  sections: CoreSearchSectionResult[];
  labs: CoreSearchLabResult[];
  materials: CoreSearchMaterialResult[];
}

class CoreSearchService extends BaseService {
  constructor() {
    super("/search");
  }

  async search(q: string, limit = 5): Promise<CoreSearchResult> {
    const params = new URLSearchParams({ q, limit: String(limit) });
    const res = await this.api.get<CoreSearchResult>(`${this._baseURL}?${params}`);
    return res.data;
  }
}

export const coreSearchService = new CoreSearchService();
