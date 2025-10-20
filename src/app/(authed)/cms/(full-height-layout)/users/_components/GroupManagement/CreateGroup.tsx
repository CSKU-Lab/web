import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "~/components/commons/Button";
import Input from "~/components/commons/Input";
import { queryKeys } from "~/queryKeys";
import { userGroupService } from "~/services/user-group.service";

function CreateGroup() {
  const [name, setName] = useState("");
  const [submittedName, setSubmittedName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const isError = errorMessage !== "";

  const queryClient = useQueryClient();

  const createGroup = useMutation({
    mutationFn: async () => {
      setSubmittedName(name);
      return userGroupService.create(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user_group.all });
      setName("");
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        setErrorMessage(err.response?.data.error);
      }
    },
  });

  useEffect(() => {
    if (isError && name !== submittedName) {
      setErrorMessage("");
    }
  }, [name, submittedName, isError]);

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    createGroup.mutate();
  };

  return (
    <>
      <div>
        <h4 className="font-medium">New Group</h4>
        {isError && <h6 className="text-sm text-(--red-9)">{errorMessage}</h6>}
      </div>
      <form onSubmit={handleOnSubmit} className="space-y-1.5 mt-1">
        <Input
          placeholder="Group name"
          className=""
          value={name}
          onChange={(e) => setName(e.target.value)}
          {...{ isError }}
        />
        <Button variant="action" onClick={createGroup.mutate}>
          Create
        </Button>
      </form>
    </>
  );
}

export default CreateGroup;
