import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { queryKeys } from "~/queryKeys";
import { cmsCompareService } from "~/services/cms-compare.service";
import type { CreateCompareConfig } from "~/types/cms-compare";

export default function useCreateCompare() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCompareConfig) => {
      return cmsCompareService.create(data);
    },
    onSuccess: () => {
      toast.success("Compare created successfully!");
      queryClient.invalidateQueries({
        queryKey: queryKeys.compare.all,
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toast.error("Error", {
          description: err.response?.data?.error || "Failed to create compare",
        });
        return;
      }
      toast.error("Something went wrong. Please try again.");
    },
  });
}
