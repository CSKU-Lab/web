import { cn } from "~/lib/utils";
import type { ChildrenProps } from "~/types/children-props";

export function SettingLayout({ children }: ChildrenProps) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl space-y-8 2xl:mt-10">{children}</div>
    </div>
  );
}

interface VariantProps {
  variant?: "default" | "danger";
}

type SettingCardProps = ChildrenProps & VariantProps;

export function SettingCard({
  children,
  variant = "default",
}: SettingCardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-(--gray-5) rounded-lg p-6",
        variant === "danger" && "bg-(--red-3) border-(--red-6)",
      )}
    >
      {children}
    </div>
  );
}

type SettingTitleProps = ChildrenProps & VariantProps;

export function SettingTitle({ children, variant }: SettingTitleProps) {
  return (
    <h2
      className={cn(
        "text-xl font-semibold text-(--gray-12)",
        variant === "danger" && "text-(--red-11)",
      )}
    >
      {children}
    </h2>
  );
}

export function SettingHeader({ children }: ChildrenProps) {
  return <div className="mb-6">{children}</div>;
}

type SettingDescriptionProps = ChildrenProps & VariantProps;

export function SettingDescription({
  children,
  variant,
}: SettingDescriptionProps) {
  return (
    <p
      className={cn(
        "text-sm text-(--gray-11)",
        variant === "danger" && "text-(--red-11)",
      )}
    >
      {children}
    </p>
  );
}

export function SettingDivider({ variant }: VariantProps) {
  return (
    <hr className={cn("my-4", variant === "danger" && "border-(--red-6)")} />
  );
}

export function SettingSection({ children }: ChildrenProps) {
  return <div className="space-y-4">{children}</div>;
}

export function SettingSectionHeader({ children }: ChildrenProps) {
  return <div className="space-y-1.5">{children}</div>;
}

export function SettingSectionTitle({ children }: ChildrenProps) {
  return <h3 className="text-lg font-medium text-(--gray-12)">{children}</h3>;
}

export function SettingSectionDescription({ children }: ChildrenProps) {
  return <p className="text-sm text-(--gray-11)">{children}</p>;
}
