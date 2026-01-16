import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthContext";

const ShareFolderModal = ({ folderId, onClose }) => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(null);

  /* ================= FETCH ALL USERS ================= */
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .neq("id", user.id); // exclude self

      if (error) {
        alert(error.message);
      } else {
        setUsers(data || []);
      }

      setLoading(false);
    };

    if (user) fetchUsers();
  }, [user]);

  /* ================= SEND INVITE ================= */
  const sendInvite = async (inviteeId) => {
    try {
      setSending(inviteeId);

      const { error } = await supabase.from("folder_invites").insert({
        folder_id: folderId,
        invited_by: user.id,
        invited_user_id: inviteeId,
        status: "pending",
      });

      if (error) throw error;

      alert("Invitation sent successfully");
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Share Folder</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {loading && (
            <p className="text-sm text-gray-500 text-center">
              Loading users...
            </p>
          )}

          {!loading && users.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              No users available
            </p>
          )}

          {users.map((u) => (
            <div
              key={u.id}
              className="flex justify-between items-center border rounded-lg p-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {u.first_name} {u.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
              </div>

              <button
                disabled={sending === u.id}
                onClick={() => sendInvite(u.id)}
                className="text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {sending === u.id ? "Sending..." : "Invite"}
              </button>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-4 text-xs text-gray-400 text-center">
          Invited users must accept to access this folder
        </div>
      </div>
    </div>
  );
};

export default ShareFolderModal;
