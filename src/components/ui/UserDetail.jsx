import React, { useState, useRef, useEffect } from "react";
import { FaRegUser } from "react-icons/fa6";
import { FiLogOut, FiSettings, FiUser, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import LogoutButton from "./LogoutButton";

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

const UserDetail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- FALSE DATA ---
  const user = {
    name: "Alex",
    surname: "Rivers",
    email: "alex.rivers@design.io",
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
      >
        <FaRegUser size={18} className="text-gray-600" />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-gray-200 shadow-xl shadow-gray-200/50 overflow-hidden z-50 origin-top-right"
          >
            {/* User Profile Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 text-white shadow-md shadow-blue-200">
                  <span className="text-sm font-bold tracking-tighter">
                    {user.name[0]}
                    {user.surname[0]}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user.name} {user.surname}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Links */}
            <div className="p-2">
              <button className="group w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <FiUser className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  Profile Settings
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

              <LogoutButton/>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible Background overlay to catch clicks */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default UserDetail;
