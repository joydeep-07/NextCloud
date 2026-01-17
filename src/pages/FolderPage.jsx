import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { Folder, Upload, ArrowLeft, Users, Search } from "lucide-react";
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
  const [viewMode] = useState("grid");
  const [isOwner, setIsOwner] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const normalizeString = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const filteredFiles = files.filter((file) => {
    if (!searchQuery.trim()) return true;
    return normalizeString(file.name || "").includes(
      normalizeString(searchQuery),
    );
  });

  const handleFileUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

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

  const fetchFolderMembers = async () => {
    const { data: folderData } = await supabase
      .from("folders")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!folderData) return;

    const { data: owner } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email")
      .eq("id", folderData.owner_id)
      .single();

    const { data: collabs } = await supabase
      .from("folder_invites")
      .select("invited_user_id")
      .eq("folder_id", id)
      .eq("status", "accepted");

    let collaboratorProfiles = [];

    if (collabs?.length) {
      const ids = collabs.map((c) => c.invited_user_id);
      const { data } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .in("id", ids);
      collaboratorProfiles = data || [];
    }

    setMembers([
      { ...owner, role: "Owner" },
      ...collaboratorProfiles.map((p) => ({ ...p, role: "Collaborator" })),
    ]);
  };

  useEffect(() => {
    if (!user) return;

    Promise.all([fetchFolder(), fetchFiles(), fetchFolderMembers()]).finally(
      () => setLoading(false),
    );
  }, [user, id]);

  if (loading) return <FolderSkeleton />;
  if (!folder) return <div className="p-6 text-red-500">Folder not found</div>;

  return (
    <>
      <div className="min-h-screen bg-[var(--bg-main)]">
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-[var(--bg-main)]/90 backdrop-blur-md py-3">
          <div className=" mx-0 md:mx-15 px-4 sm:px-6 ">
            <div className="flex gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition"
                >
                  <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>

                <div className="flex items-center gap-3">
                  <Folder className="w-9 h-9 hidden md:flex text-[var(--accent-primary)]" />
                  <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-main)]">
                      {folder.name}
                    </h1>
                    {/* <p className="text-sm text-[var(--text-secondary)]/70">
                      {files.length} files
                    </p> */}
                  </div>
                </div>
              </div>

              <div className="relative w-full sm:w-64 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]/50" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full text-sm rounded-full bg-[var(--bg-secondary)] border border-[var(--border-light)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className=" mx-0 md:mx-15 px-4 sm:px-6 py-8">
          {/* MEMBERS */}
          <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-4 sm:p-6 mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-[var(--accent-primary)]" />
                <div>
                  <h3 className="font-semibold text-[var(--text-main)]">
                    Folder Members
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {members.length} people
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {isOwner && (
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="px-4 py-2 border border-[var(--border-light)] rounded-sm"
                  >
                    + Add members
                  </button>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--accent-primary)] text-white rounded-sm"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Upload Files"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)]"
                >
                  <p className="font-medium text-[var(--text-main)]">
                    {member.first_name} {member.last_name}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] truncate">
                    {member.email}
                  </p>
                  <span className="text-xs text-[var(--accent-primary)]">
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            onChange={handleFileUpload}
          />

          {/* FILES */}
          {filteredFiles.length === 0 ? (
            <div className="border-2 border-dashed border-[var(--border-light)] rounded-2xl p-8 sm:p-12 md:p-16 text-center bg-[var(--bg-secondary)]">
              <Folder className="w-12 h-12 mx-auto text-[var(--accent-primary)] mb-4" />
              <h3 className="text-lg font-medium text-[var(--text-main)]">
                {searchQuery ? "No files found" : "Folder is empty"}
              </h3>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-6 px-6 py-3 bg-[var(--accent-primary)] text-white rounded-sm"
              >
                Upload Files
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredFiles.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  viewMode={viewMode}
                  currentUserId={user.id}
                  isOwner={isOwner}
                  onDeleted={fetchFiles}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showShareModal && (
        <ShareFolderModal
          folderId={id}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
};

export default FolderPage;
