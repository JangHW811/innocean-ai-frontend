import { useArtifact } from "@/apis/artifact";
import { ArtifactInfo } from "@/apis/jobs";
import { useSessionStore } from "@/stores/sessionStore";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownReport = ({
  artifact_id,
  filename,
}: Pick<ArtifactInfo, "artifact_id" | "filename">) => {
  const { selectedSessionId } = useSessionStore();
  const { data: artifact, isLoading } = useArtifact(artifact_id);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-full rounded bg-slate-200"></div>
        <div className="h-4 w-full rounded bg-slate-200"></div>
        <div className="h-4 w-3/4 rounded bg-slate-200"></div>
      </div>
    );
  }

  if (!artifact) {
    return (
      <div className="text-sm text-slate-500">마크다운 데이터가 없습니다.</div>
    );
  }

  // 마크다운 컴포넌트 커스터마이징
  const components: Components = {
    a: ({ node, href, children, ...props }) => {
      if (!href) {
        return <a {...props}>{children}</a>;
      }

      // URL이 상대 경로인 경우 (파일 다운로드)
      if (href.startsWith("/") || !href.includes("://")) {
        if (!selectedSessionId) {
          console.error("Session ID가 없습니다.");
          return <a {...props}>{children}</a>;
        }

        const filename = href.split("/").pop() || href;
        const downloadUrl = `${
          process.env.NEXT_PUBLIC_API_URL || ""
        }/api/workspace/${selectedSessionId}/${filename}`;

        const handleDownload = async (
          e: React.MouseEvent<HTMLAnchorElement>
        ) => {
          e.preventDefault();
          try {
            const response = await fetch(downloadUrl);
            if (!response.ok) {
              throw new Error("파일 다운로드 실패");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          } catch (error) {
            console.error("다운로드 오류:", error);
            // 실패 시 새 탭에서 열기
            window.open(downloadUrl, "_blank");
          }
        };

        return (
          <a
            href={downloadUrl}
            onClick={handleDownload}
            className="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
            {...props}
          >
            {children}
          </a>
        );
      }

      // 외부 URL인 경우
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
          {...props}
        >
          {children}
        </a>
      );
    },
  };

  return (
    <div className="markdown-content max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {artifact}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownReport;
