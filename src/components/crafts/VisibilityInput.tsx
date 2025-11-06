import Label from "../commons/Label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface Props {
  value: "public" | "private";
  onChange: (value: "public" | "private") => void;
  publicText?: string;
  privateText?: string;
}

function VisibilityInput({
  value,
  onChange,
  publicText,
  privateText,
}: Props) {
  return (
    <>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        defaultValue="public"
        className="space-y-2 mt-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="public" id="public" />
          <div className="flex flex-col">
            <Label htmlFor="public" className="font-medium text-(--gray-12)">
              Public
            </Label>
            <p className="text-xs text-(--gray-11)">{publicText}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="private"
            id="private"
            className="font-medium"
          />
          <div className="flex flex-col">
            <Label htmlFor="private" className="font-medium">
              Private
            </Label>
            <p className="text-xs text-(--gray-11)">{privateText}</p>
          </div>
        </div>
      </RadioGroup>
    </>
  );
}

export default VisibilityInput;
