import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "~/queryKeys";
import { coreSidebarService } from "~/services/core-sidebar.service";

export const useSidebar = () =>
  useQuery({
    queryKey: queryKeys.sidebar.get(),
    queryFn: () => coreSidebarService.getSidebar(),
  });
