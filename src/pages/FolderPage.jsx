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
      setIsOwner(data.owner_id === user?.id);
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
      }

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
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center gap-3">
            <Folder className="w-8 h-8 text-blue-600 fill-blue-600/10" />
            <h1 className="text-2xl font-bold text-gray-800">{folder.name}</h1>
          </div>

          {!isOwner && (
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
              Collaborator
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition">
            <Share2 className="w-4 h-4" />
            Share
          </button>

          <button
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition"
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
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm font-medium text-gray-500">
          {files.length} file{files.length !== 1 && "s"}
        </p>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition ${
              viewMode === "grid"
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-1.5 rounded-md transition ${
              viewMode === "list"
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= FILES GRID/LIST ================= */}
      {files.length === 0 ? (
        <div className="border-2 border-dashed rounded-xl p-20 text-center text-gray-400">
          <p className="text-lg">This folder is empty</p>
          <p className="text-sm">Upload files to get started</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
              : "flex flex-col gap-2"
          }
        >
          {files.map((file) => (
            <FileItem key={file.id} file={file} viewMode={viewMode} />
          ))}
        </div>
      )}

      <div className="mt-12 border-t pt-6 text-sm text-gray-400 flex items-center gap-2">
        <Users className="w-4 h-4" />
        Collaborators (coming soon)
      </div>
    </div>
  );
};

/* ================= FILE ITEM COMPONENT ================= */

const FileItem = ({ file, viewMode }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const isImage = file.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);

  useEffect(() => {
    const getSecureUrl = async () => {
      if (isImage) {
        // We use createSignedUrl because the bucket is likely private
        const { data, error } = await supabase.storage
          .from("files")
          .createSignedUrl(file.path, 3600); // 1 hour expiry

        if (data) setImgUrl(data.signedUrl);
        setIsImgLoading(false);
      }
    };
    getSecureUrl();
  }, [file.path, isImage]);

  const gridStyles =
    "flex flex-col p-3 border rounded-xl hover:border-blue-300 hover:shadow-md transition bg-white group";
  const listStyles =
    "flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50 transition bg-white";

  return (
    <div className={viewMode === "grid" ? gridStyles : listStyles}>
      <div
        className={`relative overflow-hidden bg-gray-50 rounded-lg flex items-center justify-center ${
          viewMode === "grid" ? "h-40 w-full mb-3" : "h-12 w-12 mr-4 shrink-0"
        }`}
      >
        {isImage ? (
          imgUrl ? (
            <img
              src={imgUrl}
              alt={file.name}
              className="w-full h-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="animate-pulse bg-gray-200 w-full h-full" />
          )
        ) : (
          <FileIcon className="w-8 h-8 text-gray-300" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold text-gray-700 truncate"
          title={file.name}
        >
          {file.name}
        </p>
        <p className="text-xs text-gray-400">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
};

export default FolderPage;
