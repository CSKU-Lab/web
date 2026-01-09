import Link from "~/components/commons/Link";
import { cn } from "~/lib/utils";

interface Page {
  slug: string;
  title: string;
}
interface Props {
  nextPage?: Page;
  prevPage?: Page;
}
function PageControl({ nextPage, prevPage }: Props) {
  const hasNextPage = typeof nextPage !== "undefined";
  const hasPrevPage = typeof prevPage !== "undefined";

  return (
    <div
      className={cn(
        "flex mt-16 mb-8 gap-10",
        hasNextPage && "justify-end",
        hasPrevPage && hasNextPage && "justify-between",
      )}
    >
      {hasPrevPage && (
        <Link
          className="flex flex-col gap-2 not-prose rounded-lg group flex-1 overflow-hidden max-w-[20rem]"
          href={prevPage.slug}
        >
          <h5 className="text-sm text-(--gray-11) group-hover:text-(--gray-10)">
            Previous
          </h5>
          <h2 className="text-lg font-medium group-hover:text-(--gray-11) text-(--gray-12) truncate">
            {prevPage.title}
          </h2>
        </Link>
      )}
      {hasNextPage && (
        <Link
          className="flex flex-col gap-2 items-end not-prose rounded-lg group flex-1 overflow-hidden max-w-[20rem]"
          href={nextPage.slug}
        >
          <h5 className="text-sm text-(--gray-11) group-hover:text-(--gray-10)">
            Next
          </h5>
          <h2 className="text-lg font-medium group-hover:text-(--gray-11) text-(--gray-12) truncate">
            {nextPage.title}
          </h2>
        </Link>
      )}
    </div>
  );
}

export default PageControl;
