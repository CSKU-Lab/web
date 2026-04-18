"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface PageSizeProps {
  value: number;
  onChange: (value: string) => void;
  calculatedPageSize?: number | null;
}

const DEFAULT_PAGE_SIZES = [10, 25, 50, 100];

function PageSize({ value, onChange, calculatedPageSize }: PageSizeProps) {
  const pageSizes = calculatedPageSize && !DEFAULT_PAGE_SIZES.includes(calculatedPageSize)
    ? [...DEFAULT_PAGE_SIZES, calculatedPageSize].sort((a, b) => a - b)
    : DEFAULT_PAGE_SIZES;

  return (
    <div className="flex gap-1.5 items-center">
      <span className="text-xs tracking-wide font-light text-(--gray-12)">per page</span>
      <Select value={value.toString()} onValueChange={onChange}>
        <SelectTrigger className="w-20 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {pageSizes.map((size) => (
            <SelectItem key={size} value={size.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default PageSize;
