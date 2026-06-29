"use client";

import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import {
  submissionStatusAtom,
  activeSubmissionsAtom,
} from "~/features/core/materials/stores/submission.store";
import type { StatusType } from "~/features/core/materials/components/detail/DetailSection/renderStatus";
import useMaterialSubmissionPagination from "~/features/core/materials/hooks/useMaterialSubmisionPagination";
import { coreSubmissionService } from "~/services/core-submission.service";
import { queryKeys } from "~/queryKeys";
import { firePassConfetti } from "~/lib/confetti";
import type { SubmissionStatus } from "~/types/core-submission";

function mapSubmissionStatus(status: SubmissionStatus): StatusType {
  switch (status) {
    case "passed":
      return "PASSED";
    case "failed":
      return "FAILED";
    case "queued":
    case "running":
      return "GRADING";
    default:
      return "NO_SUBMISSION";
  }
}

export function useSubmissionStatusListener(materialID: string) {
  const queryClient = useQueryClient();
  const setSubmissionStatus = useSetAtom(submissionStatusAtom);
  const [activeSubmissions, setActiveSubmissions] = useAtom(
    activeSubmissionsAtom,
  );

  // Query submission list to find existing active submissions
  const { data: submissionData } = useMaterialSubmissionPagination({
    sort_by: "created_at",
    sort_order: "desc",
  });

  // On mount: Find any existing active submissions and add to atom
  useEffect(() => {
    const firstPage = submissionData?.pages[0]?.data ?? [];
    const existingActive = firstPage
      .filter(
        (sub) => sub.status === "queued" || sub.status === "running",
      )
      .map((sub) => sub.id);

    if (existingActive.length > 0) {
      setActiveSubmissions((prev) => {
        const next = new Set(prev);
        existingActive.forEach((id) => next.add(id));
        return next;
      });
    }
  }, [submissionData, setActiveSubmissions]);

  // Main effect: Create EventSource for each active submission
  useEffect(() => {
    if (activeSubmissions.size === 0) return;

    const eventSources = new Map<string, EventSource>();

    const createEventSourceForSubmission = async (submissionId: string) => {
      try {
        const eventSource = await coreSubmissionService.listenByID(submissionId);
        eventSources.set(submissionId, eventSource);

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.status === "passed" || data.status === "failed") {
              // 1. Update atom for immediate UI update
              setSubmissionStatus(mapSubmissionStatus(data.status));

              // Celebrate a fresh pass (real-time result, not page hydration)
              if (data.status === "passed") {
                firePassConfetti();
              }

              // 2. Update pagination cache (for SubmissionCard)
              queryClient.setQueryData(
                queryKeys.core.material.getPagination(materialID),
                (oldData: any) => {
                  if (!oldData?.pages) return oldData;

                  return {
                    ...oldData,
                    pages: oldData.pages.map((page: any) => ({
                      ...page,
                      data: page.data.map((submission: any) =>
                        submission.id === data.id
                          ? {
                              ...submission,
                              status: data.status,
                              payload: data.payload,
                            }
                          : submission,
                      ),
                    })),
                  };
                },
              );

              // 3. Invalidate material query to refresh overall status
              queryClient.invalidateQueries({
                queryKey: queryKeys.core.material.getById(materialID),
              });

              // 3b. Invalidate sidebar so material status dot updates
              queryClient.invalidateQueries({
                queryKey: queryKeys.sidebar.get(),
              });

              // 4. Close this EventSource
              eventSource.close();

              // 5. Remove from active submissions
              setActiveSubmissions((prev) => {
                const next = new Set(prev);
                next.delete(submissionId);
                return next;
              });
            }
          } catch (error) {
            console.error("Error parsing SSE message:", error);
          }
        };

        eventSource.onerror = (error) => {
          console.error(
            `EventSource error for submission ${submissionId}:`,
            error,
          );

          // Close and remove
          eventSource.close();
          setActiveSubmissions((prev) => {
            const next = new Set(prev);
            next.delete(submissionId);
            return next;
          });
        };
      } catch (error) {
        console.error(
          `Failed to create EventSource for ${submissionId}:`,
          error,
        );
      }
    };

    // Create EventSource for each active submission
    activeSubmissions.forEach((submissionId) => {
      createEventSourceForSubmission(submissionId);
    });

    // Cleanup: Close all EventSources when effect re-runs or unmounts
    return () => {
      eventSources.forEach((es) => es.close());
    };
  }, [
    activeSubmissions,
    materialID,
    queryClient,
    setSubmissionStatus,
    setActiveSubmissions,
  ]);
}
