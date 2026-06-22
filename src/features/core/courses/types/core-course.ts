export interface Course {
  id: string;
  name: string;
  creators: Creator[];
  visibility: Visibility;
}

export interface MyCourseSemester {
  name: string;
  type: string;
}

export interface MyCourse {
  id: string;
  name: string;
  description: string | null;
  banner: string | null;
  visibility: Visibility;
  total_students: number;
  instructors: Creator[];
  section_name?: string;
  semester?: MyCourseSemester;
}

export interface Creator {
  id: string;
  display_name: string;
  username: string;
  profile_image: string | null;
}

type Visibility = "public" | "private";
