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

  // Safe outlet context
  const outlet = useOutletContext() || {};
  const { searchTerm = "", viewMode, setViewMode } = outlet;

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  /* ================= FETCH FOLDERS ================= */
  const fetchFolders = async () => {
    if (!user) return;
    setLoading(true);

    // 1️⃣ Owned folders
    const { data: ownedFolders, error: ownedError } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", user.id);

    if (ownedError) {
      console.error("Owned folders error:", ownedError);
    }

    // 2️⃣ Accepted collaboration folders
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
      `
      )
      .eq("invited_user_id", user.id)
      .eq("status", "accepted");

    if (collabError) {
      console.error("Collaboration folders error:", collabError);
    }

    // 3️⃣ Normalize collaborator folders
    const collaboratorFolders =
      collaborations
        ?.map((c) =>
          c.folders
            ? {
                ...c.folders,
                isCollaborator: true,
              }
            : null
        )
        .filter(Boolean) || [];

    // 4️⃣ Normalize owned folders
    const owned =
      ownedFolders?.map((f) => ({
        ...f,
        isCollaborator: false,
      })) || [];

    // 5️⃣ Merge & remove duplicates
    const map = new Map();
    [...owned, ...collaboratorFolders].forEach((f) => {
      map.set(f.id, f);
    });

    setFolders(Array.from(map.values()));
    setLoading(false);
  };

  useEffect(() => {
    fetchFolders();
  }, [user]);

  /* ================= SEARCH FILTER ================= */
  const filteredFolders = folders.filter((folder) =>
    folder?.name?.toLowerCase().includes((searchTerm || "").toLowerCase())
  );

  /* ================= UI ================= */
  return (
    <div className="px-4 transition-colors duration-400">
      <div className="px-15">
        <div className="overflow-hidden transition-all">
          {/* Header */}
          <div
            className="p-6 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border-light)" }}
          >
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 ${
                  viewMode === "grid" ? "text-[var(--accent-primary)]" : ""
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 ${
                  viewMode === "list" ? "text-[var(--accent-primary)]" : ""
                }`}
              >
                <List size={18} />
              </button>
            </div>

            {/* Only owners can create folders */}
            <CreateFolderButton onClick={() => setIsCreateOpen(true)} />
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <p>Loading...</p>
            ) : filteredFolders.length === 0 ? (
              <p className="text-sm text-gray-500">No folders found</p>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
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
          onCreated={fetchFolders}
        />
      )}
    </div>
  );
};

/* ================= FOLDER ITEM ================= */
const FolderItem = ({ folder, viewMode, onClick }) => (
  <div
    onClick={onClick}
    className={`group border rounded-xl cursor-pointer transition-all ${
      viewMode === "grid" ? "p-5 hover:shadow-lg" : "p-4"
    }`}
    style={{
      backgroundColor: "var(--bg-main)",
      borderColor: "var(--border-light)",
    }}
  >
    <div className="flex items-center gap-4">
      <div
        className="p-2 rounded-lg"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--accent-primary)",
        }}
      >
        <Folder size={20} />
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
