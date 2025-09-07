import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash, User } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/commons/Button";
import { numberFormatter } from "~/lib/formatters/numberFormatter";
import { queryKeys } from "~/queryKeys";
import { userGroupService } from "~/services/user-group.service";
import type { CMSUserGroup } from "~/types/cms-user-group";

function GroupItem({ id, name: group_name, user_amount }: CMSUserGroup) {
  const [isEdit, setIsEdit] = useState(false);
  const [name, setName] = useState(group_name);

  const queryClient = useQueryClient();
  const editGroup = useMutation({
    mutationFn: () => userGroupService.uppdate(id, name),
    onSuccess: () => {
      setIsEdit(false);
      queryClient.invalidateQueries({
        queryKey: queryKeys.user_group.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.all,
      });
    },
  });

  const deleteGroup = useMutation({
    mutationFn: () => userGroupService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.user_group.all,
      });
    },
  });

  return (
    <div className="bg-(--gray-2) border border-(--gray-4) p-2 rounded-lg text-(--gray-11) flex justify-between items-center gap-1.5">
      <div className="flex items-center gap-2">
        {isEdit ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-6 outline-none w-full"
          />
        ) : (
          <h5>{name}</h5>
        )}
        <div className="inline-flex items-center text-xs gap-1 bg-(--gray-12) text-(--gray-6) px-2 py-0.5 rounded-full">
          <User size="1rem" />
          {numberFormatter(user_amount)}
        </div>
      </div>
      <div className="space-x-2 pt-0.5 flex">
        {isEdit ? (
          <>
            <Button
              variant="action"
              onClick={editGroup.mutate}
              isLoading={editGroup.isPending}
            >
              Save
            </Button>
            <Button onClick={() => setIsEdit(false)}>Cancel</Button>
          </>
        ) : (
          <>
            <Button
              variant="transparent"
              tooltip="Edit"
              onClick={() => setIsEdit(true)}
              className="h-7.5"
            >
              <Pencil size="1rem" />
            </Button>

            <Button
              variant="transparent"
              tooltip="Delete"
              className="h-7.5"
              onClick={deleteGroup.mutate}
              isLoading={deleteGroup.isPending}
            >
              <Trash size="1rem" className="text-(--red-9)" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default GroupItem;
