import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

const InvitePage = () => {
  const { token } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvite = async () => {
      const { data, error } = await supabase
        .from("folder_invites")
        .select("*, folders(name)")
        .eq("token", token)
        .eq("status", "pending")
        .single();

      if (!error) setInvite(data);
      setLoading(false);
    };

    fetchInvite();
  }, [token]);

  if (loading) return <p className="p-6">Loading invite...</p>;
  if (!invite)
    return <p className="p-6 text-red-500">Invalid or expired invite</p>;

  const acceptInvite = async () => {
    await supabase.from("folder_collaborators").insert({
      folder_id: invite.folder_id,
      user_id: user.id,
      role: "collaborator",
      status: "accepted",
    });

    await supabase
      .from("folder_invites")
      .update({ status: "accepted" })
      .eq("id", invite.id);

    navigate(`/folder/${invite.folder_id}`);
  };

  const rejectInvite = async () => {
    await supabase
      .from("folder_invites")
      .update({ status: "rejected" })
      .eq("id", invite.id);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white border rounded-xl p-6 w-full max-w-md">
        <h1 className="text-xl font-bold mb-2">Folder Invitation</h1>
        <p className="text-gray-500 mb-6">
          You are invited to collaborate on
          <span className="font-medium"> {invite.folders.name}</span>
        </p>

        <div className="flex gap-3">
          <button
            onClick={acceptInvite}
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
          >
            Accept
          </button>
          <button
            onClick={rejectInvite}
            className="flex-1 border py-2 rounded-lg"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvitePage;
