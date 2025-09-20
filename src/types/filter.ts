export interface IFilter {
  field: FilterField;
  operator: FilterOperator;
  value: string;
  status: "newly-created" | "dirty";
}

export type FilterOperator =
  | "is"
  | "is_not"
  | "contains"
  | "not_contains"
  | "is_empty"
  | "is_not_empty"
  | "gt"
  | "lt"
  | "gte"
  | "lte";

export interface FilterField {
  display: string;
  value: string;
}
