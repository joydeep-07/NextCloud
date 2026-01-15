import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import CreateFolderButton from "../components/ui/CreateFolderButton";
import CreateFolderModal from "../components/ui/CreateFolderModal";
import Navbar from "../components/ui/Navbar";
import { Folder, Clock, ChevronRight, Grid, List } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const fetchFolders = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) setFolders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFolders();
  }, [user]);

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 md:p-8 transition-colors duration-400">
      <div className="px-15">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Folder List Container */}
        <div
          className="border overflow-hidden transition-all"
          style={{
            backgroundColor: "var(--bg-main)",
            borderColor: "var(--border-light)",
          }}
        >
          <div
            className="p-6 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border-light)" }}
          >
            <div>
              <h2
                className="text-xl font-bold heading-font"
                style={{ color: "var(--text-main)" }}
              >
                Your Folders
              </h2>
              <p
                className="text-sm opacity-70"
                style={{ color: "var(--text-secondary)" }}
              >
                {filteredFolders.length} items
              </p>
            </div>

            <div className="flex justify-center items-center gap-5">
              <div
                className="flex items-center p-1"
               
              >
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 `}
                  style={{
                  
                    color:
                      viewMode === "grid"
                        ? "var(--accent-primary)"
                        : "var(--text-main)",
                  
                  }}
                >
                  <Grid className="w-4 h-4" />
                  <span className="text-sm font-medium">Grid</span>
                </button>

                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-4 py-2 transition-all duration-300 `}
                  style={{
                  
                    color:
                      viewMode === "list"
                        ? "var(--accent-primary)"
                        : "var(--text-main)",
                   
                  }}
                >
                  <List className="w-4 h-4" />
                  <span className="text-sm font-medium">List</span>
                </button>
              </div>

              <CreateFolderButton onClick={() => setIsCreateOpen(true)} />
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2"
                  style={{ borderColor: "var(--accent-primary)" }}
                ></div>
              </div>
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

const StatCard = ({ title, value, icon }) => (
  <div
    className="p-5 rounded-2xl border flex items-center justify-between transition-all hover:shadow-md"
    style={{
      backgroundColor: "var(--bg-main)",
      borderColor: "var(--border-light)",
    }}
  >
    <div>
      <p
        className="text-sm font-medium opacity-70"
        style={{ color: "var(--text-secondary)" }}
      >
        {title}
      </p>
      <p
        className="text-2xl font-bold mt-1"
        style={{ color: "var(--text-main)" }}
      >
        {value}
      </p>
    </div>
    <div
      className="p-3 rounded-xl"
      style={{
        backgroundColor: "var(--bg-secondary)",
        color: "var(--accent-primary)",
      }}
    >
      {icon}
    </div>
  </div>
);

const FolderItem = ({ folder, viewMode }) => (
  <div
    className={`group border rounded-xl transition-all cursor-pointer ${
      viewMode === "grid"
        ? "p-5 hover:shadow-lg"
        : "p-4 flex items-center justify-between"
    }`}
    style={{
      backgroundColor: "var(--bg-main)",
      borderColor: "var(--border-light)",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = "var(--accent-primary)";
      if (viewMode !== "grid")
        e.currentTarget.style.backgroundColor = "var(--bg-secondary)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = "var(--border-light)";
      if (viewMode !== "grid")
        e.currentTarget.style.backgroundColor = "var(--bg-main)";
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
        <Folder className="w-5 h-5" />
      </div>
      <h3
        className="font-medium truncate max-w-[150px]"
        style={{ color: "var(--text-main)" }}
      >
        {folder.name}
      </h3>
    </div>
    <ChevronRight
      className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-all"
      style={{ color: "var(--accent-primary)" }}
    />
  </div>
);

export default DashboardPage;
