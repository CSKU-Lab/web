import type { User } from "~/types/user";

export interface CMSSectionLog {
  id: string;
  timestamp: string;
  action: string;
  user: Pick<User, "username" | "display_name" | "profile_image" | "roles">;
  details: string;
  ip_address: string;
}
