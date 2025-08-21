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
import type { ClassNameProps } from "~/types/classname-props";

interface PathName {
  [key: string]: string | PathName | Promise<string>;
}

function BreadcrumbClient({ className }: ClassNameProps) {
  const pathname = usePathname();

  const memoizedPathNames: PathName = useMemo(() => pathNames, []);

  if (pathname.endsWith("/cms")) return null;

  const paths = pathname
    .split("/")
    .filter((path) => path !== "")
    .map((path) => `/${path}`);

  //TODO: this code can be made more cleaner with seperate function and better type safety :D
  const renderPaths = paths
    .map((_, i) => paths.slice(0, i + 1))
    .map((path) => {
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

      return { href: path.join(""), label };
    })
    .map((path) => {
      if (typeof path.label === "object") {
        return { ...path, label: (path.label["/"] as string) || "Unknown" };
      }
      return path as unknown as { href: string; label: string };
    });

  return (
    <Breadcrumb {...{ className }}>
      <BreadcrumbList>
        {renderPaths.map(({ label, href }, index) => {
          if (renderPaths.length > 3) {
            if (index > 0 && index < paths.length - 3) {
              return null;
            }

            if (index === renderPaths.length - 3) {
              const hiddenPaths = renderPaths.slice(
                index,
                renderPaths.length - 2,
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
                        {hiddenPaths.map(({ href, label }) => (
                          <DropdownMenuItem key={label}>
                            <Link {...{ href }}>{label}</Link>
                          </DropdownMenuItem>
                        ))}
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

          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link {...{ href }}>{label}</Link>
                </BreadcrumbLink>
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
