import { Keyboard, NotebookText, Terminal } from "lucide-react";
import MaterialType from "./MaterialType";

interface Props {
  value: "document" | "code" | "typing" | null;
  onChange: (value: "document" | "code" | "typing") => void;
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
        icon={<Keyboard />}
        name="Typing"
        isSelected={value === "typing"}
        onSelect={() => onChange("typing")}
      />
    </div>
  );
}

export default MaterialTypeSelect;
