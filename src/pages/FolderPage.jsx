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
} from "lucide-react";

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
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const filePath = `${user.id}/${id}/${Date.now()}-${file.name}`;

      // 1️⃣ Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2️⃣ Save metadata
      const { error: dbError } = await supabase.from("files").insert({
        name: file.name,
        size: file.size,
        folder_id: id,
        owner_id: user.id,
        path: filePath,
      });

      if (dbError) throw dbError;

      await fetchFiles();
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
  }, [user]);

  if (loading) return <p className="p-6">Loading folder...</p>;
  if (!folder) return <p className="p-6 text-red-500">Folder not found</p>;

  return (
    <div className="min-h-screen p-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <Folder className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-semibold">{folder.name}</h1>
          </div>

          {!isOwner && (
            <span className="text-xs px-3 py-1 rounded-full bg-gray-100">
              Collaborator
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            Share
          </button>

          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Upload"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={handleFileUpload}
          />
        </div>
      </div>

      {/* ================= VIEW TOGGLE ================= */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {files.length} file{files.length !== 1 && "s"}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= FILES ================= */}
      {files.length === 0 ? (
        <div className="border rounded-xl p-10 text-center text-gray-500">
          No files yet
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5"
              : "space-y-3"
          }
        >
          {files.map((file) => (
            <FileItem key={file.id} file={file} viewMode={viewMode} />
          ))}
        </div>
      )}

      <div className="mt-10 border-t pt-6 text-sm text-gray-500 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Collaborators (coming soon)
      </div>
    </div>
  );
};

/* ================= FILE ITEM ================= */

const FileItem = ({ file, viewMode }) => (
  <div
    className={`border rounded-lg hover:shadow transition ${
      viewMode === "grid" ? "p-4" : "p-3 flex justify-between"
    }`}
  >
    <div>
      <p className="font-medium truncate max-w-[180px]">{file.name}</p>
      <p className="text-xs text-gray-400">
        {(file.size / 1024 / 1024).toFixed(2)} MB
      </p>
    </div>
  </div>
);

export default FolderPage;
