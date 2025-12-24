import type { CMSSectionLog } from "~/types/cms-section-logs";

type GroupByDateRecord = Record<string, CMSSectionLog[]>;

export const groupByDate = (logs: CMSSectionLog[]) => {
  return logs.reduce((acc, log) => {
    const date = new Date(log.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as GroupByDateRecord);
};
