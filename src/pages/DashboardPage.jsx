import { useEffect, useRef, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useOutletContext, useNavigate } from "react-router-dom";
import CreateFolderButton from "../components/ui/CreateFolderButton";
import CreateFolderModal from "../components/ui/CreateFolderModal";
import { Folder, MoreVertical, Trash2 } from "lucide-react";
import AskDelete from "../components/ui/AskDelete";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const outlet = useOutletContext() || {};
  const { searchTerm = "", viewMode = "grid", setViewMode = () => {} } = outlet;

  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [usedStorageMB, setUsedStorageMB] = useState(0);

  // New states for delete confirmation
  const [folderToDelete, setFolderToDelete] = useState(null);

  /* ================= FETCH FOLDERS ================= */
  const fetchFolders = async () => {
    if (!user) return;
    setLoading(true);

    const { data: ownedFolders, error: ownedError } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", user.id);

    if (ownedError) console.error(ownedError);

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

  /* ================= DELETE LOGIC ================= */
  const requestDeleteFolder = (folder) => {
    setFolderToDelete(folder);
  };

  const confirmDeleteFolder = async () => {
    if (!folderToDelete) return;

    const folder = folderToDelete;
    setFolderToDelete(null);

    try {
      const { data: files, error: filesError } = await supabase
        .from("files")
        .select("id, path")
        .eq("folder_id", folder.id);

      if (filesError) throw filesError;

      if (files.length > 0) {
        const paths = files.map((f) => f.path);
        const { error: storageError } = await supabase.storage
          .from("files")
          .remove(paths);

        if (storageError) throw storageError;
      }

      await supabase.from("files").delete().eq("folder_id", folder.id);
      await supabase.from("folder_invites").delete().eq("folder_id", folder.id);
      await supabase.from("folders").delete().eq("id", folder.id);

      fetchFolders();
      fetchStorageUsage();
    } catch (err) {
      console.error("Folder deletion failed:", err);
      alert("Failed to delete folder: " + (err.message || "Unknown error"));
    }
  };

  const cancelDelete = () => {
    setFolderToDelete(null);
  };

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
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex-1 min-w-[180px] sm:min-w-[220px]">
                <h4 className="py-1 text-xs font-medium text-[var(--text-secondary)]">
                  Storage Used
                </h4>
                <div
                  className="h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden"
                  title={`${usedStorageMB} MB / 15 GB`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[var(--accent-secondary)] to-[var(--accent-primary)] rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((Number(usedStorageMB) / (15 * 1024)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <p className="text-[10px] text-[var(--text-secondary)]">
                <span className="font-medium text-[var(--text-main)]">
                  {usedStorageMB} MB{" "}
                </span>
                of 15 GB used
              </p>
            </div>

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
                    onDeleteRequest={requestDeleteFolder} // ← Changed name for clarity
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

      {/* Delete Confirmation Modal */}
      {folderToDelete && (
        <AskDelete onConfirm={confirmDeleteFolder} onCancel={cancelDelete} />
      )}
    </div>
  );
};

/* ================= FOLDER ITEM ================= */

export const FolderItem = ({ folder, viewMode, onClick, onDeleteRequest }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    onDeleteRequest?.(folder);
  };

  const isOwnFolder = !folder.isCollaborator;

  return (
    <div
      onClick={onClick}
      className={`
        group relative
        border border-[var(--border-light)]
        rounded-xl
        bg-[var(--bg-main)]
        cursor-pointer
        transition-all duration-200
        ${viewMode === "grid" ? "p-5" : "p-4 py-4"}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div
            className="p-2.5 rounded-lg shrink-0 transition-transform duration-200
              bg-[var(--bg-secondary)]
              text-[var(--accent-primary)]"
          >
            <Folder size={20} />
          </div>

          <div className="min-w-0">
            <h3
              className="
                truncate
                font-body
                text-lg leading-tight
                font-medium
                text-[var(--text-secondary)]
              "
            >
              {folder.name}
            </h3>

            {folder.isCollaborator && (
              <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">
                Shared with you
              </p>
            )}
          </div>
        </div>

        {isOwnFolder && (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown((prev) => !prev);
              }}
              className={`
                p-1.5 -mr-1.5 rounded-lg
                hover:bg-[var(--bg-secondary)]
                transition-all duration-150
                ${showDropdown ? "bg-[var(--bg-secondary)]" : ""}
              `}
              aria-label="Folder options"
            >
              <MoreVertical
                size={18}
                className="text-[var(--text-secondary)]"
              />
            </button>

            {showDropdown && (
              <div
                className="
                  absolute right-0 top-full mt-1
                  w-48
                  bg-[var(--bg-main)]
                  border border-[var(--border-light)]
                  rounded-lg
                  shadow-xl
                  py-1
                  z-20
                  overflow-hidden
                "
              >
                <button
                  onClick={handleDeleteClick}
                  className="
                    w-full px-4 py-2.5
                    text-left text-sm
                    text-red-600 dark:text-red-400
                    hover:bg-[var(--bg-secondary)]
                    flex items-center gap-3
                    transition-colors
                  "
                >
                  <Trash2 size={16} />
                  <span>Delete folder</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
