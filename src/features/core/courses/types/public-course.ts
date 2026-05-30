export interface PublicCourse {
  id: string;
  name: string;
  description: string;
  banner: string;
  visibility: "public";
  total_students: number;
  is_enrolled: boolean;
  creators: Creator[];
}

export interface CourseLab {
  id: string;
  lab_name: string;
  position: number;
  total_students: number;
  created_at: string;
  updated_at: string;
}

export interface CourseDetailResponse {
  course: PublicCourse;
  labs: CourseLab[];
}

interface Creator {
  id: string;
  username: string;
  display_name: string;
  profile_image: string | null;
}