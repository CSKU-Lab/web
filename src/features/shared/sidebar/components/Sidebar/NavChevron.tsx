import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";
import Link from "~/components/commons/Link";

interface NavChevronProps {
  children?: React.ReactNode;
  href: string;
  _icon?: React.ReactNode;
  name: string;
  subtitle?: string;
}
const NavChevron = ({ href, _icon, name, subtitle, children }: NavChevronProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = Boolean(children);

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center group">
        <Link href={href} className="flex gap-2 items-center flex-1 min-w-0">
          {_icon && (
            <div className="w-7 h-7 bg-(--gray-4) rounded-lg flex items-center justify-center text-xs">
              {_icon}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <h3 className="truncate text-xs font-medium">{name}</h3>
            {subtitle && (
              <p className="text-[10px] text-(--gray-10) truncate">{subtitle}</p>
            )}
          </div>
        </Link>

        {hasChildren && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            className="
              text-(--gray-10) w-6 h-6 rounded-md
              hover:bg-(--gray-3)
              flex justify-center items-center
            "
          >
            {isOpen ? <ChevronUp size="1rem" /> : <ChevronDown size="1rem" />}
          </button>
        )}
      </div>

      {isOpen && children && <div className="">{children}</div>}
    </div>
  );
};

export default NavChevron;
