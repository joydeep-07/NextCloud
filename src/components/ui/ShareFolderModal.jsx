import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import { X, Search } from "lucide-react";

const ShareFolderModal = ({ folderId, onClose }) => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);

  // Fetch all users once
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .neq("id", user.id)
        .order("first_name", { ascending: true });

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data || []);
      }

      setLoading(false);
    };

    if (user) fetchUsers();
  }, [user]);

  // Filtered users (memoized)
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

      alert("Invitation sent successfully!");
      // Optional: you could remove the user from list or show "Sent" badge
    } catch (err) {
      console.error(err);
      alert("Failed to send invitation: " + err.message);
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="
          bg-[var(--bg-main)] 
          
          rounded-2xl 
          shadow-2xl 
          border border-[var(--border-light)]
          overflow-hidden
          min-h-[70vh]
          w-4xl
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-light)]">
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
           Invite Collaborator
          </h2>
          <button
            onClick={onClose}
            className="
              p-2 rounded-full 
              hover:bg-[var(--bg-secondary)] 
              text-[var(--text-secondary)] 
              hover:text-[var(--text-main)]
              transition-colors
            "
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
              placeholder="Search by name ..."
              className="
                w-full pl-10 pr-4 py-2.5 
                bg-[var(--bg-secondary)] 
                border border-[var(--border-light)]
                rounded-lg
                text-[var(--text-main)]
                placeholder-[var(--text-secondary)]/60
                focus:outline-none focus:border-[var(--accent-primary)]/60
                transition-colors
              "
            />
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 max-h-[55vh] overflow-y-auto">
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
              {searchQuery.trim() ? (
                <>
                  <p className="text-lg">No users found</p>
                  <p className="text-sm mt-2">Try different search terms</p>
                </>
              ) : (
                <>
                  <p className="text-lg">No other users yet</p>
                  <p className="text-sm mt-2">
                    There are no users available to invite
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-3 mt-2">
              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="
                    flex items-center justify-between 
                    p-4 rounded-xl 
                    border border-[var(--border-light)]/70
                    hover:border-[var(--accent-secondary)]/40
                    bg-[var(--bg-secondary)]/30
                    transition-all duration-200
                    hover:shadow-sm
                  "
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--text-main)] truncate">
                      {u.first_name} {u.last_name}
                    </p>
                   
                  </div>

                  <button
                    disabled={sending === u.id}
                    onClick={() => sendInvite(u.id)}
                    className={`
                      px-5 py-2 text-sm font-medium rounded-lg
                      transition-all duration-200 min-w-[90px]
                      ${
                        sending === u.id
                          ? "bg-[var(--accent-secondary)]/40 text-[var(--accent-primary)] cursor-wait"
                          : "bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-secondary)] shadow-sm"
                      }
                      disabled:opacity-60
                    `}
                  >
                    {sending === u.id ? "Sending..." : "Invite"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-6 py-4 border-t border-[var(--border-light)] text-xs text-[var(--text-secondary)]/70 text-center bg-[var(--bg-secondary)]/30">
          Invited users will need to accept the invitation to access this folder
        </div>
      </div>
    </div>
  );
};

export default ShareFolderModal;
