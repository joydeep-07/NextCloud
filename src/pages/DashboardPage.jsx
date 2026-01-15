import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import CreateFolderButton from "../components/ui/CreateFolderButton";
import CreateFolderModal from "../components/ui/CreateFolderModal";
import Navbar from "../components/ui/Navbar";
import { Folder, Clock, ChevronRight, Grid, List } from "lucide-react";
import { h1 } from "framer-motion/client";

const DashboardPage = () => {
  const { user } = useAuth();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [storageUsed, setStorageUsed] = useState("10737418249"); // in bytes
  const [storageLoading, setStorageLoading] = useState(true);

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

  const fetchStorageUsage = async () => {
    if (!user) return;
    setStorageLoading(true);
    // Fetch total storage used from your storage table or calculate from files
    // This is a placeholder - you'll need to implement based on your data structure
    const { data, error } = await supabase
      .from("files") // or your storage tracking table
      .select("size")
      .eq("owner_id", user.id);
    
    if (!error && data) {
      const totalUsed = data.reduce((sum, file) => sum + (file.size || 0), 0);
      setStorageUsed(totalUsed);
    }
    setStorageLoading(false);
  };

  useEffect(() => {
    fetchFolders();
    fetchStorageUsage();
  }, [user]);

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate storage values
  const totalStorageGB = 15;
  const totalStorageBytes = totalStorageGB * 1024 * 1024 * 1024; // 15GB in bytes
  const usedGB = storageUsed / (1024 * 1024 * 1024);
  const freeGB = totalStorageGB - usedGB;
  const percentageUsed = (usedGB / totalStorageGB) * 100;

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
          className=" overflow-hidden transition-all"
        
        >
          <div
            className="p-6 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border-light)" }}
          >
            <div>
              {/* Display a progessbar that show how moch space left and how much used out og 15GB */}
              <div className="w-64">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium" style={{ color: "var(--text-main)" }}>
                    Storage
                  </span>
                 
                </div>
                <div 
                  className="h-1 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: "var(--accent-primary)",
                      width: `${percentageUsed}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span style={{ color: "var(--text-secondary)" }}>
                    {freeGB.toFixed(1)}GB free
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {percentageUsed.toFixed(0)}% used
                  </span>
                </div>
              </div>
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
             <h1>Loading...</h1>
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
    
  </div>
);

export default DashboardPage;