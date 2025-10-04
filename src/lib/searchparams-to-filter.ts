import type { FilterField, IFilter } from "~/types/filter";

export const searchParamsToFilter = (
  searchParams: URLSearchParams,
  filterFields: FilterField[],
) => {
  const filters: IFilter[] = [];

  searchParams.forEach((value, key) => {
    if (key === "page" || key === "page_size" || key === "search") return;

    const [field, operator] = key.split("__");
    if (!field || !operator) return;

    const fieldDisplay =
      filterFields.find((f) => f.value === field)?.display ?? field;

    filters.push({
      field: { display: fieldDisplay, value: field },
      operator: operator as IFilter["operator"],
      value,
      status: "dirty",
    });
  });

  return filters;
};
