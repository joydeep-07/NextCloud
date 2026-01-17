import { useEffect, useState, useRef } from "react";
import { supabase } from "../../services/supabaseClient";
import { FileIcon, X, Trash2, EllipsisVertical } from "lucide-react";
import AskDelete from "./AskDelete"; // Make sure this path is correct

const FileItem = ({
  file,
  viewMode = "grid",
  currentUserId,
  isOwner,
  onDeleted, // callback to refresh the parent list
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dropdownRef = useRef(null);
  const dotsRef = useRef(null);

  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);
  const canDelete = isOwner || file.owner_id === currentUserId;

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        dotsRef.current &&
        !dotsRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load image preview
  useEffect(() => {
    if (!isImage) {
      setIsLoading(false);
      return;
    }

    const loadPreview = async () => {
      try {
        const { data } = await supabase.storage
          .from("files")
          .createSignedUrl(file.path, 60 * 60); // 1 hour

        if (data?.signedUrl) {
          setPreviewUrl(data.signedUrl);
        }
      } catch (err) {
        console.error("Preview load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();
  }, [file.path, isImage]);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (!canDelete || deleting) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    setDeleting(true);

    try {
      // 1. Delete from storage
      const { error: storageError } = await supabase.storage
        .from("files")
        .remove([file.path]);

      if (storageError) throw storageError;

      // 2. Delete from database
      const { error: dbError } = await supabase
        .from("files")
        .delete()
        .eq("id", file.id);

      if (dbError) throw dbError;

      // Success - notify parent
      onDeleted?.(file.id);
      setShowDropdown(false);
    } catch (error) {
      console.error("Delete failed:", error);
      alert(error.message || "Failed to delete file");
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleDotsClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  return (
    <>
      <div className="relative">
        <div
          className={`
            group relative
            border border-[var(--border-light)]
            rounded-xl overflow-hidden
            bg-[var(--bg-secondary)]
            transition hover:shadow-md
            ${viewMode === "grid" ? "p-4" : "p-3.5 flex gap-4"}
          `}
          onClick={() => isImage && setIsFullScreen(true)}
        >
          {/* Floating Delete Button (optional - mobile hidden) */}
          {canDelete && (
            <button
              onClick={handleDeleteClick}
              disabled={deleting}
              className="
                absolute top-2 right-2 z-10
                p-2 rounded-lg
                bg-red-500/90 hover:bg-red-600
                text-white
                opacity-0 group-hover:opacity-100
                transition
                md:hidden
              "
              title="Delete file"
            >
              <Trash2 size={16} />
            </button>
          )}

          {/* Preview Area */}
          <div
            className={`
              rounded-lg overflow-hidden 
              ${viewMode === "grid" ? "aspect-square mb-4" : "w-14 h-14"}
            `}
          >
            {isImage && previewUrl ? (
              <img
                src={previewUrl}
                alt={file.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-black/5">
                <FileIcon size={viewMode === "grid" ? 48 : 32} />
              </div>
            )}
          </div>

          {/* File Name + Menu */}
          <div className="flex-1 min-w-0 flex justify-between items-center">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{file.name}</p>
            </div>

            <button
              ref={dotsRef}
              onClick={handleDotsClick}
              className="p-1.5 hover:bg-[var(--border-light)] rounded-md transition"
            >
              <EllipsisVertical
                size={18}
                className="text-[var(--text-secondary)]"
              />
            </button>
          </div>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="
              absolute right-0 top-full mt-1 z-50
              min-w-48 bg-[var(--bg-main)]
              border border-[var(--border-light)]
              rounded-lg shadow-lg
              overflow-hidden
            "
            style={{
              ...(viewMode === "grid"
                ? { top: "calc(100% - 20px)", right: "8px" }
                : { top: "50%", right: "0", transform: "translateY(-50%)" }),
            }}
          >
            {/* File Info */}
            <div className="p-3 border-b border-[var(--border-light)]">
              <p className="text-sm font-medium truncate mb-1">{file.name}</p>
              <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                <span>Size:</span>
                <span>{formatFileSize(file.size)}</span>
              </div>
              {isImage && (
                <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                  <span>Type:</span>
                  <span>Image</span>
                </div>
              )}
            </div>

            {/* Delete Option */}
            {canDelete && (
              <button
                onClick={handleDeleteClick}
                disabled={deleting}
                className={`
                  w-full px-3 py-2.5
                  flex items-center gap-2
                  text-sm font-medium
                  text-red-600 dark:text-red-400
                  hover:bg-red-50 dark:hover:bg-red-900/20
                  transition-colors
                  ${deleting ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <Trash2 size={16} />
                <span>{deleting ? "Deleting..." : "Delete File"}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <AskDelete onConfirm={confirmDelete} onCancel={cancelDelete} />
      )}

      {/* Fullscreen Image Viewer */}
      {isFullScreen && previewUrl && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setIsFullScreen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white p-2 rounded-full hover:bg-white/10 transition"
            onClick={() => setIsFullScreen(false)}
          >
            <X size={28} />
          </button>
          <img
            src={previewUrl}
            alt={file.name}
            className="max-w-[95vw] max-h-[95vh] object-contain"
            loading="lazy"
          />
        </div>
      )}
    </>
  );
};

export default FileItem;
