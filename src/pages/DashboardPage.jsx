import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";
import CreateFolderButton from "../components/ui/CreateFolderButton";
import CreateFolderModal from "../components/ui/CreateFolderModal";
import { Folder } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchFolders = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setFolders(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFolders();
  }, [user]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Folders</h1>
        <CreateFolderButton onClick={() => setIsCreateOpen(true)} />
      </div>

      {/* Folder List */}
      {loading ? (
        <p className="text-gray-500">Loading folders...</p>
      ) : folders.length === 0 ? (
        <p className="text-gray-500">No folders created yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="group p-4 border rounded-xl bg-white
                         hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="p-3 rounded-lg bg-blue-50
                             group-hover:bg-blue-100 transition"
                >
                  <Folder className="w-5 h-5 text-blue-600" />
                </div>

                <div>
                  <p className="font-medium text-gray-800">{folder.name}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(folder.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Folder Modal */}
      {isCreateOpen && (
        <CreateFolderModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={fetchFolders}
        />
      )}
    </div>
  );
};

export default DashboardPage;
