import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { FileIcon, X } from "lucide-react";

const FileItem = ({ file, viewMode = "grid" }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);

  useEffect(() => {
    if (!isImage) return;

    setIsLoading(true);
    const loadPreview = async () => {
      const { data, error } = await supabase.storage
        .from("files")
        .createSignedUrl(file.path, 60 * 60);

      if (!error && data?.signedUrl) {
        setPreviewUrl(data.signedUrl);
      }
    };

    loadPreview();
  }, [file.path, isImage]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const openFullScreen = () => {
    if (!isImage || !previewUrl) return;
    setIsFullScreen(true);
  };

  const closeFullScreen = (e) => {
    if (e) e.stopPropagation();
    setIsFullScreen(false);
  };

  return (
    <>
      <div
        className={`
          group
          border border-[var(--border-light)] 
          rounded-xl 
          overflow-hidden 
          transition-all duration-200
          hover:shadow-md hover:border-[var(--accent-secondary)]/50
          hover:-translate-y-0.5
          bg-[var(--bg-secondary)]
          cursor-${isImage ? "pointer" : "default"}
          ${
            viewMode === "grid"
              ? "p-4 flex flex-col"
              : "flex items-center gap-4 p-3.5"
          }
        `}
        onClick={openFullScreen}
        title={isImage ? "Double-click to view full size" : ""}
      >
        {/* Preview / Icon */}
        <div
          className={`
            relative
            bg-gradient-to-br from-[var(--bg-gradient)] to-white/80
            rounded-lg 
            flex items-center justify-center 
            overflow-hidden 
            shrink-0
            border border-[var(--border-light)]/70
            ${viewMode === "grid" ? "aspect-square w-full mb-4" : "w-14 h-14"}
          `}
        >
          {isImage && previewUrl ? (
            <>
              {/* Skeleton Loader */}
              {isLoading && (
                <div className="absolute inset-0 animate-pulse">
                  <div className="w-full h-full bg-gradient-to-br from-[var(--bg-gradient)] via-[var(--border-light)] to-[var(--bg-gradient)] bg-[length:400%_400%] animate-pulse" />
                </div>
              )}

              {/* Image */}
              <img
                src={previewUrl}
                alt={file.name}
                className={`
                  w-full h-full object-cover transition-transform duration-300 group-hover:scale-105
                  ${
                    isLoading
                      ? "opacity-0"
                      : "opacity-100 transition-opacity duration-300"
                  }
                `}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={() => setIsLoading(false)}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-[var(--text-secondary)]/60">
              <FileIcon className="w-7 h-7 mb-1" strokeWidth={1.6} />
              <span className="text-[10px] font-medium opacity-70">
                {file.name.split(".").pop()?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="min-w-0 flex-1">
          <p
            className="
              text-sm font-medium 
              text-[var(--text-main)] 
              truncate
              group-hover:text-[var(--accent-primary)]
              transition-colors
            "
            title={file.name}
          >
            {file.name}
          </p>

          <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]/70">
            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            <span>•</span>
            <span>
              {new Date(
                file.created_at || file.updated_at || Date.now()
              ).toLocaleDateString([], {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullScreen && previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeFullScreen}
        >
          <button
            onClick={closeFullScreen}
            className="
              absolute top-6 right-6 
              p-3 rounded-full 
              bg-black/40 hover:bg-black/60 
              text-white 
              transition-colors
              backdrop-blur-sm
            "
            aria-label="Close fullscreen"
          >
            <X size={28} />
          </button>

          <img
            src={previewUrl}
            alt={file.name}
            className="
              max-w-[95vw] max-h-[95vh] 
              object-contain 
              rounded-lg 
              shadow-2xl
              border border-white/10
            "
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default FileItem;
