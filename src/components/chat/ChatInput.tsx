import { useJobInfo } from "@/apis/jobs";
import { useAnalysisJobsStart, useSessionInfo } from "@/apis/sessions";
import { useSessionStore } from "@/stores/sessionStore";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

const ChatInput = () => {
  const { selectedJobId } = useSessionStore();
  const { selectedSessionId } = useSessionStore();
  const { data: jobInfo } = useJobInfo(selectedJobId);
  const { data: sessionInfo } = useSessionInfo(selectedSessionId);
  const { mutateAsync: sendMessage } = useAnalysisJobsStart();
  const { isRunning } = jobInfo || {};
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to get accurate scrollHeight
    textarea.style.height = "auto";

    // Calculate max height for 5 lines (line-height: 1.5rem, text-sm)
    const lineHeight = 22; // 1.5rem = 24px for text-sm
    const maxHeight = lineHeight * 5; // 5 lines max

    // Set height based on content, but limit to max height
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;

    // Enable scroll if content exceeds max height
    textarea.style.overflowY =
      textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    setMessage("");
    sendMessage({
      session_id: selectedSessionId!,
      job_id: selectedJobId!,
      file_ids: sessionInfo?.files?.map((file) => file.file_id) ?? [],
      params: {
        user_request: message,
        options: {},
        first_step: false,
      },
    });

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };
  console.log("selectedJobId", selectedJobId);
  return (
    <div className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white/90 shadow-lg backdrop-blur px-6 py-5">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
        <span>Chat Input</span>
        <span>Ready</span>
      </div>
      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          onChange={handleChange}
          placeholder="예: 최신 트렌드 분석할때 소비자 니즈를 파악해줘"
          className="w-full resize-none border-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none overflow-hidden"
          style={{ minHeight: "22px", maxHeight: "120px" }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSendMessage();
            }
          }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <span>Shift + Enter = 줄바꿈</span>
        {isRunning ? (
          <AnalyzingButton />
        ) : (
          <Button
            onClick={handleSendMessage}
            type="button"
            className="rounded-full h-9 w-26 text-xs font-semibold text-white"
          >
            메시지 보내기
          </Button>
        )}
      </div>
    </div>
  );
};

const AnalyzingButton = () => {
  return (
    <button
      type="button"
      disabled
      className="relative rounded-full flex items-center justify-center h-9 w-26 text-xs font-semibold text-white bg-linear-to-r from-indigo-800 via-purple-800 to-indigo-800 bg-size-[200%_100%] shadow-lg shadow-indigo-500/50 animate-pulse-glow cursor-not-allowed"
      style={{
        animation:
          "gradient 3s ease infinite, pulse-glow 2s ease-in-out infinite",
      }}
    >
      <span className="relative z-10 flex items-center gap-2">
        <span className="flex h-2 w-2">
          <span className="absolute h-2 w-2 rounded-full bg-white animate-ping opacity-75"></span>
          <span className="relative h-2 w-2 rounded-full bg-white"></span>
        </span>
        분석중..
      </span>
    </button>
  );
};

export default ChatInput;
