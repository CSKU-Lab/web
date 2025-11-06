import InlineError from "../commons/InlineError";
import Label from "../commons/Label";
import SharedInput from "../commons/Input";

interface Props {
  label: string;
  placeholder?: string;
  isError?: boolean;
  errorMessage?: string;
}

function Input({
  label,
  placeholder,
  isError,
  errorMessage,
  ...formProps
}: Props) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <SharedInput className="bg-white" placeholder={placeholder} {...formProps} />
      <InlineError isError={isError}>{errorMessage}</InlineError>
    </div>
  );
}

export default Input;
