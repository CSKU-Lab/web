import * as React from "react";
import { ChevronDown, Clock } from "lucide-react";

import { Button } from "~/components/commons/Button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

interface Props {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  isError?: boolean;
  disabled?: boolean;
}

const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = Array.from({ length: 60 }, (_, i) => i);

function formatTime(date: Date | undefined): string {
  if (!date) return "--:--";
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function DateTimePicker({
  value,
  onChange,
  isError,
  disabled,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(undefined);
      return;
    }
    const newDate = new Date(date);
    if (value) {
      newDate.setHours(value.getHours());
      newDate.setMinutes(value.getMinutes());
    }
    onChange(newDate);
  };

  const handleHourChange = (hour: string) => {
    if (!value) {
      const newDate = new Date();
      newDate.setHours(parseInt(hour), 0, 0, 0);
      onChange(newDate);
      return;
    }
    const newDate = new Date(value);
    newDate.setHours(parseInt(hour));
    onChange(newDate);
  };

  const handleMinuteChange = (minute: string) => {
    if (!value) {
      const newDate = new Date();
      newDate.setHours(0, parseInt(minute), 0, 0);
      onChange(newDate);
      return;
    }
    const newDate = new Date(value);
    newDate.setMinutes(parseInt(minute));
    onChange(newDate);
  };

  const formatDisplay = () => {
    if (!value) return "Select date and time";
    return `${value.toLocaleDateString()} ${formatTime(value)}`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          className={cn(
            "w-full justify-between h-9 text-sm text-(--gray-12)",
            isError && "border-(--red-9)",
          )}
        >
          {formatDisplay()}
          <ChevronDown size="1rem" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          onSelect={handleDateSelect}
        />
        <div className="border-t border-(--gray-6) p-3">
          <div className="flex items-center gap-2">
            <Clock size="1rem" className="text-(--gray-9)" />
            <div className="flex items-center gap-1">
              <Select
                value={value?.getHours().toString() ?? ""}
                onValueChange={handleHourChange}
              >
                <SelectTrigger className="w-[70px] h-9">
                  <SelectValue placeholder="HH">
                    {value?.getHours().toString().padStart(2, "0") ?? "HH"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {hours.map((h) => (
                    <SelectItem key={h} value={h.toString()}>
                      {h.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-(--gray-9)">:</span>
              <Select
                value={value?.getMinutes().toString() ?? ""}
                onValueChange={handleMinuteChange}
              >
                <SelectTrigger className="w-[70px] h-9">
                  <SelectValue placeholder="MM">
                    {value?.getMinutes().toString().padStart(2, "0") ?? "MM"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((m) => (
                    <SelectItem key={m} value={m.toString()}>
                      {m.toString().padStart(2, "0")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
