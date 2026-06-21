"use client";

import { Lock } from "lucide-react";
import { Button } from "~/components/commons/Button";
import { GoogleIcon } from "~/assets/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { AuthProvider } from "~/types/user";

type Props = {
  providers: AuthProvider[];
  pending: AuthProvider | null;
  isLast: boolean;
  googleDisabled?: boolean;
  onEnableRequest: (provider: AuthProvider) => void;
  onDisable: (provider: AuthProvider) => void;
};

const PROVIDERS: { key: AuthProvider; label: string; icon: React.ReactNode }[] = [
  { key: "credential", label: "Credential", icon: <Lock size="1rem" /> },
  { key: "google", label: "Google", icon: <GoogleIcon className="w-4 h-4" /> },
];

const AuthProviderButtons = ({
  providers,
  pending,
  isLast,
  googleDisabled,
  onEnableRequest,
  onDisable,
}: Props) => {
  return (
    <div className="flex items-center gap-2">
      {PROVIDERS.map(({ key, label, icon }) => {
        const enabled = providers.includes(key);
        const isLoading = pending === key;

        if (enabled) {
          const disabledReason = isLast ? "Cannot remove the last login method" : null;
          return (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    type="button"
                    isActive
                    isLoading={isLoading}
                    disabled={isLoading || !!disabledReason}
                    onClick={() => onDisable(key)}
                  >
                    {icon}
                    {label}
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {disabledReason ?? `Click to deselect ${label} login`}
              </TooltipContent>
            </Tooltip>
          );
        }

        const disabledReason =
          key === "google" && googleDisabled ? "Add an email in Account below first" : null;

        return (
          <Tooltip key={key}>
            <TooltipTrigger asChild>
              <span>
                <Button
                  type="button"
                  isLoading={isLoading}
                  disabled={isLoading || !!disabledReason}
                  onClick={() => onEnableRequest(key)}
                >
                  {icon}
                  {label}
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {disabledReason ?? `Click to select ${label} login`}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default AuthProviderButtons;
