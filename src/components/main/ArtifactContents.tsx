import { useArtifact } from "@/apis/artifact";
import { ArtifactInfo } from "@/apis/jobs";
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
          <div className="h-64 w-full rounded bg-slate-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-lg border border-slate-200 bg-white shadow-sm">
      {filename && (
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-700">{filename}</h3>
        </div>
      )}
      <div className="p-8">
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
    </div>
  );
};

export default ArtifactContents;
