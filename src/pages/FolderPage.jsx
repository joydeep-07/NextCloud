import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Folder, Upload, Share2, ArrowLeft, Grid, List, X } from "lucide-react";
import ShareFolderModal from "../components/ui/ShareFolderModal";
import FileItem from "../components/ui/FileItem";
import FolderSkeleton from "../components/ui/FolderSkeleton";

const FolderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [folder, setFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [isOwner, setIsOwner] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const fetchFolder = async () => {
    const { data } = await supabase
      .from("folders")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setFolder(data);
      setIsOwner(data.owner_id === user?.id);
    }
  };

  const fetchFiles = async () => {
    const { data } = await supabase
      .from("files")
      .select("*")
      .eq("folder_id", id)
      .order("created_at", { ascending: false });

    setFiles(data || []);
  };

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    try {
      setUploading(true);

      for (const file of selectedFiles) {
        const filePath = `${user.id}/${id}/${Date.now()}-${file.name}`;

        await supabase.storage.from("files").upload(filePath, file);

        await supabase.from("files").insert({
          name: file.name,
          size: file.size,
          folder_id: id,
          owner_id: user.id,
          path: filePath,
        });
      }

      fetchFiles();
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchFolder(), fetchFiles()]).finally(() => setLoading(false));
  }, [user, id]);

  if (loading)
    return (
      <>
     <FolderSkeleton/>
      </>
    );
  if (!folder) return <div className="p-8 text-red-500">Folder not found</div>;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2.5 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[var(--bg-gradient)] rounded-lg">
                <Folder className="w-7 h-7 text-[var(--accent-primary)]" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] truncate max-w-[65vw] md:max-w-none">
                {folder.name}
              </h1>
            </div>

            {!isOwner && (
              <span className="text-xs px-3 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-light)]">
                Collaborator
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {isOwner && (
              <button
                onClick={() => setShowShareModal(true)}
                className="
                  flex items-center gap-2 
                  px-4 py-2 text-sm font-medium
                  rounded-lg border border-[var(--border-light)]
                  hover:bg-[var(--bg-secondary)] 
                  hover:border-[var(--accent-secondary)]/40
                  transition-all
                "
              >
                <Share2 className="w-4 h-4 text-[var(--accent-primary)]" />
                Share
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="
                flex items-center gap-2 
                px-5 py-2.5 text-sm font-medium
                bg-[var(--accent-primary)] text-white
                rounded-lg shadow-sm
                hover:bg-[var(--accent-secondary)]
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all
              "
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : "Upload"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              multiple
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-sm text-[var(--text-secondary)]/80">
          {files.length} {files.length === 1 ? "file" : "files"}
        </div>

        <div className="flex bg-[var(--bg-secondary)] p-1 rounded-lg border border-[var(--border-light)]/60">
          <button
            onClick={() => setViewMode("grid")}
            className={`
              p-2 rounded-md transition-colors
              ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-[var(--accent-primary)]"
                  : "text-[var(--text-secondary)]/70 hover:text-[var(--text-main)]"
              }
            `}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`
              p-2 rounded-md transition-colors
              ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-[var(--accent-primary)]"
                  : "text-[var(--text-secondary)]/70 hover:text-[var(--text-main)]"
              }
            `}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Files */}
      {files.length === 0 ? (
        <div
          className="
          border-2 border-dashed border-[var(--border-light)] 
          rounded-2xl p-16 md:p-24 
          text-center 
          bg-[var(--bg-secondary)]/50
        "
        >
          <Folder className="w-12 h-12 mx-auto mb-4 text-[var(--text-secondary)]/40" />
          <p className="text-[var(--text-secondary)]/70 text-lg">
            This folder is empty
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6"
              : "flex flex-col gap-3"
          }
        >
          {files.map((file) => (
            <FileItem key={file.id} file={file} viewMode={viewMode} />
          ))}
        </div>
      )}

      {showShareModal && (
        <ShareFolderModal
          folderId={id}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
};

export default FolderPage;
