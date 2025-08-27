export interface CreateCourse {
  name: string;
  creators: Creator[];
  type: "public" | "private";
}

export interface Course {
  id: string;
  name: string;
  creators: Creator[];
}

interface Creator {
  id: string;
  display_name: string;
  username: string;
  profile_image: string | null;
}
