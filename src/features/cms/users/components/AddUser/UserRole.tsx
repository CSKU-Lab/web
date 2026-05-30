import { Button } from "~/components/commons/Button";
import type { UserRole } from "~/types/user";

interface UserRoleProps {
  value: UserRole[];
  onSelect: (value: UserRole[]) => void;
}

type Role = {
  name: string;
  value: UserRole;
};

const UserRole = ({ value, onSelect }: UserRoleProps) => {
  const handleOnSelect = (role: UserRole) => {
    if (value.includes(role)) {
      onSelect(value.filter((r) => r !== role));
    } else {
      onSelect([...value, role]);
    }
  };

  const roles: Role[] = [
    {
      name: "Admin",
      value: "admin",
    },
    {
      name: "Instructor",
      value: "instructor",
    },
    {
      name: "Student",
      value: "student",
    },
  ];

  return (
    <div className="flex gap-2">
      {roles.map(({ name, value: _val }) => (
        <Button
          key={name}
          isActive={value.includes(_val)}
          onClick={() => handleOnSelect(_val)}
        >
          {name}
        </Button>
      ))}
    </div>
  );
};

export default UserRole;
