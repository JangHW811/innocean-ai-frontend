import { ChevronDown } from "lucide-react";
import { useArtifact } from "@/apis/artifact";
import type { ArtifactInfo } from "@/apis/jobs";
import { fileDownload } from "@/utils/file.util";
import ChartImage from "./ChartImage";
import MarkdownReport from "./MarkdownReport";
import TableCsv from "./TableCsv";

interface ArtifactContentsProps extends ArtifactInfo {
  sequenceNumber?: number;
}

const ArtifactContents = ({
  artifact_id,
  filename,
  url,
  sequenceNumber,
  ...rest
}: ArtifactContentsProps) => {
  const { isLoading } = useArtifact(artifact_id);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-8">
        <div className="animate-pulse">
          <div className="h-24 w-full rounded bg-slate-200"></div>
        </div>
      </div>
    );
  }

  const handleFileDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    fileDownload(url, filename);
  };

  return (
    <details className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden group">
      <summary className="border-b border-slate-200 bg-slate-50 px-4 py-3 cursor-pointer hover:bg-slate-100 transition-colors duration-200 flex items-center justify-between list-none">
        <a
          href={url}
          onClick={handleFileDownload}
          className="cursor-pointer flex items-center gap-2"
        >
          {sequenceNumber && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-semibold shrink-0">
              {sequenceNumber}
            </span>
          )}
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
