import { X } from "lucide-react";
import AutoComplete from "../commons/AutoComplete";
import { cn } from "~/lib/tiptap-utils";

type Tag = { id: string; display: string };
interface Props {
  value: Tag[];
  onChange: (value: Tag[]) => void;
  isError?: boolean;
}

function TagAutocomplete({ value, onChange, isError }: Props) {
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
      renderSelected={({ option, handleOnRemove }) => (
        <div
          key={option.id}
          className="px-2 rounded-full bg-(--gray-3) flex items-center gap-2 border"
        >
          <div className="w-2 h-2 rounded-full bg-(--accent-color)"></div>
          <p className="text-sm">{option.display}</p>
          <button onClick={() => handleOnRemove(option)}>
            <X size="0.965rem" />
          </button>
        </div>
      )}
      queryFn={queryTags}
      allowAdditionalOptions
    >
      {({ options, handleOnAdd, highlightedIndex, getItemId }) =>
        options.map((tag, index) => (
          <button
            key={getItemId(index)}
            id={getItemId(index)}
            onClick={() => handleOnAdd(tag)}
            className={cn(index === highlightedIndex ? "bg-(--gray-3)" : null)}
          >
            {tag.display}
          </button>
        ))
      }
    </AutoComplete>
  );
}

export default TagAutocomplete;
