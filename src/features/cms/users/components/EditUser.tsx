"use client";

import { UserRoundPen } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type EditUserSchema,
  editUserSchema,
} from "../schemas/write-user.schema";
import { userService } from "~/services/user.service";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import UserRole from "./AddUser/UserRole";
import type { AuthProvider, User } from "~/types/user";
import { queryKeys } from "~/queryKeys";
import UserGroup from "./AddUser/UserGroup";
import AuthProviderButtons from "./AddAuthProviderButton";

type EditUser = Pick<
  User,
  "id" | "username" | "display_name" | "email" | "roles" | "group" | "auth_providers"
>;

interface Props {
  user: EditUser;
  onClose?: () => void;
}

const EditUser = ({ user, onClose }: Props) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      ...user,
      group: user.group || { id: "", name: "" },
      email: user.email || "",
      password: "",
    },
  });

  const watchedEmail = watch("email");

  const originalProviders = user.auth_providers ?? [];
  const [localProviders, setLocalProviders] = useState<AuthProvider[]>(originalProviders);

  const hasCredential = localProviders.includes("credential");
  const hasGoogle = localProviders.includes("google");
  const isNewCredential = hasCredential && !originalProviders.includes("credential");
  const isLast = localProviders.length <= 1;

  const toggleProvider = (provider: AuthProvider) => {
    if (localProviders.includes(provider)) {
      if (isLast) return;
      setLocalProviders((prev) => prev.filter((p) => p !== provider));
    } else {
      setLocalProviders((prev) => [...prev, provider]);
    }
  };

  const [isOpen, setIsOpen] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const isError = (field: keyof EditUserSchema) => !!errors[field];

  const handleEditUser: SubmitHandler<EditUserSchema> = async ({
    username,
    password,
    display_name,
    email,
    roles,
    group,
  }) => {
    // Validate provider-specific requirements before any API calls
    if (isNewCredential && (!password || password.length < 8)) {
      setError("password", {
        message: "Password is required when enabling credential login (min. 8 characters)",
      });
      return;
    }
    if (localProviders.includes("google") && !email) {
      setError("email", { message: "Email is required for Google login" });
      return;
    }

    try {
      setIsPending(true);

      const toAdd = localProviders.filter((p) => !originalProviders.includes(p));
      const toRemove = originalProviders.filter((p) => !localProviders.includes(p));

      await userService.editUser(user.id, {
        username,
        display_name,
        roles,
        email: email || undefined,
        password: password || undefined,
        group_id: group?.id || undefined,
      });

      for (const provider of toAdd) {
        await userService.addAuthProvider(
          user.id,
          provider,
          provider === "credential" ? password : undefined,
        );
      }
      for (const provider of toRemove) {
        await userService.removeAuthProvider(user.id, provider);
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      reset();
      setIsOpen(false);
      if (onClose) onClose();
      toast.success("User edited successfully");
    } catch (err: unknown) {
      const emailError =
        err &&
        typeof err === "object" &&
        "response" in err &&
        err.response &&
        typeof err.response === "object" &&
        "data" in err.response &&
        err.response.data &&
        typeof err.response.data === "object" &&
        "fields" in err.response.data &&
        err.response.data.fields &&
        typeof err.response.data.fields === "object" &&
        "email" in (err.response.data.fields as object)
          ? (err.response.data as { fields: { email: string } }).fields.email
          : null;
      toast.error("Error", {
        description: emailError
          ? `Email is invalid: ${emailError}`
          : "Failed to edit user",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleOnOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (onClose) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleEditUser)} className="space-y-4">
          {/* Account — shared */}
          <section className="space-y-3">
            <p className="text-sm font-medium text-(--gray-11)">Account</p>
            <div className="space-y-1">
              <Label isError={isError("username")}>Username</Label>
              <Input {...register("username")} />
              {isError("username") && (
                <p className="text-red-9 text-sm font-light">{errors.username?.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label isError={isError("display_name")}>Display Name</Label>
              <Input {...register("display_name")} />
              {isError("display_name") && (
                <p className="text-red-9 text-sm font-light">{errors.display_name?.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label isError={isError("roles")}>Roles</Label>
              <Controller
                name="roles"
                {...{ control }}
                render={({ field: { onChange, value } }) => (
                  <UserRole value={value} onSelect={onChange} />
                )}
              />
              {isError("roles") && (
                <p className="text-red-9 text-sm font-light">{errors.roles?.message}</p>
              )}
            </div>
          </section>

          {/* Provider */}
          <section className="space-y-3">
            <Label>Provider</Label>
            <AuthProviderButtons
              providers={localProviders}
              pending={null}
              isLast={isLast}
              googleDisabled={false}
              onEnableRequest={toggleProvider}
              onDisable={toggleProvider}
            />
          </section>

          {/* Credential-specific */}
          {hasCredential && (
            <section className="space-y-3">
              <p className="text-sm font-medium text-(--gray-11)">Credential</p>
              <div className="space-y-1">
                <Label isError={isError("password")}>
                  Password{isNewCredential ? "" : " (optional)"}
                </Label>
                <Input
                  type="password"
                  placeholder={isNewCredential ? "Min. 8 characters" : "Leave blank to keep current"}
                  {...register("password")}
                />
                {isError("password") && (
                  <p className="text-red-9 text-sm font-light">{errors.password?.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label isError={isError("group")}>Group</Label>
                <Controller
                  name="group"
                  {...{ control }}
                  render={({ field: { onChange, value } }) => (
                    <UserGroup value={value!} onChange={onChange} />
                  )}
                />
                {isError("group") && (
                  <p className="text-(--red-9) text-sm font-light">{errors.group?.message}</p>
                )}
              </div>
            </section>
          )}

          {/* Google-specific */}
          {hasGoogle && (
            <section className="space-y-3">
              <p className="text-sm font-medium text-(--gray-11)">Google</p>
              <div className="space-y-1">
                <Label isError={isError("email")}>Email</Label>
                <Input {...register("email")} />
                {isError("email") && (
                  <p className="text-red-9 text-sm font-light">{errors.email?.message}</p>
                )}
              </div>
            </section>
          )}

          <Button
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            className="bg-(--gray-12) text-(--gray-1) hover:bg-(--gray-11) hover:text-(--gray-2) py-2 w-full"
          >
            <UserRoundPen size="1rem" />
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
