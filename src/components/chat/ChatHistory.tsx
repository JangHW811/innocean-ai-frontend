import { useJobInfo } from "@/apis/jobs";
import { useSessionStore } from "@/stores/sessionStore";
import { Bot, User } from "lucide-react";
import { useEffect, useMemo } from "react";

const ChatHistory = ({
  scrollContainerRef,
}: {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}) => {
  const { selectedJobId } = useSessionStore();
  const { data: jobInfo } = useJobInfo(selectedJobId);

  const messages = useMemo(() => {
    return jobInfo?.steps?.flatMap((step) => step.messages) || [];
  }, [jobInfo?.steps]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (messages.length > 0) {
      const container = scrollContainerRef.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: "auto",
        });
      }
    }
  }, [messages, scrollContainerRef]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl flex-1 px-4 py-6">
      <div className="space-y-4">
        {messages.map((message, index) => {
          const isUser = message.role === "user";

          return (
            <div
              key={`${message.created_at}-${index}`}
              className={`flex items-start gap-3 ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isUser
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {isUser ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex flex-col gap-1 ${
                  isUser ? "items-end" : "items-start"
                } max-w-[80%]`}
              >
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    isUser
                      ? "bg-indigo-500 text-white rounded-br-sm"
                      : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap wrap-break-word">
                    {message.content}
                  </p>
                </div>
                <span className="text-xs text-slate-400 px-2">
                  {formatTime(message.created_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatHistory;
