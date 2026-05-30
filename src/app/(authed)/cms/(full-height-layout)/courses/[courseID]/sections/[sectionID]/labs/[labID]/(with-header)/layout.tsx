"use client";
import { PropsWithChildren } from "react";
import { useGetSectionLab } from "~/features/cms/sections/hooks/lab-detail/useGetSectionLab";
import { useParams } from "next/navigation";
import { LabStatus } from "~/types/cms-section-lab";
import RouteNavigation from "~/features/cms/sections/components/RouteNavigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PageTitle from "~/components/commons/PageTitle";
import { cn } from "~/lib/utils";

const statusConfig: Record<LabStatus, { text: string; colorClass: string }> = {
  open: { text: "Open", colorClass: "text-(--grass-9)" },
  readonly: { text: "Readonly", colorClass: "text-(--blue-9)" },
  hidden: { text: "Hidden", colorClass: "text-(--gray-9)" },
  disabled: { text: "Disabled", colorClass: "text-(--amber-9)" },
};

function LabWithHeaderLayout({ children }: PropsWithChildren) {
  const { courseID, sectionID, labID } = useParams<{
    courseID: string;
    sectionID: string;
    labID: string;
  }>();

  const { data: lab, isLoading: isLabLoading } = useGetSectionLab({
    sectionID,
    labID,
  });

  const labMenus = [
    {
      name: "Materials",
      href: `/cms/courses/${courseID}/sections/${sectionID}/labs/${labID}`,
    },
    {
      name: "Status",
      href: `/cms/courses/${courseID}/sections/${sectionID}/labs/${labID}/status`,
    },
    {
      name: "Settings",
      href: `/cms/courses/${courseID}/sections/${sectionID}/labs/${labID}/settings`,
    },
  ];

  const statusStyle = lab ? statusConfig[lab.status] : null;

  return (
    <>
      <RouteNavigation
        headerContent={
          <>
            <Link
              href={`/cms/courses/${courseID}/sections/${sectionID}/labs`}
              className="inline-flex items-center gap-2 text-sm text-(--gray-11) hover:text-(--gray-12) mb-2 transition-colors ml-4 my-2.5"
            >
              <ArrowLeft size={16} />
              <span>Back to Labs</span>
            </Link>
            <PageTitle>{lab?.lab_name ?? "Loading..."}</PageTitle>
            {!isLabLoading && lab && (
              <div className="flex items-center gap-3 ml-4 mt-1 text-sm text-(--gray-11)">
                <span className={cn("font-medium", statusStyle?.colorClass)}>
                  {statusStyle?.text}
                </span>
                <span>•</span>
                <span>
                  {lab.completed_students}/{lab.total_students} students
                  completed
                </span>
              </div>
            )}
          </>
        }
        menus={labMenus}
      />
      {children}
    </>
  );
}

export default LabWithHeaderLayout;
