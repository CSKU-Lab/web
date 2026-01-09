export type LearnStatus = "PASSED" | "FAILED" | "IN_PROGRESS" | "NONE";

export interface ICourseItem {
  name: string;
  labID: string;
  status: LearnStatus;
  subItems: SubCourseItem[];
}
export interface SubCourseItem {
  slug: string;
  name: string;
  status: LearnStatus;
}

export interface SidebarCourse {
  sectionID: string;
  name: string;
  icon: string;
  labs: ICourseItem[];
}
