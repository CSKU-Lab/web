import { Trash } from "lucide-react";
import { Button } from "./Button";

interface SettingPaperProps {
  children: React.ReactNode;
  onDelete: () => void;
  deleteLabel: string;
}

export default function SettingPaper({
  children,
  onDelete,
  deleteLabel,
}: SettingPaperProps) {
  return (
    <>
      <div className="flex justify-center py-8">
        <div className="w-full max-w-4xl space-y-8 2xl:mt-10">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="space-y-1.5 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Course Settings
              </h2>
              <p className="text-sm text-gray-600">
                Manage your course details and visibility.
              </p>
              <hr />
            </div>
            {children}
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="space-y-1.5 mb-6">
              <h2 className="text-xl font-semibold text-red-900">
                Danger Zone
              </h2>
              <p className="text-sm text-red-700">
                Deleting this course will permanently remove all associated
                data. This action cannot be undone.
              </p>
              <hr />
            </div>
            <Button variant="danger" className="h-10" onClick={onDelete}>
              <Trash size="1rem" className="mr-2" />
              {deleteLabel}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
