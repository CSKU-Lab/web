import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { queryKeys } from "~/queryKeys";
import { coreSectionService } from "~/services/core-section.service";

const useCoreSection = () => {
  const { sectionID } = useParams<{
    sectionID: string;
  }>();
  const useGetCourseSectionDetail = () => {
    return useQuery({
      queryKey: queryKeys.core.section.getById(sectionID),
      queryFn: async () => coreSectionService.getCourseSectionById(sectionID),
      placeholderData: keepPreviousData,
    });
  };
  return { useGetCourseSectionDetail };
};

export default useCoreSection;
