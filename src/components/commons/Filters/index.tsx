"use client";
import { cn } from "~/lib/utils";
import useFilter from "./useFilter";
import AddFilter from "./AddFilter";
import FilterBlock from "./FilterBlock";
import type { FilterField, IFilter } from "~/types/filter";
import { useEffect, useRef } from "react";
import { isValidFilter } from "./utils/is-valid-filter";
import { usePathname, useRouter } from "next/navigation";
import { filterToSearchParams } from "~/lib/filter-to-searchparams";

interface Props {
  className?: string;
  fields: FilterField[];
  value: IFilter[];
  onChange: (value: IFilter[]) => void;
}

function Filters({ className, fields, value, onChange }: Props) {
  const { filters } = useFilter({ initialFilters: value });
  const isFirstRender = useRef(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isFirstRender.current && filters.length === 0) return;
    if (filters.some((filter) => !isValidFilter(filter))) return;

    router.push(pathname + "?" + filterToSearchParams(filters));
  }, [filters, router, pathname]);

  useEffect(() => {
    if (filters.some((filter) => !isValidFilter(filter))) return;
    if (isFirstRender.current && filters.length === 0) return;

    if (onChange) {
      onChange(filters);
    }

    isFirstRender.current = false;
  }, [filters, onChange, value]);

  return (
    <div
      className={cn("flex items-center flex-wrap gap-x-1.5 gap-y-2", className)}
    >
      {filters.map((filter) => (
        <FilterBlock
          key={`${filter.field.value}-${filter.status}`}
          filter={filter}
        />
      ))}
      <AddFilter fields={fields} />
    </div>
  );
}

export default Filters;
