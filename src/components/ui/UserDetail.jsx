import React, { useState, useRef, useEffect } from "react";
import { FaRegUser } from "react-icons/fa6";
import {
  FiLogOut,
  FiSettings,
  FiUser,
  FiChevronRight,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import LogoutButton from "./LogoutButton";
import CollaborationRequests from "./CollaborationRequests";
import { useProfile } from "../../utils/useProfile";

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

const UserDetail = () => {
  const [isOpen, setIsOpen] = useState(false); // Dropdown state
  const [isModalOpen, setIsModalOpen] = useState(false); // Popup state
  const dropdownRef = useRef(null);
  const { profile, loading } = useProfile();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Helper to open modal and close dropdown
  const handleOpenRequests = () => {
    setIsModalOpen(true);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* --- TRIGGER BUTTON --- */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center p-2 transition-all duration-200 "
      >
        <FaRegUser size={18} className="text-gray-600" />
      </button>

      {/* --- DROPDOWN MENU --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Invisible backdrop to capture clicks for the dropdown specifically */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden z-50 origin-top-right"
            >
              {/* User Profile Header */}
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 text-white shadow-md shadow-blue-200">
                    <span className="text-sm font-bold tracking-tighter">
                      {loading
                        ? "..."
                        : `${profile?.first_name?.[0] || ""}${
                            profile?.last_name?.[0] || ""
                          }`}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {loading ? (
                      <div className="animate-pulse flex flex-col gap-2">
                        <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        <div className="h-2 w-32 bg-gray-200 rounded"></div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {profile?.email}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu Links */}
              <div className="p-2">
                <button
                  onClick={handleOpenRequests}
                  className="group w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FiUser className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    Collaboration Requests
                  </div>
                  <FiChevronRight className="w-3 h-3 text-gray-300 group-hover:text-gray-400" />
                </button>

                <button className="group w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <FiSettings className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    Account Preferences
                  </div>
                  <FiChevronRight className="w-3 h-3 text-gray-300 group-hover:text-gray-400" />
                </button>

                <div className="my-1 border-t border-gray-100" />
                <LogoutButton />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- COLLABORATION REQUESTS MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Dark Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              

              {/* Modal Body */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <CollaborationRequests />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDetail;
