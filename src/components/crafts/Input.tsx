import InlineError from "../commons/InlineError";
import Label from "../commons/Label";
import SharedInput from "../commons/Input";

interface Props {
  label: string;
  placeholder?: string;
  isError?: boolean;
  errorMessage?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

function Input({
  label,
  placeholder,
  isError,
  errorMessage,
  disabled,
  ...formProps
}: Props) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <SharedInput
        className="bg-white"
        placeholder={placeholder}
        disabled={disabled}
        {...formProps}
      />
      <InlineError isError={isError}>{errorMessage}</InlineError>
    </div>
  );
}

export default Input;
