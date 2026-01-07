import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader as ShadcnTableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";

interface TableProps extends React.ComponentProps<"table"> {
  containerClassName?: string;
}

function Table({ className, containerClassName, ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      className={cn("relative w-full overflow-x-auto", containerClassName)}
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <ShadcnTableHeader
      className={cn("[&_tr]:border-0", className)}
      {...props}
    />
  );
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
