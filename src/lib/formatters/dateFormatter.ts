import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.extend(utc);

export const dateFormatter = (date: string | Date) => {
  return dayjs(date).format("DD MMM YYYY");
};
