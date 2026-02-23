import { X, Tag } from "lucide-react";
import AutoComplete from "../commons/AutoComplete";
import { cn } from "~/lib/tiptap-utils";

type TagType = { id: string; display: string };
interface Props {
  value: TagType[];
  onChange: (value: TagType[]) => void;
  isError?: boolean;
  placeholder?: string;
}

function TagAutocomplete({
  value,
  onChange,
  isError,
  placeholder = "Search or create tags...",
}: Props) {
  const queryTags = async (query: string) => {
    // Dummy implementation for tag fetching
    const allTags = [
      { id: "1", display: "JavaScript" },
      { id: "2", display: "TypeScript" },
      { id: "3", display: "React" },
      { id: "4", display: "Node.js" },
    ];
    return allTags.filter((tag) =>
      tag.display.toLowerCase().includes(query.toLowerCase()),
    );
  };

  return (
    <AutoComplete
      {...{ value, onChange, isError }}
      placeHolder={placeholder}
      renderSelected={({ option, handleOnRemove }) => (
        <div
          key={option.id}
          className="group/tag px-2.5 py-1 rounded-full bg-gradient-to-r from-(--accent-color)/10 to-(--accent-color)/5 border border-(--accent-color)/20 flex items-center gap-1.5 shadow-sm hover:border-(--accent-color)/30 transition-all duration-200"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-(--accent-color) ring-2 ring-(--accent-color)/20"></div>
          <span className="text-xs font-medium text-(--gray-12)">
            {option.display}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOnRemove(option);
            }}
            className="p-0.5 rounded-full hover:bg-(--gray-3) hover:text-(--red-9) text-(--gray-10) transition-all duration-150 opacity-80 group-hover/tag:opacity-100"
            aria-label={`Remove ${option.display}`}
          >
            <X size="12" strokeWidth={2.5} />
          </button>
        </div>
      )}
      queryFn={queryTags}
      allowAdditionalOptions
      popoverContentClasses="bg-(--gray-1) border border-(--gray-5) shadow-xl shadow-black/5 rounded-lg"
    >
      {({ options, handleOnAdd, highlightedIndex, getItemId }) =>
        options.map((tag, index) => (
          <button
            key={getItemId(index)}
            id={getItemId(index)}
            onClick={() => handleOnAdd(tag)}
            className={cn(
              "w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-3 transition-all duration-150",
              index === highlightedIndex
                ? "bg-(--accent-color)/10 text-(--accent-color)"
                : "text-(--gray-11) hover:bg-(--gray-2) hover:text-(--gray-12)",
            )}
          >
            <Tag
              size="14"
              className={cn(
                "transition-colors duration-150",
                index === highlightedIndex
                  ? "text-(--accent-color)"
                  : "text-(--gray-8)",
              )}
            />
            <span className="font-medium">{tag.display}</span>
          </button>
        ))
      }
    </AutoComplete>
  );
}

export default TagAutocomplete;
