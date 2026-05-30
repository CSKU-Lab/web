import { z } from "zod";

export const addUserSchema = z
  .object({
    username: z.string().min(1, { message: "username cannot be empty" }),
    password: z.string(),
    display_name: z
      .string()
      .min(1, { message: "display name cannot be empty" }),
    email: z.string().optional(),
    type: z.enum(["credential", "oauth"], {
      message: "user must has a type",
    }),
    group: z.object({ id: z.string(), name: z.string() }),
    roles: z
      .array(z.enum(["admin", "instructor", "student"]))
      .min(1, { message: "user must has at least one role" }),
  })
  .refine(
    (data) => {
      if (data.type === "credential") {
        return true;
      }

      return isEmail.safeParse(data.email).success;
    },
    {
      path: ["email"],
      message: "email cannot be empty",
    },
  )
  .refine(
    (data) => (data.type === "credential" ? data.password.length >= 8 : true),
    {
      path: ["password"],
      message: "password must has at least 8 characters",
    },
  )
  .refine(
    (data) => {
      if (data.type === "credential" && data.group.id.length === 0) {
        return false;
      }
      return true;
    },
    {
      path: ["group"],
      message: "group cannot be empty",
    },
  );

export type AddUserSchema = z.infer<typeof addUserSchema>;

const RFC5322_EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const isEmail = z.string().regex(RFC5322_EMAIL, { message: "invalid email address" });

export const editUserSchema = z
  .object({
    group: z.object({ id: z.string(), name: z.string() }).optional(),
    username: z.string().min(1, { message: "username cannot be empty" }),
    password: z.string().optional(),
    display_name: z
      .string()
      .min(1, { message: "display name cannot be empty" }),
    email: z.string().optional(),
    type: z.enum(["credential", "oauth"], {
      message: "user must has a type",
    }),
    roles: z
      .array(z.enum(["admin", "instructor", "student"]))
      .min(1, { message: "user must has at least one role" }),
  })
  .refine(
    (data) => {
      if (data.type === "oauth") {
        return true;
      }

      return data.group !== undefined;
    },
    {
      path: ["email"],
      message: "email cannot be empty",
    },
  )
  .refine(
    (data) => {
      if (data.type === "credential") {
        return true;
      }

      return isEmail.safeParse(data.email).success;
    },
    {
      path: ["email"],
      message: "email cannot be empty",
    },
  )
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password.length >= 8;
      }
      return true;
    },
    {
      path: ["password"],
      message: "password must have at least 8 characters",
    },
  );

export type EditUserSchema = z.infer<typeof editUserSchema>;
