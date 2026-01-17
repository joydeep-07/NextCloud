import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthContext";

const CollaborationRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── same data fetching logic ── (keeping your logic intact)
  useEffect(() => {
    if (!user) return;

    const fetchRequests = async () => {
      setLoading(true);

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

      if (!invites?.length) {
        setRequests([]);
        setLoading(false);
        return;
      }

      const folderIds = invites.map((i) => i.folder_id);
      const inviterIds = invites.map((i) => i.invited_by);

      const [{ data: folders }, { data: profiles }] = await Promise.all([
        supabase.from("folders").select("id, name").in("id", folderIds),
        supabase
          .from("profiles")
          .select("id, first_name, last_name, email")
          .in("id", inviterIds),
      ]);

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
      <div className="py-8 text-center">
        <p className="text-sm text-[var(--text-secondary)] animate-pulse">
          Loading collaboration requests...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
     

      {requests.length === 0 ? (
        <div className="py-10 text-center rounded-xl bg-[var(--bg-secondary)]/60 border border-[var(--border-light)]">
          <p className="text-sm text-[var(--text-secondary)]">
            No pending collaboration requests
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`
                group
                flex items-center justify-between gap-4
                p-4 sm:p-5
                rounded-xl
                bg-[var(--bg-secondary)]/70
                border border-[var(--border-light)]
                
                transition-all duration-200
              `}
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[var(--text-main)] truncate">
                  {req.folder?.name || "Unnamed folder"}
                </p>

                <div className="mt-1 text-xs text-[var(--text-secondary)]">
                  Invited by{" "}
                  <span className="font-medium">
                    {req.inviter
                      ? `${req.inviter.first_name} ${req.inviter.last_name}`
                      : "someone"}
                  </span>
                  {req.inviter?.email && (
                    <span className="ml-1.5 opacity-70">
                      ({req.inviter.email})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => handleAction(req.id, "accepted")}
                  className={`
                    min-w-[88px] px-4 py-2
                    text-sm font-medium
                    rounded-lg
                    bg-green-600/90 hover:bg-green-600
                    text-white
                    shadow-sm
                    transition-all active:scale-97
                  `}
                >
                  Accept
                </button>

                <button
                  onClick={() => handleAction(req.id, "rejected")}
                  className={`
                    min-w-[88px] px-4 py-2
                    text-sm font-medium
                    rounded-lg
                    bg-red-600/90 hover:bg-red-600
                    text-white
                    shadow-sm
                    transition-all active:scale-97
                  `}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollaborationRequests;
