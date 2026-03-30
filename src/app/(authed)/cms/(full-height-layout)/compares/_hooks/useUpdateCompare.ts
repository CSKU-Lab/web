import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryKeys } from "~/queryKeys";
import { cmsCompareService } from "~/services/cms-compare.service";
import type { UpdateCompareConfig } from "~/types/cms-compare";

export default function useUpdateCompare(compareId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCompareConfig) => {
      return cmsCompareService.updateById(compareId, data);
    },
    onSuccess: () => {
      toast.success("Compare updated successfully!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.compare.getById(compareId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.compare.all,
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to update compare",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });
}
