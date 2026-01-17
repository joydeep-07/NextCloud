import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useOutletContext, useNavigate } from "react-router-dom";
import CreateFolderButton from "../components/ui/CreateFolderButton";
import CreateFolderModal from "../components/ui/CreateFolderModal";
import { Folder, Grid, List } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ===== SAFE OUTLET CONTEXT ===== */
  const outlet = useOutletContext() || {};
  const { searchTerm = "", viewMode = "grid", setViewMode = () => {} } = outlet;

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [usedStorageMB, setUsedStorageMB] = useState(0);

  /* ================= FETCH FOLDERS ================= */
  const fetchFolders = async () => {
    if (!user) return;
    setLoading(true);

    // Owned folders
    const { data: ownedFolders, error: ownedError } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", user.id);

    if (ownedError) console.error(ownedError);

    // Shared folders
    const { data: collaborations, error: collabError } = await supabase
      .from("folder_invites")
      .select(
        `
        folder_id,
        folders (
          id,
          name,
          created_at,
          owner_id
        )
      `,
      )
      .eq("invited_user_id", user.id)
      .eq("status", "accepted");

    if (collabError) console.error(collabError);

    const collaboratorFolders =
      collaborations
        ?.map((c) =>
          c.folders ? { ...c.folders, isCollaborator: true } : null,
        )
        .filter(Boolean) || [];

    const owned =
      ownedFolders?.map((f) => ({ ...f, isCollaborator: false })) || [];

    const map = new Map();
    [...owned, ...collaboratorFolders].forEach((f) => map.set(f.id, f));

    setFolders(Array.from(map.values()));
    setLoading(false);
  };

  /* ================= FETCH STORAGE ================= */
  const fetchStorageUsage = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("files")
      .select("size")
      .eq("owner_id", user.id);

    if (error) {
      console.error("Storage error:", error);
      return;
    }

    const totalBytes = data.reduce((sum, file) => sum + (file.size || 0), 0);

    const totalMB = (totalBytes / (1024 * 1024)).toFixed(2);
    setUsedStorageMB(totalMB);
  };

  useEffect(() => {
    fetchFolders();
    fetchStorageUsage();
  }, [user]);

  /* ================= SEARCH ================= */
  const filteredFolders = folders.filter((folder) =>
    folder?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* ================= UI ================= */
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div
          className="border rounded-2xl overflow-hidden"
          style={{ borderColor: "var(--border-light)" }}
        >
          {/* HEADER */}
          <div
            className="flex sm:flex-row items-center justify-between gap-4 p-4 sm:p-6 border-b"
            style={{ borderColor: "var(--border-light)" }}
          >
           

            {/* Center: Storage */}
            <div className="text-sm text-[var(--text-secondary)]">
              Storage used:
              <span className="ml-1 font-medium text-[var(--text-main)]">
                {usedStorageMB} MB
              </span>
            </div>

            {/* Right: Create */}
            <CreateFolderButton onClick={() => setIsCreateOpen(true)} />
          </div>

          {/* CONTENT */}
          <div className="p-4 sm:p-6">
            {loading ? (
              <p className="text-sm opacity-70">Loading...</p>
            ) : filteredFolders.length === 0 ? (
              <p className="text-sm text-gray-500">No folders found</p>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                    : "space-y-3"
                }
              >
                {filteredFolders.map((folder) => (
                  <FolderItem
                    key={folder.id}
                    folder={folder}
                    viewMode={viewMode}
                    onClick={() => navigate(`/folder/${folder.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isCreateOpen && (
        <CreateFolderModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={() => {
            fetchFolders();
            fetchStorageUsage();
          }}
        />
      )}
    </div>
  );
};

/* ================= FOLDER ITEM ================= */
const FolderItem = ({ folder, viewMode, onClick }) => (
  <div
    onClick={onClick}
    className={`group border rounded-xl cursor-pointer transition-all
      hover:shadow-md hover:scale-[1.01] active:scale-[0.98]
      ${viewMode === "grid" ? "p-5" : "p-4"}
    `}
    style={{
      backgroundColor: "var(--bg-main)",
      borderColor: "var(--border-light)",
    }}
  >
    <div className="flex items-center gap-3">
      <div
        className="p-2 rounded-lg shrink-0"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--accent-primary)",
        }}
      >
        <Folder size={18} />
      </div>

      <div className="min-w-0">
        <h3 className="font-medium truncate">{folder.name}</h3>
        {folder.isCollaborator && (
          <p className="text-xs text-[var(--text-secondary)]">
            Shared with you
          </p>
        )}
      </div>
    </div>
  </div>
);

export default DashboardPage;
