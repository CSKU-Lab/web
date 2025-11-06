import { CirclePlay, LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import CodeMirror from "~/components/Editor/CodeMirror";
import { playgroundAtom } from "../store/playground";
import { useAtom, useAtomValue } from "jotai";
import { problemAtom } from "../store/editor";
import { cn } from "~/lib/utils";

interface Props {
  className?: string;
}
function Playground({ className }: Props) {
  const { code, problemId, selectedLanguage } = useAtomValue(problemAtom);
  const [{ input, output }, setPlayground] = useAtom(playgroundAtom);

  const handleOnChange = (type: "input" | "output", value: string) => {
    setPlayground((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const [isRunning, setIsRunning] = useState(false);
  const handleOnRun = async () => {
    setIsRunning(true);
    try {
      console.log("Run");
      console.log("problemId", problemId);
      console.log("code", code);
      console.log("selectedLanguage", selectedLanguage);
    } catch (e) {
    } finally {
      setTimeout(() => {
        setIsRunning(false);
      }, 3000);
    }
  };

  return (
    <div
      className={cn(
        "bg-white border rounded-lg flex flex-col flex-1 min-h-56 overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 p-2">
        <h4 className="font-medium text-(--gray-12) text-sm leading-tight">
          Playground
        </h4>
        <Button
          onClick={handleOnRun}
          className="space-x-2 w-fit"
          variant="outline"
          size="sm"
        >
          {isRunning ? (
            <LoaderCircle size="1rem" className="animate-spin" />
          ) : (
            <CirclePlay size="1rem" />
          )}

          <h6> {isRunning ? "Running" : "Run"}</h6>
        </Button>
      </div>

      <Tabs defaultValue="input" className="min-h-0 flex-1 flex flex-col">
        <TabsList className="self-start">
          <TabsTrigger value="input">Input</TabsTrigger>
          <TabsTrigger value="output">Output</TabsTrigger>
        </TabsList>
        <TabsContent value="input" className="flex-1 overflow-auto">
          <CodeMirror
            value={input}
            onChange={(value) => handleOnChange("input", value)}
          />
        </TabsContent>
        <TabsContent value="output" className="flex-1 overflow-auto">
          <CodeMirror
            value={output}
            onChange={(value) => handleOnChange("output", value)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Playground;
