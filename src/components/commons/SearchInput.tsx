import { Search } from "lucide-react";
import { cn } from "~/lib/utils";
import { forwardRef } from "react";
import type { ComponentProps } from "react";

interface Props extends Omit<ComponentProps<"input">, "onChange"> {
  onChange: (value: string) => void;
  isError?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, Props>(
  ({ onChange, className, isError, ...props }, ref) => (
    <div
      className={cn(
        "relative pl-7 pr-3 py-1.5 border border-(--gray-6) bg-(--gray-1) rounded-md w-64 flex items-center hover:bg-(--gray-2)",
        isError && "border-(--red-9)",
        className,
      )}
    >
      <Search
        size="1rem"
        className="absolute left-1.5 top-1/2 -translate-y-1/2 text-(--gray-9)"
      />

      <input
        {...props}
        ref={ref}
        onChange={(e) => onChange(e.target.value)}
        className="block text-xs placeholder:text-xs w-full h-4 outline-hidden bg-transparent"
      />
    </div>
  ),
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
