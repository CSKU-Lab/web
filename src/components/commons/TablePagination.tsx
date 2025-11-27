import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react";
import { cn } from "~/lib/utils";

interface TablePaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function TablePagination({
  totalPages,
  currentPage,
  onPageChange,
}: TablePaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    // Calculate start and end of visible pages
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    // Adjust if at the start
    if (currentPage <= 2) {
      end = 4;
    }
    // Adjust if at the end
    if (currentPage >= totalPages - 1) {
      start = totalPages - 3;
    }

    // Add ellipsis if needed
    if (start > 2) {
      pages.push("ellipsis");
    }

    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (end < totalPages - 1) {
      pages.push("ellipsis");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center gap-1.5">
      <PaginationPrevious
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {getPageNumbers().map((page, index) => {
        if (page === "ellipsis") {
          return (
            <Ellipsis
              key={`ellipsis-${index}`}
              size="1rem"
              className="text-(--gray-9)"
            />
          );
        }
        return (
          <PageNumber
            key={page}
            isActive={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PageNumber>
        );
      })}
      <PaginationNext
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
    </div>
  );
}

export default TablePagination;

interface PageNumberProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

const PageNumber = ({ children, isActive, onClick }: PageNumberProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg p-2 w-6 h-6 flex justify-center items-center text-(--gray-9) text-xs",
        isActive
          ? "text-accent-foreground bg-accent"
          : "hover:bg-(--gray-2) hover:text-(--gray-12)",
      )}
    >
      {children}
    </button>
  );
};

interface PaginationActionProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const PaginationAction = ({
  children,
  onClick,
  disabled,
}: PaginationActionProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex justify-center items-center p-1 rounded-lg hover:bg-(--gray-2) hover:text-(--gray-12)",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {children}
    </button>
  );
};

interface PaginationNavigationProps {
  onClick?: () => void;
  disabled?: boolean;
}

const PaginationPrevious = ({
  onClick,
  disabled,
}: PaginationNavigationProps) => {
  return (
    <PaginationAction {...{ onClick, disabled }}>
      <ChevronLeft size="1rem" />
    </PaginationAction>
  );
};

const PaginationNext = ({ onClick, disabled }: PaginationNavigationProps) => {
  return (
    <PaginationAction {...{ onClick, disabled }}>
      <ChevronRight size="1rem" />
    </PaginationAction>
  );
};
