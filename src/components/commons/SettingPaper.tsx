import { Trash } from "lucide-react";
import { Button } from "./Button";

import {
  SettingCard,
  SettingDescription,
  SettingDivider,
  SettingHeader,
  SettingLayout,
  SettingTitle,
} from "~/components/crafts/Settings";
import DeleteLabDialog, {
  DeleteLabDialogTrigger,
} from "~/features/cms/courses/components/lab-settings/DeleteLabDialog";

interface SettingPaperProps {
  title: string;
  description?: string;
  children: React.ReactNode;

  dangerTitle?: string;
  dangerDescription?: string;
  dangerAction?: React.ReactNode;
}

export default function SettingPaper({
  title,
  description,
  children,
  dangerTitle,
  dangerDescription,
  dangerAction,
}: SettingPaperProps) {
  return (
    <SettingLayout>
      {/* Main settings */}
      <SettingCard>
        <SettingHeader>
          <SettingTitle>{title}</SettingTitle>
          {description && (
            <SettingDescription>{description}</SettingDescription>
          )}
          <SettingDivider />
        </SettingHeader>

        {children}
      </SettingCard>

      {/* Danger zone (optional) */}
      {dangerAction && (
        <SettingCard variant="danger">
          <SettingHeader>
            <SettingTitle variant="danger">{dangerTitle}</SettingTitle>
            {dangerDescription && (
              <SettingDescription variant="danger">
                {dangerDescription}
              </SettingDescription>
            )}
            <SettingDivider variant="danger" />
          </SettingHeader>

          {dangerAction}
        </SettingCard>
      )}
    </SettingLayout>
  );
}
