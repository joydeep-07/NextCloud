import React, { useState } from "react";
import { useProfile } from "../../utils/useProfile";
import {
  FiUser,
  FiChevronDown,
  FiLogOut,
  FiSettings,
  FiBell,
  FiMail,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const UserDropdown = () => {
  const { profile, loading } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-3 px-4 py-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="hidden md:block">
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="px-4 py-2 text-gray-500 text-sm">Not signed in</div>;
  }

  return (
    <div className="relative">
      {/* User Avatar & Name */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
            {profile.first_name?.[0]?.toUpperCase() ||
              profile.email?.[0]?.toUpperCase() ||
              "U"}
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        <div className="hidden md:block text-left">
          <p className="font-medium text-gray-800 group-hover:text-gray-900">
            {profile.first_name || "User"} {profile.last_name || ""}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-[150px]">
            {profile.email || "user@example.com"}
          </p>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="hidden md:block"
        >
          <FiChevronDown className="w-4 h-4 text-gray-500" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            {/* User Info Section */}
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {profile.first_name?.[0]?.toUpperCase() ||
                    profile.email?.[0]?.toUpperCase() ||
                    "U"}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {profile.first_name || "User"} {profile.last_name || ""}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <FiMail className="w-3 h-3 mr-1" />
                    <span className="truncate max-w-[180px]">
                      {profile.email || "user@example.com"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <motion.a
                whileHover={{ x: 5 }}
                href="/profile"
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FiUser className="w-4 h-4" />
                <span className="font-medium">My Profile</span>
              </motion.a>

              <motion.a
                whileHover={{ x: 5 }}
                href="/notifications"
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FiBell className="w-4 h-4" />
                <span className="font-medium">Notifications</span>
                <span className="ml-auto px-2 py-1 text-xs bg-red-500 text-white rounded-full">
                  3
                </span>
              </motion.a>

              <motion.a
                whileHover={{ x: 5 }}
                href="/settings"
                className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <FiSettings className="w-4 h-4" />
                <span className="font-medium">Settings</span>
              </motion.a>

              {/* Divider */}
              <div className="h-px bg-gray-100 my-2"></div>

              {/* Logout Button */}
              <motion.button
                whileHover={{ x: 5 }}
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg hover:bg-red-50 text-gray-700 hover:text-red-600 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Version 1.0.0</span>
                <span className="px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-xs">
                  Premium
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default UserDropdown;
