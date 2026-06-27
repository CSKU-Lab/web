import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { analyticsService } from "../services/analytics.service";

const useAnalyticsOverview = (days: number) => {
  return useQuery({
    queryKey: queryKeys.analytics.overview(days),
    queryFn: () => analyticsService.getOverview(days),
  });
};

export default useAnalyticsOverview;
