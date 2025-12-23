"use client";

import Papa from "papaparse";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { useArtifact } from "@/apis/artifact";
import type { ArtifactInfo } from "@/apis/jobs";

const TableCsv = ({ artifact_id }: ArtifactInfo) => {
  const { data: artifact, isLoading } = useArtifact(artifact_id);
  const parsedData = useMemo(() => {
    if (!artifact) return { headers: [], rows: [] };

    const result = Papa.parse(artifact, {
      header: false,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
    });

    if (!result.data || result.data.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers = (result.data[0] as string[]).map((h) => h.trim());
    const rows = result.data.slice(1) as string[][];

    return { headers, rows };
  }, [artifact]);

  // URL 패턴 정규식 (http:// 또는 https://로 시작하는 것만)
  const urlRegex = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;

  // 텍스트에서 URL을 찾아 링크로 변환하는 함수
  const renderCellContent = (cellValue: string): ReactNode => {
    if (!cellValue || cellValue.trim() === "") return "-";

    const trimmedValue = cellValue.trim();

    // URL이 포함되어 있는지 확인
    const urlMatches = trimmedValue.match(urlRegex);

    if (!urlMatches || urlMatches.length === 0) {
      return <span className="wrap-break-word">{trimmedValue}</span>;
    }

    // URL이 텍스트 전체를 차지하는 경우 (공백 없이 URL만)
    if (
      urlMatches.length === 1 &&
      trimmedValue.replace(urlMatches[0], "").trim() === ""
    ) {
      const url = urlMatches[0].toLowerCase().startsWith("http")
        ? urlMatches[0]
        : `https://${urlMatches[0]}`;
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
        >
          [링크]
        </a>
      );
    }

    // 텍스트 중간에 URL이 포함된 경우
    const parts: (string | ReactNode)[] = [];
    let lastIndex = 0;

    urlMatches.forEach((urlMatch) => {
      const urlIndex = trimmedValue.indexOf(urlMatch, lastIndex);

      // URL 앞의 텍스트 추가
      if (urlIndex > lastIndex) {
        parts.push(trimmedValue.substring(lastIndex, urlIndex));
      }

      // URL을 링크로 변환 (대소문자 구분 없이)
      const url = urlMatch.toLowerCase().startsWith("http")
        ? urlMatch
        : `https://${urlMatch}`;
      parts.push(
        <a
          key={`link-${urlIndex}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
        >
          [링크]
        </a>,
      );

      lastIndex = urlIndex + urlMatch.length;
    });

    // 마지막 URL 이후의 텍스트 추가
    if (lastIndex < trimmedValue.length) {
      parts.push(trimmedValue.substring(lastIndex));
    }

    return <span className="wrap-break-word">{parts}</span>;
  };

  if (isLoading) {
    return (
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-4 w-32 rounded bg-slate-200"></div>
          <div className="h-10 w-full rounded bg-slate-200"></div>
          <div className="h-10 w-full rounded bg-slate-200"></div>
        </div>
      </div>
    );
  }

  if (!artifact || parsedData.headers.length === 0) {
    return (
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4">
        <p className="text-sm text-slate-500">데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50">
              {parsedData.headers.map((header, index) => (
                <th
                  key={header}
                  className="border-b border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parsedData.rows.map((row) => (
              <tr
                key={`row-${JSON.stringify(row)}`}
                className="transition-colors hover:bg-slate-50"
              >
                {parsedData.headers.map((col, colIndex) => (
                  <td
                    key={col}
                    className="border-b border-slate-100 px-4 py-3 text-sm text-slate-700 max-w-xs"
                  >
                    {renderCellContent(row[colIndex] || "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableCsv;
