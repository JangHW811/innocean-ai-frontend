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

  const handleDownload = (url: string) => {
    // URL에서 파일명 추출 (예: /api/workspace/{session_id}/{filename} 또는 상대 경로)
    if (!selectedSessionId) {
      console.error("Session ID가 없습니다.");
      return;
    }

    // URL이 상대 경로인 경우
    if (url.startsWith("/") || !url.includes("://")) {
      const filename = url.split("/").pop() || url;
      const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/workspace/${selectedSessionId}/${filename}`;

      // 새 창에서 다운로드
      window.open(downloadUrl, "_blank");
      return;
    }

    // 외부 URL인 경우 그대로 열기
    window.open(url, "_blank");
  };

  // 마크다운 컴포넌트 커스터마이징
  const components: Components = {
    a: ({ node, href, children, ...props }) => {
      const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (href) {
          handleDownload(href);
        }
      };

      return (
        <a
          href={href}
          onClick={handleClick}
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
