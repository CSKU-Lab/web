import { Plus, UserRoundPlus } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/commons/Dialog";
import Input from "~/components/commons/Input";
import Label from "~/components/commons/Label";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type AddUserSchema,
  addUserSchema,
} from "../../schemas/write-user.schema";
import { userService } from "~/services/user.service";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import UserRole from "./UserRole";
import UserType from "./UserType";
import { queryKeys } from "~/queryKeys";
import UserGroup from "./UserGroup";
import { AxiosError } from "axios";

const AddUser = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      username: "",
      display_name: "",
      type: "credential" as const,
      group: { id: "", name: "" },
      roles: [],
    },
  });

  const isOauth = watch("type") === "oauth";
  const isCredential = watch("type") === "credential";

  const isError = (field: keyof AddUserSchema) => !!errors[field];

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const queryClient = useQueryClient();

  const handleCreateUser: SubmitHandler<AddUserSchema> = async ({
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
        await userService.createCredentialUser(
          username,
          password,
          display_name,
          roles,
          group.id,
        );
      }

      if (type === "oauth") {
        await userService.createOauthUser(username, display_name, email!, roles);
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      reset();
      setIsOpen(false);
      toast.success("User created successfully");
    } catch (err) {
      if (err instanceof AxiosError) {
        const emailError = err.response?.data?.fields?.email;
        toast.error("Error", {
          description: emailError
            ? `Email is invalid: ${emailError}`
            : err.response?.data?.error,
        });
        return;
      }
      toast.error("Error", {
        description: "Something went wrong when trying to create user",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserRoundPlus size="1rem" />
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="p-4">
          <DialogTitle>Add new user</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCreateUser)}>
          <div className="p-4 space-y-4">
            {/* Account — shared */}
            <section className="space-y-3">
              <p className="text-sm font-medium text-(--gray-11)">Account</p>
              <div className="space-y-1">
                <Label isError={isError("username")}>Username</Label>
                <Input {...register("username")} />
                {isError("username") && (
                  <p className="text-(--red-9) text-sm font-light">
                    {errors.username?.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Label isError={isError("display_name")}>Display Name</Label>
                <Input {...register("display_name")} />
                {isError("display_name") && (
                  <p className="text-(--red-9) text-sm font-light">
                    {errors.display_name?.message}
                  </p>
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
                  <p className="text-(--red-9) text-sm font-light">
                    {errors.roles?.message}
                  </p>
                )}
              </div>
            </section>

            {/* Provider */}
            <section className="space-y-3">
              <Label isError={isError("type")}>Provider</Label>
              <Controller
                name="type"
                {...{ control }}
                render={({ field: { onChange, value } }) => (
                  <UserType value={value} onSelect={onChange} />
                )}
              />
              {isError("type") && (
                <p className="text-(--red-9) text-sm font-light">
                  {errors.type?.message}
                </p>
              )}
            </section>

            {/* Credential-specific */}
            {isCredential && (
              <section className="space-y-3">
                <p className="text-sm font-medium text-(--gray-11)">Credential</p>
                <div className="space-y-1">
                  <Label isError={isError("password")}>Password</Label>
                  <Input type="password" {...register("password")} />
                  {isError("password") && (
                    <p className="text-(--red-9) text-sm font-light">{errors.password?.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label isError={isError("group")}>Group</Label>
                  <Controller
                    name="group"
                    {...{ control }}
                    render={({ field: { onChange, value } }) => (
                      <UserGroup value={value} onChange={onChange} />
                    )}
                  />
                  {isError("group") && (
                    <p className="text-(--red-9) text-sm font-light">
                      {errors.group?.message}
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Google-specific */}
            {isOauth && (
              <section className="space-y-3">
                <p className="text-sm font-medium text-(--gray-11)">Google</p>
                <div className="space-y-1">
                  <Label isError={isError("email")}>Email</Label>
                  <Input {...register("email")} />
                  {isError("email") && (
                    <p className="text-(--red-9) text-sm font-light">
                      {errors.email?.message}
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              isLoading={isPending}
              disabled={isPending}
              variant="action"
              className="py-2 w-full"
            >
              <Plus size="1rem" />
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUser;
