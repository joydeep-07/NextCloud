import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { FileIcon } from "lucide-react";

const FileItem = ({ file, viewMode }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);

  useEffect(() => {
    if (!isImage) return;

    const loadPreview = async () => {
      const { data, error } = await supabase.storage
        .from("files")
        .createSignedUrl(file.path, 60 * 60); // 1 hour

      if (!error) {
        setPreviewUrl(data.signedUrl);
      }
    };

    loadPreview();
  }, [file.path, isImage]);

  return (
    <div
      className={`border rounded-xl overflow-hidden ${
        viewMode === "grid" ? "p-3" : "flex items-center gap-4 p-3"
      }`}
    >
      {/* IMAGE / ICON */}
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden ${
          viewMode === "grid" ? "h-40 w-full mb-3" : "w-12 h-12"
        }`}
      >
        {isImage && previewUrl ? (
          <img
            src={previewUrl}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileIcon className="w-6 h-6 text-gray-400" />
        )}
      </div>

      {/* FILE INFO */}
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-gray-400">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
};

export default FileItem;
