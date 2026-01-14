import React, { useState } from "react";
import { useProfile } from "../../utils/useProfile";
import { FiChevronDown, FiBell, FiLayout, FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth.service";

const UserDropdown = () => {
  const { profile, loading } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="w-9 h-9 rounded-full bg-neutral-200/70 animate-pulse" />
        <div className="hidden md:block space-y-1.5">
          <div className="h-3.5 w-28 bg-neutral-200/70 rounded animate-pulse" />
          <div className="h-2.5 w-20 bg-neutral-200/60 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex items-center gap-3 
          px-2.5 py-2 rounded-full 
          transition-all duration-300
          hover:bg-white/80 active:bg-white/60
        `}
      >
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <User size={17} className="text-white" strokeWidth={2.3} />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[2.5px] border-white shadow-sm" />
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{
            duration: 0.4,
            type: "spring",
            stiffness: 260,
            damping: 22,
          }}
          className="hidden md:block"
        >
          <FiChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-neutral-700 transition-colors" />
        </motion.div>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{
              duration: 0.22,
              type: "spring",
              damping: 24,
              stiffness: 320,
            }}
            className={`
              absolute right-0 mt-2 w-80 
              bg-white/96 backdrop-blur-xl 
              rounded-xl border border-neutral-200/60
              shadow-xl shadow-black/8 
              overflow-hidden z-50
            `}
          >
            {/* User Info Header */}
            <div className="px-5 pt-5 pb-4 border-b border-neutral-100/80">
              <div className="flex items-center gap-3.5">
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                    <User size={19} className="text-white" strokeWidth={2.2} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-neutral-900 tracking-tight truncate">
                    {profile.first_name} {profile.last_name}
                  </h3>
                  <p className="text-sm text-neutral-500 font-light mt-0.5 truncate">
                    {profile.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2 px-2">
              {/* Notifications */}
              <Link
                to="/notifications"
                className={`
                  group flex items-center gap-3.5 
                  px-3.5 py-2.5 rounded-lg 
                  text-neutral-700 hover:text-neutral-900
                  hover:bg-neutral-50/80 active:bg-neutral-100/70
                  transition-colors duration-200
                `}
              >
                <div className="w-8 h-8 rounded-md bg-neutral-100/70 flex items-center justify-center text-neutral-500 group-hover:bg-neutral-200/60 group-hover:text-neutral-700 transition-colors">
                  <FiBell size={17} />
                </div>
                <span className="font-medium text-sm tracking-tight">
                  Notifications
                </span>
              </Link>

              {/* Dashboard */}
              <Link
                to="/dashboard"
                className={`
                  group flex items-center gap-3.5 
                  px-3.5 py-2.5 rounded-lg 
                  text-neutral-700 hover:text-neutral-900
                  hover:bg-neutral-50/80 active:bg-neutral-100/70
                  transition-colors duration-200
                `}
              >
                <div className="w-8 h-8 rounded-md bg-neutral-100/70 flex items-center justify-center text-neutral-500 group-hover:bg-neutral-200/60 group-hover:text-neutral-700 transition-colors">
                  <FiLayout size={17} />
                </div>
                <span className="font-medium text-sm tracking-tight">
                  Dashboard
                </span>
              </Link>

              {/* Divider */}
              <div className="my-3 px-4">
                <div className="h-px bg-neutral-100" />
              </div>

              {/* Logout - Manual & Full width */}
              <button
                onClick={handleLogout}
                className={`
                  group flex items-center gap-3.5 w-full
                  px-3.5 py-2.5 rounded-lg 
                  text-red-600 hover:text-red-700
                  hover:bg-red-50/70 active:bg-red-100/70
                  transition-colors duration-200
                `}
              >
                <div className="w-8 h-8 rounded-md bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                  <FiLogOut size={17} />
                </div>
                <span className="font-medium text-sm tracking-tight">
                  Log out
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDropdown;
