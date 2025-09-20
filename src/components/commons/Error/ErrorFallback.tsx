import { RotateCcw } from "lucide-react";
import { Button } from "~/components/commons/Button";

interface Props {
  icon: React.ReactNode;
  title: React.ReactNode;
  message: React.ReactNode;
  onRetry?: () => void;
}

function ErrorFallback({ icon, title, message, onRetry }: Props) {
  return (
    <div className="p-4 flex flex-col justify-center items-center gap-4 flex-1">
      <div className="bg-(--gray-3) rounded-full p-4 text-(--gray-11)">
        {icon}
      </div>
      <div className="space-y-2">
        <h4 className="text-xl font-medium text-(--gray-12) text-center">
          {title}
        </h4>
        <p className="text-(--gray-11) text-center">{message}</p>
      </div>
      <Button onClick={onRetry}>
        <RotateCcw size="1rem" />
        Retry
      </Button>
    </div>
  );
}

export default ErrorFallback;
