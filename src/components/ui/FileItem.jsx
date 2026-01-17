import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { FileIcon, X, Trash2 } from "lucide-react";

const FileItem = ({
  file,
  viewMode = "grid",
  currentUserId,
  isOwner,
  onDeleted, // callback to refresh list
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file.name);

  const canDelete = isOwner || file.owner_id === currentUserId;

  useEffect(() => {
    if (!isImage) return;

    const loadPreview = async () => {
      const { data } = await supabase.storage
        .from("files")
        .createSignedUrl(file.path, 60 * 60);

      if (data?.signedUrl) setPreviewUrl(data.signedUrl);
      setIsLoading(false);
    };

    loadPreview();
  }, [file.path, isImage]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!canDelete) return;

    const confirm = window.confirm("Delete this file?");
    if (!confirm) return;

    setDeleting(true);

    /* 1. delete from storage */
    const { error: storageError } = await supabase.storage
      .from("files")
      .remove([file.path]);

    if (storageError) {
      alert(storageError.message);
      setDeleting(false);
      return;
    }

    /* 2. delete db record */
    const { error: dbError } = await supabase
      .from("files")
      .delete()
      .eq("id", file.id);

    if (dbError) {
      alert(dbError.message);
      setDeleting(false);
      return;
    }

    onDeleted?.(file.id);
  };

  return (
    <>
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
        {/* DELETE BUTTON */}
        {canDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="
              absolute top-2 right-2 z-10
              p-2 rounded-lg
              bg-red-500/90 hover:bg-red-600
              text-white
              opacity-0 group-hover:opacity-100
              transition
            "
            title="Delete file"
          >
            <Trash2 size={16} />
          </button>
        )}

        {/* Preview */}
        <div
          className={`
            rounded-lg overflow-hidden border
            ${viewMode === "grid" ? "aspect-square mb-4" : "w-14 h-14"}
          `}
        >
          {isImage && previewUrl ? (
            <img
              src={previewUrl}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <FileIcon />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>

      {/* FULLSCREEN IMAGE */}
      {isFullScreen && previewUrl && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={() => setIsFullScreen(false)}
        >
          <button
            className="absolute top-6 right-6 text-white"
            onClick={() => setIsFullScreen(false)}
          >
            <X size={28} />
          </button>
          <img
            src={previewUrl}
            alt={file.name}
            className="max-w-[95vw] max-h-[95vh]"
          />
        </div>
      )}
    </>
  );
};

export default FileItem;
