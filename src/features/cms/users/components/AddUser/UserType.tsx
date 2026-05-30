import { Button } from "~/components/commons/Button";
import { Lock } from "lucide-react";
import { GoogleIcon } from "~/assets/icons";

interface UserTypeProps {
  value: "credential" | "oauth" | null;
  onSelect: (value: "credential" | "oauth") => void;
  disabled?: boolean;
}

const UserType = ({ value, onSelect, disabled }: UserTypeProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        disabled={disabled}
        onClick={() => onSelect("credential")}
        isActive={value === "credential"}
      >
        <Lock size="1rem" />
        Credential (Non-KU Student)
      </Button>
      <Button
        disabled={disabled}
        onClick={() => onSelect("oauth")}
        isActive={value === "oauth"}
      >
        <GoogleIcon className="w-4 h-4 mx-auto" />
        OAuth (KU Student)
      </Button>
    </div>
  );
};

export default UserType;
