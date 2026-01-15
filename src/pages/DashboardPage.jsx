import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import CreateFolderButton from "../components/ui/CreateFolderButton";
import CreateFolderModal from "../components/ui/CreateFolderModal";
import Navbar from "../components/ui/Navbar";
import { Folder, Clock, ChevronRight } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Stats Bar remains in Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="Total Folders"
            value={folders.length}
            icon={<Folder className="text-blue-600" />}
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Recently Added"
            value={folders.length}
            icon={<Clock className="text-green-600" />}
            bgColor="bg-green-50"
          />
          <StatCard
            title="Storage"
            value="15 GB"
            icon={<Folder className="text-purple-600" />}
            bgColor="bg-purple-50"
          />
        </div>

        {/* Folder List Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Your Folders
              </h2>
              <p className="text-sm text-gray-500">
                {filteredFolders.length} items
              </p>
            </div>
            <CreateFolderButton onClick={() => setIsCreateOpen(true)} />
          </div>

          <div className="p-6">
            {loading ? (
             <h1>Loading ...</h1>
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

// Sub-components for cleaner code
const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
    <div className={`p-3 ${bgColor} rounded-xl`}>{icon}</div>
  </div>
);

const FolderItem = ({ folder, viewMode }) => (
  <div
    className={`group border border-gray-200 rounded-xl transition-all cursor-pointer hover:border-blue-300 bg-white ${
      viewMode === "grid"
        ? "p-5 hover:shadow-md"
        : "p-4 flex items-center justify-between hover:bg-blue-50"
    }`}
  >
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
        <Folder className="w-5 h-5" />
      </div>
      <h3 className="font-medium text-gray-900 truncate max-w-[150px]">
        {folder.name}
      </h3>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
  </div>
);

export default DashboardPage;
