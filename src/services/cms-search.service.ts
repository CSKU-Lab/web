import { BaseService } from "./base.service";

export interface SearchCourseResult {
  id: string;
  name: string;
  path: string;
}

export interface SearchLabResult {
  id: string;
  name: string;
  course_id: string;
  course_name: string;
  path: string;
}

export interface SearchMaterialResult {
  id: string;
  name: string;
  type: string;
  course_id: string;
  course_name: string;
  path: string;
}

export interface SearchSectionResult {
  id: string;
  name: string;
  course_id: string;
  course_name: string;
  path: string;
}

export interface SearchSectionLabResult {
  id: string;
  lab_name: string;
  section_name: string;
  course_name: string;
  path: string;
}

export interface SearchSectionLabMaterialResult {
  id: string;
  material_name: string;
  lab_name: string;
  section_name: string;
  course_name: string;
  path: string;
}

export interface SearchResult {
  courses: SearchCourseResult[];
  labs: SearchLabResult[];
  materials: SearchMaterialResult[];
  sections: SearchSectionResult[];
  section_labs: SearchSectionLabResult[];
  section_lab_materials: SearchSectionLabMaterialResult[];
}

class CMSSearchService extends BaseService {
  constructor() {
    super("/cms/search");
  }

  async search(q: string, limit = 5): Promise<SearchResult> {
    const params = new URLSearchParams({ q, limit: String(limit) });
    const res = await this.api.get<SearchResult>(`${this._baseURL}?${params}`);
    return res.data;
  }
}

export const cmsSearchService = new CMSSearchService();
