import type { Filter } from "~/types/filter";

export const isValidFilter = (filter: Filter): boolean => {
  if (filter.value.trim() === "") return false;
  return true;
};
