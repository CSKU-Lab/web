import type { IFilter } from "~/types/filter";

export const isValidFilter = (filter: IFilter): boolean => {
  if (filter.value.trim() === "") return false;
  return true;
};
