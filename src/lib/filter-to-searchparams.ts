import type { IFilter } from "~/types/filter";

export const filterToSearchParams = (filters: IFilter[]) => {
  const searchParams = new URLSearchParams();

  filters.forEach((filter) => {
    const field = `${filter.field.value}__${filter.operator}`;
    const value = filter.value;
    searchParams.append(field, value);
  });

  return searchParams.toString();
};
