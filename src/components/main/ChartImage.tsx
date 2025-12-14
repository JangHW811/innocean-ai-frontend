import { ArtifactInfo } from "@/apis/jobs";
import Image from "next/image";

const ChartImage = ({ artifact_id, filename, url, type }: ArtifactInfo) => {
  const imageUrl = `${
    process.env.NEXT_PUBLIC_API_URL || ""
  }/api/artifacts/${artifact_id}`;

  return (
    <Image
      src={imageUrl}
      alt={filename || "Chart"}
      width={1800}
      height={1000}
      className="max-w-full h-auto"
    />
  );
};

export default ChartImage;
