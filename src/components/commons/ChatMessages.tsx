import { UIMessage } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { ChatStatus } from "ai";
import { useToolMapper } from "~/hooks/useToolMapper";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyButton } from "./CopyButton";

export const ChatMessages = ({
  messages,
  status,
}: {
  messages: UIMessage[];
  status: ChatStatus;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isExist } = useToolMapper();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="space-y-2">
          {message.parts.map((part, i) => {
            const key = `${message.id}-${i}`;

            if (isExist(part.type)) {
              const toolName = part.type.replace("tool-", "");
              return (
                <div key={key} className="flex justify-center">
                  <div className="text-xs text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                    Using {toolName}
                  </div>
                </div>
              );
            }

            if (part.type === "text") {
              return (
                <div
                  key={key}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`bg-zinc-200 dark:bg-zinc-800 max-w-[85%] rounded-2xl p-3 break-words text-sm ${
                      message.role === "user"
                        ? "rounded-br-sm"
                        : "rounded-bl-sm"
                    }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({
                          node,
                          inline,
                          className,
                          children,
                          ...props
                        }: any) {
                          const match = /language-(\w+)/.exec(className || "");
                          const codeContent = String(children).replace(
                            /\n$/,
                            "",
                          );

                          return !inline && match ? (
                            <div className="my-3 rounded-md overflow-hidden border border-zinc-700 shadow-sm">
                              <div className="bg-zinc-900 px-3 py-1.5 text-[10px] uppercase font-bold text-zinc-400 border-b border-zinc-800 flex justify-between items-center">
                                <span>{match[1]}</span>
                                <CopyButton text={codeContent} />
                              </div>

                              <SyntaxHighlighter
                                {...props}
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                  margin: 0,
                                  padding: "1rem",
                                  fontSize: "0.85rem",
                                  lineHeight: "1.5",
                                  backgroundColor: "#1e1e1e",
                                }}
                              >
                                {codeContent}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code
                              className="bg-zinc-300 dark:bg-zinc-700 px-1 py-0.5 rounded text-sm"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        },
                      }}
                    >
                      {part.text}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      ))}

      {status === "submitted" && (
        <div className="flex justify-start">
          <div className="bg-zinc-200 dark:bg-zinc-800 rounded-2xl rounded-bl-sm p-3 animate-pulse text-sm">
            Thinking...
          </div>
        </div>
      )}

      {status !== "ready" && status !== "submitted" && (
        <div className="flex justify-start">
          <div className="bg-zinc-200 dark:bg-zinc-800 rounded-2xl rounded-bl-sm p-3 animate-pulse text-sm">
            Generating...
          </div>
        </div>
      )}
    </div>
  );
};
