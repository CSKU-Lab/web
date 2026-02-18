export interface User {
  id: string;
  email?: string;
  username: string;
  display_name: string;
  profile_image: string | null;
  roles: UserRole[];
  type: UserType;
  group: UserGroup | null;
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

export type UserRoleEnum = {
  ADMIN: "admin";
  STUDENT: "student";
  INSTRUCTOR: "instructor";
};
export type UserRole = UserRoleEnum[keyof UserRoleEnum];

export type UserGroup = { id: string; name: string };

export interface CreateUser extends Omit<User, "id"> {
  password?: string;
}

export type UserDetail = Pick<
  User,
  "id" | "username" | "display_name" | "profile_image"
>;
