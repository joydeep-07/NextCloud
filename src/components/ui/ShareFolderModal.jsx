import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { X, Search, Check } from "lucide-react";

const ShareFolderModal = ({ folderId, onClose }) => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [invitedUserIds, setInvitedUserIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);

  /* ================= FETCH INITIAL DATA ================= */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Fetch all users (except current user)
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, email")
          .neq("id", user.id)
          .order("first_name", { ascending: true });

        if (profileError) throw profileError;

        // 2. Fetch existing invites for this folder to disable buttons for already invited users
        const { data: invites, error: inviteError } = await supabase
          .from("folder_invites")
          .select("invited_user_id")
          .eq("folder_id", folderId);

        if (inviteError) throw inviteError;

        setUsers(profiles || []);
        setInvitedUserIds(new Set(invites?.map((i) => i.invited_user_id)));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && folderId) fetchData();
  }, [user, folderId]);

  /* ================= SEARCH FILTER ================= */
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase().trim();

    return users.filter((u) => {
      const fullName = `${u.first_name || ""} ${
        u.last_name || ""
      }`.toLowerCase();
      const email = (u.email || "").toLowerCase();
      return fullName.includes(query) || email.includes(query);
    });
  }, [users, searchQuery]);

  /* ================= SEND INVITE LOGIC ================= */
  const sendInvite = async (inviteeId) => {
    try {
      setSending(inviteeId);

      const inviteToken = crypto.randomUUID();

      const { error } = await supabase.from("folder_invites").insert({
        folder_id: folderId,
        invited_by: user.id,
        invited_user_id: inviteeId,
        status: "pending",
        token: inviteToken,
      });

      if (error) throw error;

      // Update local state to immediately disable the button
      setInvitedUserIds((prev) => new Set([...prev, inviteeId]));
    } catch (err) {
      console.error(err);
      alert("Failed to send invitation: " + err.message);
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--bg-main)] rounded-2xl shadow-2xl border border-[var(--border-light)] overflow-hidden min-h-[70vh] w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-light)]">
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            Invite Collaborator
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 pb-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)]/60 transition-colors"
            />
          </div>
        </div>

        {/* User List */}
        <div className="px-6 pb-6 max-h-[50vh] overflow-y-auto">
          {loading ? (
            <div className="space-y-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-[var(--bg-secondary)]/60 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-[var(--text-secondary)]/70">
              <p className="text-lg">No users found</p>
            </div>
          ) : (
            <div className="space-y-3 mt-2">
              {filteredUsers.map((u) => {
                const isAlreadyInvited = invitedUserIds.has(u.id);
                const isSending = sending === u.id;

                return (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-[var(--border-light)]/70 bg-[var(--bg-secondary)]/30 transition-all"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-[var(--text-main)] truncate">
                        {u.first_name} {u.last_name}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">
                        {u.email}
                      </p>
                    </div>

                    <button
                      disabled={isSending || isAlreadyInvited}
                      onClick={() => sendInvite(u.id)}
                      className={`
                        px-5 py-2 text-sm font-medium rounded-lg flex items-center gap-2
                        transition-all duration-200 min-w-[100px] justify-center
                        ${
                          isSending
                            ? "bg-[var(--accent-secondary)]/40 text-[var(--accent-primary)] cursor-wait"
                            : isAlreadyInvited
                            ? "bg-green-500/10 text-green-600 border border-green-500/20 cursor-default"
                            : "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)] shadow-sm active:scale-95"
                        }
                      `}
                    >
                      {isSending ? (
                        "Sending..."
                      ) : isAlreadyInvited ? (
                        <>
                          <Check size={14} /> Sent
                        </>
                      ) : (
                        "Invite"
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[var(--border-light)] text-xs text-[var(--text-secondary)]/70 text-center bg-[var(--bg-secondary)]/30">
          Invited users will receive access once they accept the request.
        </div>
      </div>
    </div>
  );
};

export default ShareFolderModal;
