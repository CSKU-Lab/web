"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "~/providers/SessionProvider";
import useGetCourse from "~/features/cms/courses/hooks/useGetCourse";
import { Globe, Lock, Plus, ServerCrash } from "lucide-react";
import { Button } from "~/components/commons/Button";
import SearchInput from "~/components/commons/SearchInput";
import Filters from "~/components/commons/Filters";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import useInputDebounce from "~/hooks/useInputDebounce";
import useInfinitePagination from "~/hooks/useInfinitePagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { cmsMaterialService } from "~/services/cms-material.service";
import { queryKeys } from "~/queryKeys";
import type { CMSMaterial } from "~/types/cms-material";
import type { IFilter } from "~/types/filter";
import { searchParamsToFilter } from "~/lib/searchparams-to-filter";
import { useMaterialDisplay } from "~/hooks/useMaterialDisplay";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import Error from "~/components/commons/Error";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { cn } from "~/lib/utils";

const filterFields = [
  { display: "Name", value: "name" },
  { display: "Type", value: "type" },
];

function MaterialCard({
  material,
  onClick,
}: {
  material: CMSMaterial;
  onClick: () => void;
}) {
  const { logoMap } = useMaterialDisplay();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-md border border-(--gray-4) bg-(--gray-1)",
        "hover:bg-(--gray-2) hover:border-(--gray-5)",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
      )}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        {/* type icon */}
        <span className="mt-0.5 shrink-0 text-(--gray-9)">{logoMap[material.type]}</span>

        {/* main content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-(--gray-12) truncate">{material.name}</p>

          {material.created_by && (
            <div className="flex items-center gap-1.5 mt-1">
              <UserProfileImage
                src={material.created_by.profile_image}
                username={material.created_by.display_name ?? material.created_by.username ?? "?"}
                size="1rem"
                textSize="0.5rem"
              />
              <span className="text-xs text-(--gray-9) truncate max-w-[160px]">
                {material.created_by.display_name ?? material.created_by.username}
              </span>
            </div>
          )}

          {(material.tags?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {material.tags.slice(0, 4).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
              {material.tags.length > 4 && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  +{material.tags.length - 4}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* right: type badge + visibility icon */}
        <div className="shrink-0 flex items-center gap-2 mt-0.5">
          <Badge variant="outline" className="text-xs capitalize">{material.type}</Badge>
          {material.visibility === "public" ? (
            <Globe size={14} className="text-green-600" />
          ) : (
            <Lock size={14} className="text-(--gray-9)" />
          )}
        </div>
      </div>
    </button>
  );
}

function MaterialListPage() {
  const { courseID } = useParams<{ courseID: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useSession();
  const { data: course } = useGetCourse({ courseID });
  const isInstructor = user.roles.includes("instructor") && !user.roles.includes("admin");
  const isCourseCreator = course?.creators?.some((c) => c.id === user.sub);
  const isRestrictedInstructor = isInstructor && !isCourseCreator;

  const [search, setSearch] = useState("");
  const debouncedSearch = useInputDebounce(search, 500);
  const [filters, setFilters] = useState<IFilter[]>(() =>
    searchParamsToFilter(searchParams, filterFields),
  );

  const {
    data: pages,
    isFetching,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfinitePagination<CMSMaterial>({
    queryKey: queryKeys.material.allWithParams(courseID, {
      search: debouncedSearch,
      filters,
    }),
    queryFn: ({ pageParam }) =>
      cmsMaterialService.getPagination(courseID, {
        page: pageParam,
        page_size: 20,
        search: debouncedSearch,
        sort_by: "created_at",
        sort_order: "desc",
        filters,
      }),
  });

  const allMaterials = pages.pages.flatMap((p) => p.data);
  const isNoData = allMaterials.length === 0 && !isFetching;

  const bottomRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage && !isFetching,
  });

  return (
    <>
      <div className="flex justify-end items-center gap-2 px-4 my-4">
        <SearchInput
          placeholder="Search materials..."
          className="w-full md:w-fit"
          value={search}
          onChange={setSearch}
        />
        {!isRestrictedInstructor && (
          <Button
            onClick={() => router.push(`/cms/courses/${courseID}/materials/new`)}
            className="shrink-0"
          >
            <Plus size="1rem" />
            New material
          </Button>
        )}
      </div>

      <div className="flex justify-end px-4">
        <Filters
          value={filters}
          onChange={setFilters}
          className="mt-2"
          fields={filterFields}
        />
      </div>

      <div className="px-4 mt-4">
        <Error
          isError={isError && !isFetching}
          fallback={
            <ErrorFallback
              icon={<ServerCrash size="2rem" />}
              onRetry={refetch}
              title="Cannot get materials"
              message="There was an error loading materials. Please try again."
            />
          }
        >
          {isNoData ? (
            <NoDataAvailable />
          ) : (
            <div className="flex flex-col gap-2">
              {allMaterials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onClick={() =>
                    router.push(
                      `/cms/courses/${courseID}/materials/${material.id}`,
                    )
                  }
                />
              ))}
              {isFetching &&
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-md" />
                ))}
              <div ref={bottomRef} className="h-4" />
            </div>
          )}
        </Error>
      </div>
    </>
  );
}

export default MaterialListPage;
