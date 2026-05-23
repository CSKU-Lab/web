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
} from "../_schemas/write-user.schema";
import { cn } from "~/lib/utils";
import { userService } from "~/services/user.service";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import UserRole from "./AddUser/UserRole";
import UserType from "./AddUser/UserType";
import type { User } from "~/types/user";
import { queryKeys } from "~/queryKeys";
import UserGroup from "./AddUser/UserGroup";

type EditUser = Pick<
  User,
  "id" | "username" | "display_name" | "email" | "type" | "roles" | "group"
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

  const isOauth = watch("type") === "oauth";
  const isCredential = watch("type") === "credential";

  const isError = (field: keyof EditUserSchema) => !!errors[field];

  const [isOpen, setIsOpen] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const handleEditUser: SubmitHandler<EditUserSchema> = async ({
    type,
    username,
    password,
    display_name,
    email,
    roles,
    group,
  }) => {
    try {
      setIsPending(true);
      if (type === "credential") {
        await userService.editCredentialUser(
          user.id,
          username,
          password || undefined,
          display_name,
          roles,
          group!.id,
        );
      }

      if (type === "oauth") {
        await userService.editOauthUser(
          user.id,
          username,
          email!,
          display_name,
          roles,
        );
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      reset();
      setIsOpen(false);
      if (!!onClose) onClose();
      toast.success("User edited successfully");
    } catch (err) {
      toast.error("Failed to edit user");
    } finally {
      setIsPending(false);
    }
  };

  const handleOnOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!!onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleEditUser)} className="space-y-4">
          <div className="space-y-3">
            <Label isError={isError("type")}>User Type</Label>
            <Controller
              name="type"
              {...{ control }}
              render={({ field: { onChange, value } }) => (
                <UserType value={value} onSelect={onChange} disabled />
              )}
            />
            {isError("type") && (
              <p className="text-red-9 text-sm font-light">
                {errors.type?.message}
              </p>
            )}
          </div>
          {isCredential && (
            <div className="space-y-3">
              <Label isError={isError("roles")}>Group</Label>
              <Controller
                name="group"
                {...{ control }}
                render={({ field: { onChange, value } }) => (
                  <UserGroup value={value!} onChange={onChange} />
                )}
              />
              {isError("group") && (
                <p className="text-(--red-9) text-sm font-light">
                  {errors.group?.message}
                </p>
              )}
            </div>
          )}
          <div className="space-y-3">
            <Label isError={isError("username")}>Username</Label>
            <Input {...register("username")} />
            {isError("username") && (
              <p className="text-red-9 text-sm font-light">
                {errors.username?.message}
              </p>
            )}
          </div>
          {isCredential && (
            <div className="space-y-3">
              <Label isError={isError("password")}>New Password (optional)</Label>
              <Input type="password" {...register("password")} />
              {isError("password") ? (
                <p className="text-red-9 text-sm font-light">
                  {errors.password?.message}
                </p>
              ) : (
                <p className="text-sm font-light">
                  leave blank to keep current password
                </p>
              )}
            </div>
          )}
          <div className="space-y-3">
            <Label isError={isError("display_name")}>Display Name</Label>
            <Input {...register("display_name")} />
            {isError("display_name") && (
              <p className="text-red-9 text-sm font-light">
                {errors.display_name?.message}
              </p>
            )}
          </div>

          {isOauth && (
            <div className="space-y-3">
              <Label isError={isError("email")}>Email</Label>
              <Input {...register("email")} />
              {isError("email") && (
                <p className="text-red-9 text-sm font-light">
                  {errors.email?.message}
                </p>
              )}
            </div>
          )}
          <div className="space-y-3">
            <Label isError={isError("roles")}>Roles</Label>
            <Controller
              name="roles"
              {...{ control }}
              render={({ field: { onChange, value } }) => (
                <UserRole value={value} onSelect={onChange} />
              )}
            />
            {isError("roles") && (
              <p className="text-red-9 text-sm font-light">
                {errors.roles?.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            isLoading={isPending}
            disabled={isPending}
            className="bg-(--gray-12) text-(--gray-1) hover:bg-(--gray-11) hover:text-(--gray-2) py-2 w-full"
          >
            <UserRoundPen size="1rem" />
            Edit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
