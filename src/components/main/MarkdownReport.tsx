import { useArtifact } from "@/apis/artifact";
import { ArtifactInfo } from "@/apis/jobs";
import { useSessionStore } from "@/stores/sessionStore";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useMemo } from "react";

// base64 이미지를 추출하고 마크다운을 청크로 분할하는 함수
interface ExtractedImage {
  alt: string;
  src: string;
}

interface MarkdownChunk {
  type: "markdown" | "image";
  content: string; // markdown인 경우 텍스트, image인 경우 인덱스
  imageIndex?: number;
}

function splitMarkdownByImages(markdown: string): {
  chunks: MarkdownChunk[];
  images: ExtractedImage[];
} {
  const images: ExtractedImage[] = [];
  const chunks: MarkdownChunk[] = [];

  // base64 이미지 패턴들 (여러 형식 지원)
  // 1. 마크다운 형식: ![alt](data:image/...;base64,...)
  // 2. HTML img 태그: <img src="data:image/...;base64,..." />
  const markdownImageRegex = /!\[([^\]]*)\]\((data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=\s]+)\)/g;
  const htmlImageRegex = /<img[^>]*src=["'](data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=\s]+)["'][^>]*\/?>/gi;

  // 모든 이미지 매치를 찾아서 위치와 함께 저장
  interface ImageMatch {
    index: number;
    length: number;
    alt: string;
    src: string;
  }
  const allMatches: ImageMatch[] = [];

  // 마크다운 이미지 찾기
  let match;
  while ((match = markdownImageRegex.exec(markdown)) !== null) {
    const src = match[2].replace(/\s/g, ''); // 줄바꿈/공백 제거
    allMatches.push({
      index: match.index,
      length: match[0].length,
      alt: match[1] || "",
      src: src,
    });
  }

  // HTML 이미지 찾기
  while ((match = htmlImageRegex.exec(markdown)) !== null) {
    const src = match[1].replace(/\s/g, ''); // 줄바꿈/공백 제거
    // alt 속성 추출 시도
    const altMatch = match[0].match(/alt=["']([^"']*)["']/i);
    allMatches.push({
      index: match.index,
      length: match[0].length,
      alt: altMatch ? altMatch[1] : "",
      src: src,
    });
  }

  // 위치순으로 정렬
  allMatches.sort((a, b) => a.index - b.index);

  console.log("[splitMarkdownByImages] Found matches:", allMatches.length);
  if (allMatches.length > 0) {
    console.log("[splitMarkdownByImages] First match preview:", {
      index: allMatches[0].index,
      alt: allMatches[0].alt,
      srcPreview: allMatches[0].src.substring(0, 50) + "...",
    });
  }

  let lastIndex = 0;

  for (const imgMatch of allMatches) {
    // 이미지 전의 마크다운 텍스트
    if (imgMatch.index > lastIndex) {
      const textBefore = markdown.slice(lastIndex, imgMatch.index);
      if (textBefore.trim()) {
        chunks.push({ type: "markdown", content: textBefore });
      }
    }

    // 이미지 정보 저장
    images.push({ alt: imgMatch.alt, src: imgMatch.src });
    chunks.push({ type: "image", content: "", imageIndex: images.length - 1 });

    lastIndex = imgMatch.index + imgMatch.length;
  }

  // 마지막 이미지 이후의 마크다운 텍스트
  if (lastIndex < markdown.length) {
    const textAfter = markdown.slice(lastIndex);
    if (textAfter.trim()) {
      chunks.push({ type: "markdown", content: textAfter });
    }
  }

  // 이미지가 없는 경우 전체 마크다운을 하나의 청크로
  if (chunks.length === 0) {
    chunks.push({ type: "markdown", content: markdown });
  }

  return { chunks, images };
}

const MarkdownReport = ({
  artifact_id,
  filename,
}: Pick<ArtifactInfo, "artifact_id" | "filename">) => {
  const { selectedSessionId } = useSessionStore();
  const { data: artifact, isLoading } = useArtifact(artifact_id);

  // base64 이미지 추출 및 마크다운 분할 (훅은 조건문 전에 호출)
  const { chunks, images } = useMemo(() => {
    if (!artifact) {
      return { chunks: [], images: [] };
    }
    return splitMarkdownByImages(artifact);
  }, [artifact]);

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

  console.log("[MarkdownReport] artifact length:", artifact.length);
  console.log("[MarkdownReport] extracted images:", images.length);
  console.log("[MarkdownReport] chunks:", chunks.length);

  // 디버깅: 이미지가 없으면 마크다운 샘플 출력
  if (images.length === 0) {
    console.log("[MarkdownReport] No images found. Checking for image patterns...");
    console.log("[MarkdownReport] Contains 'data:image':", artifact.includes("data:image"));
    console.log("[MarkdownReport] Contains '![' (markdown img):", artifact.includes("!["));
    console.log("[MarkdownReport] Contains '<img' (html img):", artifact.includes("<img"));
    // 첫 500자 출력
    console.log("[MarkdownReport] First 500 chars:", artifact.substring(0, 500));
  }

  // 마크다운 컴포넌트 커스터마이징
  const components: Components = {
    // 이미지 컴포넌트 (일반 마크다운 이미지용)
    img: ({ node, src, alt, ...props }) => {
      if (!src) {
        return null;
      }

      return (
        <img
          src={src}
          alt={alt || ""}
          className="max-w-full h-auto my-4 rounded-lg shadow-md"
          loading="lazy"
          {...props}
        />
      );
    },
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
      {chunks.map((chunk, idx) => {
        if (chunk.type === "image" && chunk.imageIndex !== undefined) {
          const image = images[chunk.imageIndex];
          if (image) {
            return (
              <div key={`img-${idx}`} className="my-4">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="max-w-full h-auto rounded-lg shadow-md"
                  loading="lazy"
                />
              </div>
            );
          }
          return null;
        }

        return (
          <ReactMarkdown
            key={`md-${idx}`}
            remarkPlugins={[remarkGfm]}
            components={components}
          >
            {chunk.content}
          </ReactMarkdown>
        );
      })}
    </div>
  );
};

export default MarkdownReport;
