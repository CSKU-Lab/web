"use client";
import { useCallback } from "react";
import SearchSelect from "~/components/commons/SearchSelect";
import { cn } from "~/lib/utils";
import { userGroupService } from "~/services/user-group.service";

type UserGroup = { id: string; name: string };

interface Props {
  value: UserGroup;
  onChange: (value: UserGroup) => void;
  isError?: boolean;
}

function UserGroups({ value, onChange, isError }: Props) {
  const queryGroups = useCallback(async (search: string) => {
    const res = await userGroupService.getPagination({ search, page_size: 20 });
    return res.data;
  }, []);

  return (
    <SearchSelect
      {...{ value, onChange, isError }}
      placeholder="Search group"
      className="w-full"
      queryFn={queryGroups}
    >
      {(options) =>
        options.map(({ id, name }) => (
          <button
            key={id}
            onClick={() => onChange({ id, name })}
            className={cn(
              "px-2 py-1.5 hover:bg-(--gray-3) text-sm w-full text-left rounded-md",
              value.id === id && "bg-(--gray-5)",
            )}
          >
            {name}
          </button>
        ))
      }
    </SearchSelect>
  );
}

export default UserGroups;
