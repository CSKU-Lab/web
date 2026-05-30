export interface WriteCourse {
  name: string;
  creators: Creator[];
  visibility: Visibility;
}

export interface Course {
  id: string;
  name: string;
  creators: Creator[];
  visibility: Visibility;
}

interface Creator {
  id: string;
  display_name: string;
  username: string;
  profile_image: string | null;
}

type Visibility = "public" | "private";
