"use client";
import { X } from "lucide-react";
import AutoComplete from "~/components/commons/AutoComplete";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import { Skeleton } from "~/components/ui/skeleton";
import { userService } from "~/services/user.service";
import type { CreateCourseSchema } from "../../_schemas/course.create";

type Creators = CreateCourseSchema["creators"];

interface Props {
  value: Creators;
  onChange: (value: Creators) => void;
  isError?: boolean;
}

function CourseCreators({ value, onChange, isError }: Props) {
  const queryUsers = async (query: string) => {
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
  };

  return (
    <AutoComplete
      {...{ value, onChange, isError }}
      renderSelected={({ option, handleOnRemove }) => (
        <div
          key={option.id}
          className="flex items-center gap-2 shrink-0 bg-(--gray-4) pl-2 pr-3 py-0.5 rounded-full"
        >
          <UserProfileImage
            username={option.username}
            src={option.profile_image}
            size="1.5rem"
            textSize="0.5rem"
          />
          <span className="text-xs">{option.display_name}</span>
          <button
            className="text-(--gray-11) hover:text-(--gray-12) focus:outline-none"
            type="button"
            onClick={() => handleOnRemove(option)}
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

export default CourseCreators;
