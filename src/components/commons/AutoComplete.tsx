"use client";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import useInputDebounce from "~/hooks/useInputDebounce";
import Loading from "./Loading";
import { SearchX } from "lucide-react";
import { cn } from "~/lib/utils";

interface Props<T extends { id: string | number }> {
  isError?: boolean;
  value?: T[];
  onChange?: (value: T[]) => void;
  queryFn: (query: string) => Promise<T[]>;
  renderSelected?: ({
    option,
    handleOnRemove,
  }: {
    option: T;
    handleOnRemove: (option: T) => void;
  }) => React.ReactNode;
  children?: ({
    options,
    handleOnAdd,
    highlightedIndex,
    getItemId,
  }: {
    options: T[];
    handleOnAdd: (option: T) => void;
    highlightedIndex: number;
    getItemId: (index: number) => string;
  }) => React.ReactNode;
  loadingFallback?: React.ReactNode;
  className?: string;
  queryOnRender?: boolean;
  placeHolder?: string;
  allowAdditionalOptions?: boolean;
  popoverContentClasses?: string;
}

function AutoComplete<T extends { id: string | number; display?: string }>({
  isError,
  value: initialValue,
  onChange,
  queryFn,
  children,
  renderSelected,
  loadingFallback,
  className,
  queryOnRender = false,
  placeHolder,
  allowAdditionalOptions,
  popoverContentClasses,
}: Props<T>) {
  const [value, setValue] = useState<T[]>(initialValue ?? []);
  const [inputValue, setInputValue] = useState("");

  const debouncedInput = useInputDebounce(inputValue, 500);
  const [options, setOptions] = useState<T[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isFirstRender, setIsFirstRender] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  const memoizedOptions = useMemo(
    () => options.filter((option) => !value.some((v) => v.id === option.id)),
    [options, value],
  );

  const isOptionEmpty =
    memoizedOptions.length === 0 && debouncedInput.length > 0 && !isLoading;

  const getItemId = useCallback(
    (index: number) => `${id}-option-${index}`,
    [id],
  );

  const handleOnAdd = (option: T) => {
    const newValue = [...value, option];
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleOnRemove = (option: T) => {
    const newValue = value.filter((v) => v.id !== option.id);
    setValue(newValue);
    onChange?.(newValue);
  };

  useEffect(() => {
    setInputValue("");
  }, [value.length]);

  useEffect(() => {
    if (!isOpen && options.length > 0 && inputValue.length === 0) {
      setOptions([]);
    }
  }, [isOpen, options.length, inputValue.length]);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
    }

    if (isFirstRender && !queryOnRender) return;
    if (debouncedInput.length === 0 && !queryOnRender) return;

    const query = async () => {
      try {
        setIsLoading(true);
        setIsOpen(true);
        const res = await queryFn(debouncedInput);
        setOptions(res);
      } finally {
        setIsLoading(false);
      }
    };
    query();
  }, [queryFn, debouncedInput, isFirstRender, queryOnRender]);

  useEffect(() => {
    if (highlightedIndex > -1) {
      const element = document.getElementById(getItemId(highlightedIndex));
      if (element) {
        element.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, getItemId]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [memoizedOptions]);

  const handleDivClick = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (memoizedOptions.length > 0) {
          setHighlightedIndex((prev) =>
            prev < memoizedOptions.length - 1 ? prev + 1 : 0,
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (memoizedOptions.length > 0) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : memoizedOptions.length - 1,
          );
        }
        break;
      case "Enter":
        if (highlightedIndex >= 0 && highlightedIndex < memoizedOptions.length) {
          e.preventDefault();
          handleOnAdd(memoizedOptions[highlightedIndex]);
        } else if (
          allowAdditionalOptions &&
          inputValue.trim().length > 0
        ) {
          e.preventDefault();
          const currentTime = Date.now();
          const newOption = {
            id: `additional-${currentTime}`,
            display: inputValue.trim(),
          } as T;
          const newValue = [...value, newOption];
          setValue(newValue);
          onChange?.(newValue);
        }
        break;
      case "Backspace":
        if (inputValue.length === 0 && value.length > 0) {
          e.preventDefault();
          const newValue = value.slice(0, -1);
          setValue(newValue);
          onChange?.(newValue);
        }
        break;
      default:
        break;
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Popover open={isOpen && (isOptionEmpty || memoizedOptions.length > 0)}>
      <PopoverAnchor className="w-full">
        <div
          onClick={handleDivClick}
          className={cn(
            "flex flex-wrap items-center border border-(--gray-6) rounded-md px-3 py-1 min-h-9 gap-2 bg-white",
            isError && "border-(--red-9)",
            className,
          )}
        >
          {value.map((option) =>
            renderSelected ? (
              renderSelected({ option, handleOnRemove })
            ) : (
              <DefaultSelectedOption
                key={option.id}
                {...{ option, handleOnRemove }}
              />
            ),
          )}
          <input
            ref={inputRef}
            value={inputValue}
            autoComplete="off"
            placeholder={placeHolder}
            className="border-none flex-1 p-0 h-auto outline-none"
            onKeyDown={handleOnKeyDown}
            onChange={handleOnChange}
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        onInteractOutside={() => {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onWheel={(e) => e.stopPropagation()}
        className={cn(
          "w-(--radix-popper-anchor-width) p-2 max-h-40 overflow-y-auto",
          popoverContentClasses,
        )}
      >
        <Loading {...{ isLoading }} fallback={loadingFallback}>
          {isOptionEmpty ? (
            <DefaultEmptyState
              searchTerm={debouncedInput}
              allowAdditionalOptions={allowAdditionalOptions}
              onCreateNew={() => {
                const newOption = {
                  id: `additional-${Date.now()}`,
                  display: debouncedInput.trim(),
                } as T;
                handleOnAdd(newOption);
              }}
            />
          ) : (
            <>
              {children
                ? children({
                    options: memoizedOptions,
                    handleOnAdd,
                    highlightedIndex,
                    getItemId,
                  })
                : memoizedOptions.map((option, index) => (
                    <DefaultOption
                      key={option.id}
                      id={getItemId(index)}
                      option={option}
                      handleOnAdd={handleOnAdd}
                      isHighlighted={highlightedIndex === index}
                    />
                  ))}
            </>
          )}
        </Loading>
      </PopoverContent>
    </Popover>
  );
}

export default AutoComplete;

const DefaultSelectedOption = <
  T extends { id: string | number; display?: string },
>({
  option,
  handleOnRemove,
}: {
  option: T;
  handleOnRemove: (option: T) => void;
}) => (
  <div className="bg-gray-200 text-gray-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full flex items-center">
    {option.display || String(option.id)}
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleOnRemove(option);
      }}
      className="ml-2 text-gray-500 hover:text-gray-700"
    >
      &times;
    </button>
  </div>
);

const DefaultOption = <T extends { id: string | number; display?: string }>({
  option,
  handleOnAdd,
  isHighlighted,
  id,
}: {
  option: T;
  handleOnAdd: (option: T) => void;
  isHighlighted: boolean;
  id: string;
}) => (
  <div
    id={id}
    onClick={() => handleOnAdd(option)}
    className={`p-2 cursor-pointer rounded ${
      isHighlighted ? "bg-gray-100" : ""
    }`}
  >
    {option.display || String(option.id)}
  </div>
);

const DefaultEmptyState = ({
  searchTerm,
  allowAdditionalOptions,
  onCreateNew,
}: {
  searchTerm: string;
  allowAdditionalOptions?: boolean;
  onCreateNew: () => void;
}) => {
  if (allowAdditionalOptions && searchTerm.length > 0) {
    return (
      <div
        onClick={onCreateNew}
        className="p-2 cursor-pointer rounded hover:bg-gray-100 text-sm text-gray-700"
      >
        + Create "{searchTerm}"
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-2 text-gray-500 my-4">
      <SearchX size="2rem" />
      <h6 className="text-sm font-medium">No results for "{searchTerm}"</h6>
      <p className="text-xs text-gray-400">Try a different keyword.</p>
    </div>
  );
};
