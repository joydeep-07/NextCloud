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

      // 1️⃣ Fetch invites ONLY
      const { data: invites, error } = await supabase
        .from("folder_invites")
        .select("id, folder_id, invited_by, status, created_at")
        .eq("invited_user_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Invite fetch error:", error);
        setLoading(false);
        return;
      }

      if (!invites || invites.length === 0) {
        setRequests([]);
        setLoading(false);
        return;
      }

      // 2️⃣ Fetch folders
      const folderIds = invites.map((i) => i.folder_id);
      const inviterIds = invites.map((i) => i.invited_by);

      const [{ data: folders }, { data: profiles }] = await Promise.all([
        supabase.from("folders").select("id, name").in("id", folderIds),
        supabase
          .from("profiles")
          .select("id, first_name, last_name, email")
          .in("id", inviterIds),
      ]);

      // 3️⃣ Merge data
      const enriched = invites.map((invite) => ({
        ...invite,
        folder: folders?.find((f) => f.id === invite.folder_id),
        inviter: profiles?.find((p) => p.id === invite.invited_by),
      }));

      setRequests(enriched);
      setLoading(false);
    };

    fetchRequests();
  }, [user]);

  const handleAction = async (inviteId, status) => {
    await supabase.from("folder_invites").update({ status }).eq("id", inviteId);

    setRequests((prev) => prev.filter((r) => r.id !== inviteId));
  };

  if (loading) {
    return (
      <p className="text-sm text-gray-500">Loading collaboration requests…</p>
    );
  }

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold">Collaboration Requests</h2>

      {requests.length === 0 && (
        <p className="text-sm text-gray-500">
          No pending collaboration requests
        </p>
      )}

      {requests.map((req) => (
        <div
          key={req.id}
          className="border rounded-lg p-4 flex justify-between gap-4"
        >
          <div>
            <p className="text-sm">
              Folder:{" "}
              <span className="font-semibold">
                {req.folder?.name || "Unknown folder"}
              </span>
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Invited by:{" "}
              {req.inviter
                ? `${req.inviter.first_name} ${req.inviter.last_name}`
                : "Unknown user"}
            </p>

            {req.inviter?.email && (
              <p className="text-xs text-gray-400">{req.inviter.email}</p>
            )}
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
