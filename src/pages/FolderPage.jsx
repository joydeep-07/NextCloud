import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import {
  Folder,
  Upload,
  Share2,
  ArrowLeft,
  Grid,
  List,
  Users,
  FileIcon,
  X,
} from "lucide-react";
import ShareFolderModal from "../components/ui/ShareFolderModal";

/* ============================
        FOLDER PAGE
============================ */

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

  /* ================= FETCH FOLDER ================= */
  const fetchFolder = async () => {
    const { data } = await supabase
      .from("folders")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setFolder(data);
      setIsOwner(data.owner_id === user.id);
    }
  };

  /* ================= FETCH FILES ================= */
  const fetchFiles = async () => {
    const { data } = await supabase
      .from("files")
      .select("*")
      .eq("folder_id", id)
      .order("created_at", { ascending: false });

    setFiles(data || []);
  };

  /* ================= UPLOAD FILE ================= */
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

  if (loading) return <p className="p-6 text-gray-500">Loading folder...</p>;
  if (!folder) return <p className="p-6 text-red-500">Folder not found</p>;

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <Folder className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold">{folder.name}</h1>
          </div>

          {!isOwner && (
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
              Collaborator
            </span>
          )}
        </div>

        <div className="flex gap-3">
          {isOwner && (
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          )}

          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white"
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

      {/* ================= VIEW TOGGLE ================= */}
      <div className="flex justify-between mb-6">
        <p className="text-sm text-gray-500">{files.length} files</p>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded ${
              viewMode === "grid" && "bg-white shadow"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded ${
              viewMode === "list" && "bg-white shadow"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= FILE LIST ================= */}
      {files.length === 0 ? (
        <div className="border-dashed border-2 rounded-xl p-20 text-center text-gray-400">
          Folder is empty
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 md:grid-cols-4 gap-6"
              : "flex flex-col gap-2"
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

/* ============================
      SHARE MODAL
============================ */



/* ============================
        FILE ITEM
============================ */

const FileItem = ({ file, viewMode }) => {
  const isImage = file.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);

  return (
    <div
      className={`border rounded-xl p-3 ${
        viewMode === "grid" ? "" : "flex items-center gap-4"
      }`}
    >
      <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
        <FileIcon className="w-6 h-6 text-gray-400" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{file.name}</p>
        <p className="text-xs text-gray-400">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
};

export default FolderPage;
