import { RefreshCcw, CircleCheck, CircleX } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardStatusLine,
  Order,
  Status,
  SubmissionDate,
  Testcase,
} from "./BaseCard";
import { coreSubmissionService } from "~/services/core-submission.service";
import { queryKeys } from "~/queryKeys";

interface SubmissionCardProps {
  id: string;
  order: number;
  status: "queued" | "running" | "passed" | "failed";
  createdAt: string;
  correctCase?: number;
  totalCase?: number;
  onClick: () => void;
  materialID: string;
}

const statusConfig = {
  queued: {
    borderColor: "border-(--gray-6)",
    statusText: "In Queue",
    icon: RefreshCcw,
    iconClassName: "text-(--gray-11)",
    statusClassName: "",
  },
  running: {
    borderColor: "border-(--yellow-6)",
    statusText: "Running",
    icon: RefreshCcw,
    iconClassName: "text-(--yellow-9) animate-spin",
    statusClassName: "text-(--yellow-11)",
  },
  passed: {
    borderColor: "border-(--grass-6)",
    statusText: "Passed",
    icon: CircleCheck,
    iconClassName: "text-(--grass-9)",
    statusClassName: "text-(--grass-11)",
  },
  failed: {
    borderColor: "border-(--tomato-6)",
    statusText: "Failed",
    icon: CircleX,
    iconClassName: "text-(--tomato-9)",
    statusClassName: "text-(--tomato-11)",
  },
};

export function SubmissionCard({
  id,
  order,
  status,
  createdAt,
  correctCase,
  totalCase,
  onClick,
  materialID,
}: SubmissionCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);

  const showTestcase = status === "passed" || status === "failed";

  useEffect(() => {
    if (status === "queued" || status === "running") {
      coreSubmissionService.listenByID(id).then((eventSource) => {
        eventSourceRef.current = eventSource;

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.status === "passed" || data.status === "failed") {
              queryClient.invalidateQueries({
                queryKey: queryKeys.material.core.getSubmissionByID(materialID),
              });
              eventSource.close();
            }
          } catch (error) {
            console.error("Error parsing SSE message:", error);
          }
        };

        eventSource.onerror = () => {
          eventSource.close();
        };
      });
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [id, materialID, queryClient, status]);

  return (
    <Card onClick={onClick} className={config.borderColor}>
      <CardContent>
        <Order>{order}</Order>
        <CardStatusLine>
          <Status className={config.statusClassName}>{config.statusText}</Status>
          {showTestcase && totalCase !== undefined && (
            <Testcase
              correctCase={status === "passed" ? totalCase : (correctCase ?? 0)}
              totalCase={totalCase}
            />
          )}
        </CardStatusLine>
        <SubmissionDate date={createdAt} />
      </CardContent>
      <Icon className={config.iconClassName} />
    </Card>
  );
}
