"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
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
  renderSelected: ({
    option,
    handleOnRemove,
  }: {
    option: T;
    handleOnRemove: (option: T) => void;
  }) => React.ReactNode;
  children?: ({
    options,
    handleOnAdd,
  }: {
    options: T[];
    handleOnAdd: (option: T) => void;
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

  const [isFirstRender, setIsFirstRender] = useState(true);

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

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && inputValue.length === 0) {
      e.preventDefault();
      if (value.length > 0) {
        const newValue = value.slice(0, -1);
        setValue(newValue);
        onChange?.(newValue);
      }
    }

    if (
      allowAdditionalOptions &&
      e.key === "Enter" &&
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
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const memoizedOptions = useMemo(
    () => options.filter((option) => !value.some((v) => v.id === option.id)),
    [options, value],
  );

  const isOptionEmpty =
    memoizedOptions.length === 0 && debouncedInput.length > 0 && !isLoading;

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

  return (
    <Popover open={isOpen && (isOptionEmpty || memoizedOptions.length > 0)}>
      <PopoverAnchor className="w-full">
        <div
          onClick={handleDivClick}
          className={cn(
            "flex flex-wrap items-center border rounded-md px-3 py-1 min-h-9 gap-2 bg-white",
            isError && "border-(--red-9)",
            className,
          )}
        >
          {value.map((option) => renderSelected({ option, handleOnRemove }))}
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
        onInteractOutside={() => setIsOpen(false)}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onWheel={(e) => e.stopPropagation()}
        className={cn(
          "w-(--radix-popper-anchor-width) p-2 max-h-40 overflow-y-auto",
          popoverContentClasses,
        )}
      >
        <Loading {...{ isLoading }} fallback={loadingFallback}>
          {isOptionEmpty ? (
            <div className="flex flex-col justify-center items-center gap-2 text-(--gray-11) my-2">
              <SearchX size="1.5rem" />
              <h6 className="text-sm">No options available</h6>
            </div>
          ) : (
            !!children && children({ options: memoizedOptions, handleOnAdd })
          )}
        </Loading>
      </PopoverContent>
    </Popover>
  );
}

export default AutoComplete;
