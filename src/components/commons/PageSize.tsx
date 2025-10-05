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
}

function PageSize({ value, onChange }: PageSizeProps) {
  const pageSizes = [10, 25, 50, 100];
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
