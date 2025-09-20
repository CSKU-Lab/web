import type { FilterOperator } from "~/types/filter";

export const mapDisplayWithValue: Record<FilterOperator, string> = {
  is: "is",
  is_not: "is not",
  contains: "contains",
  not_contains: "does not contain",
  gt: "is greater than",
  lt: "is less than",
  gte: "is greater than or equal to",
  lte: "is less than or equal to",
  is_empty: "is empty",
  is_not_empty: "is not empty",
};
