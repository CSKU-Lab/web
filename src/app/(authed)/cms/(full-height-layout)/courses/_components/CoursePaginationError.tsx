import { RotateCcw, ServerCrash } from "lucide-react";
import { Button } from "~/components/commons/Button";

function CoursePaginationError() {
  return (
    <div className="p-4 flex flex-col justify-center items-center gap-4 flex-1">
      <div className="bg-(--gray-3) rounded-full p-4 text-(--gray-11)">
        <ServerCrash size="2rem" />
      </div>
      <div>
        <h4 className="text-lg font-medium text-(--gray-12) text-center">
          Cannot fetch courses.
        </h4>
        <p className="text-(--gray-11)">
          There are something went wrong to fetching the courses.
        </p>
      </div>
      <Button>
        <RotateCcw size="1rem" />
        Retry
      </Button>
    </div>
  );
}

export default CoursePaginationError;
