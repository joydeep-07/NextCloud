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
  Plus,
  MoreVertical,
  Search,
  Filter,
} from "lucide-react";
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

  const fetchFolderMembers = async () => {
    if (!id) return;

    const { data: folderData } = await supabase
      .from("folders")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!folderData) return;

    const { data: ownerProfile } = await supabase
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
      { ...ownerProfile, role: "Owner" },
      ...collaboratorProfiles.map((p) => ({
        ...p,
        role: "Collaborator",
      })),
    ]);
  };

  useEffect(() => {
    if (!user) return;

    Promise.all([fetchFolder(), fetchFiles(), fetchFolderMembers()]).finally(
      () => setLoading(false)
    );
  }, [user, id]);

  if (loading) return <FolderSkeleton />;
  if (!folder) return <div className="p-8 text-red-500">Folder not found</div>;

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen bg-[var(--bg-main)]">
        {/* Modern Header */}
        <div className="sticky top-0 z-10 bg-[var(--bg-main)]/90 backdrop-blur-md ">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-all duration-200 group"
                >
                  <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent-primary)] transition-colors" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-[var(--bg-gradient)] shadow-lg">
                      <Folder className="w-6 h-6 text-[var(--accent-primary)]" />
                    </div>
                    <div className="absolute -inset-1 bg-gradient-to-br from-[var(--accent-primary)]/20 to-transparent rounded-xl blur-sm -z-10"></div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
                      {folder.name}
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)]/70 mt-0.5">
                      {files.length} files • Updated recently
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]/50" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 text-sm w-md rounded-full border border-[var(--border-light)] bg-[var(--bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Members Section - Modern Card Design */}
          <div className="bg-gradient-to-br from-[var(--bg-main)] to-[var(--bg-secondary)] rounded-2xl border border-[var(--border-light)] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[var(--bg-gradient)]">
                  <Users className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-main)]">
                    Folder Members
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {members.length} people have access
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center gap-5">
                {isOwner && (
                  <button
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 border border-[var(--border-light)] text-main rounded-sm hover:shadow-xs  disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    + Add members
                  </button>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[var(--accent-primary)] text-white rounded-sm hover:shadow-lg  disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? "Uploading..." : "Upload Files"}
                </button>
              </div>
            </div>

            {members.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-3 text-[var(--text-secondary)]/30" />
                <p className="text-[var(--text-secondary)]">No members yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="group relative overflow-hidden rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] hover:border-[var(--accent-primary)]/30 p-4 transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[var(--bg-gradient)] font-medium text-[var(--accent-primary)]">
                          {member.first_name?.[0]}
                          {member.last_name?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-main)]">
                            {member.first_name} {member.last_name}
                          </p>
                          <p className="text-sm text-[var(--text-secondary)] truncate max-w-[140px]">
                            {member.email}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          member.role === "Owner"
                            ? "bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 text-[var(--accent-primary)]"
                            : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            multiple
            onChange={handleFileUpload}
          />

          {/* Files Section */}
          <div className="my-12">
            {filteredFiles.length === 0 ? (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/5 to-transparent rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative border-2 border-dashed border-[var(--border-light)] rounded-2xl p-16 text-center bg-[var(--bg-secondary)]/30 backdrop-blur-sm hover:border-[var(--accent-primary)]/30 transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[var(--bg-gradient)] mb-6">
                    <Folder className="w-10 h-10 text-[var(--accent-primary)]" />
                  </div>
                  <h3 className="text-xl font-medium text-[var(--text-main)] mb-2">
                    {searchQuery ? "No files found" : "Folder is empty"}
                  </h3>
                  <p className="text-[var(--text-secondary)]/70 mb-6 max-w-md mx-auto">
                    {searchQuery
                      ? "Try a different search term or upload new files"
                      : "Upload your first file or create a new folder to get started"}
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white hover:shadow-lg transition-all duration-200"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Files
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
                    : "space-y-3"
                }
              >
                {filteredFiles.map((file) => (
                  <FileItem key={file.id} file={file} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
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
