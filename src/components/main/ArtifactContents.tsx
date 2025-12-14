import { useArtifact } from "@/apis/artifact";
import { ArtifactInfo } from "@/apis/jobs";
import { ChevronDown } from "lucide-react";
import { useMemo } from "react";
import ChartImage from "./ChartImage";
import MarkdownReport from "./MarkdownReport";
import TableCsv from "./TableCsv";

const ArtifactContents = ({
  artifact_id,
  filename,
  url,
  ...rest
}: ArtifactInfo) => {
  const { data: artifact, isLoading } = useArtifact(artifact_id);

  if (isLoading) {
    return (
      <div className="mb-6 rounded-lg border border-slate-200 bg-white shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-24 w-full rounded bg-slate-200"></div>
        </div>
      </div>
    );
  }

  const linkUrl = useMemo(() => {
    return `${process.env.NEXT_PUBLIC_API_URL || ""}${url}`;
  }, [url]);

  return (
    <details className="mb-6 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden group">
      <summary className="border-b border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors duration-200 flex items-center justify-between list-none">
        <a href={linkUrl} target="_blank" rel="noopener noreferrer">
          <h3 className="text-sm font-semibold text-blue-600 underline">
            {filename}
          </h3>
        </a>
        <ChevronDown className="h-8 w-8 text-slate-500 transition-transform duration-200 group-open:rotate-180 shrink-0 ml-2" />
      </summary>
      <div className="p-8 animate-in fade-in slide-in-from-top-2 duration-200">
        {rest.type === "table_csv" ? (
          <TableCsv
            artifact_id={artifact_id}
            filename={filename}
            url={url}
            {...rest}
          />
        ) : rest.type === "chart_image" ? (
          <div className="flex justify-center">
            <ChartImage
              artifact_id={artifact_id}
              filename={filename}
              url={url}
              {...rest}
            />
          </div>
        ) : rest.type === "markdown_report" ? (
          <MarkdownReport artifact_id={artifact_id} filename={filename} />
        ) : null}
      </div>
    </details>
  );
};

export default ArtifactContents;
