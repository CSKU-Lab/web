import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryKeys } from "~/queryKeys";
import { cmsCompareService } from "~/services/cms-compare.service";

export default function useDeleteCompare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (compareId: string) => {
      return cmsCompareService.deleteById(compareId);
    },
    onSuccess: () => {
      toast.success("Compare deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.compare.all,
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to delete compare",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });
}
