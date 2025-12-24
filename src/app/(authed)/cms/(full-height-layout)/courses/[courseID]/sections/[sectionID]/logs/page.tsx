"use client";

import useGetSectionLogs from "./_hooks/useGetSectionLogs";
import { groupByDate } from "./_transformers";
import LogGroup from "./_components/LogGroup";
import useOnElementAppear from "~/hooks/useOnElementAppear";

function LogPage() {
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
    <div className="h-full ml-4">
      {Object.entries(logGroups).map(([date, logs]) => (
        <LogGroup key={date} date={date} logs={logs} />
      ))}
      <div ref={bottomDivRef} className="h-20" />
    </div>
  );
}

export default LogPage;
