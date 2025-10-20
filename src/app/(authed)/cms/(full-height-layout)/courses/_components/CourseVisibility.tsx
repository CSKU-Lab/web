"use client";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "~/components/commons/Select";
import { visibilities, type VisibilityKey } from "~/types/visibilities";

interface Props {
  selected: VisibilityKey;
  onChange: (type: VisibilityKey) => void;
}

function CourseVisibility({ selected, onChange }: Props) {
  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger asChild>
        <Button className="my-4 shrink-0 px-3 py-1.5">
          <SlidersHorizontal size="1rem" />
          Show : {visibilities[selected]}
        </Button>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(visibilities).map(([key, value]) => (
          <SelectItem key={key} className="flex items-center gap-2" value={key}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default CourseVisibility;

/*
 * */
