import dayjs from "dayjs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import UserRole from "~/components/commons/UserRole";
import type { CMSSectionLog } from "~/types/cms-section-logs";

interface LogGroupProps {
  date: string;
  logs: CMSSectionLog[];
}

const LogGroup = ({ date, logs }: LogGroupProps) => {
  const diffDay = dayjs().diff(dayjs(date), "day");

  const getDay = () => {
    if (diffDay === 0) return "Today";
    if (diffDay === 1) return "Yesterday";
    if (diffDay === 2) return "2 days ago";
    return dayjs(date).format("MMM D, YYYY");
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <h5 className="text-sm text-(--gray-12) font-medium">{getDay()}</h5>
        <div className="w-full h-0.5 bg-(--gray-6) flex-1"></div>
      </div>
      <div className="space-y-2 mb-4">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-4 text-sm mr-4">
            <h6 className="text-(--gray-11) shrink-0 min-w-20">
              {dayjs(log.timestamp).format("HH:mm:ss")}
            </h6>
            <div className="flex gap-1.5 flex-1">
              <HoverCard>
                <HoverCardTrigger>
                  <h6 className="font-semibold underline">
                    @{log.user.username}
                  </h6>
                </HoverCardTrigger>
                <HoverCardContent className="p-0">
                  <div className="px-2 py-4 flex gap-3 rounded-lg">
                    <UserProfileImage
                      src={log.user.profile_image}
                      username={log.user.username}
                    />
                    <div className="flex-1 space-y-0.5 grid text-left">
                      <h4 className="text-sm font-medium truncate text-(--gray-12) leading-tight">
                        {log.user.display_name}
                      </h4>
                      <h6 className="text-xs font-light text-(--gray-10)">
                        @{log.user.username}
                      </h6>
                      <div className="pt-1 flex flex-wrap gap-1">
                        {log.user.roles.map((role) => (
                          <UserRole key={role} {...{ role }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
              <h6>{log.action}</h6>
            </div>

            <h6 className="col-span-2 text-end">{log.ip_address}</h6>
          </div>
        ))}
      </div>
    </>
  );
};

export default LogGroup;
