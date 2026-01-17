import { Bell } from "lucide-react";
import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../context/AuthContext";
import CollaborationRequests from "./CollaborationRequests";

export default function Notification() {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Real-time + initial count of pending requests
  useEffect(() => {
    if (!user) return;

    // 1. Initial fetch
    const fetchPendingCount = async () => {
      const { count, error } = await supabase
        .from("folder_invites")
        .select("*", { count: "exact", head: true })
        .eq("invited_user_id", user.id)
        .eq("status", "pending");

      if (!error && count !== null) {
        setCount(count);
      }
    };

    fetchPendingCount();

    // 2. Real-time subscription
    const channel = supabase
      .channel("folder-invites-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "folder_invites",
          filter: `invited_user_id=eq.${user.id}`,
        },
        (payload) => {
          // Most reliable way: refetch count after any change
          fetchPendingCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <>
      {/* Bell with badge */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
    relative p-2 rounded-full 
    text-gray-600 hover:text-gray-900 
    hover:bg-gray-100/80 
    active:bg-gray-200 
    transition-all duration-150
  `}
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-600" />

        {count > 0 && (
          <span
            className="
      absolute -top-0.5 -right-0.5
      w-[15px] h-[15px]
      flex items-center justify-center
      rounded-full bg-red-500
      text-white text-[9px] font-bold
      ring-2 ring-white
      shadow-sm
    "
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-0 z-50 flex items-center  justify-center p-4">
            <div
              className="
                bg-white rounded-xl shadow-2xl 
                  max-h-[90vh] overflow-y-auto
                animate-in fade-in duration-200 w-2xl
              "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-[var(--border-light)] ">
                <div className="">
                  <h2 className="text-xl text-[var(--text-main)]/90 font-heading font-semibold">
                    Collaboration Requests
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)]/75 font-medium">
                    After accepting the collaboration request you will be able
                    to access the folder.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center h-8 w-8"
                  aria-label="Close"
                >
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>

              <div className="p-5">
                <CollaborationRequests
                  // Optional: pass callback to update count when accepting/rejecting
                  onRequestHandled={() => setCount((c) => Math.max(0, c - 1))}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
