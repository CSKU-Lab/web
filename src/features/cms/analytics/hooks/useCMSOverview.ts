import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { cmsAnalyticsService } from "../services/cms-analytics.service";

const useCMSOverview = (days: number) => {
  return useQuery({
    queryKey: queryKeys.analytics.cmsOverview(days),
    queryFn: () => cmsAnalyticsService.getOverview(days),
  });
};

export default useCMSOverview;
