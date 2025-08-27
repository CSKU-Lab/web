export interface CreateCourse {
  name: string;
  creators: Creator[];
  type: CourseType;
}

export interface Course {
  id: string;
  name: string;
  creators: Creator[];
  type: CourseType;
}

interface Creator {
  id: string;
  display_name: string;
  username: string;
  profile_image: string | null;
}

type CourseType = "public" | "private";
