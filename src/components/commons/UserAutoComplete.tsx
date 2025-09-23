import type { User } from "~/types/user";
import AutoComplete from "./AutoComplete";
import UserProfileImage from "../Menus/UserProfileImage";
import { useCallback } from "react";
import { userService } from "~/services/user.service";
import { Skeleton } from "../ui/skeleton";
import { X } from "lucide-react";

export type UserData = Pick<
  User,
  "id" | "username" | "display_name" | "profile_image"
>;

interface Props {
  value?: UserData[];
  onChange?: (users: UserData[]) => void;
  isError?: boolean;
  placeHolder?: string;
}
function UserAutoComplete({ value, onChange, isError, placeHolder }: Props) {
  const queryUsers = useCallback(async (query: string) => {
    const res = await userService.getPagination({
      search: query,
      sort_by: "display_name",
    });

    return res.data.map((user) => ({
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      profile_image: user.profile_image,
    }));
  }, []);

  return (
    <AutoComplete
      value={value}
      onChange={onChange}
      placeHolder={placeHolder}
      isError={isError}
      renderSelected={({ option: creator, handleOnRemove }) => (
        <div
          key={creator.id}
          className="flex items-center gap-2 shrink-0 bg-(--gray-4) pl-2 pr-3 py-0.5 rounded-full"
        >
          <UserProfileImage
            username={creator.username}
            src={creator.profile_image}
            size="1.5rem"
            textSize="0.5rem"
          />
          <span className="text-xs">{creator.display_name}</span>
          <button
            className="text-(--gray-11) hover:text-(--gray-12) focus:outline-none"
            type="button"
            onClick={() => handleOnRemove(creator)}
          >
            <X size="0.8rem" />
          </button>
        </div>
      )}
      queryFn={queryUsers}
      loadingFallback={Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center px-2 py-1.5 gap-2">
          <Skeleton className="w-10 h-10 rounded-full" />
          <Skeleton className="w-32 h-4 rounded" />
        </div>
      ))}
    >
      {({ options, handleOnAdd }) =>
        options.map((creator) => (
          <button
            onClick={() => handleOnAdd(creator)}
            key={creator.id}
            className="flex items-center px-2 py-1.5 gap-2 hover:bg-gray-100 cursor-pointer w-full rounded-md"
          >
            <UserProfileImage
              src={creator.profile_image}
              username={creator.display_name}
            />
            <div className="flex-1 space-y-0.5 grid text-left">
              <h4 className="text-sm font-medium truncate text-(--gray-12) leading-tight">
                {creator.display_name}
              </h4>
              <h6 className="text-xs font-light text-(--gray-10)">
                @{creator.username}
              </h6>
            </div>
          </button>
        ))
      }
    </AutoComplete>
  );
}

export default UserAutoComplete;
