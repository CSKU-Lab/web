"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  if (!mounted) {
    setMounted(true);
  }

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-(--gray-11)">
        <Monitor className="size-4" />
        <span>Theme</span>
      </div>
    );
  }

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <div className="space-y-1">
      {themes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm transition-colors ${
            theme === value
              ? "bg-(--gray-3) text-(--gray-12)"
              : "text-(--gray-11) hover:bg-(--gray-3) hover:text-(--gray-12)"
          }`}
        >
          <Icon className="size-4" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
