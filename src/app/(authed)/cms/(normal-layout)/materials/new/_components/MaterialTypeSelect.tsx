import { Keyboard, NotebookText, Terminal } from "lucide-react";
import MaterialType from "./MaterialType";

interface Props {
  value: "document" | "code" | "type" | null;
  onChange: (value: "document" | "code" | "type") => void;
}

function MaterialTypeSelect({ value, onChange }: Props) {
  return (
    <div className="flex gap-4">
      <MaterialType
        icon={<NotebookText />}
        name="Document"
        isSelected={value === "document"}
        onSelect={() => onChange("document")}
      />
      <MaterialType
        icon={<Terminal />}
        name="Code"
        isSelected={value === "code"}
        onSelect={() => onChange("code")}
      />
      <MaterialType
        disabled
        icon={<Keyboard />}
        name="Type"
        isSelected={value === "type"}
        onSelect={() => onChange("type")}
      />
    </div>
  );
}

export default MaterialTypeSelect;
