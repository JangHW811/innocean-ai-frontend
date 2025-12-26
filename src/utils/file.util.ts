export const fileDownload = async (fileUrl: string, filename: string) => {
  if (!fileUrl) return;

  const linkUrl = `${process.env.NEXT_PUBLIC_API_URL || ""}${fileUrl}`;
  try {
    const response = await fetch(linkUrl);
    if (!response.ok) {
      throw new Error("파일 다운로드 실패");
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // 파일 경로에서 파일명 추출
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("다운로드 오류:", error);
    // 실패 시 새 탭에서 열기
    window.open(linkUrl, "_blank");
  }
};
