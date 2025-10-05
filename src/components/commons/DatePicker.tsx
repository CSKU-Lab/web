import * as React from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "~/components/commons/Button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/commons/Popover";
import { cn } from "~/lib/utils";

interface Props {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  isError?: boolean;
}

export function DatePicker({ value, onChange, isError }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-full justify-between h-9 text-sm text-(--gray-12)",
            isError && "border-(--red-9)",
          )}
        >
          {value ? value.toLocaleDateString() : "Select date"}
          <ChevronDown size="1rem" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) overflow-hidden p-0"
        align="start"
      >
        <Calendar
          className="w-full"
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
