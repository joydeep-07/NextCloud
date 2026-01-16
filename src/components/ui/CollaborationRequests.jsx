import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthContext";

const CollaborationRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRequests = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("folder_invites")
        .select(
          `
          id,
          status,
          created_at,
          folders (
            id,
            name
          ),
          inviter:profiles!folder_invites_invited_by_fkey (
            first_name,
            last_name,
            email
          )
        `
        )
        .eq("invited_user_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching requests:", error);
      } else {
        setRequests(data || []);
      }

      setLoading(false);
    };

    fetchRequests();
  }, [user]);

  const handleAction = async (inviteId, action) => {
    await supabase
      .from("folder_invites")
      .update({ status: action })
      .eq("id", inviteId);

    setRequests((prev) => prev.filter((r) => r.id !== inviteId));
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading requests...</p>;
  }

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold">Collaboration Requests</h2>

      {requests.length === 0 && (
        <p className="text-sm text-gray-500">No pending requests</p>
      )}

      {requests.map((req) => (
        <div
          key={req.id}
          className="border rounded-lg p-4 flex justify-between items-center"
        >
          <div>
            <p className="text-sm font-medium">
              Folder: <span className="font-semibold">{req.folders?.name}</span>
            </p>

            <p className="text-xs text-gray-500">
              Invited by: {req.inviter.first_name} {req.inviter.last_name}
            </p>

            <p className="text-xs text-gray-400">{req.inviter.email}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleAction(req.id, "accepted")}
              className="px-3 py-1 text-sm bg-green-600 text-white rounded"
            >
              Accept
            </button>

            <button
              onClick={() => handleAction(req.id, "rejected")}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollaborationRequests;
