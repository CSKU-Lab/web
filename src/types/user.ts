export interface User {
  id: string;
  email?: string;
  username: string;
  display_name: string;
  profile_image: string | null;
  roles: UserRole[];
  type: UserType;
  group: UserGroup;
  created_at?: Date;
  updated_at?: Date;
}

export interface JWTUser {
  sub: string;
  username: string;
  displayName: string;
  profileImage: string | null;
  roles: UserRole[];
}

export type UserType = "credential" | "oauth";

export type UserRole = "admin" | "instructor" | "student";

export type UserGroup = { id: string; name: string };

export interface CreateUser extends Omit<User, "id"> {
  password?: string;
}
