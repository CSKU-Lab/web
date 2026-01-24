import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { queryKeys } from "~/queryKeys";
import { coreSectionService } from "~/services/core-section.service";

const useCoreSection = (sectionID: string) => {
  const queryClient = useQueryClient();
  const unenroll = useMutation({
    mutationFn: () => coreSectionService.unenrollById(sectionID),
    onSuccess: async () => {
      toast.success("Course deleted successfully");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.section.all,
      });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.sidebar.get(),
      });
    },
    onError: (err) => {
      if (err instanceof AxiosError && err.response?.data?.message) {
        toast.error(err.response?.data?.error);
        return;
      }
    },
  });
  return { unenroll };
};

export default useCoreSection;
