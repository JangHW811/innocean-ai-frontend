import { Upload } from "lucide-react";

const DataUpload = () => {
  return (
    <div className="p-4 border-t border-gray-200">
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Upload className="w-4 h-4" />
        데이터 업로드
      </button>
    </div>
  );
};

export default DataUpload;
