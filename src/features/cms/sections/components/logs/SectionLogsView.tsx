"use client";

import useGetSectionLogs from "~/features/cms/sections/hooks/logs/useGetSectionLogs";
import { groupByDate } from "~/features/cms/sections/transformers/logs/index";
import LogGroup from "~/features/cms/sections/components/logs/LogGroup";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import RouteNavigation from "~/features/cms/sections/components/RouteNavigation";

function SectionLogsView() {
  const {
    data: logDatas,
    hasNextPage,
    fetchNextPage,
  } = useGetSectionLogs({ sort_by: "timestamp", sort_order: "desc" });

  const logGroups = groupByDate(
    logDatas?.pages.flatMap((page) => page.data) || [],
  );

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  return (
    <>
      <RouteNavigation title="Logs" />
      <div className="h-full ml-4">
        {Object.entries(logGroups).map(([date, logs]) => (
          <LogGroup key={date} date={date} logs={logs} />
        ))}
        <div ref={bottomDivRef} className="h-20" />
      </div>
    </>
  );
}

export default SectionLogsView;
