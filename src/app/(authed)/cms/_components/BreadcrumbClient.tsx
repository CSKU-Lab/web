"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { Fragment, useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { pathNames } from "~/constants/path-names";
import { cn } from "~/lib/utils";
import type { ClassNameProps } from "~/types/classname-props";
import { useBreadcrumbContext } from "./BreadcrumbProvider";

interface PathName {
  [key: string]: string | PathName | Promise<string>;
}

// Paths that exist as breadcrumb labels but don't have actual pages
const INTERMEDIATE_PATHS = ["/sections"];

function isNavigablePath(href: string): boolean {
  for (const intermediate of INTERMEDIATE_PATHS) {
    if (href.endsWith(intermediate)) {
      return false;
    }
  }
  return true;
}

// Get entity name from URL path
function getEntityNameFromPath(
  href: string,
  entities: {
    course: {
      id: string | null;
      data: { name?: string; display_name?: string } | null;
    };
    section: { id: string | null; data: { name?: string } | null };
    lab: { id: string | null; data: { display_name?: string } | null };
    material: { id: string | null; data: { name?: string } | null };
  },
): string | null {
  // Check if this is a course path
  const courseMatch = href.match(/\/courses\/([^/]+)$/);
  if (courseMatch && entities.course.data) {
    return entities.course.data.name || null;
  }

  // Check if this is a section path
  const sectionMatch = href.match(/\/sections\/([^/]+)$/);
  if (sectionMatch && entities.section.data) {
    return entities.section.data.name || null;
  }

  // Check if this is a lab path
  const labMatch = href.match(/\/labs\/([^/]+)$/);
  if (labMatch && entities.lab.data) {
    return entities.lab.data.display_name || null;
  }

  // Check if this is a lab path
  const materialMatch = href.match(/\/materials\/([^/]+)$/);
  if (materialMatch && entities.material.data) {
    return entities.material.data.name || null;
  }

  return null;
}

function BreadcrumbClient({ className }: ClassNameProps) {
  const pathname = usePathname();
  const { entities } = useBreadcrumbContext();

  const memoizedPathNames: PathName = useMemo(() => pathNames, []);

  if (pathname.endsWith("/cms")) return null;

  const paths = pathname
    .split("/")
    .filter((path) => path !== "")
    .map((path) => `/${path}`);

  const renderPaths = paths
    .map((_, i) => paths.slice(0, i + 1))
    .map((path) => {
      const href = path.join("");

      // Try to get entity name from context
      const entityName = getEntityNameFromPath(href, entities);
      if (entityName) {
        return { href, label: entityName, isLoading: false };
      }

      // Fall back to static pathNames
      const label = path.reduce((acc, curr) => {
        if (acc[curr] === undefined) {
          Object.keys(acc).forEach((key) => {
            if (key.startsWith("/[") && key.endsWith("]")) {
              curr = key;
            }
          });

          return (acc = acc[curr] as PathName);
        }
        return (acc = acc[curr] as PathName);
      }, memoizedPathNames);

      return { href, label, isLoading: false };
    })
    .map((path) => {
      if (typeof path.label === "object") {
        return { ...path, label: (path.label["/"] as string) || "Unknown" };
      }
      return path as unknown as {
        href: string;
        label: string;
        isLoading: boolean;
      };
    });

  const MAX_BREADCRUMB_ITEMS = 5;

  return (
    <Breadcrumb className={cn("transition-all", className)}>
      <BreadcrumbList>
        {renderPaths.map(({ label, href }, index) => {
          if (renderPaths.length > MAX_BREADCRUMB_ITEMS) {
            if (
              index > 0 &&
              index < renderPaths.length - MAX_BREADCRUMB_ITEMS
            ) {
              return null;
            }

            if (index === renderPaths.length - MAX_BREADCRUMB_ITEMS) {
              const hiddenPaths = renderPaths.slice(
                1,
                renderPaths.length - (MAX_BREADCRUMB_ITEMS - 1),
              );

              return (
                <Fragment key={index}>
                  <BreadcrumbItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-1">
                        <BreadcrumbEllipsis className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {hiddenPaths.map(({ href, label }) => {
                          const isNavigable = isNavigablePath(href);
                          return (
                            <DropdownMenuItem
                              key={label}
                              disabled={!isNavigable}
                            >
                              {isNavigable ? (
                                <Link {...{ href }}>{label}</Link>
                              ) : (
                                <span className="text-(--gray-10)">
                                  {label}
                                </span>
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </Fragment>
              );
            }
          }

          if (index === renderPaths.length - 1) {
            return (
              <Fragment key={href}>
                <BreadcrumbItem>
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                </BreadcrumbItem>
              </Fragment>
            );
          }

          const isNavigable = isNavigablePath(href);

          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                {isNavigable ? (
                  <BreadcrumbLink asChild>
                    <Link {...{ href }}>{label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <span className="text-(--gray-11)">{label}</span>
                )}
              </BreadcrumbItem>
              {index !== renderPaths.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbClient;
