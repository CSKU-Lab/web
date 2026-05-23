import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryKeys } from "~/queryKeys";
import { cmsRunnerService } from "~/services/cms-runner.service";

export default function useDeleteRunner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (runnerId: string) => {
      return cmsRunnerService.deleteById(runnerId);
    },
    onSuccess: () => {
      toast.success("Runner deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.runner.all,
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to delete runner",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });
}
