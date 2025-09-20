import { useAtom } from "jotai";
import { filterAtom } from "./filter.atom";
import type { IFilter, FilterField } from "~/types/filter";

function useFilter() {
  const [filters, setFilters] = useAtom(filterAtom);

  const add = (field: FilterField) => {
    setFilters([
      ...filters,
      { field, operator: "is", value: "", status: "newly-created" },
    ]);
  };

  const update = (filter: IFilter) => {
    const copiedFilters = [...filters];
    const filterIndex = copiedFilters.findIndex(
      ({ field }) => field === filter.field,
    );

    copiedFilters[filterIndex] = { ...filter };

    setFilters(copiedFilters);
  };

  const remove = (field: string) => {
    const newFilters = filters.filter((filter) => filter.field.value !== field);
    setFilters(newFilters);
  };

  return {
    add,
    remove,
    update,
    filters,
  };
}

export default useFilter;
