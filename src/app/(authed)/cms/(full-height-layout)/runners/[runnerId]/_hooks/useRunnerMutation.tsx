import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryKeys } from "~/queryKeys";
import { cmsRunnerService } from "~/services/cms-runner.service";
import type { WriteRunner } from "~/types/cms-runner";

export default function useRunnerMutation() {
  const { runnerId } = useParams<{ runnerId: string }>();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WriteRunner>) =>
      cmsRunnerService.updateById(runnerId, data),
    onSuccess: () => {
      toast.success("Runner updated successfully");
      queryClient.invalidateQueries({
        queryKey: queryKeys.runner.getById(runnerId),
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to update runner",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });
}
