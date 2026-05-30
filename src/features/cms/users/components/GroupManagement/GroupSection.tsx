import { useEffect, useRef, useState } from "react";
import useInputDebounce from "~/hooks/useInputDebounce";
import useUserGroupPagination from "../../hooks/useUserGroupPagination";
import CreateGroup from "./CreateGroup";
import Input from "~/components/commons/Input";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import { ServerCrash } from "lucide-react";
import GroupItem from "./GroupItem";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";

function GroupSection() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 1000);

  const {
    data: userGroupPagination,
    isFetching,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useUserGroupPagination({
    page_size: 6,
    search: debouncedSearch,
    sort_by: "name",
  });

  const totalPages = userGroupPagination.pages.length;
  const totalGroups =
    userGroupPagination.pages[totalPages - 1]?.pagination.total_rows ?? 0;

  const bottomDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bottomDivRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isFetching) {
            fetchNextPage();
          }
        });
      },
      {
        threshold: 0.3,
      },
    );

    if (!hasNextPage) {
      observer.disconnect();
      return;
    }

    observer.observe(bottomDivRef.current);

    return () => observer.disconnect();
  }, [isFetching, fetchNextPage, hasNextPage]);

  return (
    <div className="p-4">
      <CreateGroup />
      <hr className="my-2" />
      <h5 className="text-sm">Groups ({totalGroups})</h5>
      <Input
        placeholder="Find groups"
        className="mt-2"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Error
        isError={isError}
        fallback={
          <ErrorFallback
            icon={<ServerCrash size="2rem" />}
            onRetry={refetch}
            title="Cannot get user groups"
            message="There was an error to get the user groups. Please try again later or report issue"
          />
        }
      >
        <div className="relative">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-(--gray-2) to-transparent h-6"></div>
          <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
            {userGroupPagination.pages.map((page) =>
              page.data.map((group) => <GroupItem key={group.id} {...group} />),
            )}
            <Loading
              isLoading={isFetching}
              fallback={Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-12" />
              ))}
            />

            <div
              ref={bottomDivRef}
              className="h-12 flex justify-center items-center"
            >
              {!hasNextPage && (
                <h6 className="text-sm text-(--gray-11)">- No more data -</h6>
              )}
            </div>
          </div>
        </div>
      </Error>
    </div>
  );
}

export default GroupSection;
